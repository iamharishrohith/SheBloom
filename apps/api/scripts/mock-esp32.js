// mock-esp32.js
// This script simulates the ESP32 hardware sitting in the maternal person's home.
// It connects to the SheBloom Elysia WebSocket and pushes live telemetry.

const WebSocket = require('ws'); // Native bun/node ws

const ws = new WebSocket('ws://localhost:4000/api/iot/stream');

ws.on('open', () => {
  console.log('🤖 Mock ESP32 Hardware connected to SheBloom IoT Stream');
  
  // Register as an IoT device
  ws.send(JSON.stringify({ type: 'subscribe', role: 'iotDevice' }));

  // Simulate pushing live metrics every 5 seconds
  setInterval(() => {
    const payload = {
      type: 'sensor_telemetry',
      patientId: 1, // Represents Anita Kumar (hardcoded first DB patient for demo)
      data: {
        temperature: (36.5 + Math.random() * 0.5).toFixed(1), // Normal body temp fluctuation
        humidity: Math.floor(45 + Math.random() * 10), // Room humidity
        heartRate: Math.floor(75 + Math.random() * 10) // Resting heart rate
      }
    };

    ws.send(JSON.stringify(payload));
    console.log(`📡 [ESP32] Sent telemetry: ${payload.data.heartRate} bpm, ${payload.data.temperature}°C`);
  }, 5000);
});

ws.on('error', (err) => {
  console.error('❌ WebSocket Error. Is the Elysia server running?', err.message);
});
