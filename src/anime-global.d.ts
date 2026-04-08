declare global {
  interface Window {
    anime?: {
      (params: Record<string, unknown>): unknown;
      stagger: (value: number) => unknown;
    };
  }
}

export {};
