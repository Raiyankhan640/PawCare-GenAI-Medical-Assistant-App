"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    PieChart,
    Pie,
    Cell,
    Legend,
    LineChart,
    Line,
} from "recharts";
import { TrendingUp, DollarSign, Calendar, Activity } from "lucide-react";

const COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-lg p-3 shadow-xl">
                <p className="text-slate-300 text-sm font-medium mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: {entry.name === 'revenue' ? `$${entry.value}` : entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export function DashboardCharts({ monthlyData, appointmentsBySpecialty = [] }) {
    // Generate specialty data if not provided
    const specialtyData = appointmentsBySpecialty.length > 0 ? appointmentsBySpecialty : [
        { name: "General", value: 35 },
        { name: "Surgery", value: 20 },
        { name: "Dermatology", value: 15 },
        { name: "Cardiology", value: 12 },
        { name: "Dentistry", value: 10 },
        { name: "Other", value: 8 },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue & Appointments Area Chart */}
            <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 border-slate-700/30 backdrop-blur-sm">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-400" />
                            Revenue & Appointments Trend
                        </CardTitle>
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                <span className="text-slate-400">Appointments</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-amber-500" />
                                <span className="text-slate-400">Revenue</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData}>
                                <defs>
                                    <linearGradient id="appointmentGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} yAxisId="left" />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} yAxisId="right" orientation="right" tickFormatter={(v) => `$${v}`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="appointments"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    fill="url(#appointmentGradient)"
                                    yAxisId="left"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#f59e0b"
                                    strokeWidth={2}
                                    fill="url(#revenueGradient)"
                                    yAxisId="right"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Appointments by Specialty Pie Chart */}
            <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 border-slate-700/30 backdrop-blur-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                        <Activity className="h-5 w-5 text-purple-400" />
                        Appointments by Specialty
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={specialtyData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={{ stroke: '#64748b', strokeWidth: 1 }}
                                >
                                    {specialtyData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            className="hover:opacity-80 transition-opacity cursor-pointer"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: '1px solid #334155',
                                        borderRadius: '8px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Monthly Revenue Bar Chart */}
            <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 border-slate-700/30 backdrop-blur-sm lg:col-span-2">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-amber-400" />
                        Monthly Revenue Breakdown
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#d97706" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey="revenue"
                                    fill="url(#barGradient)"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={50}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
