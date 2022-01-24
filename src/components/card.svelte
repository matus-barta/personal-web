<script> 
export let card;
</script>
<div class="bg-gray-600 h-48 w-96 text-white rounded-xl p-4 shadow-md">
    <div class="flex items-center">
        <img src={card.img} alt={card.img_alt} class="rounded-xl w-12 h-12 mr-1"/>
        <p class="m-1 text-2xl"> {card.title}</p>
    </div> 
    <p class="m-2">{card.text}</p>
</div>