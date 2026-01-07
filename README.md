# 🎱 PadelMaster - Sistema de Gestión de Turnos de Pádel

App completa para reservar turnos de pádel con integración de **Mercado Pago**, soporte para múltiples métodos de pago, y gestión de reservas.

## ✨ Características

### Frontend
- ✅ Interfaz moderna y responsive
- ✅ Formulario de reserva completo (nombre, email, DNI, teléfono, fecha, horario)
- ✅ Selección de métodos de pago (Mercado Pago / Efectivo)
- ✅ Validación de formularios en tiempo real
- ✅ Panel de mis reservas con búsqueda por email
- ✅ Diseño responsive para móvil y desktop
- ✅ Notificaciones de éxito/error

### Backend
- ✅ API REST con Express.js
- ✅ Integración completa con Mercado Pago
- ✅ Manejo de webhooks para pagos confirmados
- ✅ Gestión de reservas (CRUD)
- ✅ Soporte para múltiples métodos de pago
- ✅ Email de confirmación
- ✅ Validación de disponibilidad de horarios
- ✅ CORS configurado y seguridad con Helmet

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18+ y npm 9+
- Cuenta de Mercado Pago (sandbox/producción)
- Git

### Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/PumpkinHead94/padel-turnos.git
cd padel-turnos
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:
```env
PORT=3000
NODE_ENV=development
MERCADOPAGO_ACCESS_TOKEN=tu_token_aqui
MERCADOPAGO_PUBLIC_KEY=tu_public_key_aqui
FRONTEND_URL=http://localhost:5173
WEBHOOK_URL=http://localhost:3000/webhook
```

4. **Obtener credenciales de Mercado Pago:**
   - Ir a [Mercado Pago Developers](https://www.mercadopago.com/developers)
   - Crear aplicación
   - Copiar Access Token y Public Key
   - Para desarrollo, usar credenciales de SANDBOX

5. **Ejecutar la aplicación:**

**Desarrollo:**
```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend (si usas Vite)
npm run dev:frontend
```

**Producción:**
```bash
npm start
```

## 📁 Estructura del Proyecto

```
padel-turnos/
├── index.html              # Frontend principal
├── server.js               # Backend Express
├── package.json            # Dependencias
├── .env.example            # Variables de entorno ejemplo
├── reservas.json           # Base datos (JSON)
├── README.md               # Este archivo
└── public/                 # Assets estáticos
```

## 🔌 API Endpoints

### POST /crear-preferencia
Crea una preferencia de pago en Mercado Pago.

**Request:**
```json
{
  "items": [{
    "title": "Reserva de Turno de Pádel",
    "quantity": 1,
    "unit_price": 500,
    "description": "2024-01-20 - 09:00"
  }],
  "payer": {
    "name": "Juan Perez",
    "email": "juan@example.com",
    "phone": { "number": "1234567890" },
    "identification": { "type": "DNI", "number": "12345678" }
  }
}
```

### POST /crear-reserva
Crea una nueva reserva.

**Request:**
```json
{
  "nombre": "Juan Perez",
  "email": "juan@example.com",
  "dni": "12345678",
  "telefono": "1234567890",
  "fecha": "2024-01-20",
  "horario": "09:00",
  "jugadores": "4",
  "metodo_pago": "mercadopago",
  "monto": 500
}
```

### GET /mis-reservas?email=usuario@example.com
Obtiene las reservas de un usuario.

### GET /disponibilidad?fecha=2024-01-20
Obtiene horarios disponibles para una fecha.

### POST /webhook
Recibe notificaciones de Mercado Pago.

## 💳 Flujo de Pago

### Mercado Pago
1. Usuario selecciona "Mercado Pago"
2. Completa el formulario
3. Se envía petición a `/crear-preferencia`
4. Se abre el wallet de Mercado Pago
5. Usuario completa el pago
6. Webhook recibe notificación
7. Reserva se marca como "confirmada"
8. Email de confirmación se envía

### Efectivo (En Local)
1. Usuario selecciona "Efectivo"
2. Completa el formulario
3. Se crea reserva con estado "pendiente_pago"
4. Se muestra número de referencia
5. Usuario paga en local
6. Personal confirma pago manualmente
7. Reserva se marca como "confirmada"

## 🔐 Seguridad

- ✅ CORS habilitado solo para dominio frontend
- ✅ Helmet para headers de seguridad
- ✅ Validación de inputs con express-validator
- ✅ Variables de entorno para credenciales sensibles
- ✅ Tokens de acceso Mercado Pago protegidos
- ✅ HTTPS recomendado en producción

## 📦 Dependencias Principales

- **Express.js** - Framework web
- **Mercado Pago** - Procesamiento de pagos
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Variables de entorno
- **Nodemailer** - Email (opcional)
- **Helmet** - Seguridad HTTP
- **Express-validator** - Validación

## 🚢 Deployment

### Vercel (Frontend)
```bash
npm run build
vercel deploy
```

### Heroku (Backend)
```bash
heroku login
heroku create padel-turnos-api
git push heroku main
```

### Variables de entorno en Heroku
```bash
heroku config:set MERCADOPAGO_ACCESS_TOKEN=tu_token
heroku config:set MERCADOPAGO_PUBLIC_KEY=tu_key
heroku config:set FRONTEND_URL=https://tu-frontend.vercel.app
```

## 📧 Email (Opcional)

Para habilitar envío de emails:

1. Registrarse en [SendGrid](https://sendgrid.com)
2. Obtener API Key
3. Agregar a `.env.local`:
```env
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=tu_api_key
EMAIL_FROM=noreply@padelmaster.com
```

## 🧪 Testing

### Credenciales de prueba Mercado Pago
- **Tarjeta VISA:** 4111 1111 1111 1111
- **Fecha:** 11/25
- **CVV:** 123
- **Titular:** APRO

## 🐛 Troubleshooting

### Error CORS
- Verificar `FRONTEND_URL` en `.env.local`
- Asegurar que coincide con la URL del frontend

### Error de Mercado Pago
- Verificar credenciales de sandbox
- Revisar que estés usando la Public Key en frontend

### Reservas no se guardan
- Verificar permisos de escritura en directorio
- Considerar usar MongoDB para producción

## 📝 Roadmap

- [ ] Autenticación con JWT
- [ ] Base de datos MongoDB
- [ ] Admin panel para gerenciar reservas
- [ ] Notificaciones SMS con Twilio
- [ ] Cálculo automático de disponibilidad
- [ ] Integración con más billeteras virtuales
- [ ] App móvil nativa

## 👨‍💻 Autor

**PumpkinHead94** - Desarrollador Full Stack

## 📄 Licencia

MIT License - Ver LICENSE file para detalles

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Abre un issue o pull request.

## 📞 Contacto

- GitHub: [@PumpkinHead94](https://github.com/PumpkinHead94)
- Issues: [GitHub Issues](https://github.com/PumpkinHead94/padel-turnos/issues)

---

**Hecho con ❤️ para la comunidad de pádel de Argentina** 🇦🇷


# Actualizacion: Token de Mercado Pago renovado
