<script>
import Pie from '$lib/Pie.svelte'
import projects from '$lib/projects.json';
import Project from "$lib/Project.svelte";
import * as d3 from "d3";


let rolledData = d3.rollups(projects, v => v.length, d => d.year);

let pieData = rolledData.map(([year, count]) => {
	return { value: count, label: year };
});
</script>
<Pie data={pieData} />
<svelte:head>
	<title>My Projects</title>
</svelte:head>
<h1> { projects.length } Projects </h1>
    <div class="projects">
        {#each projects as p}
	<Project info={p} />
{/each}
    </div>