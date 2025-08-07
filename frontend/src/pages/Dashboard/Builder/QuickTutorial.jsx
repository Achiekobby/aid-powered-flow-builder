import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ArrowRight,
  MessageSquare,
  Hash,
  CheckCircle,
  Star,
  Lightbulb,
  Users,
  Smartphone,
  Zap,
  Heart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const tutorialSteps = [
  {
    id: 1,
    title: "Welcome to Easy USSD Builder! 👋",
    icon: Heart,
    color: "from-pink-500 to-rose-500",
    content: {
      subtitle: "Build phone menus without any coding!",
      description: "This tool helps you create interactive phone menu systems (like *123# services) that anyone can use. Perfect for banks, telecom services, or any business wanting to provide phone-based services.",
      tips: [
        "🎯 No technical knowledge required",
        "📱 Works on any phone - smart or basic",
        "⚡ Create complete flows in minutes",
        "🔄 Test everything before going live"
      ]
    }
  },
  {
    id: 2,
    title: "Three Types of Building Blocks",
    icon: MessageSquare,
    color: "from-blue-500 to-indigo-500",
    content: {
      subtitle: "Everything you need to build amazing phone experiences",
      description: "Your USSD service is built using three simple building blocks. Each one has a specific purpose and they work together to create smooth user experiences.",
      blocks: [
        {
          icon: MessageSquare,
          name: "Menu",
          color: "blue",
          description: "Shows options to users",
          example: "1. Check Balance\n2. Send Money\n3. Buy Airtime"
        },
        {
          icon: Hash,
          name: "Get Input",
          color: "green", 
          description: "Asks users to enter information",
          example: "Enter amount: ____\nEnter phone number: ____"
        },
        {
          icon: CheckCircle,
          name: "End Message",
          color: "red",
          description: "Shows final message and ends session",
          example: "Thank you! Your balance is $50.00"
        }
      ]
    }
  },
  {
    id: 3,
    title: "How to Build Your Flow",
    icon: Zap,
    color: "from-purple-500 to-violet-500",
    content: {
      subtitle: "Step-by-step building process",
      description: "Building your USSD service is as easy as dragging and connecting blocks. Here's how to do it:",
      steps: [
        {
          step: 1,
          action: "Add Blocks",
          description: "Click the colored buttons to add Menu, Input, or End blocks to your canvas",
          icon: "+"
        },
        {
          step: 2,
          action: "Edit Content", 
          description: "Click on any block to edit its content - add menu options, change messages, etc.",
          icon: "✏️"
        },
        {
          step: 3,
          action: "Connect Blocks",
          description: "Drag from the dots on the right side of blocks to connect them together",
          icon: "🔗"
        },
        {
          step: 4,
          action: "Test & Save",
          description: "Use the phone preview to test your flow, then save when you're happy!",
          icon: "📱"
        }
      ]
    }
  },
  {
    id: 4,
    title: "Pro Tips for Great USSD Services",
    icon: Lightbulb,
    color: "from-yellow-500 to-amber-500",
    content: {
      subtitle: "Make your service user-friendly and professional",
      description: "Follow these simple guidelines to create USSD services that users love:",
      tips: [
        {
          icon: Users,
          title: "Keep it Simple",
          description: "Use 3-7 menu options max. Too many choices confuse users."
        },
        {
          icon: MessageSquare,
          title: "Clear Language",
          description: "Use simple words everyone understands. Avoid technical jargon."
        },
        {
          icon: ArrowRight,
          title: "Logical Flow",
          description: "Make sure the path from start to finish makes sense."
        },
        {
          icon: Smartphone,
          title: "Always Include Back",
          description: "Add '0. Back' option in every menu so users can go back."
        }
      ]
    }
  }
];

const QuickTutorial = ({ isOpen, onClose, onCreateSample }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showFinalActions, setShowFinalActions] = useState(false);

  const currentTutorial = tutorialSteps[currentStep];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowFinalActions(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowFinalActions(false);
    }
  };

  const handleCreateSample = () => {
    onCreateSample?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex fixed inset-0 z-50 justify-center items-center p-4 backdrop-blur-sm bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <div className={`p-3 bg-gradient-to-r ${currentTutorial.color} rounded-xl`}>
                <currentTutorial.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Quick Tutorial
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Step {currentStep + 1} of {tutorialSteps.length}
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {currentTutorial.title}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round(((currentStep + 1) / tutorialSteps.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-slate-700">
              <motion.div
                className={`h-2 bg-gradient-to-r ${currentTutorial.color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 p-6">
            <AnimatePresence mode="wait">
              {!showFinalActions ? (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {currentTutorial.title}
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      {currentTutorial.content.subtitle}
                    </p>
                  </div>

                  <div className="mx-auto max-w-3xl">
                    <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
                      {currentTutorial.content.description}
                    </p>

                    {/* Step-specific content */}
                    {currentTutorial.content.tips && (
                      <div className="grid gap-4 md:grid-cols-2">
                        {currentTutorial.content.tips.map((tip, index) => {
                          // Handle both string tips and object tips
                          if (typeof tip === 'string') {
                            return (
                              <div key={index} className="flex items-center p-4 space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl dark:from-slate-800 dark:to-slate-700">
                                <span className="text-2xl">{tip.split(' ')[0]}</span>
                                <span className="text-gray-700 dark:text-gray-300">{tip.substring(tip.indexOf(' ') + 1)}</span>
                              </div>
                            );
                          } else {
                            // Handle object tips with icon, title, and description
                            return (
                              <div key={index} className="flex items-start p-4 space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl dark:from-slate-800 dark:to-slate-700">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                  <tip.icon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{tip.title}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{tip.description}</p>
                                </div>
                              </div>
                            );
                          }
                        })}
                      </div>
                    )}

                    {currentTutorial.content.blocks && (
                      <div className="grid gap-4 md:grid-cols-3">
                        {currentTutorial.content.blocks.map((block, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 bg-white rounded-xl border-2 border-gray-200 transition-colors dark:bg-slate-700 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500"
                          >
                            <div className={`inline-flex p-3 bg-${block.color}-100 dark:bg-${block.color}-900/20 rounded-lg mb-4`}>
                              <block.icon className={`w-6 h-6 text-${block.color}-600 dark:text-${block.color}-400`} />
                            </div>
                            <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                              {block.name}
                            </h4>
                            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                              {block.description}
                            </p>
                            <div className="p-3 bg-gray-50 rounded-lg dark:bg-slate-800">
                              <pre className="font-mono text-xs text-gray-700 whitespace-pre-line dark:text-gray-300">
                                {block.example}
                              </pre>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {currentTutorial.content.steps && (
                      <div className="space-y-4">
                        {currentTutorial.content.steps.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start p-4 space-x-4 bg-purple-50 rounded-xl dark:bg-purple-900/20"
                          >
                            <div className="flex justify-center items-center w-8 h-8 text-sm font-bold text-white bg-purple-600 rounded-full">
                              {step.step}
                            </div>
                            <div className="flex-1">
                              <h4 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
                                {step.icon} {step.action}
                              </h4>
                              <p className="text-gray-600 dark:text-gray-400">
                                {step.description}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {currentTutorial.content.tips && currentStep === 3 && (
                      <div className="grid gap-4 md:grid-cols-2">
                        {currentTutorial.content.tips.map((tip, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start p-4 space-x-3 bg-yellow-50 rounded-xl dark:bg-yellow-900/20"
                          >
                            <tip.icon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                            <div>
                              <h4 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
                                {tip.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {tip.description}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8 text-center"
                >
                  <div>
                    <div className="flex justify-center items-center mx-auto mb-6 w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                      >
                        🎉
                      </motion.div>
                    </div>
                    <h3 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
                      You're Ready to Build! 
                    </h3>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                      Now you know everything you need to create amazing USSD services. 
                      Start with our sample flow or create your own from scratch!
                    </p>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleCreateSample}
                      className="flex items-center px-8 py-4 text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg transition-all hover:from-blue-600 hover:to-indigo-600 hover:shadow-xl"
                    >
                      <Star className="mr-2 w-5 h-5" />
                      Create Sample Flow
                    </button>
                    
                    <button
                      onClick={onClose}
                      className="flex items-center px-8 py-4 text-gray-700 bg-gray-100 rounded-xl transition-colors dark:text-gray-300 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600"
                    >
                      <Zap className="mr-2 w-5 h-5" />
                      Start from Scratch
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          {!showFinalActions && (
            <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-slate-700">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center px-4 py-2 text-gray-600 transition-colors dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="mr-1 w-4 h-4" />
                Previous
              </button>

              <div className="flex space-x-2">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep 
                        ? 'bg-blue-500' 
                        : index < currentStep 
                        ? 'bg-green-500' 
                        : 'bg-gray-300 dark:bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextStep}
                className="flex items-center px-6 py-2 text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-lg transition-all hover:from-blue-600 hover:to-indigo-600 hover:shadow-xl"
              >
                {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
                <ChevronRight className="ml-1 w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickTutorial;