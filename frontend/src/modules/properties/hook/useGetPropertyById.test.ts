import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGetPropertyById } from './useGetPropertyById';

// Mock global de fetch
global.fetch = vi.fn();

describe('useGetPropertyById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('debe retornar property null y loading false cuando no hay id', () => {
    const { result } = renderHook(() => useGetPropertyById());

    expect(result.current.property).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('debe hacer la llamada API cuando se proporciona un id', async () => {
    const mockProperty = { id: '1', name: 'Test Property' };
    
    vi.mocked(fetch).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockProperty),
    } as any);

    const { result } = renderHook(() => useGetPropertyById('1'));

    // Verificar que loading sea true inicialmente
    expect(result.current.loading).toBe(true);
    
    // Esperar a que la llamada se complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.property).toEqual(mockProperty);
    expect(fetch).toHaveBeenCalledWith('/api/properties/1');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('debe manejar errores correctamente', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useGetPropertyById('1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.property).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching property:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it('no debe hacer la llamada API si el id es undefined', () => {
    renderHook(() => useGetPropertyById(undefined));

    expect(fetch).not.toHaveBeenCalled();
  });

  it('debe hacer una nueva llamada cuando el id cambia', async () => {
    const mockProperty1 = { id: '1', name: 'Property 1' };
    const mockProperty2 = { id: '2', name: 'Property 2' };

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce(mockProperty1),
      } as any)
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce(mockProperty2),
      } as any);

    const { result, rerender } = renderHook(
      ({ id }) => useGetPropertyById(id),
      { initialProps: { id: '1' } }
    );

    await waitFor(() => {
      expect(result.current.property).toEqual(mockProperty1);
    });

    // Cambiar el id
    rerender({ id: '2' });

    await waitFor(() => {
      expect(result.current.property).toEqual(mockProperty2);
    });

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledWith('/api/properties/1');
    expect(fetch).toHaveBeenCalledWith('/api/properties/2');
  });
});