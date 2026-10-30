<script>
    import ToggleButton from "./ToggleButton.svelte";

    let {
        selection=$bindable(),
        value,
        /** @prop @type {boolean} Stretch button to fit its container? */
        stretch=true,
        ...props
    } = $props();
</script>

<ToggleButton
    bind:value={
        () => selection === value,
        (state) => {
            if (state) {
                selection = value
            }
        }
    }
    stretch={stretch}
    {...props}
/>
