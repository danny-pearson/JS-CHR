import createStateMachine from '../lib/StateMachine.js';
import Store from '../lib/Store.js';
import { bitString } from '../utils/helpers.js';

import LoadFile from './LoadFile.js';

enum CoreStates {
  INITIAL = 'Inital',
  LOADING_FILE = 'LoadingFile',
  PARSING_FILE = 'ParsingFile',
  OPENING_EDITOR = 'OpeningEditor',
}

enum CoreEvents {
  LOAD_FILE = 'LOAD_FILE',
  FILE_LOADED = 'FILE_LOADED',
  FILE_PARSED = 'FILE_PARSED',
  EDITOR_LOADED = 'EDITOR_LOADED',
}

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
    onLoadFile(state: string, file: File): void {
      this.enterSubstate(state, file);
    },

    onFileLoaded(): void {
      const byteArr = this.store.get('origin-file:UInt8Array');
      const bitStringArr = [...byteArr].map(bitString);

      console.log('byteArr', byteArr);
      console.log('bitStringArr', bitStringArr);

      this.store.set('origin-file:BitStringArray', bitStringArr);
    },
  }
});

export default CoreMachine;
