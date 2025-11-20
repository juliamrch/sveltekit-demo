<script lang="ts">
import type { ComponentType } from 'svelte';
import { browser } from '$app/environment'; // true only if the app is running in the browser
// use the browser flag to conditionally render client-side components
let isClient = browser;

let CreativeEditorSDK: ComponentType | null = null;
if (isClient) {
  // dynamically import the CreativeEditorSDK component only in the browser
  import('$components/CreativeEditorSDK.svelte').then(module => {
    CreativeEditorSDK = module.default;
  });
}
</script>

{#if isClient && CreativeEditorSDK}
<svelte:component this={CreativeEditorSDK}/>
  />
{/if}