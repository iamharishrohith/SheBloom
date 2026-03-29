import { db } from '../db/index.js';
import { timelineTasks, careCircles, users } from '../db/schema.js';
import { eq, and, lte } from 'drizzle-orm';

// The Alert Engine runs periodically and checks for missed tasks
export async function checkMissedMedications(wsInstance) {
  if (!db) return;

  try {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    // Convert current time to HH:MM format (e.g., "10:15")
    const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    console.log(`⏱️ [Alert Engine] Checking for missed tasks passed ${currentTimeStr} ...`);

    // Fetch all incomplete tasks for today where the scheduled 'time' is older than current time
    // For raw queries where Drizzle operators might be tricky with time strings, we do a quick fetch
    const todaysIncomplete = await db.select()
      .from(timelineTasks)
      .where(
         and(
           eq(timelineTasks.date, today),
           eq(timelineTasks.completed, false)
         )
      );

    // Filter tasks whose time is in the past
    const missedTasks = todaysIncomplete.filter(t => t.time <= currentTimeStr);

    if (missedTasks.length === 0) {
       console.log('✅ All mothers are compliant. No missed tasks.');
       return;
    }

    console.log(`⚠️ Found ${missedTasks.length} missed care tasks! Triggering Free Agentic Native Audio alerts...`);

    // Iterate over missed tasks to find the caretaker to alert
    for (const task of missedTasks) {
       const [circle] = await db.select().from(careCircles).where(eq(careCircles.id, task.circleId));
       if (circle) {
         // Push the alert heavily to the Caretaker room
         // The Capacitor App will physically wake up and speak Tamil natively via window.speechSynthesis
         wsInstance.publish('caretaker_room', JSON.stringify({
            event: 'trigger_audio_alert',
            taskId: task.id,
            caretakerId: circle.caretakerId,
            taskName: task.task,
            tamilMessage: 'வணக்கம், மருந்து நேரம் முடிந்துவிட்டது. தயவுசெய்து உறுதிப்படுத்தவும்.' // "Hello, medication time is over. Please confirm."
         }));
       }
    }

  } catch (err) {
    console.error('Alert engine failed:', err);
  }
}
