import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ArrowRight, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AiProvider, AiProviderConfig } from '@/types/ai';
import { getAiProviders } from '@/services/aiModelService';
import { createProviderWithConfig, getDefaultTemplates } from '@/services/aiProviderConfigService';

import ProviderBasicInfo from './wizard-steps/ProviderBasicInfo';
import AuthConfig from './wizard-steps/AuthConfig';
import EndpointsConfig from './wizard-steps/EndpointsConfig';
import RequestTemplates from './wizard-steps/RequestTemplates';
import ResponseMappings from './wizard-steps/ResponseMappings';
import StreamConfig from './wizard-steps/StreamConfig';
import TokenAndCostConfig from './wizard-steps/TokenAndCostConfig';
import TestConfig from './wizard-steps/TestConfig';

const steps = [
  { id: 'basic-info', label: 'Basic Info' },
  { id: 'auth', label: 'Authentication' },
  { id: 'endpoints', label: 'Endpoints' },
  { id: 'request', label: 'Request Format' },
  { id: 'response', label: 'Response Mapping' },
  { id: 'stream', label: 'Streaming' },
  { id: 'tokens', label: 'Tokens & Cost' },
  { id: 'test', label: 'Test' },
];

const ProviderConfigWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [providers, setProviders] = useState<AiProvider[]>([]);
  const [templates, setTemplates] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  const [providerData, setProviderData] = useState<Partial<AiProvider>>({
    name: '',
    slug: '',
    description: '',
    logo_url: '',
    is_active: true,
  });
  
  const [configData, setConfigData] = useState<Partial<AiProviderConfig>>({
    version: '1.0',
    auth_config: {
      type: 'bearer',
      key_name: 'Authorization',
    },
    endpoints: {
      base_url: '',
      chat: '',
    },
    request_templates: {
      chat: {},
    },
    response_mappings: {
      chat: {},
    },
    stream_config: {
      prefix: 'data: ',
      done_mark: 'data: [DONE]',
      content_path: '',
    },
    token_calculation: {
      method: 'ratio',
      ratio: 4,
    },
    cost_calculation: {
      input_rate: 0.002,
      output_rate: 0.002,
    },
    is_active: true,
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [providersData, templatesData] = await Promise.all([
          getAiProviders(),
          getDefaultTemplates(),
        ]);
        setProviders(providersData);
        setTemplates(templatesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load providers and templates',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSave = async () => {
    setSaving(true);
    try {
      await createProviderWithConfig(providerData, configData);
      toast({
        title: 'Success',
        description: 'Provider with configuration created successfully',
      });
      navigate('/admin/ai-providers');
    } catch (error) {
      console.error('Error saving provider with configuration:', error);
      toast({
        title: 'Error',
        description: 'Failed to save provider with configuration',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };
  
  const applyTemplate = (templateName: string) => {
    if (templates[templateName]) {
      setConfigData({
        ...configData,
        ...templates[templateName],
      });
      setSelectedTemplate(templateName);
      toast({
        title: 'Template Applied',
        description: `Applied ${templateName} template`,
      });
    }
  };
  
  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'basic-info':
        return (
          <ProviderBasicInfo
            providerData={providerData}
            setProviderData={setProviderData}
            existingProviders={providers}
            templates={Object.keys(templates)}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={applyTemplate}
          />
        );
      case 'auth':
        return (
          <AuthConfig
            authConfig={configData.auth_config || {}}
            onChange={(authConfig) => setConfigData({ ...configData, auth_config: authConfig })}
          />
        );
      case 'endpoints':
        return (
          <EndpointsConfig
            endpoints={configData.endpoints || {}}
            onChange={(endpoints) => setConfigData({ ...configData, endpoints })}
          />
        );
      case 'request':
        return (
          <RequestTemplates
            requestTemplates={configData.request_templates || {}}
            onChange={(requestTemplates) => setConfigData({ ...configData, request_templates: requestTemplates })}
          />
        );
      case 'response':
        return (
          <ResponseMappings
            responseMappings={configData.response_mappings || {}}
            onChange={(responseMappings) => setConfigData({ ...configData, response_mappings: responseMappings })}
          />
        );
      case 'stream':
        return (
          <StreamConfig
            streamConfig={configData.stream_config || {}}
            onChange={(streamConfig) => setConfigData({ ...configData, stream_config: streamConfig })}
          />
        );
      case 'tokens':
        return (
          <TokenAndCostConfig
            tokenCalculation={configData.token_calculation || {}}
            costCalculation={configData.cost_calculation || {}}
            onChange={(data) => setConfigData({
              ...configData,
              token_calculation: data.tokenCalculation,
              cost_calculation: data.costCalculation,
            })}
          />
        );
      case 'test':
        return (
          <TestConfig
            providerData={providerData}
            configData={configData}
          />
        );
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/ai-providers')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>Add New AI Provider</CardTitle>
            <CardDescription>
              Configure a new AI provider with a step-by-step wizard
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={steps[currentStep].id} className="w-full">
          <TabsList className="grid grid-cols-8 w-full">
            {steps.map((step, index) => (
              <TabsTrigger
                key={step.id}
                value={step.id}
                onClick={() => setCurrentStep(index)}
                disabled={saving}
                className={index === currentStep ? 'bg-primary text-primary-foreground' : ''}
              >
                {index + 1}. {step.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mt-6">
            {renderStepContent()}
          </div>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0 || saving}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext} disabled={saving}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Provider
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProviderConfigWizard;
