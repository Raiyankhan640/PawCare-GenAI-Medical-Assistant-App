"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Star, Clock, Search, ArrowRight } from "lucide-react";

export default function DoctorsListClient({ doctors }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("all");

    // Get unique specialties from doctors
    const specialties = useMemo(() => {
        const uniqueSpecialties = [...new Set(doctors.map((doc) => doc.specialty))].sort();
        return uniqueSpecialties;
    }, [doctors]);

    // Filter doctors based on search and specialty
    const filteredDoctors = useMemo(() => {
        return doctors.filter((doctor) => {
            const matchesSearch = doctor.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchesSpecialty =
                selectedSpecialty === "all" ||
                doctor.specialty === selectedSpecialty;
            return matchesSearch && matchesSpecialty;
        });
    }, [doctors, searchQuery, selectedSpecialty]);

    return (
        <>
            {/* Search and Filter Section */}
            <div className="mb-10">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-400" />
                        <Input
                            type="text"
                            placeholder="Search doctors by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 bg-card/80 border-emerald-900/30 focus:border-emerald-500/50 h-14 text-base rounded-xl"
                        />
                    </div>

                    {/* Specialty Filter */}
                    <div className="md:w-72">
                        <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                            <SelectTrigger className="bg-card/80 border-emerald-900/30 focus:border-emerald-500/50 h-14 text-base rounded-xl">
                                <SelectValue placeholder="All Specialties" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Specialties</SelectItem>
                                {specialties.map((specialty) => (
                                    <SelectItem key={specialty} value={specialty}>
                                        {specialty}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mt-4 text-sm text-muted-foreground">
                    Showing <span className="text-emerald-400 font-semibold">{filteredDoctors.length}</span> of {doctors.length} veterinarians
                    {searchQuery && ` matching "${searchQuery}"`}
                    {selectedSpecialty !== "all" && ` in ${selectedSpecialty}`}
                </div>
            </div>

            {/* Doctors Grid */}
            {filteredDoctors.length === 0 ? (
                <Card className="bg-card/80 border-emerald-900/20 p-12 text-center">
                    <p className="text-muted-foreground text-lg mb-2">
                        No veterinarians found
                    </p>
                    <p className="text-muted-foreground text-sm mb-6">
                        Try adjusting your search or filter criteria
                    </p>
                    <Button
                        onClick={() => {
                            setSearchQuery("");
                            setSelectedSpecialty("all");
                        }}
                        variant="outline"
                        className="border-emerald-700/40 hover:bg-emerald-900/20"
                    >
                        Clear Filters
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.map((doctor, index) => (
                        <Card
                            key={doctor.id}
                            className="group relative overflow-hidden bg-gradient-to-br from-emerald-900/20 to-teal-900/20 backdrop-blur-xl border-emerald-900/30 hover:border-emerald-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/20"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Animated glow background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Top gradient bar */}
                            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />

                            <CardHeader className="pb-4">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    {/* Avatar with glow */}
                                    <div className="relative w-20 h-20">
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="relative w-full h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 p-0.5">
                                            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                                                <span className="text-3xl font-bold text-emerald-400">
                                                    {doctor.name.charAt(0)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Name and Specialty */}
                                    <div className="space-y-2">
                                        <CardTitle className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                                            {doctor.name}
                                        </CardTitle>
                                        <Badge
                                            variant="outline"
                                            className="bg-emerald-900/30 border-emerald-700/30 text-emerald-400 text-xs"
                                        >
                                            {doctor.specialty}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Description */}
                                <p className="text-muted-foreground text-sm text-center line-clamp-2">
                                    {doctor.description || "Experienced veterinary professional providing compassionate care for your beloved pets."}
                                </p>

                                {/* Stats */}
                                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4 text-emerald-400" />
                                        <span>{doctor.experience || 5}+ years</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                        <span className="text-white font-semibold">4.9</span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <Link
                                    href={`/doctors/${encodeURIComponent(doctor.specialty)}/${doctor.id}`}
                                    className="block"
                                >
                                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg group relative overflow-hidden">
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            View Profile & Book
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                        {/* Shine effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    </Button>
                                </Link>
                            </CardContent>

                            {/* Bottom decorative line */}
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent group-hover:via-emerald-400 transition-all" />
                        </Card>
                    ))}
                </div>
            )}
        </>
    );
}
