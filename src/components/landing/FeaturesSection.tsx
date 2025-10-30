
import { Share2, Code, Image as ImageIcon, Users, Clock } from "lucide-react";

const features = [
  {
    icon: <Share2 className="h-8 w-8 text-cyan-400" />,
    title: "Seamless Sharing",
    description: "Users on the Bolt desktop app can instantly share screenshots and text with a simple command.",
  },
  {
    icon: <Users className="h-8 w-8 text-cyan-400" />,
    title: "Small Group Collaboration",
    description: "Each session is designed for up to 5 participants, ensuring focused and effective communication.",
  },
  {
    icon: <Code className="h-8 w-8 text-cyan-400" />,
    title: "Code & Text Support",
    description: "Participants can send answers and suggestions as plain text or formatted code snippets.",
  },
  {
    icon: <ImageIcon className="h-8 w-8 text-cyan-400" />,
    title: "Image Support",
    description: "Share images to visually explain solutions and ideas.",
  },
  {
    icon: <Clock className="h-8 w-8 text-cyan-400" />,
    title: "Timed Sessions",
    description: "Each chat session has a time limit, keeping the collaboration focused and on track.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100">
            Features
          </h2>
          <p className="text-slate-400 mt-2">
            Everything you need for effective exam collaboration.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800/40 p-6 rounded-lg backdrop-blur-sm border border-slate-700/50 transition-all transform hover:scale-105 hover:bg-slate-800/60"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-slate-200">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
