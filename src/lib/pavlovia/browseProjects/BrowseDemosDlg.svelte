<script>
    import { Dialog } from "$lib/ui/dialog";
    import BrowseDemos from "./BrowseDemos.svelte";
    import { translate } from "$lib/translation"

    let {
        shown=$bindable(),
        awaiting=$bindable(),
        selection=$bindable(),
        searchTerm=$bindable()
    } = $props()

</script>

<Dialog
    title={translate("Browse demos")}
    buttons={{
        OK: evt => {}
    }}
    bind:shown={shown}
    bind:awaiting={awaiting}
>
    <BrowseDemos 
        bind:selection={selection}
        bind:searchTerm={searchTerm}
    />
</Dialog>
