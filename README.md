# Krusty Pizzeria - Full-Stack Pizza Restaurant POS & Ordering System

This is a comprehensive, full-stack web application designed to simulate a real-world pizza restaurant's ordering and kitchen management system. It features a public-facing interface for customers to browse the menu and place orders, as well as internal views for staff to manage orders from the register and the kitchen.

**Live Demo:** [Link to your Vercel deployment]

---

## Key Features

*   **Public-Facing Customer Interface:**
    *   **Interactive Menu:** A visually appealing and interactive menu where customers can see available pizzas.
    *   **Dynamic Pizza Builder:** Customers can build a custom pizza from scratch or select a pre-designed pizza and customize its toppings.
    *   **Real-Time Price Calculation:** The total price updates instantly as toppings are added or removed.
    *   **Online Ordering & Checkout:** A streamlined checkout process allows customers to place orders for pickup, providing their name and phone number.
    *   **Multiple Payment Options:** Supports mock payments via "Credit Card," "Google Pay," "Apple Pay," and "Cash at Register."

*   **Internal Staff Interfaces:**
    *   **Register View (`/`):** Displays all active orders, allows staff to create new "walk-in" orders, and provides the ability to mark cash orders as "Paid" upon payment collection.
    *   **Kitchen View (`/kitchen`):** A real-time dashboard for kitchen staff to track and manage the lifecycle of an order.
    *   **Order Progression:** Staff can advance an order through multiple statuses: `PREP` -> `OVEN` -> `BOXING` -> `READY`.
    *   **Kitchen Monitor (`/monitor`):** A dedicated, auto-refreshing display showing only orders currently in the `PREP` and `OVEN` stages, designed for at-a-glance viewing in the kitchen.
    *   **Order Archiving:** Completed orders are automatically hidden from the active dashboards to keep the interface clean.

## Tech Stack

This project was built with a modern, robust, and scalable technology stack, demonstrating proficiency in full-stack development.

*   **Framework:** **Next.js 14** (App Router)
*   **Language:** **JavaScript**
*   **Styling:** **Tailwind CSS**
*   **Database ORM:** **Prisma**
*   **Database:** **PostgreSQL** (hosted on **Supabase**)
*   **Deployment:** **Vercel**

## Project Structure

The codebase is organized following modern best practices, separating concerns for maintainability and scalability.

```
/
├── prisma/
│   └── schema.prisma      # Defines the database schema
├── public/
│   └── images/            # Static assets like pizza images
├── src/
│   ├── app/               # Core application routing and pages (Next.js App Router)
│   │   ├── (internal)/    # Route group for staff-only pages
│   │   │   ├── kitchen/
│   │   │   └── monitor/
│   │   ├── api/           # API routes (if any)
│   │   ├── layout.js      # Root layout
│   │   └── page.js        # Landing/Register page
│   ├── components/        # Reusable React components (e.g., Modals, Buttons, Order Cards)
│   ├── infrastructure/    # Data-layer logic (e.g., Prisma repository implementations)
│   ├── server/            # Server-side business logic and services
│   └── types/             # Shared data models and constants (e.g., toppings, menu items)
├── .env.example           # Example environment file
├── next.config.mjs        # Next.js configuration
└── package.json           # Project dependencies and scripts
```

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the environment:**
    *   Create a new PostgreSQL database (e.g., on Supabase).
    *   Rename the `.env.example` file to `.env`.
    *   Update the `DATABASE_URL` in the `.env` file with your database connection string.

4.  **Push the database schema:**
    *   The schema is defined in `prisma/schema.prisma`. You can use Prisma Migrate to create the tables.
    ```bash
    npx prisma migrate dev
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Deployment

This application is configured for seamless deployment on **Vercel**.

1.  Push the code to a GitHub repository.
2.  Import the repository into Vercel.
3.  Set the `DATABASE_URL` environment variable in the Vercel project settings.
4.  Vercel will automatically detect the Next.js framework, run the `npm run build` command (which includes `prisma generate`), and deploy the application.

