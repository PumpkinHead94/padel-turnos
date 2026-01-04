const https = require('https');

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
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
        success: 'https://pumpkinhead94.github.io/padel-turnos/',
        failure: 'https://pumpkinhead94.github.io/padel-turnos/',
        pending: 'https://pumpkinhead94.github.io/padel-turnos/'
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
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify({
                preference_id: response.id,
                init_point: response.init_point
              })
            });
          } catch (e) {
            resolve({
              statusCode: 500,
              body: JSON.stringify({ error: 'Parse error', raw: responseData })
            });
          }
        });
      });

      req.on('error', (e) => {
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: e.message })
        });
      });

      req.write(postData);
      req.end();
    });
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
