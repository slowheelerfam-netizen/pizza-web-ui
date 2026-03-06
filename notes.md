# Pizza Project Session Notes

## Project
Next.js pizza POS system — Krusty's Pizzeria
Repo: [your github url]

## Stack
- Next.js (App Router, server components)
- Tailwind CSS
- Prisma + PostgreSQL
- Deployed on [your host]

## Current Session Progress

### Completed Today
- Elapsed time timer on order cards (green/orange/red)
- Order source selector (Walk-In, Phone, Internal) with colored badges
- Payment confirmation screen (Cash, Credit Card, Debit Card, Apple Pay, Google Pay)
- Dynamic header - Kitchen shows "| Kitchen", Register shows "| Register"
- Nav links aligned right on Register, hidden on Kitchen

### Next Up
- Monitor page: full width layout, large text, designed for TV/large screen
- Phone number auto-format with default area code
- Update NOTES.md with feature flag / SaaS pricing tier architecture

## Future Features

### Offline / Local Network Mode
- Swap Supabase for local PostgreSQL install
- Run Next.js server on a local machine (Mac Mini, NUC, etc.)
- All devices (register, kitchen, monitor) connect via local IP e.g. http://192.168.1.100:3000
- No internet required — restaurant keeps functioning if internet goes down
- Hybrid option: local first, sync to cloud when internet available
- Selling point: "offline-capable POS system"


## Future Research
- Explore processor-free payment options (ACH at POS, tap-to-pay, cash discount programs)
- Goal: reduce or eliminate 2.6% processor fee for restaurant owners