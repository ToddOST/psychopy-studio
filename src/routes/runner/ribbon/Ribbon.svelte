<script>
    import callbacks from '../callbacks.svelte.js';
    
    import Menu from "./Menu.svelte";
    import { Ribbon, RibbonSection, RibbonGap } from '$lib/utils/ribbon';
    import { getContext } from "svelte";
    import { electron, python } from "$lib/globals.svelte.js";
    import { Button, SwitchButton } from '$lib/utils/buttons';
    import { UserCtrl } from '$lib/pavlovia';
    import { translate } from "$lib/translation";

    let current = getContext("current");

    let {
        selection
    } = $props()

    let show = $state({
        menu: false,
        settingsDlg: false,
        findDlg: false,
        deviceMgrDlg: false,
    })
</script>

<Ribbon>
    <Menu 
        bind:shown={show.menu} 
    />
    
    <RibbonSection label=File icon="/icons/rbn-file.svg">
        <Button
            icon="/icons/btn-new.svg" 
            tooltip={translate("New configuration")} 
            onclick={callbacks.new.fcn}
            disabled={callbacks.new.disabled}
            ghost
            tight
        />
        <Button
            icon="/icons/btn-open.svg" 
            tooltip={translate("Open configuration")} 
            onclick={callbacks.openConfiguration.fcn}
            disabled={callbacks.open.disabled}
            ghost
            tight
        />
        <Button
            icon="/icons/btn-save.svg" 
            tooltip={translate("Save configuration")} 
            onclick={callbacks.save.fcn}
            disabled={callbacks.save.disabled}
            ghost
            tight
        />
        <Button
            icon="/icons/btn-saveas.svg" 
            tooltip={translate("Save configuration as")}
            onclick={callbacks.saveAs.fcn} 
            disabled={callbacks.saveAs.disabled}
            ghost
            tight
        />
    </RibbonSection>

    <RibbonSection label=Selection icon="/icons/rbn-experiment.svg">
        <SwitchButton 
            labels={["Pilot", "Run"]} 
            tooltip={current.runlist[current.selection]?.pilotMode ? translate("Experiment will run in pilot mode") : translate("Experiment will run in run mode")}
            bind:value={
                () => !current.runlist[current.selection]?.pilotMode,
                (value) => current.runlist[current.selection]?.setPilotMode(!value)
            } 
            disabled={callbacks.togglePiloting.disabled}
        />
        <Button
            icon="/icons/btn-send{current.runlist[current.selection]?.file.ext === ".psyexp" ? "builder" : "coder"}.svg" 
            tooltip={current.runlist[current.selection]?.file.ext === ".psyexp" ? translate("Open selection in Builder") : translate("Open selection in Coder")}
            onclick={callbacks.openSelection.fcn}
            disabled={callbacks.openSelection.disabled}
            ghost
            tight
        />
    </RibbonSection>

    {#if python?.ready}
        <RibbonSection label=Run icon="/icons/btn-runpy.svg">
            <Button
                icon="/icons/btn-{current.runlist[current.selection]?.pilotMode ? "pilot" : "run"}py.svg" 
                tooltip={current.runlist[current.selection]?.pilotMode ? translate("Pilot experiment locally") : translate("Run experiment locally")}
                onclick={callbacks.runPython.fcn}
                disabled={callbacks.runPython.disabled}
                bind:awaiting={current.awaiting.runpy}
                cancel={callbacks.stopPython.fcn}
                ghost
                tight
            />
            <Button
                icon="/icons/btn-{current.runlist[current.selection]?.pilotMode ? "pilot" : "run"}js.svg" 
                tooltip={current.runlist[current.selection]?.pilotMode ? translate("Pilot experiment in browser") : translate("Run experiment in browser")} 
                onclick={callbacks.runJS.fcn}
                disabled={callbacks.runJS.disabled}
                bind:awaiting={current.awaiting.runjs}
                ghost
                tight
            />
        </RibbonSection>
    {/if}

    <RibbonSection label=Pavlovia icon="/icons/rbn-pavlovia.svg">
        <div class=padded>
            <UserCtrl />
        </div>
    </RibbonSection>

    <RibbonGap></RibbonGap>

    <RibbonSection label=Views icon="/icons/rbn-windows.svg">
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
            ghost
            tight
        />
        {#if electron}
            <Button
                icon="/icons/btn-runner.svg" 
                tooltip={translate("Runner view")} 
                onclick={callbacks.showRunner.fcn} 
                disabled
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
