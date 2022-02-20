<style>
    img{
        @apply h-6 w-6;
    }
</style>

<script lang="ts">
    var greyTwitter = false;
    var tw = "/twitter-grey.svg";
    function toggleTwitter(){
        if (greyTwitter) tw = "/twitter-grey.svg"; else tw = "/twitter.svg";
        greyTwitter = !greyTwitter;
    }

    var greyIg = false;
    var ig = "/ig-grey.svg";
    function toggleIg(){
        if (greyIg) ig = "/ig-grey.svg"; else ig = "/ig.svg";
        greyIg = !greyIg;
    }

    var greyYt = false;
    var yt = "/yt-grey.svg";
    function toggleYt(){
        if (greyYt) yt = "/yt-grey.svg"; else yt = "/yt.svg";
        greyYt = !greyYt;
    }

    var greyGh = false;
    var gh = "/github-grey.svg";
    function toggleGh(){
        if (greyGh) gh = "/github-grey.svg"; else gh = "/github.svg";
        greyGh = !greyGh;
    }
</script>

<footer class="w-full h-10 bg-neutral-700 text-slate-400 p-2 flex justify-center space-x-2">
    <p>Matúš Barta • {new Date().getFullYear()} • All Rights Reserved •</p>
    <a href="https://twitter.com/anonymus64">
        <img src="{tw}" alt=twitter on:mouseenter="{toggleTwitter}" on:mouseleave="{toggleTwitter}"/>
    </a>
    <a href="https://www.instagram.com/matus.barta09/">
        <img src="{ig}" alt=instagram on:mouseenter="{toggleIg}" on:mouseleave="{toggleIg}"/>
    </a>
    <a href="https://www.youtube.com/channel/UCPWg-Iw7QFAXM-H2WjzPxiA">
        <img src="{yt}" alt=youtube on:mouseenter="{toggleYt}" on:mouseleave="{toggleYt}"/>
    </a>
    <a href="https://github.com/matus-barta">
        <img src="{gh}" alt=github on:mouseenter="{toggleGh}" on:mouseleave="{toggleGh}"/>
    </a>
</footer>
