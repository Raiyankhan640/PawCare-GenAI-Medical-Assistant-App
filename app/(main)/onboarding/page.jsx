"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Stethoscope,
  Loader2,
  Heart,
  Calendar,
  MessageSquare,
  Video,
  Award,
  Clock,
  Shield,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Upload,
  FileText,
  GraduationCap,
  Briefcase,
  Star,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setUserRole } from "@/actions/onboarding";
import { doctorFormSchema } from "@/lib/schema";
import { SPECIALTIES } from "@/lib/specialities";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: { opacity: 0, x: -50 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const cardHoverVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
};

// Feature items for cards
const patientFeatures = [
  { icon: Calendar, text: "Book appointments easily" },
  { icon: Video, text: "Video consultations" },
  { icon: MessageSquare, text: "AI-powered pet chat" },
  { icon: Heart, text: "Pet health tracking" },
];

const doctorFeatures = [
  { icon: Briefcase, text: "Build your practice" },
  { icon: Calendar, text: "Flexible scheduling" },
  { icon: Award, text: "Earn credits per consultation" },
  { icon: Star, text: "Build your reputation" },
];

export default function OnboardingPage() {
  const { user: clerkUser, isLoaded } = useUser();
  const [step, setStep] = useState("choose-role");
  const [doctorStep, setDoctorStep] = useState(1);
  const router = useRouter();

  // Custom hook for user role server action
  const { loading, data, fn: submitUserRole } = useFetch(setUserRole);

  // React Hook Form setup with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      specialty: "",
      experience: undefined,
      credentialUrl: "",
      description: "",
    },
  });

  // Watch values for controlled components
  const specialtyValue = watch("specialty");
  const experienceValue = watch("experience");
  const credentialUrlValue = watch("credentialUrl");
  const descriptionValue = watch("description");

  // Handle patient role selection
  const handlePatientSelection = async () => {
    if (loading) return;

    const formData = new FormData();
    formData.append("role", "PATIENT");

    await submitUserRole(formData, clerkUser?.id);
  };

  useEffect(() => {
    if (data && data?.success) {
      toast.success(data.role === "PATIENT" ? "Welcome to PawCare!" : "Application submitted for verification!");
      router.push(data.redirect);
    }
  }, [data, router]);

  // Doctor form submission
  const onDoctorSubmit = async (formValues) => {
    if (loading) return;

    const formData = new FormData();
    formData.append("role", "DOCTOR");
    formData.append("specialty", formValues.specialty);
    formData.append("experience", formValues.experience.toString());
    formData.append("credentialUrl", formValues.credentialUrl);
    formData.append("description", formValues.description);

    await submitUserRole(formData, clerkUser?.id);
  };

  // Validate current step before proceeding
  const handleNextStep = async () => {
    let isValid = false;
    
    if (doctorStep === 1) {
      isValid = await trigger("specialty");
    } else if (doctorStep === 2) {
      isValid = await trigger(["experience", "credentialUrl"]);
    }

    if (isValid) {
      setDoctorStep(doctorStep + 1);
    }
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <Loader2 className="h-12 w-12 animate-spin text-emerald-400 mx-auto" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  // Role selection screen
  if (step === "choose-role") {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto"
      >
        {/* Welcome Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Welcome to PawCare
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-emerald-200 to-teal-200 bg-clip-text text-transparent mb-4">
            How would you like to join?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your role to get started. You can always change this later.
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Patient Card */}
          <motion.div variants={itemVariants}>
            <motion.div
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              className="h-full"
            >
              <Card
                className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl cursor-pointer group h-full"
                onClick={() => !loading && handlePatientSelection()}
              >
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
                
                <CardContent className="relative z-10 p-8">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30"
                  >
                    <User className="h-10 w-10 text-white" />
                  </motion.div>

                  {/* Title & Description */}
                  <CardTitle className="text-2xl font-bold text-white mb-3">
                    Join as a Pet Owner
                  </CardTitle>
                  <CardDescription className="text-base mb-6">
                    Get expert veterinary care for your beloved pets from the comfort of your home.
                  </CardDescription>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {patientFeatures.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-3 text-sm text-muted-foreground"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <feature.icon className="h-4 w-4 text-blue-400" />
                        </div>
                        <span>{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25 group/btn"
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Setting up your account...
                      </>
                    ) : (
                      <>
                        Continue as Pet Owner
                        <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Doctor Card */}
          <motion.div variants={itemVariants}>
            <motion.div
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              className="h-full"
            >
              <Card
                className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl cursor-pointer group h-full"
                onClick={() => !loading && setStep("doctor-form")}
              >
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
                
                <CardContent className="relative z-10 p-8">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30"
                  >
                    <Stethoscope className="h-10 w-10 text-white" />
                  </motion.div>

                  {/* Title & Description */}
                  <CardTitle className="text-2xl font-bold text-white mb-3">
                    Join as a Veterinarian
                  </CardTitle>
                  <CardDescription className="text-base mb-6">
                    Connect with pet owners and provide expert care through our platform.
                  </CardDescription>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {doctorFeatures.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-3 text-sm text-muted-foreground"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <feature.icon className="h-4 w-4 text-emerald-400" />
                        </div>
                        <span>{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 group/btn"
                    disabled={loading}
                    size="lg"
                  >
                    Continue as Veterinarian
                    <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Trust indicators */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-400" />
            <span>Verified Professionals</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-400" />
            <span>24/7 Support</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-emerald-400" />
            <span>Trusted by 10,000+ Pet Owners</span>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Doctor registration form - Multi-step
  if (step === "doctor-form") {
    const totalSteps = 3;
    const progressPercent = (doctorStep / totalSteps) * 100;

    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header with back button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => doctorStep === 1 ? setStep("choose-role") : setDoctorStep(doctorStep - 1)}
            className="mb-4 text-muted-foreground hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {doctorStep === 1 ? "Back to role selection" : "Previous step"}
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-emerald-200 to-teal-200 bg-clip-text text-transparent">
                Veterinarian Registration
              </h1>
              <p className="text-muted-foreground">Complete your professional profile</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Step {doctorStep} of {totalSteps}</span>
              <span className="text-emerald-400">{Math.round(progressPercent)}% complete</span>
            </div>
            <Progress value={progressPercent} className="h-2 bg-slate-800" />
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-between mt-6">
            {[
              { step: 1, label: "Specialty", icon: GraduationCap },
              { step: 2, label: "Experience", icon: Briefcase },
              { step: 3, label: "Review", icon: CheckCircle },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div className={`flex items-center gap-2 ${doctorStep >= item.step ? "text-emerald-400" : "text-muted-foreground"}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    doctorStep > item.step
                      ? "bg-emerald-500 text-white"
                      : doctorStep === item.step
                      ? "bg-emerald-500/20 border-2 border-emerald-500"
                      : "bg-slate-800 border-2 border-slate-700"
                  }`}>
                    {doctorStep > item.step ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <item.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{item.label}</span>
                </div>
                {index < 2 && (
                  <div className={`hidden sm:block w-24 h-0.5 mx-4 ${
                    doctorStep > item.step ? "bg-emerald-500" : "bg-slate-700"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form Card */}
        <Card className="border-0 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onDoctorSubmit)}>
              <AnimatePresence mode="wait">
                {/* Step 1: Specialty Selection */}
                {doctorStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-white mb-2">Choose Your Specialty</h2>
                      <p className="text-muted-foreground">Select your area of veterinary expertise</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {SPECIALTIES.map((spec) => (
                        <motion.div
                          key={spec.name}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`cursor-pointer transition-all ${
                              specialtyValue === spec.name
                                ? "border-emerald-500 bg-emerald-500/10"
                                : "border-slate-700 hover:border-emerald-500/50"
                            }`}
                            onClick={() => setValue("specialty", spec.name)}
                          >
                            <CardContent className="p-4 text-center">
                              <span className="text-2xl mb-2 block">{spec.icon}</span>
                              <p className="text-sm font-medium text-white">{spec.name}</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                    
                    {errors.specialty && (
                      <p className="text-sm font-medium text-red-500 text-center">
                        {errors.specialty.message}
                      </p>
                    )}

                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 mt-6"
                      size="lg"
                    >
                      Continue
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                )}

                {/* Step 2: Experience & Credentials */}
                {doctorStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-white mb-2">Experience & Credentials</h2>
                      <p className="text-muted-foreground">Tell us about your professional background</p>
                    </div>

                    {/* Experience Input */}
                    <div className="space-y-3">
                      <Label htmlFor="experience" className="text-white flex items-center gap-2">
                        <Clock className="h-4 w-4 text-emerald-400" />
                        Years of Experience
                      </Label>
                      <Input
                        id="experience"
                        type="number"
                        placeholder="e.g. 5"
                        className="bg-slate-800/50 border-slate-700 focus:border-emerald-500 h-12"
                        {...register("experience", { valueAsNumber: true })}
                      />
                      {errors.experience && (
                        <p className="text-sm font-medium text-red-500">
                          {errors.experience.message}
                        </p>
                      )}
                    </div>

                    {/* Credential URL Input */}
                    <div className="space-y-3">
                      <Label htmlFor="credentialUrl" className="text-white flex items-center gap-2">
                        <FileText className="h-4 w-4 text-emerald-400" />
                        Credential Document URL
                      </Label>
                      <div className="relative">
                        <Input
                          id="credentialUrl"
                          type="url"
                          placeholder="https://example.com/my-credential.pdf"
                          className="bg-slate-800/50 border-slate-700 focus:border-emerald-500 h-12 pl-10"
                          {...register("credentialUrl")}
                        />
                        <Upload className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Link to your medical degree or veterinary certification
                      </p>
                      {errors.credentialUrl && (
                        <p className="text-sm font-medium text-red-500">
                          {errors.credentialUrl.message}
                        </p>
                      )}
                    </div>

                    {/* Description Textarea */}
                    <div className="space-y-3">
                      <Label htmlFor="description" className="text-white flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-emerald-400" />
                        About Your Practice
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your expertise, services, and approach to pet care..."
                        rows={4}
                        className="bg-slate-800/50 border-slate-700 focus:border-emerald-500 resize-none"
                        {...register("description")}
                      />
                      {errors.description && (
                        <p className="text-sm font-medium text-red-500">
                          {errors.description.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                      size="lg"
                    >
                      Review Application
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                )}

                {/* Step 3: Review & Submit */}
                {doctorStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-emerald-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2">Review Your Application</h2>
                      <p className="text-muted-foreground">Please verify your information before submitting</p>
                    </div>

                    {/* Summary Card */}
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-slate-700">
                          <span className="text-muted-foreground">Specialty</span>
                          <span className="text-white font-medium">{specialtyValue || "Not selected"}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-slate-700">
                          <span className="text-muted-foreground">Experience</span>
                          <span className="text-white font-medium">{experienceValue} years</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-slate-700">
                          <span className="text-muted-foreground">Credential</span>
                          <span className="text-emerald-400 font-medium text-sm truncate max-w-[200px]">
                            {credentialUrlValue || "Not provided"}
                          </span>
                        </div>
                        <div className="py-3">
                          <span className="text-muted-foreground block mb-2">Description</span>
                          <p className="text-white text-sm">{descriptionValue || "No description provided"}</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Info Banner */}
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex items-start gap-3">
                      <Shield className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white font-medium text-sm">Verification Process</p>
                        <p className="text-muted-foreground text-xs mt-1">
                          Your application will be reviewed by our admin team. Once verified, you'll be able to start accepting appointments.
                        </p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Submit for Verification
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
}