
import JoinSessionForm from "./JoinSessionForm";

export default function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 text-center">
      <div className="relative z-10 container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="text-slate-100">Everything You Need for</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            Smarter Collaboration
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mt-6">
          Welcome to Bolt Chat, your real-time companion for coding exams. Share problems, discuss solutions, and collaborate seamlessly with your team.
        </p>
        <JoinSessionForm />
        <div className="mt-8">
          <a
            href="#how-it-works"
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
