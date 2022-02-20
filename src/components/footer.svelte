<style>
    img{
        @apply h-6 w-6;
    }
</style>

<script lang="ts">
    var greyTwitter = false;
    var tw = "/media/twitter-grey.svg";
    function toggleTwitter(){
        if (greyTwitter) tw = "/media/twitter-grey.svg"; else tw = "/media/twitter.svg";
        greyTwitter = !greyTwitter;
    }

    var greyIg = false;
    var ig = "/media/ig-grey.svg";
    function toggleIg(){
        if (greyIg) ig = "/media/ig-grey.svg"; else ig = "/media/ig.svg";
        greyIg = !greyIg;
    }

    var greyYt = false;
    var yt = "/media/yt-grey.svg";
    function toggleYt(){
        if (greyYt) yt = "/media/yt-grey.svg"; else yt = "/media/yt.svg";
        greyYt = !greyYt;
    }

    var greyGh = false;
    var gh = "/media/github-grey.svg";
    function toggleGh(){
        if (greyGh) gh = "/media/github-grey.svg"; else gh = "/media/github.svg";
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
