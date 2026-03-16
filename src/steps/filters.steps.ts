import { GEGEBEN, WENN, DANN, UND } from "./utils/stepApi";
import { CustomWorld } from "@world/customworld";

GEGEBEN("der Nutzer öffnet die Startseite Saucedemo", async (world: CustomWorld) => {});
UND(" loggt sich als current user ein", async (world: CustomWorld) => {});
UND("es öffnet sich die Produktseite von {string}", async (world: CustomWorld) => {});

WENN("der User auf das Filter-Symbol rechts oben klickt", async (world: CustomWorld) => {});
DANN("öffnet sich ein Menü mit Filtern", async (world: CustomWorld) => {});

WENN("der User den Filter {string} anklickt", async (world: CustomWorld) => {});
DANN(
  "erscheint der folgende Artikel {string} an der Spitze der Liste",
  async (world: CustomWorld) => {}
);
UND("der Artikel {string} am Fuß der Liste", async (world: CustomWorld) => {});

WENN("der User den Filter dann auf {string} setzt", async (world: CustomWorld) => {});
DANN("tauschen sich die Artikel Rucksack an der Spitze", async (world: CustomWorld) => {});
UND("das Tester-T-Shirt steht am Fuß der Liste", async (world: CustomWorld) => {});
