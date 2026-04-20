import { describe, it, expect } from "vitest";
import { StepRegistry} from "../src/core/stepregistry"
import { CustomWorld } from "../src/world/customworld"
import { beforeEach } from "vitest";

beforeEach(()=> {
  StepRegistry.reset();
})

describe("StepRegistry", () => {
  it("should match exact step", async() => {
    const world = {} as CustomWorld;
    let called = false;
    StepRegistry.register("hello world", async function () {
      called = true;
    })

    const result = await StepRegistry.run(world, {
      keyword: "GEGEBEN",
      text: "hello world",
      params: [],
      table: undefined
    });
    expect(result).toBe(true);
    expect(called).toBe(true);
  })

  it("should pass string params", async () => {
  const world = {} as CustomWorld;
  let received: string | null = null;

  StepRegistry.register('say "{string}"', async function (msg: string) {
    received = msg;
  });

  await StepRegistry.run(world, {
    keyword: "WENN",
    text: 'say "hello"',
    params: [],
    table: undefined
  });

  expect(received).toBe("hello");
});

})