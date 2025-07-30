import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import {
  ArrowLeft,
  Plus,
  Smartphone,
  Users,
  CreditCard,
  BarChart3,
  BookOpen,
  Heart,
  Building,
  Globe,
  Zap,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CreateProject = () => {
  const categories = [
    {
      id: "customer-service",
      name: "Customer Service",
      description: "Support and inquiry management",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      id: "payment",
      name: "Payment & Banking",
      description: "Mobile money and financial services",
      icon: CreditCard,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      gradient: "from-emerald-500 to-green-500",
    },
    {
      id: "healthcare",
      name: "Healthcare",
      description: "Medical appointments and health info",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      gradient: "from-red-500 to-pink-500",
    },
    {
      id: "education",
      name: "Education",
      description: "Student services and course info",
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      gradient: "from-purple-500 to-violet-500",
    },
    {
      id: "business",
      name: "Business Services",
      description: "Corporate and business applications",
      icon: Building,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      gradient: "from-orange-500 to-amber-500",
    },
    {
      id: "government",
      name: "Government",
      description: "Public services and information",
      icon: Globe,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      id: "utilities",
      name: "Utilities & Services",
      description: "Bills, services, and utilities",
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      id: "analytics",
      name: "Data & Analytics",
      description: "Surveys and data collection",
      icon: BarChart3,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      gradient: "from-cyan-500 to-blue-500",
    },
  ];
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  //Todo =>Validation Method
  const validateField = (name, value)=>{
    switch(name){
      case "title":
        if(!value.trim()) return "Project Title is required";
        if(value.length < 3) return "Title must be at least 3 characters";
        if(value.length>50) return "Title must be less than 50 characters";
        return "";
      case "description":
        if(!value.trim()) return "Project Description is required";
        if(value.length < 10) return "Description must be at least 10 characters";
        if(value.length>200) return "Description must be less than 200 characters";
        return "";
      case "category":
        if(!value) return "Category is required";
        return "";
      default:
        return "";
    }
  }

  // Todo => Handle Form Input Change(when user is typing)
  const handleInputChange = (field, value)=>{
    setFormData(prev=>({...prev, [field]:value}))
    if(touched[field]){
      const error = validateField(field, value);
      setErrors(prev=>({...prev, [field]: error}));
    }
  }

  // Todo => Handle Blur(when a user leaves the form input)
  const handleBlur = (field)=>{
    setTouched(prev=>({...prev,[field]:true}));
    const error = validateField(field, formData[field]);
    setErrors(prev=>({...prev, [field]:error}));
  }

  // Todo => Handle Form Validation
  const validateForm = ()=>{
    const newErrors = {};
    Object.keys(formData).forEach((field)=>{
      const error = validateField(field, formData[field]);
      if(error) newErrors[field]= error;
    })
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const generateId = ()=>{
    return Math.random().toString(36).substring(2,15);
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(!validateForm()) return;

    setIsSubmitting(true);
    try{
      // Simulate and API call
      await new Promise((resolve)=>setTimeout(resolve, 1000));
      navigate(`/dashboard/builder/${generateId()}`);
    }catch(error){
      console.log("Form Submission Error:", error);
    }finally{
      setIsSubmitting(false);
    }
  }
  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard/projects")}
            className="p-2 mr-4 text-gray-500 rounded-lg transition-colors duration-200 hover:text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-emerald-800 to-gray-900">
              Create New Project
            </h1>
            <p className="mt-1 text-lg text-gray-600">
              Set up your USSD application and start building
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mx-auto max-w-5xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Project Basic Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-8 bg-white rounded-xl border border-gray-200 shadow-lg"
          >
            <div className="flex items-center mb-6">
              <div className="flex justify-center items-center mr-3 w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Project Information</h2>
            </div>
            
            <div className="space-y-6">
              {/* Project Title */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Project Title *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    onBlur={() => handleBlur("title")}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ${
                      errors.title ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter project title (e.g., Customer Service App)"
                  />
                  <AnimatePresence>
                    {formData.title && !errors.title && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <AnimatePresence>
                  {errors.title && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center mt-2 text-sm text-red-600"
                    >
                      <AlertCircle className="mr-1 w-4 h-4" />
                      {errors.title}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Project Description */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  onBlur={() => handleBlur("description")}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-none ${
                    errors.description ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Describe what your USSD application will do..."
                />
                <div className="flex justify-between items-center mt-2">
                  <AnimatePresence>
                    {errors.description && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center text-sm text-red-600"
                      >
                        <AlertCircle className="mr-1 w-4 h-4" />
                        {errors.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <span className={`text-xs ${
                    formData.description.length > 200 ? "text-red-500" : "text-gray-500"
                  }`}>
                    {formData.description.length}/200
                  </span>
                </div>
              </div>

              
            </div>
          </motion.div>

          {/* Category Selection */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-8 bg-white rounded-xl border border-gray-200 shadow-lg"
          >
            <div className="flex items-center mb-6">
              <div className="flex justify-center items-center mr-3 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Choose Category *</h2>
            </div>
            
            <AnimatePresence>
              {errors.category && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center mb-4 text-sm text-red-600"
                >
                  <AlertCircle className="mr-1 w-4 h-4" />
                  {errors.category}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                const isSelected = formData.category === category.id;
                
                return (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => handleInputChange("category", category.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      isSelected
                        ? `border-emerald-500 bg-gradient-to-r ${category.gradient} bg-opacity-10 shadow-lg`
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 ${category.bgColor} rounded-lg flex items-center justify-center border ${category.borderColor}`}>
                        <IconComponent className={`w-5 h-5 ${category.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="flex justify-center items-center w-5 h-5 bg-emerald-500 rounded-full"
                          >
                            <CheckCircle className="w-2 h-2 text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-between items-center pt-6"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate("/dashboard/projects")}
              className="px-6 py-3 font-medium text-gray-700 bg-gray-100 rounded-lg transition-colors duration-200 hover:bg-gray-200"
            >
              Cancel
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-8 py-3 font-semibold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg shadow-lg transition-all duration-200 hover:from-emerald-600 hover:to-cyan-600 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 w-4 h-4 rounded-full border-2 animate-spin border-white/30 border-t-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 w-4 h-4" />
                  Create Project & Start Building
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateProject;
