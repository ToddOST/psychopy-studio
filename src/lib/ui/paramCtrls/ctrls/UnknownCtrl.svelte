<script>
    import SingleLineCtrl from "./SingleLineCtrl.svelte";
    import { Button } from "$lib/ui/button";
    import { translate } from "$lib/translation";

    let {
        /** @prop @type {import("$lib/experiment").Param} Param object to which this ctrl pertains */
        param=$bindable(),
        /** @prop @type {Boolean} Should the code indicator ($) be shown? */
        codeIndicator = param.isCodeType,
        /** @interface */
        ...attachments
    } = $props()
</script>

{#if param.deleted}
    <div class=deleted-lbl>
        {translate("Deleted")}
    </div>
    <Button
        icon="/icons/btn-undo.svg"
        tooltip={translate("Unrecognised param deleted. Undo?")}
        onclick={evt => param.deleted = false}
        small
    />
{:else}
    <SingleLineCtrl 
        bind:param={param}
        codeIndicator=codeIndicator
        disabled
        {...attachments}
    />
    <Button
        icon="/icons/btn-delete.svg"
        tooltip={translate("Delete unrecognised param?")}
        onclick={evt => param.deleted = true}
        small
    />
{/if}

<style>
    .deleted-lbl {
        color: var(--outline);
        background-color: var(--mantle);
        border: 1px solid var(--overlay);
        border-radius: .5rem;
        padding: .5rem;
        flex-grow: 1;
    }
</style>