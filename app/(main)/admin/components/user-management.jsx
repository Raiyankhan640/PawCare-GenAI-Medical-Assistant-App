"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  CreditCard,
  UserCheck,
  UserX,
  Edit,
  Plus,
  Minus,
  Save,
  X,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Shield,
  Stethoscope,
  User,
  Crown,
  Mail,
  Calendar,
  Award,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function UserManagement() {
  const { user: clerkUser } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  
  // Edit modal state
  const [editingUser, setEditingUser] = useState(null);
  const [editCredits, setEditCredits] = useState("");
  const [addCreditsAmount, setAddCreditsAmount] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!clerkUser?.id) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        clerkUserId: clerkUser.id,
        search: searchQuery,
        role: roleFilter,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
        setPagination(prev => ({ ...prev, ...data.pagination }));
      } else {
        toast.error(data.error || "Failed to fetch users");
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [clerkUser?.id, searchQuery, roleFilter, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleUpdateUser = async (action, value) => {
    if (!editingUser || !clerkUser?.id) return;

    setIsUpdating(true);
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkUserId: clerkUser.id,
          userId: editingUser.id,
          action,
          value,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setEditingUser(null);
        fetchUsers();
      } else {
        toast.error(data.error || "Failed to update user");
      }
    } catch (error) {
      toast.error("Failed to update user");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuickAction = async (user, action) => {
    if (!clerkUser?.id) return;

    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkUserId: clerkUser.id,
          userId: user.id,
          action,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        fetchUsers();
      } else {
        toast.error(data.error || "Action failed");
      }
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "ADMIN": return <Crown className="h-4 w-4" />;
      case "DOCTOR": return <Stethoscope className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "ADMIN": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "DOCTOR": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      default: return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "VERIFIED":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Verified</Badge>;
      case "PENDING":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Pending</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700/50">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/20 rounded-lg">
              <Users className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <CardTitle className="text-white">User Management</CardTitle>
              <CardDescription>Manage user credits, roles, and verifications</CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            className="border-slate-700 hover:bg-slate-800"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-slate-800/50 border-slate-700">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="PATIENT">Patients</SelectItem>
              <SelectItem value="DOCTOR">Doctors</SelectItem>
              <SelectItem value="ADMIN">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 text-slate-600" />
            <p>No users found</p>
          </div>
        ) : (
          <>
            {/* Users Table */}
            <div className="space-y-3">
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                        {user.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white truncate">{user.name || "Unknown"}</p>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {getRoleIcon(user.role)}
                          <span className="ml-1">{user.role}</span>
                        </Badge>
                        {user.role === "DOCTOR" && getStatusBadge(user.verificationStatus)}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      {user.specialty && (
                        <p className="text-xs text-emerald-400 mt-1">{user.specialty}</p>
                      )}
                    </div>
                  </div>

                  {/* Credits */}
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 rounded-lg border border-amber-500/30">
                      <CreditCard className="h-4 w-4 text-amber-400" />
                      <span className="font-bold text-amber-400">{user.credits}</span>
                      <span className="text-xs text-amber-400/70">credits</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingUser(user);
                          setEditCredits(user.credits.toString());
                          setAddCreditsAmount("");
                        }}
                        className="border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      {user.role === "DOCTOR" && user.verificationStatus === "PENDING" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickAction(user, "verify_doctor")}
                            className="border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400"
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickAction(user, "reject_doctor")}
                            className="border-red-500/30 hover:bg-red-500/10 text-red-400"
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700">
                <p className="text-sm text-muted-foreground">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="border-slate-700"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-white px-3">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.totalPages}
                    className="border-slate-700"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-3">
              {editingUser && (
                <>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={editingUser.imageUrl} />
                    <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                      {editingUser.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{editingUser.name}</p>
                    <p className="text-sm font-normal text-muted-foreground">{editingUser.email}</p>
                  </div>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Manage user credits and settings
            </DialogDescription>
          </DialogHeader>

          {editingUser && (
            <div className="space-y-6 py-4">
              {/* Current Credits */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <span className="text-muted-foreground">Current Credits</span>
                <span className="text-2xl font-bold text-amber-400">{editingUser.credits}</span>
              </div>

              {/* Set Credits */}
              <div className="space-y-3">
                <Label className="text-white">Set Credits</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={editCredits}
                    onChange={(e) => setEditCredits(e.target.value)}
                    className="bg-slate-800/50 border-slate-700"
                    min="0"
                  />
                  <Button
                    onClick={() => handleUpdateUser("set_credits", editCredits)}
                    disabled={isUpdating || editCredits === editingUser.credits.toString()}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Add Credits */}
              <div className="space-y-3">
                <Label className="text-white">Add Credits</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={addCreditsAmount}
                    onChange={(e) => setAddCreditsAmount(e.target.value)}
                    placeholder="Amount to add"
                    className="bg-slate-800/50 border-slate-700"
                    min="1"
                  />
                  <Button
                    onClick={() => handleUpdateUser("add_credits", addCreditsAmount)}
                    disabled={isUpdating || !addCreditsAmount || parseInt(addCreditsAmount) <= 0}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Quick Add Buttons */}
              <div className="space-y-2">
                <Label className="text-white">Quick Add</Label>
                <div className="flex flex-wrap gap-2">
                  {[5, 10, 20, 50, 100].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateUser("add_credits", amount.toString())}
                      disabled={isUpdating}
                      className="border-slate-700 hover:bg-emerald-500/10 hover:border-emerald-500/30"
                    >
                      +{amount}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Role Change (for non-admins) */}
              {editingUser.role !== "ADMIN" && (
                <div className="space-y-3 pt-4 border-t border-slate-700">
                  <Label className="text-white">Change Role</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={editingUser.role === "PATIENT" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleUpdateUser("change_role", "PATIENT")}
                      disabled={isUpdating || editingUser.role === "PATIENT"}
                      className={editingUser.role === "PATIENT" ? "bg-blue-600" : "border-slate-700"}
                    >
                      <User className="h-4 w-4 mr-1" />
                      Patient
                    </Button>
                    <Button
                      variant={editingUser.role === "DOCTOR" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleUpdateUser("change_role", "DOCTOR")}
                      disabled={isUpdating || editingUser.role === "DOCTOR"}
                      className={editingUser.role === "DOCTOR" ? "bg-emerald-600" : "border-slate-700"}
                    >
                      <Stethoscope className="h-4 w-4 mr-1" />
                      Doctor
                    </Button>
                  </div>
                </div>
              )}

              {/* Doctor Verification */}
              {editingUser.role === "DOCTOR" && editingUser.verificationStatus === "PENDING" && (
                <div className="space-y-3 pt-4 border-t border-slate-700">
                  <Label className="text-white flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-400" />
                    Doctor Verification
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleUpdateUser("verify_doctor")}
                      disabled={isUpdating}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Verify Doctor
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleUpdateUser("reject_doctor")}
                      disabled={isUpdating}
                      className="flex-1"
                    >
                      <UserX className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingUser(null)}
              className="border-slate-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
