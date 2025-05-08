import { useState, useEffect } from 'react';
import { ChatWidgetConfig } from '@/types/chat';
import { getWidgetConfig, updateWidgetConfig } from '@/services';

export const useWidgetConfig = (initialConfig?: Partial<ChatWidgetConfig>) => {
    const [config, setConfig] = useState<ChatWidgetConfig | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Load widget configuration
    useEffect(() => {
        const loadConfig = async () => {
            try {
                setIsLoading(true);
                const loadedConfig = await getWidgetConfig();

                // Apply initial config overrides if provided
                const finalConfig = initialConfig
                    ? { ...loadedConfig, ...initialConfig }
                    : loadedConfig;

                setConfig(finalConfig);
                setError(null);
            } catch (err) {
                setError('Failed to load widget configuration');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadConfig();
    }, [initialConfig]);

    // Update widget configuration
    const updateConfig = async (updates: Partial<ChatWidgetConfig>) => {
        if (!config) return null;

        try {
            setIsLoading(true);
            const updatedConfig = await updateWidgetConfig({
                ...config,
                ...updates,
            });

            setConfig(updatedConfig);
            setError(null);
            return updatedConfig;
        } catch (err) {
            setError('Failed to update widget configuration');
            console.error(err);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        config,
        isLoading,
        error,
        updateConfig,
    };
};
