<script>
import { browser } from "$app/environment"; // true only if the app is running in the browser
// use the browser flag to conditionally render client-side components
let isClient = browser;

let CustomEditor;
if (isClient) {
  // dynamically import the CustomEditor component only in the browser
  import("../../components/CustomEditor.svelte").then(module => {
    CustomEditor = module.default;
  });
}
</script>
