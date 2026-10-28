<script>
    import { setContext } from "svelte";
    import { PanelButton } from "$lib/utils/buttons";
    import { translate } from "$lib/translation";

    let {
        /** @prop @type {((term: string, data: object) => boolean)|undefined} If items are searchable, a function which takes the search query and an item's data and returns whether the item matches */
        search=undefined,
        /** @prop @type {string} Search term (ignored if not searchable) */
        searchTerm=$bindable(),
        /** @prop @type {Snippet} */
        children
    } = $props()

    // object in which to store selection and child items
    let items = $state({
        selected: undefined,
        categories: {},
        items: []
    })
    setContext("siblings", items)

    // if we have a search function, update shown items according to it
    $effect(() => {
        if (search) {
            // set each item's shown state according to results of search function
            for (let i in items.items) {
                items.items[i].shown = search(searchTerm || "", items.items[i].data)
            }
        }
    })

    /**
     * Sort items by category
     * 
     * @param {array} shownItems Array of items to sort, should already be filtered by shown state
     */
    function sortByCateg(shownItems) {
        let output = {}
        // iterate through items
        for (let item of shownItems) {
            // make sure we have an entry for this category
            if (!(item.categ in output)) {
                output[item.categ] = []
            }
            // add item to categ
            output[item.categ].push(item)
        }

        return Object.entries(output)
    }
</script>

{#snippet itemsList(subitems, label=undefined)}
    <div 
        class=items-list
        role=tablist
        aria-label={label}
        aria-orientation=vertical
        focusgroup="tablist block wrap nomemory"
    >
        {#each subitems as item}
            {@render item.button()}
        {/each}
    </div>
{/snippet}


<div class=list-detail-ctrl>
    <div class=list-panel>
        {#if search}
            <input 
                type="search"
                class=search-ctrl
                placeholder={translate("Search...")}
                aria-label={translate("Search")}
                bind:value={searchTerm}
            />
        {/if}
        <div class=items-list>
            {#each sortByCateg(
                items.items.filter(item => item.shown)
            ) as [categ, subitems]}
                {#if items.categories[categ]}
                    <PanelButton
                        label={items.categories[categ].label}
                        bind:open={items.categories[categ].open}
                    >
                        {@render itemsList(subitems, items.categories[categ].label)}
                    </PanelButton>
                {:else}
                    {@render itemsList(subitems)}
                {/if}
            {/each}
            <!-- render any other children at the bottom -->
            {@render children?.()}
        </div>
    </div>
    <div class=details-panel>
        {#each items.items.filter(item => item.shown) as item}
            {@render item.details()}
        {/each}
    </div>
</div>

<style>
    .list-detail-ctrl {
        display: flex;
        flex-direction: row;
        padding: 1rem;
        gap: 1rem;
        height: 100%;
        box-sizing: border-box;
        max-width: 80vw;
    }
    .list-panel {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        width: 25rem;
    }
    .items-list {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        gap: .5rem;
        padding: .5rem;
    }
    .details-panel {
        padding: 2rem;
        background-color: var(--base);
        border: 1px solid var(--overlay);
        border-radius: .5rem;
        overflow: auto;
        width: 50rem;
    }
</style>
