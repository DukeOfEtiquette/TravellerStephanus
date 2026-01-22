<script lang="ts">
	import { characters } from '$lib/stores/characters';
</script>

<div class="space-y-6">
	<h1 class="text-2xl font-bold text-amber-400">Your Characters</h1>

	{#if $characters.length === 0}
		<div class="bg-gray-800 rounded-lg p-8 text-center">
			<p class="text-gray-400 mb-4">No characters yet.</p>
			<a
				href="/character/new"
				class="inline-block bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded"
			>
				Create Your First Character
			</a>
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
