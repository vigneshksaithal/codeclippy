<script lang="ts">
export let title = 'CodeClippy: Save and Share Code Snippets Easily'
export let description =
	'CodeClippy is a Highlight.ing app that helps you capture and share code snippets effortlessly. Save, organize, and access your code snippets with ease.'
export let keywords =
	'code snippets, code sharing, programming, developer tools, Highlight.ing app'
export let url = 'https://codeclippy.aithal.dev'
export let image = 'https://codeclippy.aithal.dev/og-image.jpg'
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="codeclippy.aithal.dev" />
	<meta property="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />

	<!-- Canonical URL -->
	<link rel="canonical" href={url} />
</svelte:head>
