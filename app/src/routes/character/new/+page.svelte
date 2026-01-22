<script lang="ts">
	import { goto } from '$app/navigation';
	import { characters } from '$lib/stores/characters';
	import { createEmptyCharacter } from '$lib/types';

	function handleCreate() {
		const newCharacter = createEmptyCharacter();
		characters.add(newCharacter);
		goto(`/character/${newCharacter.id}`);
	}
</script>

<div class="space-y-6">
	<h1 class="text-2xl font-bold text-amber-400">New Character</h1>

	<div class="bg-gray-800 rounded-lg p-6">
		<p class="text-gray-300 mb-4">
			Create a new character sheet to track your Traveller Stephanus character.
		</p>
		<button
			onclick={handleCreate}
			class="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded"
		>
			Create Character
		</button>
	</div>
</div>
