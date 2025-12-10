"use client";

import { Users, Stethoscope, UserCheck, Calendar, DollarSign, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const statCards = [
    {
        title: "Total Users",
        key: "totalUsers",
        icon: Users,
        gradient: "from-blue-500 to-cyan-500",
        bgGradient: "from-blue-500/10 to-cyan-500/10",
    },
    {
        title: "Doctors",
        key: "totalDoctors",
        icon: Stethoscope,
        gradient: "from-emerald-500 to-teal-500",
        bgGradient: "from-emerald-500/10 to-teal-500/10",
    },
    {
        title: "Patients",
        key: "totalPatients",
        icon: UserCheck,
        gradient: "from-purple-500 to-pink-500",
        bgGradient: "from-purple-500/10 to-pink-500/10",
    },
    {
        title: "Appointments",
        key: "totalAppointments",
        icon: Calendar,
        gradient: "from-orange-500 to-amber-500",
        bgGradient: "from-orange-500/10 to-amber-500/10",
    },
    {
        title: "Completed",
        key: "completedAppointments",
        icon: Clock,
        gradient: "from-green-500 to-emerald-500",
        bgGradient: "from-green-500/10 to-emerald-500/10",
    },
    {
        title: "Revenue",
        key: "totalRevenue",
        icon: DollarSign,
        gradient: "from-yellow-500 to-orange-500",
        bgGradient: "from-yellow-500/10 to-orange-500/10",
        isCurrency: true,
    },
];

export function DashboardStats({ stats }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {statCards.map((card) => {
                const Icon = card.icon;
                const value = stats[card.key] || 0;

                return (
                    <Card
                        key={card.key}
                        className={`relative overflow-hidden bg-gradient-to-br ${card.bgGradient} border-0 hover:scale-105 transition-transform duration-300`}
                    >
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-2">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${card.gradient} flex items-center justify-center shadow-lg`}>
                                    <Icon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">
                                        {card.isCurrency ? `$${value.toLocaleString()}` : value.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{card.title}</p>
                                </div>
                            </div>
                            {/* Decorative gradient */}
                            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-gradient-to-r ${card.gradient} opacity-20 blur-2xl`} />
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
