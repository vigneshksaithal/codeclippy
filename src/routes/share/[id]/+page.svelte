<script lang="ts">
import { HighlightAuto } from 'svelte-highlight'
import atomOneLight from 'svelte-highlight/styles/atom-one-light'
import type { PageData } from './$types'

export let data: PageData
const { title, code } = data

const copyToClipboard = async () => {
	try {
		await navigator.clipboard.writeText(code)
	} catch (err) {
		console.error('Failed to copy: ', err)
	}
}
</script>

<!-- Import Atom One Light theme -->
<svelte:head>
	{@html atomOneLight}
</svelte:head>

<article style="max-width: 720px; margin: 1.2em auto;">
	<header>
		<h5 style="margin-bottom: 0;">{title}</h5>
	</header>
	<HighlightAuto id="code" {code} />
	<footer style="display: flex; justify-content: end;">
		<button
			class="secondary outline"
			style="padding: 4px 6px; font-size: 0.8rem;"
			on:click={copyToClipboard}>Copy Code</button
		>
	</footer>
</article>

<p style="text-align: center; padding-top: 1em;">
	This code was saved on <a href="https://highlight.ing/apps/codeclippy"
		>CodeClippy</a
	>
	on <a href="https://highlight.ing">Highlight</a>.
</p>

<style>
:global(#code) {
	font-size: 0.8rem;
}
</style>
