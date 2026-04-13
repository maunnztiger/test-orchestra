import { CustomWorld } from "@world/customworld";

export function Before(fn: (this: CustomWorld) => Promise<void>) {
  CustomWorld.registerBefore(fn);
}

export function After(fn: (this: CustomWorld) => Promise<void>) {
  CustomWorld.registerAfter(fn);
}

export function BeforeAll(fn: (this: CustomWorld) => Promise<void>) {
  CustomWorld.registerBeforeAll(fn);
}

export function AfterAll(fn: (this: CustomWorld) => Promise<void>) {
  CustomWorld.registerAfterAll(fn);
}
