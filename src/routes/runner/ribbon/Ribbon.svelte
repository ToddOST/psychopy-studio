<script>
    import callbacks from '../callbacks.svelte.js';
    
    import Menu from "./Menu.svelte";
    import { MenuItem, MenuSeparator } from "$lib/ui/menu";
    import { Ribbon, RibbonSection, RibbonGap } from '$lib/ui/ribbon';
    import { PluginManagerDlg } from "$lib/dialogs/environmentManager";
    import { getContext } from "svelte";
    import { electron, python } from "$lib/globals.svelte.js";
    import { Button, SwitchButton } from '$lib/ui/button';
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
        pluginMgr: false
    })

    let piloting = $derived(current.runlist[current.selection]?.pilotMode)
</script>

<Ribbon>
    <Menu 
        bind:shown={show.menu} 
    />
    
    <RibbonSection label={translate("File")} icon="/icons/rbn-file.svg">
        <Button
            icon="/icons/btn-new.svg" 
            tooltip={translate("New configuration")} 
            action="new"
            ghost
            tight
        />
        <Button
            icon="/icons/btn-open.svg" 
            tooltip={translate("Open configuration")} 
            action="openConfiguration"
            disabled={callbacks.open.disabled}
            ghost
            tight
        />
        <Button
            icon="/icons/btn-save.svg" 
            tooltip={translate("Save configuration")} 
            action="save"
            ghost
            tight
        />
        <Button
            icon="/icons/btn-saveas.svg" 
            tooltip={translate("Save configuration as")}
            action="saveAs"
            ghost
            tight
        />
    </RibbonSection>

    <RibbonSection label={translate("Selection")} icon="/icons/rbn-experiment.svg">
        <SwitchButton 
            labels={["Pilot", "Run"]} 
            tooltip={piloting ? translate("Experiment will run in pilot mode") : translate("Experiment will run in run mode")}
            bind:value={
                () => !piloting,
                (value) => current.runlist[current.selection]?.setPilotMode(!value)
            } 
            disabled={callbacks.togglePiloting.disabled}
        />
        <Button
            icon="/icons/btn-send{current.runlist[current.selection]?.file.ext === ".psyexp" ? "builder" : "coder"}.svg" 
            tooltip={current.runlist[current.selection]?.file.ext === ".psyexp" ? translate("Open selection in Builder") : translate("Open selection in Coder")}
            action="openSelection"
            ghost
            tight
        />
    </RibbonSection>

    {#if python?.ready}
        <RibbonSection label={translate("Run")} icon="/icons/btn-runpy.svg">
            {#if current.runlist[current.selection]?.file.ext === ".py"}
                <Button
                    icon="/icons/btn-{current.runlist[current.selection]?.pilotMode ? "pilot" : "run"}py.svg" 
                    tooltip={current.runlist[current.selection]?.pilotMode ? translate("Pilot experiment locally") : translate("Run experiment locally")}
                    action="runPython"
                    bind:awaiting={current.awaiting.runpy}
                    cancel={callbacks.stopPython.fcn}
                    ghost
                    tight
                >
                    {#snippet menu()}
                        {#await python.uv.getEnvironments() then environments}
                            {#each environments.toReversed() as env}
                                <MenuItem 
                                    label={
                                        "{run/pilot} in {version} {isApp}"
                                        .replaceAll("{run/pilot}", piloting ? translate("Pilot") : translate("Run"))
                                        .replaceAll("{version}", env.name)
                                        .replaceAll("{isApp}", env.isApp ? translate("(app)") : "")
                                    }
                                    onclick={evt => callbacks.runPython.fcn(env.name)}
                                    bind:awaiting={current.awaiting.runpy}
                                    cancel={callbacks.stopPython.fcn}
                                    disabled={callbacks.runPython.disabled}
                                />
                            {/each}
                            <MenuSeparator />
                            <MenuItem 
                                label={translate("Manage environments...")}
                                onclick={evt => show.pluginMgr = true}
                            />
                        {/await}
                    {/snippet}
                </Button>
            {:else}
                <Button
                    icon="/icons/btn-{piloting ? "pilot" : "run"}py.svg" 
                    tooltip={piloting ? translate("Pilot experiment locally") : translate("Run experiment locally")}
                    action="runPython"
                    bind:awaiting={current.awaiting.runpy}
                    cancel={callbacks.stopPython.fcn}
                    ghost
                    tight
                />
            {/if}
            <Button
                icon="/icons/btn-{current.runlist[current.selection]?.pilotMode ? "pilot" : "run"}py.svg" 
                tooltip={current.runlist[current.selection]?.pilotMode ? translate("Pilot experiment locally") : translate("Run experiment locally")}
                action="runPython"
                bind:awaiting={current.awaiting.runpy}
                cancel={callbacks.stopPython.fcn}
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
            action="showBuilder"
            ghost
            tight
        />
        <Button
            icon="/icons/btn-coder.svg" 
            tooltip={translate("Coder view")} 
            action="showCoder"
            ghost
            tight
        />
        {#if electron}
            <Button
                icon="/icons/btn-runner.svg" 
                tooltip={translate("Runner view")} 
                action="showRunner"
                disabled
                ghost
                tight
            />
        {/if}
    </RibbonSection>
</Ribbon>

{#if python}
    <PluginManagerDlg 
        bind:shown={show.pluginMgr}
    />
{/if}

<style>
    .padded {
        display: flex;
        padding: 0 .25rem;
    }
</style>
