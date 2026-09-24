import { GEGEBEN, WENN, DANN, UND } from "./utils/stepApi";
import { CustomWorld } from "../world/customworld";

GEGEBEN(
  "der Benutzer öffnet die Testseite",
  async function (this: CustomWorld) {
    throw new Error("Not implemented");
  }
);

WENN(
  "der Benutzer den Button {string} anklickt",
  async function (this: CustomWorld, param1: string) {
    throw new Error("Not implemented");
  }
);

DANN(
  "wird die Seite {string} angezeigt",
  async function (this: CustomWorld, param1: string) {
    throw new Error("Not implemented");
  }
);
