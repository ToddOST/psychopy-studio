<script>
    import callbacks from '../callbacks.svelte.js';
    
    import Menu from "./Menu.svelte";
    import { Ribbon, RibbonSection, RibbonGap } from '$lib/utils/ribbon';
    import { getContext } from "svelte";
    import { electron, python } from "$lib/globals.svelte.js";
    import { IconButton, SwitchButton } from '$lib/utils/buttons';
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
        <IconButton 
            icon="/icons/btn-new.svg" 
            label={translate("New configuration")} 
            onclick={callbacks.new.fcn}
            disabled={callbacks.new.disabled}
            borderless
        />
        <IconButton 
            icon="/icons/btn-open.svg" 
            label={translate("Open configuration")} 
            onclick={callbacks.openConfiguration.fcn}
            disabled={callbacks.open.disabled}
            borderless
        />
        <IconButton 
            icon="/icons/btn-save.svg" 
            label={translate("Save configuration")} 
            onclick={callbacks.save.fcn}
            disabled={callbacks.save.disabled}
            borderless
        />
        <IconButton 
            icon="/icons/btn-saveas.svg" 
            label={translate("Save configuration as")}
            onclick={callbacks.saveAs.fcn} 
            disabled={callbacks.saveAs.disabled}
            borderless
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
        <IconButton 
            icon="/icons/btn-send{current.runlist[current.selection]?.file.ext === ".psyexp" ? "builder" : "coder"}.svg" 
            label={current.runlist[current.selection]?.file.ext === ".psyexp" ? translate("Open selection in Builder") : translate("Open selection in Coder")}
            onclick={callbacks.openSelection.fcn}
            borderless
            disabled={callbacks.openSelection.disabled}
        />
    </RibbonSection>

    {#if python?.ready}
        <RibbonSection label=Run icon="/icons/btn-runpy.svg">
            <IconButton 
                icon="/icons/btn-{current.runlist[current.selection]?.pilotMode ? "pilot" : "run"}py.svg" 
                label={current.runlist[current.selection]?.pilotMode ? translate("Pilot experiment locally") : translate("Run experiment locally")}
                onclick={callbacks.runPython.fcn}
                disabled={callbacks.runPython.disabled}
                bind:awaiting={current.awaiting.runpy}
                cancel={callbacks.stopPython.fcn}
                borderless
            />
            <IconButton 
                icon="/icons/btn-{current.runlist[current.selection]?.pilotMode ? "pilot" : "run"}js.svg" 
                label={current.runlist[current.selection]?.pilotMode ? translate("Pilot experiment in browser") : translate("Run experiment in browser")} 
                onclick={callbacks.runJS.fcn}
                disabled={callbacks.runJS.disabled}
                bind:awaiting={current.awaiting.runjs}
                borderless
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
        />
        {#if electron}
            <IconButton 
                icon="/icons/btn-runner.svg" 
                label={translate("Runner view")} 
                onclick={callbacks.showRunner.fcn} 
                borderless
                disabled
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
