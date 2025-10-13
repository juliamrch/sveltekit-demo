<script lang="ts">
import { browser } from "$app/environment"; // true only if the app is running in the browser
// use the browser flag to conditionally render client-side components
let isClient = browser;

import type { ComponentType } from "svelte";
let CustomEditor: ComponentType | null = null;
if (isClient) {
  // dynamically import the CustomEditor component only in the browser
  import("$components/CustomEditor.svelte").then(module => {
    CustomEditor = module.default;
  });
}

</script>

{#if isClient && CustomEditor}
<svelte:component this={CustomEditor}/>
{/if}