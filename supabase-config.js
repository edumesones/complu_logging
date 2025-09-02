// Supabase Configuration
// Reemplaza estos valores con tu configuración real de Supabase
const SUPABASE_URL = 'https://rrpiopmxtisfvlrhhmgp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJycGlvcG14dGlzZnZscmhobWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzQ3MzgsImV4cCI6MjA3MjMxMDczOH0.aJkMAhS00xLQopkLD1C4_m-ftDuXOVuabq5G7m6Kqsw';

let supabase = null;
let realtimeChannels = []; // Para almacenar los canales de tiempo real

function initializeSupabase() {
    try {
        console.log('🔄 Intentando inicializar Supabase...');
        console.log('🔍 window.supabase:', typeof window.supabase);
        
        // Intentar con la versión estándar
        if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase inicializado con versión estándar');
            return true;
        }
        
        // Intentar con la versión UMD
        if (typeof window.supabase !== 'undefined' && window.supabase.default && window.supabase.default.createClient) {
            supabase = window.supabase.default.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase inicializado con versión UMD');
            return true;
        }
        
        // Intentar con createClient global
        if (typeof createClient !== 'undefined') {
            supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase inicializado con createClient global');
            return true;
        }
        
        console.log('❌ No se pudo inicializar Supabase');
        return false;
    } catch (error) {
        console.error('❌ Error inicializando Supabase:', error);
        return false;
    }
}

// Intentar inicializar inmediatamente
console.log('🚀 Iniciando configuración de Supabase...');
if (!initializeSupabase()) {
    // Si falla, intentar de nuevo después de un delay
    setTimeout(() => {
        console.log('🔄 Reintentando inicialización de Supabase...');
        if (!initializeSupabase()) {
            console.log('⚠️ Supabase no disponible, usando solo localStorage');
        }
    }, 1000);
    
    // Intentar una vez más después de más tiempo
    setTimeout(() => {
        console.log('🔄 Último intento de inicialización de Supabase...');
        if (!initializeSupabase()) {
            console.log('⚠️ Supabase definitivamente no disponible');
        }
    }, 3000);
}

// Función para obtener la fecha actual en formato YYYY-MM-DD
function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Función para obtener o crear el día actual
async function getOrCreateDay() {
    if (!supabase) {
        console.log('⚠️ Supabase no disponible, usando localStorage');
        return null;
    }
    
    try {
        const fecha = getCurrentDate();
        
        // Buscar el día existente
        const { data: existingDay, error: selectError } = await supabase
            .from('dias')
            .select('id')
            .eq('fecha', fecha)
            .single();
            
        if (selectError && selectError.code !== 'PGRST116') {
            throw selectError;
        }
        
        if (existingDay) {
            return existingDay.id;
        }
        
        // Crear nuevo día
        const { data: newDay, error: insertError } = await supabase
            .from('dias')
            .insert([{ fecha }])
            .select('id')
            .single();
            
        if (insertError) {
            throw insertError;
        }
        
        return newDay.id;
    } catch (error) {
        console.error('❌ Error en getOrCreateDay:', error);
        return null;
    }
}

// Función para sincronizar datos PC A FAVOR
async function syncFavorData(jugador, estadistica, valor) {
    if (!supabase) {
        console.log('⚠️ Supabase no disponible, no se puede sincronizar datos.');
        return;
    }
    try {
        const diaId = await getOrCreateDay();
        if (!diaId) return;
        
        // Primero, obtener el valor actual
        const { data: existingData, error: selectError } = await supabase
            .from('pc_favor')
            .select('valor')
            .eq('dia_id', diaId)
            .eq('jugador', jugador)
            .eq('estadistica', estadistica)
            .single();
        
        let nuevoValor = valor; // Por defecto, usar el valor proporcionado
        
        if (!selectError && existingData) {
            // Si existe, sumar al valor actual
            nuevoValor = existingData.valor + valor;
            console.log(`📊 Sumando: ${existingData.valor} + ${valor} = ${nuevoValor}`);
        }
        
        // Upsert con el nuevo valor total (especificar clave única)
        const { error } = await supabase
            .from('pc_favor')
            .upsert({
                dia_id: diaId,
                jugador: jugador,
                estadistica: estadistica,
                valor: nuevoValor
            }, {
                onConflict: 'dia_id,jugador,estadistica',
                ignoreDuplicates: false
            });
        
        if (error) {
            console.error('❌ Error sincronizando datos:', error);
        } else {
            console.log(`✅ Sincronizado: ${jugador} - ${estadistica} = ${nuevoValor} (sumado: +${valor})`);
        }
    } catch (error) {
        console.error('❌ Error sincronizando datos:', error);
    }
}

// Función para sincronizar datos PC EN CONTRA
async function syncContraData(jugador, estadistica, valor) {
    if (!supabase) {
        console.log('⚠️ Supabase no disponible, no se puede sincronizar datos.');
        return;
    }
    try {
        const diaId = await getOrCreateDay();
        if (!diaId) return;
        
        // Primero, obtener el valor actual
        const { data: existingData, error: selectError } = await supabase
            .from('pc_contra')
            .select('valor')
            .eq('dia_id', diaId)
            .eq('jugador', jugador)
            .eq('estadistica', estadistica)
            .single();
        
        let nuevoValor = valor; // Por defecto, usar el valor proporcionado
        
        if (!selectError && existingData) {
            // Si existe, sumar al valor actual
            nuevoValor = existingData.valor + valor;
            console.log(`📊 Sumando: ${existingData.valor} + ${valor} = ${nuevoValor}`);
        }
        
        // Upsert con el nuevo valor total (especificar clave única)
        const { error } = await supabase
            .from('pc_contra')
            .upsert({
                dia_id: diaId,
                jugador: jugador,
                estadistica: estadistica,
                valor: nuevoValor
            }, {
                onConflict: 'dia_id,jugador,estadistica',
                ignoreDuplicates: false
            });
        
        if (error) {
            console.error('❌ Error sincronizando datos:', error);
        } else {
            console.log(`✅ Sincronizado: ${jugador} - ${estadistica} = ${nuevoValor} (sumado: +${valor})`);
        }
    } catch (error) {
        console.error('❌ Error sincronizando datos:', error);
    }
}

// Función para sincronizar datos Ana
async function syncAnaData(jugador, disponible, texto) {
    if (!supabase) {
        console.log('⚠️ Supabase no disponible, no se puede sincronizar datos.');
        return;
    }
    try {
        const diaId = await getOrCreateDay();
        if (!diaId) return;
        
        const { error } = await supabase
            .from('ana')
            .upsert({
                dia_id: diaId,
                jugador: jugador,
                disponible: disponible,
                texto: texto
            });
        
        if (error) {
            console.error('❌ Error sincronizando datos Ana:', error);
        } else {
            console.log(`✅ Sincronizado Ana: ${jugador} - ${disponible}`);
        }
    } catch (error) {
        console.error('❌ Error sincronizando datos Ana:', error);
    }
}

// Función para sincronizar datos MAXI
async function syncMaxiData(jugadores, tipo, texto) {
    if (!supabase) {
        console.log('⚠️ Supabase no disponible, no se puede sincronizar datos.');
        return;
    }
    try {
        const diaId = await getOrCreateDay();
        if (!diaId) return;
        
        const { error } = await supabase
            .from('maxi')
            .insert({
                dia_id: diaId,
                jugadores: jugadores,
                tipo: tipo,
                texto: texto
            });
        
        if (error) {
            console.error('❌ Error sincronizando datos MAXI:', error);
        } else {
            console.log(`✅ Sincronizado MAXI: ${jugadores.join(', ')} - ${tipo}`);
        }
    } catch (error) {
        console.error('❌ Error sincronizando datos MAXI:', error);
    }
}

// Función para sincronizar datos Cristian
async function syncCristianData(jugadores, tipo, texto) {
    if (!supabase) {
        console.log('⚠️ Supabase no disponible, no se puede sincronizar datos.');
        return;
    }
    try {
        const diaId = await getOrCreateDay();
        if (!diaId) return;
        
        const { error } = await supabase
            .from('cristian')
            .insert({
                dia_id: diaId,
                jugadores: jugadores,
                tipo: tipo,
                texto: texto
            });
        
        if (error) {
            console.error('❌ Error sincronizando datos Cristian:', error);
        } else {
            console.log(`✅ Sincronizado Cristian: ${jugadores.join(', ')} - ${tipo}`);
        }
    } catch (error) {
        console.error('❌ Error sincronizando datos Cristian:', error);
    }
}

// Función para obtener todos los datos del día
async function getAllDataForEmail() {
    if (!supabase) {
        console.log('⚠️ Supabase no disponible, no se pueden obtener datos.');
        return null;
    }
    try {
        const fecha = getCurrentDate();
        
        // Obtener el día
        const { data: dia, error: diaError } = await supabase
            .from('dias')
            .select('id')
            .eq('fecha', fecha)
            .single();
        
        if (diaError || !dia) {
            console.log('📅 No hay datos para hoy');
            return null;
        }
        
        const data = {
            fecha: fecha,
            pcFavor: {},
            pcContra: {},
            ana: [],
            maxi: [],
            cristian: []
        };

        // Obtener datos PC A FAVOR
        const { data: favorData, error: favorError } = await supabase
            .from('pc_favor')
            .select('jugador, estadistica, valor')
            .eq('dia_id', dia.id);
        
        if (!favorError && favorData) {
            favorData.forEach(row => {
                if (!data.pcFavor[row.jugador]) {
                    data.pcFavor[row.jugador] = {};
                }
                data.pcFavor[row.jugador][row.estadistica] = row.valor;
            });
        }

        // Obtener datos PC EN CONTRA
        const { data: contraData, error: contraError } = await supabase
            .from('pc_contra')
            .select('jugador, estadistica, valor')
            .eq('dia_id', dia.id);
        
        if (!contraError && contraData) {
            contraData.forEach(row => {
                if (!data.pcContra[row.jugador]) {
                    data.pcContra[row.jugador] = {};
                }
                data.pcContra[row.jugador][row.estadistica] = row.valor;
            });
        }

        // Obtener datos Ana
        const { data: anaData, error: anaError } = await supabase
            .from('ana')
            .select('jugador, disponible, texto')
            .eq('dia_id', dia.id);
        
        if (!anaError && anaData) {
            data.ana = anaData.map(row => ({
                jugador: row.jugador,
                disponible: row.disponible,
                texto: row.texto
            }));
        }

        // Obtener datos MAXI
        const { data: maxiData, error: maxiError } = await supabase
            .from('maxi')
            .select('jugadores, tipo, texto')
            .eq('dia_id', dia.id);
        
        if (!maxiError && maxiData) {
            data.maxi = maxiData.map(row => ({
                jugadores: row.jugadores,
                tipo: row.tipo,
                texto: row.texto
            }));
        }

        // Obtener datos Cristian
        const { data: cristianData, error: cristianError } = await supabase
            .from('cristian')
            .select('jugadores, tipo, texto')
            .eq('dia_id', dia.id);
        
        if (!cristianError && cristianData) {
            data.cristian = cristianData.map(row => ({
                jugadores: row.jugadores,
                tipo: row.tipo,
                texto: row.texto
            }));
        }

        return data;
    } catch (error) {
        console.error('❌ Error obteniendo datos:', error);
        return null;
    }
}

// Función para limpiar datos del día
async function clearDayData() {
    if (!supabase) {
        console.log('⚠️ Supabase no disponible, no se pueden limpiar datos.');
        return;
    }
    try {
        const fecha = getCurrentDate();
        
        // Obtener el día
        const { data: dia, error: diaError } = await supabase
            .from('dias')
            .select('id')
            .eq('fecha', fecha)
            .single();
        
        if (diaError || !dia) {
            console.log('📅 No hay datos para limpiar');
            return;
        }
        
        // Eliminar el día (cascada eliminará todos los datos relacionados)
        const { error } = await supabase
            .from('dias')
            .delete()
            .eq('id', dia.id);
        
        if (error) {
            console.error('❌ Error limpiando datos:', error);
        } else {
            console.log('✅ Datos del día limpiados');
        }
    } catch (error) {
        console.error('❌ Error limpiando datos:', error);
    }
}

// ==========================================
// SINCRONIZACIÓN EN TIEMPO REAL
// ==========================================

// Función para configurar listeners en tiempo real
function setupRealtimeSync() {
    if (!supabase) {
        console.log('⚠️ Supabase no disponible, no se puede configurar sincronización en tiempo real');
        return;
    }

    console.log('🔄 Configurando sincronización en tiempo real...');

    // Limpiar canales existentes
    realtimeChannels.forEach(channel => {
        supabase.removeChannel(channel);
    });
    realtimeChannels = [];

    // Configurar listener para PC A FAVOR
    const pcFavorChannel = supabase
        .channel('pc_favor_changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'pc_favor' },
            (payload) => handlePcFavorChange(payload)
        )
        .subscribe();
    
    realtimeChannels.push(pcFavorChannel);

    // Configurar listener para PC EN CONTRA
    const pcContraChannel = supabase
        .channel('pc_contra_changes')
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'pc_contra' },
            (payload) => handlePcContraChange(payload)
        )
        .subscribe();
    
    realtimeChannels.push(pcContraChannel);

    // Configurar listener para ANA
    const anaChannel = supabase
        .channel('ana_changes')
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'ana' },
            (payload) => handleAnaChange(payload)
        )
        .subscribe();
    
    realtimeChannels.push(anaChannel);

    // Configurar listener para MAXI
    const maxiChannel = supabase
        .channel('maxi_changes')
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'maxi' },
            (payload) => handleMaxiChange(payload)
        )
        .subscribe();
    
    realtimeChannels.push(maxiChannel);

    // Configurar listener para CRISTIAN
    const cristianChannel = supabase
        .channel('cristian_changes')
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'cristian' },
            (payload) => handleCristianChange(payload)
        )
        .subscribe();
    
    realtimeChannels.push(cristianChannel);

    console.log('✅ Sincronización en tiempo real configurada');
}

// Handlers para cambios en tiempo real
function handlePcFavorChange(payload) {
    console.log('🔄 Cambio detectado en PC A FAVOR:', payload);
    
    // Actualizar cache y UI inmediatamente
    if (payload.new && typeof valoresCache !== 'undefined') {
        const { jugador, estadistica, valor } = payload.new;
        const cacheKey = `favor_${jugador}_${estadistica}`;
        valoresCache[cacheKey] = valor;
        
        // Actualizar UI si existe la función
        if (typeof actualizarElementoUI === 'function') {
            actualizarElementoUI(jugador, estadistica, 'favor', valor);
        }
    }
    
    if (typeof updatePcFavorDisplay === 'function') {
        updatePcFavorDisplay(payload.new);
    } else {
        // Recargar datos si la función específica no está disponible
        if (typeof cargarDatosDesdeSupabase === 'function') {
            cargarDatosDesdeSupabase();
        }
    }
}

function handlePcContraChange(payload) {
    console.log('🔄 Cambio detectado en PC EN CONTRA:', payload);
    
    // Actualizar cache y UI inmediatamente
    if (payload.new && typeof valoresCache !== 'undefined') {
        const { jugador, estadistica, valor } = payload.new;
        const cacheKey = `contra_${jugador}_${estadistica}`;
        valoresCache[cacheKey] = valor;
        
        // Actualizar UI si existe la función
        if (typeof actualizarElementoUI === 'function') {
            actualizarElementoUI(jugador, estadistica, 'contra', valor);
        }
    }
    
    if (typeof updatePcContraDisplay === 'function') {
        updatePcContraDisplay(payload.new);
    } else {
        if (typeof cargarDatosDesdeSupabase === 'function') {
            cargarDatosDesdeSupabase();
        }
    }
}

function handleAnaChange(payload) {
    console.log('🔄 Cambio detectado en ANA:', payload);
    
    if (typeof updateAnaDisplay === 'function') {
        updateAnaDisplay(payload.new);
    } else {
        if (typeof cargarDatosDesdeSupabase === 'function') {
            cargarDatosDesdeSupabase();
        }
    }
}

function handleMaxiChange(payload) {
    console.log('🔄 Cambio detectado en MAXI:', payload);
    
    if (typeof updateMaxiDisplay === 'function') {
        updateMaxiDisplay(payload.new);
    } else {
        if (typeof cargarDatosDesdeSupabase === 'function') {
            cargarDatosDesdeSupabase();
        }
    }
}

function handleCristianChange(payload) {
    console.log('🔄 Cambio detectado en CRISTIAN:', payload);
    
    if (typeof updateCristianDisplay === 'function') {
        updateCristianDisplay(payload.new);
    } else {
        if (typeof cargarDatosDesdeSupabase === 'function') {
            cargarDatosDesdeSupabase();
        }
    }
}

// Función para inicializar sincronización (llamar después de que todo esté listo)
function initRealtimeSync() {
    // Esperar un momento para que todo esté inicializado
    setTimeout(() => {
        setupRealtimeSync();
    }, 2000);
}

// Función para limpiar canales al cerrar la página
function cleanupRealtimeChannels() {
    if (supabase && realtimeChannels.length > 0) {
        console.log('🧹 Limpiando canales de tiempo real...');
        realtimeChannels.forEach(channel => {
            supabase.removeChannel(channel);
        });
        realtimeChannels = [];
    }
}

// Limpiar canales cuando se cierre la página
window.addEventListener('beforeunload', cleanupRealtimeChannels); 