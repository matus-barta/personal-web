<script lang="ts">
    import type { PageData } from "./$types"
    export let data: PageData;
</script>

<svelte:head>
    <title>{data.meta.title}</title>
</svelte:head>

<div class="bg-gray-700 rounded-xl flex flex-col">
    {#if data.meta.img_transparent}
        <img src="{data.meta.img}" alt="blog title" class="w-full h-44 rounded-xl rounded-b-none object-cover bg-slate-100 px-3"/>
    {:else}
        <img src="{data.meta.img}" alt="blog title" class="w-full h-44 rounded-xl rounded-b-none object-cover"/>
    {/if}
    <div class="px-3 md:px-6 pt-2 flex flex-col">      
        <h1 class="p-0 mt-1 mb-5">{data.meta.title}</h1>
        <h3 class="w-full text-right align-text-bottom">{data.meta.date}</h3>
        <div class="h-1 my-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-blue-700 w-full rounded-xl"/>
        <div class="my-5">
            <div>
                {@html data.html}
            </div>
        </div>
    </div>
</div>