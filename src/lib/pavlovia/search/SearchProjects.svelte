<script>
    import ProjectPanel from "../ProjectPanel.svelte";
    import { ListDetail, ListDetailItem } from "$lib/ui/listdetail";
    import { SearchCtrl } from "$lib/ui/input";
    import { translate } from "$lib/translation";

    let {
        selection=$bindable(),
        params=$bindable()
    } = $props()

    // cap results so we're not loading an insane amount of projects
    let limit = 100;
</script>

<ListDetail
    filter={(params, data) => data.name.includes(params.searchTerm || "")}
    bind:params={params}
>
    {#snippet ctrls(params)}
        <SearchCtrl 
            bind:value={params.searchTerm}
            placeholder={translate("Search projects...")}
            debounce=500
        />
    {/snippet}
    {#if params.searchTerm}
        {#await fetch(
            `https://pavlovia.org/api/v2/experiments?search=${params.searchTerm}&limit=${limit}`
        ).then(
            resp => resp.json()
        ).then(
            resp => resp.experiments
        )}
            {translate("Searching...")}
        {:then projects}
            {#each projects as project}
                <ListDetailItem 
                    data={project}
                    bind:selected={
                        () => selection === project.pathWithNamespace,
                        (value) => selection = value && project.pathWithNamespace
                    }
                >
                    {#snippet label()}
                        <h4>{project.name}</h4>
                        {project.pathWithNamespace.replaceAll("/", " / ")}
                    {/snippet}

                    <ProjectPanel 
                        project={project.pathWithNamespace}
                    />
                </ListDetailItem>
            {/each}
        {/await}
    {/if}
</ListDetail>
