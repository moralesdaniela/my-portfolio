<script>
import Pie from '$lib/Pie.svelte'
import projects from '$lib/projects.json';
import Project from "$lib/Project.svelte";
import * as d3 from "d3";





let query = "";
let filteredProjects;
let filteredByYear;

let rolledData;

let pieData;
let selectedYearIndex = -1;

let selectedYear;

$: {
    pieData = {};
    filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join("\n").toLowerCase();
        return values.includes(query.toLowerCase());
    });
    
    rolledData  = d3.rollups(filteredProjects, v => v.length, d => d.year) || [];

    pieData = rolledData.map(([year, count]) => {
	    return { value: count, label: year };
    });
    selectedYear = selectedYearIndex > -1 ? pieData[selectedYearIndex].label : null;
    filteredByYear = filteredProjects.filter((project) => {
        return selectedYear ? project.year === selectedYear : true;
    });
}





</script>

<Pie data={pieData} bind:selectedIndex={selectedYearIndex} />
<svelte:head>
	<title>My Projects</title>
</svelte:head>

<input type="search" bind:value={query}
       aria-label="Search projects" placeholder="🔍 Search projects…" />
<h1> { filteredByYear.length } Projects </h1>

     <div class="projects">
        {#each filteredByYear as p}
        <Project info ={p}/>
{/each}
</div>






   
