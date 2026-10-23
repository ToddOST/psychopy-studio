<script>
    
    import { Ribbon, RibbonSection, RibbonGap } from '$lib/utils/ribbon';
    import Menu from "./Menu.svelte";
    import { getContext } from "svelte";
    import { IconButton, SwitchButton } from '$lib/utils/buttons';
    import { UserCtrl } from '$lib/pavlovia';
    import { electron, python } from "$lib/globals.svelte";
    import { translate } from "$lib/translation";

    let current = getContext("current");

    let show = $state({
    })

    let awaiting = $state({
        runpy: Promise.resolve(false)
    })
</script>

<Ribbon>
    <Menu 
        bind:shown={show.menu} 
    />
    
    <RibbonSection label={translate("File")} icon="/icons/rbn-file.svg">
        <IconButton 
            icon="/icons/btn-new.svg" 
            label={translate("New file")} 
            onclick={callbacks.new.fcn}
            borderless
        /> 
        <IconButton 
            icon="/icons/btn-open.svg" 
            label={translate("Open file")} 
            onclick={callbacks.open.fcn} 
            borderless
        />
        <IconButton 
            icon="/icons/btn-save.svg" 
            label={translate("Save file")} 
            onclick={callbacks.save.fcn}
            borderless
            disabled={callbacks.save.disabled}
        />
        <IconButton 
            icon="/icons/btn-saveas.svg" 
            label={translate("Save file as")}
            onclick={callbacks.saveAs.fcn} 
            borderless
            disabled={callbacks.saveAs.disabled}
        />
    </RibbonSection>

    <RibbonSection label={translate("Edit")} icon="/icons/rbn-edit.svg">
        <IconButton 
            icon="/icons/btn-undo.svg" 
            label={translate("Undo")}
            onclick={callbacks.undo.fcn} 
            disabled={callbacks.undo.disabled} 
            borderless
        />
        <IconButton 
            icon="/icons/btn-redo.svg" 
            label={translate("Redo")} 
            onclick={callbacks.redo.fcn} 
            disabled={callbacks.redo.disabled} 
            borderless
        />
        <IconButton 
            icon="/icons/btn-find.svg" 
            label={translate("Find")} 
            onclick={callbacks.find.fcn}
            disabled={callbacks.find.disabled}
            borderless
        />
    </RibbonSection>

    <RibbonSection label={translate("Experiment")} icon="/icons/rbn-experiment.svg">
        <SwitchButton 
            labels={["Pilot", "Run"]} 
            tooltip={current.pages[current.tab]?.pilotMode ? "Experiment will run in pilot mode" : "Experiment will run in run mode"}
            bind:value={
                () => !current.pages[current.tab]?.pilotMode,
                (value) => current.pages[current.tab].setPilotMode(!value)
            } 
            disabled={callbacks.togglePiloting.disabled}
        />
        
        {#if python?.ready}
            <IconButton 
                icon="/icons/btn-send{current.pages[current.tab]?.pilotMode ? "pilot" : "run"}.svg" 
                label={translate("Send experiment to runner")} 
                onclick={callbacks.sendToRunner.fcn}
                disabled={callbacks.sendToRunner.disabled}
                borderless
            /> 
        {/if}
    </RibbonSection>
    {#if python?.ready}
        <RibbonSection label={translate("Run")} icon="/icons/btn-runpy.svg">
            <IconButton 
                icon="/icons/btn-{current.pages[current.tab]?.pilotMode ? "pilot" : "run"}py.svg" 
                label={current.pages[current.tab]?.pilotMode ? translate("Pilot locally") : translate("Run locally")}
                onclick={evt => callbacks.runPython.fcn()}
                disabled={callbacks.runPython.disabled}
                bind:awaiting={awaiting.runpy}
                cancel={evt => callbacks.stopPython.fcn()}
                borderless
            /> 
        </RibbonSection>
    {/if}

    <RibbonSection label={translate("Pavlovia")} icon="/icons/rbn-pavlovia.svg">
        <div class=padded>
            <UserCtrl />
        </div>
    </RibbonSection>

    <RibbonGap></RibbonGap>

    <RibbonSection label={translate("Views")} icon="/icons/rbn-windows.svg">
        <IconButton 
            icon="/icons/btn-builder.svg" 
            label={translate("Builder view")} 
            onclick={callbacks.showBuilder.fcn} 
            borderless
        />
        <IconButton 
            icon="/icons/btn-coder.svg" 
            label={translate("Coder view")} 
            onclick={callbacks.showCoder.fcn} 
            borderless
            disabled
        />
        {#if electron}
            <IconButton 
                icon="/icons/btn-runner.svg" 
                label={translate("Runner view")} 
                onclick={callbacks.showRunner.fcn} 
                borderless
            />
        {/if}
    </RibbonSection>
</Ribbon>

<style>
    .padded {
        display: flex;
        padding: 0 .25rem;
    }
</style>
