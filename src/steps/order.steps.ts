import { GEGEBEN, WENN, DANN, UND } from "./utils/stepApi";
import { CustomWorld } from "@world/customworld";

GEGEBEN("der Nutzer öffnet die Swag-Labs-Login-Page ", async (world: CustomWorld) => {});
UND("loggt sich als Standard User ein", async (world: CustomWorld) => {});

WENN("der User auf ein Produkt klickt", async (world: CustomWorld) => {});
DANN("öffnet sich eine Detailansicht des Produkts", async (world: CustomWorld) => {});

WENN("der User nun auf den Button {string} klickt", async (world: CustomWorld) => {});
DANN("landet das Produkt in seinem Warenkorb", async (world: CustomWorld) => {});
UND(
  "an dem Symbol für seinen Warenkorb ist eine kleine 1 angezeigt",
  async (world: CustomWorld) => {}
);

WENN("der User auf den kleinen Einkaufswagen mit der 1 klickt", async (world: CustomWorld) => {});
DANN("erscheint eine Einzelansicht der aktuellen Bestellung", async (world: CustomWorld) => {});
UND(
  "es ist ein Button {string} auf der rechten Seite der Bestellung",
  async (world: CustomWorld) => {}
);
UND("es ist ein grüner Button {string} auf der rechten Seite", async (world: CustomWorld) => {});
UND(
  "es ist ein Button {string} auf der linken Seite der Bestellung",
  async (world: CustomWorld) => {}
);

WENN("der User auf den Button {string} klickt", async (world: CustomWorld) => {});
DANN(
  "verschwindet das vorher angezeigte Objekt der Bestellung aus der Anzeige",
  async (world: CustomWorld) => {}
);
UND("die kleine 1 am Warenkorb-Symbol rechts oben verschwindet", async (world: CustomWorld) => {});

WENN(
  'der User mit dme Button "Continue Shopping" zur Produktliste zurückkehrt',
  async (world: CustomWorld) => {}
);
DANN(
  "erscheint die Liste der Produkte wie oben im Filter eingestellt",
  async (world: CustomWorld) => {}
);
UND("der Warenkorb ist wieder leer", async (world: CustomWorld) => {});
