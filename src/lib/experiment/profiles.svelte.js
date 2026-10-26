import FallbackPreferencesProfile from "$lib/preferences.json";
import { python, electron } from "$lib/globals.svelte";
import { getLocale } from "$lib/translation";


function trackPromise() {
    // create promise with functions
    let pending = Promise.withResolvers()
    // start off unresolved and unrejected
    pending.resolved = false
    pending.rejected = false
    // get original resolve and reject functions
    let { resolve, reject } = pending
    // on resolution, mark resolved
    pending.resolve = function (value) {
        resolve(value)
        this.resolved = true
    }
    // on rejection, mark rejected
    pending.reject = function (value) {
        reject(value)
        this.rejected = !this.resolved
    }

    return pending
}


/**
 * Each set of profiles has:
 * - value: the profiles themselves
 * - pending: resolvers for a promise which resolves once profiles are available
 * - getter: import string for the Python function which gets the profiles
 */
export var profiles = $state({
    components: {
        value: {},
        pending: trackPromise(),
        getter: "psychopy.experiment:getElementProfiles"
    },
    loops: {
        value: {},
        pending: trackPromise(),
        getter: "psychopy.experiment:getLoopProfiles"
    },
    devices: {
        value: {},
        pending: trackPromise(),
        getter: "psychopy.experiment:getDeviceProfiles"
    },
    preferences: {
        value: FallbackPreferencesProfile,
        pending: trackPromise(),
        getter: undefined
    }
})

/**
 * Get a set of profiles from Python, store them as the last received values and resolve their
 * promise.
 *
 * @param {string} key Which set of profiles to get (e.g. "components", "loops", "devices")
 * @param {number} timeout How long to wait for Python to respond (ms)
 * @param {boolean} force If true, replace the pending promise even if it's already resolved (so
 * anything awaiting it shows as loading again)
 * @returns {Promise<object>} Promise which resolves to the received profiles, or rejects (also
 * rejecting the pending promise) if Python fails to get them
 */
export async function refresh(key, timeout=undefined, force=false) {
    // refresh a previously rejected promise (or any promise, if forced)
    if (force || profiles[key].pending.rejected) {
        profiles[key].pending = trackPromise()
    }
    let data
    try {
        data = await python.liaison.send("app", {
            command: "run",
            args: [profiles[key].getter]
        }, timeout)
    } catch (err) {
        // mark as rejected
        profiles[key].pending.reject(err)
        throw err
    }
    // store as last received, to use next time before Python is ready
    electron?.state.setProfiles(key, data)
    // replace profiles
    profiles[key].value = data
    profiles[key].pending.resolve(profiles[key].value)

    return profiles[key].value
}

// resolves once all profiles needed to create an Experiment are available
let readyPromise = $derived.by(() => {
    // create a combined promise for all element profiles
    let pending = Promise.all([
        profiles.components.pending.promise,
        profiles.loops.pending.promise,
        profiles.devices.pending.promise
    ])
    // failure to get profiles is logged below, so just mark as handled here
    pending.catch(err => {})

    return pending
})
export const ready = {
    get promise() {
        return readyPromise
    }
}

// use last received profiles until we receive new ones
for (let [key, value] of Object.entries(electron?.state.getProfiles() || {})) {
    if (profiles[key]?.getter && value) {
        profiles[key].value = value
        profiles[key].pending.resolve(profiles[key].value)
    }
}

// populate on Liaison starting (if it ever does)
if ( python ) {
    python.liaison.ready("app").then(
        // set language before getting profiles
        () => python.liaison.send("app", {
            command: "try",
            args: [
                "psychopy.localization:setLocale",
                getLocale()
            ]
        })
    ).then(
        () => Promise.all(
            Object.keys(profiles).filter(
                key => profiles[key].getter
            ).map(
                key => refresh(key)
            )
        )
    ).catch(
        err => console.error("Failed to get profiles from Python.", err)
    )
}
