import  { vi } from "vitest";

export function mockClient() {
  return {
    query: vi.fn().mockResolvedValue({rows: []})
  }
}