<script>
    import { onMount, setContext } from "svelte";
    import { panels } from "$lib/globals.svelte";

    let {
        /** @interface */
        children
    } = $props()

    // state which keeps track of the index of each section
    let handle = $state.raw()

    onMount(
        () => {
            // set context so children have access to DOM element
            setContext("ribbon", handle) 
            // add to focusable panels
            let entry = {
                handle: handle,
                // function to query whether the ribbon has focus
                hasFocus: () => handle?.contains?.(document.activeElement),
                // function to execute when the ribbon receives focus
                receiveFocus: () => {
                    for (
                        let child of Array.from(
                            handle.getElementsByTagName("*")
                        )
                        .filter(
                            child => child.tabIndex >= 0 && !child.disabled
                        ).toSorted(
                            (a, b) => a.tabIndex - b.tabIndex
                        )
                    ) {
                        child.focus()
                        break
                    }
                }
            }
            panels.push(entry)
            // remove from focusable panels once unmounted
            return () => {
                panels.splice(panels.indexOf(entry), 1)
            }
        }
    )
</script>

<div id=ribbon bind:this={handle}>
    {@render children()}
</div>

<style>
    #ribbon {
        display: flex;
        flex-direction: row;
        padding: .5em;
        background-color: var(--crust);
        position: relative;
        overflow-x: auto;
    }    
</style>