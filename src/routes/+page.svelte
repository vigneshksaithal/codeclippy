<script lang="ts">
	import Highlight, { type HighlightContext } from '@highlight-ai/app-runtime'
	import { onMount } from 'svelte'

	let text = ''
	let res = ''
	let codeSnippets = []

	onMount(async () => {
		Highlight.app.addListener(
			'onContext',
			async (context: HighlightContext) => {
				console.log('Invoked', context)

				const description = context.suggestion || ''
				console.log('description', description)

				let ocrText = context.environment.ocrScreenContents
				text = ocrText || ''
				res = await getCodeFromOcrtext(text)
				saveCode(description, res)
			},
		)
	})

	const getCodeFromOcrtext = async (ocrText: string) => {
		const textPrediction = Highlight.inference.getTextPrediction([
			{
				role: 'system',
				content: `You are a helpful assistant that can answer questions about the user. 
					Extract ONLY code from the given text and return it. 
					Remove the backticks at start and end of code.`,
			},
			{
				role: 'user',
				content: ocrText,
			},
		])

		let result = ''
		for await (const chunk of textPrediction) {
			console.log('incoming chunk', chunk)
			result += chunk
		}

		return result
	}

	const saveCode = async (description: string, code: string) => {
		codeSnippets.push({ description, code })
		Highlight.appStorage.set('codeSnippets', codeSnippets)
	}

	const getCodeSnippets = async () => {
		const codeSnippets = Highlight.appStorage.get('codeSnippets')
		return codeSnippets
	}
</script>

<pre><code>{res}</code></pre>

{#await getCodeSnippets()}
	<p>loading</p>
{:then codeSnippets}
	{#each codeSnippets as codeSnippet}
		<p>{codeSnippet.description}</p>
		<pre><code>{codeSnippet.code}</code></pre>
	{/each}
{:catch error}
	<p>error</p>
{/await}
