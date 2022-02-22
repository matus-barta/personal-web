<script lang="ts">
    export var title;
    export var date;
    export var img;
</script>

<svelte:head>
    <title>Anonymus09 - {title}</title>
</svelte:head>

<div class="bg-gray-700 rounded-xl flex flex-col">
    <img src="{img}" alt="blog title" class="w-full h-44 rounded-xl rounded-b-none object-cover"/>
    <div class="px-3 md:px-6 pt-2">
        <div class="relative h-10">        
            <h1 class="p-0 absolute bottom-0">{title}</h1>
            <h3 class="absolute bottom-0 right-0">{date}</h3>
        </div>
        <div class="h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-blue-700 w-full rounded-xl"/>
        <div class="my-5">
            <slot/>
        </div>
    </div>
</div>
