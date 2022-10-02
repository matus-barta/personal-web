<script lang="ts">
    import type { PageData } from "./$types"
    export let data: PageData;
</script>

<svelte:head>
    <title>{data.title}</title>
</svelte:head>

<div class="bg-gray-700 rounded-xl flex flex-col">
    {#if data.img_transparent}
        <img src="{data.img}" alt="blog title" class="w-full h-44 rounded-xl rounded-b-none object-cover bg-slate-100 px-3"/>
    {:else}
        <img src="{data.img}" alt="blog title" class="w-full h-44 rounded-xl rounded-b-none object-cover"/>
    {/if}
    <div class="px-3 md:px-6 pt-2 flex flex-col">      
        <h1 class="p-0 mt-1 mb-5">{data.title}</h1>
        <h3 class="w-full text-right align-text-bottom">{data.date}</h3>
        <div class="h-1 my-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-blue-700 w-full rounded-xl"/>
        <div class="my-5">
            <svelte:component this={data.content} />
        </div>
    </div>
</div>