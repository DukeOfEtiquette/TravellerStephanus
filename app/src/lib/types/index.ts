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

export function createEmptyCharacter(): Character {
	return {
		id: crypto.randomUUID(),
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
