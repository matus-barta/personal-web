<script lang="ts">
    export let img, img_alt, text, title, perex, github;
    import SvelteMarkdown from "svelte-markdown";
</script>
<div>
    <div class="flex">
        <img src="{img}" alt="{img_alt}" class="w-32 h-32 bg-white p-2 rounded-xl"/>
        <div class="h-32 w-full relative">
            <h1 class="pl-3 pb-0 bottom-0 absolute"> {title}</h1>
        </div>
    </div>
    <div class="h-1 mb-3 mt-3 bg-gradient-to-r from-emerald-500 via-sky-500 to-blue-700 w-full rounded-xl"></div>
    <div class="flex justify-between tracking-tight text-sm text-slate-300">
        <p>{perex}</p>
        <a href="{github}">
            <div class="flex space-x-1  hover:underline hover:text-slate-300">
                <p>GitHub page</p>
                <img src="/media/social/gh-grey.svg" alt="github logo" class="h-4 w-4"/></div>
        </a>
    </div>
    <div class="pt-5">
        <SvelteMarkdown source="{text}"/>
    </div>
    <div class="h-0.5 mt-3 bg-slate-500 rounded-xl mb-10"></div>
</div>