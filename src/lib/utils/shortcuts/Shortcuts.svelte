<script>
    import { prefs } from "$lib/preferences.svelte";
    
    let {
        callbacks
    } = $props();

    let held = $state([]);
</script>


<svelte:window 
    onkeydown={evt => {
        // do nothing if default was prevented
        if (evt.defaultPrevented) {
            return
        }
        // mark key as held
        if (!held.includes(evt.key.toUpperCase())) {
            held.push(evt.key.toUpperCase())
        }
        // does it match the shortcut for any callback?
        for (let callback of Object.values(callbacks)) {
            let param = prefs.shortcuts[callback.shortcut]
            if (param === undefined) {
                continue
            }
            if (param.val.every(val => held.includes(val.toUpperCase())) && held.every(val => param.val.includes(val.toUpperCase()))) {
                // mark key as no longer held
                if (held.includes(evt.key.toUpperCase())) {
                    held.splice(
                        held.indexOf(evt.key.toUpperCase())
                    )
                }
                // if so, execute method (unless disabled)
                if (!callback.disabled) {
                    callback.fcn()
                }
            }
        }
    }}
    onkeyup={evt => {
        // mark key as no longer held
        if (held.includes(evt.key.toUpperCase())) {
            held.splice(
                held.indexOf(evt.key.toUpperCase())
            )
        }
    }}
/>