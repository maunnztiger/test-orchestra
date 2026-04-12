import { StepRegistry, StepHandler } from "@core/stepregistry";
import { Table } from "@core/table";
import type { CustomWorld } from "@world/customworld";

type ExtractParams<
  S extends string,
  Acc extends unknown[] = []
> = S extends `${string}{string}${infer Rest}` ? ExtractParams<Rest, [...Acc, string]> : [...Acc, Table];
type StepDefinition = <P extends string>(
  pattern: P,
  handler: (this: CustomWorld, ...args: ExtractParams<P>) => Promise<void> | void
) => void;

function createStepDefinition(): StepDefinition {
  return (pattern, handler) => {
    StepRegistry.register(pattern, handler as StepHandler);
  };
}

export const GEGEBEN = createStepDefinition();
export const WENN = createStepDefinition();
export const DANN = createStepDefinition();
export const UND = createStepDefinition();
export const ABER = createStepDefinition();
export const ODER = createStepDefinition();
