import { HeartIcon, PillIcon, AlertIcon, FoodIcon } from "./icons";

// Prompt templates for quick actions
export const PROMPT_TEMPLATES = [
  {
    icon: HeartIcon,
    title: "Symptom Check",
    prompt: "My pet is showing these symptoms: [describe symptoms]. They are a [age] year old [breed/type]. What could be wrong?",
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
  },
  {
    icon: PillIcon,
    title: "Medication Help",
    prompt: "What is the recommended dosage of [medication] for a [weight]kg [pet type]? Are there any side effects I should watch for?",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    icon: AlertIcon,
    title: "Emergency Guide",
    prompt: "My pet has [emergency situation]. What immediate steps should I take before reaching the vet?",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  {
    icon: FoodIcon,
    title: "Diet & Nutrition",
    prompt: "What is the best diet for a [age] year old [pet type] with [health condition]? Any foods to avoid?",
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
];

// Initial welcome message
export const INITIAL_MESSAGE = {
  role: "assistant",
  content: `Hello! 🐾 I'm **PawCare AI**, your professional veterinary assistant.

I can help you with:
• 🩺 Health assessment and symptom analysis
• 💊 Medication recommendations with proper dosages
• 🚨 Emergency care guidance
• 🥗 Preventive care and nutrition advice
• 🔬 Disease diagnosis and treatment options

You can also **upload images** 📷 of your pet or use **voice input** 🎤 to describe symptoms!

**To get started**, tell me about your pet (type, age, breed) and what's concerning you.`,
};
