// SheBloom — Auth Routes
import { Elysia, t } from 'elysia';

export const authRoutes = new Elysia({ prefix: '/api/auth' })
  .post('/register', ({ body }) => {
    // TODO: Connect to DB when Neon is set up
    return {
      success: true,
      message: `Registered ${body.name} as ${body.role}`,
      user: {
        id: Date.now(),
        name: body.name,
        email: body.email,
        role: body.role
      }
    };
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      phone: t.Optional(t.String()),
      password: t.String(),
      role: t.Union([t.Literal('doctor'), t.Literal('caretaker')])
    }),
    detail: { tags: ['Auth'], summary: 'Register a new user (doctor or caretaker)' }
  })
  .post('/login', ({ body }) => {
    // TODO: JWT auth when DB is connected
    return {
      success: true,
      token: 'demo-token-' + Date.now(),
      user: { id: 1, name: 'Demo User', role: body.role || 'caretaker' }
    };
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String(),
      role: t.Optional(t.String())
    }),
    detail: { tags: ['Auth'], summary: 'Login and get JWT token' }
  });
