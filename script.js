// Lista de jugadores
const jugadores = [
    'Fer', 'Antuene', 'Juan Muñoz', 'Iván', 'David', 'Manu', 'Fresnillo', 'Ricardo',
    'Jorge Fernández', 'Javi f', 'Mont', 'Bou', 'Lucas Pinto', 'José San Millán',
    'Edu', 'Nico Gonzalo', 'Aarón', 'Juan García'
];

// La configuración de EmailJS se carga desde config.js
// No declarar EMAILJS_CONFIG aquí para evitar conflictos

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Página cargada, verificando configuración...');
    
    // Verificar configuración EmailJS
    if (typeof EMAILJS_CONFIG !== 'undefined') {
        console.log('✅ EMAILJS_CONFIG cargado:', EMAILJS_CONFIG);
    } else {
        console.error('❌ EMAILJS_CONFIG no está definido');
    }
    
    // Verificar si es un nuevo día y limpiar datos si es necesario
    verificarNuevoDia();
    
    // Mostrar fecha actual
    mostrarFecha();
    
    // Inicializar tablas según la página
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'pc-favor.html') {
        inicializarTablaFavor();
        mostrarFechaEnPagina('currentDateFavor');
    } else if (currentPage === 'pc-contra.html') {
        inicializarTablaContra();
        mostrarFechaEnPagina('currentDateContra');
    } else if (currentPage === 'index.html' || currentPage === '') {
        // Página principal
        cargarDatosGuardados();
    }
    
    console.log('✅ Inicialización completada');
});

// Mostrar fecha actual
function mostrarFecha() {
    const fechaElement = document.getElementById('currentDate');
    if (fechaElement) {
        const fecha = new Date();
        const opciones = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        fechaElement.textContent = fecha.toLocaleDateString('es-ES', opciones);
    }
}

// Mostrar fecha en páginas específicas
function mostrarFechaEnPagina(elementId) {
    const fechaElement = document.getElementById(elementId);
    if (fechaElement) {
        const fecha = new Date();
        const opciones = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        fechaElement.textContent = fecha.toLocaleDateString('es-ES', opciones);
    }
}

// Verificar si es un nuevo día y limpiar datos si es necesario
function verificarNuevoDia() {
    const fechaActual = new Date().toDateString();
    const ultimaFecha = localStorage.getItem('ultima_fecha');
    
    console.log('🔍 Verificando fecha:', { fechaActual, ultimaFecha });
    
    if (ultimaFecha && ultimaFecha !== fechaActual) {
        console.log('🆕 Nuevo día detectado, limpiando datos...');
        
        // Limpiar todos los datos de estadísticas
        const clavesParaLimpiar = [];
        
        // Limpiar datos PC A FAVOR
        jugadores.forEach(jugador => {
            ['SACA_BIEN', 'SACA_MAL', 'PARA_BIEN', 'PARA_MAL', 'GOL', 'TIRO_PORTERIA', 'TIRO_FUERA'].forEach(columna => {
                clavesParaLimpiar.push(`favor_${jugador}_${columna}`);
            });
        });
        
        // Limpiar datos PC EN CONTRA
        jugadores.forEach(jugador => {
            ['PENALTY', 'PENALTY_TONTO'].forEach(columna => {
                clavesParaLimpiar.push(`contra_${jugador}_${columna}`);
            });
        });
        
        // Eliminar todas las claves
        clavesParaLimpiar.forEach(clave => {
            localStorage.removeItem(clave);
        });
        
        console.log('🧹 Datos limpiados para el nuevo día');
        
        // Mostrar notificación al usuario
        if (confirm('🆕 Es un nuevo día. ¿Quieres limpiar todos los contadores para empezar de nuevo?')) {
            location.reload();
        }
    }
    
    // Guardar la fecha actual
    localStorage.setItem('ultima_fecha', fechaActual);
}

// Inicializar tabla PC A FAVOR
function inicializarTablaFavor() {
    const tbody = document.getElementById('favorTableBody');
    if (!tbody) return;
    
    const columnas = ['SACA_BIEN', 'SACA_MAL', 'PARA_BIEN', 'PARA_MAL', 'GOL', 'TIRO_PORTERIA', 'TIRO_FUERA'];
    
    jugadores.forEach(jugador => {
        const row = document.createElement('tr');
        
        // Celda del jugador
        const jugadorCell = document.createElement('td');
        jugadorCell.textContent = jugador;
        row.appendChild(jugadorCell);
        
        // Celdas para cada estadística
        columnas.forEach(columna => {
            const cell = document.createElement('td');
            const counterContainer = document.createElement('div');
            counterContainer.className = 'counter-container';
            
            // Botón menos
            const btnMenos = document.createElement('button');
            btnMenos.className = 'counter-btn minus';
            btnMenos.textContent = '-';
            btnMenos.onclick = () => cambiarContador(jugador, columna, -1, 'favor');
            
            // Valor del contador
            const valor = document.createElement('span');
            valor.className = 'counter-value';
            valor.id = `favor_${jugador}_${columna}`;
            valor.textContent = obtenerValor(jugador, columna, 'favor');
            
            // Botón más
            const btnMas = document.createElement('button');
            btnMas.className = 'counter-btn plus';
            btnMas.textContent = '+';
            btnMas.onclick = () => cambiarContador(jugador, columna, 1, 'favor');
            
            counterContainer.appendChild(btnMenos);
            counterContainer.appendChild(valor);
            counterContainer.appendChild(btnMas);
            cell.appendChild(counterContainer);
            row.appendChild(cell);
        });
        
        tbody.appendChild(row);
    });
}

// Inicializar tabla PC EN CONTRA
function inicializarTablaContra() {
    const tbody = document.getElementById('contraTableBody');
    if (!tbody) return;
    
    const columnas = ['PENALTY', 'PENALTY_TONTO'];
    
    jugadores.forEach(jugador => {
        const row = document.createElement('tr');
        
        // Celda del jugador
        const jugadorCell = document.createElement('td');
        jugadorCell.textContent = jugador;
        row.appendChild(jugadorCell);
        
        // Celdas para cada estadística
        columnas.forEach(columna => {
            const cell = document.createElement('td');
            const counterContainer = document.createElement('div');
            counterContainer.className = 'counter-container';
            
            // Botón menos
            const btnMenos = document.createElement('button');
            btnMenos.className = 'counter-btn minus';
            btnMenos.textContent = '-';
            btnMenos.onclick = () => cambiarContador(jugador, columna, -1, 'contra');
            
            // Valor del contador
            const valor = document.createElement('span');
            valor.className = 'counter-value';
            valor.id = `contra_${jugador}_${columna}`;
            valor.textContent = obtenerValor(jugador, columna, 'contra');
            
            // Botón más
            const btnMas = document.createElement('button');
            btnMas.className = 'counter-btn plus';
            btnMas.textContent = '+';
            btnMas.onclick = () => cambiarContador(jugador, columna, 1, 'contra');
            
            counterContainer.appendChild(btnMenos);
            counterContainer.appendChild(valor);
            counterContainer.appendChild(btnMas);
            cell.appendChild(counterContainer);
            row.appendChild(cell);
        });
        
        tbody.appendChild(row);
    });
}

// Cambiar contador
function cambiarContador(jugador, columna, cambio, tipo) {
    const valorActual = obtenerValor(jugador, columna, tipo);
    const nuevoValor = Math.max(0, valorActual + cambio);
    
    // Guardar en localStorage
    const clave = `${tipo}_${jugador}_${columna}`;
    localStorage.setItem(clave, nuevoValor.toString());
    
    // Actualizar en la interfaz
    const elemento = document.getElementById(`${tipo}_${jugador}_${columna}`);
    if (elemento) {
        elemento.textContent = nuevoValor;
    }
}

// Obtener valor del contador
function obtenerValor(jugador, columna, tipo) {
    const clave = `${tipo}_${jugador}_${columna}`;
    return parseInt(localStorage.getItem(clave) || '0');
}

// Guardar datos PC A FAVOR
function saveFavorData() {
    // Los datos se guardan automáticamente en localStorage
    alert('Datos guardados automáticamente');
}

// Guardar datos PC EN CONTRA
function saveContraData() {
    // Los datos se guardan automáticamente en localStorage
    alert('Datos guardados automáticamente');
}

// Cargar datos guardados
function cargarDatosGuardados() {
    // Esta función se ejecuta en la página principal
    // Los datos se cargan automáticamente desde localStorage
}

// Enviar email con los datos
async function sendEmail() {
    try {
        // Verificar que EmailJS esté disponible
        if (typeof emailjs === 'undefined') {
            alert('❌ Error: EmailJS no está cargado. Recarga la página e inténtalo de nuevo.');
            return;
        }

        // Verificar si EmailJS está configurado
        const config = EMAILJS_CONFIG;
        if (!config || config.serviceId === 'service_4yx8mii') {
            alert('⚠️ IMPORTANTE: Necesitas configurar EmailJS primero.\n\n1. Ve a https://www.emailjs.com/\n2. Crea una cuenta gratuita\n3. Configura un servicio de email\n4. Crea una plantilla\n5. Actualiza las credenciales en config.js con tus valores reales');
            return;
        }

        // Mostrar información de debug
        console.log('🔍 Configuración EmailJS:', config);
        
        // Inicializar EmailJS
        emailjs.init(config.userId);
        console.log('✅ EmailJS inicializado');
        
        // Recopilar datos
        const datos = recopilarDatos();
        console.log('📊 Datos recopilados:', datos);
        
        // Enviar email
        console.log('📧 Enviando email...');
        
        // Debug: mostrar el HTML que se está enviando
        const tablaFavorHTML = crearTablaFavorHTML(datos);
        const tablaContraHTML = crearTablaContraHTML(datos);
        const resumenHTML = crearResumenHTML(datos);
        
        console.log('🔍 HTML PC A FAVOR:', tablaFavorHTML);
        console.log('🔍 HTML PC EN CONTRA:', tablaContraHTML);
        console.log('🔍 HTML Resumen:', resumenHTML);
        
        const response = await emailjs.send(
            config.serviceId,
            config.templateId,
            {
                fecha: datos.fecha,
                tabla_favor: tablaFavorHTML,
                tabla_contra: tablaContraHTML,
                resumen: resumenHTML
            }
        );
        
        console.log('✅ Respuesta EmailJS:', response);
        alert('✅ Email enviado correctamente');
        
    } catch (error) {
        console.error('❌ Error al enviar email:', error);
        alert(`❌ Error al enviar email:\n\n${error.message}\n\nRevisa la consola para más detalles.`);
    }
}

// Recopilar todos los datos
function recopilarDatos() {
    const datos = {
        fecha: new Date().toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        pcFavor: {},
        pcContra: {}
    };
    
    // Recopilar datos PC A FAVOR
    const columnasFavor = ['SACA_BIEN', 'SACA_MAL', 'PARA_BIEN', 'PARA_MAL', 'GOL', 'TIRO_PORTERIA', 'TIRO_FUERA'];
    jugadores.forEach(jugador => {
        datos.pcFavor[jugador] = {};
        columnasFavor.forEach(columna => {
            datos.pcFavor[jugador][columna] = obtenerValor(jugador, columna, 'favor');
        });
    });
    
    // Recopilar datos PC EN CONTRA
    const columnasContra = ['PENALTY', 'PENALTY_TONTO'];
    jugadores.forEach(jugador => {
        datos.pcContra[jugador] = {};
        columnasContra.forEach(columna => {
            datos.pcContra[jugador][columna] = obtenerValor(jugador, columna, 'contra');
        });
    });
    
    return datos;
}

// Esta función ya no se usa, se reemplazó por las funciones específicas
// crearTablaFavorHTML, crearTablaContraHTML y crearResumenHTML

// Función para limpiar todos los datos (útil para testing)
function limpiarDatos() {
    if (confirm('¿Estás seguro de que quieres limpiar todos los datos?')) {
        localStorage.clear();
        location.reload();
    }
}

// Función para limpiar datos manualmente
function limpiarDatosManual() {
    if (confirm('🗑️ ¿Estás seguro de que quieres limpiar TODOS los datos?\n\nEsto eliminará todas las estadísticas registradas.')) {
        // Limpiar solo los datos de estadísticas, no la fecha
        const ultimaFecha = localStorage.getItem('ultima_fecha');
        
        // Limpiar todos los datos de estadísticas
        const clavesParaLimpiar = [];
        
        // Limpiar datos PC A FAVOR
        jugadores.forEach(jugador => {
            ['SACA_BIEN', 'SACA_MAL', 'PARA_BIEN', 'PARA_MAL', 'GOL', 'TIRO_PORTERIA', 'TIRO_FUERA'].forEach(columna => {
                clavesParaLimpiar.push(`favor_${jugador}_${columna}`);
            });
        });
        
        // Limpiar datos PC EN CONTRA
        jugadores.forEach(jugador => {
            ['PENALTY', 'PENALTY_TONTO'].forEach(columna => {
                clavesParaLimpiar.push(`contra_${jugador}_${columna}`);
            });
        });
        
        // Eliminar todas las claves
        clavesParaLimpiar.forEach(clave => {
            localStorage.removeItem(clave);
        });
        
        // Restaurar la fecha
        if (ultimaFecha) {
            localStorage.setItem('ultima_fecha', ultimaFecha);
        }
        
        // Limpiar también la fecha para forzar reinicio
        localStorage.removeItem('ultima_fecha');
        
        alert('✅ Todos los datos han sido limpiados. La página se recargará.');
        location.reload();
    }
}

// Función para exportar datos como JSON
function exportarDatos() {
    const datos = recopilarDatos();
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complu_logging_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Crear tabla HTML para PC A FAVOR
function crearTablaFavorHTML(datos) {
    // Filtrar solo jugadores con estadísticas > 0
    const jugadoresConEstadisticas = jugadores.filter(jugador => {
        const columnas = ['SACA_BIEN', 'SACA_MAL', 'PARA_BIEN', 'PARA_MAL', 'GOL', 'TIRO_PORTERIA', 'TIRO_FUERA'];
        return columnas.some(columna => datos.pcFavor[jugador][columna] > 0);
    });
    
    // Si no hay estadísticas, mostrar mensaje
    if (jugadoresConEstadisticas.length === 0) {
        return '<p style="color: #666; font-style: italic;">No hay estadísticas registradas para PC A FAVOR.</p>';
    }
    
    let html = `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 12px;">
            <thead>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 6px; text-align: left; background-color: #f8f9fa; font-weight: bold; min-width: 120px;">Jugador</th>
                    <th style="border: 1px solid #ddd; padding: 6px; text-align: center; background-color: #f8f9fa; font-weight: bold;">SACA_BIEN</th>
                    <th style="border: 1px solid #ddd; padding: 6px; text-align: center; background-color: #f8f9fa; font-weight: bold;">SACA_MAL</th>
                    <th style="border: 1px solid #ddd; padding: 6px; text-align: center; background-color: #f8f9fa; font-weight: bold;">PARA_BIEN</th>
                    <th style="border: 1px solid #ddd; padding: 6px; text-align: center; background-color: #f8f9fa; font-weight: bold;">PARA_MAL</th>
                    <th style="border: 1px solid #ddd; padding: 6px; text-align: center; background-color: #f8f9fa; font-weight: bold;">GOL</th>
                    <th style="border: 1px solid #ddd; padding: 6px; text-align: center; background-color: #f8f9fa; font-weight: bold;">TIRO_PORTERIA</th>
                    <th style="border: 1px solid #ddd; padding: 6px; text-align: center; background-color: #f8f9fa; font-weight: bold;">TIRO_FUERA</th>
                </tr>
            </thead>
            <tbody>`;
    
    // Agregar filas de jugadores PC A FAVOR (solo los que tienen estadísticas)
    let totalesFavor = {
        SACA_BIEN: 0, SACA_MAL: 0, PARA_BIEN: 0, PARA_MAL: 0,
        GOL: 0, TIRO_PORTERIA: 0, TIRO_FUERA: 0
    };
    
    jugadoresConEstadisticas.forEach(jugador => {
        html += `<tr><td style="border: 1px solid #ddd; padding: 6px; text-align: left; font-weight: bold; min-width: 120px;">${jugador}</td>`;
        
        ['SACA_BIEN', 'SACA_MAL', 'PARA_BIEN', 'PARA_MAL', 'GOL', 'TIRO_PORTERIA', 'TIRO_FUERA'].forEach(columna => {
            const valor = datos.pcFavor[jugador][columna];
            totalesFavor[columna] += valor;
            html += `<td style="border: 1px solid #ddd; padding: 6px; text-align: center;">${valor}</td>`;
        });
        
        html += '</tr>';
    });
    
    // Agregar fila de totales PC A FAVOR
    html += `<tr style="background-color: #e8f5e8; font-weight: bold;">
        <td style="border: 1px solid #ddd; padding: 6px; text-align: left; font-weight: bold; min-width: 120px;">TOTALES</td>
        <td style="border: 1px solid #ddd; padding: 6px; text-align: center; font-weight: bold;">${totalesFavor.SACA_BIEN}</td>
        <td style="border: 1px solid #ddd; padding: 6px; text-align: center; font-weight: bold;">${totalesFavor.SACA_MAL}</td>
        <td style="border: 1px solid #ddd; padding: 6px; text-align: center; font-weight: bold;">${totalesFavor.PARA_BIEN}</td>
        <td style="border: 1px solid #ddd; padding: 6px; text-align: center; font-weight: bold;">${totalesFavor.PARA_MAL}</td>
        <td style="border: 1px solid #ddd; padding: 6px; text-align: center; font-weight: bold;">${totalesFavor.GOL}</td>
        <td style="border: 1px solid #ddd; padding: 6px; text-align: center; font-weight: bold;">${totalesFavor.TIRO_PORTERIA}</td>
        <td style="border: 1px solid #ddd; padding: 6px; text-align: center; font-weight: bold;">${totalesFavor.TIRO_FUERA}</td>
    </tr>`;
    
    html += '</tbody></table>';
    return html;
}

// Crear tabla HTML para PC EN CONTRA
function crearTablaContraHTML(datos) {
    // Filtrar solo jugadores con estadísticas > 0
    const jugadoresConEstadisticas = jugadores.filter(jugador => {
        const columnas = ['PENALTY', 'PENALTY_TONTO'];
        return columnas.some(columna => datos.pcContra[jugador][columna] > 0);
    });
    
    // Si no hay estadísticas, mostrar mensaje
    if (jugadoresConEstadisticas.length === 0) {
        return '<p style="color: #666; font-style: italic;">No hay estadísticas registradas para PC EN CONTRA.</p>';
    }
    
    // Crear tabla simple para prueba
    let html = '<table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse:collapse;">';
    html += '<thead><tr style="background-color:#f8f9fa;">';
    html += '<th>Jugador</th>';
    html += '<th>PENALTY</th>';
    html += '<th>PENALTY_TONTO</th>';
    html += '</tr></thead><tbody>';
    
    // Agregar filas de jugadores PC EN CONTRA (solo los que tienen estadísticas)
    let totalesContra = { PENALTY: 0, PENALTY_TONTO: 0 };
    
    jugadoresConEstadisticas.forEach(jugador => {
        html += '<tr><td style="font-weight:bold;">' + jugador + '</td>';
        
        ['PENALTY', 'PENALTY_TONTO'].forEach(columna => {
            const valor = datos.pcContra[jugador][columna];
            totalesContra[columna] += valor;
            html += '<td>' + valor + '</td>';
        });
        
        html += '</tr>';
    });
    
    // Agregar fila de totales PC EN CONTRA
    html += '<tr style="background-color:#e8f5e8; font-weight:bold;">';
    html += '<td>TOTALES</td>';
    html += '<td>' + totalesContra.PENALTY + '</td>';
    html += '<td>' + totalesContra.PENALTY_TONTO + '</td>';
    html += '</tr>';
    
    html += '</tbody></table>';
    return html;
}

// Crear resumen HTML
function crearResumenHTML(datos) {
    // Calcular totales
    let totalesFavor = {
        SACA_BIEN: 0, SACA_MAL: 0, PARA_BIEN: 0, PARA_MAL: 0,
        GOL: 0, TIRO_PORTERIA: 0, TIRO_FUERA: 0
    };
    
    let totalesContra = { PENALTY: 0, PENALTY_TONTO: 0 };
    
    jugadores.forEach(jugador => {
        ['SACA_BIEN', 'SACA_MAL', 'PARA_BIEN', 'PARA_MAL', 'GOL', 'TIRO_PORTERIA', 'TIRO_FUERA'].forEach(columna => {
            totalesFavor[columna] += datos.pcFavor[jugador][columna];
        });
        
        ['PENALTY', 'PENALTY_TONTO'].forEach(columna => {
            totalesContra[columna] += datos.pcContra[jugador][columna];
        });
    });
    
    // Filtrar solo estadísticas > 0
    const estadisticasRelevantes = [];
    
    if (totalesFavor.GOL > 0) estadisticasRelevantes.push(['Total Goles', totalesFavor.GOL]);
    if (totalesFavor.TIRO_PORTERIA > 0) estadisticasRelevantes.push(['Total Tiros a Portería', totalesFavor.TIRO_PORTERIA]);
    if (totalesFavor.SACA_BIEN > 0) estadisticasRelevantes.push(['Total Saques Buenos', totalesFavor.SACA_BIEN]);
    if (totalesFavor.PARA_BIEN > 0) estadisticasRelevantes.push(['Total Paradas Buenos', totalesFavor.PARA_BIEN]);
    if (totalesContra.PENALTY > 0) estadisticasRelevantes.push(['Total Penalties', totalesContra.PENALTY]);
    if (totalesContra.PENALTY_TONTO > 0) estadisticasRelevantes.push(['Total Penalties Tontos', totalesContra.PENALTY_TONTO]);
    
    // Si no hay estadísticas relevantes, mostrar mensaje
    if (estadisticasRelevantes.length === 0) {
        return '<p style="color: #666; font-style: italic;">No hay estadísticas relevantes para mostrar en el resumen.</p>';
    }
    
    // Crear tabla simple para resumen
    let html = '<table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse:collapse;">';
    html += '<thead><tr style="background-color:#f8f9fa;">';
    html += '<th>Estadística</th>';
    html += '<th>Valor</th>';
    html += '</tr></thead><tbody>';
    
    estadisticasRelevantes.forEach(([nombre, valor]) => {
        html += '<tr>';
        html += '<td style="font-weight:bold;">' + nombre + '</td>';
        html += '<td>' + valor + '</td>';
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    return html;
} 