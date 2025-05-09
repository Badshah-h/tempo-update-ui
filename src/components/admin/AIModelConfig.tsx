import React, { useEffect, useState } from 'react';
import { aiRoutingService } from '../../services/aiRoutingService';

interface AIModelConfig {
  modelId: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  isActive: boolean;
}

const AIModelConfig: React.FC = () => {
  const [models, setModels] = useState<AIModelConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      const data = await aiRoutingService.getModels();
      setModels(data);
      setError(null);
    } catch (err) {
      setError('Failed to load AI models');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (modelId: string, isActive: boolean) => {
    try {
      await aiRoutingService.updateRule(modelId, { isActive });
      setModels(models.map(model => 
        model.modelId === modelId ? { ...model, isActive } : model
      ));
    } catch (err) {
      setError('Failed to update model status');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-4">Loading AI models...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">AI Model Configuration</h2>
      <div className="grid gap-4">
        {models.map(model => (
          <div key={model.modelId} className="border p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{model.name}</h3>
                <p className="text-gray-600">{model.description}</p>
              </div>
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={model.isActive}
                    onChange={(e) => handleToggleActive(model.modelId, e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    {model.isActive ? 'Active' : 'Inactive'}
                  </span>
                </label>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Parameters:</h4>
              <pre className="bg-gray-100 p-2 rounded">
                {JSON.stringify(model.parameters, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIModelConfig; 