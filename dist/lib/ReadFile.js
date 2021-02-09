export default (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsArrayBuffer(file);
    });
};
//# sourceMappingURL=ReadFile.js.map