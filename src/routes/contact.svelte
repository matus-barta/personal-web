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

<form name="contact-form" method="post" data-netlify-recaptcha="true" data-netlify="true" class="bg-gray-700 rounded-xl shadow-md px-8 pt-6 pb-6 flex justify-center">
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
        <div data-netlify-recaptcha="true"></div>
        <p>
            <button class="px-6 py-2 text-base bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 focus:outline-none rounded-full" type="submit">Send</button>
        </p>
    </div>
</form>


