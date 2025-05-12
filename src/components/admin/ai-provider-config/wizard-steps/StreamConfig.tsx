import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface StreamConfigProps {
  streamConfig: Record<string, any>;
  onChange: (streamConfig: Record<string, any>) => void;
}

const StreamConfig: React.FC<StreamConfigProps> = ({ streamConfig, onChange }) => {
  const handleChange = (field: string, value: any) => {
    onChange({
      ...streamConfig,
      [field]: value,
    });
  };

  const handleStreamTypeChange = (value: string) => {
    onChange({
      ...streamConfig,
      type: value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Streaming Configuration</CardTitle>
        <CardDescription>
          Configure how to handle streaming responses from the API
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="streaming_enabled"
            checked={streamConfig.enabled !== false}
            onCheckedChange={(checked) => handleChange('enabled', checked)}
          />
          <Label htmlFor="streaming_enabled">Enable Streaming</Label>
        </div>

        {streamConfig.enabled !== false && (
          <>
            <div className="space-y-4">
              <Label>Streaming Format</Label>
              <RadioGroup
                value={streamConfig.type || 'sse'}
                onValueChange={handleStreamTypeChange}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sse" id="sse" />
                  <Label htmlFor="sse" className="font-normal">
                    Server-Sent Events (SSE)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="newline" id="newline" />
                  <Label htmlFor="newline" className="font-normal">
                    Newline Delimited
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom" className="font-normal">
                    Custom Format
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prefix">Chunk Prefix</Label>
              <Input
                id="prefix"
                value={streamConfig.prefix || ''}
                onChange={(e) => handleChange('prefix', e.target.value)}
                placeholder="data: "
              />
              <p className="text-sm text-muted-foreground">
                The prefix that appears before each chunk (e.g., "data: " for SSE)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="done_mark">Done Marker</Label>
              <Input
                id="done_mark"
                value={streamConfig.done_mark || ''}
                onChange={(e) => handleChange('done_mark', e.target.value)}
                placeholder="data: [DONE]"
              />
              <p className="text-sm text-muted-foreground">
                The marker that indicates the stream is complete (e.g., "data: [DONE]" for SSE)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content_path">Content Path</Label>
              <Input
                id="content_path"
                value={streamConfig.content_path || ''}
                onChange={(e) => handleChange('content_path', e.target.value)}
                placeholder="choices.0.delta.content"
              />
              <p className="text-sm text-muted-foreground">
                The path to the content in each chunk (e.g., "choices.0.delta.content" for OpenAI)
              </p>
            </div>

            <div className="bg-muted p-3 rounded-md text-sm">
              <p className="font-medium mb-2">Example Stream Chunk:</p>
              <pre className="bg-muted-foreground/10 p-2 rounded mt-1 text-xs overflow-auto">
                {`data: {
  "choices": [
    {
      "delta": {
        "content": "Hello"
      }
    }
  ]
}`}
              </pre>
              <p className="mt-2">In this example, the content path would be: <code>choices.0.delta.content</code></p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StreamConfig;
