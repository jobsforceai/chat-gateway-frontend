
export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100">
            How It Works
          </h2>
          <p className="text-slate-400 mt-2">
            A simple and straightforward process.
          </p>
        </div>
        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-700/50" />
          <div className="relative flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center max-w-xs p-6 bg-slate-800/40 rounded-lg backdrop-blur-sm border border-slate-700/50">
              <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4 ring-8 ring-slate-900">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-200">Share the Link</h3>
              <p className="text-slate-400">
                The primary user on the Bolt desktop app generates and shares a unique session link.
              </p>
            </div>
            <div className="text-center max-w-xs p-6 bg-slate-800/40 rounded-lg backdrop-blur-sm border border-slate-700/50">
              <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4 ring-8 ring-slate-900">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-200">Join the Session</h3>
              <p className="text-slate-400">
                Up to 5 participants can join the session by opening the link in their browser and choosing a display name.
              </p>
            </div>
            <div className="text-center max-w-xs p-6 bg-slate-800/40 rounded-lg backdrop-blur-sm border border-slate-700/50">
              <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4 ring-8 ring-slate-900">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-200">Collaborate in Real-Time</h3>
              <p className="text-slate-400">
                View shared content from the desktop app and send back answers as text, code, or images.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
