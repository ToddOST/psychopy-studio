/**
 * A callback function, along with the condition under which it is disabled and (optionally) the 
 * name of the keyboard shortcut which triggers it.
 */
export class Callback {
    /**
     * @param {Function} fcn Function to call
     * @param {Function} disabled Function returning true when this callback should be disabled
     * @param {String} shortcut Name of the keyboard shortcut (as in prefs.shortcuts) which triggers this callback
     */
    constructor(fcn, disabled = () => false, shortcut = undefined) {
        this.fcn = fcn
        this.disabled = $derived.by(disabled)
        this.shortcut = shortcut
    }
}
