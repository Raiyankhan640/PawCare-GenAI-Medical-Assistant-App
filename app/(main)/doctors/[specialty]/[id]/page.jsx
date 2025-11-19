"use client";

import { use, useEffect, useState } from "react";
import { getDoctorById, getAvailableTimeSlots } from "@/actions/appointments";
import { DoctorProfile } from "./components/doctor-profile";
import { useRouter } from "next/navigation";

export default function DoctorProfilePage({ params }) {
  const router = useRouter();
  const { id } = use(params); // Unwrap params using React.use()

  const [doctor, setDoctor] = useState(null);
  const [availableDays, setAvailableDays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch doctor data and available slots in parallel
        const [doctorData, slotsData] = await Promise.all([
          getDoctorById(id),
          getAvailableTimeSlots(id),
        ]);

        setDoctor(doctorData.doctor);
        setAvailableDays(slotsData.days || []);
      } catch (error) {
        console.error("Error loading doctor profile:", error);
        router.push("/doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!doctor) {
    return <div className="text-center py-20">Doctor not found.</div>;
  }

  return (
    <DoctorProfile
      doctor={doctor}
      availableDays={availableDays}
      buttonStyle="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
    />
  );
}