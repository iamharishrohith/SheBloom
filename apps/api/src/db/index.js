// SheBloom — Neon PostgreSQL Connection
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('⚠️  DATABASE_URL not set. Running in demo mode (no database).');
}

const sql = connectionString ? neon(connectionString) : null;
export const db = sql ? drizzle(sql, { schema }) : null;

export function requireDb() {
  if (!db) throw new Error('Database not configured. Set DATABASE_URL in .env');
  return db;
}
