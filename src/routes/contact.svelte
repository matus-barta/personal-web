<svelte:head>
    <title>Anonymus09 - Contact</title>
</svelte:head>

<script context="module">
    export const prerender = true;
</script>

<style>
    p{
        @apply text-sm font-medium;
    }
    label{
        @apply block mb-4;
    }
</style>


<h1>Feel free to contact me</h1>

<form name="contact-form" method="POST" data-netlify="true" action="/success" class="bg-gray-700 rounded-xl shadow-md px-8 pt-6 pb-6 flex justify-center">
    <div class="w-full md:w-3/4">
        <input type="hidden" name="form-name" value="contact-form" />
        <p>
            <label>Your Name: <input type="text" name="name" /></label>
        </p>
        <p>
            <label>Your Email: <input type="email" name="email" /></label>
        </p>
        <p>
            <label>Message: <textarea name="message" /></label>
        </p>
        <p>
            <button class="bg-emerald-500" type="submit">Send</button>
        </p>
    </div>
</form>


