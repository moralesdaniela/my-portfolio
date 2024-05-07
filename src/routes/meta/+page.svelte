<script>
    import * as d3 from "d3";
    import { onMount } from "svelte";
    import {
        computePosition,
        autoPlacement,
        offset,
    } from '@floating-ui/dom';
    import Pie from "$lib/Pie.svelte";

    import CommitScatterplot from "./Scatterplot.svelte"

    import FileLines from "./FileLines.svelte"

    import Scrolly from "svelte-scrolly";

    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    let data = [];
    let commits = [];
    let width = 1000, height = 600;
    let margin = {top: 10, right: 10, bottom: 30, left: 20};
    let fileLengths;
    let selectedCommits = [];


    let commitProgress = 100;
    let raceProgress = 100;





    $: timeScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.datetime))
        .range([0, 100]);

    $: commitMaxTime = timeScale.invert(commitProgress);
    $: raceMaxTime = timeScale.invert(raceProgress);






    onMount(async () => {
        data = await d3.csv("loc.csv", row => ({
            ...row,
            line: Number(row.line), // or just +row.line
            depth: Number(row.depth),
            length: Number(row.length),
            date: new Date(row.date + "T00:00" + row.timezone),
            datetime: new Date(row.datetime)
        }));
        commits = d3.groups(data, d => d.commit).map(([commit, lines]) => {
            let first = lines[0];
            let {author, date, time, timezone, datetime} = first;
            let ret = {
                id: commit,
                url: "https://github.com/moralesdaniela/my-portfolio/commit/" + 
                commit, author, date, time, timezone, datetime,
                hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
                totalLines: lines.length
            };





            // Like ret.lines = lines
            // but non-enumerable so it doesn’t show up in JSON.stringify
            Object.defineProperty(ret, "lines", {
                value: lines,
                configurable: true,
                writable: true,
                enumerable: false,
            });





            return ret;
        });
        commits = d3.sort(commits, d => -d.totalLines);
        console.log(commits)
    });

    $: maxDepth = d3.max(data, d => d.depth);
    $: numberFiles = d3.groups(data, d => d.file).length;
    $: fileLengths = d3.rollups(data, v => d3.max(v, v => v.line), d => d.file);
    $: averageFileLength = d3.mean(fileLengths, d => d[1]);
    $: workByPeriod = d3.rollups(data, v => v.length, d => d.datetime.toLocaleString("en", {dayPeriod: "short"}))
    $: maxPeriod = d3.greatest(workByPeriod, (d) => d[1])?.[0];

    $: filteredCommits = commits.filter(commit => commit.datetime <= commitMaxTime);
    $: filteredLines = data.filter(data => data.datetime <= commitMaxTime)

    $: raceCommits = commits.filter(commit => commit.datetime <= raceMaxTime);
    $: raceLines = data.filter(data => data.datetime <= raceMaxTime)


    $: hasSelection = selectedCommits.length > 0;
    $: selectedLines = (hasSelection ? selectedCommits : filteredCommits).flatMap(d => d.lines);

    $: languageBreakdown = d3.flatRollup(
        selectedLines,
        (d) => d.length,
        (d) => d.type
    );


</script>

<svelte:head>
    <title>Meta</title>
</svelte:head>


<h1>Meta Stats</h1>
<dl class="stats">
    <dt>Commits</dt>
    <dd>{filteredCommits.length}</dd>
    <dt>Total <abbr title="Lines of code">LOC</abbr></dt>
    <dd>{data.length}</dd>
    <dt>Number of files</dt>
    <dd>{numberFiles}</dd>
    <!-- <dt>Max Depth</dt>
    <dd>{maxDepth}</dd> -->
    <!-- <dt>Average file length</dt>
    <dd>{averageFileLength}</dd> -->
    <dt>most work</dt>
    <dd>{maxPeriod}</dd>
</dl>


<Scrolly bind:progress={ commitProgress }>
    The story behind my commits
    {#each commits as commit, index }
        <p>
            On {commit.datetime.toLocaleString("en", {dateStyle: "full", timeStyle: "short"})},
            I made <a href="{commit.url}" target="_blank">{ index > 0 ? 'another glorious commit' : 'my first commit, and it was glorious' }</a>.
            I edited {commit.totalLines} lines across { d3.rollups(commit.lines, D => D.length, d => d.file).length } files.
            Then I looked over all I had made, and I saw that it was very good.
        </p>
    {/each}
    <svelte:fragment slot="viz">
        <CommitScatterplot commits={filteredCommits} bind:selectedCommits={selectedCommits} bind:filteredLines={filteredLines} colors={colors}/>
        <Pie data={Array.from(languageBreakdown).map(([language, lines]) => ({label: language, value: lines}))} />
    </svelte:fragment>
</Scrolly>


<Scrolly bind:progress={raceProgress} --scrolly-layout="viz-first" --scrolly-viz-width="1.5fr">
    My commits in dots
    {#each commits as commit, index }
        <p>
            On {commit.datetime.toLocaleString("en", {dateStyle: "full", timeStyle: "short"})},
            I made <a href="{commit.url}" target="_blank">{ index > 0 ? 'another glorious commit' : 'my first commit, and it was glorious' }</a>.
            I edited {commit.totalLines} lines across { d3.rollups(commit.lines, D => D.length, d => d.file).length } files.
            Then I looked over all I had made, and I saw that it was very good.
        </p>
    {/each}
    <svelte:fragment slot="viz">
        <FileLines lines={raceLines} colors={colors}/>
    </svelte:fragment>
</Scrolly>

<!-- <CommitScatterplot commits={filteredCommits} bind:selectedCommits={selectedCommits} bind:filteredLines={filteredLines} colors={colors}/>
    <Pie data={Array.from(languageBreakdown).map(([language, lines]) => ({label: language, value: lines}))} /> -->


<p>{hasSelection ? selectedCommits.length : "No"} commit{selectedCommits.length ===
1
    ? ""
    : "s"} selected </p>

<div>
    <h3 style="font-weight: bold;">Language Breakdown</h3>
    
    <dl class="breakdown">
        {#each languageBreakdown as [language, lines]}
            <div>
                <dt>{language}</dt>
                <dd>{lines} lines ({d3.format(".1~%")(lines/selectedLines.length)})</dd>
            </div>
        {/each}
    </dl>
</div>

<style>
    .stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr); /* Creates two columns, one for dt and one for dd */
        grid-auto-rows: auto; /* Adjusts row height automatically based on content */
        gap: 10px; /* Space between grid items */
        max-width: 600px; /* Adjust based on your preference */
        margin: 20px auto; /* Centers the dl and adds some margin */
        padding: 20px; /* Padding inside the dl */
        border: 1px solid #ccc; /* Border around the dl */
        border-radius: 10px; /* Rounded corners for the dl */
        background-color: #f9f9f9; /* Light background for the dl */
    }

    .stats dt, .stats dd {
        margin: 0; /* Removes default margin */
    }

    .stats dt {
        grid-column: 1; /* Places all dt in the first column */
        font-weight: bold; /* Makes dt labels bold */
    }

    .stats dd {
        grid-column: 2; /* Places all dd in the second column */
        text-align: right; /* Aligns dd values to the right */
    }

    @keyframes marching-ants {
        to {
            stroke-dashoffset: -8; /* 5 + 3 */
        }
    }

    svg :global(.selection) {
        fill-opacity: 10%;
        stroke: black;
        stroke-opacity: 70%;
        stroke-dasharray: 5 3;
        animation: marching-ants 2s linear infinite;
    }
    svg {
        overflow: visible;
    }
    .gridlines {
        stroke-opacity: .2;
    }
    dl.info {
        display: grid;
        grid-template-columns: auto auto; /* Defines two columns */
        column-gap: 20px; /* Adjusts the space between the two columns */
        row-gap: 10px; /* Adjusts the space between each row */
        transition-duration: 500ms;
        transition-property: opacity, visibility;

        &[hidden]:not(:hover, :focus-within) {
            opacity: 0;
            visibility: hidden;
        }
    }

    dl.info dt, dl.info dd {
        margin: 0; /* Removes default margin for a cleaner look */
    }
    .tooltip {
        display: grid;
        position: fixed;
        top: 1em;
        left: 1em;
        background-color: oklch(40% 0.15 250 / 40%);
        box-shadow: gray;
        border-radius: 0.5em;
        backdrop-filter: blur();
        padding: 1em;
    }
    circle {
        transition: 200ms;
        fill-opacity: 0.3;
        fill: steelblue;

        &:hover {
            transform: scale(2.5);
            transform-origin: center;
            transform-box: fill-box;
        }
    }
    .circle-selected {
        fill: darkred; /* Change this color as needed */
        transition: fill 200ms;
    }

</style>
