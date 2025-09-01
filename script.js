// Lista de jugadores
const jugadores = [
    'Fer', 'Antuene', 'Juan Muñoz', 'Iván', 'David', 'Manu', 'Fresnillo', 'Ricardo',
    'Jorge Fernández', 'Javi f', 'Mont', 'Bou', 'Lucas Pinto', 'José San Millán',
    'Edu', 'Nico Gonzalo', 'Aarón', 'Juan García'
];

// Columnas para PC A FAVOR
const columnas = ['SACA_BIEN', 'SACA_MAL', 'PARA_BIEN', 'PARA_MAL', 'GOL', 'TIRO_PORTERIA', 'TIRO_FUERA'];

// Columnas para PC EN CONTRA
const columnasContra = ['PENALTY', 'PENALTY_TONTO'];

// Verificar si Supabase está disponible
function isSupabaseAvailable() {
    try {
        const disponible = typeof supabase !== 'undefined' && supabase !== null;
        console.log('🔍 Supabase disponible:', disponible);
        if (disponible) {
            console.log('✅ Supabase inicializado');
            console.log('✅ Supabase URL:', supabase.supabaseUrl);
        } else {
            console.log('❌ Supabase no disponible');
            console.log('❌ typeof supabase:', typeof supabase);
            console.log('❌ supabase value:', supabase);
        }
        return disponible;
    } catch (error) {
        console.log('❌ Error verificando Supabase:', error);
        return false;
    }
}

// Mostrar indicador de sincronización
function mostrarSyncIndicator() {
    const indicator = document.getElementById('syncIndicator');
    if (indicator) {
        indicator.classList.add('syncing');
    }
}

// Ocultar indicador de sincronización
function ocultarSyncIndicator() {
    const indicator = document.getElementById('syncIndicator');
    if (indicator) {
        indicator.classList.remove('syncing');
    }
}

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
    
    // Esperar un poco para que Supabase se cargue completamente
    setTimeout(() => {
        // Verificar Supabase
        console.log('🔍 Verificando Supabase...');
        try {
            console.log('🔍 typeof supabase:', typeof supabase);
            console.log('🔍 supabase object:', supabase);
            
            if (typeof supabase !== 'undefined' && supabase) {
                console.log('✅ Supabase SDK cargado');
                console.log('✅ Supabase URL:', supabase.supabaseUrl);
                if (typeof syncFavorData === 'function') {
                    console.log('✅ Función syncFavorData disponible');
                } else {
                    console.error('❌ Función syncFavorData NO disponible');
                }
                if (typeof syncContraData === 'function') {
                    console.log('✅ Función syncContraData disponible');
                } else {
                    console.error('❌ Función syncContraData NO disponible');
                }
            } else {
                console.error('❌ Supabase SDK NO cargado');
                console.log('⚠️ La app funcionará solo con localStorage');
                
                // Verificar si los scripts se cargaron
                const scripts = document.querySelectorAll('script[src*="supabase"]');
                console.log('📜 Scripts de Supabase encontrados:', scripts.length);
                scripts.forEach((script, index) => {
                    console.log(`📜 Script ${index + 1}:`, script.src);
                });
            }
        } catch (error) {
            console.error('❌ Error verificando Supabase:', error);
            console.log('⚠️ La app funcionará solo con localStorage');
        }
    }, 1000); // Esperar 1 segundo
    
    // Verificar si es un nuevo día
    verificarNuevoDia();
    
    // Cargar datos guardados
    cargarDatosGuardados();
    
    // Cargar datos desde Supabase (sincronización)
    setTimeout(() => {
        cargarDatosDesdeSupabase();
    }, 2000); // Esperar 2 segundos para que Supabase se inicialice
    
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
    } else if (currentPage === 'ana.html') {
        mostrarFechaEnPagina('currentDateAna');
        cargarDatosAna();
    } else if (currentPage === 'maxi.html') {
        mostrarFechaEnPagina('currentDateMaxi');
        cargarDatosMaxi();
    } else if (currentPage === 'index.html' || currentPage === '') {
        // Página principal
        cargarDatosGuardados();
    }
    
    // Función para cargar datos desde Supabase (nueva versión)
    async function cargarDatosDesdeSupabase() {
        await cargarTodosLosDatosDesdeSupabase();
    }
    
    // Función para actualizar la tabla PC A FAVOR
    function actualizarTablaFavor() {
        jugadores.forEach(jugador => {
            columnas.forEach(columna => {
                const cacheKey = `favor_${jugador}_${columna}`;
                const valor = valoresCache[cacheKey] || 0;
                const elemento = document.getElementById(`favor_${jugador}_${columna}`);
                if (elemento) {
                    elemento.textContent = valor;
                }
            });
        });
    }
    
    // Función para actualizar la tabla PC EN CONTRA
    function actualizarTablaContra() {
        jugadores.forEach(jugador => {
            columnasContra.forEach(columna => {
                const cacheKey = `contra_${jugador}_${columna}`;
                const valor = valoresCache[cacheKey] || 0;
                const elemento = document.getElementById(`contra_${jugador}_${columna}`);
                if (elemento) {
                    elemento.textContent = valor;
                }
            });
        });
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
        
        // Limpiar datos de Ana
        localStorage.removeItem('datos_ana');
        
        // Limpiar datos de MAXI
        localStorage.removeItem('datos_maxi');
        
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
async function cambiarContador(jugador, columna, cambio, tipo) {
    console.log(`🔄 cambiarContador llamado: ${jugador}, ${columna}, ${cambio}, ${tipo}`);
    
    // Obtener valor actual desde cache/Supabase
    const cacheKey = `${tipo}_${jugador}_${columna}`;
    let valorActual = valoresCache[cacheKey] || 0;
    
    // Si no está en cache, obtener desde Supabase
    if (valoresCache[cacheKey] === undefined) {
        valorActual = await obtenerValorSupabase(jugador, columna, tipo);
    }
    
    const nuevoValor = Math.max(0, valorActual + cambio);
    
    console.log(`📊 Valores: actual=${valorActual}, cambio=${cambio}, nuevo=${nuevoValor}`);
    
    // Actualizar cache inmediatamente
    valoresCache[cacheKey] = nuevoValor;
    
    // ✅ ACTUALIZAR UI INMEDIATAMENTE
    const elemento = document.getElementById(`${tipo}_${jugador}_${columna}`);
    if (elemento) {
        elemento.textContent = nuevoValor;
        console.log(`🎨 UI actualizada: ${elemento.id} = ${nuevoValor}`);
    } else {
        console.log(`⚠️ Elemento no encontrado: ${tipo}_${jugador}_${columna}`);
    }
    
    // 🔄 Supabase en segundo plano (no bloquea la UI)
    console.log('🔍 Verificando Supabase...');
    if (isSupabaseAvailable()) {
        console.log('✅ Supabase disponible, iniciando sincronización...');
        // Usar setTimeout para no bloquear la UI
        setTimeout(async () => {
            try {
                console.log(`🚀 Iniciando sync para ${tipo}: ${jugador} - ${columna} incremento=${cambio}`);
                if (tipo === 'favor') {
                    await syncFavorData(jugador, columna, cambio);
                } else if (tipo === 'contra') {
                    await syncContraData(jugador, columna, cambio);
                }
                console.log('✅ Sincronización completada');
            } catch (error) {
                console.error('❌ Error sincronizando con Supabase:', error);
                // Continuar sin Supabase - los datos están en localStorage
            }
        }, 0);
    } else {
        console.log('⚠️ Supabase no disponible, usando solo localStorage');
    }
}

// Cache de valores para evitar múltiples consultas
const valoresCache = {};

// Obtener valor del contador desde Supabase (con fallback a 0)
async function obtenerValorSupabase(jugador, columna, tipo) {
    if (!isSupabaseAvailable()) {
        console.log('⚠️ Supabase no disponible, retornando 0');
        return 0;
    }
    
    try {
        const diaId = await getOrCreateDay();
        if (!diaId) return 0;
        
        const tabla = tipo === 'favor' ? 'pc_favor' : 'pc_contra';
        const { data, error } = await supabase
            .from(tabla)
            .select('valor')
            .eq('dia_id', diaId)
            .eq('jugador', jugador)
            .eq('estadistica', columna)
            .single();
        
        if (error) {
            console.log(`📊 No existe registro para ${jugador}-${columna}, retornando 0`);
            return 0;
        }
        
        return data ? data.valor : 0;
    } catch (error) {
        console.error('❌ Error obteniendo valor desde Supabase:', error);
        return 0;
    }
}

// Obtener valor del contador (sincróno para compatibilidad)
function obtenerValor(jugador, columna, tipo) {
    const cacheKey = `${tipo}_${jugador}_${columna}`;
    
    // Devolver desde cache si está disponible
    if (valoresCache[cacheKey] !== undefined) {
        return valoresCache[cacheKey];
    }
    
    // Si no está en cache, devolver 0 y cargar asincrónamente
    obtenerValorSupabase(jugador, columna, tipo).then(valor => {
        valoresCache[cacheKey] = valor;
        // Actualizar UI si el elemento existe
        actualizarElementoUI(jugador, columna, tipo, valor);
    });
    
    return 0;
}

// Actualizar elemento UI específico
function actualizarElementoUI(jugador, columna, tipo, valor) {
    const elemento = document.getElementById(`${tipo}_${jugador}_${columna}`);
    if (elemento && elemento.textContent != valor.toString()) {
        elemento.textContent = valor;
        console.log(`🔄 UI actualizada desde Supabase: ${tipo}_${jugador}_${columna} = ${valor}`);
    }
}

// Cargar todos los datos desde Supabase al inicializar
async function cargarTodosLosDatosDesdeSupabase() {
    if (!isSupabaseAvailable()) {
        console.log('⚠️ Supabase no disponible, mostrando todos los valores en 0');
        return;
    }
    
    try {
        console.log('🔄 Cargando todos los datos desde Supabase...');
        const diaId = await getOrCreateDay();
        if (!diaId) return;
        
        // Cargar datos PC A FAVOR
        const { data: favorData } = await supabase
            .from('pc_favor')
            .select('jugador, estadistica, valor')
            .eq('dia_id', diaId);
        
        // Cargar datos PC EN CONTRA  
        const { data: contraData } = await supabase
            .from('pc_contra')
            .select('jugador, estadistica, valor')
            .eq('dia_id', diaId);
        
        // Actualizar cache con datos de PC A FAVOR
        if (favorData) {
            favorData.forEach(row => {
                const cacheKey = `favor_${row.jugador}_${row.estadistica}`;
                valoresCache[cacheKey] = row.valor;
                actualizarElementoUI(row.jugador, row.estadistica, 'favor', row.valor);
            });
        }
        
        // Actualizar cache con datos de PC EN CONTRA
        if (contraData) {
            contraData.forEach(row => {
                const cacheKey = `contra_${row.jugador}_${row.estadistica}`;
                valoresCache[cacheKey] = row.valor;
                actualizarElementoUI(row.jugador, row.estadistica, 'contra', row.valor);
            });
        }
        
        console.log(`✅ Datos cargados: ${(favorData?.length || 0) + (contraData?.length || 0)} registros`);
        
    } catch (error) {
        console.error('❌ Error cargando datos desde Supabase:', error);
    }
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

        // Sistema de autenticación solo con User ID (más seguro)
        const userId = prompt('👤 Introduce tu EmailJS User ID (obligatorio):');
        if (!userId) return;
        
        // Usar credenciales predefinidas (Service ID y Template ID son públicos)
        const config = {
            serviceId: 'service_4yx8mii',
            templateId: 'template_fchd433',
            userId: userId,  // Solo esto se pide al usuario
            toEmail: 'e.gzlzmesones@gmail.com, cristian26gonzalez@gmail.com'
        };
        
        console.log('✅ Configuración creada - User ID verificado');

        // Mostrar información de debug
        console.log('🔍 Configuración EmailJS:', config);
        
        // Inicializar EmailJS
        emailjs.init(config.userId);
        console.log('✅ EmailJS inicializado');
        
        // Recopilar datos
        const datos = await recopilarDatos();
        console.log('📊 Datos recopilados:', datos);
        
        // Guardar datos para usar en las funciones de HTML
        window.currentEmailData = datos;
        
        // Enviar email
        console.log('📧 Enviando email...');
        
        // Debug: mostrar el HTML que se está enviando
        const tablaFavorHTML = crearTablaFavorHTML(datos);
        const tablaContraHTML = crearTablaContraHTML(datos);
        const resumenHTML = crearResumenHTML(datos);
        const seccionAnaHTML = crearSeccionAnaHTML();
        const seccionMaxiHTML = crearSeccionMaxiHTML();
        
        console.log('🔍 HTML PC A FAVOR:', tablaFavorHTML);
        console.log('🔍 HTML PC EN CONTRA:', tablaContraHTML);
        console.log('🔍 HTML Resumen:', resumenHTML);
        console.log('🔍 HTML Ana:', seccionAnaHTML);
        console.log('🔍 HTML MAXI:', seccionMaxiHTML);
        
        const response = await emailjs.send(
            config.serviceId,
            config.templateId,
            {
                fecha: datos.fecha,
                tabla_favor: tablaFavorHTML,
                tabla_contra: tablaContraHTML,
                resumen: resumenHTML,
                seccion_ana: seccionAnaHTML,
                seccion_maxi: seccionMaxiHTML
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
async function recopilarDatos() {
    try {
        // Intentar obtener datos desde Supabase (consolidados de todos los dispositivos)
        const supabaseData = await getAllDataForEmail();
        
        if (supabaseData && supabaseData.pcFavor && supabaseData.pcContra) {
            console.log('✅ Usando datos de Supabase:', supabaseData);
            // Usar datos de Supabase
            return {
                fecha: new Date().toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                pcFavor: supabaseData.pcFavor,
                pcContra: supabaseData.pcContra,
                ana: supabaseData.ana || [],
                maxi: supabaseData.maxi || []
            };
        }
    } catch (error) {
        console.error('❌ Error obteniendo datos de Supabase:', error);
    }
    
    // Fallback: usar datos del cache actual si Supabase falla
    console.log('🔄 Usando datos del cache como fallback');
    console.log('🔍 Cache actual:', valoresCache);
    console.log('🔍 Jugadores disponibles:', jugadores);
    
    const datos = {
        fecha: new Date().toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        pcFavor: {},
        pcContra: {},
        ana: [],
        maxi: []
    };
    
    // Recopilar datos PC A FAVOR desde cache
    const columnasFavor = ['SACA_BIEN', 'SACA_MAL', 'PARA_BIEN', 'PARA_MAL', 'GOL', 'TIRO_PORTERIA', 'TIRO_FUERA'];
    jugadores.forEach(jugador => {
        datos.pcFavor[jugador] = {};
        columnasFavor.forEach(columna => {
            const cacheKey = `favor_${jugador}_${columna}`;
            datos.pcFavor[jugador][columna] = valoresCache[cacheKey] || 0;
        });
    });
    
    // Recopilar datos PC EN CONTRA desde cache
    const columnasContra = ['PENALTY', 'PENALTY_TONTO'];
    jugadores.forEach(jugador => {
        datos.pcContra[jugador] = {};
        columnasContra.forEach(columna => {
            const cacheKey = `contra_${jugador}_${columna}`;
            datos.pcContra[jugador][columna] = valoresCache[cacheKey] || 0;
        });
    });
    
    // Añadir datos de Ana y MAXI desde localStorage
    datos.ana = obtenerDatosAna();
    datos.maxi = obtenerDatosMaxi();
    
    console.log('✅ Datos finales estructurados:', datos);
    console.log('🔍 pcFavor keys:', Object.keys(datos.pcFavor));
    console.log('🔍 pcContra keys:', Object.keys(datos.pcContra));
    
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
async function limpiarDatosManual() {
    if (confirm('🗑️ ¿Estás seguro de que quieres limpiar TODOS los datos?\n\nEsto eliminará todas las estadísticas registradas de TODOS los dispositivos.')) {
        // Limpiar datos de Supabase (todos los dispositivos)
        await clearDayData();
        
        // Limpiar solo los datos de estadísticas, no la fecha
        const ultimaFecha = localStorage.getItem('ultima_fecha');
        
        // Limpiar todos los datos de estadísticas locales
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
        
        // Eliminar todas las claves locales
        clavesParaLimpiar.forEach(clave => {
            localStorage.removeItem(clave);
        });
        
        // Restaurar la fecha
        if (ultimaFecha) {
            localStorage.setItem('ultima_fecha', ultimaFecha);
        }
        
        // Limpiar también la fecha para forzar reinicio
        localStorage.removeItem('ultima_fecha');
        
        // Limpiar datos de Ana
        localStorage.removeItem('datos_ana');
        
        // Limpiar datos de MAXI
        localStorage.removeItem('datos_maxi');
        
        alert('✅ Todos los datos han sido limpiados de todos los dispositivos. La página se recargará.');
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
    console.log('🔍 crearTablaFavorHTML - datos recibidos:', datos);
    
    // Validar que los datos existan
    if (!datos || !datos.pcFavor) {
        console.log('⚠️ No hay datos de pcFavor disponibles');
        return '<p style="color: #666; font-style: italic;">No hay datos disponibles para PC A FAVOR.</p>';
    }
    
    // Filtrar solo jugadores con estadísticas > 0
    const jugadoresConEstadisticas = jugadores.filter(jugador => {
        const columnas = ['SACA_BIEN', 'SACA_MAL', 'PARA_BIEN', 'PARA_MAL', 'GOL', 'TIRO_PORTERIA', 'TIRO_FUERA'];
        // Validar que el jugador exista en los datos
        if (!datos.pcFavor[jugador]) {
            console.log(`⚠️ Jugador ${jugador} no encontrado en pcFavor`);
            return false;
        }
        return columnas.some(columna => (datos.pcFavor[jugador][columna] || 0) > 0);
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
    console.log('🔍 crearTablaContraHTML - datos recibidos:', datos);
    
    // Validar que los datos existan
    if (!datos || !datos.pcContra) {
        console.log('⚠️ No hay datos de pcContra disponibles');
        return '<p style="color: #666; font-style: italic;">No hay datos disponibles para PC EN CONTRA.</p>';
    }
    
    // Filtrar solo jugadores con estadísticas > 0
    const jugadoresConEstadisticas = jugadores.filter(jugador => {
        const columnas = ['PENALTY', 'PENALTY_TONTO'];
        // Validar que el jugador exista en los datos
        if (!datos.pcContra[jugador]) {
            console.log(`⚠️ Jugador ${jugador} no encontrado en pcContra`);
            return false;
        }
        return columnas.some(columna => (datos.pcContra[jugador][columna] || 0) > 0);
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
    console.log('🔍 crearResumenHTML - datos recibidos:', datos);
    
    // Validar que los datos existan
    if (!datos || !datos.pcFavor || !datos.pcContra) {
        console.log('⚠️ No hay datos completos disponibles para el resumen');
        return '<p style="color: #666; font-style: italic;">No hay datos disponibles para generar el resumen.</p>';
    }
    
    // Calcular totales
    let totalesFavor = {
        SACA_BIEN: 0, SACA_MAL: 0, PARA_BIEN: 0, PARA_MAL: 0,
        GOL: 0, TIRO_PORTERIA: 0, TIRO_FUERA: 0
    };
    
    let totalesContra = { PENALTY: 0, PENALTY_TONTO: 0 };
    
    jugadores.forEach(jugador => {
        // Validar que el jugador exista en pcFavor
        if (datos.pcFavor[jugador]) {
            ['SACA_BIEN', 'SACA_MAL', 'PARA_BIEN', 'PARA_MAL', 'GOL', 'TIRO_PORTERIA', 'TIRO_FUERA'].forEach(columna => {
                totalesFavor[columna] += (datos.pcFavor[jugador][columna] || 0);
            });
        }
        
        // Validar que el jugador exista en pcContra
        if (datos.pcContra[jugador]) {
            ['PENALTY', 'PENALTY_TONTO'].forEach(columna => {
                totalesContra[columna] += (datos.pcContra[jugador][columna] || 0);
            });
        }
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

// ===== FUNCIONES PARA LA INTERFAZ ANA =====

// Guardar datos de Ana
async function guardarDatosAna() {
    const jugador = document.getElementById('jugadorSelect').value;
    const disponible = document.getElementById('disponibleSelect').value;
    const texto = document.getElementById('textoInput').value;
    
    // Validar que se haya seleccionado un jugador
    if (!jugador) {
        alert('❌ Por favor, selecciona un jugador');
        return;
    }
    
    // Validar que se haya seleccionado disponibilidad
    if (!disponible) {
        alert('❌ Por favor, selecciona si está disponible o no');
        return;
    }
    
    // Guardar datos en localStorage (para respaldo local)
    const datosAna = {
        jugador: jugador,
        disponible: disponible,
        texto: texto,
        fecha: new Date().toISOString()
    };
    
    // Obtener datos existentes o crear array vacío
    const datosExistentes = JSON.parse(localStorage.getItem('datos_ana') || '[]');
    
    // Buscar si ya existe un registro para este jugador
    const indexExistente = datosExistentes.findIndex(d => d.jugador === jugador);
    
    if (indexExistente !== -1) {
        // Actualizar registro existente
        datosExistentes[indexExistente] = datosAna;
    } else {
        // Añadir nuevo registro
        datosExistentes.push(datosAna);
    }
    
    // Guardar en localStorage
    localStorage.setItem('datos_ana', JSON.stringify(datosExistentes));
    
    // Sincronizar con Supabase solo si está disponible
    if (isSupabaseAvailable()) {
        try {
            await syncAnaData(jugador, disponible, texto);
        } catch (error) {
            console.error('❌ Error sincronizando Ana con Supabase:', error);
        }
    } else {
        console.log('⚠️ Supabase no disponible, usando solo localStorage');
    }
    
    // Limpiar formulario
    document.getElementById('jugadorSelect').value = '';
    document.getElementById('disponibleSelect').value = '';
    document.getElementById('textoInput').value = '';
    
    alert('✅ Datos guardados correctamente');
}

// Cargar datos de Ana (para mostrar en el formulario si es necesario)
function cargarDatosAna() {
    // Por ahora solo cargamos la fecha
    // Los datos se cargan automáticamente desde localStorage
    console.log('📋 Interfaz Ana cargada');
}

// Obtener datos de Ana para el email
function obtenerDatosAna() {
    return JSON.parse(localStorage.getItem('datos_ana') || '[]');
}

// Crear HTML para la sección Ana en el email
function crearSeccionAnaHTML() {
    // Usar datos de Firebase si están disponibles en recopilarDatos
    const datosAna = window.currentEmailData?.ana || obtenerDatosAna();
    
    if (!datosAna || datosAna.length === 0) {
        return '<p style="color: #666; font-style: italic;">No hay datos registrados en Ana.</p>';
    }
    
    let html = '<table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse:collapse;">';
    html += '<thead><tr style="background-color:#f8f9fa;">';
    html += '<th>Jugador</th>';
    html += '<th>Disponible</th>';
    html += '<th>Texto</th>';
    html += '</tr></thead><tbody>';
    
    datosAna.forEach(dato => {
        html += '<tr>';
        html += '<td style="font-weight:bold;">' + dato.jugador + '</td>';
        html += '<td>' + dato.disponible + '</td>';
        html += '<td>' + (dato.texto || '-') + '</td>';
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    return html;
} 

// ===== FUNCIONES PARA LA INTERFAZ MAXI =====

// Guardar datos de MAXI
async function guardarDatosMaxi() {
    const tipo = document.getElementById('tipoSelect').value;
    const texto = document.getElementById('textoInput').value;
    
    // Obtener jugadores seleccionados (checkboxes)
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked');
    const jugadoresSeleccionados = Array.from(checkboxes).map(checkbox => checkbox.value);
    
    // Validar que se haya seleccionado al menos un jugador
    if (jugadoresSeleccionados.length === 0) {
        alert('❌ Por favor, selecciona al menos un jugador o GENERAL');
        return;
    }
    
    // Validar que se haya seleccionado un tipo
    if (!tipo) {
        alert('❌ Por favor, selecciona un tipo');
        return;
    }
    
    // Guardar datos en localStorage (para respaldo local)
    const datosMaxi = {
        jugadores: jugadoresSeleccionados,
        tipo: tipo,
        texto: texto,
        fecha: new Date().toISOString()
    };
    
    // Obtener datos existentes o crear array vacío
    const datosExistentes = JSON.parse(localStorage.getItem('datos_maxi') || '[]');
    
    // Añadir nuevo registro
    datosExistentes.push(datosMaxi);
    
    // Guardar en localStorage
    localStorage.setItem('datos_maxi', JSON.stringify(datosExistentes));
    
    // Sincronizar con Supabase solo si está disponible
    if (isSupabaseAvailable()) {
        try {
            await syncMaxiData(jugadoresSeleccionados, tipo, texto);
        } catch (error) {
            console.error('❌ Error sincronizando MAXI con Supabase:', error);
        }
    } else {
        console.log('⚠️ Supabase no disponible, usando solo localStorage');
    }
    
    // Limpiar formulario
    document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.getElementById('tipoSelect').value = '';
    document.getElementById('textoInput').value = '';
    
    alert('✅ Datos guardados correctamente');
}

// Cargar datos de MAXI (para mostrar en el formulario si es necesario)
function cargarDatosMaxi() {
    // Por ahora solo cargamos la fecha
    // Los datos se cargan automáticamente desde localStorage
    console.log('📋 Interfaz MAXI cargada');
}

// Obtener datos de MAXI para el email
function obtenerDatosMaxi() {
    return JSON.parse(localStorage.getItem('datos_maxi') || '[]');
}

// Crear HTML para la sección MAXI en el email
function crearSeccionMaxiHTML() {
    // Usar datos de Firebase si están disponibles en recopilarDatos
    const datosMaxi = window.currentEmailData?.maxi || obtenerDatosMaxi();
    
    if (!datosMaxi || datosMaxi.length === 0) {
        return '<p style="color: #666; font-style: italic;">No hay datos registrados en MAXI.</p>';
    }
    
    let html = '<table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse:collapse;">';
    html += '<thead><tr style="background-color:#f8f9fa;">';
    html += '<th>Jugadores</th>';
    html += '<th>Tipo</th>';
    html += '<th>Texto</th>';
    html += '</tr></thead><tbody>';
    
    datosMaxi.forEach(dato => {
        html += '<tr>';
        html += '<td style="font-weight:bold;">' + dato.jugadores.join(', ') + '</td>';
        html += '<td>' + dato.tipo + '</td>';
        html += '<td>' + (dato.texto || '-') + '</td>';
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    return html;
} 