const Store = (() => {
    const hash = new Map();
    const get = (id) => {
        return hash.get(id);
    };
    const set = (id, payload) => {
        hash.set(id, payload);
    };
    return {
        get,
        set,
    };
})();
Object.freeze(Store);
export default Store;
//# sourceMappingURL=Store.js.map