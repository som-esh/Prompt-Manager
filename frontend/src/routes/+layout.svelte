<script>
  import "../app.css";
  import { user, clearAuth } from "$lib/stores/auth";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  let currentUser = null;

  onMount(() => {
    const unsubscribe = user.subscribe((value) => {
      currentUser = value;
    });
    return unsubscribe;
  });

  function logout() {
    clearAuth();
    goto("/login");
  }
</script>

<header class="bg-white shadow-md sticky top-0 z-50">
  <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16 items-center">
      <div class="flex-shrink-0 text-2xl font-bold text-blue-700">
        <a href="/" class="hover:text-blue-900">Prompt Manager</a>
      </div>
      <div class="hidden md:flex items-center space-x-8">
        {#if currentUser}
          <a
            href="/prompts"
            class="text-gray-700 hover:text-blue-700 font-medium transition"
            >Prompts</a
          >
          <a
            href="/reports"
            class="text-gray-700 hover:text-blue-700 font-medium transition"
            >Reports</a
          >
          <button
            on:click={logout}
            class="text-gray-700 hover:text-blue-700 font-medium transition"
            >Logout</button
          >
        {:else}
          <a
            href="/login"
            class="text-gray-700 hover:text-blue-700 font-medium transition"
            >Login</a
          >
        {/if}
      </div>
    </div>
  </nav>
</header>

<main class="pt-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <slot />
</main>
