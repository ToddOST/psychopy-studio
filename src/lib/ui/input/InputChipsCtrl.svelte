<script>
    import { Icon } from "$lib/ui/icon";
    import { translate } from "$lib/translation";
    import { getContext } from "svelte";

    let {
        value=$bindable()
    } = $props()

    let current = $state.raw();

    let labeller = getContext("labeller")
</script>

<div class=container>
    <div class=chips-array>
        {#each value as chip, i}
            <div class=chip>
                {chip}
                <button
                    class=delete-btn
                    onclick={evt => {
                        // remove this chip
                        value.splice(i, 1)
                    }}
                    aria-label={translate("Remove")}
                >
                    <Icon 
                        src="/icons/sym-close.svg"
                        size=.75rem
                    />
                </button>
            </div>
        {/each}
    </div>
    <input 
        bind:value={current}
        aria-labelledby={labeller}
        onkeypress={evt => {
            if (evt.key === "Enter") {
                // listify value if needed
                if (value === undefined) {
                    value = []
                }
                // append current text
                value.push(current)
                // clear current text
                current = ""
            }
        }}
    >
</div>

<style>
    .chips-array {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: .5rem;
        padding: .5rem;
    }
    .chip {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: .5rem;
        color: var(--text-on-outline);
        background-color: var(--outline);
        padding: .3rem .8rem;
        border-radius: .5rem;
    }
    .chip .delete-btn {
        display: flex;
        background: none;
        border: none;
        padding: 0;
        color: inherit;
        opacity: 0.5;
        transition: opacity .2s;
    }
    .chip .delete-btn:hover,
    .chip .delete-btn:focus {
        opacity: 1;
    }
    .container {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        padding: .5rem;
        border: 1px solid var(--overlay);
        border-radius: .5rem;
    }
    
</style>
