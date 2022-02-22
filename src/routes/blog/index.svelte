<svelte:head>
    <title>Anonymus09 - Blog</title>
</svelte:head>

<script lang="ts" context="module">
    export const load = async ({ fetch }) => {
        const posts = await fetch('/api/posts.json')
        const allPosts = await posts.json()

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

<div class="bg-gray-700 rounded-xl shadow-md px-3 md:px-6 pt-6 pb-6 flex flex-col">
    <ul>
        {#each posts as post}
        <li>
        <h2>
            <a href={post.path}>
            {post.meta.title}
            </a>
        </h2>
            Published {post.meta.date}
        </li>
        {/each}
    </ul>
</div>