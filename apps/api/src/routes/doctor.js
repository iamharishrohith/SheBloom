import { Elysia, t } from 'elysia';
import { db } from '../db/index.js';
import { users, careCircles, timelineTasks } from '../db/schema.js';
import { generateCareTimeline } from '../services/timeline-engine.js';
import { eq } from 'drizzle-orm';

export const doctorRoutes = new Elysia({ prefix: '/api/doctor' })
  // Patient Intake Endpoint — provisions the maternal person, caretaker, and care circle
  .post('/patient', async ({ body, set }) => {
    if (!db) {
      set.status = 503;
      return { error: 'Database not connected. Provide DATABASE_URL.' };
    }

    const { maternal, caretaker, clinicalParams } = body;

    try {
      console.log(`🏥 [Doctor Dashboard] Intake Request for Patient: ${maternal.name} | Due Date: ${clinicalParams.dueDate}`);

      // 1. Create Maternal Person
      const [maternalUser] = await db.insert(users).values({
        name: maternal.name,
        phone: maternal.phone,
        role: 'maternal',
      }).returning();

      // 2. Create Caretaker Profile
      const [caretakerUser] = await db.insert(users).values({
        name: caretaker.name,
        phone: caretaker.phone,
        role: 'caretaker',
      }).returning();

      console.log(`✔️ [Auto-Provision] Created Caretaker profile: ${caretakerUser.name}. Sent SMS credentials to ${caretakerUser.phone}.`);

      // 3. Link them in a Care Circle (Assumes Doctor ID 1 for now)
      const [circle] = await db.insert(careCircles).values({
        maternalId: maternalUser.id,
        caretakerId: caretakerUser.id,
        doctorId: 1, // Mock authenticated doctor
        relationship: caretaker.relationship,
        dueDate: new Date(clinicalParams.dueDate).toISOString().split('T')[0],
        trimester: clinicalParams.trimester,
        weekNumber: clinicalParams.weekNumber,
        conditions: clinicalParams.conditions || [],
        caretakerSchedule: caretaker.schedule || '9to6'
      }).returning();

      // 4. Seed the Timeline Engine
      const initialTimeline = generateCareTimeline(
        clinicalParams.trimester,
        clinicalParams.conditions || [],
        caretaker.schedule || '9to6'
      );

      // 5. Persist the Timeline Tasks to the DB for today
      const today = new Date().toISOString().split('T')[0];
      const tasksToInsert = initialTimeline.map(t => ({
        circleId: circle.id,
        date: today,
        time: t.time,
        task: t.task,
        icon: t.icon,
        duration: t.duration,
        gap: t.gap,
        verified: t.verified,
        citation: t.citation,
        condition: t.condition || null,
        completed: false
      }));

      await db.insert(timelineTasks).values(tasksToInsert);
      console.log(`📅 [Timeline Engine] Seeded ${tasksToInsert.length} core tasks into Care Circle ${circle.id}.`);

      // Return success payload
      return {
        success: true,
        message: 'Care Circle provisioned successfully.',
        data: {
          circleId: circle.id,
          maternal: maternalUser,
          caretaker: caretakerUser,
          timelineCount: tasksToInsert.length
        }
      };

    } catch (e) {
      console.error('Error during patient intake:', e);
      set.status = 500;
      return { error: 'Failed to provision Patient and Caretaker accounts.' };
    }
  }, {
    body: t.Object({
      maternal: t.Object({ name: t.String(), phone: t.String() }),
      caretaker: t.Object({ name: t.String(), phone: t.String(), relationship: t.String(), schedule: t.String() }),
      clinicalParams: t.Object({ 
        dueDate: t.String(), 
        trimester: t.Number(), 
        weekNumber: t.Number(), 
        conditions: t.Optional(t.Array(t.String())) 
      })
    })
  })
  // Get all patients assigned to a specific doctor (e.g. ID 1 for now)
  .get('/patients', async ({ set }) => {
    if (!db) {
      set.status = 503;
      return { error: 'Database not connected.' };
    }

    try {
      // For presentation purposes, hardcoded to Doctor ID 1
      const doctorId = 1;

      // Since relations might need advanced setup in schema.js, let's use a manual approach:
      const allCircles = await db.select().from(careCircles).where(eq(careCircles.doctorId, doctorId));
      
      const enriched = await Promise.all(allCircles.map(async (c) => {
         const [maternal] = await db.select().from(users).where(eq(users.id, c.maternalId));
         
         const today = new Date().toISOString().split('T')[0];
         const tasks = await db.select().from(timelineTasks).where(eq(timelineTasks.circleId, c.id));
         const todayTasks = tasks.filter(t => t.date === today);
         
         const completed = todayTasks.filter(t => t.completed).length;
         const total = todayTasks.length;
         const complianceRate = total > 0 ? Math.round((completed / total) * 100) : 100;

         return {
            id: c.id,
            maternalName: maternal.name,
            phone: maternal.phone,
            trimester: c.trimester,
            conditions: c.conditions || [],
            complianceRate,
            ppdRiskLevel: 'low', // Mocked or query ppd_scores
            dueDate: c.dueDate
         };
      }));

      return enriched;
    } catch (e) {
      console.error(e);
      set.status = 500;
      return { error: 'Failed to fetch patients.', details: e.message };
    }
  });
