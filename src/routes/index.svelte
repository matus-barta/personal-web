
<script>
import Card from "../components/card.svelte";


const card = {
    title: "Web is under construction",
    img: "../static/information.png",
    img_alt: "information",
    text: "We are working on it"
};

</script>
<svelte:head>
    <title>Anonymus09</title>
</svelte:head>

<div class="flex items-center justify-center">
    <Card card={card}></Card>
</div>