import { describe, it, expect } from "vitest";
import { StepRegistry } from "../src/core/stepregistry";
import { CustomWorld } from "../src/world/customworld";
import { beforeEach } from "vitest";
import { Table } from "../src/core/table";

beforeEach(() => {
  StepRegistry.reset();
});

describe("StepRegistry", () => {
  it("should match exact step", async () => {
    const world = {} as CustomWorld;
    let called = false;
    StepRegistry.register("hello world", async function () {
      called = true;
    });

    const result = await StepRegistry.run(world, {
      keyword: "GEGEBEN",
      text: "hello world",
      params: [],
      table: undefined
    });
    expect(result).toBe(true);
    expect(called).toBe(true);
  });

  it("should pass string params", async () => {
    const world = {} as CustomWorld;
    let received: string | null = null;

    StepRegistry.register("say {string}", async function (msg: string) {
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

  it("should pass table to handler", async () => {
    const world = {} as CustomWorld;
    let received: Table | null = null;
    StepRegistry.register("the user sees products", async function (table: Table) {
      received = table;
    });
    const table = new Table([["name"], ["Shirt"], ["Jeans"]]);
    await StepRegistry.run(world, {
      keyword: "UND",
      text: "the user sees products",
      params: [],
      table
    });
    if (!received) {
      throw new Error("Table not received");
    }
    expect(received).not.toBeNull();
    expect((received as Table).asList()).toEqual(["Shirt", "Jeans"]);
  });

  it("should parse {int} from pattern", async () => {
    const world = {} as CustomWorld;
    let received: number | null = null;

    StepRegistry.register("ich kaufe {int} Produkte", async function (count: number) {
      received = count;
    });

    await StepRegistry.run(world, {
      keyword: "WENN",
      text: "ich kaufe 5 Produkte",
      params: [],
      table: undefined
    });

    expect(received).toBe(5);
  });

  it("should parse {float} from pattern", async () => {
    const world = {} as CustomWorld;
    let received: number | null = null;

    StepRegistry.register("Preis ist {float}", async function (price: number) {
      received = price;
    });

    await StepRegistry.run(world, {
      keyword: "DANN",
      text: "Preis ist 9.99",
      params: [],
      table: undefined
    });

    expect(received).toBe(9.99);
  });

  it("should parse {boolean} from pattern", async () => {
    const world = {} as CustomWorld;
    let received: boolean | null = null;

    StepRegistry.register("Feature ist {boolean}", async function (flag: boolean) {
      received = flag;
    });

    await StepRegistry.run(world, {
      keyword: "UND",
      text: "Feature ist true",
      params: [],
      table: undefined
    });

    expect(received).toBe(true);
  });

  it("should support custom param type", async () => {
  const world = {} as CustomWorld;
  let received: string | null = null;

  StepRegistry.defineParamType("uuid", {
    regex: "([0-9a-f-]+)",
    parse: (v) => v
  });

  StepRegistry.register("User hat ID {uuid}", async function (id: string) {
    received = id;
  });

  await StepRegistry.run(world, {
    keyword: "WENN",
    text: "User hat ID 123e4567-e89b-12d3",
    params: [],
    table: undefined
  });

  expect(received).toBe("123e4567-e89b-12d3");
});
});
