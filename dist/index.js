import CoreMachine from './state/Core.js';
const fileUpload = document.querySelector('#fileUpload');
fileUpload.addEventListener('change', (e) => {
    const [file] = e.target.files;
    CoreMachine.dispatch('LOAD_FILE', file);
});
//# sourceMappingURL=index.js.map