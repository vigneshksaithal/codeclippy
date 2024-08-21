<script lang="ts">
import MetaTags from '$lib/MetaTags.svelte'
import { HighlightAuto } from 'svelte-highlight'
import atomOneLight from 'svelte-highlight/styles/atom-one-light'
import type { PageData } from './$types'

export let data: PageData
const { title, code } = data

let copyButtonText = 'Copy'

const copyToClipboard = async () => {
	try {
		await navigator.clipboard.writeText(code)
		copyButtonText = 'Copied!'
		setTimeout(() => {
			copyButtonText = 'Copy'
		}, 2000)
	} catch (err) {
		console.error('Failed to copy: ', err)
		copyButtonText = 'Failed'
	}
}
</script>

<!-- Import Atom One Light theme -->
<svelte:head>
	{@html atomOneLight}
</svelte:head>

<MetaTags {title} />

<article style="max-width: 720px; margin: 1.6em auto;">
	<header>
		<h5 style="margin-bottom: 0;">{title}</h5>
	</header>
	<div class="code-container">
		<HighlightAuto id="code" {code} />
		<button class="secondary copy-button" on:click={copyToClipboard}
			>{copyButtonText}</button
		>
	</div>
</article>

<p style="text-align: center;">
	<small>
		This code was saved on <a href="https://highlight.ing/apps/codeclippy"
			>CodeClippy</a
		>
		on <a href="https://highlight.ing">Highlight</a>.
	</small>
</p>

<style>
:global(#code) {
	font-size: 0.8rem;
}

.code-container {
	position: relative;
}

.copy-button {
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	padding: 4px 10px;
	font-size: 0.75rem;
}
</style>
