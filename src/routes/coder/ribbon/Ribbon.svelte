<script>
    import callbacks from '../callbacks.svelte.js';
    
    import { Ribbon, RibbonSection, RibbonGap } from '$lib/utils/ribbon';
    import Menu from "./Menu.svelte";
    import { getContext } from "svelte";
    import { Button, SwitchButton } from '$lib/utils/buttons';
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
        <Button
            icon="/icons/btn-new.svg" 
            tooltip={translate("New file")} 
            onclick={callbacks.new.fcn}
            ghost
            tight
        /> 
        <Button
            icon="/icons/btn-open.svg" 
            tooltip={translate("Open file")} 
            onclick={callbacks.open.fcn} 
            ghost
            tight
        />
        <Button
            icon="/icons/btn-save.svg" 
            tooltip={translate("Save file")} 
            onclick={callbacks.save.fcn}
            disabled={callbacks.save.disabled}
            ghost
            tight
        />
        <Button
            icon="/icons/btn-saveas.svg" 
            tooltip={translate("Save file as")}
            onclick={callbacks.saveAs.fcn} 
            disabled={callbacks.saveAs.disabled}
            ghost
            tight
        />
    </RibbonSection>

    <RibbonSection label={translate("Edit")} icon="/icons/rbn-edit.svg">
        <Button
            icon="/icons/btn-undo.svg" 
            tooltip={translate("Undo")}
            onclick={callbacks.undo.fcn} 
            disabled={callbacks.undo.disabled} 
            ghost
            tight
        />
        <Button
            icon="/icons/btn-redo.svg" 
            tooltip={translate("Redo")} 
            onclick={callbacks.redo.fcn} 
            disabled={callbacks.redo.disabled} 
            ghost
            tight
        />
        <Button
            icon="/icons/btn-find.svg" 
            tooltip={translate("Find")} 
            onclick={callbacks.find.fcn}
            disabled={callbacks.find.disabled}
            ghost
            tight
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
            <Button
                icon="/icons/btn-send{current.pages[current.tab]?.pilotMode ? "pilot" : "run"}.svg" 
                tooltip={translate("Send experiment to runner")} 
                onclick={callbacks.sendToRunner.fcn}
                disabled={callbacks.sendToRunner.disabled}
                ghost
                tight
            /> 
        {/if}
    </RibbonSection>
    {#if python?.ready}
        <RibbonSection label={translate("Run")} icon="/icons/btn-runpy.svg">
            <Button
                icon="/icons/btn-{current.pages[current.tab]?.pilotMode ? "pilot" : "run"}py.svg" 
                tooltip={current.pages[current.tab]?.pilotMode ? translate("Pilot locally") : translate("Run locally")}
                onclick={evt => callbacks.runPython.fcn()}
                disabled={callbacks.runPython.disabled}
                bind:awaiting={awaiting.runpy}
                cancel={evt => callbacks.stopPython.fcn()}
                ghost
                tight
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
        <Button
            icon="/icons/btn-builder.svg" 
            tooltip={translate("Builder view")} 
            onclick={callbacks.showBuilder.fcn} 
            ghost
            tight
        />
        <Button
            icon="/icons/btn-coder.svg" 
            tooltip={translate("Coder view")} 
            onclick={callbacks.showCoder.fcn} 
            disabled
            ghost
            tight
        />
        {#if electron}
            <Button
                icon="/icons/btn-runner.svg" 
                tooltip={translate("Runner view")} 
                onclick={callbacks.showRunner.fcn} 
                ghost
                tight
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
