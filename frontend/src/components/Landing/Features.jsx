import React from "react";

const Features = () => {
  const features = [
    {
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
          />
        </svg>
      ),
      title: "Visual Drag & Drop Builder",
      description:
        "Create USSD menus visually with our intuitive drag-and-drop interface. No coding required - just drag, drop, and configure.",
      color: "blue",
      ghanaContext: "Perfect for African businesses and organizations",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
      title: "Survey & Data Collection",
      description:
        "Conduct market research, customer feedback, and data collection surveys via USSD. Ideal for reaching rural communities across Africa.",
      color: "green",
      ghanaContext: "Reach all 16 regions of Ghana and expand across Africa",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
      title: "Mobile Money Integration",
      description:
        "Seamlessly integrate with MTN Mobile Money, Vodafone Cash, and AirtelTigo Money for payments and transactions.",
      color: "yellow",
      ghanaContext:
        "Coming Soon - Integration with Africa's mobile money ecosystem",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      title: "Real-time Analytics",
      description:
        "Track usage patterns, monitor performance, and get detailed insights with real-time dashboards and reports.",
      color: "purple",
      ghanaContext: "Monitor usage across all major African networks",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "Instant Deployment",
      description:
        "Deploy your USSD application instantly with a single click. Go live in minutes, not months.",
      color: "red",
      ghanaContext: "Deploy across all African mobile networks instantly",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      title: "Enterprise Security",
      description:
        "Bank-grade security with encryption, authentication, and compliance with African data protection regulations.",
      color: "indigo",
      ghanaContext:
        "Compliant with Ghana's Data Protection Act and African standards",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Multi-language Support",
      description:
        "Support for English, Twi, Ga, Ewe, and other local languages to reach diverse communities across Africa.",
      color: "teal",
      ghanaContext:
        "Coming Soon - Connect with Africa's diverse linguistic communities",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      title: "24/7 African Support",
      description:
        "Local support team based in Accra, available 24/7 to help you build and manage your USSD applications across Africa.",
      color: "pink",
      ghanaContext:
        "Local support from our Accra headquarters, expanding across Africa",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600 border-blue-200",
      green: "bg-green-50 text-green-600 border-green-200",
      yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
      purple: "bg-purple-50 text-purple-600 border-purple-200",
      red: "bg-red-50 text-red-600 border-red-200",
      indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
      teal: "bg-teal-50 text-teal-600 border-teal-200",
      pink: "bg-pink-50 text-pink-600 border-pink-200",
    };
    return colors[color] || colors.blue;
  };

  return (
    <section
      id="features"
      className="py-20 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-50 border border-green-200 mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-green-700 text-sm font-medium">
              Made in Ghana 🇬🇭
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Powerful Features for
            <span className="block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Africa's Digital Revolution
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mt-8">
            Everything you need to create, deploy, and manage USSD applications
            and surveys. Built for Africa, starting with Ghana's unique digital
            landscape and expanding across the continent.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-gradient-to-br from-white via-gray-50/50 to-white rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100/50 flex flex-col h-full backdrop-blur-sm"
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(249,250,251,0.8) 50%, rgba(255,255,255,0.9) 100%)`,
              }}
            >
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5"></div>
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-xl"></div>
              </div>

              {/* Coming Soon Badge */}
              {feature.ghanaContext.includes("Coming Soon") && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="relative">
                    <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-lg px-3 py-2 shadow-lg">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div
                            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold text-gray-700 tracking-wide">
                          IN DEVELOPMENT
                        </span>
                      </div>
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                </div>
              )}

              {/* Icon Container with Clean Design */}
              <div className="relative mb-6">
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center border-2 ${getColorClasses(
                    feature.color
                  )} group-hover:scale-110 transition-all duration-500 flex-shrink-0 shadow-lg group-hover:shadow-xl bg-white`}
                >
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed flex-1">
                  {feature.description}
                </p>

                {/* Ghana Context with Modern Design */}
                <div className="flex items-center text-xs sm:text-sm text-green-600 font-semibold mt-auto p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100/50">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="leading-tight">{feature.ghanaContext}</span>
                </div>
              </div>

              {/* Enhanced Hover Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-transparent via-green-500/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-100">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Build Your USSD Solution?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join hundreds of African businesses and organizations already
              using our platform to reach millions of users across the
              continent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                🚀 Start Building Free
              </button>
              <button className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-bold hover:border-green-300 hover:text-green-600 transition-all duration-300">
                📞 Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
