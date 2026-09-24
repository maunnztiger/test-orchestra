import { describe, expect, it } from "vitest";

import {
  analyzeScenario,
} from "../../src/generator/stepDefinitionAnalyzer";

import type {
  ParsedScenario,
} from "../../src/core/markdownparser";

describe("StepDefinitionAnalyzer", () => {
  it("erzeugt einen Step ohne Parameter", () => {
    const scenario: ParsedScenario = {
      name: "Test",
      tags: [],
      steps: [
        {
          keyword: "GEGEBEN",
          text: "der Nutzer öffnet die Startseite",
          params: [],
        },
      ],
    };

    const result = analyzeScenario(scenario);

    expect(result).toEqual([
      {
        stepFunction: "GEGEBEN",
        pattern: "der Nutzer öffnet die Startseite",
        parameters: [],
      },
    ]);
  });

  it("ersetzt einen String durch {string}", () => {
    const scenario: ParsedScenario = {
      name: "Test",
      tags: [],
      steps: [
        {
          keyword: "WENN",
          text: 'der Nutzer wählt den Filter "Name (Z to A)"',
          params: [
            {
              type: "string",
              value: "Name (Z to A)",
            },
          ],
        },
      ],
    };

    const result = analyzeScenario(scenario);

    expect(result[0].pattern).toBe(
      "der Nutzer wählt den Filter {string}"
    );

    expect(result[0].parameters).toEqual([
      {
        name: "filterName",
        type: "string",
      },
    ]);
  });

  it("erkennt Integer-Parameter", () => {
    const scenario: ParsedScenario = {
      name: "Test",
      tags: [],
      steps: [
        {
          keyword: "WENN",
          text: "der Nutzer bestellt 3 Artikel",
          params: [
            {
              type: "int",
              value: 3,
            },
          ],
        },
      ],
    };

    const result = analyzeScenario(scenario);

    expect(result[0].pattern).toBe(
      "der Nutzer bestellt {int} Artikel"
    );

    expect(result[0].parameters[0].type).toBe(
      "number"
    );
  });

  it("erkennt Float-Parameter", () => {
    const scenario: ParsedScenario = {
      name: "Test",
      tags: [],
      steps: [
        {
          keyword: "DANN",
          text: "beträgt der Preis 19.99 Euro",
          params: [
            {
              type: "float",
              value: 19.99,
            },
          ],
        },
      ],
    };

    const result = analyzeScenario(scenario);

    expect(result[0].pattern).toBe(
      "beträgt der Preis {float} Euro"
    );

    expect(result[0].parameters[0].type).toBe(
      "number"
    );
  });

  it("erkennt Boolean-Parameter", () => {
    const scenario: ParsedScenario = {
      name: "Test",
      tags: [],
      steps: [
        {
          keyword: "DANN",
          text: "ist der Artikel verfügbar true",
          params: [
            {
              type: "boolean",
              value: true,
            },
          ],
        },
      ],
    };

    const result = analyzeScenario(scenario);

    expect(result[0].pattern).toBe(
      "ist der Artikel verfügbar {boolean}"
    );

    expect(result[0].parameters[0].type).toBe(
      "boolean"
    );
  });

  it("behält UND als UND", () => {
    const scenario: ParsedScenario = {
      name: "Test",
      tags: [],
      steps: [
        {
          keyword: "UND",
          text: "der Nutzer sieht die Produktseite",
          params: [],
        },
      ],
    };

    const result = analyzeScenario(scenario);

    expect(result[0].stepFunction).toBe("UND");
  });
});