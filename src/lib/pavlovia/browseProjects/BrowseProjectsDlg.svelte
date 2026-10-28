<script>
    import { Dialog } from "$lib/ui/dialog";
    import { Notebook, NotebookPage } from "$lib/ui/notebook";
    import BrowseDemos from "./BrowseDemos.svelte";

    let {
        shown=$bindable(),
        page=$bindable(),
        awaiting=$bindable()
    } = $props()

</script>

<Dialog
    bind:shown={shown}
    bind:awaiting={awaiting}
>
    <Notebook>
        <NotebookPage
            label="Demos"
        >
            <BrowseDemos />
        </NotebookPage>
    </Notebook>
</Dialog>
