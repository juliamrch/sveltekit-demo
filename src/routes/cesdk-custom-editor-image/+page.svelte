<script lang="ts">
import { browser } from "$app/environment"; // true only if the app is running in the browser
// use the browser flag to conditionally render client-side components
let isClient = browser;

import type { ComponentType } from "svelte";
let CustomEditorImage: ComponentType | null = null;
if (isClient) {
  // dynamically import the CustomEditor component only in the browser
  import("$components/CustomEditorImage.svelte").then(module => {
    CustomEditorImage = module.default;
  });
}

</script>

{#if isClient && CustomEditorImage}
<svelte:component this={CustomEditorImage}/>
{/if}