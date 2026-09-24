import { describe, expect, it } from "vitest";

import {
  findMissingStepDefinitions,
} from "../../src/generator/stepDefinitionMerger";

import type {
  GeneratedStepDefinition,
} from "../../src/generator/stepDefinitionAnalyzer";

describe("StepDefinitionMerger", () => {
  it("erkennt bereits vorhandene Step Definitions", () => {
    const existingContent = `
      WENN(
        "der User den Filter {string} anklickt",
        async function (this: CustomWorld, filterName: string) {
          // implementation
        }
      );
    `;

    const definitions: GeneratedStepDefinition[] = [
      {
        stepFunction: "WENN",
        pattern:
          "der User den Filter {string} anklickt",
        parameters: [
          {
            name: "filterName",
            type: "string",
          },
        ],
      },
    ];

    const result =
      findMissingStepDefinitions(
        existingContent,
        definitions
      );

    expect(result).toHaveLength(0);
  });

  it("erkennt fehlende Step Definitions", () => {
    const existingContent = `
      GEGEBEN(
        "der Nutzer öffnet die Startseite Saucedemo",
        async function (this: CustomWorld) {}
      );
    `;

    const definitions: GeneratedStepDefinition[] = [
      {
        stepFunction: "DANN",
        pattern:
          "wird die Filterung erfolgreich abgeschlossen",
        parameters: [],
      },
    ];

    const result =
      findMissingStepDefinitions(
        existingContent,
        definitions
      );

    expect(result).toHaveLength(1);

    expect(result[0].pattern).toBe(
      "wird die Filterung erfolgreich abgeschlossen"
    );
  });

  it("liefert nur die tatsächlich fehlenden Steps zurück", () => {
    const existingContent = `
      GEGEBEN(
        "der Nutzer öffnet die Startseite Saucedemo",
        async function (this: CustomWorld) {}
      );

      WENN(
        "der User den Filter {string} anklickt",
        async function (this: CustomWorld, filterName: string) {}
      );
    `;

    const definitions: GeneratedStepDefinition[] = [
      {
        stepFunction: "GEGEBEN",
        pattern:
          "der Nutzer öffnet die Startseite Saucedemo",
        parameters: [],
      },
      {
        stepFunction: "WENN",
        pattern:
          "der User den Filter {string} anklickt",
        parameters: [
          {
            name: "filterName",
            type: "string",
          },
        ],
      },
      {
        stepFunction: "DANN",
        pattern:
          "wird die Filterung erfolgreich abgeschlossen",
        parameters: [],
      },
    ];

    const result =
      findMissingStepDefinitions(
        existingContent,
        definitions
      );

    expect(result).toHaveLength(1);

    expect(result[0].stepFunction).toBe(
      "DANN"
    );

    expect(result[0].pattern).toBe(
      "wird die Filterung erfolgreich abgeschlossen"
    );
  });
});