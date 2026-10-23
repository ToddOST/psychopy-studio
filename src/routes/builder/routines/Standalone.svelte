<script>
    import { ParamsNotebook } from "$lib/paramCtrls";
    import { Button } from '$lib/utils/buttons';
    import { onMount } from "svelte";
    import { translate } from "$lib/translation";

    let {
        routine
    } = $props();

    onMount(
        () => {
            routine.restore.set()

            return routine.restore.set
        }
    )

    // track whether this Routine has changes
    let changed = $derived(!Object.entries(routine.params).every(
        ([name, param]) => param.matches(
            (routine.restore.point || routine).params[name]
        )
    ))

    // update reference in Experiment when this Routine is renamed
    $effect(() => {
        if (routine.exp && routine.valid) {
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
        {#if changed}
            <Button
                label={translate("Discard changes")}
                tooltip={translate(
                    "Undo any changes made since this Routine was {}"
                    ).replace(
                        "{}", 
                        routine.restore.point ? translate("selected") : translate("created")
                    )}
                horizontal
                onclick={(evt) => routine.restore.apply()} 
            />
        {/if}
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