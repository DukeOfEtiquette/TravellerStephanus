<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { characters } from '$lib/stores/characters';
	import type { Character } from '$lib/types';

	let character = $derived($characters.find((c) => c.id === $page.params.id));

	function handleUpdate<K extends keyof Character>(field: K, value: Character[K]) {
		if (!character) return;
		characters.update(character.id, { [field]: value });
	}

	function handleAttributeChange(attr: string, value: string) {
		if (!character) return;
		const numValue = parseInt(value, 10) || 0;
		characters.update(character.id, {
			attributes: { ...character.attributes, [attr]: numValue }
		});
	}

	function handleBackgroundChange(field: string, value: string | number) {
		if (!character) return;
		characters.update(character.id, {
			background: { ...character.background, [field]: value }
		});
	}

	function handleHitProtectionChange(field: string, value: string | number) {
		if (!character) return;
		characters.update(character.id, {
			hitProtection: { ...character.hitProtection, [field]: value }
		});
	}

	function handleEquipmentChange(field: string, value: string[] | number) {
		if (!character) return;
		characters.update(character.id, {
			equipment: { ...character.equipment, [field]: value }
		});
	}
</script>

{#if !character}
	<div class="bg-gray-800 rounded-lg p-8 text-center">
		<p class="text-gray-400 mb-4">Character not found.</p>
		<a href="/" class="text-amber-400 hover:text-amber-300">Back to Characters</a>
	</div>
{:else}
	<div class="space-y-6">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-bold text-amber-400">
				{character.name || 'Unnamed Character'}
			</h1>
			<a href="/" class="text-gray-400 hover:text-white">Back to List</a>
		</div>

		<div class="bg-gray-800 rounded-lg p-6 space-y-6">
			<!-- Basic Info -->
			<section>
				<h2 class="text-lg font-semibold text-amber-400 mb-3">Basic Info</h2>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm text-gray-400 mb-1">Name</label>
						<input
							type="text"
							value={character.name}
							onchange={(e) => handleUpdate('name', e.currentTarget.value)}
							class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
						/>
					</div>
					<div>
						<label class="block text-sm text-gray-400 mb-1">Age</label>
						<input
							type="number"
							value={character.background.age}
							onchange={(e) => handleBackgroundChange('age', parseInt(e.currentTarget.value, 10) || 18)}
							class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
						/>
					</div>
					<div>
						<label class="block text-sm text-gray-400 mb-1">Homeworld</label>
						<select
							value={character.background.homeworld}
							onchange={(e) => handleBackgroundChange('homeworld', e.currentTarget.value)}
							class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
						>
							<option value="">Select...</option>
							<option value="Agricultural">Agricultural</option>
							<option value="Fringe">Fringe</option>
							<option value="Spacer">Spacer</option>
							<option value="Industrial">Industrial</option>
							<option value="High Culture">High Culture</option>
						</select>
					</div>
					<div>
						<label class="block text-sm text-gray-400 mb-1">Schooling</label>
						<select
							value={character.background.schooling}
							onchange={(e) => handleBackgroundChange('schooling', e.currentTarget.value)}
							class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
						>
							<option value="">Select...</option>
							<option value="The Streets">The Streets</option>
							<option value="Apprenticeship">Apprenticeship</option>
							<option value="Military Academy">Military Academy</option>
							<option value="University">University</option>
							<option value="Finishing School">Finishing School</option>
						</select>
					</div>
				</div>
			</section>

			<!-- Attributes -->
			<section>
				<h2 class="text-lg font-semibold text-amber-400 mb-3">Attributes</h2>
				<div class="grid grid-cols-3 sm:grid-cols-6 gap-4">
					{#each ['STR', 'DEX', 'END', 'INT', 'EDU', 'SOC'] as attr}
						<div>
							<label class="block text-sm text-gray-400 mb-1 text-center">{attr}</label>
							<input
								type="number"
								min="2"
								max="12"
								value={character.attributes[attr as keyof typeof character.attributes]}
								onchange={(e) => handleAttributeChange(attr, e.currentTarget.value)}
								class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-center"
							/>
						</div>
					{/each}
				</div>
				{#if character.attributes.PSI !== undefined}
					<div class="mt-4 w-24">
						<label class="block text-sm text-gray-400 mb-1 text-center">PSI</label>
						<input
							type="number"
							min="0"
							max="12"
							value={character.attributes.PSI}
							onchange={(e) => handleAttributeChange('PSI', e.currentTarget.value)}
							class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-center"
						/>
					</div>
				{/if}
			</section>

			<!-- Hit Protection -->
			<section>
				<h2 class="text-lg font-semibold text-amber-400 mb-3">Hit Protection</h2>
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
					<div>
						<label class="block text-sm text-gray-400 mb-1">Total</label>
						<input
							type="number"
							value={character.hitProtection.total}
							onchange={(e) => handleHitProtectionChange('total', parseInt(e.currentTarget.value, 10) || 0)}
							class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
						/>
					</div>
					<div>
						<label class="block text-sm text-gray-400 mb-1">Current</label>
						<input
							type="number"
							value={character.hitProtection.current}
							onchange={(e) => handleHitProtectionChange('current', parseInt(e.currentTarget.value, 10) || 0)}
							class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
						/>
					</div>
					<div>
						<label class="block text-sm text-gray-400 mb-1">Bloodied</label>
						<input
							type="number"
							value={character.hitProtection.bloodied}
							onchange={(e) => handleHitProtectionChange('bloodied', parseInt(e.currentTarget.value, 10) || 0)}
							class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
						/>
					</div>
					<div>
						<label class="block text-sm text-gray-400 mb-1">Armor</label>
						<input
							type="text"
							value={character.hitProtection.armor}
							onchange={(e) => handleHitProtectionChange('armor', e.currentTarget.value)}
							class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
						/>
					</div>
				</div>
			</section>

			<!-- Equipment -->
			<section>
				<h2 class="text-lg font-semibold text-amber-400 mb-3">Equipment</h2>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm text-gray-400 mb-1">Cash (Cr)</label>
						<input
							type="number"
							value={character.equipment.cash}
							onchange={(e) => handleEquipmentChange('cash', parseInt(e.currentTarget.value, 10) || 0)}
							class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
						/>
					</div>
					<div>
						<label class="block text-sm text-gray-400 mb-1">Weekly Stipend (Cr)</label>
						<input
							type="number"
							value={character.equipment.stipend}
							onchange={(e) => handleEquipmentChange('stipend', parseInt(e.currentTarget.value, 10) || 0)}
							class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
						/>
					</div>
				</div>
				<div class="mt-4">
					<label class="block text-sm text-gray-400 mb-1">Weapons (one per line)</label>
					<textarea
						value={character.equipment.weapons.join('\n')}
						onchange={(e) => handleEquipmentChange('weapons', e.currentTarget.value.split('\n').filter(Boolean))}
						class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-20"
					></textarea>
				</div>
				<div class="mt-4">
					<label class="block text-sm text-gray-400 mb-1">Gear (one per line)</label>
					<textarea
						value={character.equipment.gear.join('\n')}
						onchange={(e) => handleEquipmentChange('gear', e.currentTarget.value.split('\n').filter(Boolean))}
						class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-20"
					></textarea>
				</div>
				<div class="mt-4">
					<label class="block text-sm text-gray-400 mb-1">Vehicles (one per line)</label>
					<textarea
						value={character.equipment.vehicles.join('\n')}
						onchange={(e) => handleEquipmentChange('vehicles', e.currentTarget.value.split('\n').filter(Boolean))}
						class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-20"
					></textarea>
				</div>
			</section>

			<!-- Notes -->
			<section>
				<h2 class="text-lg font-semibold text-amber-400 mb-3">Notes</h2>
				<textarea
					value={character.notes}
					onchange={(e) => handleUpdate('notes', e.currentTarget.value)}
					class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-32"
					placeholder="Character notes, backstory, etc."
				></textarea>
			</section>
		</div>
	</div>
{/if}
