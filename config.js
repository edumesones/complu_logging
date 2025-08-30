// Configuración de EmailJS
// IMPORTANTE: Las claves sensibles se cargan desde variables de entorno
// NO subir este archivo con claves reales a GitHub

const EMAILJS_CONFIG = {
    // ID del servicio de email (del PASO 2 de configuración)
    serviceId: process.env.EMAILJS_SERVICE_ID || 'service_4yx8mii',
    
    // ID de la plantilla de email (del PASO 3 de configuración)
    templateId: process.env.EMAILJS_TEMPLATE_ID || 'template_fchd433',
    
    // Tu User ID público de EmailJS (del PASO 4 de configuración)
    userId: process.env.EMAILJS_USER_ID || 'P44thkxE3SAFdoZUA',
    
    // Email de destino (donde se enviarán los reportes)
    toEmail: process.env.EMAILJS_TO_EMAIL || 'e.gzlzmesones@gmail.com, cristian26gonzalez@gmail.com'
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EMAILJS_CONFIG;
} 