<script>
    import SingleLineCtrl from "./SingleLineCtrl.svelte";
    import { Button } from "$lib/utils/buttons";
    import { python } from "$lib/globals.svelte";
    import { translate } from "$lib/translation";

    let {
        /** @prop @type {import("$lib/experiment").Param} Param object to which this ctrl pertains */
        param=$bindable(),
        /** @prop @type {boolean} Controls whether this control is disabled */
        disabled=false,
        /** @interface */
        ...attachments
    } = $props()

    // get the number of screens on mount
    let numScreens = $state.raw()
    python.liaison.send("app", {
        command: "run",
        args: [
            "psychopy.hardware:DeviceManager.getScreenCount"
        ]
    }).then(
        resp => numScreens = resp
    )


    async function validateScreen(param, valid) {
        // check that screen number is within number of screens on this system
        if (parseInt(param.val) > numScreens) {
            valid.warning = translate(
                "Could only detect {numScreens} screen(s), so will display on screen {target}"
            ).replaceAll("{numScreens}", numScreens).replaceAll("{target}", parseInt(param.val) % numScreens + 1)
        }
    }
</script>

<SingleLineCtrl
    bind:param={param}
    disabled={disabled}
    {@attach element => param.registerValidator("screen", validateScreen, 5)}
    {...attachments}
/>

<Button
    icon="/icons/btn-monitors.svg"
    tooltip={translate("Show screen numbers")}
    onclick={evt => python.liaison.send("app", {
        command: "run",
        args: [
            "psychopy.hardware:DeviceManager.showScreenNumbers"
        ]
    })}
    small
/>
