import OrderCreationForm from '../components/OrderCreationForm'
import AdminDashboard from '../components/AdminDashboard'
import { fetchDashboardData } from './actions'

// Force dynamic rendering so we always see the latest in-memory state
export const dynamic = 'force-dynamic'

export default async function Home() {
  const data = await fetchDashboardData()

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Pizza Order System</h1>
          <p className="text-gray-600">Domain-Driven Design Prototype</p>
        </header>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">New Order Entry</h2>
          <OrderCreationForm />
        </section>

        <section className="border-t pt-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Admin Dashboard</h2>
          <AdminDashboard 
            orders={data.orders} 
            warnings={data.warnings} 
            actions={data.actions} 
          />
        </section>
      </div>
    </main>
  )
}
