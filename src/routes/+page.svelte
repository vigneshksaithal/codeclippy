<script lang="ts">
	import Highlight, { type HighlightContext } from '@highlight-ai/app-runtime'
	import { onMount } from 'svelte'

	let text = ''
	let res = ''

	onMount(async () => {
		Highlight.app.addListener(
			'onContext',
			async (context: HighlightContext) => {
				console.log('Invoked', context)

				let ocrText = context.environment.ocrScreenContents
				text = ocrText || ''
				res = await getCodeFromOcrtext(text)
			},
		)
	})

	const getCodeFromOcrtext = async (ocrText: string) => {
		const textPrediction = Highlight.inference.getTextPrediction([
			{
				role: 'system',
				content:
					'You are a helpful assistant that can answer questions about the user. Extract ONLY code from the given text and return it. Remove the backticks at start and end of code.',
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
</script>

<pre><code class="language-html">{res}</code></pre>
