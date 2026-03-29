import { Elysia } from 'elysia';

// Store active connections by role for direct messaging
const doctorClients = new Set();
const caretakerClients = new Set();

export const iotRoutes = new Elysia({ prefix: '/api/iot' })
  .ws('/stream', {
    open(ws) {
      console.log('🔌 New WebSocket Connection Opened');
    },
    message(ws, message) {
      try {
        const payload = typeof message === 'string' ? JSON.parse(message) : message;
        
        // 1. Subscription Management — store the ws reference by role
        if (payload.type === 'subscribe') {
          if (payload.role === 'doctor') {
            doctorClients.add(ws);
            ws.subscribe('doctor_room');
            console.log(`✅ Doctor subscribed (${doctorClients.size} doctor(s) online)`);
          }
          if (payload.role === 'caretaker') {
            caretakerClients.add(ws);
            ws.subscribe('caretaker_room');
            console.log(`✅ Caretaker subscribed (${caretakerClients.size} caretaker(s) online)`);
          }
          if (payload.role === 'iotDevice') {
            console.log(`✅ IoT Device registered`);
          }
          return;
        }

        // 2. IoT Sensor Data (e.g., ESP32 sending vitals)
        if (payload.type === 'sensor_telemetry') {
          console.log(`📡 [IoT Pulse] HR: ${payload.data.heartRate} bpm, Temp: ${payload.data.temperature}°C`);
          
          const vitalsPayload = JSON.stringify({
            event: 'patient_vitals_update',
            patientId: payload.patientId,
            data: payload.data
          });

          // Directly send to every connected doctor
          for (const doc of doctorClients) {
            try { doc.send(vitalsPayload); } catch (e) { doctorClients.delete(doc); }
          }

          // Also send to caretakers
          const caretakerPayload = JSON.stringify({
            event: 'live_vitals',
            data: payload.data
          });
          for (const ct of caretakerClients) {
            try { ct.send(caretakerPayload); } catch (e) { caretakerClients.delete(ct); }
          }
        }

        // 3. Caretaker Compliance Update
        if (payload.type === 'compliance_logged') {
          console.log(`💊 [Caretaker Update] Medication ${payload.task} marked completed.`);
          
          const compliancePayload = JSON.stringify({
            event: 'compliance_update',
            timelineId: payload.timelineId,
            status: 'completed'
          });
          for (const doc of doctorClients) {
            try { doc.send(compliancePayload); } catch (e) { doctorClients.delete(doc); }
          }
        }

      } catch (err) {
        console.error('WebSocket parsing error:', err);
      }
    },
    close(ws) {
      doctorClients.delete(ws);
      caretakerClients.delete(ws);
      console.log('🔌 WebSocket Connection Closed');
    }
  });
