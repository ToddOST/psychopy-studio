import path from "path-browserify";
import { browseFileOpen, browseFileSave, parsePath } from "$lib/utils/files.js";
import { showDevTools, focusNextPanel, openIn, showBuilder, showCoder, showRunner } from "$lib/utils/views.svelte"
import { Experiment } from "$lib/experiment";
import { Script } from "$lib/experiment/script.svelte";
import { electron } from "$lib/globals.svelte";
import { current } from './globals.svelte.js';
import { translate } from "$lib/translation";
import { Callback } from "$lib/utils/shortcuts";
import { resetPrefs, openUserFolder, reinstallPython, gotoHomepage, gotoDocumentation, gotoForum } from "$lib/utils/callbacks.js"


async function addFile(file, pilotMode=undefined) {
    let item
    // parse file if needed
    if (typeof file === "string") {
        file = parsePath(file)
    }
    // if file is already present, just select it
    if (current.runlist.some(
        item => item.file.file === file.file
    )) {
        current.selection = current.runlist.findIndex(
            item => item.file.file === file.file
        )
        return
    }
    // if given a .psyrun, add all files contained
    if (file.ext === ".psyrun") {
        for (let subfile of await loadPsyrun(file)) {
            addFile(subfile.file, subfile.pilotMode)
        }
        return
    }
    // if given a .psyexp, load as an experiment
    if (file.ext === ".psyexp") {
        item = new Experiment("untitled.psyexp")
        await item.fromFile(file)
    }
    // if given a .py, load as a script
    if (file.ext === ".py") {
        item = new Script(file)
    }
    // quit if filetype isn't allowed
    if (!item) {
        return
    }
    // override pilot mode if requested
    if (pilotMode !== undefined) {
        item.pilotMode = pilotMode
    }
    // add to run list
    current.runlist.push(item)
    // select
    current.selection = current.runlist.length
}

async function loadPsyrun(file) {
    // load JSON file
    let content = await electron.files.load(file.file)
    // convert paths to file objects with details
    let output = []
    for (let item of JSON.parse(content)) {
        output.push({
            file: parsePath(
                path.join(item.path, item.file)
            ),
            pilotMode: item.pilotMode
        })
    }
    
    return output
}

function fileNew() {
    // clear current files
    current.runlist.length = 0
    // clear current file info
    current.file = undefined
}

/**
 * Open a file browser to get files.
 * 
 * @param {object} current Current Runner setup (from getContext)
 * @param {boolean} replace If true, then replace existing files with ones selected
 */
async function fileOpen(replace=false) {
    // work out allowed files
    let allowedFiles
    if (replace) {
        allowedFiles = [
            // only psyrun if we're replacing
            { description: translate("PsychoPy Runner Configurations"), accept: {"application/x-python-code": [".psyrun"]} }
        ]
    } else {
        // psyexp, py and psyrun if we're adding
        allowedFiles = [
            { description: translate("PsychoPy Experiments"), accept: {"application/xml": [".psyexp"]} },
            { description: translate("Python Scripts"), accept: {"application/x-python-code": [".py"]} },
            { description: translate("PsychoPy Runner Configurations"), accept: {"application/x-python-code": [".psyrun"]} }
        ]
    }
    // open file browser
    let file = await browseFileOpen(
        allowedFiles,
        ""
    )
    // abort if no file
    if (file === undefined) {
        return
    }
    // if replacing, clear existing files
    if (replace) {
        fileNew()
        current.file = file
    }
    // add file(s)
    await addFile(file)
}

/**
 * Open a .psyrun file, replacing the current configuration
 */
async function openConfiguration() {
    return fileOpen(true).catch(err => console.error(err))
}

async function fileSave() {
    // diverge here based on whether there is a current file...
    if (current.file) {
        // construct serializable object
        let output = current.runlist.map(
            item => $state.snapshot({
                path: item.file.parent,
                file: item.file.name, 
                runMode: item.file.pilotMode ? "pilot" : "run"
            })
        )
        // stringify
        output = JSON.stringify(output, undefined, 4)
        // write file
        if (electron) {
            await electron.files.save(
                $state.snapshot(current.file.file), 
                output
            )
        } else {
            // get file writable from handle
            let file = await current.file.handle.createWritable();
            // write to file
            file.seek(0);
            file.write(output);
            file.close();
        }
    } else {
        return fileSaveAs()
    }
}

async function fileSaveAs() {
    // open file browser
    let file = await browseFileSave(
        [
            { description: translate("PsychoPy Runner Configurations"), accept: {"application/xml": [".psyrun"]} }
        ],
        current.file?.file || "untitled.psyrun"
    )
    // abort if no file
    if (file === undefined) {
        return
    }
    // set file
    current.file = file
    // save
    await fileSave()

    return current.file
}

function quit() {
    if (electron) {
        electron.quit()
    }
}

function togglePiloting() {
    if (current.runlist[current.selection]) {
        current.runlist[current.selection].pilotMode = !current.runlist[current.selection]?.pilotMode
    }
}

/**
 * Open the selected file in Builder (if it's a .psyexp) or Coder (otherwise)
 */
function openSelection() {
    let file = current.runlist[current.selection]?.file
    return openIn(
        file?.file,
        file?.ext === ".psyexp" ? "builder" : "coder"
    )
}

function runPython() {
    current.awaiting.runpy = current.runlist[current.selection]?.runPython()

    return current.awaiting.runpy
}

function stopPython() {
    return current.runlist[current.selection]?.stopPython()
}

function runJS() {
    current.awaiting.runjs = current.runlist[current.selection]?.runJS()

    return current.awaiting.runjs
}


export default {
    new: new Callback(fileNew, undefined, "new"),
    open: new Callback(fileOpen, undefined, "open"),
    save: new Callback(fileSave, undefined, "save"),
    saveAs: new Callback(fileSaveAs, undefined, "saveAs"),
    close: new Callback(close, undefined, "close"),
    quit: new Callback(quit, undefined, "quit"),
    togglePiloting: new Callback(
        togglePiloting,
        () => current.selection === undefined,
        "togglePiloting"
    ),
    openSelection: new Callback(
        openSelection,
        () => !current.runlist[current.selection]
    ),
    runPython: new Callback(
        runPython,
        () => current.selection === undefined,
        "runPython"
    ),
    stopPython: new Callback(stopPython, undefined, "stopPython"),
    runJS: new Callback(
        runJS,
        () => current.selection === undefined || !(current.runlist[current.selection] instanceof Experiment),
        "runJS"
    ),
    showDevTools: new Callback(showDevTools, undefined, "showDevTools"),
    focusNextPanel: new Callback(focusNextPanel, undefined, "focusNextPanel"),
    addFile: new Callback(addFile),
    showBuilder: new Callback(showBuilder),
    showCoder: new Callback(showCoder),
    resetPrefs: new Callback(resetPrefs),
    openUserFolder: new Callback(openUserFolder),
    reinstallPython: new Callback(reinstallPython),
    gotoHomepage: new Callback(gotoHomepage),
    gotoDocumentation: new Callback(gotoDocumentation),
    gotoForum: new Callback(gotoForum),
    showRunner: new Callback(showRunner),
    openConfiguration: new Callback(openConfiguration)
}
