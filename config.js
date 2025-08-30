// Configuración de EmailJS
// IMPORTANTE: Reemplaza estos valores con tus credenciales reales

const EMAILJS_CONFIG = {
    // ID del servicio de email (del PASO 2 de configuración)
    serviceId: 'service_4yx8mii',  // Ejemplo: 'service_abc123'
    
    // ID de la plantilla de email (del PASO 3 de configuración)
    templateId: 'template_fchd433',  // Ejemplo: 'template_xyz789'
    
    // Tu User ID público de EmailJS (del PASO 4 de configuración)
    userId: 'P44thkxE3SAFdoZUA',  // Ejemplo: 'user_def456'
    
    // Email de destino (donde se enviarán los reportes)
    toEmail: 'e.gzlzmesones@gmail.com, cristian26gonzalez@gmail.com'
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EMAILJS_CONFIG;
} 