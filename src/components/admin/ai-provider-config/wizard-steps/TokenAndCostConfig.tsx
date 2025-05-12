import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

interface TokenAndCostConfigProps {
  tokenCalculation: Record<string, any>;
  costCalculation: Record<string, any>;
  onChange: (data: { tokenCalculation: Record<string, any>; costCalculation: Record<string, any> }) => void;
}

const TokenAndCostConfig: React.FC<TokenAndCostConfigProps> = ({
  tokenCalculation,
  costCalculation,
  onChange,
}) => {
  const handleTokenChange = (field: string, value: any) => {
    onChange({
      tokenCalculation: {
        ...tokenCalculation,
        [field]: value,
      },
      costCalculation,
    });
  };

  const handleCostChange = (field: string, value: any) => {
    onChange({
      tokenCalculation,
      costCalculation: {
        ...costCalculation,
        [field]: value,
      },
    });
  };

  const handleTokenMethodChange = (value: string) => {
    onChange({
      tokenCalculation: {
        ...tokenCalculation,
        method: value,
      },
      costCalculation,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Counting & Cost Calculation</CardTitle>
        <CardDescription>
          Configure how to count tokens and calculate costs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Token Counting</h3>
          
          <div className="space-y-4">
            <Label>Token Counting Method</Label>
            <RadioGroup
              value={tokenCalculation.method || 'ratio'}
              onValueChange={handleTokenMethodChange}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ratio" id="ratio" />
                <Label htmlFor="ratio" className="font-normal">
                  Character Ratio (Approximate)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="api" id="api" />
                <Label htmlFor="api" className="font-normal">
                  Use API Response (Exact)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {tokenCalculation.method === 'ratio' && (
            <div className="mt-4 space-y-2">
              <Label htmlFor="ratio">Characters per Token</Label>
              <Input
                id="ratio"
                type="number"
                min="1"
                step="0.1"
                value={tokenCalculation.ratio || 4}
                onChange={(e) => handleTokenChange('ratio', parseFloat(e.target.value) || 4)}
              />
              <p className="text-sm text-muted-foreground">
                The average number of characters per token (4 is typical for English text)
              </p>
            </div>
          )}
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-4">Cost Calculation</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="input_rate">Input Rate (per 1K tokens)</Label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input
                  id="input_rate"
                  type="number"
                  min="0"
                  step="0.0001"
                  value={costCalculation.input_rate || 0.002}
                  onChange={(e) => handleCostChange('input_rate', parseFloat(e.target.value) || 0)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Cost per 1,000 input tokens
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="output_rate">Output Rate (per 1K tokens)</Label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input
                  id="output_rate"
                  type="number"
                  min="0"
                  step="0.0001"
                  value={costCalculation.output_rate || 0.002}
                  onChange={(e) => handleCostChange('output_rate', parseFloat(e.target.value) || 0)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Cost per 1,000 output tokens
              </p>
            </div>
          </div>

          <div className="mt-4 bg-muted p-3 rounded-md text-sm">
            <p className="font-medium mb-2">Common Pricing Examples:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>OpenAI GPT-3.5 Turbo: $0.0015 input, $0.002 output</li>
              <li>OpenAI GPT-4: $0.03 input, $0.06 output</li>
              <li>Anthropic Claude: $0.008 input, $0.024 output</li>
              <li>Google Gemini Pro: $0.0005 input, $0.0005 output</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenAndCostConfig;
