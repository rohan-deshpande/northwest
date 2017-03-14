/**
 * Wrapper class for node & nwjs functionality.
 *
 */
export default class Nw {

    /**
     * Gets the global nw object if it exists.
     *
     * @return {object|null}
     */
    get nw() {
        return (window && window.nw) ? window.nw : null;
    }

    /**
     * Gets the require method if it exists.
     *
     * @return {function|null}
     */
    get require() {
        return (window && window.require) ? window.require : null;
    }

    /**
     * Gets the nw gui if it exists.
     *
     * @return {object|null}
     */
    get gui() {
        return (this.require) ? this.require('nw.gui') : null;
    }

    /**
     * Gets the nw gui window if it exists.
     *
     * @return {object|null}
     */
    get win() {
        return (this.gui) ? this.gui.Window.get() : null;
    }

    /**
     * Gets the node path object if it exists.
     *
     * @return {object|null}
     */
    get path() {
        return (this.require) ? this.require('path') : null;
    }

    /**
     * Gets the node file system object if it exists.
     *
     * @return {object|null}
     */
    get fs() {
        return (this.require) ? this.require('fs') : null;
    }

    /**
     * Gets the node env if it exists.
     *
     * @return {string|null}
     */
    get env() {
        return (process && process.env) ? process.env.NODE_ENV : null;
    }

    /**
     * Catches errors and logs them to the console instead of exiting the program.
     *
     * @return void
     */
    catch() {
        process.on('uncaughtException', err => if (err) console.log(err));
    }
}
