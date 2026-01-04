// PadelMaster Backend Server - Node.js + Express
// Integración con Mercado Pago y gestión de reservas

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mercadopago = require('mercadopago');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const RESERVAS_FILE = path.join(__dirname, 'reservas.json');

// Configuración de Mercado Pago
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Funciones auxiliares
function cargarReservas() {
  try {
    if (fs.existsSync(RESERVAS_FILE)) {
      return JSON.parse(fs.readFileSync(RESERVAS_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error cargando reservas:', err);
  }
  return [];
}

function guardarReservas(reservas) {
  try {
    fs.writeFileSync(RESERVAS_FILE, JSON.stringify(reservas, null, 2));
  } catch (err) {
    console.error('Error guardando reservas:', err);
  }
}

function generarIdReserva() {
  return 'RES-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Endpoint: Crear preferencia de pago en Mercado Pago
app.post('/crear-preferencia', async (req, res) => {
  try {
    const { items, payer } = req.body;
    
    const preference = {
      items: items,
      payer: payer,
      back_urls: {
        success: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success`,
        failure: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/failure`,
        pending: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pending`
      },
      auto_return: 'approved',
      notification_url: process.env.WEBHOOK_URL || 'http://localhost:3000/webhook',
      payment_methods: {
        excluded_payment_methods: [],
        installments: 1
      }
    };
    
    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id, init_point: response.body.init_point });
  } catch (error) {
    console.error('Error creando preferencia:', error);
    res.status(500).json({ error: 'Error creando preferencia de pago' });
  }
});

// Endpoint: Crear reserva
app.post('/crear-reserva', async (req, res) => {
  try {
    const reservas = cargarReservas();
    const idReserva = generarIdReserva();
    
    const nuevaReserva = {
      id: idReserva,
      ...req.body,
      fecha_creacion: new Date().toISOString(),
      estado: req.body.metodo_pago === 'mercadopago' ? 'pendiente_pago' : 'pendiente_pago'
    };
    
    reservas.push(nuevaReserva);
    guardarReservas(reservas);
    
    // Enviar email de confirmación
    await enviarEmailConfirmacion(nuevaReserva);
    
    res.json({ success: true, id: idReserva, reserva: nuevaReserva });
  } catch (error) {
    console.error('Error creando reserva:', error);
    res.status(500).json({ error: 'Error creando reserva' });
  }
});

// Endpoint: Obtener reservas por email
app.get('/mis-reservas', (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ error: 'Email requerido' });
    }
    
    const reservas = cargarReservas();
    const misReservas = reservas.filter(r => r.email === email);
    
    res.json({ reservas: misReservas });
  } catch (error) {
    console.error('Error obteniendo reservas:', error);
    res.status(500).json({ error: 'Error obteniendo reservas' });
  }
});

// Webhook: Notificaciones de Mercado Pago
app.post('/webhook', async (req, res) => {
  try {
    const { data, type } = req.query;
    
    if (type === 'payment') {
      const payment = await mercadopago.payment.findById(data.id);
      
      if (payment.body.status === 'approved') {
        // Actualizar reserva a confirmada
        const reservas = cargarReservas();
        const reserva = reservas.find(r => r.mercadopago_payment_id === data.id);
        
        if (reserva) {
          reserva.estado = 'confirmada';
          reserva.fecha_pago = new Date().toISOString();
          guardarReservas(reservas);
          
          // Enviar email de confirmación
          await enviarEmailConfirmado(reserva);
        }
      }
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error en webhook:', error);
    res.status(200).send('OK');
  }
});

// Endpoint: Confirmar pago en efectivo
app.post('/confirmar-pago-efectivo', (req, res) => {
  try {
    const { idReserva, comprobante } = req.body;
    const reservas = cargarReservas();
    const reserva = reservas.find(r => r.id === idReserva);
    
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    reserva.estado = 'confirmada';
    reserva.comprobante_efectivo = comprobante;
    reserva.fecha_pago = new Date().toISOString();
    
    guardarReservas(reservas);
    res.json({ success: true, reserva });
  } catch (error) {
    console.error('Error confirmando pago:', error);
    res.status(500).json({ error: 'Error confirmando pago' });
  }
});

// Endpoint: Obtener disponibilidad de turnos
app.get('/disponibilidad', (req, res) => {
  try {
    const { fecha } = req.query;
    const reservas = cargarReservas();
    const horarios = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30'];
    
    const ocupados = reservas
      .filter(r => r.fecha === fecha && r.estado === 'confirmada')
      .map(r => r.horario);
    
    const disponibles = horarios.filter(h => !ocupados.includes(h));
    
    res.json({ disponibles, ocupados });
  } catch (error) {
    console.error('Error obteniendo disponibilidad:', error);
    res.status(500).json({ error: 'Error obteniendo disponibilidad' });
  }
});

// Función auxiliar: Enviar email
async function enviarEmailConfirmacion(reserva) {
  // TODO: Implementar con servicio de email (SendGrid, Nodemailer, etc.)
  console.log('Email de confirmación enviado a:', reserva.email);
}

async function enviarEmailConfirmado(reserva) {
  // TODO: Implementar con servicio de email
  console.log('Email de reserva confirmada enviado a:', reserva.email);
}

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🎱 PadelMaster Server ejecutándose en puerto ${PORT}`);
  console.log(`CORS habilitado para: ${process.env.FRONTEND_URL || '*'}`);
});

module.exports = app;
