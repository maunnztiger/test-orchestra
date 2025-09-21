type HookFunction = () => void | Promise<void>;

export const beforeAllHooks: HookFunction[] = [];
export const afterEachHooks: HookFunction[] = [];

export function beforeAll(fn: HookFunction) {
  beforeAllHooks.push(fn);
}

export function afterEach(fn: HookFunction) {
  afterEachHooks.push(fn);
}
