<script>
    import { ParamsNotebook } from "$lib/paramCtrls";
    import { Button } from '$lib/utils/buttons';
    import { onMount } from "svelte";
    import { translate } from "$lib/translation";

    let {
        routine
    } = $props();

    onMount(() => routine.restore.set())

    let valid = $derived(
        Object.values(routine.params).every(
            param => param.valid.value
        )
    )

    // update reference in Experiment when this Routine is renamed
    $effect(() => {
        if (routine.exp) {
            routine.exp.renameRoutine(
                routine, 
                $state.snapshot(routine.params['name'].val)
            )
        }
    })
</script>

<div class=standalone-routine-canvas>
    <div class=notebook-container>
        <ParamsNotebook 
            bind:element={routine}
        />
    </div>
    <div class=standalone-routine-ctrls>
        <div class=ctrl-gap></div>
        <Button
            label={translate("Apply")}
            primary
            horizontal
            disabled={!valid}
            onclick={(evt) => routine.restore.set()} 
        />
        <Button
            label={translate("Discard")}
            horizontal
            onclick={(evt) => routine.restore.apply()} 
        />
    </div>
</div>

<style>
    .standalone-routine-canvas {
        display: grid;
        gap: 1rem;
        grid-template-rows: [canvas] 1fr [ctrls] min-content;
        justify-content: center;
        padding: 1rem;
        height: 100%;
        box-sizing: border-box;
    }
    .standalone-routine-ctrls {
        display: flex;
        flex-direction: row;
        grid-row-start: ctrls;
        gap: 1rem;
        align-items: end;
        padding-bottom: 2rem;
    }

    .notebook-container {
        max-width: 55rem;
    }

    .ctrl-gap {
        flex-grow: 1;
    }
</style>