<script>
  import { goto } from "$app/navigation";

  let title = "";
  let description = "";
  let aiTool = "ChatGPT";
  let isFavorite = false;
  let error = null;

  async function handleSubmit() {
    error = null;
    try {
      const res = await fetch("http://localhost:3000/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, aiTool, isFavorite }),
      });
      if (res.ok) {
        goto("/prompts");
      } else {
        const data = await res.json();
        error = data.message || 'An error occurred while saving the prompt.';
        console.error('Failed to save prompt:', data);
      }
    } catch (e) {
      error = e.message;
      console.error('An error occurred:', e);
    }
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Add New Prompt</h1>

  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
      <input
        type="text"
        id="title"
        bind:value={title}
        required
        class="input input-bordered w-full"
      />
    </div>
    <div>
      <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
      <textarea
        id="description"
        bind:value={description}
        class="textarea textarea-bordered w-full"
      ></textarea>
    </div>
    <div>
      <label for="aiTool" class="block text-sm font-medium text-gray-700">AI Tool</label>
      <select id="aiTool" bind:value={aiTool} class="select select-bordered w-full">
        <option>ChatGPT</option>
        <option>Perplexity</option>
        <option>Gemini</option>
      </select>
    </div>
    <div class="flex items-center">
      <input
        type="checkbox"
        id="isFavorite"
        bind:checked={isFavorite}
        class="checkbox checkbox-primary"
      />
      <label for="isFavorite" class="ml-2 text-sm text-gray-700">Favorite</label>
    </div>
    {#if error}
      <div class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{error}</span>
      </div>
    {/if}
    <div>
      <button type="submit" class="btn btn-primary">Save</button>
    </div>
  </form>
</div>
