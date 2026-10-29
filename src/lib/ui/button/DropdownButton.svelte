<script>
    import Menu from "$lib/ui/menu/Menu.svelte";
    import Button from "./Button.svelte";
    import { Icon } from "$lib/ui/icon";
    import { translate } from "$lib/translation";

    let {
        /** @prop @type {(evt: PointerEvent) => undefined} Function to call when the main button is pressed */
        onclick = (evt) => {},
        /** @prop @type {boolean} Are we awaiting execution of this button? */
        awaiting=$bindable(false),
        /** @interface Inner contents of menu to be shown when the expand button is clicked */
        children=undefined,
        /** @interface Any other props are passed through to the main Button */
        ...props
    } = $props()

    let showMenu = $state(false);
</script>

<div class=dropdown-button>
    <Button
        {...props}
        onclick={onclick}
        bind:awaiting={awaiting}
        flush="right"
    />
    <Button
        tooltip={translate("Expand")}
        onclick={(evt) => showMenu = !showMenu}
        small
        flush="left"
    >
        {#snippet icon(status)}
            <Icon 
                src="/icons/sym-arrow-down.svg"
                size=".5rem"
            />
        {/snippet}
    </Button>
    <Menu
        bind:shown={showMenu}
    >
        {@render children?.()}
    </Menu>
</div>

<style>
    .dropdown-button {
        position: relative;
        display: flex;
        flex-direction: row;
        gap: 0;
    }
    .dropdown-button > :global(button:last-of-type) {
        margin-left: -1px;
    }
</style>
