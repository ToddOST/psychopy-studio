<script>
    import PluginItem from "./PluginItem.svelte";
    import { ListDetail, ListDetailCategory, ListDetailItem } from "$lib/ui/listdetail";
    import { python } from "$lib/globals.svelte";
    import { translate } from "$lib/translation";

    let {
        venv=$bindable()
    } = $props()

    // packages installed in the current venv, by pipname
    let installed = $state({})

    $effect(() => {
        if (venv) {
            python.venv.getPackages(venv).then(
                resp => installed = resp
            )
        }
    })
</script>


<ListDetail
    search={(term, data) => (
        data.name.toLowerCase().includes(term.toLowerCase()) ||
        data.pipname.toLowerCase().includes(term.toLowerCase()) ||
        data.description?.toLowerCase().includes(term.toLowerCase()) ||
        data.keywords?.includes(term) ||
        term === ""
    )}
>
    {#await fetch("/api/plugins").then(resp => resp.json())}
        {translate("Getting plugins...")}
    {:then allPlugins}
        {#each [
            [true, allPlugins.filter(plugin => installed[plugin.pipname])],
            [false, allPlugins.filter(plugin => !installed[plugin.pipname])]
        ] as [isInstalled, plugins]}
            <ListDetailCategory
                label={isInstalled ? translate("Installed") : translate("Not installed")}
                open
            >
                {#each plugins as plugin (plugin.pipname)}
                    <ListDetailItem
                        data={plugin}
                    >
                        {#snippet label()}
                            <div class=plugin-label>
                                <img
                                    class=avatar
                                    src={plugin.icon}
                                    alt={plugin.pipname}
                                />
                                <div>
                                    <h4>{plugin.name}</h4>
                                    <code>{plugin.pipname}</code>
                                </div>
                            </div>
                        {/snippet}

                        <PluginItem
                            plugin={plugin}
                            bind:installed={installed[plugin.pipname]}
                            bind:venv={venv}
                        />
                    </ListDetailItem>
                {/each}
            </ListDetailCategory>
        {/each}
    {:catch err}
        {translate("Failed to get plugins")}
        <pre>{err}</pre>
    {/await}
</ListDetail>


<style>
    .plugin-label {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-items: center;
    }

    .plugin-label .avatar {
        border-radius: .5rem;
        width: 5rem;
    }
</style>
