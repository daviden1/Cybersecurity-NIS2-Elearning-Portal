import { AuthGuard } from '@/components/AuthGuard'
import { LiveChat } from '@/components/support/LiveChat'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AuthGuard requireAuth={true}>{children}</AuthGuard>
      <LiveChat />
    </>
  )
}
