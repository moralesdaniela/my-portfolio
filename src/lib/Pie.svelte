<script> 
import * as d3 from 'd3';
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
export let data = [];
let sliceGenerator = d3.pie().value(d => d.value);
let arcData = sliceGenerator(data);
let arcs = arcData.map(d => arcGenerator(d));
let colors = d3.scaleOrdinal(d3.schemeTableau10);

</script>

<div class="container">
<svg viewBox="-50 -50 100 100">
	{#each arcs as arc,i}
    <path d={ arc } fill={ colors(i) } />
{/each}
</svg>

<ul class="legend">
	{#each data as d, index}
		<li style="--color: { colors(index) }">
			<span class="swatch"></span>
			{d.label} <em>({d.value})</em>
		</li>
	{/each}
</ul>
</div>

<style> 
.container {
    display: flex;
    align-items: center;
    gap: 2em;
}
.legend {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(9em, 1fr)); 
    border: 1px solid;
padding: 1em;
flex: 1;
}

.legend li {
        display: flex;
    justify-content: flex-start;
    align-items: center;
}
.legend .swatch {
    display: block;
width: 20px;
aspect-ratio: 1 / 1;
background-color: var(--color);
border-radius: 50%;
grid-template-columns: repeat(auto-fill, minmax(9em, 1fr));
margin-right: 1em;

}

svg {
	max-width: 20em;
	margin-block: 2em;

	/* Do not clip shapes outside the viewBox */
	overflow: visible;
}
</style>
