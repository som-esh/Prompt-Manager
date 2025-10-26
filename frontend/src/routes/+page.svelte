<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  onMount(() => {
    goto("/prompts");
  });
</script>

<h1>Welcome to the Prompt Manager</h1>
<p>Redirecting to your prompts...</p>
