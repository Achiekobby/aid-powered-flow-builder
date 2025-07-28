import React, { useState, useEffect } from "react";

const Hero = () => {
  const [currentGradient, setCurrentGradient] = useState(0);

  const gradients = [
    "from-violet-600 via-purple-600 to-indigo-600",
    "from-cyan-500 via-blue-500 to-purple-600",
    "from-emerald-500 via-teal-500 to-cyan-500",
    "from-pink-500 via-red-500 to-yellow-500",
    "from-indigo-500 via-purple-500 to-pink-500",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGradient((prev) => (prev + 1) % gradients.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
      {/* Animated Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradients[currentGradient]} transition-all duration-1000 ease-in-out`}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Circles */}
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-white/8 rounded-full blur-2xl animate-bounce"></div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:pr-80 xl:pr-80">
        {/* Badge */}
        <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 sm:mb-8">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
          <span className="text-white/90 text-xs sm:text-sm font-medium">
            ✨ Now with AI-powered flow suggestions
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-white mb-6 sm:mb-8 leading-tight">
          <span className="block">Build USSD Apps</span>
          <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent animate-pulse">
            Without Code
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
          Create powerful USSD applications with our intelligent drag-and-drop
          builder.
          <span className="text-yellow-300 font-semibold">
            {" "}
            No coding required.
          </span>
          Launch your USSD service in minutes, not months.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16 sm:mb-20 px-4">
          <button className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-white text-gray-900 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 w-full sm:w-auto">
            <span className="relative z-10">🚀 Start Building Free</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-transparent text-white border-2 border-white/30 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 w-full sm:w-auto">
            <span className="relative z-10 flex items-center justify-center">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
              Watch Demo
            </span>
          </button>
        </div>

        {/* Stats */}
        <div className="mt-12 sm:mt-16 mb-16 sm:mb-20 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
            <div className="text-center p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">
                10K+
              </div>
              <div className="text-white/80 text-xs sm:text-sm md:text-base font-medium">
                Active Users
              </div>
            </div>
            <div className="text-center p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">
                50K+
              </div>
              <div className="text-white/80 text-xs sm:text-sm md:text-base font-medium">
                USSD Sessions
              </div>
            </div>
            <div className="text-center p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">
                99.9%
              </div>
              <div className="text-white/80 text-xs sm:text-sm md:text-base font-medium">
                Uptime
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Desktop USSD Phone Mockup */}
      <div className="absolute right-10 top-1/2 transform -translate-y-1/2 hidden lg:block">
        <div className="relative">
          {/* Phone Frame */}
          <div className="w-64 h-96 bg-gray-900 rounded-3xl p-2 shadow-2xl">
            <div className="w-full h-full bg-gradient-to-b from-blue-900 to-purple-900 rounded-2xl p-4 relative overflow-hidden">
              {/* Screen Content */}
              <div className="text-white text-center">
                <div className="text-sm font-bold mb-4">USSD Service</div>
                <div className="space-y-2 text-xs">
                  <div className="bg-white/20 rounded p-2">
                    1. Check Balance
                  </div>
                  <div className="bg-white/20 rounded p-2">
                    2. Transfer Money
                  </div>
                  <div className="bg-white/20 rounded p-2">3. Buy Airtime</div>
                  <div className="bg-white/20 rounded p-2">4. Pay Bills</div>
                </div>
              </div>

              {/* Animated Cursor */}
              <div className="absolute bottom-4 left-4 w-2 h-4 bg-yellow-400 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Glow Effect */}
          <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-xl animate-pulse"></div>
        </div>
      </div>

      {/* Gradient Overlay for Depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
    </section>
  );
};

export default Hero;
