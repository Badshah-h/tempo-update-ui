import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import {
  getAIModels,
  getAIModel,
  createAIModel,
  updateAIModel,
  deleteAIModel,
  toggleAIModelActive,
  setDefaultAIModel,
  testAiModel
} from '../services/aiModelService';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('aiModelService', () => {
  beforeEach(() => {
    localStorageMock.setItem('auth_token', 'test-token');
  });

  afterEach(() => {
    vi.resetAllMocks();
    localStorageMock.clear();
  });

  it('getAIModels should fetch all AI models', async () => {
    const mockResponse = {
      data: {
        data: [
          { id: 1, name: 'Model 1' },
          { id: 2, name: 'Model 2' }
        ]
      }
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await getAIModels();

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/ai-models'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token'
        })
      })
    );
    expect(result).toEqual(mockResponse.data.data);
  });

  it('getAIModel should fetch a single AI model', async () => {
    const mockResponse = {
      data: {
        data: { id: 1, name: 'Model 1' }
      }
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await getAIModel(1);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/ai-models/1'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token'
        })
      })
    );
    expect(result).toEqual(mockResponse.data.data);
  });

  it('createAIModel should create a new AI model', async () => {
    const mockModelData = {
      provider_id: 1,
      name: 'New Model',
      type: 'chat',
      max_tokens: 2048,
      credentials: JSON.stringify({ api_key: 'test-key' })
    };
    const mockResponse = {
      data: {
        data: { id: 1, ...mockModelData }
      }
    };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const result = await createAIModel(mockModelData);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/ai-models'),
      mockModelData,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token'
        })
      })
    );
    expect(result).toEqual(mockResponse.data.data);
  });

  it('updateAIModel should update an existing AI model', async () => {
    const mockModelData = {
      name: 'Updated Model',
      max_tokens: 4096
    };
    const mockResponse = {
      data: {
        data: { id: 1, ...mockModelData }
      }
    };
    mockedAxios.put.mockResolvedValueOnce(mockResponse);

    const result = await updateAIModel(1, mockModelData);

    expect(mockedAxios.put).toHaveBeenCalledWith(
      expect.stringContaining('/api/ai-models/1'),
      mockModelData,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token'
        })
      })
    );
    expect(result).toEqual(mockResponse.data.data);
  });

  it('deleteAIModel should delete an AI model', async () => {
    const mockResponse = {
      data: {
        success: true
      }
    };
    mockedAxios.delete.mockResolvedValueOnce(mockResponse);

    const result = await deleteAIModel(1);

    expect(mockedAxios.delete).toHaveBeenCalledWith(
      expect.stringContaining('/api/ai-models/1'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token'
        })
      })
    );
    expect(result).toEqual(mockResponse.data);
  });

  it('toggleAIModelActive should toggle the active status of an AI model', async () => {
    const mockResponse = {
      data: {
        data: { id: 1, is_active: false }
      }
    };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const result = await toggleAIModelActive(1);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/ai-models/1/toggle-active'),
      {},
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token'
        })
      })
    );
    expect(result).toEqual(mockResponse.data.data);
  });

  it('testAiModel should test an AI model with a query', async () => {
    const mockQuery = 'Test query';
    const mockResponse = {
      data: {
        data: {
          content: 'Test response',
          metadata: {
            response_time: 0.5,
            tokens_used: 10,
            estimated_cost: 0.0001
          }
        }
      }
    };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const result = await testAiModel('1', mockQuery);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/ai-models/1/test'),
      { query: mockQuery },
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token'
        })
      })
    );
    expect(result).toEqual(mockResponse.data.data);
  });
});
