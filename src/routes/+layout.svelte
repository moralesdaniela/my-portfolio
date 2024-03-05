<script>
let pages = [
	{url: "./", title: "Home"},
	{url: "./projects", title: "Projects"},
	{ url: "./cv", title: "CV" },
  { url: "./contact", title: "Contact" },
];
import { page } from '$app/stores';
</script>

<nav>
	{#each pages as p }
    <a href={p.url} class:current={ "." + $page.route.id === p.url } target={ p.url.startsWith("http") ? "_blank" : null }>{p.title}</a>
	{/each}
</nav>
<slot/>

<style>

nav {
  --border-color: oklch(50% 10% 200 / 40%);
  display: flex;
  margin-bottom: 0.5em;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: var(--border-color);
}
a {
  flex: 1;
  text-decoration: none;
  color: inherit;
  text-align: center;
  padding: 0.5em;
}

a:hover {
  border-bottom-color: var(--color-accent);
  background-color: color-mix(in oklch, var(--color-accent), canvas 85%);
}

.current {
  border-bottom: 0.4em double oklch(80% 3% 200);
}
</style>