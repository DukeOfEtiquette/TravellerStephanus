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

	function addCareer() {
		if (!character) return;
		characters.update(character.id, {
			careers: [...character.careers, { name: '', terms: 1, rank: 0 }]
		});
	}

	function updateCareer(index: number, field: string, value: string | number) {
		if (!character) return;
		const updated = character.careers.map((c, i) =>
			i === index ? { ...c, [field]: value } : c
		);
		characters.update(character.id, { careers: updated });
	}

	function removeCareer(index: number) {
		if (!character) return;
		characters.update(character.id, {
			careers: character.careers.filter((_, i) => i !== index)
		});
	}

	function addExpertise() {
		if (!character) return;
		characters.update(character.id, {
			expertise: [...character.expertise, { name: '', rank: 1 }]
		});
	}

	function updateExpertise(index: number, field: string, value: string | number) {
		if (!character) return;
		const updated = character.expertise.map((e, i) =>
			i === index ? { ...e, [field]: value } : e
		);
		characters.update(character.id, { expertise: updated });
	}

	function removeExpertise(index: number) {
		if (!character) return;
		characters.update(character.id, {
			expertise: character.expertise.filter((_, i) => i !== index)
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

			<!-- Careers -->
			<section>
				<div class="flex items-center justify-between mb-3">
					<h2 class="text-lg font-semibold text-amber-400">Careers</h2>
					<button
						onclick={addCareer}
						class="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
					>
						Add Career
					</button>
				</div>
				{#if character.careers.length === 0}
					<p class="text-gray-500 text-sm">No careers added yet.</p>
				{:else}
					<div class="space-y-3">
						{#each character.careers as career, index}
							<div class="flex items-center gap-3 bg-gray-700/50 p-3 rounded">
								<div class="flex-1">
									<label class="block text-xs text-gray-400 mb-1">Career</label>
									<select
										value={career.name}
										onchange={(e) => updateCareer(index, 'name', e.currentTarget.value)}
										class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
									>
										<option value="">Select...</option>
										<option value="Military">Military</option>
										<option value="Mercantile">Mercantile</option>
										<option value="Frontier">Frontier</option>
										<option value="Noble">Noble</option>
										<option value="Drifter">Drifter</option>
										<option value="Psion">Psion</option>
									</select>
								</div>
								<div class="w-20">
									<label class="block text-xs text-gray-400 mb-1">Terms</label>
									<input
										type="number"
										min="1"
										value={career.terms}
										onchange={(e) => updateCareer(index, 'terms', parseInt(e.currentTarget.value, 10) || 1)}
										class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm text-center"
									/>
								</div>
								<div class="w-20">
									<label class="block text-xs text-gray-400 mb-1">Rank</label>
									<input
										type="number"
										min="0"
										value={career.rank}
										onchange={(e) => updateCareer(index, 'rank', parseInt(e.currentTarget.value, 10) || 0)}
										class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm text-center"
									/>
								</div>
								<button
									onclick={() => removeCareer(index)}
									class="text-red-400 hover:text-red-300 p-1 mt-4"
									title="Remove career"
								>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
										<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
									</svg>
								</button>
							</div>
						{/each}
					</div>
				{/if}
			</section>

			<!-- Expertise -->
			<section>
				<div class="flex items-center justify-between mb-3">
					<h2 class="text-lg font-semibold text-amber-400">Expertise</h2>
					<button
						onclick={addExpertise}
						class="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
					>
						Add Skill
					</button>
				</div>
				{#if character.expertise.length === 0}
					<p class="text-gray-500 text-sm">No skills added yet.</p>
				{:else}
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
						{#each character.expertise as skill, index}
							<div class="flex items-center gap-3 bg-gray-700/50 p-3 rounded">
								<div class="flex-1">
									<label class="block text-xs text-gray-400 mb-1">Skill</label>
									<input
										type="text"
										value={skill.name}
										onchange={(e) => updateExpertise(index, 'name', e.currentTarget.value)}
										placeholder="Skill name"
										class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
									/>
								</div>
								<div class="w-16">
									<label class="block text-xs text-gray-400 mb-1">Rank</label>
									<input
										type="number"
										min="1"
										value={skill.rank}
										onchange={(e) => updateExpertise(index, 'rank', parseInt(e.currentTarget.value, 10) || 1)}
										class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm text-center"
									/>
								</div>
								<button
									onclick={() => removeExpertise(index)}
									class="text-red-400 hover:text-red-300 p-1 mt-4"
									title="Remove skill"
								>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
										<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
									</svg>
								</button>
							</div>
						{/each}
					</div>
				{/if}
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
