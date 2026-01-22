export interface Character {
	id: string;
	name: string;
	attributes: {
		STR: number;
		DEX: number;
		END: number;
		INT: number;
		EDU: number;
		SOC: number;
		PSI?: number;
	};
	hitProtection: {
		total: number;
		current: number;
		bloodied: number;
		armor: string;
	};
	background: {
		age: number;
		homeworld: Homeworld | '';
		schooling: Schooling | '';
	};
	careers: Career[];
	expertise: Expertise[];
	equipment: {
		weapons: string[];
		gear: string[];
		vehicles: string[];
		cash: number;
		stipend: number;
	};
	notes: string;
}

export type Homeworld =
	| 'Agricultural'
	| 'Fringe'
	| 'Spacer'
	| 'Industrial'
	| 'High Culture';

export type Schooling =
	| 'The Streets'
	| 'Apprenticeship'
	| 'Military Academy'
	| 'University'
	| 'Finishing School';

export type CareerName =
	| 'Military'
	| 'Mercantile'
	| 'Frontier'
	| 'Noble'
	| 'Drifter'
	| 'Psion';

export interface Career {
	name: CareerName | '';
	terms: number;
	rank: number;
}

export interface Expertise {
	name: string;
	rank: number;
}

function generateId(): string {
	if (typeof crypto !== 'undefined' && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	// Fallback for environments without crypto.randomUUID
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

export function createEmptyCharacter(): Character {
	return {
		id: generateId(),
		name: '',
		attributes: {
			STR: 7,
			DEX: 7,
			END: 7,
			INT: 7,
			EDU: 7,
			SOC: 7
		},
		hitProtection: {
			total: 21,
			current: 21,
			bloodied: 14,
			armor: ''
		},
		background: {
			age: 18,
			homeworld: '',
			schooling: ''
		},
		careers: [],
		expertise: [],
		equipment: {
			weapons: [],
			gear: [],
			vehicles: [],
			cash: 0,
			stipend: 0
		},
		notes: ''
	};
}
