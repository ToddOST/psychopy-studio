<script>
    import { getContext, setContext } from "svelte";

    let {
        /** @prop @type {string} Label for this category */
        label,
        /** @prop @type {boolean} Whether or not this category is expended */
        open=$bindable(),
        /** @prop @type {Snippet} */
        children
    } = $props()

    // use Svelte's unique ID to identify this category
    let index = $props.id()
    // set context so children inherit the categ
    setContext("categ", index)
    // add to array of categories
    let siblings = getContext("siblings")
    $effect(() => {
        siblings.categories[index] = {
            open: open,
            label: label
        }
    })
</script>

{@render children?.()}