<script lang="ts">
// biome-ignore lint/style/useConst: <explanation>
export let isHighlight = false
</script>

<article class="readme" style="max-width: 600px; margin: 0 auto;">
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
    <p>
      {isHighlight ? "" : "This app is designed to run inside the Highlight environment."}
    </p>
  </header>

  <video autoplay loop muted style="width: 100%;">
    <source src="/codeclippy-demo.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</article>

