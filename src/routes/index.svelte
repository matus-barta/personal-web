<svelte:head>
    <title>Anonymus09</title>
</svelte:head>

<script lang="ts" context="module">
    export const load = async ({ fetch }) => {
        const posts = await fetch('/api/posts.json');
        const allPosts = await posts.json();
        return {
            props: {
                posts: allPosts
            }
        }
    }
</script>

<script lang="ts">
    export var posts;
    if (posts.length > 10) posts = posts.slice(0,10);
</script>

<div class="bg-gray-700 rounded-xl shadow-md px-3 md:px-6 pt-6 pb-6 flex flex-col">
    <div class="flex justify-between">
        <div class="flex flex-col">
        <h1>
            Matúš
            <span class="relative ml-2 inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-emerald-500">
                <span class="relative skew-y-3 text-lime-300">
                     @anonymus09
                </span>
            </span>         
            Barta
        </h1>
        <p>IT guy, hobby developer, homelab enthusiast, gamer, space nerd.</p>
        <a class="text-gray-500 hover:underline mt-5 hover:text-gray-400 text-sm" href="/about">More on About page</a>
        </div>
        <img class="w-32 h-32 ml-2 rounded-full md:w-40 md:h-40" src="/media/ksp.jpg" alt="logo">
    </div>
    <div class="pt-6 pb-6">
        <h1 class="text-2xl md:text-4xl font-bold mb-1 text-white tracking-tight">Latest Blog Posts</h1>
        <div class="flex flex-col mb-5">
            {#each posts as post}
                <div class="flex space-x-2 items-center">
                    <a class="hover:underline" href="{post.path}">{post.meta.title}</a>
                    <h4 class="text-xs align-bottom">{post.meta.date}</h4>
                </div>
            {/each}
        </div>
        <a class="text-gray-500 hover:underline hover:text-gray-400 text-sm" href="/blog">See All Posts</a>
    </div>
</div>
