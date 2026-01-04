// Mercado Pago Payment Service for PadelMaster
// Este archivo contiene la configuración para procesar pagos con Mercado Pago

const MERCADO_PAGO_PUBLIC_KEY = 'APP_USR-1062188237322463-010320-eedfc0c59fd646c15fd957f7141688b1-131807830';

// Inicializar Mercado Pago
function initMercadoPago() {
  const script = document.createElement('script');
  script.src = 'https://sdk.mercadopago.com/js/v2';
  document.head.appendChild(script);
  
  script.onload = function() {
    if (typeof MercadoPago !== 'undefined') {
      MercadoPago.setPublishableKey(MERCADO_PAGO_PUBLIC_KEY);
      console.log('Mercado Pago SDK initialized successfully');
    }
  };
}

// Crear preferencia de pago
function crearPreferenciaMP(datosReserva) {
  return {
    items: [
      {
        id: 'turno_padel_' + Date.now(),
        title: `Reserva - ${datosReserva.cancha}`,
        description: `${datosReserva.fecha} ${datosReserva.hora} - ${datosReserva.duracion} min`,
        quantity: 1,
        currency_id: 'ARS',
        unit_price: parseFloat(datosReserva.precio)
      }
    ],
    payer: {
      name: datosReserva.nombre,
      email: datosReserva.email,
      phone: {
        area_code: '54',
        number: datosReserva.telefono
      }
    },
    back_urls: {
      success: window.location.origin + window.location.pathname + '?estado=success',
      failure: window.location.origin + window.location.pathname + '?estado=failure',
      pending: window.location.origin + window.location.pathname + '?estado=pending'
    },
    auto_return: 'approved',
    notification_url: 'https://webhook.site/tu-webhook-aqui',
    external_reference: `reserva_${Date.now()}`,
    expires: false
  };
}

// Redirigir a Mercado Pago
function redirigirAlPago(datosReserva) {
  try {
    const preferencia = crearPreferenciaMP(datosReserva);
    
    // Usar el SDK de Mercado Pago para crear la preferencia
    if (typeof MercadoPago !== 'undefined') {
      // Crear un elemento de checkout
      const checkoutButton = document.createElement('script');
      checkoutButton.src = 'https://www.mercadopago.com.ar/integrations/web-checkout/';
      
      // Simular redirección a Mercado Pago
      const linkPago = `https://www.mercadopago.com.ar/checkout/preview?pref_id=${encodeURIComponent(JSON.stringify(preferencia))}`;
      
      // Guardar datos en localStorage antes de redirigir
      localStorage.setItem('ultima_reserva', JSON.stringify(datosReserva));
      localStorage.setItem('timestamp_pago', new Date().toISOString());
      
      // Redirigir al pago
      window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=test_pref_${Date.now()}`;
    } else {
      console.error('Mercado Pago SDK no está disponible');
    }
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    throw error;
  }
}

// Exportar funciones si es un módulo
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initMercadoPago, crearPreferenciaMP, redirigirAlPago };
}
