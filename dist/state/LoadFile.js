import createStateMachine from '../lib/StateMachine.js';
import readFile from '../lib/ReadFile.js';
import Store from '../lib/Store.js';
var LoadingStates;
(function (LoadingStates) {
    LoadingStates["LOADING_FILE"] = "LoadingFile";
    LoadingStates["LOADING_ERROR"] = "LoadingError";
    LoadingStates["LOADING_SUCCESS"] = "LoadingSuccess";
})(LoadingStates || (LoadingStates = {}));
var LoadingEvents;
(function (LoadingEvents) {
    LoadingEvents["ERROR"] = "ERROR";
    LoadingEvents["SUCCESS"] = "SUCCESS";
})(LoadingEvents || (LoadingEvents = {}));
const LoadingMachine = createStateMachine({
    store: Store,
    initial: LoadingStates.LOADING_FILE,
    transitions: [
        {
            from: LoadingStates.LOADING_FILE,
            to: LoadingStates.LOADING_ERROR,
            action: LoadingEvents.ERROR,
        },
        {
            from: LoadingStates.LOADING_FILE,
            to: LoadingStates.LOADING_SUCCESS,
            action: LoadingEvents.SUCCESS,
        }
    ],
    handlers: {
        async onEnter(_, file) {
            try {
                const buffer = await readFile(file);
                this.dispatch('SUCCESS', buffer);
            }
            catch (err) {
                this.dispatch('ERROR', {
                    message: 'Could not read file'
                });
            }
        },
        onSuccess(_, payload) {
            this.store.set('origin-file:UInt8Array', new Uint8Array(payload));
            this.exitSubstate();
        },
        onError(state, payload) {
            console.log(state, payload);
        },
    }
});
export default LoadingMachine;
//# sourceMappingURL=LoadFile.js.map