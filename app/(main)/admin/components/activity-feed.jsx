"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    UserPlus,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    DollarSign,
    Stethoscope,
    User
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const activityIcons = {
    NEW_USER: { icon: UserPlus, color: "text-blue-400", bg: "bg-blue-500/20" },
    NEW_APPOINTMENT: { icon: Calendar, color: "text-emerald-400", bg: "bg-emerald-500/20" },
    COMPLETED: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/20" },
    CANCELLED: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/20" },
    PENDING: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/20" },
    PAYMENT: { icon: DollarSign, color: "text-yellow-400", bg: "bg-yellow-500/20" },
    DOCTOR_VERIFIED: { icon: Stethoscope, color: "text-purple-400", bg: "bg-purple-500/20" },
};

export function ActivityFeed({ activities = [] }) {
    // Generate sample activities if none provided
    const sampleActivities = activities.length > 0 ? activities : [
        { id: 1, type: "NEW_APPOINTMENT", message: "New appointment scheduled", user: "John Doe", time: new Date(Date.now() - 1000 * 60 * 5) },
        { id: 2, type: "COMPLETED", message: "Appointment completed", user: "Dr. Sarah Wilson", time: new Date(Date.now() - 1000 * 60 * 15) },
        { id: 3, type: "NEW_USER", message: "New patient registered", user: "Emily Chen", time: new Date(Date.now() - 1000 * 60 * 30) },
        { id: 4, type: "PAYMENT", message: "Credit purchase completed", user: "Mike Johnson", time: new Date(Date.now() - 1000 * 60 * 45) },
        { id: 5, type: "DOCTOR_VERIFIED", message: "Doctor verification approved", user: "Dr. Alex Turner", time: new Date(Date.now() - 1000 * 60 * 60) },
        { id: 6, type: "CANCELLED", message: "Appointment cancelled", user: "Lisa Park", time: new Date(Date.now() - 1000 * 60 * 90) },
    ];

    return (
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 border-slate-700/30 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                    <Clock className="h-5 w-5 text-cyan-400" />
                    Activity Feed
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    {sampleActivities.map((activity, index) => {
                        const activityStyle = activityIcons[activity.type] || activityIcons.PENDING;
                        const Icon = activityStyle.icon;

                        return (
                            <div
                                key={activity.id}
                                className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors group"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className={`w-10 h-10 rounded-full ${activityStyle.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                    <Icon className={`h-5 w-5 ${activityStyle.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{activity.message}</p>
                                    <p className="text-xs text-slate-400 truncate">{activity.user}</p>
                                </div>
                                <span className="text-xs text-slate-500 whitespace-nowrap">
                                    {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
