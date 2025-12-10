import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PendingDoctors } from "./components/pending-doctors";
import { VerifiedDoctors } from "./components/verified-doctors";
import { PendingPayouts } from "./components/pending-payouts";
import { DashboardStats } from "./components/dashboard-stats";
import { DashboardCharts } from "./components/dashboard-charts";
import { RecentAppointments } from "./components/recent-appointments";
import {
  getPendingDoctors,
  getVerifiedDoctors,
  getPendingPayouts,
  getAdminStats,
  getMonthlyStats,
  getRecentAppointments,
} from "@/actions/admin";
import { Users, Stethoscope, DollarSign, LayoutDashboard } from "lucide-react";

export default async function AdminPage() {
  // Fetch all data in parallel
  const [
    pendingDoctorsData,
    verifiedDoctorsData,
    pendingPayoutsData,
    statsData,
    monthlyData,
    recentAppointmentsData,
  ] = await Promise.all([
    getPendingDoctors(),
    getVerifiedDoctors(),
    getPendingPayouts(),
    getAdminStats(),
    getMonthlyStats(),
    getRecentAppointments(),
  ]);

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
          <LayoutDashboard className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your platform statistics and management
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={statsData} />

      {/* Charts */}
      <DashboardCharts monthlyData={monthlyData.data || []} />

      {/* Recent Appointments */}
      <RecentAppointments appointments={recentAppointmentsData.appointments || []} />

      {/* Management Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 p-1 rounded-xl">
          <TabsTrigger
            value="pending"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Pending</span>
            {pendingDoctorsData.doctors?.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {pendingDoctorsData.doctors.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="doctors"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg"
          >
            <Stethoscope className="h-4 w-4" />
            <span className="hidden sm:inline">Doctors</span>
          </TabsTrigger>
          <TabsTrigger
            value="payouts"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg"
          >
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Payouts</span>
            {pendingPayoutsData.payouts?.length > 0 && (
              <span className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {pendingPayoutsData.payouts.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="border-none p-0 mt-6">
          <PendingDoctors doctors={pendingDoctorsData.doctors || []} />
        </TabsContent>

        <TabsContent value="doctors" className="border-none p-0 mt-6">
          <VerifiedDoctors doctors={verifiedDoctorsData.doctors || []} />
        </TabsContent>

        <TabsContent value="payouts" className="border-none p-0 mt-6">
          <PendingPayouts payouts={pendingPayoutsData.payouts || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}