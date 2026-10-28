<script>
    import { getContext, setContext } from "svelte";
    import { fly } from "svelte/transition";

    let {
        /** @public @type {import("svelte").store<boolean|undefined>} Whether this menu is shown */
        shown=$bindable(),
        position=$bindable({
            x: undefined,
            y: undefined
        }),
        children=undefined
    } = $props()

    // unique anchor name linking the menu to its parent
    let uid = $props.id()
    let anchor = `--menu-${uid}`
    // if given coordinates, show at those coordinates rather than next to the parent
    let fixed = $derived(Boolean(position.x || position.y))

    // handle of this menu's div element (for checking clicks)
    let handle = $state();
    // get function to close parent, if there is one
    let closeParent = getContext("closeMenu")
    // define function for closing this menu and pass it to children
    export function close() {
        // close this menu
        shown = false;
        // close parent menu, if any
        if (closeParent) {
            closeParent()
        }
    }
    setContext("closeMenu", close)

    /**
     * Open the popover when the menu is added and anchor it to its parent element
     */
    function popover(node) {
        let parent = node.parentElement
        // anchor
        parent?.style.setProperty("anchor-name", anchor)
        // open
        node.showPopover()
        // unanchor when done
        return () => parent?.style.removeProperty("anchor-name")
    }
</script>

{#if shown}
    <div
        bind:this={handle}
        class=menu
        class:fixed
        popover=manual
        style:position-anchor={fixed ? undefined : anchor}
        style:left={fixed ? `${position.x || 0}px` : undefined}
        style:top={fixed ? `${position.y || 0}px` : undefined}
        transition:fly={{ 
            y: "-.5rem",
            duration: 200 
        }}
        {@attach popover}
    >
        {@render children?.()}
    </div>
{/if}

<svelte:window
    onmousedown={(evt) => {
        // ignore clicks when element is not shown
        if (!handle) {
            return
        }
        // if clicked outside of itself, close
        if (!handle.contains(evt.target)) {
            shown = false
        }
    }}
    onkeydown={(evt) => {
        // ignore clicks when element is not shown
        if (!handle) {
            return
        }
        // if escape is pressed, close
        if (evt.key === "Escape") {
            shown = false
        }
    }}
/>

<style>
    .menu {
        inset: auto;
        margin: 0;
        color: inherit;
        background: var(--base);
        border: 1px solid var(--overlay);
        border-radius: .1rem;
        list-style-type: none;
        padding: .5rem 0;
        /* to the right of the parent, aligned with its top */
        position-area: right span-bottom;
        position-try-fallbacks: flip-block, flip-inline;
    }
    .menu.fixed {
        position-area: none;
        position-try-fallbacks: none;
    }
    .menu:focus {
        border-color: var(--blue)
    }

</style>
