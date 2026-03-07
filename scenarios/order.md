# Feature

@Order
## Szenario: Überprüfen, ob der Bestellvorgang funktioniert

**GEGEBEN** der Nutzer öffnet die Swag-Labs-Login-Page 
**UND**  loggt sich als Standard User ein

**WENN** der User auf ein Produkt klickt
**DANN** öffnet sich eine Detailansicht des Produkts

**WENN** der User auf den Button "Add to Card" klickt
**DANN** landet das Produkt in seinem Warenkorb
**UND** an dem Symbol für seinen Warenkorb ist eine kleine 1 angezeigt

**WENN** der User auf den kleinen Einkaufswagen mit der 1 klickt
**DANN** erscheint eine Einzelansicht der aktuellen Bestellung
**UND** es ist ein Button "Remove" auf der rechten Seite der Bestellung
**UND** es ist ein grüner Button "Checkout" auf der rechten Seite 
**UND** es ist ein Button "Continue Shopping" auf der linken Seite der Bestellung

**WENN** der User nun auf den Button "Remove" klickt
**DANN** verschwindet das vorher angezeigte Objekt der Bestellung aus der Anzeige
**UND** die kleine 1 am Warenkorb-Symbol rechts oben verschwindet

**WENN** der User mit dme Button "Continue Shopping" zur Produktliste zurückkehrt
**DANN** erscheint die Liste der Produkte wie oben im Filter eingestellt
**UND** der Warenkorb ist wieder leer
