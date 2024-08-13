<script lang="ts">
import { page } from "$app/stores"
import { onMount } from "svelte"
import { HighlightAuto } from "svelte-highlight"
import atomOneLight from "svelte-highlight/styles/atom-one-light"

let code = ""
let language = ""
let loading = true
let error = ""

onMount(async () => {
	try {
		const response = await fetch(`/api/share?id=${$page.params.id}`)
		if (response.ok) {
			const data = await response.json()
			code = data.code
			language = data.language
		} else {
			error = "Failed to load shared code"
		}
	} catch (e) {
		error = "An error occurred while fetching the code"
	} finally {
		loading = false
	}
})
</script>

<svelte:head>
  {@html atomOneLight}
</svelte:head>

<main>
  <h1>Shared Code</h1>
  {#if loading}
    <p>Loading...</p>
  {:else if error}
    <p>{error}</p>
  {:else}
    <HighlightAuto {code} />
  {/if}
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
</style>