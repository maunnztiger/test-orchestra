import { GEGEBEN, WENN, DANN, UND } from "./utils/stepApi";
import { CustomWorld } from "../world/customworld";

GEGEBEN("der Nutzer öffnet die Startseite Saucedemo", async function (this: CustomWorld) {
  throw new Error("Not implemented");
});

UND("loggt sich als current user ein", async function (this: CustomWorld) {
  throw new Error("Not implemented");
});

UND(
  "es öffnet sich die Produktseite von {string}",
  async function (this: CustomWorld, param1: string) {
    throw new Error("Not implemented");
  }
);

WENN("der User auf das Filter-Symbol rechts oben klickt", async function (this: CustomWorld) {
  throw new Error("Not implemented");
});

DANN("öffnet sich ein Menü mit Filtern", async function (this: CustomWorld) {
  throw new Error("Not implemented");
});

WENN("der User den Filter {string} anklickt", async function (this: CustomWorld, param1: string) {
  throw new Error("Not implemented");
});

DANN(
  "erscheint der folgende Artikel {string} an der Spitze der Liste",
  async function (this: CustomWorld, param1: string) {
    throw new Error("Not implemented");
  }
);

UND("der Artikel {string} am Fuß der Liste", async function (this: CustomWorld, param1: string) {
  throw new Error("Not implemented");
});

WENN(
  "der User den Filter dann auf {string} setzt",
  async function (this: CustomWorld, param1: string) {
    throw new Error("Not implemented");
  }
);

DANN("tauschen sich die Artikel Rucksack an der Spitze", async function (this: CustomWorld) {
  throw new Error("Not implemented");
});

UND("das Tester-T-Shirt steht am Fuß der Liste", async function (this: CustomWorld) {
  throw new Error("Not implemented");
});
