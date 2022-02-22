<script lang="ts">
  export var title;
  export var date;
</script>

<svelte:head>
    <title>Anonymus09 - Blog</title>
</svelte:head>

<div class="bg-gray-700 rounded-xl shadow-md px-3 md:px-6 pt-6 pb-6 flex flex-col">
    <h1>{title}</h1>
    <div class="flex justify-between">
        <h3>Matúš</h3>
        <h3>{date}</h3>
    </div>
    <div class="h-1 mb-10 mt-3 bg-gradient-to-r from-emerald-500 via-sky-500 to-blue-700 w-full rounded-xl"></div>
    <slot/>
</div>
