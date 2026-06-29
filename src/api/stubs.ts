/**
 * Offline stub layer for `request`. Disabled by default — the admin talks to the real
 * backend over `/api`. Kept as a seam so individual endpoints can be mocked during
 * development by flipping `STUBS_ENABLED` and returning data from `getStub`.
 */
export const STUBS_ENABLED = false

export function getStub(_url: string, _method: string): unknown {
  return undefined
}
