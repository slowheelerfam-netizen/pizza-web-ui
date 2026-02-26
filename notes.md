# Pizza Project Session Notes

## Project
Next.js pizza POS system — Krusty's Pizzeria
Repo: [your github url]

## Stack
- Next.js (App Router, server components)
- Tailwind CSS
- Prisma + PostgreSQL
- Deployed on [your host]

## Current State
- Header: full-width red background, z-50, working nav
- Home page: HomeWelcomeModal (shows once per session via sessionStorage)
- Kitchen page (/kitchen): 
  - KitchenWelcomeModal (shows once per session)
  - KitchenTooltip (appears after modal closes, explains manual order progression)
  - Both modals live inside PublicOrderInterface via showKitchenModals prop
- Monitor page (/monitor): PREP orders only, single column
- PublicOrderInterface: shared by Register and Kitchen, uses isRegisterView prop
- All branding updated to Krusty's Pizza

## Next Up
- LinkedIn post update
- Any new features TBD