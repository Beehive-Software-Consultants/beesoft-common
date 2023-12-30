import { debounce, DebouncedFunction } from './debounce.ts';
import { describe, expect, test, mock, beforeEach } from 'bun:test';

type OriginalFunctionType = (x: unknown) => unknown;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('debounce function', () => {
  let originalFunction: OriginalFunctionType;
  let debouncedFunction: DebouncedFunction<OriginalFunctionType>;

  beforeEach(() => {
    originalFunction = mock((x) => x);
    debouncedFunction = debounce(originalFunction, 200);
  });

  test('should NOT call function', () => {
    // Call the debounced function
    debouncedFunction('call 1');

    // Ensure the original function is NOT called
    expect(originalFunction).not.toHaveBeenCalledWith('call 1');
  });

  test('should call function - flush', () => {
    // Call the debounced function and flush
    debouncedFunction('call 1');
    debouncedFunction.flush();
    // Ensure the original function is called
    expect(originalFunction).toHaveBeenCalledWith('call 1');
  });

  test('should NOT call function - cancel', () => {
    // Call the debounced function and cancel
    debouncedFunction('call 1');
    debouncedFunction.cancel();

    // Ensure the original function is NOT called
    expect(originalFunction).not.toHaveBeenCalledWith('call 1');
  });

  test('should call function - time elapsed', async () => {
    // Call the debounced function
    debouncedFunction('call 1');
    await delay(200);

    // Ensure the original function is called
    expect(originalFunction).toHaveBeenCalledWith('call 1');
  });

  test('should call LAST function invoked - time elapsed', async () => {
    // Call the debounced functions
    debouncedFunction('call 1');
    debouncedFunction('call 2');
    debouncedFunction('call 3');
    await delay(200);

    // Ensure the LAST function is called
    expect(originalFunction).toHaveBeenCalledWith('call 3');
  });

  test('should NOT call first function if subsequent call made - time elapsed', async () => {
    // Call the debounced functions
    debouncedFunction('call 1');
    debouncedFunction('call 2');
    debouncedFunction('call 3');
    await delay(200);

    // Ensure the LAST function is called
    expect(originalFunction).not.toHaveBeenCalledWith('call 1');
  });
});