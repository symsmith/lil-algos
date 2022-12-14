<script lang="ts">
	import Slider from "./components/Slider.svelte"
	import Tile from "./components/Tile.svelte"
	import { fillDoubleArray, getNextFrame } from "./lib/functions"

	let width = 15,
		height = 20,
		speed = 5, // frames per second
		drop = 5 // index of dropping item

	let paused = false

	let walls = fillDoubleArray(height, width)
	$: walls, (walls[0][drop] = false)
	let sand = fillDoubleArray(height, width)

	let interval: NodeJS.Timer
	updateFrame()
	$: {
		clearInterval(interval)
		interval = setInterval(updateFrame, 1000 / speed)
	}

	function updateFrame() {
		if (!paused) {
			sand = getNextFrame(walls, sand, drop)
		}
	}

	function clearBoard() {
		walls = fillDoubleArray(height, width)
	}
</script>

<main class="flex flex-col items-center gap-2 py-10">
	<div class="board flex flex-col">
		<div class="flex">
			{#each { length: width } as _, j}
				<div class="h-5 w-5 select-none ">
					{#if j === drop}
						<p class="text-center">↓</p>
					{/if}
				</div>
			{/each}
		</div>
		<div class="flex flex-col items-center ">
			{#each { length: height } as _, i}
				<div class="m-0 flex p-0">
					{#each { length: width } as _, j}
						<Tile
							bind:isWall={walls[i][j]}
							isSand={sand[i][j]}
							{i}
							{j}
							disabled={i === 0 && j === drop}
						/>
					{/each}
				</div>
			{/each}
		</div>
	</div>
	<div class="flex justify-center gap-3">
		<button class="w-20 text-right" on:click={() => (paused = !paused)}
			>{paused ? "play" : "pause"}</button
		>
		<button class="w-20 text-left" on:click={clearBoard}>clear</button>
	</div>
	<Slider name="drop" min={0} max={width - 1} bind:value={drop} />
	<Slider name="speed" max={60} bind:value={speed} />
</main>
