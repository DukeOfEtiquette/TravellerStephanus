<script lang="ts">
	import { goto } from '$app/navigation';
	import { characters } from '$lib/stores/characters';
	import { createEmptyCharacter } from '$lib/types';

	let fileInput: HTMLInputElement;

	function createNewCharacter() {
		const newCharacter = createEmptyCharacter();
		characters.add(newCharacter);
		goto(`/character/${newCharacter.id}`);
	}

	function exportCharacters() {
		const data = characters.exportAll();
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'traveller-characters.json';
		a.click();
		URL.revokeObjectURL(url);
	}

	function handleImport(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			const content = e.target?.result as string;
			if (characters.importAll(content)) {
				alert('Characters imported successfully!');
			} else {
				alert('Failed to import characters. Invalid file format.');
			}
		};
		reader.readAsText(file);
		input.value = '';
	}
</script>

<input
	type="file"
	accept=".json"
	bind:this={fileInput}
	onchange={handleImport}
	class="hidden"
/>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-amber-400">Your Characters</h1>
		<div class="flex gap-2">
			<button
				onclick={() => fileInput.click()}
				class="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
			>
				Import
			</button>
			{#if $characters.length > 0}
				<button
					onclick={exportCharacters}
					class="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
				>
					Export
				</button>
			{/if}
		</div>
	</div>

	{#if $characters.length === 0}
		<div class="bg-gray-800 rounded-lg p-8 text-center">
			<p class="text-gray-400 mb-4">No characters yet.</p>
			<button
				onclick={createNewCharacter}
				class="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded"
			>
				Create Your First Character
			</button>
		</div>
	{:else}
		<div class="grid gap-4">
			{#each $characters as character (character.id)}
				<div class="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
					<div>
						<h2 class="text-lg font-semibold text-white">
							{character.name || 'Unnamed Character'}
						</h2>
						<p class="text-sm text-gray-400">
							{#if character.careers.length > 0}
								{character.careers.map((c) => c.name).join(', ')}
							{:else}
								No career
							{/if}
							&bull; Age {character.background.age}
						</p>
					</div>
					<div class="flex gap-2">
						<a
							href="/character/{character.id}"
							class="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
						>
							Edit
						</a>
						<button
							onclick={() => {
								if (confirm('Delete this character?')) {
									characters.remove(character.id);
								}
							}}
							class="bg-red-900 hover:bg-red-800 text-white px-3 py-1 rounded text-sm"
						>
							Delete
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
