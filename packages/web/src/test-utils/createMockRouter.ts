import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { } from "next/router";

export function createMockRouter(router: Partial<AppRouterInstance>): AppRouterInstance {
  return {
    back: jest.fn(),
    forward: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    ...router,
  };
}