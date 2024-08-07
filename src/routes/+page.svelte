<script lang="ts">
import Highlight, { type HighlightContext } from "@highlight-ai/app-runtime"
import Fuse from "fuse.js"
import { onDestroy, onMount } from "svelte"
import { HighlightAuto } from "svelte-highlight"
import atomOneLight from "svelte-highlight/styles/atom-one-light"

let codeSnippets: codeSnippet[] = []
const codeSnippet: codeSnippet = {
	id: -1,
	created_at: "",
	updated_at: "",
	title: "",
	description: "",
	code: "",
}
const query = ""

onMount(async () => {
	/**
	 * Check if it is running in Highlight
	 */
	if (typeof window.Highlight === "undefined") {
		console.error("Highlight environment is not available")
		return
	}

	codeSnippets.length = 0 // Reset

	codeSnippets = await getCodeSnippets()
})

const saveCode = async (snippet: codeSnippet) => {
	const newSnippet = {
		...snippet,
	}

	codeSnippets.unshift(newSnippet)
	codeSnippets = codeSnippets

	Highlight.appStorage.set("codeSnippets", codeSnippets)
}

const getCodeSnippets = async () => {
	return (await Highlight.appStorage.get("codeSnippets")) ?? []
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

const deleteSnippet = (id: number) => {
	codeSnippets = codeSnippets.filter((snippet) => snippet.id !== id)
	Highlight.appStorage.set("codeSnippets", codeSnippets)
}

const searchCode = (query: string) => {
	const fuseOptions = {
		// isCaseSensitive: false,
		// includeScore: false,
		// shouldSort: true,
		// includeMatches: false,
		// findAllMatches: false,
		// minMatchCharLength: 1,
		// location: 0,
		// threshold: 0.6,
		// distance: 100,
		// useExtendedSearch: false,
		// ignoreLocation: false,
		// ignoreFieldNorm: false,
		// fieldNormWeight: 1,
		keys: ["title"],
	}
	const fuse = new Fuse(codeSnippets, fuseOptions)
	return fuse.search(query)
}

const generateId = () => {
	return Math.floor(Math.random() * 1000000)
}

const destroyHighlightListener = Highlight.app.addListener(
	"onContext",
	async (context: HighlightContext) => {
		if (!context.suggestion) {
			return
		}

		/**
		 * Check if id already exists
		 */
		let idExists = true
		let newId = generateId()
		while (idExists) {
			idExists = codeSnippets.some((snippet) => snippet.id === newId)
			if (idExists) {
				newId = generateId()
			}
		}
		codeSnippet.id = newId

		codeSnippet.title = context.suggestion
		codeSnippet.created_at = new Date().toISOString()
		codeSnippet.updated_at = new Date().toISOString()

		/**
		 * Get code from Clipboard
		 */

		const attachments = context.attachments
		if (attachments) {
			attachments.forEach((attachment) => {
				if (attachment.type === "clipboard") {
					codeSnippet.code = attachment.value
				}
			})
		}

		await saveCode(codeSnippet)
	},
)

onDestroy(() => {
	destroyHighlightListener()
})
</script>

{#if codeSnippets.length === 0}
    <!-- README -->
    <article class="readme">
        <header>
            <h1>CodeClippy</h1>
            <p>
                CodeClippy is a Highlight.ing app that helps you capture code
                snippets like Pieces.app without the complexity.
            </p>
            <p>Just copy the code and invoke the app with Highlight.</p>
            <p style="margin-bottom: 0;">
                <strong>Note: All data is stored only on your computer.</strong>
            </p>
        </header>

        <video autoplay loop muted>
            <source src="/codeclippy-demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    </article>
{:else}
    <div class="code-snippets__container">
        <nav>
            <ul>
                <li><h1>CodeClippy</h1></li>
            </ul>
            <ul>
                <li>
                    <a href="https://tally.so/r/3N0jdb" target="_blank"
                        >Feedback</a
                    >
                </li>
                <li>
                    <button
                        class="secondary"
                        on:click={() => {
                            codeSnippets = [];
                            Highlight.appStorage.delete("codeSnippets");
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
        <div class="grid">
            {#if query !== ""}
                {#each searchCode(query) as result}
                    <article class="card">
                        <header>
                            <p style="margin-bottom: 0;">
                                <strong>{result.item.title}</strong>
                            </p>
                        </header>
                        <HighlightAuto id="code" code={result.item.code} />
                        <footer
                            style="display: flex; gap: 0.8em; justify-content: right;"
                        >
                            <button
                                class="secondary outline"
                                on:click={() => {
                                    deleteSnippet(result.item.id);
                                    query = "";
                                }}>Delete</button
                            >
                            <button
                                on:click={() => {
                                    copyToClipboard(result.item.code);
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
                        <footer
                            style="display: flex; gap: 0.8em; justify-content: right;"
                        >
                            <button
                                class="secondary outline"
                                on:click={() => {
                                    deleteSnippet(id);
                                }}>Delete</button
                            >
                            <button
                                on:click={() => {
                                    copyToClipboard(code);
                                }}>Copy</button
                            >
                        </footer>
                    </article>
                {/each}
            {/if}
        </div>
    </div>
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

    .grid {
        grid-template-columns: repeat(1, 1fr);
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
