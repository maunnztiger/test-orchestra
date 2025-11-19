
import { StepRegistry, StepHandler } from "@core/stepregistry";

export function GEGEBEN(pattern: string, handler: StepHandler) {
  StepRegistry.register(pattern, handler);
}

export function WENN(pattern: string, handler: StepHandler) {
  StepRegistry.register(pattern, handler);
}

export function DANN(pattern: string, handler: StepHandler) {
  StepRegistry.register(pattern, handler);
}

export function UND(pattern: string, handler: StepHandler) {
  StepRegistry.register(pattern, handler);
}

export function ABER(pattern: string, handler: StepHandler) {
  StepRegistry.register(pattern, handler);
}

export function ODER(pattern: string, handler: StepHandler) {
  StepRegistry.register(pattern, handler);
}