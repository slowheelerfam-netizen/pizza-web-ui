import { fetchDashboardData } from '../actions'
import KitchenMonitor from '@/components/KitchenMonitor'

export const dynamic = 'force-dynamic'

export default async function MonitorPage() {
  const data = await fetchDashboardData()
  const initialOrders = data?.orders || []

  const activeOrders = initialOrders.filter(
    (o) => o.status === 'PREP' || o.status === 'OVEN'
  )

  return <KitchenMonitor initialOrders={activeOrders} />
}
