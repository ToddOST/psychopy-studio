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
    <div class=container>
        <Notebook>
            <NotebookPage
                label="Demos"
            >
                <BrowseDemos />
            </NotebookPage>
        </Notebook>
    </div>
</Dialog>

<style>
    .container {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
</style>
