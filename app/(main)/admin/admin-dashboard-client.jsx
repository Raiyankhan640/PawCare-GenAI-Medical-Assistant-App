"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  Stethoscope,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Brain,
  Sparkles,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  LineChart,
  Settings,
  Bell,
  Search,
  RefreshCw,
  Loader2,
  UserCheck,
  UserX,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Shield,
  Eye,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import UserManagement from "./components/user-management";

// Chart components
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  LineChart as RechartsLineChart,
  Line,
} from "recharts";

// AI Insights Component
function AIInsights({ stats, monthlyData }) {
  const [insights, setInsights] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateInsights();
  }, [stats, monthlyData]);

  const generateInsights = () => {
    setIsGenerating(true);
    
    // Simulate AI generating insights based on data
    setTimeout(() => {
      const newInsights = [];
      
      // Growth analysis
      if (monthlyData?.length >= 2) {
        const lastMonth = monthlyData[monthlyData.length - 1];
        const prevMonth = monthlyData[monthlyData.length - 2];
        const appointmentGrowth = prevMonth.appointments > 0 
          ? ((lastMonth.appointments - prevMonth.appointments) / prevMonth.appointments * 100).toFixed(1)
          : 0;
        
        if (appointmentGrowth > 10) {
          newInsights.push({
            type: "positive",
            icon: TrendingUp,
            title: "Strong Growth Detected",
            description: `Appointments increased by ${appointmentGrowth}% compared to last month. Consider expanding doctor capacity.`,
          });
        } else if (appointmentGrowth < -10) {
          newInsights.push({
            type: "warning",
            icon: TrendingDown,
            title: "Declining Appointments",
            description: `Appointments decreased by ${Math.abs(appointmentGrowth)}%. Review marketing strategies and patient feedback.`,
          });
        }
      }

      // Doctor approval insights
      if (stats?.pendingDoctors > 5) {
        newInsights.push({
          type: "warning",
          icon: AlertCircle,
          title: "Pending Approvals Queue",
          description: `${stats.pendingDoctors} doctors awaiting verification. Prioritize review to maintain platform growth.`,
        });
      }

      // Completion rate insights
      if (stats?.completionRate < 70) {
        newInsights.push({
          type: "warning",
          icon: XCircle,
          title: "Low Completion Rate",
          description: `Only ${stats.completionRate}% of appointments are completed. Investigate cancellation reasons.`,
        });
      } else if (stats?.completionRate > 90) {
        newInsights.push({
          type: "positive",
          icon: CheckCircle,
          title: "Excellent Completion Rate",
          description: `${stats.completionRate}% completion rate indicates high patient satisfaction and doctor reliability.`,
        });
      }

      // Revenue insight
      if (stats?.totalRevenue > 10000) {
        newInsights.push({
          type: "positive",
          icon: DollarSign,
          title: "Revenue Milestone",
          description: `Platform has generated $${stats.totalRevenue.toLocaleString()} in total revenue. Consider premium features.`,
        });
      }

      // Chat engagement
      if (stats?.chatMessages > 100) {
        newInsights.push({
          type: "positive",
          icon: MessageSquare,
          title: "High AI Chat Engagement",
          description: `${stats.chatMessages} AI chat messages indicate strong user engagement with PetChat feature.`,
        });
      }

      setInsights(newInsights);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <Card className="bg-gradient-to-br from-violet-950/40 to-purple-950/40 border-violet-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-violet-500/20 rounded-lg">
              <Brain className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                AI Insights
                <Sparkles className="h-4 w-4 text-violet-400" />
              </CardTitle>
              <CardDescription>Powered by intelligent analytics</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={generateInsights}
            disabled={isGenerating}
            className="text-violet-400 hover:text-violet-300"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isGenerating ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-violet-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing platform data...</span>
            </div>
          </div>
        ) : insights.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No significant insights at this time
          </p>
        ) : (
          insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border ${
                insight.type === "positive"
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-amber-500/10 border-amber-500/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <insight.icon
                  className={`h-5 w-5 mt-0.5 ${
                    insight.type === "positive" ? "text-emerald-400" : "text-amber-400"
                  }`}
                />
                <div>
                  <p className="font-medium text-white text-sm">{insight.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, trend, trendValue, color, subtitle }) {
  const colors = {
    emerald: "from-emerald-600 to-teal-600",
    blue: "from-blue-600 to-cyan-600",
    violet: "from-violet-600 to-purple-600",
    amber: "from-amber-600 to-orange-600",
    pink: "from-pink-600 to-rose-600",
    indigo: "from-indigo-600 to-blue-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors[color]} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold text-white">{value}</p>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]} shadow-lg`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          {trend && (
            <div className="flex items-center gap-1 mt-3">
              {trend === "up" ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-400" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-400" />
              )}
              <span className={trend === "up" ? "text-emerald-400" : "text-red-400"}>
                {trendValue}
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs last month</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Charts Component
function DashboardCharts({ monthlyData, appointmentStatusData, specialtyStats }) {
  const COLORS = ["#10B981", "#3B82F6", "#EF4444", "#F59E0B", "#8B5CF6", "#EC4899"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue & Appointments Chart */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-400" />
            Revenue & Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Revenue ($)"
              />
              <Area
                type="monotone"
                dataKey="appointments"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorAppointments)"
                name="Appointments"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Appointment Status Pie Chart */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <PieChart className="h-5 w-5 text-blue-400" />
            Appointment Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={appointmentStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {appointmentStatusData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* User Growth Chart */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <LineChart className="h-5 w-5 text-violet-400" />
            User Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="newUsers"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ fill: "#8B5CF6" }}
                name="New Users"
              />
              <Line
                type="monotone"
                dataKey="newDoctors"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: "#10B981" }}
                name="New Doctors"
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Specialty Distribution */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-pink-400" />
            Doctor Specialties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={specialtyStats} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" />
              <YAxis dataKey="specialty" type="category" stroke="#9CA3AF" width={120} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#EC4899" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

// Recent Activity Component
function RecentActivity({ appointments }) {
  return (
    <Card className="bg-slate-900/50 border-slate-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-400" />
            Recent Appointments
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-emerald-400">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments?.slice(0, 6).map((apt, index) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={apt.patient?.imageUrl} />
                <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                  {apt.patient?.name?.[0] || "P"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{apt.patient?.name || "Patient"}</p>
                <p className="text-sm text-muted-foreground truncate">
                  with Dr. {apt.doctor?.name || "Doctor"} • {apt.doctor?.specialty}
                </p>
              </div>
              <Badge
                className={
                  apt.status === "COMPLETED"
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : apt.status === "CANCELLED"
                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                    : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                }
              >
                {apt.status}
              </Badge>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Pending Doctors Component
function PendingDoctorsPanel({ doctors, onRefresh }) {
  const handleApprove = async (doctorId) => {
    try {
      const response = await fetch("/api/admin/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId, action: "approve" }),
      });
      if (response.ok) {
        toast.success("Doctor approved successfully");
        onRefresh();
      }
    } catch (error) {
      toast.error("Failed to approve doctor");
    }
  };

  const handleReject = async (doctorId) => {
    try {
      const response = await fetch("/api/admin/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId, action: "reject" }),
      });
      if (response.ok) {
        toast.success("Doctor rejected");
        onRefresh();
      }
    } catch (error) {
      toast.error("Failed to reject doctor");
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-amber-400" />
          Pending Approvals
          {doctors?.length > 0 && (
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              {doctors.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {doctors?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-emerald-400" />
            <p>No pending approvals</p>
          </div>
        ) : (
          <div className="space-y-4">
            {doctors?.map((doctor) => (
              <div
                key={doctor.id}
                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={doctor.imageUrl} />
                    <AvatarFallback className="bg-amber-500/20 text-amber-400">
                      {doctor.name?.[0] || "D"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{doctor.name}</p>
                    <p className="text-sm text-muted-foreground">{doctor.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {doctor.specialty}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {doctor.experience} years exp.
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleApprove(doctor.id)}
                  >
                    <UserCheck className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleReject(doctor.id)}
                  >
                    <UserX className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  {doctor.credentialUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(doctor.credentialUrl, "_blank")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Main Dashboard Component
export default function AdminDashboardClient() {
  const { user: clerkUser, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!clerkUser?.id) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/dashboard?clerkUserId=${clerkUser.id}`);
      const result = await response.json();
      
      if (result.error) {
        setError(result.error);
        if (response.status === 403) {
          toast.error("Admin access required");
          router.push("/");
        }
      } else {
        setData(result);
      }
    } catch (err) {
      setError("Failed to load dashboard");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && clerkUser) {
      fetchData();
    }
  }, [isLoaded, clerkUser]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-400 mx-auto" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => router.push("/")}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
          >
            <Zap className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-emerald-200 to-teal-200 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Real-time analytics & platform management
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            className="border-emerald-500/30 hover:bg-emerald-500/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-emerald-400">Live</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={data?.stats?.totalUsers?.toLocaleString() || "0"}
          icon={Users}
          color="blue"
          subtitle={`${data?.stats?.totalPatients || 0} patients, ${data?.stats?.totalDoctors || 0} doctors`}
        />
        <StatCard
          title="Verified Doctors"
          value={data?.stats?.verifiedDoctors?.toLocaleString() || "0"}
          icon={Stethoscope}
          color="emerald"
          subtitle={`${data?.stats?.pendingDoctors || 0} pending approval`}
        />
        <StatCard
          title="Total Appointments"
          value={data?.stats?.totalAppointments?.toLocaleString() || "0"}
          icon={Calendar}
          color="violet"
          subtitle={`${data?.stats?.completionRate || 0}% completion rate`}
        />
        <StatCard
          title="Total Revenue"
          value={`$${(data?.stats?.totalRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
          color="amber"
          subtitle="From credit purchases"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-700/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Clock className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{data?.stats?.todayAppointments || 0}</p>
              <p className="text-xs text-muted-foreground">Today's Appointments</p>
            </div>
          </div>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{data?.stats?.completedAppointments || 0}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/20">
              <MessageSquare className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{data?.stats?.chatMessages || 0}</p>
              <p className="text-xs text-muted-foreground">AI Chat Messages</p>
            </div>
          </div>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700/50 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-pink-500/20">
              <CreditCard className="h-5 w-5 text-pink-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{data?.pendingPayouts?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Pending Payouts</p>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Insights & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCharts
            monthlyData={data?.monthlyData || []}
            appointmentStatusData={data?.appointmentStatusData || []}
            specialtyStats={data?.specialtyStats || []}
          />
        </div>
        <div className="space-y-6">
          <AIInsights stats={data?.stats} monthlyData={data?.monthlyData} />
          <PendingDoctorsPanel
            doctors={data?.pendingDoctors}
            onRefresh={fetchData}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity appointments={data?.recentAppointments} />

      {/* Management Tabs */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-slate-400" />
            Platform Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="doctors" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 p-1 rounded-xl">
              <TabsTrigger
                value="doctors"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg"
              >
                <Stethoscope className="h-4 w-4 mr-2" />
                Doctors ({data?.verifiedDoctors?.length || 0})
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Pending ({data?.pendingDoctors?.length || 0})
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg"
              >
                <Users className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger
                value="payouts"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Payouts ({data?.pendingPayouts?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="doctors" className="mt-6">
              <div className="grid gap-4">
                {data?.verifiedDoctors?.slice(0, 8).map((doctor) => (
                  <div
                    key={doctor.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50"
                  >
                    <Avatar>
                      <AvatarImage src={doctor.imageUrl} />
                      <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                        {doctor.name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-white">{doctor.name}</p>
                      <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400">
                      Verified
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              {data?.pendingDoctors?.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-emerald-400" />
                  <p>All doctors have been reviewed</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {data?.pendingDoctors?.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50"
                    >
                      <Avatar>
                        <AvatarImage src={doctor.imageUrl} />
                        <AvatarFallback className="bg-amber-500/20 text-amber-400">
                          {doctor.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-white">{doctor.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doctor.specialty} • {doctor.experience} years
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <UserManagement />
            </TabsContent>

            <TabsContent value="payouts" className="mt-6">
              {data?.pendingPayouts?.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CreditCard className="h-12 w-12 mx-auto mb-3 text-slate-400" />
                  <p>No pending payout requests</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {data?.pendingPayouts?.map((payout) => (
                    <div
                      key={payout.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50"
                    >
                      <Avatar>
                        <AvatarFallback className="bg-violet-500/20 text-violet-400">
                          {payout.doctor?.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-white">{payout.doctor?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {payout.credits} credits • ${payout.credits * 8}
                        </p>
                      </div>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        Approve Payout
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
