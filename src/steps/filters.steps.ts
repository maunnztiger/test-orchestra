import { GEGEBEN, WENN, DANN, UND } from "./utils/stepApi";
import { CustomWorld } from "../world/customworld";

GEGEBEN("der Nutzer öffnet die Startseite Saucedemo", async function (this: CustomWorld) {
  await this.pm.navigateTo().sauceLabsStartPage();
});
UND("loggt sich als current user ein", async function (this: CustomWorld) {
  await this.pm.makeloginAction().loginAsGeneralUser();
  await this.pm.makeloginAction().submitLogin();
});
UND(
  "es öffnet sich die Produktseite von {string}",
  async function (this: CustomWorld, headerName: string) {
    await this.pm.makeFiltersAction().verifyProductPageHeader(headerName);
  }
);

WENN("der User auf das Filter-Symbol rechts oben klickt", async function (this: CustomWorld) {
  await this.pm.makeFiltersAction().clickFiltersymbol();
});
DANN("öffnet sich ein Menü mit Filtern", async function (this: CustomWorld) {
  await this.pm.makeFiltersAction().validateFilterMenu();
});

WENN("der User den Filter {string} anklickt", async function (this: CustomWorld) {});
DANN(
  "erscheint der folgende Artikel {string} an der Spitze der Liste",
  async function (this: CustomWorld, article: string) {
    console.log(article);
  }
);
UND("der Artikel {string} am Fuß der Liste", async function (this: CustomWorld) {});

WENN("der User den Filter dann auf {string} setzt", async function (this: CustomWorld) {});
DANN("tauschen sich die Artikel Rucksack an der Spitze", async function (this: CustomWorld) {});
UND("das Tester-T-Shirt steht am Fuß der Liste", async function (this: CustomWorld) {});
