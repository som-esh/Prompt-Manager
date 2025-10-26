<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  let prompt = {
    title: "",
    description: "",
    aiTool: "ChatGPT",
    isFavorite: false,
  };

  onMount(async () => {
    const res = await fetch(`http://localhost:3000/prompts/${$page.params.id}`);
    if (res.ok) {
      prompt = await res.json();
    }
  });

  async function handleSubmit() {
    const res = await fetch(
      `http://localhost:3000/prompts/${$page.params.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prompt),
      },
    );
    if (res.ok) {
      goto("/prompts");
    }
  }
</script>

<div class="card bg-base-100 shadow-xl max-w-2xl mx-auto">
  <div class="card-body">
    <h1 class="card-title text-2xl">Edit Prompt</h1>
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <div class="form-control">
        <label class="label" for="title">
          <span class="label-text">Title</span>
        </label>
        <input id="title" type="text" bind:value={prompt.title} required class="input input-bordered w-full" />
      </div>
      <div class="form-control">
        <label class="label" for="description">
          <span class="label-text">Description</span>
        </label>
        <textarea id="description" bind:value={prompt.description} class="textarea textarea-bordered w-full h-32"></textarea>
      </div>
      <div class="form-control">
        <label class="label" for="aiTool">
          <span class="label-text">AI Tool</span>
        </label>
        <select id="aiTool" bind:value={prompt.aiTool} class="select select-bordered w-full">
          <option>ChatGPT</option>
          <option>Perplexity</option>
          <option>Gemini</option>
        </select>
      </div>
      <div class="form-control">
        <label class="label cursor-pointer justify-start gap-4">
          <input type="checkbox" bind:checked={prompt.isFavorite} class="checkbox checkbox-primary" />
          <span class="label-text">Favorite</span>
        </label>
      </div>
      <div class="card-actions justify-end">
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>
  </div>
</div>
