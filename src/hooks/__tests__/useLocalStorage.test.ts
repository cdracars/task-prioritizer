import { renderHook, act } from '@testing-library/react';
import useLocalStorage from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
  });

  it('should initialize with the provided default value', () => {
    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'defaultValue')
    );
    expect(result.current[0]).toBe('defaultValue');
  });

  it('should return the existing value from localStorage if it exists', () => {
    // Set up localStorage with existing value
    window.localStorage.setItem('testKey', JSON.stringify('existingValue'));

    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'defaultValue')
    );
    expect(result.current[0]).toBe('existingValue');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'initialValue')
    );

    act(() => {
      const setValue = result.current[1];
      setValue('newValue');
    });

    // Check that the state was updated
    expect(result.current[0]).toBe('newValue');

    // Check that localStorage was updated
    expect(JSON.parse(window.localStorage.getItem('testKey') || '')).toBe(
      'newValue'
    );
  });

  it('should handle function updates correctly', () => {
    const { result } = renderHook(() =>
      useLocalStorage<number>('testCounter', 0)
    );

    act(() => {
      const setValue = result.current[1];
      setValue((prevValue) => prevValue + 1);
    });

    expect(result.current[0]).toBe(1);
    expect(JSON.parse(window.localStorage.getItem('testCounter') || '')).toBe(
      1
    );
  });

  it('should handle complex objects', () => {
    const testObject = { name: 'Test', items: [1, 2, 3], active: true };
    const { result } = renderHook(() =>
      useLocalStorage('testObject', testObject)
    );

    const newObject = {
      ...testObject,
      name: 'Updated',
      items: [...testObject.items, 4],
    };

    act(() => {
      const setValue = result.current[1];
      setValue(newObject);
    });

    expect(result.current[0]).toEqual(newObject);
    expect(JSON.parse(window.localStorage.getItem('testObject') || '')).toEqual(
      newObject
    );
  });
});
