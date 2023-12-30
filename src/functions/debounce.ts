//interface for debounced function  - 3 methods -  original function, cancel and flush
export interface DebouncedFunction<T extends (...args: unknown[]) => unknown> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel(): void;
  flush(): ReturnType<T> | undefined;
}

export function debounce<T extends (...args: unknown[]) => void>(func: T, timeout: number): DebouncedFunction<T> {
  //let timer: typeof setTimeout | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  //last set of args passed to debounced function
  let lastArgs: Parameters<T> | null = null;
  //stores result of last call to debounced fuction
  let lastResult: ReturnType<T> | undefined = undefined;

  function debounced(...args: Parameters<T>): ReturnType<T> | undefined {
    // Clear the existing timer, if any
    if (timer !== null) {
      clearTimeout(timer!);
    }
    //store current args
    lastArgs = args;
    // Set a new timer
    timer = setTimeout(() => {
      timer = null;

      // Call the actual function with the provided arguments
      // Use a conditional type to handle the case where the original function returns void
      lastResult = func(...args) as ReturnType<T> extends void ? undefined : ReturnType<T>;
    }, timeout);

    return lastResult;
  }
  // Attach cancel method directly to the debounced function
  debounced.cancel = function (): void {
    //if there is a pending call, reset everything
    if (timer !== null) {
      clearTimeout(timer!);
      timer = null;
      lastArgs = null;
    }
  };

  debounced.flush = function (): ReturnType<T> | undefined {
    //there is a pending call, invoke it
    if (timer !== null) {
      clearTimeout(timer!);
      timer = null;

      if (lastArgs !== null) {
        // Use the same conditional type here
        lastResult = func(...(lastArgs as Parameters<T>)) as ReturnType<T> extends void ? undefined : ReturnType<T>;
        return lastResult;
      }
    }

    return lastResult;
  };

  return debounced;
}