<svelte:head>
    <title>Success - Matus Barta | Anonymus09</title>
</svelte:head>

<script>
    import {onMount} from "svelte";

    onMount(()=>{
        setTimeout(()=>{
            goHome();
        },5000)
    });

    function goHome(){
        window.location.href="/";
    }
</script>

<div class="bg-gray-700 rounded-xl shadow-md px-8 pt-6 pb-6 text-center">
    <p class="pb-0">Form was successfully sent!
    <p class="pb-4">Will redirect you in few seconds...</p>
    <button on:click={goHome}>Go Home!</button>
</div>