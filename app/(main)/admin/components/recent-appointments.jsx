"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock } from "lucide-react";
import { format } from "date-fns";

const statusColors = {
    SCHEDULED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    COMPLETED: "bg-green-500/20 text-green-400 border-green-500/30",
    CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
};

export function RecentAppointments({ appointments }) {
    if (!appointments || appointments.length === 0) {
        return (
            <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/30">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-emerald-400" />
                        Recent Appointments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                        No appointments yet
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/30">
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-emerald-400" />
                    Recent Appointments
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {appointments.map((apt) => (
                        <div
                            key={apt.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800/70 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                                    {apt.patient?.name?.charAt(0) || "?"}
                                </div>
                                <div>
                                    <p className="font-medium text-sm">
                                        {apt.patient?.name || "Unknown Patient"}
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        Dr. {apt.doctor?.name || "Unknown"} • {apt.doctor?.specialty || "N/A"}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right flex items-center gap-3">
                                <div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                                        <Clock className="h-3 w-3" />
                                        {format(new Date(apt.startTime), "MMM d, h:mm a")}
                                    </p>
                                </div>
                                <Badge
                                    variant="outline"
                                    className={statusColors[apt.status] || statusColors.SCHEDULED}
                                >
                                    {apt.status}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
