import { electron } from "$lib/globals.svelte";
import { prefs } from "$lib/preferences.svelte";
import { setupPython } from "$lib/python";


/* Preferences */

/**
 * Reset preferences to their default values
 */
export function resetPrefs() {
    prefs.reset()
}


/* Tools */

/**
 * Open the PsychoPy user folder in the system file browser (only available in electron)
 */
export async function openUserFolder() {
    if (electron) {
        let folder = await electron.paths.user()
        return electron.files.openPath(folder)
    }
}

/**
 * Reinstall the app's Python environment
 */
export function reinstallPython() {
    return setupPython("app", true)
}


/* Help */

export function gotoHomepage() {
    open("https://www.psychopy.org/")
}

export function gotoDocumentation() {
    open("https://www.psychopy.org/documentation")
}

export function gotoForum() {
    open("https://discourse.psychopy.org/")
}
