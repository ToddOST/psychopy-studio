<script>
    import Button from "./Button.svelte";

    let {
        /** @prop @type {boolean} Is this button toggled on? */
        value=$bindable(),
        /** @prop @type {(value: boolean) => any} Function to call when this button is toggled, receives the new value */
        ontoggle = (value) => {},
        /** @interface Any other props are passed through to Button */
        ...props
    } = $props()
</script>

<Button
    {...props}
    onclick={(evt) => {
        value = !value;
        
        return ontoggle(value);
    }}
    depressed={value}
/>
