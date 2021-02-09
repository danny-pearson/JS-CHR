import createStateMachine from '../lib/StateMachine.js';
import readFile from '../lib/ReadFile.js';
import Store from '../lib/Store.js';

enum LoadingStates {
  LOADING_FILE = 'LoadingFile',
  LOADING_ERROR = 'LoadingError',
  LOADING_SUCCESS = 'LoadingSuccess',
}

enum LoadingEvents {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

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
    async onEnter(_, file: File): Promise<void> {
      try {
        const buffer = await readFile(file);

        this.dispatch('SUCCESS', buffer)
      } catch (err) {
        this.dispatch('ERROR', {
          message: 'Could not read file'
        });
      }
    },
  
    onSuccess(_, payload: any): void {
      this.store.set('origin-file:UInt8Array', new Uint8Array(payload));
      this.exitSubstate();
    },

    onError(state: string, payload: any) {
      console.log(state, payload);
    },
  }
});

export default LoadingMachine;
