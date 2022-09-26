<script lang="ts">
    export var title: string, date: string, img: string, img_transparent: boolean;
    import {} from "../../../static/prism/prism";
</script>

<svelte:head>
    <title>{title}</title>
    <link href="/prism/prism.css" rel="stylesheet" />
</svelte:head>

<div class="bg-gray-700 rounded-xl flex flex-col">
    {#if img_transparent}
        <img src="{img}" alt="blog title" class="w-full h-44 rounded-xl rounded-b-none object-cover bg-slate-100 px-3"/>
    {:else}
        <img src="{img}" alt="blog title" class="w-full h-44 rounded-xl rounded-b-none object-cover"/>
    {/if}
    <div class="px-3 md:px-6 pt-2 flex flex-col">      
        <h1 class="p-0 mt-1 mb-5">{title}</h1>
        <h3 class="w-full text-right align-text-bottom">{date}</h3>
        <div class="h-1 my-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-blue-700 w-full rounded-xl"/>
        <div class="my-5">
            <slot/>
        </div>
    </div>
</div>
