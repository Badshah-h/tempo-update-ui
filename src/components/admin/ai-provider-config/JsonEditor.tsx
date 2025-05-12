import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Check } from 'lucide-react';

interface JsonEditorProps {
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  placeholder?: string;
  height?: string;
}

const JsonEditor: React.FC<JsonEditorProps> = ({
  value,
  onChange,
  placeholder = 'Enter JSON...',
  height = '300px',
}) => {
  const [jsonString, setJsonString] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);

  // Convert the object to a formatted JSON string when the value prop changes
  useEffect(() => {
    try {
      const formatted = JSON.stringify(value, null, 2);
      setJsonString(formatted);
      setError(null);
      setIsValid(true);
    } catch (err) {
      setError('Invalid JSON object');
      setIsValid(false);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setJsonString(newValue);
    
    try {
      // Try to parse the JSON
      const parsed = JSON.parse(newValue);
      setError(null);
      setIsValid(true);
      
      // Only call onChange if the JSON is valid
      onChange(parsed);
    } catch (err) {
      setError('Invalid JSON: ' + (err as Error).message);
      setIsValid(false);
    }
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonString);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonString(formatted);
      setError(null);
      setIsValid(true);
      onChange(parsed);
    } catch (err) {
      setError('Cannot format: ' + (err as Error).message);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Textarea
          value={jsonString}
          onChange={handleChange}
          placeholder={placeholder}
          className="font-mono text-sm"
          style={{ height }}
        />
        <div className="absolute top-2 right-2">
          {isValid && (
            <div className="bg-green-100 dark:bg-green-900/20 p-1 rounded-full">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={formatJson}
          disabled={!isValid}
        >
          Format JSON
        </Button>
        
        {error && (
          <Alert variant="destructive" className="p-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default JsonEditor;
