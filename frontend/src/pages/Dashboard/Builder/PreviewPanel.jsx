import {Play} from "lucide-react";
import {motion} from "framer-motion";
  
const PreviewPanel = ({ project }) => {
  return (
    <div className="p-8 h-full bg-white rounded-xl border border-gray-200 shadow-lg">
      <div className="py-12 text-center">
        <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
          <Play className="w-8 h-8 text-white" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">Test Your USSD App</h3>
        <p className="mb-6 text-gray-600">Simulate the user experience</p>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <Play className="inline mr-2 w-5 h-5" />
          Start Test
        </motion.button>
      </div>
    </div>
  );
};
export default PreviewPanel;