const https = require('https');
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  // Handle preflight requests (OPTIONS)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  // Validate POST method
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const preference = {
      items: [
        {
          id: `reserva_${Date.now()}`,
          title: `Reserva Padel - ${data.cancha}`,
          description: `${data.duracion} min para ${data.jugadores} jugadores`,
          quantity: 1,
          unit_price: parseFloat(data.monto),
          currency_id: 'ARS'
        }
      ],
      payer: {
        name: data.nombre,
        email: data.email,
        phone: {
          area_code: '54',
          number: data.telefono
        }
      },
      back_urls: {
        success: 'https://sparkly-cendol-01012c.netlify.app/',
        failure: 'https://sparkly-cendol-01012c.netlify.app/',
        pending: 'https://sparkly-cendol-01012c.netlify.app/'
      },
      auto_return: 'approved',
      metadata: {
        fecha: data.fecha,
        hora: data.hora
      }
    };

    const postData = JSON.stringify(preference);

    return new Promise((resolve) => {
      const options = {
        hostname: 'api.mercadopago.com',
        port: 443,
        path: '/checkout/preferences',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'X-Idempotency-Key': `${data.nombre}-${Date.now()}`
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        res.on('end', () => {
          try {
            const response = JSON.parse(responseData);
            resolve({
              statusCode: 200,
              headers: corsHeaders,
              body: JSON.stringify({
                preference_id: response.id,
                init_point: response.init_point
              })
            });
          } catch (e) {
            resolve({
              statusCode: 500,
              headers: corsHeaders,
              body: JSON.stringify({ error: 'Parse error', raw: responseData })
            });
          }
        });
      });

      req.on('error', (e) => {
        resolve({
          statusCode: 500,
          headers: corsHeaders,
          body: JSON.stringify({ error: e.message })
        });
      });

      req.write(postData);
      req.end();
    });
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
};
