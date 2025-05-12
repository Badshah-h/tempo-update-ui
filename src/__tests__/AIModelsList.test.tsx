import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import AIModelsList from '../components/admin/ai-models/AIModelsList';
import * as aiModelService from '../services/aiModelService';

// Mock the aiModelService
vi.mock('../services/aiModelService', () => ({
  getAIModels: vi.fn(),
  deleteAIModel: vi.fn(),
  toggleAIModelActive: vi.fn(),
  setDefaultAIModel: vi.fn(),
}));

// Mock the useToast hook
vi.mock('../components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Sample data for tests
const mockModels = [
  {
    id: 1,
    provider_id: 1,
    name: 'GPT-4',
    slug: 'gpt-4',
    type: 'chat',
    max_tokens: 8192,
    api_endpoint: 'https://api.openai.com/v1/chat/completions',
    is_active: true,
    is_default: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
    provider: {
      id: 1,
      name: 'OpenAI',
      slug: 'openai',
      is_active: true,
    },
  },
  {
    id: 2,
    provider_id: 2,
    name: 'Gemini Pro',
    slug: 'gemini-pro',
    type: 'chat',
    max_tokens: 4096,
    api_endpoint: 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
    is_active: true,
    is_default: false,
    created_at: '2023-01-02T00:00:00.000Z',
    updated_at: '2023-01-02T00:00:00.000Z',
    provider: {
      id: 2,
      name: 'Google',
      slug: 'google',
      is_active: true,
    },
  },
];

describe('AIModelsList Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (aiModelService.getAIModels as any).mockResolvedValue(mockModels);
  });

  test('renders the AI Models list correctly', async () => {
    render(
      <BrowserRouter>
        <AIModelsList />
      </BrowserRouter>
    );

    // Check for loading state
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    // Wait for the models to load
    await waitFor(() => {
      expect(screen.getByText('AI Models')).toBeInTheDocument();
      expect(screen.getByText('Manage your AI models')).toBeInTheDocument();
      expect(screen.getByText('Add Model')).toBeInTheDocument();
    });

    // Check if models are displayed
    await waitFor(() => {
      expect(screen.getByText('GPT-4')).toBeInTheDocument();
      expect(screen.getByText('Gemini Pro')).toBeInTheDocument();
      expect(screen.getByText('OpenAI')).toBeInTheDocument();
      expect(screen.getByText('Google')).toBeInTheDocument();
    });
  });

  test('handles the Add Model button click', async () => {
    render(
      <BrowserRouter>
        <AIModelsList />
      </BrowserRouter>
    );

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('Add Model')).toBeInTheDocument();
    });

    // Click the Add Model button
    fireEvent.click(screen.getByText('Add Model'));

    // Check if navigation would happen (we can't test actual navigation in this test)
    // But we can check if the button has the correct link
    expect(screen.getByText('Add Model').closest('a')).toHaveAttribute('href', '/admin/ai-models/new');
  });

  test('handles model deletion', async () => {
    (aiModelService.deleteAIModel as any).mockResolvedValue({ success: true });
    
    render(
      <BrowserRouter>
        <AIModelsList />
      </BrowserRouter>
    );

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getAllByText('Actions')[0]).toBeInTheDocument();
    });

    // Open the dropdown menu for the first model
    const actionButtons = screen.getAllByLabelText('Open actions menu');
    fireEvent.click(actionButtons[0]);

    // Click the Delete button
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    // Confirm deletion in the dialog
    await waitFor(() => {
      expect(screen.getByText('Are you sure you want to delete this model?')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Delete'));

    // Check if the delete API was called
    await waitFor(() => {
      expect(aiModelService.deleteAIModel).toHaveBeenCalledWith(1);
      expect(aiModelService.getAIModels).toHaveBeenCalledTimes(2); // Initial load + after deletion
    });
  });

  test('handles toggling model active status', async () => {
    (aiModelService.toggleAIModelActive as any).mockResolvedValue({ 
      ...mockModels[0], 
      is_active: false 
    });
    
    render(
      <BrowserRouter>
        <AIModelsList />
      </BrowserRouter>
    );

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getAllByText('Actions')[0]).toBeInTheDocument();
    });

    // Open the dropdown menu for the first model
    const actionButtons = screen.getAllByLabelText('Open actions menu');
    fireEvent.click(actionButtons[0]);

    // Click the Deactivate button (since the first model is active)
    const deactivateButton = screen.getByText('Deactivate');
    fireEvent.click(deactivateButton);

    // Check if the toggle API was called
    await waitFor(() => {
      expect(aiModelService.toggleAIModelActive).toHaveBeenCalledWith(1);
      expect(aiModelService.getAIModels).toHaveBeenCalledTimes(2); // Initial load + after toggle
    });
  });
});
