<script>
    import { electron } from "$lib/globals.svelte";
    import { getContext, setContext, onMount, untrack } from "svelte";
    import { SubMenu } from "..";
    import { addToTemplate, removeFromTemplate } from "./utils";

    let {
        /** @prop @type {string} Label for this menu item */
        label,
        /** @prop @type {String|undefined} Path to an icon for this page's tab */
        icon=undefined,
        /** @prop @type {any} Arbitrary data associated with this menu item  */
        data={},
        /** @prop @type {boolean} Is this item able to be clicked on? */
        disabled=$bindable(),
        children
    } = $props()

    // get template
    let template = getContext("template");
    // create own entry as state, so the same proxy ends up in the template
    let entry = $state({
        label: untrack(() => label),
        submenu: []
    })
    // add self to template on mount, and remove on unmount
    onMount(() => {
        addToTemplate(template, entry)

        return () => removeFromTemplate(template, entry)
    })
    // set own submenu as new template (has to happen during init)
    setContext("template", entry.submenu)
</script>

{#if !electron}
    <SubMenu
        label={label}
        icon={icon}
        data={data}
        bind:disabled={disabled}
    >
        {@render children?.()}
    </SubMenu>
{:else}
    {@render children?.()}
{/if}

