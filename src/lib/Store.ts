const Store = (() => {
  const hash = new Map();

  const get = (id: string): unknown => {
    return hash.get(id);
  }

  const set = (id: string, payload: unknown): void => {
    hash.set(id, payload);
  }

  return {
    get,
    set,
  }
})();

Object.freeze(Store);

export default Store;
