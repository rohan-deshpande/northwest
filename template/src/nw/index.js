const NW = (window.nw) ? window.nw : null;
const NW_GUI = (window.require) ? window.require('nw.gui') : null;
const NW_WIN = (NW_GUI) ? NW_GUI.Window.get() : null;
const NW_PATH = (window.require) ? window.require('path') : null;
const NW_FS = (window.require) ? window.require('fs-extra') : null;
const NW_ENV = process.env.NODE_ENV;
const NW_CATCH = () => {
    process.on('uncaughtException', (err) => {
        if (err) console.log(err);
    });
}

export default {
    nw: NW,
    gui: NW_GUI,
    win: NW_WIN,
    path: NW_PATH,
    fs: NW_FS,
    catch: NW_CATCH,
    env: NW_ENV,
};
