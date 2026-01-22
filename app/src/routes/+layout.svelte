<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Traveller Stephanus</title>
</svelte:head>

<div class="min-h-screen bg-gray-900 text-gray-100">
	<nav class="bg-gray-800 border-b border-gray-700">
		<div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
			<a href="/" class="text-xl font-bold text-amber-400 hover:text-amber-300">
				Traveller Stephanus
			</a>
			<div class="flex gap-4">
				<a href="/" class="text-gray-300 hover:text-white">Characters</a>
				<a href="/character/new" class="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1 rounded">
					New Character
				</a>
			</div>
		</div>
	</nav>

	<main class="max-w-4xl mx-auto px-4 py-6">
		{@render children()}
	</main>
</div>
