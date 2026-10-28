<script>
    import { Button } from "$lib/ui/button";
    import { CodeOutput } from "$lib/ui/code";
    import { getContext } from "svelte";
    import { translate } from "$lib/translation";

    let current = getContext("current")

    
</script>


<CodeOutput bind:value={current.output.pavlovia}>
    {#snippet ctrls()}
        <Button
            icon="/icons/btn-clear.svg"
            onclick={evt => current.output.pavlovia = ""}
            tooltip={translate("Clear pavlovia output")}
            small
        />
    {/snippet}
</CodeOutput>