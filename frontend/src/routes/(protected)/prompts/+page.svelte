<script>
  import { onMount } from "svelte";
  import { prompts } from "$lib/stores/prompts";
  import { goto } from "$app/navigation";

  let allPrompts = [];
  let filteredPrompts = [];
  let searchTerm = "";
  let filterTool = "";
  let filterFavorite = false;

  onMount(async () => {
    const res = await fetch("http://localhost:3000/prompts");
    if (res.ok) {
      allPrompts = await res.json();
      filterPrompts();
    }
  });

  function filterPrompts() {
    filteredPrompts = allPrompts
      .filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((p) => (filterTool ? p.aiTool === filterTool : true))
      .filter((p) => (filterFavorite ? p.isFavorite : true));
  }

  function handleSearch() {
    filterPrompts();
  }

  function editPrompt(id) {
    goto(`/prompts/${id}`);
  }

  async function copyPrompt(prompt) {
    try {
      await navigator.clipboard.writeText(prompt.description);

      const res = await fetch(
        `http://localhost:3000/prompts/${prompt._id}/copy`,
        {
          method: "POST",
        },
      );

      if (res.ok) {
        const updatedPrompt = await res.json();
        const index = allPrompts.findIndex((p) => p._id === updatedPrompt._id);
        if (index !== -1) {
          allPrompts[index] = updatedPrompt;
          filterPrompts(); // Refresh the view
        }
      } else {
        console.error("Failed to update copy count");
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }

  async function deletePrompt(id) {
    const res = await fetch(`http://localhost:3000/prompts/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      allPrompts = allPrompts.filter((p) => p._id !== id);
      filterPrompts();
    }
  }
</script>

<div class="container mx-auto p-4">
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold">Prompt Manager</h1>
    <button class="btn btn-primary" on:click={() => goto("/prompts/new")}
      >Add New Prompt</button
    >
  </div>

  <div class="flex gap-4 mb-4">
    <input
      type="text"
      bind:value={searchTerm}
      on:input={handleSearch}
      placeholder="Search prompts..."
      class="input input-bordered w-full max-w-xs"
    />
    <select
      bind:value={filterTool}
      on:change={filterPrompts}
      class="select select-bordered"
    >
      <option value="">All Tools</option>
      <option value="ChatGPT">ChatGPT</option>
      <option value="Perplexity">Perplexity</option>
      <option value="Gemini">Gemini</option>
    </select>
    <label class="cursor-pointer label">
      <input
        type="checkbox"
        bind:checked={filterFavorite}
        on:change={filterPrompts}
        class="checkbox checkbox-primary"
      />
      <span class="label-text ml-2">Favorites only</span>
    </label>
  </div>

  <div class="overflow-x-auto">
    <table class="table w-full">
      <thead>
        <tr>
          <th>Title</th>
          <th>AI Tool</th>
          <th>Favorite</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each filteredPrompts as prompt}
          <tr>
            <td
              ><a href="/prompts/{prompt._id}" class="link link-hover"
                >{prompt.title}</a
              ></td
            >
            <td>{prompt.aiTool}</td>
            <td>{prompt.isFavorite ? "Yes" : "No"}</td>
            <td class="flex gap-2">
              <button class="btn btn-sm" on:click={() => copyPrompt(prompt)}
                >Copy</button
              >
              <button class="btn btn-sm" on:click={() => editPrompt(prompt._id)}
                >Edit</button
              >
              <button
                class="btn btn-sm btn-error"
                on:click={() => deletePrompt(prompt._id)}>Delete</button
              >
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
