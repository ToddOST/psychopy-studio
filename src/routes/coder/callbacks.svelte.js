import { electron, python } from '$lib/globals.svelte.js';
import { browseFileOpen, browseFileSave } from "$lib/utils/files.js";
import { openIn, showDevTools, focusNextPanel, showBuilder, showCoder, showRunner } from "$lib/utils/views.svelte"
import { current } from './globals.svelte.js';
import { Script } from "$lib/experiment";
import { translate } from "$lib/translation";
import { Callback } from "$lib/utils/shortcuts";
import { resetPrefs, openUserFolder, reinstallPython, gotoHomepage, gotoDocumentation, gotoForum } from "$lib/utils/callbacks.js"


/* File */

function fileNew() {
    // add new tab with blank file
    current.pages.push(
        new Script({
            file: undefined,
            parent: undefined,
            name: "untitled.py",
            stem: "untitled",
            ext: ".py"
        })
    )
    // focus new tab
    current.tab = $state.snapshot(current.pages.length) - 1
}

async function fileOpen() {
    let file = await browseFileOpen(
        [
            { description: translate("Python Scripts"), accept: {"text/x-python-code": [".py"]} },
            { description: translate("JavaScript Scripts"), accept: {"text/javascript": [".js"]} },
            { description: translate("Data Files"), accept: {"text/csv": [".csv"], "application/json": [".json"]}},
        ],
        current.pages[current.tab]?.file?.parent
    )
    // abort if no file
    if (!file || !file.file) {
        return
    }
    // load from file
    current.openFile(file)
}

async function folderOpen() {
    // get folder path from electron dialog
    let folder = await electron.files.openDialog({
        properties: ["openDirectory"],
        defaultPath: $state.snapshot(current.directory)
    })
    // abort if no file
    if (folder === undefined) {
        return
    }
    // set value
    current.directory = folder[0]

    return folder[0]
}

async function revealFolder() {
    if (electron && current.pages[current.tab].file) {
        electron.files.showItemInFolder(current.pages[current.tab].file.file)
    }
}

async function fileSave() {
    // if no file yet, save as instead
    if (!current.pages[current.tab]?.file?.file) {
        return fileSaveAs()
    }
    // save
    current.pages[current.tab].toFile(current.pages[current.tab].file)    
}

async function fileSaveAs() {
    // open file browser
    let file = await browseFileSave(
        [
            { description: translate("Python Scripts"), accept: {"text/x-python-code": [".py"]} },
            { description: translate("JavaScript Scripts"), accept: {"text/javascript": [".js"]} },
            { description: translate("Data Files"), accept: {"text/csv": [".csv"], "application/json": [".json"]}},
        ],
        current.pages[current.tab]?.file?.file || "untitled.py"
    )
    // abort if no file
    if (file === undefined) {
        return
    }
    // set file
    current.pages[current.tab].file = file
    // save
    await fileSave()
}

function quit() {
    if (electron) {
        electron.quit()
    }
}

/* Edit */

function undo() {
    current.pages[current.tab]?.editor?.getModel()?.undo()
}

function redo() {
    current.pages[current.tab]?.editor?.getModel()?.undo()
}

function find() {
    current.pages[current.tab]?.editor?.trigger(
        "find", 
        "editor.actions.findWithArgs", 
        { 
            searchString: ""
        }
    )
}

/* Experiment */

/* Run */

function togglePiloting() {
    // toggle pilot mode
    if (current.pages[current.tab]) {
        current.pages[current.tab].pilotMode = !current.pages[current.tab].pilotMode
    }
}

function sendToRunner() {
    openIn(current.pages[current.tab]?.file?.file, "runner")
}

async function runPython(version) {
    if (!python) {
        return
    }
    if (current.pages[current.tab]) {
        // save script
        await fileSave()
        // focus stdout
        current.shelltab = "stdout"
        // run script
        await current.pages[current.tab].runPython(version)
    }    

    return true
}

async function stopPython(version) {
    if (!python) {
        return
    }
    if (current.pages[current.tab]) {
        // run script
        await current.pages[current.tab].stopPython(version)
    }    

    return true
}


async function runJS() {
    if (!python) {
        return
    }
    if (current.pages[current.tab]) {
        // run script
        await current.pages[current.tab].runJS(false)
    }  
}


;


export default {
    new: new Callback(fileNew, undefined, "new"),
    open: new Callback(fileOpen, undefined, "open"),
    revealFolder: new Callback(
        revealFolder,
        () => current.pages[current.tab]?.file?.parent === undefined,
        "revealFolder"
    ),
    save: new Callback(
        fileSave,
        () => Object.values(current.pages).length === 0 ||
            (!current.pages[current.tab]?.canUndo && current.pages[current.tab]?.file?.file),
        "save"
    ),
    saveAs: new Callback(
        fileSaveAs,
        () => Object.values(current.pages).length === 0,
        "saveAs"
    ),
    close: new Callback(close, undefined, "close"),
    quit: new Callback(quit, undefined, "quit"),
    undo: new Callback(
        undo,
        () => !current.pages[current.tab]?.canUndo,
        "undo"
    ),
    redo: new Callback(
        redo,
        () => !current.pages[current.tab]?.canRedo,
        "redo"
    ),
    find: new Callback(
        find,
        () => !current.pages[current.tab]?.editor,
        "find"
    ),
    togglePiloting: new Callback(
        togglePiloting,
        () => !current.pages[current.tab],
        "togglePiloting"
    ),
    sendToRunner: new Callback(
        sendToRunner,
        () => !current.pages[current.tab]?.file?.file,
        "sendToRunner"
    ),
    runPython: new Callback(
        runPython,
        () => !current.pages[current.tab]?.file?.file ||
            !current.pages[current.tab]?.file?.parent ||
            current.pages[current.tab]?.file?.ext !== ".py",
        "runPython"
    ),
    stopPython: new Callback(stopPython, undefined, "stopPython"),
    runJS: new Callback(runJS, undefined, "runJS"),
    showDevTools: new Callback(showDevTools, undefined, "showDevTools"),
    focusNextPanel: new Callback(focusNextPanel, undefined, "focusNextPanel"),
    folderOpen: new Callback(folderOpen),
    showBuilder: new Callback(showBuilder),
    showRunner: new Callback(showRunner),
    resetPrefs: new Callback(resetPrefs),
    openUserFolder: new Callback(openUserFolder),
    reinstallPython: new Callback(reinstallPython),
    gotoHomepage: new Callback(gotoHomepage),
    gotoDocumentation: new Callback(gotoDocumentation),
    gotoForum: new Callback(gotoForum),
    showCoder: new Callback(showCoder)
}
