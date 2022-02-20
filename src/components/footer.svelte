<style>
    img{
        @apply h-6 w-6;
    }
</style>

<script lang="ts">
    var tw = "/media/twitter-grey.svg";
    var ig = "/media/ig-grey.svg";
    var yt = "/media/yt-grey.svg";
    var gh = "/media/github-grey.svg";
</script>

<footer class="w-full h-10 bg-neutral-700 text-slate-400 p-2 flex justify-center space-x-2">
    <p>Matúš Barta • {new Date().getFullYear()} • All Rights Reserved •</p>
    <a href="https://twitter.com/anonymus64">
        <img src="{tw}" alt=twitter on:mouseenter="{()=>{tw="/media/twitter.svg"}}" on:mouseleave="{()=>{tw="/media/twitter-grey.svg"}}"/>
    </a>
    <a href="https://www.instagram.com/matus.barta09/">
        <img src="{ig}" alt=instagram on:mouseenter="{()=>{ig="/media/ig.svg"}}" on:mouseleave="{()=>{ig="/media/ig-grey.svg"}}"/>
    </a>
    <a href="https://www.youtube.com/channel/UCPWg-Iw7QFAXM-H2WjzPxiA">
        <img src="{yt}" alt=youtube on:mouseenter="{()=>{yt="/media/yt.svg"}}" on:mouseleave="{()=>{yt="/media/yt-grey.svg"}}"/>
    </a>
    <a href="https://github.com/matus-barta">
        <img src="{gh}" alt=github on:mouseenter="{()=>{gh="/media/github.svg"}}" on:mouseleave="{()=>{gh="/media/github-grey.svg"}}"/>
    </a>
</footer>
