// SheBloom — Recovery Routes
import { Elysia, t } from 'elysia';

const PPD_QUESTIONS = [
  { q: 'I have been able to laugh and see the funny side of things', options: [{ text: 'As much as I always could', score: 0 }, { text: 'Not quite so much now', score: 1 }, { text: 'Definitely not so much now', score: 2 }, { text: 'Not at all', score: 3 }] },
  { q: 'I have looked forward with enjoyment to things', options: [{ text: 'As much as I ever did', score: 0 }, { text: 'Rather less than I used to', score: 1 }, { text: 'Definitely less than I used to', score: 2 }, { text: 'Hardly at all', score: 3 }] },
  { q: 'I have blamed myself unnecessarily when things went wrong', options: [{ text: 'No, never', score: 0 }, { text: 'Not very often', score: 1 }, { text: 'Yes, some of the time', score: 2 }, { text: 'Yes, most of the time', score: 3 }] },
  { q: 'I have been anxious or worried for no good reason', options: [{ text: 'No, not at all', score: 0 }, { text: 'Hardly ever', score: 1 }, { text: 'Yes, sometimes', score: 2 }, { text: 'Yes, very often', score: 3 }] },
  { q: 'I have felt scared or panicky for no very good reason', options: [{ text: 'No, not at all', score: 0 }, { text: 'No, not much', score: 1 }, { text: 'Yes, sometimes', score: 2 }, { text: 'Yes, quite a lot', score: 3 }] },
  { q: 'Things have been getting on top of me', options: [{ text: 'No, I have been coping', score: 0 }, { text: 'No, most of the time I cope', score: 1 }, { text: 'Yes, sometimes I haven\'t been coping', score: 2 }, { text: 'Yes, most of the time I haven\'t been coping', score: 3 }] },
  { q: 'I have been so unhappy that I have had difficulty sleeping', options: [{ text: 'No, not at all', score: 0 }, { text: 'Not very often', score: 1 }, { text: 'Yes, sometimes', score: 2 }, { text: 'Yes, most of the time', score: 3 }] },
  { q: 'I have felt sad or miserable', options: [{ text: 'No, not at all', score: 0 }, { text: 'Not very often', score: 1 }, { text: 'Yes, quite often', score: 2 }, { text: 'Yes, most of the time', score: 3 }] },
  { q: 'I have been so unhappy that I have been crying', options: [{ text: 'No, never', score: 0 }, { text: 'Only occasionally', score: 1 }, { text: 'Yes, quite often', score: 2 }, { text: 'Yes, most of the time', score: 3 }] },
  { q: 'The thought of harming myself has occurred to me', options: [{ text: 'Never', score: 0 }, { text: 'Hardly ever', score: 1 }, { text: 'Sometimes', score: 2 }, { text: 'Yes, quite often', score: 3 }] }
];

function getPPDResult(score) {
  if (score <= 8) return { label: 'Low Risk', level: 'low', color: '#2d6a4f', message: 'Scores in this range are normal. Continue monitoring weekly.' };
  if (score <= 12) return { label: 'Possible Depression', level: 'moderate', color: '#e9c46a', message: 'Score suggests possible depression. Recommend discussing with doctor at next visit.' };
  if (score <= 19) return { label: 'Likely Depression', level: 'high', color: '#e07a5f', message: 'Score indicates probable depression. Please contact your healthcare provider this week.' };
  return { label: 'Severe — Seek Help Now', level: 'critical', color: '#d62828', message: 'This score indicates severe depression. Please contact your doctor or mental health helpline TODAY. NIMHANS Helpline: 080-46110007' };
}

export const recoveryRoutes = new Elysia({ prefix: '/api/recovery' })
  // Get PPD screening questions
  .get('/ppd/questions', () => ({
    questions: PPD_QUESTIONS,
    citation: 'Cox JL, Holden JM, Sagovsky R. (1987). Br J Psychiatry. WHO-recommended screening tool.',
    instructions: 'Please select the answer that comes closest to how you have felt IN THE PAST 7 DAYS.'
  }), {
    detail: { tags: ['Recovery'], summary: 'Get Edinburgh PPD screening questions' }
  })

  // Submit PPD screening
  .post('/ppd/submit', ({ body }) => {
    const totalScore = body.answers.reduce((a, b) => a + b, 0);
    const result = getPPDResult(totalScore);
    return {
      score: totalScore,
      maxScore: 30,
      ...result,
      answers: body.answers,
      submittedAt: new Date().toISOString()
    };
  }, {
    body: t.Object({
      circleId: t.Optional(t.Number()),
      answers: t.Array(t.Number())
    }),
    detail: { tags: ['Recovery'], summary: 'Submit PPD screening answers and get result' }
  })

  // Get recovery phases
  .get('/phases', () => ({
    phases: [
      { name: 'Healing Phase', weeks: '0-2 weeks', focus: 'Physical recovery + wound monitoring', icon: 'heart-pulse', color: '#e07a5f', verified: 'doctor' },
      { name: 'Adjusting Phase', weeks: '2-6 weeks', focus: 'Breastfeeding + sleep patterns + PPD watch', icon: 'baby', color: '#e9c46a', verified: 'doctor' },
      { name: 'Rebuilding Phase', weeks: '6-12 weeks', focus: 'Pelvic floor recovery + gentle exercise', icon: 'dumbbell', color: '#6a994e', verified: 'doctor' },
      { name: 'Reclaiming Phase', weeks: '3-6 months', focus: 'Hormonal balance + identity + relationships', icon: 'sun', color: '#2a9d8f', verified: 'evidence' },
      { name: 'Thriving Phase', weeks: '6-12 months', focus: 'Full recovery validation + family planning', icon: 'trophy', color: '#2d6a4f', verified: 'evidence' }
    ],
    citation: 'WHO Postnatal Care Guidelines, ACOG Postpartum Toolkit'
  }), {
    detail: { tags: ['Recovery'], summary: 'Get postpartum recovery phases (0-52 weeks)' }
  });
