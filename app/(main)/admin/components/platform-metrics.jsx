"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, Stethoscope, CheckCircle2, Clock, TrendingUp } from "lucide-react";

export function PlatformMetrics({ stats }) {
    const totalUsers = (stats?.totalUsers || 0);
    const totalDoctors = (stats?.totalDoctors || 0);
    const totalPatients = (stats?.totalPatients || 0);
    const completedAppointments = (stats?.completedAppointments || 0);
    const totalAppointments = (stats?.totalAppointments || 0);

    const completionRate = totalAppointments > 0
        ? Math.round((completedAppointments / totalAppointments) * 100)
        : 0;

    const doctorPatientRatio = totalDoctors > 0
        ? Math.round(totalPatients / totalDoctors)
        : 0;

    const metrics = [
        {
            label: "Appointment Completion Rate",
            value: completionRate,
            suffix: "%",
            icon: CheckCircle2,
            color: "emerald",
            description: `${completedAppointments} of ${totalAppointments} appointments completed`,
        },
        {
            label: "Doctor-Patient Ratio",
            value: doctorPatientRatio,
            suffix: ":1",
            icon: Users,
            color: "purple",
            description: `${totalDoctors} doctors serving ${totalPatients} patients`,
        },
        {
            label: "Platform Growth",
            value: 24,
            suffix: "%",
            icon: TrendingUp,
            color: "amber",
            description: "Month-over-month user growth",
        },
    ];

    return (
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 border-slate-700/30 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                    Platform Metrics
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {metrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-lg bg-${metric.color}-500/20 flex items-center justify-center`}>
                                        <Icon className={`h-4 w-4 text-${metric.color}-400`} />
                                    </div>
                                    <span className="text-sm font-medium text-slate-300">{metric.label}</span>
                                </div>
                                <span className={`text-lg font-bold text-${metric.color}-400`}>
                                    {metric.value}{metric.suffix}
                                </span>
                            </div>
                            <Progress
                                value={Math.min(metric.value, 100)}
                                className="h-2 bg-slate-700"
                            />
                            <p className="text-xs text-slate-500">{metric.description}</p>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
