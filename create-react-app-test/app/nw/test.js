const TEST = "test";
const NW_GUI = (window.require) ? window.require('nw.gui') : null;
const NW_WIN = (NW_GUI) ? NW_GUI.Window.get() : null;

export { TEST, NW_GUI, NW_WIN };
