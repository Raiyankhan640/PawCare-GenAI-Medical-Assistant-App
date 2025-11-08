import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare,
  Send
} from "lucide-react";

export const metadata = {
  title: "Contact Us - PawCare",
  description: "Get in touch with PawCare for support, questions, or partnership opportunities",
};

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-emerald-400" />,
      title: "Email Us",
      details: "support@pawcare.com",
      description: "We'll respond within 24 hours",
    },
    {
      icon: <Phone className="h-6 w-6 text-emerald-400" />,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      description: "Mon-Fri: 9:00 AM - 8:00 PM EST",
    },
    {
      icon: <MapPin className="h-6 w-6 text-emerald-400" />,
      title: "Visit Us",
      details: "123 Pet Care Lane, Suite 100",
      description: "New York, NY 10001",
    },
    {
      icon: <Clock className="h-6 w-6 text-emerald-400" />,
      title: "Business Hours",
      details: "Monday - Saturday",
      description: "9:00 AM - 8:00 PM EST",
    },
  ];

  const faqs = [
    {
      question: "How quickly can I get a consultation?",
      answer: "Most consultations are available within 15-30 minutes during business hours. Emergency consultations are prioritized.",
    },
    {
      question: "Are your veterinarians licensed?",
      answer: "Yes, all veterinarians on PawCare are fully licensed and verified professionals with years of experience.",
    },
    {
      question: "What types of pets do you support?",
      answer: "We support all common pets including dogs, cats, birds, and small exotic animals. Our veterinarians specialize in various animal types.",
    },
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
              Get In Touch
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              We're Here to{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Help You
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Have questions about PawCare? Need technical support? Want to join our 
              veterinary network? We'd love to hear from you!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className="bg-card border-emerald-900/20 hover:border-emerald-800/40 transition-all"
              >
                <CardHeader>
                  <div className="bg-emerald-900/20 p-3 rounded-lg w-fit mb-4">
                    {info.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold text-white">
                    {info.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white font-medium mb-1">{info.details}</p>
                  <p className="text-muted-foreground text-sm">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <Badge
                  variant="outline"
                  className="bg-emerald-900/30 border-emerald-700/30 px-4 py-1 text-emerald-400 text-sm font-medium mb-4"
                >
                  Send us a message
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Drop Us a Line
                </h2>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <Card className="bg-card border-emerald-900/20">
                <CardContent className="p-6">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">
                          First Name *
                        </label>
                        <Input
                          placeholder="John"
                          className="bg-background border-emerald-900/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">
                          Last Name *
                        </label>
                        <Input
                          placeholder="Doe"
                          className="bg-background border-emerald-900/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">
                        Email *
                      </label>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        className="bg-background border-emerald-900/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="bg-background border-emerald-900/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">
                        Subject *
                      </label>
                      <Input
                        placeholder="How can we help?"
                        className="bg-background border-emerald-900/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">
                        Message *
                      </label>
                      <Textarea
                        placeholder="Tell us more about your inquiry..."
                        rows={5}
                        className="bg-background border-emerald-900/20 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By submitting this form, you agree to our{" "}
                      <a href="/privacy" className="text-emerald-400 hover:text-emerald-300">
                        Privacy Policy
                      </a>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* FAQs */}
            <div>
              <div className="mb-8">
                <Badge
                  variant="outline"
                  className="bg-emerald-900/30 border-emerald-700/30 px-4 py-1 text-emerald-400 text-sm font-medium mb-4"
                >
                  FAQs
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-muted-foreground">
                  Quick answers to common questions about PawCare.
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card
                    key={index}
                    className="bg-card border-emerald-900/20"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-white flex items-start gap-3">
                        <MessageSquare className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        {faq.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground ml-8">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-6 bg-gradient-to-r from-emerald-900/20 to-emerald-950/10 border-emerald-800/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Still have questions?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Check out our comprehensive help center or chat with our support team.
                  </p>
                  <Button
                    variant="outline"
                    className="border-emerald-700/30 hover:bg-muted/80"
                  >
                    Visit Help Center
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-red-900/20 to-red-950/10 border-red-800/20">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-red-900/30 flex items-center justify-center">
                    <Phone className="h-10 w-10 text-red-400" />
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Pet Emergency?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    For urgent veterinary emergencies, please call our emergency hotline 
                    or visit your nearest emergency animal hospital.
                  </p>
                  <a
                    href="tel:+15551234567"
                    className="text-red-400 hover:text-red-300 font-bold text-xl"
                  >
                    Emergency Hotline: +1 (555) 911-PETS
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}