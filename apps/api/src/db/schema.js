// SheBloom — Database Schema (Drizzle ORM + Neon PostgreSQL)
import { pgTable, serial, text, varchar, integer, boolean, date, time, timestamp, jsonb } from 'drizzle-orm/pg-core';

// ---- Users ----
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 15 }),
  email: varchar('email', { length: 255 }),
  passwordHash: text('password_hash'),
  role: varchar('role', { length: 20 }).notNull(), // doctor | caretaker | maternal
  language: varchar('language', { length: 10 }).default('en'),
  createdAt: timestamp('created_at').defaultNow()
});

// ---- Care Circles (links doctor + caretaker + maternal person) ----
export const careCircles = pgTable('care_circles', {
  id: serial('id').primaryKey(),
  maternalId: integer('maternal_id').references(() => users.id),
  caretakerId: integer('caretaker_id').references(() => users.id),
  doctorId: integer('doctor_id').references(() => users.id),
  relationship: varchar('relationship', { length: 30 }),
  dueDate: date('due_date'),
  trimester: integer('trimester').default(1),
  weekNumber: integer('week_number').default(1),
  conditions: jsonb('conditions').default([]),
  dietPreference: varchar('diet_preference', { length: 30 }).default('vegetarian'),
  region: varchar('region', { length: 30 }).default('general'),
  caretakerSchedule: varchar('caretaker_schedule', { length: 30 }).default('flexible'),
  createdAt: timestamp('created_at').defaultNow()
});

// ---- Timeline Tasks (daily care plan) ----
export const timelineTasks = pgTable('timeline_tasks', {
  id: serial('id').primaryKey(),
  circleId: integer('circle_id').references(() => careCircles.id),
  date: date('date').notNull(),
  time: time('time').notNull(),
  task: text('task').notNull(),
  icon: varchar('icon', { length: 30 }),
  duration: varchar('duration', { length: 10 }),
  gap: varchar('gap', { length: 20 }),
  verified: varchar('verified', { length: 20 }).default('evidence'),
  citation: text('citation'),
  condition: varchar('condition', { length: 50 }),
  completed: boolean('completed').default(false),
  completedAt: timestamp('completed_at')
});

// ---- PPD Screening Scores ----
export const ppdScores = pgTable('ppd_scores', {
  id: serial('id').primaryKey(),
  circleId: integer('circle_id').references(() => careCircles.id),
  score: integer('score').notNull(),
  answers: jsonb('answers').notNull(),
  riskLevel: varchar('risk_level', { length: 20 }),
  takenAt: timestamp('taken_at').defaultNow(),
  reviewedBy: integer('reviewed_by').references(() => users.id),
  doctorNote: text('doctor_note')
});

// ---- Recovery Milestones ----
export const recoveryMilestones = pgTable('recovery_milestones', {
  id: serial('id').primaryKey(),
  circleId: integer('circle_id').references(() => careCircles.id),
  phase: varchar('phase', { length: 30 }).notNull(),
  milestone: text('milestone').notNull(),
  completed: boolean('completed').default(false),
  completedAt: timestamp('completed_at')
});

// ---- Leave Applications ----
export const leaveApplications = pgTable('leave_applications', {
  id: serial('id').primaryKey(),
  circleId: integer('circle_id').references(() => careCircles.id),
  type: varchar('type', { length: 20 }).notNull(),
  applicantName: varchar('applicant_name', { length: 100 }),
  managerName: varchar('manager_name', { length: 100 }),
  startDate: date('start_date'),
  endDate: date('end_date'),
  reason: text('reason'),
  generatedText: text('generated_text'),
  createdAt: timestamp('created_at').defaultNow()
});

// ---- Compliance Logs ----
export const complianceLogs = pgTable('compliance_logs', {
  id: serial('id').primaryKey(),
  circleId: integer('circle_id').references(() => careCircles.id),
  type: varchar('type', { length: 30 }).notNull(),
  item: varchar('item', { length: 100 }).notNull(),
  completed: boolean('completed').default(false),
  loggedBy: integer('logged_by').references(() => users.id),
  loggedAt: timestamp('logged_at').defaultNow()
});

// ---- Symptom Reports ----
export const symptomReports = pgTable('symptom_reports', {
  id: serial('id').primaryKey(),
  circleId: integer('circle_id').references(() => careCircles.id),
  reportedBy: integer('reported_by').references(() => users.id),
  symptoms: jsonb('symptoms').notNull(),
  severity: varchar('severity', { length: 20 }),
  aiAssessment: text('ai_assessment'),
  doctorResponse: text('doctor_response'),
  respondedAt: timestamp('responded_at'),
  createdAt: timestamp('created_at').defaultNow()
});

// ---- Doctor Verifications ----
export const verifications = pgTable('verifications', {
  id: serial('id').primaryKey(),
  doctorId: integer('doctor_id').references(() => users.id),
  contentType: varchar('content_type', { length: 30 }),
  contentId: varchar('content_id', { length: 50 }),
  trustLevel: varchar('trust_level', { length: 20 }),
  citation: text('citation'),
  note: text('note'),
  verifiedAt: timestamp('verified_at').defaultNow()
});
