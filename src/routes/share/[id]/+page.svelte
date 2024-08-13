<script lang="ts">
import type { PageData } from "./$types"

export let data: PageData
const { title, code } = data

const copyToClipboard = async () => {
	try {
		await navigator.clipboard.writeText(code)
		alert("Code copied to clipboard!")
	} catch (err) {
		console.error("Failed to copy: ", err)
	}
}
</script>

<article style="max-width: 700px; margin: 0 auto;">
  <header>
    <h4>{title}</h4>
  </header>
  <pre><code>{code}</code></pre>
  <footer style="display: flex; justify-content: end;">
    <button on:click={copyToClipboard}>Copy Code</button>
  </footer>
</article>

<style>
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style>