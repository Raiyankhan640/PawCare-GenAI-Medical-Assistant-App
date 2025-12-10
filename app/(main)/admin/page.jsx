import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PendingDoctors } from "./components/pending-doctors";
import { VerifiedDoctors } from "./components/verified-doctors";
import { PendingPayouts } from "./components/pending-payouts";
import { DashboardStats } from "./components/dashboard-stats";
import { DashboardCharts } from "./components/dashboard-charts";
import { RecentAppointments } from "./components/recent-appointments";
import { PlatformMetrics } from "./components/platform-metrics";
import { ActivityFeed } from "./components/activity-feed";
import {
  getPendingDoctors,
  getVerifiedDoctors,
  getPendingPayouts,
  getAdminStats,
  getMonthlyStats,
  getRecentAppointments,
} from "@/actions/admin";
import { Users, Stethoscope, DollarSign, LayoutDashboard, BarChart3, Settings } from "lucide-react";

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <LayoutDashboard className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time analytics and platform management
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm text-emerald-400">Live Data</span>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={statsData} />

      {/* Charts Section */}
      <DashboardCharts monthlyData={monthlyData.data || []} />

      {/* Activity & Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments - spans 2 columns */}
        <div className="lg:col-span-2">
          <RecentAppointments appointments={recentAppointmentsData.appointments || []} />
        </div>

        {/* Platform Metrics */}
        <div className="space-y-6">
          <PlatformMetrics stats={statsData} />
        </div>
      </div>

      {/* Activity Feed */}
      <ActivityFeed />

      {/* Management Tabs */}
      <div className="pt-4">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5 text-slate-400" />
          Platform Management
        </h2>
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 p-1 rounded-xl h-12">
            <TabsTrigger
              value="pending"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg transition-all"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Pending Doctors</span>
              <span className="sm:hidden">Pending</span>
              {pendingDoctorsData.doctors?.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {pendingDoctorsData.doctors.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="doctors"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg transition-all"
            >
              <Stethoscope className="h-4 w-4" />
              <span className="hidden sm:inline">Verified Doctors</span>
              <span className="sm:hidden">Doctors</span>
            </TabsTrigger>
            <TabsTrigger
              value="payouts"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg transition-all"
            >
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Pending Payouts</span>
              <span className="sm:hidden">Payouts</span>
              {pendingPayoutsData.payouts?.length > 0 && (
                <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
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
    </div>
  );
}