<script>
    import { electron } from "$lib/globals.svelte";
    import { getContext, onMount } from "svelte";
    import { MenuSeparator } from "..";
    import { addToTemplate, removeFromTemplate } from "./utils";

    // get template
    let template = getContext("template");
    // construct template entry for this separator
    let entry = $state({
        type: "separator"
    })
    // add self to template on mount, and remove on unmount
    onMount(() => {
        addToTemplate(template, entry)

        return () => removeFromTemplate(template, entry)
    })

</script>

{#if !electron}
    <MenuSeparator />
{/if}
