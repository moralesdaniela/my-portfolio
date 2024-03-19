<script>
export let info = {};
export let hLevel = 2;
let p = info;
</script>


<article>
        <svelte:element this={"h" + hLevel}>{ p.title }</svelte:element>
		<img src={p.image} alt="">
		<p>{p.description}</p>
		<p class="date">{p.year}</p>
	</article>




