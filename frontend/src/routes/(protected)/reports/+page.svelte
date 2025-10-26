<script>
  import { onMount } from "svelte";

  /**
   * @typedef {Object} Prompt
   * @property {string} title
   * @property {number} favorites
   * @property {number} copies
   */

  /** @type {Object.<string, number>} */
  let mostViewed = {};
  /** @type {Prompt[]} */
  let mostFavorited = [];
  /** @type {Prompt[]} */
  let mostCopied = [];

  onMount(async () => {
    const [viewedRes, favoritedRes, copiedRes] = await Promise.all([
      fetch("http://localhost:3000/reports/most-viewed"),
      fetch("http://localhost:3000/reports/most-favorited"),
      fetch("http://localhost:3000/reports/most-copied"),
    ]);

    if (viewedRes.ok) mostViewed = await viewedRes.json();
    if (favoritedRes.ok) mostFavorited = await favoritedRes.json();
    if (copiedRes.ok) mostCopied = await copiedRes.json();
  });
</script>

<div class="space-y-8">
  <h1 class="text-4xl font-bold mb-8">Reports</h1>

  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title" id="most-viewed">Most Viewed Prompts by Tool Type</h2>
      {#if Object.keys(mostViewed).length > 0}
        <ul class="list-disc pl-5">
          {#each Object.entries(mostViewed) as [tool, views]}
            <li>{tool}: {views} views</li>
          {/each}
        </ul>
      {:else}
        <p>No view data available yet.</p>
      {/if}
    </div>
  </div>

  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title" id="most-favorited">Most Favorited Prompts</h2>
      {#if mostFavorited.length > 0}
        <ul class="list-disc pl-5">
          {#each mostFavorited as prompt}
            <li>{prompt.title} ({prompt.favorites} favorites)</li>
          {/each}
        </ul>
      {:else}
        <p>No favorite data available yet.</p>
      {/if}
    </div>
  </div>

  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title" id="most-copied">Most Copied Prompts</h2>
      {#if mostCopied.length > 0}
        <ul class="list-disc pl-5">
          {#each mostCopied as prompt}
            <li>{prompt.title} ({prompt.copies} copies)</li>
          {/each}
        </ul>
      {:else}
        <p>No copy data available yet.</p>
      {/if}
    </div>
  </div>
</div>
