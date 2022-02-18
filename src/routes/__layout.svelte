<script>
  import Footer from "../components/footer.svelte";
  import Nav from "../components/nav.svelte";
  import "../app.css";
</script>

<div class="flex flex-col h-screen justify-between">
  <Nav/>
  <div class="mb-auto p-8 pt-24 md:w-3/4 w-full max-w-5xl mx-auto">
      <slot />
  </div>
  <Footer/>
</div>