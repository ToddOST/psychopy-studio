<script>
    import { getContext, setContext, onMount } from "svelte";

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
    onMount(() => {
        // register this category, using getters and setters to stay reactive
        siblings.categories[index] = {
            get open() {
                return open
            },
            set open(value) {
                open = value
            },
            get label() {
                return label
            }
        }
        // remove on unmount
        return () => {
            delete siblings.categories[index]
        }
    })

</script>

{@render children?.()}