<script>
    import { translate } from "$lib/translation"

    let {
        value=$bindable(),
        /** @prop @type {string|undefined} Placeholder text to display before typing */
        placeholder=translate("Search..."),
        /** @prop @type {number} Debounce period (ms) to prevent excessive searching */
        debounce=0
    } = $props()

    // apply debounce period
    let query = $state.raw("")
    $effect(() => {
        if (debounce) {
            // start a timer updating the term after debounce period has elapsed
            let timeout = setTimeout(
                () => query = value, 
                debounce
            )
            // cancel the timeout on subsequent changes
            return () => clearTimeout(timeout)
        } else {
            // if no debounce period, apply immediately
            query = value
        }
    })
</script>


<input 
    type="search"
    class=search-ctrl
    placeholder={placeholder}
    aria-label={placeholder || translate("Search")}
    bind:value={
        () => query,
        (val) => value = val
    }
/>