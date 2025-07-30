import React, {useState} from 'react'
import {useParams, useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import {
  Home,
  Eye,
  Save,
  Rocket,
  ArrowLeft,
  Settings
} from "lucide-react";
import BuilderCanvas from "./BuilderCanvas";
import PreviewPanel from "./PreviewPanel";
import PhonePreview from "./PhonePreview";
import SettingsPanel from "./SettingsPanel";

const USSDBuilder = () => {
  const {projectId} = useParams();
  const navigate = useNavigate();

  // SAMPLE PROJECT DATA(LATER FORM API OR REDUX)
  const [project]  = useState({
    id: projectId,
    name:"Customer Service App",
    category:"customer-service",
    shortCode:"123456"
  })
  const [activeView, setActiveView] = useState('builder');


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Left Side - Back & Project Info */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard/projects')}
                className="p-2 text-gray-500 rounded-lg transition-colors duration-200 hover:text-gray-700 hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              
              <div>
                <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
                <p className="text-sm text-gray-500">USSD Code: {project.shortCode}</p>
              </div>
            </div>

            {/* Center - View Tabs */}
            <div className="flex items-center p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setActiveView('builder')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeView === 'builder'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Home className="inline mr-2 w-4 h-4" />
                Builder
              </button>
              <button
                onClick={() => setActiveView('preview')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeView === 'preview'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Eye className="inline mr-2 w-4 h-4" />
                Preview
              </button>
              <button
                onClick={() => setActiveView('settings')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeView === 'settings'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Settings className="inline mr-2 w-4 h-4" />
                Settings
              </button>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center px-4 py-2 font-medium text-gray-700 bg-gray-100 rounded-lg transition-colors duration-200 hover:bg-gray-200"
              >
                <Save className="mr-2 w-4 h-4" />
                Save
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center px-4 py-2 font-medium text-white bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg shadow-lg transition-all duration-200 hover:from-emerald-600 hover:to-cyan-600"
              >
                <Rocket className="mr-2 w-4 h-4" />
                Publish
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Builder Canvas */}
        <div className="flex-1 p-6">
          {activeView === 'builder' && (
            <BuilderCanvas />
          )}
          {activeView === 'preview' && (
            <PreviewPanel project={project} />
          )}
          {activeView === 'settings' && (
            <SettingsPanel project={project} />
          )}
        </div>

        {/* Phone Preview Sidebar */}
        <div className="p-6 w-80 bg-white border-l border-gray-200">
          <PhonePreview />
        </div>
      </div>
    </div>
  );
};


export default USSDBuilder