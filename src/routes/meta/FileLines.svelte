<script>
    import * as d3 from "d3";
    import { scale } from 'svelte/transition';
    import { flip as originalFlip } from "svelte/animate";


    export let lines;
    export let colors = d3.scaleOrdinal(d3.schemeTableau10);

    // let files = [];
    // $: {
    // 	files = d3.groups(lines, d => d.file).map(([name, lines]) => {
    // 		return {name, lines};
    // 	});
    //     files = d3.sort(files, d => -d.lines.length);
    // }

    // Define how many lines each circle should represent
    const linesPerCircle = 10; // Adjust this number as needed

    let files = [];
    $: {
        files = d3.groups(lines, d => d.file).map(([name, lines]) => {
            // Group lines into buckets of 'linesPerCircle' lines each
            let groupedLines = [];
            for (let i = 0; i < lines.length; i += linesPerCircle) {
                groupedLines.push(lines.slice(i, i + linesPerCircle));
            }
            return { name, lines: groupedLines };
        });
        files = d3.sort(files, d => -d.lines.length);
    }

    // let colors = d3.scaleOrdinal(d3.schemeTableau10);

    function getFlip () {
        return originalFlip;
    }

    $: flip = getFlip(files);
    

</script>

<!-- <dl class="files">
	{#each files as file (file.name) }
		<div>
			<dt>
				<code>{file.name}</code>
                <small>{file.lines.length} lines</small>
			</dt>
			<dd>{#each file.lines as line (line.line) }
                <div class="line" in:scale={{ duration: 900, start: 0, opacity: 0.5 }} style="--color: { colors(line.type) }" 
                animate:flip={{duration: 300, delay: 100}}>
                </div>
            {/each}
            </dd>
		</div>
	{/each}
</dl> -->

<dl class="files">
    {#each files as file (file.name)}
    <div>
        <dt>
            <code>{file.name}</code>
            <small>{file.lines.flat().length} lines</small> <!-- `.flat()` to count all lines -->
        </dt>
        <dd>
            {#each file.lines as lineGroup (lineGroup[0].line)} <!-- lineGroup is now an array of lines -->
                <div class="line" in:scale={{ duration: 900, start: 0, opacity: 0.5 }} style="--color: {colors(lineGroup[0].type)}"
                     animate:flip>
                    <!-- Display a single circle for the group -->
                </div>
            {/each}
        </dd>
    </div>
{/each}
</dl>


<style>

.files {
        display: grid;
        grid-template-columns: auto 1fr; /* Left column for names, right column for dots */
    }

    .files > div {
        display: contents; /* This makes the child dt and dd part of the parent grid */
        background: hsl(0 0% 100% / 90%);
	    box-shadow: 0 0 .2em .2em hsl(0 0% 100% / 90%);
    }

    dt {
        grid-column: 1; /* Name column */
    }

    dd {
        grid-column: 2; /* Dots column */
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start; /* Align items to the top */
        gap: .15em; /* Spacing between dots */
        padding-top: 0.6em;
    }

    .line {
        width: .5em; /* Adjust the width as needed */
        height: .5em; /* Adjust the height as needed */
        background: var(--color); /*Use the custom property for the color*/
        border-radius: 50%; /* Makes dots circular */
        margin-right: 2px; /* Adjust spacing between dots if needed */
    }

    /* .files {
        display: grid;
        grid-template-columns: auto 1fr; /* Left column for names, right column for dots
    }*/

    small {
        display: block;
        font-size: 80%;
        opacity: 50%;
    }

</style>