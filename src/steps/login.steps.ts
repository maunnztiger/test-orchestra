import { GEGEBEN, WENN, DANN, UND } from "./utils/stepApi";
import { ParsedStep } from "@core/markdownparser";
import type { CustomWorld } from "../world/customworld";

GEGEBEN("der Nutzer öffnet die Startseite von Saucedemo", async (world: CustomWorld) => {
  await world.pm.navigateTo().sauceLabsStartPage();
  await world.pm.navigateTo().waitForNumberOfSeconds(5000);
});

WENN("der Nutzer sich auf der Startseite einloggt", async (world: CustomWorld) => {
  console.log("benutzernamen eingegeben");
});
UND("den Login-Button drückt", async (world: CustomWorld) => {
  console.log("Login Button geklickt");
});
DANN("ist in dem Fenster die Produktseite geöffnet", async (world: CustomWorld) => {
  console.log("Produktseite hat sich geöffnet");
});
UND(
  "links oben befindet sich die Überschrift {string}",
  async (world: CustomWorld, step: ParsedStep) => {
    const title = step.params?.[0];
    if (!title) {
      throw new Error(`Kein Titel aus dem Step extrahiert. Text: "${step.text}"`);
    }
    console.log("Titel gefunden:", title);
  }
);

UND("der User sieht eine Liste mit den Produkten", async (world: CustomWorld, step: ParsedStep) => {
  console.log(step);
});
