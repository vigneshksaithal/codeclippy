<main class="container">
	<slot />
</main>

<style>
	main {
		padding: 2em;
	}

	:global(:root) {
		background: repeating-radial-gradient(
				circle at center center,
				transparent 0px,
				transparent 13px,
				rgba(0, 0, 0, 0.03) 13px,
				rgba(0, 0, 0, 0.03) 24px,
				transparent 24px,
				transparent 62px,
				rgba(0, 0, 0, 0.03) 62px,
				rgba(0, 0, 0, 0.03) 96px
		),
		repeating-radial-gradient(
				circle at center center,
				rgb(255, 255, 255) 0px,
				rgb(255, 255, 255) 14px,
				rgb(255, 255, 255) 14px,
				rgb(255, 255, 255) 18px,
				rgb(255, 255, 255) 18px,
				rgb(255, 255, 255) 28px,
				rgb(255, 255, 255) 28px,
				rgb(255, 255, 255) 32px
		) fixed;
		background-size: 21px 21px;
	}
</style>
