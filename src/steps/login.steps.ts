import { GEGEBEN, WENN, DANN, UND } from "../core/stepregistry";
import type { CustomWorld } from "../world/customworld"; 
import { PageManager } from "./PageManager";


GEGEBEN('der Nutzer öffnet die Startseite von Saucedemo', async(world: CustomWorld) => {
    const pm = new PageManager(world.page)
    console.log('Startseite geöffnet')
})

WENN('der Nutzer seinen Username in das LoginPrompt Username eingibt', async(world: CustomWorld) => {
    console.log('benutzernamen eingegeben')
}) 
UND('sein Passwort in das Feld Password eingibt', async(world: CustomWorld) => {
    console.log('Passwort eingegeben')
}) 
UND('den Login-Button drückt', async(world: CustomWorld) => {
    console.log('Login Button geklickt')
})
DANN('ist in dem Fenster die Produktseite geöffnet', async(world: CustomWorld) => {
    console.log('Produktseite hat sich geöffnet')
}) 
UND('links oben befindet sich die Überschrift {string}', async(world: CustomWorld, title: String) => {
    console.log('Titel gefunden: ', title)

}) 