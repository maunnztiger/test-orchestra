import { vi } from "vitest";

export function mockClient() {
  return {
    query: vi.fn().mockResolvedValue({ rows: [] })
  };
}
const client = {
  connect: vi.fn().mockResolvedValue(undefined),
  query: vi.fn().mockResolvedValue({ rows: [] }),
  end: vi.fn().mockResolvedValue(undefined)
};