# Feature

@Filters

## Szenario: Überprüfen, ob der Bestellvorgang funktioniert

**GEGEBEN** der Nutzer öffnet die Startseite Saucedemo
**UND** loggt sich als current user ein
**UND** es öffnet sich die Produktseite von "Swag Labs"

**WENN** der User auf das Filter-Symbol rechts oben klickt
**DANN** öffnet sich ein Menü mit Filtern
**WENN** der User den Filter "Name (Z to A)" anklickt
**DANN** erscheint der folgende Artikel "Test.allTheThings() T-Shirt (Red)" an der Spitze der Liste
**UND** der Artikel "Sauce Labs Backpack" am Fuß der Liste
**WENN** der User den Filter dann auf "Name (A to Z)" setzt
**DANN** tauschen sich die Artikel Rucksack an der Spitze
**UND** das Tester-T-Shirt steht am Fuß der Liste

