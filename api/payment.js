api/payment.jsimport axios from 'axios';

const MP_TOKEN = 'APP_USR-1062188237322463-010320-eedfc0c59fd646c15fd957f7141688b1-131807830';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { nombre, email, telefono, cancha, fecha, hora, duracion, jugadores, precio } = req.body;

    const preference = {
      items: [
        {
          title: `Turno Pádel - ${cancha}`,
          description: `${fecha} ${hora} - ${duracion} minutos - ${jugadores}`,
          unit_price: parseInt(precio),
          quantity: 1,
          currency_id: 'ARS'
        }
      ],
      payer: {
        name: nombre,
        email: email,
        phone: {
          area_code: '54',
          number: telefono.replace(/\D/g, '').slice(-10)
        }
      },
      back_urls: {
        success: 'https://pumpkinhead94.github.io/padel-turnos/?status=success',
        failure: 'https://pumpkinhead94.github.io/padel-turnos/?status=failure',
        pending: 'https://pumpkinhead94.github.io/padel-turnos/?status=pending'
      },
      auto_return: 'approved',
      external_reference: `turno_${Date.now()}`,
      notification_url: 'https://padel-turnos.vercel.app/api/webhook'
    };

    const response = await axios.post(
      'https://api.mercadopago.com/checkout/preferences',
      preference,
      {
        headers: {
          'Authorization': `Bearer ${MP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return res.status(200).json({ 
      init_point: response.data.init_point,
      preference_id: response.data.id
    });
  } catch (error) {
    console.error('Mercado Pago Error:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: 'Error creating payment preference',
      details: error.message
    });
  }
};
