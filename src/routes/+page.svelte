<script>
import projects from '$lib/projects.json';
import Project from "$lib/Project.svelte";
</script>

<h1> Daniela Morales </h1>
<p> I am a first year MCP student at MIT. I like to swim and make art.</p>
<img src="images/Flower and Baby.jpeg" alt="Mini baby doll in a purple flower" width="500" height="400">
<div class="projects highlights">
{#each projects.slice(0,3) as p}
<Project info={p} hLevel=3 />

{/each} 
</div>
