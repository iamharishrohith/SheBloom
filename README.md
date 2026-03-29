# SheBloom — Maternal Health Care Companion 🌱

> **She doesn't need another app. She needs you.**

**SheBloom** is a 100% open-source, gentle companion guide built entirely for the **caretakers**—the husbands, fathers, brothers, and friends who care deeply but often lack the medical vocabulary, time, or structured guidance required to support a pregnant loved one. 

Unlike traditional pregnancy apps that target the mother, SheBloom coaches the *caretaker* through daily routines, bridging time, knowledge, and emotional gaps, and syncing directly with clinical data to provide real-time, zero-cost, localized care alerts.

---

## 🌟 The Core Ideology

### 1. Bridging the Care Gaps
- **The Time Problem**: Caretaking happens in the margins of life. SheBloom adapts to the caretaker's daily rhythm. If they have 5 minutes, we show the 5-minute essential tasks. If they have 1 hour, we expand the care timeline.
- **The Knowledge Problem**: We remove the guesswork. Caretakers don't need to learn every detail about pregnancy; they are spoon-fed exact dietary requirements, warning signs, and trimester milestones *when* they matter.
- **The Emotional Problem**: We translate complex medical milestones into empathetic human instructions, teaching the "language of care."

### 2. Radical Accessibility (Zero-Cost Alerting)
Rural environments and resource-constrained families cannot rely on platforms that incur recurring telecom costs. Standard alerting involves Twilio/Vapi, charging per minute or per SMS. 
- **The SheBloom Approach**: We use **Capacitor push notifications** combined with Native On-Device Text-to-Speech (`window.speechSynthesis`).
- **The Result**: When a critical care moment is missed, the phone silently wakes up and **speaks aloud in the local dialect** (e.g., Tamil: *"வணக்கம், மருந்து நேரம் முடிந்துவிட்டது"*) directly out of the phone speaker without any phone call required. **$0.00 infrastructure cost, forever.**

---

## 🏗️ Technical Architecture

This repository is structured as a **Turborepo** monorepo, maintaining clear separation between our high-speed backend, our native frontend, and our shared database schemas.

### 1. `apps/web` (Next.js + Capacitor Native App)
To avoid maintaining split codebases (Swift/Kotlin/Web), we built the entire dashboard in **Next.js** and wrapped it using **Capacitor by Ionic**.
- **Web Dashboard**: Allows Doctors to log patient intake, prescribe care routines (e.g., "Iron 1x morning", "GDM Diet"), and view compliance.
- **Native iOS & Android App**: Reuses the Next.js UI but runs natively on the caretaker's phone, granting us hardware access to IndexedDB offline storage, Native Push Notifications, and the Local Speech Engine.

### 2. `apps/api` (Elysia.js Backend & Real-Time Engine)
Designed for immense throughput and minimal latency using **Bun** and **Elysia.js**.
- **REST APIs**: Handles the auto-provisioning of Caretaker credentials during a Doctor's patient intake.
- **WebSocket Bridge**: Houses a `ws://` endpoint acting as the real-time bridge.
- **Agentic Cron Engine**: Actively sweeps the database for missed care milestones (e.g., identifying that a 10:00 AM iron tablet was not logged by 10:30 AM) and fires immediate WebSocket/Push triggers to the mobile native shell.

### 3. Serverless Database (Neon PostgreSQL + Drizzle ORM)
- **Neon PostgreSQL**: Scalable serverless edge database.
- **Drizzle ORM**: Fully typed schema models mapping our tables (`users`, `care_circles`, `timeline_tasks`).
- The schema structure natively supports a many-to-one relationship, where multiple caretakers can belong to a single maternal `care_circle`.

### 4. Real-Time Physical IoT Integration (ESP32)
- We natively support ESP32 hardware streaming environmental telemetrics.
- **Workflow**: The ESP32 device pings Elysia WebSockets every 5 seconds with JSON payloads `{ temp: 26, humidity: 62 }`.
- **Broadcast**: Elysia instantly broadcasts these maternal environment metrics back to both the Doctor's clinic dashboard and the Caretaker's mobile app.

---

## 🔄 The Data Workflow

1. **Patient Intake**: The maternal patient checks in at the clinic. The doctor records conditions and prescribes care via the Web Dashboard.
2. **Timeline Generation**: Verified clinical data hits the Elysia API (`generateCareTimeline` engine), generating a customized 52-week timeline for the family.
3. **Caretaker Sync**: The caretaker opens their native Capacitor app. The app downloads the updated timeline and caches it locally via IndexedDB.
4. **Daily Execution**: The caretaker is fed bite-sized tasks based on their available time.
5. **Fail-Safe Alerting**: If compliance drops, Elysia triggers the Web Speech push payload. The caretaker's phone speaks the alert out loud at zero API cost.

---

## 🚀 Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Bun](https://bun.sh/) (for running Elysia at maximum speed)
- iOS Simulator / Android Studio (If building the Capacitor mobile targets)
- A Neon PostgreSQL Connection String

### 1. Clone & Install
\`\`\`bash
git clone https://github.com/iamharishrohith/SheBloom.git
cd SheBloom
npm install
\`\`\`

### 2. Environment Variables
You will need to set up your `.env` files in both the `apps/web` and `apps/api` directories. 
Make sure you include your `DATABASE_URL` pointing to your Neon Postgres instance.

### 3. Database Migrations
We use Drizzle ORM. Push the schema to your Neon database:
\`\`\`bash
cd apps/api
bun run db:push
\`\`\`

### 4. Start the Development Servers
Run the whole monorepo concurrently:
\`\`\`bash
npm run dev
\`\`\`
- Next.js Web App will run on \`http://localhost:3000\`
- Elysia API & WebSockets will run on \`http://localhost:3001\`

### 5. Running Native Mobile (Capacitor)
To build and run the caretaker app natively:
\`\`\`bash
cd apps/web
npm run build
npx cap sync
npx cap open ios    # or npx cap open android
\`\`\`

---

## 🤝 Contributing

We believe every mother deserves a care circle that understands what to do. If you're passionate about rural health, zero-cost architecture, or maternal care, please consider contributing. 

- Browse the open issues.
- We strictly adhere to PR guidelines involving type safety (TypeScript) and exhaustive testing for any clinical logic.

---

*“To care for those who once cared for us is one of the highest honors.”*
