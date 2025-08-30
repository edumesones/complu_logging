// CONFIGURACIÓN DE DESARROLLO LOCAL
// Este archivo contiene valores de ejemplo para desarrollo
// En producción, GitHub Actions crea config.prod.js con las credenciales reales

const EMAILJS_CONFIG = {
    // ID del servicio de email (del PASO 2 de configuración)
    serviceId: 'service_xxxxxxx',  // VALOR DE EJEMPLO - NO FUNCIONARÁ
    
    // ID de la plantilla de email (del PASO 3 de configuración)
    templateId: 'template_xxxxxxx',  // VALOR DE EJEMPLO - NO FUNCIONARÁ
    
    // Tu User ID público de EmailJS (del PASO 4 de configuración)
    userId: 'user_xxxxxxxxxxxxxxx',  // VALOR DE EJEMPLO - NO FUNCIONARÁ
    
    // Email de destino (donde se enviarán los reportes)
    toEmail: 'tu-email@gmail.com, otro-email@gmail.com'  // VALOR DE EJEMPLO - NO FUNCIONARÁ
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EMAILJS_CONFIG;
} 