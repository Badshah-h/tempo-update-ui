import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Pencil, Trash2, Plus, Check, X, Zap } from 'lucide-react';
import { AIModel } from '@/types/ai';
import { getAIModels, toggleAIModelActive, deleteAIModel } from '@/services/aiModelService';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AIModelsList: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteModelId, setDeleteModelId] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchModels = async () => {
    try {
      setLoading(true);
      const data = await getAIModels();
      setModels(data);
    } catch (error) {
      console.error('Error fetching AI models:', error);
      toast({
        title: 'Error',
        description: 'Failed to load AI models',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleToggleActive = async (id: number) => {
    try {
      const updatedModel = await toggleAIModelActive(id);
      setModels(models.map(model =>
        model.id === id ? { ...model, is_active: updatedModel.is_active } : model
      ));
      toast({
        title: 'Success',
        description: `Model ${updatedModel.is_active ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error('Error toggling model status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update model status',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteModelId) return;

    try {
      await deleteAIModel(deleteModelId);
      setModels(models.filter(model => model.id !== deleteModelId));
      toast({
        title: 'Success',
        description: 'AI model deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting model:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete AI model',
        variant: 'destructive',
      });
    } finally {
      setDeleteModelId(null);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/ai-models/edit/${id}`);
  };

  const handleTest = (id: number) => {
    navigate(`/admin/ai-models/test/${id}`);
  };

  const handleAddNew = () => {
    navigate('/admin/ai-models/new');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>AI Models</CardTitle>
          <CardDescription>Manage your AI models</CardDescription>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Model
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Default</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No AI models found. Click "Add Model" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                models.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell className="font-medium">{model.name}</TableCell>
                    <TableCell>{model.provider?.name || 'Unknown'}</TableCell>
                    <TableCell>{model.type}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={model.is_active}
                          onCheckedChange={() => handleToggleActive(model.id)}
                        />
                        <Badge variant={model.is_active ? "success" : "secondary"}>
                          {model.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {model.is_default ? (
                        <Badge variant="default" className="bg-primary">
                          <Check className="h-3 w-3 mr-1" />
                          Default
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <X className="h-3 w-3 mr-1" />
                          No
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(model.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleTest(model.id)}
                          disabled={!model.is_active}
                        >
                          <Zap className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeleteModelId(model.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the AI model "{model.name}".
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setDeleteModelId(null)}>
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AIModelsList;
