<script>
export let info = {};
export let hLevel = 2;
</script>


<article>
        <svelte:element this={"h" + hLevel}>{ info.title }</svelte:element>
		<img src={info.image} alt="">
		<p>{info.description}</p>
		<p class="date">{info.year}</p>
		<a href={info.url || ''}>Link</a>
	</article>




