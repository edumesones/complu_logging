// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJRf8l1Fr_-GCTo29V_25qeU_lLZyIpH4",
  authDomain: "complu-logging.firebaseapp.com",
  projectId: "complu-logging",
  storageBucket: "complu-logging.firebasestorage.app",
  messagingSenderId: "672990491373",
  appId: "1:672990491373:web:df18ccb7491c4351fa92e4",
  measurementId: "G-M2FPW9RTKR"
};

// Initialize Firebase (usando la versión compat para CDN)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Función para obtener la fecha actual en formato YYYY-MM-DD
function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Función para sincronizar datos PC A FAVOR
async function syncFavorData(jugador, estadistica, valor) {
    try {
        const fecha = getCurrentDate();
        await db.collection('dias').doc(fecha)
            .collection('pc_favor').doc(jugador)
            .set({
                [estadistica]: valor,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        
        console.log(`✅ Sincronizado: ${jugador} - ${estadistica} = ${valor}`);
    } catch (error) {
        console.error('❌ Error sincronizando datos:', error);
    }
}

// Función para sincronizar datos PC EN CONTRA
async function syncContraData(jugador, estadistica, valor) {
    try {
        const fecha = getCurrentDate();
        await db.collection('dias').doc(fecha)
            .collection('pc_contra').doc(jugador)
            .set({
                [estadistica]: valor,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        
        console.log(`✅ Sincronizado: ${jugador} - ${estadistica} = ${valor}`);
    } catch (error) {
        console.error('❌ Error sincronizando datos:', error);
    }
}

// Función para sincronizar datos Ana
async function syncAnaData(jugador, disponible, texto) {
    try {
        const fecha = getCurrentDate();
        await db.collection('dias').doc(fecha)
            .collection('ana').doc(jugador)
            .set({
                disponible: disponible,
                texto: texto,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        
        console.log(`✅ Sincronizado Ana: ${jugador} - ${disponible}`);
    } catch (error) {
        console.error('❌ Error sincronizando datos Ana:', error);
    }
}

// Función para sincronizar datos MAXI
async function syncMaxiData(jugadores, tipo, texto) {
    try {
        const fecha = getCurrentDate();
        await db.collection('dias').doc(fecha)
            .collection('maxi').add({
                jugadores: jugadores,
                tipo: tipo,
                texto: texto,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        
        console.log(`✅ Sincronizado MAXI: ${jugadores.join(', ')} - ${tipo}`);
    } catch (error) {
        console.error('❌ Error sincronizando datos MAXI:', error);
    }
}

// Función para obtener todos los datos del día
async function getAllDataForEmail() {
    try {
        const fecha = getCurrentDate();
        const data = {
            fecha: fecha,
            pcFavor: {},
            pcContra: {},
            ana: [],
            maxi: []
        };

        // Obtener datos PC A FAVOR
        const favorSnapshot = await db.collection('dias').doc(fecha)
            .collection('pc_favor').get();
        favorSnapshot.forEach(doc => {
            data.pcFavor[doc.id] = doc.data();
        });

        // Obtener datos PC EN CONTRA
        const contraSnapshot = await db.collection('dias').doc(fecha)
            .collection('pc_contra').get();
        contraSnapshot.forEach(doc => {
            data.pcContra[doc.id] = doc.data();
        });

        // Obtener datos Ana
        const anaSnapshot = await db.collection('dias').doc(fecha)
            .collection('ana').get();
        anaSnapshot.forEach(doc => {
            data.ana.push({
                jugador: doc.id,
                ...doc.data()
            });
        });

        // Obtener datos MAXI
        const maxiSnapshot = await db.collection('dias').doc(fecha)
            .collection('maxi').get();
        maxiSnapshot.forEach(doc => {
            data.maxi.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return data;
    } catch (error) {
        console.error('❌ Error obteniendo datos:', error);
        return null;
    }
}

// Función para limpiar datos del día
async function clearDayData() {
    try {
        const fecha = getCurrentDate();
        
        // Limpiar PC A FAVOR
        const favorSnapshot = await db.collection('dias').doc(fecha)
            .collection('pc_favor').get();
        favorSnapshot.forEach(doc => doc.ref.delete());

        // Limpiar PC EN CONTRA
        const contraSnapshot = await db.collection('dias').doc(fecha)
            .collection('pc_contra').get();
        contraSnapshot.forEach(doc => doc.ref.delete());

        // Limpiar Ana
        const anaSnapshot = await db.collection('dias').doc(fecha)
            .collection('ana').get();
        anaSnapshot.forEach(doc => doc.ref.delete());

        // Limpiar MAXI
        const maxiSnapshot = await db.collection('dias').doc(fecha)
            .collection('maxi').get();
        maxiSnapshot.forEach(doc => doc.ref.delete());

        console.log('✅ Datos del día limpiados');
    } catch (error) {
        console.error('❌ Error limpiando datos:', error);
    }
} 