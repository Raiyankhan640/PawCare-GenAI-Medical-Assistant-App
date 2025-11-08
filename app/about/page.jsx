import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Clock, Award, Users, Stethoscope } from "lucide-react";

export const metadata = {
  title: "About Us - PawCare",
  description: "Learn more about PawCare and our mission to provide quality veterinary care",
};

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="h-6 w-6 text-emerald-400" />,
      title: "Compassionate Care",
      description: "We prioritize the wellbeing of every pet with empathy and understanding.",
    },
    {
      icon: <Shield className="h-6 w-6 text-emerald-400" />,
      title: "Trusted Professionals",
      description: "All our veterinarians are verified and highly qualified experts.",
    },
    {
      icon: <Clock className="h-6 w-6 text-emerald-400" />,
      title: "24/7 Availability",
      description: "Access veterinary care whenever your pet needs it, day or night.",
    },
    {
      icon: <Award className="h-6 w-6 text-emerald-400" />,
      title: "Quality Service",
      description: "We maintain the highest standards in veterinary telemedicine.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Happy Pet Owners" },
    { number: "500+", label: "Verified Veterinarians" },
    { number: "50,000+", label: "Consultations" },
    { number: "4.9/5", label: "Average Rating" },
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge
              variant="outline"
              className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium mb-6"
            >
              About PawCare
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Making Pet Healthcare{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Accessible to All
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              PawCare is revolutionizing veterinary care by connecting pet owners with 
              qualified veterinarians through our secure telemedicine platform. We believe 
              every pet deserves quality healthcare, anytime, anywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge
                variant="outline"
                className="bg-emerald-900/30 border-emerald-700/30 px-4 py-1 text-emerald-400 text-sm font-medium mb-4"
              >
                Our Mission
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Transforming Veterinary Care Through Technology
              </h2>
              <p className="text-muted-foreground mb-4">
                Founded with a passion for animal welfare, PawCare bridges the gap between 
                pet owners and veterinary professionals. We understand that pets are family, 
                and accessing quality care shouldn't be complicated or time-consuming.
              </p>
              <p className="text-muted-foreground mb-4">
                Our platform provides instant access to licensed veterinarians who can 
                diagnose, prescribe, and guide you through your pet's health journey—all 
                from the comfort of your home.
              </p>
              <p className="text-muted-foreground">
                Whether it's a routine checkup, an emergency consultation, or specialist 
                advice, PawCare ensures your furry friends receive the care they deserve.
              </p>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
              <Image
                src="/banner2.png"
                alt="Veterinarians caring for pets"
                fill
                className="object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that guide everything we do at PawCare
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="bg-card border-emerald-900/20 hover:border-emerald-800/40 transition-all"
              >
                <CardHeader>
                  <div className="bg-emerald-900/20 p-3 rounded-lg w-fit mb-4">
                    {value.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-white">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="bg-emerald-900/30 border-emerald-700/30 px-4 py-1 text-emerald-400 text-sm font-medium mb-4"
            >
              Our Team
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Built by Pet Lovers, For Pet Lovers
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our diverse team combines veterinary expertise, technology innovation, 
              and a shared love for animals to create the best pet healthcare platform.
            </p>
          </div>

          <Card className="bg-gradient-to-r from-emerald-900/20 to-emerald-950/10 border-emerald-800/20">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-emerald-900/30 flex items-center justify-center">
                    <Users className="h-12 w-12 text-emerald-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Join Our Growing Community
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    We're constantly growing our network of veterinary professionals 
                    and pet care experts. If you're passionate about animal welfare 
                    and want to be part of the future of veterinary care, we'd love 
                    to hear from you.
                  </p>
                  <a
                    href="/contact"
                    className="text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    Get in touch →
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-emerald-900/30 to-emerald-950/20 border-emerald-800/20">
            <CardContent className="p-8 md:p-12 text-center">
              <Stethoscope className="h-12 w-12 text-emerald-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Experience Better Pet Care?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of pet owners who trust PawCare for their veterinary needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/sign-up"
                  className="inline-flex items-center justify-center bg-emerald-600 text-white hover:bg-emerald-700 px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Get Started Today
                </a>
                <a
                  href="/doctors"
                  className="inline-flex items-center justify-center border border-emerald-700/30 hover:bg-muted/80 px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Find a Vet
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}