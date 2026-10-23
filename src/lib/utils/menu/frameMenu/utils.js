/**
 * Add an entry to a menu template. Intended to be called in `onMount`, with `removeFromTemplate`
 * called in its cleanup.
 *
 * @param {Array<object>} template Menu template to add to (as given by `getContext("template")`)
 * @param {object} entry Electron-friendly menu entry to add, should be a `$state` proxy so that
 * `removeFromTemplate` can find it again later
 */
export function addToTemplate(template, entry) {
    // add entry to template
    template.push(entry)
}

/**
 * Remove an entry from a menu template, if present. Entries are matched by identity, so this will
 * only remove the exact object which was added, even if other entries have the same values.
 *
 * @param {Array<object>} template Menu template to remove from (the same one given to `addToTemplate`)
 * @param {object} entry Menu entry to remove (the same object given to `addToTemplate`)
 */
export function removeFromTemplate(template, entry) {
    // get index
    let i = template.indexOf(entry)
    // remove if present
    if (i > -1) {
        template.splice(i, 1)
    }
}
