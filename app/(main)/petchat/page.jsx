import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Script from "next/script";
import ChatInterface from "./components/chat-interface";
import LocationBookmark from "./components/location-bookmark";
import { Sparkles, Shield, Stethoscope, AlertCircle } from "lucide-react";

export default async function PetChatPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    return (
        <>
            <Script
                src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDdQXgoFRxsNcZYVsY7MK069zDse8U_6k0&libraries=places&loading=async"
                strategy="beforeInteractive"
            />
            <div className="min-h-screen bg-gradient-to-br from-background via-emerald-950/5 to-background relative overflow-hidden">
            {/* Animated Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 py-8 relative z-10">
                {/* Header Section */}
                <div className="max-w-5xl mx-auto mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                                <div className="relative bg-gradient-to-br from-emerald-500 to-teal-500 p-3 rounded-full">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                                    PetChat AI Assistant
                                </h1>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Powered by Advanced AI Technology
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <LocationBookmark />
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                <span className="text-sm font-medium text-emerald-400">Online</span>
                            </div>
                        </div>
                    </div>

                    {/* Instructions Card */}
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-4 hover:border-emerald-500/40 transition-all">
                            <div className="flex items-start gap-3">
                                <div className="bg-emerald-500/20 p-2 rounded-lg">
                                    <Stethoscope className="h-5 w-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-emerald-400 mb-1">Medical Guidance</h3>
                                    <p className="text-xs text-muted-foreground">
                                        Get AI-powered medication suggestions and health advice for your pets
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-4 hover:border-emerald-500/40 transition-all">
                            <div className="flex items-start gap-3">
                                <div className="bg-teal-500/20 p-2 rounded-lg">
                                    <Shield className="h-5 w-5 text-teal-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-teal-400 mb-1">Safe & Reliable</h3>
                                    <p className="text-xs text-muted-foreground">
                                        All suggestions are based on veterinary best practices
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-4 hover:border-emerald-500/40 transition-all">
                            <div className="flex items-start gap-3">
                                <div className="bg-cyan-500/20 p-2 rounded-lg">
                                    <AlertCircle className="h-5 w-5 text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-cyan-400 mb-1">Disclaimer</h3>
                                    <p className="text-xs text-muted-foreground">
                                        Always consult a licensed veterinarian for serious concerns
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Usage Instructions */}
                    <div className="bg-gradient-to-br from-emerald-900/10 to-teal-900/10 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            How to Use
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>
                                <h4 className="font-medium text-foreground mb-2">📋 Provide Details:</h4>
                                <ul className="space-y-1 ml-4 list-disc">
                                    <li>Pet type (dog, cat, etc.)</li>
                                    <li>Age, weight, and breed</li>
                                    <li>Symptoms or health concerns</li>
                                    <li>Current medications (if any)</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium text-foreground mb-2">💊 Get Suggestions:</h4>
                                <ul className="space-y-1 ml-4 list-disc">
                                    <li>Medication recommendations</li>
                                    <li>Dosage guidelines</li>
                                    <li>Possible side effects</li>
                                    <li>When to see a vet</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Interface */}
                <ChatInterface />
            </div>
        </div>
        </>
    );
}
