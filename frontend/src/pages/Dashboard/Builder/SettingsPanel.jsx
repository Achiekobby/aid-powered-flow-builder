
const SettingsPanel = ({ project }) => {
  return (
    <div className="p-8 h-full bg-white rounded-xl border border-gray-200 shadow-lg">
      <h3 className="mb-6 text-lg font-semibold text-gray-900">Project Settings</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Project Name
          </label>
          <input
            type="text"
            defaultValue={project.name}
            className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            USSD Short Code
          </label>
          <input
            type="text"
            defaultValue={project.shortCode}
            className="px-4 py-3 w-full font-mono rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Session Timeout (seconds)
          </label>
          <input
            type="number"
            defaultValue="60"
            className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>
    </div>
  );
};
export default SettingsPanel;