const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// 🔹 Función para detectar signos vitales críticos y enviar alertas
exports.detectarEmergencia = functions.database
    .ref("/pacientes/{uid}/signos_vitales/{timestamp}")
    .onCreate(async (snapshot, context) => {
        const data = snapshot.val();
        const oxigenacion = data.oxigenacion;
        const frecuencia = data.frecuencia_cardiaca;
        const pacienteUID = context.params.uid;

        let mensaje = null;

        if (oxigenacion < 85) {
            mensaje = `🚨 EMERGENCIA: Paciente ${pacienteUID} tiene oxigenación muy baja (${oxigenacion}%)`;
        } else if (oxigenacion < 90) {
            mensaje = `⚠️ Alerta: Oxigenación baja (${oxigenacion}%) en paciente ${pacienteUID}`;
        } else if (frecuencia < 40 || frecuencia > 150) {
            mensaje = `🚨 EMERGENCIA: Ritmo cardíaco peligroso (${frecuencia} BPM) en paciente ${pacienteUID}`;
        }

        if (mensaje) {
            console.log("🔔 Enviando alerta:", mensaje);

            // Enviar notificación con Firebase Cloud Messaging
            await admin.messaging().sendToTopic("alertas_medicas", {
                notification: {
                    title: "🚨 Alerta Médica",
                    body: mensaje,
                    clickAction: "FLUTTER_NOTIFICATION_CLICK",
                },
            });

            // Guardar la alerta en la base de datos
            return admin.database().ref(`/alertas/${pacienteUID}`).push({
                mensaje,
                timestamp: Date.now(),
            });
        }

        return null;
    });
