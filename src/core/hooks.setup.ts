import { beforeAll, afterEach } from "./hooks";
import { world } from "./world";

beforeAll(async () => {
  await world.initBrowser();
});

afterEach(async () => {
  await world.page.close(); // Page nach jedem Szenario schließen
  world.page = await world.browser.newPage(); // Neue Seite für nächstes Szenario
});
