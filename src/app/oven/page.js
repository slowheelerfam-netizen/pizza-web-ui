import { fetchDashboardData, updateStatusAction } from '../actions'
import Oven from '../../components/Oven'

export const dynamic = 'force-dynamic'

export default async function OvenPage() {
  const data = await fetchDashboardData()

  return (
    <main className="min-h-screen bg-slate-900">
      <Oven
        initialOrders={data.orders}
        updateStatusAction={updateStatusAction}
      />
    </main>
  )
}
