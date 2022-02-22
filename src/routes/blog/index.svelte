<svelte:head>
    <title>Anonymus09 - Blog</title>
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
</script>

<h1>Personal Blog</h1>
<h3>Here are all blog posts</h3>

<div class="bg-gray-700 rounded-xl shadow-md px-3 md:px-6 md:py-6 py-3 flex flex-col mt-5">
    <div class="flex flex-col space-y-5">
        {#each posts as post}
         <div class="flex">
            <img src="{post.meta.img}" alt="blog post logo" class="object-cover w-48 h-28 md:w-96 md:h-56 rounded-xl mr-5 md:mr-10"/>
            <div class="flex flex-col justify-between py-1 rounded-xl w-full">
                <div class="flex flex-col">
                    <h2 class="mb-5">
                        <a href={post.path}>{post.meta.title}</a>
                    </h2>
                    <h4>{post.meta.excerpt}</h4>
                </div>
                <h3>{post.meta.date}</h3>
            </div>
        </div>
        {/each}
    </div>
</div>