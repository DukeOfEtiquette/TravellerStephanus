import { writable } from 'svelte/store';
import type { Character } from '$lib/types';
import { browser } from '$app/environment';

const STORAGE_KEY = 'traveller-characters';

function loadFromStorage(): Character[] {
	if (!browser) return [];
	const stored = localStorage.getItem(STORAGE_KEY);
	if (!stored) return [];
	try {
		return JSON.parse(stored);
	} catch {
		return [];
	}
}

function saveToStorage(characters: Character[]) {
	if (!browser) return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
}

function createCharactersStore() {
	const { subscribe, set, update } = writable<Character[]>(loadFromStorage());

	// Auto-save on changes
	subscribe((characters) => {
		saveToStorage(characters);
	});

	return {
		subscribe,
		add: (character: Character) => {
			update((characters) => [...characters, character]);
		},
		update: (id: string, updates: Partial<Character>) => {
			update((characters) =>
				characters.map((c) => (c.id === id ? { ...c, ...updates } : c))
			);
		},
		remove: (id: string) => {
			update((characters) => characters.filter((c) => c.id !== id));
		},
		getById: (id: string): Character | undefined => {
			let result: Character | undefined;
			subscribe((characters) => {
				result = characters.find((c) => c.id === id);
			})();
			return result;
		},
		exportAll: (): string => {
			let data = '';
			subscribe((characters) => {
				data = JSON.stringify(characters, null, 2);
			})();
			return data;
		},
		importAll: (json: string) => {
			try {
				const characters = JSON.parse(json);
				if (Array.isArray(characters)) {
					set(characters);
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

export const characters = createCharactersStore();
