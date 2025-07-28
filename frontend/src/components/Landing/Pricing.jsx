import React from "react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "₵150",
      period: "/month",
      description: "Perfect for small businesses and startups",
      popular: false,
      features: [
        "1 USSD Application",
        "1,000 Sessions/month",
        "Basic Analytics Dashboard",
        "Email Support",
        "Standard Templates",
        "Ghana Mobile Networks"
      ],
             buttonText: "Start Free Trial",
       buttonStyle: "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
     },
     {
       name: "Professional",
       price: "₵450",
       period: "/month",
       description: "Most popular choice for growing businesses",
       popular: true,
       features: [
         "5 USSD Applications",
         "10,000 Sessions/month",
         "Advanced Analytics & Reports",
         "Priority Support",
         "Custom Templates",
         "Multi-language Support",
         "Survey & Data Collection",
         "Real-time Monitoring"
       ],
       buttonText: "Get Started Now",
       buttonStyle: "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
     },
     {
       name: "Enterprise",
       price: "₵1,200",
       period: "/month",
       description: "For large organizations and enterprises",
       popular: false,
       features: [
         "Unlimited USSD Applications",
         "Unlimited Sessions",
         "Custom Analytics & API Access",
         "24/7 Dedicated Support",
         "Custom Development",
         "White-label Solutions",
         "Advanced Security Features",
         "SLA Guarantee"
       ],
       buttonText: "Contact Sales",
       buttonStyle: "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-50 border border-green-200 mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-green-700 text-sm font-medium">
              Transparent Pricing 🇬🇭
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Choose Your
            <span className="block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Growth Plan
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Start building your USSD solutions today. All plans include our powerful drag-and-drop builder, 
            real-time analytics, and support for all major Ghanaian mobile networks.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 xl:gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative group ${
                plan.popular 
                  ? 'lg:scale-105 lg:-mt-4 lg:mb-4' 
                  : 'lg:scale-100'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      MOST POPULAR
                    </div>
                  </div>
                </div>
              )}

                             {/* Card */}
               <div className={`relative h-full bg-gradient-to-br from-white via-gray-50/50 to-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border flex flex-col overflow-hidden ${
                 plan.popular 
                   ? 'border-green-200 shadow-green-100/50 ring-2 ring-green-100/50' 
                   : 'border-gray-100'
               }`}>
                 
                 {/* Gradient Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/30 rounded-3xl"></div>
                 
                 {/* Animated Background */}
                 <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                   <div className="absolute inset-0 bg-gradient-to-br from-green-500/8 via-blue-500/8 to-purple-500/8 rounded-3xl"></div>
                   <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-green-400/25 to-blue-400/25 rounded-full blur-2xl animate-pulse"></div>
                   <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-tr from-purple-400/25 to-pink-400/25 rounded-full blur-2xl animate-pulse"></div>
                 </div>
                 
                 {/* Top Accent Line */}
                 <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                   plan.popular 
                     ? 'from-green-500 via-blue-500 to-purple-500' 
                     : 'from-gray-300 via-gray-400 to-gray-500'
                 } rounded-t-3xl`}></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                                     {/* Plan Header */}
                   <div className="text-center mb-8">
                     <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                       plan.popular 
                         ? 'bg-green-100 text-green-700 border border-green-200' 
                         : 'bg-gray-100 text-gray-600 border border-gray-200'
                     }`}>
                       {plan.popular ? '⭐ Most Popular' : 'Standard Plan'}
                     </div>
                     
                     <h3 className={`text-3xl font-bold mb-3 ${
                       plan.popular ? 'text-green-600' : 'text-gray-900'
                     }`}>
                       {plan.name}
                     </h3>
                     <p className="text-gray-600 text-sm mb-6 leading-relaxed">{plan.description}</p>
                     
                     {/* Price */}
                     <div className="mb-6">
                       <div className="flex items-baseline justify-center">
                         <span className={`text-6xl font-bold ${
                           plan.popular ? 'text-green-600' : 'text-gray-900'
                         }`}>{plan.price}</span>
                         <span className="text-xl text-gray-500 ml-2">{plan.period}</span>
                       </div>
                       <p className="text-sm text-gray-500 mt-3">No hidden fees • Cancel anytime</p>
                     </div>
                   </div>

                                     {/* Features */}
                   <div className="space-y-4 mb-8 flex-1">
                     {plan.features.map((feature, featureIndex) => (
                       <div key={featureIndex} className="flex items-start group/feature">
                         <div className="flex-shrink-0 w-6 h-6 mt-0.5">
                           <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                             plan.popular 
                               ? 'bg-green-100 group-hover/feature:bg-green-200' 
                               : 'bg-gray-100 group-hover/feature:bg-gray-200'
                           }`}>
                             <svg
                               className={`w-4 h-4 transition-all duration-200 ${
                                 plan.popular ? 'text-green-600' : 'text-gray-600'
                               }`}
                               fill="currentColor"
                               viewBox="0 0 20 20"
                             >
                               <path
                                 fillRule="evenodd"
                                 d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                 clipRule="evenodd"
                               />
                             </svg>
                           </div>
                         </div>
                         <span className="ml-3 text-gray-700 text-sm leading-relaxed group-hover/feature:text-gray-900 transition-colors duration-200">{feature}</span>
                       </div>
                     ))}
                   </div>

                                     {/* CTA Button */}
                   <div className="mt-auto">
                     <button className={`w-full py-4 px-6 rounded-2xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${plan.buttonStyle} relative overflow-hidden group`}>
                       <span className="relative z-10">{plan.buttonText}</span>
                       <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                     </button>

                     {/* Additional Info */}
                     <div className="text-center mt-4">
                       <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                         plan.popular 
                           ? 'bg-green-50 text-green-600 border border-green-200' 
                           : 'bg-gray-50 text-gray-600 border border-gray-200'
                       }`}>
                         {plan.name === "Starter" && "🆓 14-day free trial"}
                         {plan.name === "Professional" && "🛡️ 30-day money-back guarantee"}
                         {plan.name === "Enterprise" && "📋 Custom contract terms"}
                       </div>
                     </div>
                   </div>
                </div>

                                 {/* Corner Accent */}
                 {plan.popular && (
                   <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-transparent via-green-500/15 to-transparent rounded-bl-3xl"></div>
                 )}
                 
                 {/* Bottom Accent */}
                 <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
                   plan.popular 
                     ? 'from-green-500 via-blue-500 to-purple-500' 
                     : 'from-gray-300 via-gray-400 to-gray-500'
                 } rounded-b-3xl opacity-50`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-100 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              All Plans Include
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700">Ghana Mobile Network Support</span>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700">Drag & Drop Builder</span>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700">Instant Deployment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
