// SheBloom — Caretaker Routes
import { Elysia, t } from 'elysia';
import { CARE_GAPS, RELATIONSHIPS, SCHEDULES, CONDITIONS } from '@shebloom/shared/constants';

export const caretakerRoutes = new Elysia({ prefix: '/api/caretaker' })
  // Get care circle info
  .get('/circle/:id', ({ params }) => {
    return {
      id: params.id,
      maternal: { name: 'Priya', trimester: 2, weekNumber: 20, conditions: ['anemia-mild'] },
      caretaker: { name: 'Rohith', schedule: 'working-9-6', relationship: 'husband' },
      doctor: { name: 'Dr. Lakshmi', hospital: 'Apollo Chennai' }
    };
  }, {
    detail: { tags: ['Caretaker'], summary: 'Get care circle details' }
  })

  // Get dashboard data
  .get('/dashboard', () => {
    const trimester = 2;
    return {
      trimester,
      weekNumber: 20,
      greeting: getGreeting(),
      careGaps: CARE_GAPS,
      quickStats: {
        tasksCompleted: 5,
        tasksTotal: 8,
        supplementsTaken: true,
        nextCheckup: '2026-04-15',
        daysUntilDue: 140
      }
    };
  }, {
    detail: { tags: ['Caretaker'], summary: 'Get caretaker dashboard data' }
  })

  // Log compliance
  .post('/compliance', ({ body }) => {
    return {
      success: true,
      message: `Logged: ${body.item} (${body.type})`,
      id: Date.now()
    };
  }, {
    body: t.Object({
      circleId: t.Number(),
      type: t.String(),
      item: t.String(),
      completed: t.Boolean()
    }),
    detail: { tags: ['Caretaker'], summary: 'Log a compliance action (supplement taken, checkup done, etc.)' }
  })

  // Report symptom
  .post('/symptom', ({ body }) => {
    // TODO: AI assessment via LangChain
    const severity = body.symptoms.length >= 3 ? 'high' : body.symptoms.length >= 2 ? 'medium' : 'low';
    return {
      success: true,
      severity,
      aiAssessment: `Noted ${body.symptoms.length} symptom(s). ${severity === 'high' ? 'Recommend contacting doctor immediately.' : 'Monitor and report if symptoms worsen.'}`,
      id: Date.now()
    };
  }, {
    body: t.Object({
      circleId: t.Number(),
      symptoms: t.Array(t.String()),
      notes: t.Optional(t.String())
    }),
    detail: { tags: ['Caretaker'], summary: 'Report symptoms for AI assessment and doctor review' }
  })

  // Get onboarding options
  .get('/onboarding-options', () => ({
    relationships: RELATIONSHIPS,
    schedules: SCHEDULES,
    conditions: CONDITIONS
  }), {
    detail: { tags: ['Caretaker'], summary: 'Get options for onboarding flow' }
  });


function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
