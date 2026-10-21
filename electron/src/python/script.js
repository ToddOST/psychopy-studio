import { randomUUID } from "node:crypto";
import { output } from "./utils.js";
import { Liaison } from "./liaison.js";
import proc from "child_process";
import path from "path";


export class PythonScript {
    constructor(venv, file, args) {
        // store venv
        this.venv = venv
        // store file and args
        this.file = file
        this.args = args
        // unique id to refer to this script by
        this.id = randomUUID()
        // populated upon start
        this.process = undefined
        this.finished = undefined
    }

    /**
     * Start running this script, without waiting for it to finish.
     *
     * @returns {string} ID of this script, which can be used to wait for or stop it
     */
    start() {
        // setup promise to track progress
        this.finished = Promise.withResolvers()
        // split file into name and dir
        let folder = path.dirname(this.file)
        let file = path.basename(this.file)
        // execute asynchronously
        this.process = proc.spawn(
            this.venv.executable,
            ["-u", file, ...this.args],
            {
                cwd: folder, 
                env: { 
                    ...process.env,
                    // give the script the addresses of all running Liaisons (comma-separated) so it can connect
                    LIAISON_ADDRESS: [...Liaison.addresses].join(",")
                }
            }
        )
        // pass output to front end
        this.process.stdout.on("data", evt => output("stdout", evt))
        this.process.stderr.on("data", evt => output("stderr", evt))
        // await completion/error
        this.process.on("exit", (code, signal) => this.finished.resolve([code, signal]))
        this.process.on("error", err => this.finished.reject(err))
        // register with venv so it can be found (and killed on quit)
        this.venv.scripts[this.id] = this
        // deregister once done
        this.finished.promise.finally(() => {
            delete this.venv.scripts[this.id]
        }).catch(() => {})

        return this.id
    }

    /**
     * Wait for this script to finish.
     *
     * @returns {Array} Exit code and signal of the process
     */
    async wait() {
        return await this.finished.promise
    }

    stop() {
        this.process.kill()
    }
}