export default function AbstractShape() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Large Background Circles */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gradient-to-br from-blue-500/25 via-purple-500/25 to-indigo-500/25 blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-br from-purple-500/25 via-indigo-500/25 to-blue-500/25 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-blue-500/20 blur-3xl"></div>
      <div className="absolute top-1/4 right-1/4 h-80 w-80 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-indigo-500/20 blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      <div className="absolute bottom-1/4 left-1/4 h-80 w-80 rounded-full bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-indigo-500/20 blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>
      
      {/* Geometric Shapes - More Coverage */}
      <div className="absolute top-0 right-0 w-64 h-64">
        <div className="h-full w-full rotate-45 rounded-3xl bg-gradient-to-br from-blue-500/15 via-purple-500/15 to-transparent blur-2xl"></div>
      </div>
      <div className="absolute bottom-0 left-0 w-64 h-64">
        <div className="h-full w-full rotate-12 rounded-3xl bg-gradient-to-br from-purple-500/15 via-indigo-500/15 to-transparent blur-2xl"></div>
      </div>
      <div className="absolute top-1/2 right-0 w-48 h-48">
        <div className="h-full w-full -rotate-45 rounded-2xl bg-gradient-to-br from-indigo-500/12 via-blue-500/12 to-transparent blur-xl"></div>
      </div>
      <div className="absolute bottom-0 right-1/3 w-56 h-56">
        <div className="h-full w-full rotate-30 rounded-3xl bg-gradient-to-br from-purple-500/12 via-indigo-500/12 to-transparent blur-xl"></div>
      </div>
      <div className="absolute top-0 left-1/3 w-52 h-52">
        <div className="h-full w-full rotate-60 rounded-2xl bg-gradient-to-br from-blue-500/12 via-purple-500/12 to-transparent blur-xl"></div>
      </div>
      
      {/* Wave Patterns - Full Coverage */}
      <svg className="absolute bottom-0 left-0 w-full h-full opacity-10" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M0,400 Q300,200 600,400 T1200,400 L1200,800 L0,800 Z" fill="url(#waveGradient1)" />
        <path d="M0,500 Q400,300 800,500 T1200,500 L1200,800 L0,800 Z" fill="url(#waveGradient2)" />
        <defs>
          <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Additional Wave at Top */}
      <svg className="absolute top-0 left-0 w-full h-full opacity-8" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M0,200 Q200,100 400,200 T800,200 T1200,200 L1200,0 L0,0 Z" fill="url(#waveGradient3)" />
        <defs>
          <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.25" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Floating Dots - More Coverage */}
      <div className="absolute top-16 left-16 h-3 w-3 rounded-full bg-blue-400/50 blur-sm animate-pulse"></div>
      <div className="absolute top-32 right-24 h-2.5 w-2.5 rounded-full bg-purple-400/50 blur-sm animate-pulse" style={{ animationDelay: "0.5s" }}></div>
      <div className="absolute top-48 left-1/3 h-2 w-2 rounded-full bg-indigo-400/50 blur-sm animate-pulse" style={{ animationDelay: "1s" }}></div>
      <div className="absolute bottom-40 right-1/4 h-3 w-3 rounded-full bg-purple-400/50 blur-sm animate-pulse" style={{ animationDelay: "1.5s" }}></div>
      <div className="absolute bottom-24 left-1/2 h-2.5 w-2.5 rounded-full bg-blue-400/50 blur-sm animate-pulse" style={{ animationDelay: "2s" }}></div>
      <div className="absolute top-1/3 right-1/3 h-2 w-2 rounded-full bg-indigo-400/50 blur-sm animate-pulse" style={{ animationDelay: "0.3s" }}></div>
      <div className="absolute bottom-1/3 left-1/4 h-3 w-3 rounded-full bg-purple-400/50 blur-sm animate-pulse" style={{ animationDelay: "0.8s" }}></div>
      <div className="absolute top-2/3 right-1/2 h-2 w-2 rounded-full bg-blue-400/50 blur-sm animate-pulse" style={{ animationDelay: "1.2s" }}></div>
      
      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5"></div>
    </div>
  );
}
