<script>
    import { Button } from "$lib/ui/button";
    import { CodeOutput } from "$lib/ui/code";
    import { getContext } from "svelte";
    import { translate } from "$lib/translation";

    let current = getContext("current");
</script>


<CodeOutput bind:value={current.output.stdout}>
    {#snippet ctrls()}
        <Button
            icon="/icons/btn-clear.svg"
            onclick={evt => current.output.stdout = ""}
            tooltip={translate("Clear stdout")}
            small
        />
    {/snippet}
</CodeOutput>