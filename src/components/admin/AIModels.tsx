import React, { useState, useEffect } from "react";
import AdminPageContainer from "./AdminPageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, BarChart, Zap, Loader2, Plus } from "lucide-react";
import { getAiModelConfigs, deleteAiModelConfig } from "@/services/aiModelService";
import { AiModelConfig } from "@/types/ai";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

// Import the smaller components
import ModelsList from "./ai-models/ModelsList";
import ModelConfigTab from "./ai-models/ModelConfigTab";
import ModelPerformanceTab from "./ai-models/ModelPerformanceTab";
import ModelTestTab from "./ai-models/ModelTestTab";
import ModelEmptyState from "./ai-models/ModelEmptyState";
import DeleteModelDialog from "./ai-models/DeleteModelDialog";
import AddModelDialog from "./ai-models/AddModelDialog";

const AIModels = () => {
  const { toast } = useToast();
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<number | null>(null);
  const [models, setModels] = useState<AiModelConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const data = await getAiModelConfigs();
      setModels(data);

      // Set the first model as active if available
      if (data.length > 0 && !activeModel) {
        setActiveModel(data[0].id.toString());
      }

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch AI models:", error);
      toast({
        variant: "destructive",
        title: "Failed to load models",
        description: "Could not load AI models. Please try again later.",
      });
      setLoading(false);
    }
  };

  const handleDeleteClick = (modelId: number) => {
    setModelToDelete(modelId);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!modelToDelete) return;

    try {
      await deleteAiModelConfig(modelToDelete.toString());
      setModels(models.filter(model => model.id !== modelToDelete));
      toast({
        title: "Model deleted",
        description: "AI model was successfully deleted",
      });

      // If the deleted model was active, set another model as active
      if (activeModel === modelToDelete.toString()) {
        const remainingModels = models.filter(model => model.id !== modelToDelete);
        if (remainingModels.length > 0) {
          setActiveModel(remainingModels[0].id.toString());
        } else {
          setActiveModel(null);
        }
      }
    } catch (error) {
      console.error(`Failed to delete model ${modelToDelete}:`, error);
      toast({
        variant: "destructive",
        title: "Failed to delete model",
        description: "Please try again later",
      });
    }

    setShowDeleteDialog(false);
    setModelToDelete(null);
  };

  const handleModelUpdate = async (updatedModel: AiModelConfig) => {
    try {
      await fetchModels();
      toast({
        title: "Model updated",
        description: "AI model was successfully updated.",
      });
    } catch (error) {
      console.error("Failed to refresh models after update:", error);
      toast({
        variant: "destructive",
        title: "Failed to refresh models",
        description: "Could not refresh AI models after update. Please reload the page.",
      });
    }
  };

  if (loading) {
    return (
      <AdminPageContainer
        title="AI Models"
        description="Configure and manage the AI models used by your chat system."
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading AI models...</span>
        </div>
      </AdminPageContainer>
    );
  }

  const activeModelData = activeModel
    ? models.find(m => m.id.toString() === activeModel)
    : null;

  return (
    <AdminPageContainer
      title="AI Models"
      description="Configure and manage the AI models used by your chat system."
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col gap-4">
          <Button onClick={() => setShowAddDialog(true)} className="w-full mb-2" variant="default">
            <Plus className="h-4 w-4 mr-2" /> Add New Model
          </Button>
          <ModelsList
            models={models}
            activeModel={activeModel}
            setActiveModel={setActiveModel}
            isLoading={loading}
          />
        </div>
        <div className="flex-1">
          {activeModelData ? (
            <Tabs defaultValue="configuration" className="w-full">
              <TabsList className="w-full max-w-md grid grid-cols-3">
                <TabsTrigger
                  value="configuration"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Configuration</span>
                </TabsTrigger>
                <TabsTrigger
                  value="performance"
                  className="flex items-center gap-2"
                >
                  <BarChart className="h-4 w-4" />
                  <span>Performance</span>
                </TabsTrigger>
                <TabsTrigger value="test" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>Test Model</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="configuration" className="pt-6">
                <ModelConfigTab
                  model={activeModelData}
                  onDelete={handleDeleteClick}
                  onModelUpdate={handleModelUpdate}
                  toast={toast}
                />
              </TabsContent>

              <TabsContent value="performance" className="pt-6">
                <ModelPerformanceTab model={activeModelData} />
              </TabsContent>

              <TabsContent value="test" className="pt-6">
                <ModelTestTab model={activeModelData} toast={toast} />
              </TabsContent>
            </Tabs>
          ) : (
            <ModelEmptyState />
          )}
        </div>
      </div>
      <AddModelDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onModelAdded={fetchModels}
        toast={toast}
      />
      <DeleteModelDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
      />
    </AdminPageContainer>
  );
};

export default AIModels;
