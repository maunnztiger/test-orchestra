import { GEGEBEN, WENN, DANN, UND } from "./utils/stepApi";
import type { CustomWorld } from "../world/customworld";
import { Table } from "@core/table";
GEGEBEN("der Nutzer öffnet die Startseite von Saucedemo", async function (this: CustomWorld) {
  await this.pm.navigateTo().sauceLabsStartPage();
});

WENN("der Nutzer sich auf der Startseite einloggt", async function (this: CustomWorld) {
  await this.pm.makeloginAction().loginAsGeneralUser();
});
UND("den Login-Button drückt", async function (this: CustomWorld) {
  await this.pm.makeloginAction().submitLogin();
});
DANN("ist in dem Fenster die Produktseite geöffnet", async function (this: CustomWorld) {
  await this.pm.makeloginAction().verifyLoginSuccess();
});
UND(
  "links oben befindet sich die Überschrift {string}",
  async function (this: CustomWorld, title: string) {
    await this.pm.makeloginAction().verifyProductPageTitle(title);
  }
);
UND(
  "der User sieht eine Liste mit den Produkten",
  async function (this: CustomWorld, table: Table) {
    await this.pm.makeloginAction().verifyProductCards(table);
  }
);
