import { fetchDashboardData, updateStatusAction } from './actions'
import AdminDashboard from '../components/AdminDashboard'
import OrderCreationForm from '../components/OrderCreationForm'
import SystemWarnings from '../components/SystemWarnings'
import AuditLog from '../components/AuditLog'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const data = await fetchDashboardData()

  return (
    <main className="min-h-screen bg-gray-50/50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <header className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-indigo-900">
              Pizza Shop Operations
            </h1>
            <p className="mt-2 text-lg font-medium text-indigo-600/80">
              Manage orders, track status, and view alerts
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <SystemWarnings warnings={data.warnings} />
            <AuditLog actions={data.actions} />
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
              <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              System Online
            </span>
          </div>
        </header>

        {/* Main Content Grid: Order Form & Dashboard */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Create Order */}
          <section className="lg:col-span-4">
            <OrderCreationForm />
          </section>

          {/* Right Column: Live Dashboard */}
          <section className="lg:col-span-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
                <span className="text-2xl">📊</span> Live Dashboard
              </h2>
            </div>
            <AdminDashboard
              orders={data.orders}
              updateStatusAction={updateStatusAction}
            />
          </section>
        </div>
      </div>
    </main>
  )
}
