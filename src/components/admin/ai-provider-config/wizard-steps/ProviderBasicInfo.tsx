import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AiProvider } from '@/types/ai';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProviderBasicInfoProps {
  providerData: Partial<AiProvider>;
  setProviderData: React.Dispatch<React.SetStateAction<Partial<AiProvider>>>;
  existingProviders: AiProvider[];
  templates: string[];
  selectedTemplate: string | null;
  onSelectTemplate: (template: string) => void;
}

const ProviderBasicInfo: React.FC<ProviderBasicInfoProps> = ({
  providerData,
  setProviderData,
  existingProviders,
  templates,
  selectedTemplate,
  onSelectTemplate,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProviderData({
      ...providerData,
      [name]: value,
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setProviderData({
      ...providerData,
      is_active: checked,
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setProviderData({
      ...providerData,
      name,
      slug: generateSlug(name),
    });
  };

  const isSlugUnique = () => {
    if (!providerData.slug) return true;
    return !existingProviders.some(provider => provider.slug === providerData.slug);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Provider Template</CardTitle>
          <CardDescription>
            Start with a template for a common AI provider or create your own
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedTemplate || ''}
            onValueChange={onSelectTemplate}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a template (optional)" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template} value={template}>
                  {template.charAt(0).toUpperCase() + template.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Provider Name</Label>
            <Input
              id="name"
              name="name"
              value={providerData.name}
              onChange={handleNameChange}
              placeholder="e.g., OpenAI, Anthropic, etc."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug
              {!isSlugUnique() && (
                <span className="text-destructive ml-2 text-sm">
                  This slug is already in use
                </span>
              )}
            </Label>
            <Input
              id="slug"
              name="slug"
              value={providerData.slug}
              onChange={handleChange}
              placeholder="e.g., openai, anthropic, etc."
              className={!isSlugUnique() ? 'border-destructive' : ''}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={providerData.description || ''}
            onChange={handleChange}
            placeholder="Describe this AI provider..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo_url">Logo URL (optional)</Label>
          <Input
            id="logo_url"
            name="logo_url"
            value={providerData.logo_url || ''}
            onChange={handleChange}
            placeholder="https://example.com/logo.png"
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="is_active"
            checked={providerData.is_active}
            onCheckedChange={handleSwitchChange}
          />
          <Label htmlFor="is_active">Active</Label>
        </div>
      </div>
    </div>
  );
};

export default ProviderBasicInfo;
