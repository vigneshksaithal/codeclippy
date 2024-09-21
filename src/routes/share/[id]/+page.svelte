<script lang="ts">
import MetaTags from '$lib/MetaTags.svelte'
import { onMount } from 'svelte'
import atomOneDark from 'svelte-highlight/styles/atom-one-dark'
import { fade } from 'svelte/transition'
import type { PageData } from './$types'
import CodeCard from './CodeCard.svelte'
import Footer from './Footer.svelte'

export let data: PageData
const { title, code, url } = data

let isPageLoaded = false

onMount(() => {
	isPageLoaded = true
})
</script>

<MetaTags {title} {url} />

<svelte:head>
	{@html atomOneDark}
</svelte:head>

{#if isPageLoaded}
	<div class="max-w-3xl mx-auto p-4 md:p-8 w-full" in:fade={{ duration: 250 }}>
		<CodeCard {title} {code} />
		<Footer />
	</div>
{/if}
