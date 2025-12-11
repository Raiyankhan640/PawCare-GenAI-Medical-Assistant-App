import { getDoctorById } from "@/actions/appointments";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";

export async function generateMetadata({ params }) {
  const { id } = await params;

  const { doctor } = await getDoctorById(id);
  
  if (!doctor) {
    return {
      title: "Doctor Not Found - PawCare",
      description: "The requested veterinarian profile could not be found.",
    };
  }
  
  return {
    title: `Dr. ${doctor.name} - PawCare`,
    description: `Book an appointment with Dr. ${doctor.name}, ${doctor.specialty} specialist with ${doctor.experience} years of experience.`,
  };
}

export default async function DoctorProfileLayout({ children, params }) {
  const { id } = await params;
  const { doctor } = await getDoctorById(id);

  if (!doctor) redirect("/doctors");

  return (
    <div className="container mx-auto" suppressHydrationWarning>
      <PageHeader
        // icon={<Stethoscope />}
        title={"Dr. " + doctor.name}
        backLink={`/doctors/${encodeURIComponent(doctor.specialty)}`}
        backLabel={`Back to ${doctor.specialty}`}
      />

      {children}
    </div>
  );
}