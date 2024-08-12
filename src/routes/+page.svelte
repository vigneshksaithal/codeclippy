<script lang="ts">
import Highlight, { type HighlightContext } from "@highlight-ai/app-runtime"
import Fuse from "fuse.js"
import { onDestroy, onMount } from "svelte"
import { HighlightAuto } from "svelte-highlight"
import atomOneLight from "svelte-highlight/styles/atom-one-light"

let codeSnippets: codeSnippet[] = []
// biome-ignore lint/style/useConst: <explanation>
let query = ""
let isHighlight = false
let destroyHighlightListener: () => void

onMount(async () => {
	if (typeof Highlight !== "undefined" && Highlight.isRunningInHighlight) {
		isHighlight = Highlight.isRunningInHighlight()

		if (isHighlight) {
			codeSnippets = await getCodeSnippets()

			console.log("Setting up Highlight listener")
			destroyHighlightListener = Highlight.app.addListener(
				"onContext",
				async (context: HighlightContext) => {
					console.log("onContext event received", context)
					if (!context.suggestion) return

					const newSnippet: codeSnippet = {
						id: generateId(),
						title: context.suggestion,
						created_at: new Date().toISOString(),
						updated_at: new Date().toISOString(),
						description: "",
						code: "",
					}

					const attachments = context.attachments
					if (attachments) {
						for (const attachment of attachments) {
							if (attachment.type === "clipboard") {
								newSnippet.code = attachment.value
							}
						}
					}

					await saveCode(newSnippet)
				},
			)
			console.log("Highlight listener set up successfully")
		}
	} else {
		console.warn(
			"This app is not running inside Highlight. Some features may be limited.",
		)
	}
})

const saveCode = async (snippet: codeSnippet): Promise<void> => {
	codeSnippets = [snippet, ...codeSnippets]
	if (isHighlight) {
		await Highlight.appStorage.set("codeSnippets", codeSnippets)
	}
}

const getCodeSnippets = async () => {
	if (isHighlight) {
		return (await Highlight.appStorage.get("codeSnippets")) ?? []
	}
	return []
}

const copyToClipboard = async (text: string) => {
	try {
		await navigator.clipboard.writeText(text)
		alert("Code copied successfully!")
	} catch (error) {
		console.error("Failed to copy text", error)
		alert("Failed to copy code :(")
	}
}

const deleteSnippet = (id: number): void => {
	codeSnippets = codeSnippets.filter((snippet) => snippet.id !== id)
	if (isHighlight) {
		Highlight.appStorage.set("codeSnippets", codeSnippets)
	}
}

const searchCode = (query: string) => {
	const fuse = new Fuse(codeSnippets, { keys: ["title"] })
	return fuse.search(query)
}

const generateId = (): number => Math.floor(Math.random() * 1000000)

onDestroy(() => {
	if (isHighlight && destroyHighlightListener) {
		console.log("Destroying Highlight listener")
		destroyHighlightListener()
	}
})
</script>

{#if isHighlight && codeSnippets.length > 0}
  <div class="code-snippets__container">
    <nav>
      <ul>
        <li><h1>CodeClippy</h1></li>
      </ul>
      <ul>
        <li>
          <a href="https://tally.so/r/3N0jdb" target="_blank">Feedback</a>
        </li>
        <li>
          <button
            class="secondary"
            on:click={() => {
              codeSnippets = []
              if (isHighlight) {
                Highlight.appStorage.delete('codeSnippets')
              }
            }}>Reset</button
          >
        </li>
      </ul>
    </nav>
    <p>If you are facing bugs, try resetting using the above button.</p>
    <input
      type="search"
      placeholder="Search"
      aria-label="Search"
      bind:value={query}
    />
    <div class="grid" style="grid-template-columns: repeat(1, 1fr);">
      {#if query !== ''}
        {#each searchCode(query) as result}
          <article class="card">
            <header>
              <p style="margin-bottom: 0;">
                <strong>{result.item.title}</strong>
              </p>
            </header>
            <HighlightAuto id="code" code={result.item.code} />
            <footer style="display: flex; gap: 0.8em; justify-content: right;">
              <button
                class="secondary outline"
                on:click={() => {
                  deleteSnippet(result.item.id)
                  query = ''
                }}>Delete</button
              >
              <button
                on:click={() => {
                  copyToClipboard(result.item.code)
                }}>Copy</button
              >
            </footer>
          </article>
        {/each}
      {:else}
        {#each codeSnippets as { id, title, code }, i}
          <article>
            <header>
              <p style="margin-bottom: 0;">
                <strong>{title}</strong>
              </p>
            </header>
            <HighlightAuto id="code" {code} />
            <footer style="display: flex; gap: 0.8em; justify-content: right;">
              <button
                class="secondary outline"
                on:click={() => {
                  deleteSnippet(id)
                }}>Delete</button
              >
              <button
                on:click={() => {
                  copyToClipboard(code)
                }}>Copy</button
              >
            </footer>
          </article>
        {/each}
      {/if}
    </div>
  </div>
{:else}
  <article class="readme">
    <header>
      <h1>CodeClippy</h1>
      <p>
        CodeClippy is a Highlight.ing app that helps you capture code snippets
        like Pieces.app without the complexity.
      </p>
      <p>Just copy the code and invoke the app with Highlight.</p>
      <p style="margin-bottom: 0;">
        <strong>Note: All data is stored only on your computer.</strong>
      </p>
      {#if !isHighlight}
        <p>
          <strong>This app is designed to run inside the Highlight environment.
          Some features may be limited when running outside of Highlight.</strong>
        </p>
      {/if}
    </header>

    <video autoplay loop muted>
      <source src="/codeclippy-demo.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </article>
{/if}

<!-- Import Atom One Light theme -->
<svelte:head>
  {@html atomOneLight}
</svelte:head>

<style>
  .readme,
  .code-snippets__container {
    max-width: 640px;
    margin: 0 auto;
  }

  :global(#code) {
    font-size: 0.8rem;
    max-height: 240px;
  }

  video {
    width: 100%;
    height: auto;
    border-radius: 4px;
  }
</style>