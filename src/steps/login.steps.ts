import { GEGEBEN, WENN, DANN, UND } from "./utils/stepApi";
import type { CustomWorld } from "../world/customworld";
import { ParsedStep } from "@core/markdownparser";
import { Table } from "@core/table";

GEGEBEN("der Nutzer öffnet die Startseite von Saucedemo", async (world: CustomWorld) => {
  await world.pm.navigateTo().sauceLabsStartPage();
});

WENN("der Nutzer sich auf der Startseite einloggt", async (world: CustomWorld) => {
  await world.pm.makeloginAction().loginAsGeneralUser();
});
UND("den Login-Button drückt", async (world: CustomWorld) => {
  await world.pm.makeloginAction().submitLogin();
});
DANN("ist in dem Fenster die Produktseite geöffnet", async (world: CustomWorld) => {
  await world.pm.makeloginAction().verifyLoginSuccess();
});
UND(
  "links oben befindet sich die Überschrift {string}",
  async (world: CustomWorld, title: string) => {
    await world.pm.makeloginAction().verifyProductPageTitle(title);
  }
);
UND(
  "der User sieht eine Liste mit den Produkten",
  async (world: CustomWorld, table: Table) => {
    await world.pm.makeloginAction().verifyProductCards(table)
  }
);
