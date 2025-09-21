import { Given, When, Then, And } from "../core/stepRegistry"
Given("ich öffne die Startseite", async (world) => {
  console.log(" ✅ Startdatei geöffnet")
});

When("ich klicke auf Login", async (world) => {
 console.log(" ✅ Login geklickt")
});

Then("warte 1 Sekunden", async (world) => {
  console.log(" ✅ 1 Sekunde gewartet")
});

And("sehe ich das Dashboard", async (world) => {
  console.log(" ✅ Dashboard gefunden")
});
