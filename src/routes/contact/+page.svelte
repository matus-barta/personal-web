<svelte:head>
	<title>Contact - Matus Barta | Anonymus09</title>
</svelte:head>

<h1>Contact</h1>
<h3>Feel free to contact me</h3>

<form
	name="contact-form"
	method="POST"
	data-netlify="true"
	action="/success"
	class="bg-gray-700 rounded-xl shadow-md px-8 pt-6 pb-6 flex justify-center mt-5"
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

<style>
	p {
		@apply text-sm font-medium;
	}
	label {
		@apply block mb-4;
	}
</style>
