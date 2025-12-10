"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, Clock, Activity, UserCheck } from "lucide-react";

const statCards = [
    {
        title: "Total Users",
        key: "totalUsers",
        icon: Users,
        trend: "+12%",
        trendUp: true,
        gradient: "from-blue-500 to-cyan-500",
        bgGradient: "from-blue-500/10 to-cyan-500/10",
    },
    {
        title: "Active Doctors",
        key: "totalDoctors",
        icon: UserCheck,
        trend: "+5%",
        trendUp: true,
        gradient: "from-emerald-500 to-teal-500",
        bgGradient: "from-emerald-500/10 to-teal-500/10",
    },
    {
        title: "Total Patients",
        key: "totalPatients",
        icon: Activity,
        trend: "+18%",
        trendUp: true,
        gradient: "from-purple-500 to-pink-500",
        bgGradient: "from-purple-500/10 to-pink-500/10",
    },
    {
        title: "Appointments",
        key: "totalAppointments",
        icon: Calendar,
        trend: "+24%",
        trendUp: true,
        gradient: "from-orange-500 to-amber-500",
        bgGradient: "from-orange-500/10 to-amber-500/10",
    },
    {
        title: "Completed",
        key: "completedAppointments",
        icon: Clock,
        trend: "+8%",
        trendUp: true,
        gradient: "from-green-500 to-emerald-500",
        bgGradient: "from-green-500/10 to-emerald-500/10",
    },
    {
        title: "Revenue",
        key: "totalRevenue",
        icon: DollarSign,
        trend: "+32%",
        trendUp: true,
        gradient: "from-yellow-500 to-orange-500",
        bgGradient: "from-yellow-500/10 to-orange-500/10",
        isCurrency: true,
    },
];

export function DashboardStats({ stats }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {statCards.map((card, index) => {
                const Icon = card.icon;
                const value = stats[card.key] || 0;

                return (
                    <Card
                        key={card.key}
                        className={`group relative overflow-hidden bg-gradient-to-br ${card.bgGradient} border-0 hover:scale-105 transition-all duration-500 cursor-pointer`}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${card.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="h-5 w-5 text-white" />
                                    </div>
                                    <div className={`flex items-center gap-1 text-xs font-medium ${card.trendUp ? 'text-green-400' : 'text-red-400'}`}>
                                        {card.trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                        {card.trend}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white group-hover:scale-105 transition-transform origin-left">
                                        {card.isCurrency ? `$${value.toLocaleString()}` : value.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{card.title}</p>
                                </div>
                            </div>
                            {/* Animated gradient overlay on hover */}
                            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-gradient-to-r ${card.gradient} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500`} />
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
