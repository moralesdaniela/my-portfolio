<script>
import projects from '$lib/projects.json';
import Project from "$lib/Project.svelte";
</script>

<h1> Daniela Morales </h1>
<p> I am a first year MCP student at MIT. I like to swim and make art.</p>
<img src="images/Flower and Baby.jpeg" alt="Mini baby doll in a purple flower" width="500" height="400">
{#await fetch("https://api.github.com/users/moralesdaniela") }
	<p>Loading...</p>
{:then response}
	{#await response.json()}
		<p>Decoding...</p>
	{:then data}
		<section>
<h2>My GitHub Stats</h2>
<dl class="github-stats">
<div>
<p class="git-stats-metric">Followers</p>
{data.followers}
</div>
<div>
<p class="git-stats-metric">Following</p>
{data.following}
</div>
<div>
<p class="git-stats-metric">Repositories</p>
{data.public_repos}
</div>
</dl>
</section>
	{:catch error}
		<p class="error">
			Something went wrong: {error.message}
		</p>
	{/await}
{:catch error}
	<p class="error">
		Something went wrong: {error.message}
	</p>
{/await}
<div class="projects highlights">
{#each projects.slice(0,3) as p}
<Project info={p} hLevel=3 />

{/each} 
</div>
