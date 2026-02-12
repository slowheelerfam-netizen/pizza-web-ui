import { fetchDashboardData, updateStatusAction } from '../actions'
import MonitorDisplay from '../../components/MonitorDisplay'

export const dynamic = 'force-dynamic'

export default async function MonitorPage() {
  const data = await fetchDashboardData()

  // Filter for active orders to show on monitor
  // Monitor now shows MONITOR (Prep) and OVEN orders
  const safeOrders = Array.isArray(data.orders) ? data.orders : []
  const activeOrders = safeOrders.filter((order) =>
    ['MONITOR', 'OVEN'].includes(order.status)
  )

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <MonitorDisplay
        initialOrders={activeOrders}
        updateStatusAction={updateStatusAction}
      />
    </main>
  )
}
