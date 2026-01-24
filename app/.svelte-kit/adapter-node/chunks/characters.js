import { w as writable } from "./exports.js";
function loadFromStorage() {
  return [];
}
function createCharactersStore() {
  const { subscribe, set, update } = writable(loadFromStorage());
  subscribe((characters2) => {
  });
  return {
    subscribe,
    add: (character) => {
      update((characters2) => [...characters2, character]);
    },
    update: (id, updates) => {
      update(
        (characters2) => characters2.map((c) => c.id === id ? { ...c, ...updates } : c)
      );
    },
    remove: (id) => {
      update((characters2) => characters2.filter((c) => c.id !== id));
    },
    getById: (id) => {
      let result;
      subscribe((characters2) => {
        result = characters2.find((c) => c.id === id);
      })();
      return result;
    },
    exportAll: () => {
      let data = "";
      subscribe((characters2) => {
        data = JSON.stringify(characters2, null, 2);
      })();
      return data;
    },
    importAll: (json) => {
      try {
        const characters2 = JSON.parse(json);
        if (Array.isArray(characters2)) {
          set(characters2);
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    reset: () => {
      set([]);
    }
  };
}
const characters = createCharactersStore();
export {
  characters as c
};
