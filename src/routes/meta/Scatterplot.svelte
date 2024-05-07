<script>
    import * as d3 from "d3";
    import {
	computePosition,
	autoPlacement,
	offset,
    } from '@floating-ui/dom';

    export let commits;
    export let selectedCommits = [];
    export let filteredLines = [];

    let hoveredIndex = -1;
    let showTooltip = false;
    $: hoveredCommit = commits[hoveredIndex] ?? {};

    let commitTooltip;
    let tooltipPosition = {x: 0, y: 0};

    let width = 1000, height = 600;
    let margin = {top: 10, right: 10, bottom: 30, left: 20};


    let usableArea = {
        top: margin.top,
        right: width - margin.right,
        bottom: height - margin.bottom,
        left: margin.left
    };
    usableArea.width = usableArea.right - usableArea.left;
    usableArea.height = usableArea.bottom - usableArea.top;

    $: xScale = d3.scaleTime()
        .domain(d3.extent(filteredLines, d => d.datetime))
        .range([usableArea.left, usableArea.right])
        .nice();

    $: yScale = d3.scaleLinear()
        .domain([0, 24])
        .range([usableArea.bottom, usableArea.top]);

    $: rScale = d3
        .scaleSqrt()
        .domain(d3.extent(commits.map((d) => d.totalLines)))
        .range([1, 27]);

    let xAxis, yAxis, yAxisGridlines;

    $: {
    	d3.select(xAxis).call(d3.axisBottom(xScale));
        d3.select(yAxis).call(d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, "0") + ":00"));
        d3.select(yAxisGridlines).call(d3.axisLeft(yScale).tickFormat("").tickSize(-usableArea.width))

    }

    async function dotInteraction (index, evt) {
        let hoveredDot = evt.target;
        hoveredIndex = index;
	    if (evt.type === "mouseenter" || evt.type === "focus") {
	        // dot hovered
            // cursor = {x: evt.x, y: evt.y};
            showTooltip = true;
            tooltipPosition = await computePosition(hoveredDot, commitTooltip, {
	        strategy: "fixed", // because we use position: fixed
	        middleware: [
		    offset(5), // spacing from tooltip to dot
		    autoPlacement() // see https://floating-ui.com/docs/autoplacement
	        ],
        });
        }
        else if (evt.type === "mouseleave" || evt.type === "blur") {
	        // dot unhovered
            // hoveredIndex = -1;
            showTooltip = false;
        }
        else if (evt.type === "click" || evt.type === "keyup" && evt.key === "Enter") {
            // console.log(commits[index])
            selectedCommits = [commits[index]]
        }
    }
    // let brushSelection;
    // $: brushSelection = undefined;
    function brushed (evt) {
	    let brushSelection = evt.selection;
	    selectedCommits = !brushSelection ? [] : commits.filter(commit => {
	    	let min = {x: brushSelection[0][0], y: brushSelection[0][1]};
	    	let max = {x: brushSelection[1][0], y: brushSelection[1][1]};
	    	let x = xScale(commits.date);
	    	let y = yScale(commits.hourFrac);
        
	    	return x >= min.x && x <= max.x && y >= min.y && y <= max.y;
	});
}

function isCommitSelected (commit) {
	    return selectedCommits.includes(commit);
    }

    let svg;
    $: {
        d3.select(svg).call(d3.brush().on("start brush end", brushed));
        // d3.select(svg).call(d3.brush());
        d3.select(svg).selectAll(".dots, .overlay ~ *").raise();
        }

    // $: filteredLines = data.filter(data => data.datetime <= commitMaxTime) 

</script>

<h3 style="font-weight: bold"> Commits by time of day </h3>
<svg viewBox="0 0 {width} {height}" bind:this={svg}>
    <g class="gridlines" transform="translate({margin.left}, 0)" bind:this={yAxisGridlines} />
    <g transform="translate(0, {height - margin.bottom})" bind:this={xAxis} />
    <g transform="translate({margin.left}, 0)" bind:this={yAxis} />
	<g class="dots">
        {#each commits as commit, index (commit.id) }
            <circle 
                cx={ xScale(commit.datetime) }
                cy={ yScale(commit.hourFrac) }
                r={rScale(commit.totalLines)}
                class:selected={isCommitSelected(commit)}
                fill="steelblue"
                on:mouseenter={(evt) => dotInteraction(index, evt)}
                on:mouseleave={(evt) => dotInteraction(index, evt)}
                tabindex="0"
                aria-describedby="commit-tooltip"
                aria-haspopup="true"
                role="button"
                on:focus={(evt) => dotInteraction(index, evt)}
                on:blur={(evt) => dotInteraction(index, evt)}
                on:click={(evt) => dotInteraction(index, evt)}
                on:keyup={(evt) => dotInteraction(index, evt)}
            />
        {/each}
        </g> 
</svg>

<dl class="info" 
    hidden={!showTooltip} 
    style="top: {tooltipPosition.y}px; left: {tooltipPosition.x}px"
    bind:this={commitTooltip}
    role="tooltip" >

	<dt>Commit</dt>
	<dd><a href="{ hoveredCommit.url }" target="_blank">{ hoveredCommit.id }</a></dd>

	<dt>Author</dt>
    <dd>{ hoveredCommit.author }</dd>
    
    <dt>Date</dt>
	<dd>{ hoveredCommit.datetime?.toLocaleString("en", {date: "full"}) }</dd>

	<dt>Time</dt>
    <dd>{ hoveredCommit.time?.toLocaleString("en", {time: "full"}) }</dd>

    <dt>Lines</dt>
    <dd>{ hoveredCommit.lines?.length }</dd>
</dl>

<style>
	
    svg {
		overflow: visible;
	}

    .gridlines {
	stroke-opacity: .2;
    }

    .tooltip {
        /* display: grid; */
        /* grid-template-columns: repeat(2, 1fr); Two columns */
        /* grid-template-rows: repeat(5, auto); Five rows, height as needed */
        /* column-gap: 10px; Spacing between columns */
  /* row-gap: 10px; Spacing between rows */
        /* gap: 10px; Space between grid items */
        position: fixed;
        top: 1em;
        left: 1em;
        /* background-color: oklch(40% 0.15 250 / 40%); */
        /* box-shadow: gray; */
        /* border-radius: 0.5em; */
        /* backdrop-filter: blur(); */
        /* padding: 1em; */
    }
    circle {
        transition: 200ms;
        /* transition: all 200ms,
            r calc(var(--r) * 100ms); */
        /* fill-opacity: 0.3; */
        fill: steelblue;
        opacity: 72%;
        transform-origin: center;
        transform-box: fill-box;

        &:hover {
            transform: scale(2.5);
            /* transform-origin: center;
            transform-box: fill-box; */
        }

        @starting-style {
	        r: 0;
        }

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

    .selected {
    fill: var(--color-accent);
  }


    dl.info {
        display: grid;
        grid-template-columns: auto auto; /* Define two columns */
        grid-auto-rows: auto; /* This will create a new row for each term/description pair */
        gap: 0.5em; /* Adjust the gap between items */
        align-items: start;
        position: fixed; /* Ensure it's positioned in relation to the SVG or a relative container */
        top: 10px;
        left: 10px;
        background: oklch(100% 0% 0 / 80%); /* Semi-transparent background */
        backdrop-filter: blur(10px);
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Soft shadow for better readability */
        font-size: 0.9em;
        padding: 1em;
        transition-duration: 500ms;
        transition-property: opacity, visibility;


        &[hidden]:not(:hover, :focus-within) {
            opacity: 0;
            visibility: hidden;
        }
    }

</style>