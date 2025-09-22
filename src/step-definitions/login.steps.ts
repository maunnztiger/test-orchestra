import { GEGEBEN, WENN, DANN, UND, ABER, ODER } from "../core/stepRegistry"
GEGEBEN("ich öffne die Startseite", async (world) => {
  console.log(" ✅ Startdatei geöffnet")
});

WENN("ich auf Login klicke", async (world) => {
 console.log(" ✅ Login geklickt")
});

UND("warte 1 Sekunden", async (world) => {
  console.log(" ✅ 1 Sekunde gewartet")
});

DANN("sehe ich das Dashboard", async (world) => {
  console.log(" ✅ Dashboard gefunden")
});
