import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import AIModelForm from '../components/admin/ai-models/AIModelForm';
import * as aiModelService from '../services/aiModelService';
import * as aiProviderService from '../services/aiProviderService';

// Mock the React Router hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: undefined }), // Default to create mode
    useNavigate: () => vi.fn(),
  };
});

// Mock the services
vi.mock('../services/aiModelService', () => ({
  getAIModel: vi.fn(),
  createAIModel: vi.fn(),
  updateAIModel: vi.fn(),
}));

vi.mock('../services/aiProviderService', () => ({
  getAiProviders: vi.fn(),
}));

// Mock the useToast hook
vi.mock('../components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Sample data for tests
const mockProviders = [
  {
    id: 1,
    name: 'OpenAI',
    slug: 'openai',
    description: 'OpenAI API provider',
    is_active: true,
    auth_requirements: { api_key: { type: 'string', required: true } },
    available_models: ['gpt-4', 'gpt-3.5-turbo'],
    default_parameters: { temperature: 0.7 },
  },
  {
    id: 2,
    name: 'Google',
    slug: 'google',
    description: 'Google AI API provider',
    is_active: true,
    auth_requirements: { api_key: { type: 'string', required: true } },
    available_models: ['gemini-pro', 'gemini-pro-vision'],
    default_parameters: { temperature: 0.7 },
  },
];

describe('AIModelForm Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (aiProviderService.getAiProviders as any).mockResolvedValue(mockProviders);
    (aiModelService.createAIModel as any).mockResolvedValue({ id: 1, name: 'New Model' });
  });

  test('renders the form in create mode', async () => {
    render(
      <BrowserRouter>
        <AIModelForm />
      </BrowserRouter>
    );

    // Check for loading state
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    // Wait for the form to load
    await waitFor(() => {
      expect(screen.getByText('Create AI Model')).toBeInTheDocument();
      expect(screen.getByText('Back to Models')).toBeInTheDocument();
      expect(screen.getByText('Save Model')).toBeInTheDocument();
    });

    // Check for form fields
    expect(screen.getByLabelText(/Provider/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Max Tokens/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/API Key/i)).toBeInTheDocument();
  });

  test('submits the form with valid data', async () => {
    render(
      <BrowserRouter>
        <AIModelForm />
      </BrowserRouter>
    );

    // Wait for the form to load
    await waitFor(() => {
      expect(screen.getByText('Create AI Model')).toBeInTheDocument();
    });

    // Fill out the form
    // Select provider
    const providerSelect = screen.getByLabelText(/Provider/i);
    fireEvent.click(providerSelect);
    await waitFor(() => {
      expect(screen.getByText('OpenAI')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('OpenAI'));

    // Fill other fields
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test Model' } });
    
    const typeSelect = screen.getByLabelText(/Type/i);
    fireEvent.click(typeSelect);
    await waitFor(() => {
      expect(screen.getByText('chat')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('chat'));
    
    fireEvent.change(screen.getByLabelText(/Max Tokens/i), { target: { value: '2048' } });
    fireEvent.change(screen.getByLabelText(/API Key/i), { target: { value: 'sk-test123456' } });

    // Submit the form
    fireEvent.click(screen.getByText('Save Model'));

    // Check if the create API was called with the correct data
    await waitFor(() => {
      expect(aiModelService.createAIModel).toHaveBeenCalledWith(
        expect.objectContaining({
          provider_id: 1,
          name: 'Test Model',
          type: 'chat',
          max_tokens: 2048,
          credentials: expect.stringContaining('api_key'),
        })
      );
    });
  });

  test('validates required fields', async () => {
    render(
      <BrowserRouter>
        <AIModelForm />
      </BrowserRouter>
    );

    // Wait for the form to load
    await waitFor(() => {
      expect(screen.getByText('Create AI Model')).toBeInTheDocument();
    });

    // Submit the form without filling required fields
    fireEvent.click(screen.getByText('Save Model'));

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText('Provider is required')).toBeInTheDocument();
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
      expect(screen.getByText('Type is required')).toBeInTheDocument();
      expect(screen.getByText('API key is required')).toBeInTheDocument();
    });

    // Verify the API wasn't called
    expect(aiModelService.createAIModel).not.toHaveBeenCalled();
  });
});
