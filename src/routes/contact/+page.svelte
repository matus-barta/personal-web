<script lang="ts">
	import * as Card from '#lib/components/ui/card/index.js';
	import PageHeader from '#lib/components/page-header.svelte';
	import { pageTitle } from '#lib/utils/page-title.js';
</script>

<svelte:head>
	<title>{pageTitle('Contact')}</title>
</svelte:head>

<PageHeader title="Contact" description="Feel free to contact me" />

<Card.Root>
	<Card.Content>
		<p>Nothing to be found here...</p>
	</Card.Content>
</Card.Root>

<!--
<form
	name="contact-form"
	method="POST"
	data-netlify="true"
	action="/success"
	class="bg-window-gray rounded-xl shadow-md px-8 pt-6 pb-6 flex justify-center mt-5"
>
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


<style lang="postcss">
@reference "../../app.css";
	p {
		@apply text-sm font-medium;
	}
	label {
		@apply block mb-4;
	}
</style>
-->
