import createStateMachine from '../lib/StateMachine.js';
import Store from '../lib/Store.js';
import { bitString } from '../utils/helpers.js';
import LoadFile from './LoadFile.js';
var CoreStates;
(function (CoreStates) {
    CoreStates["INITIAL"] = "Inital";
    CoreStates["LOADING_FILE"] = "LoadingFile";
    CoreStates["PARSING_FILE"] = "ParsingFile";
    CoreStates["OPENING_EDITOR"] = "OpeningEditor";
})(CoreStates || (CoreStates = {}));
var CoreEvents;
(function (CoreEvents) {
    CoreEvents["LOAD_FILE"] = "LOAD_FILE";
    CoreEvents["FILE_LOADED"] = "FILE_LOADED";
    CoreEvents["FILE_PARSED"] = "FILE_PARSED";
    CoreEvents["EDITOR_LOADED"] = "EDITOR_LOADED";
})(CoreEvents || (CoreEvents = {}));
const CoreMachine = createStateMachine({
    store: Store,
    initial: CoreStates.INITIAL,
    substates: [
        LoadFile,
    ],
    transitions: [
        {
            from: CoreStates.INITIAL,
            to: CoreStates.LOADING_FILE,
            action: CoreEvents.LOAD_FILE,
        },
        {
            from: CoreStates.LOADING_FILE,
            to: CoreStates.PARSING_FILE,
            action: CoreEvents.FILE_LOADED,
        }
    ],
    handlers: {
        onLoadFile(state, file) {
            this.enterSubstate(state, file);
        },
        onFileLoaded() {
            const byteArr = this.store.get('origin-file:UInt8Array');
            const bitStringArr = [...byteArr].map(bitString);
            console.log('byteArr', byteArr);
            console.log('bitStringArr', bitStringArr);
            this.store.set('origin-file:BitStringArray', bitStringArr);
        },
    }
});
export default CoreMachine;
//# sourceMappingURL=Core.js.map