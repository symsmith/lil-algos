<script lang="ts">
	export let i: number
	export let j: number
	export let isWall = false
	export let isSand = false
	export let disabled = false

	const id = `${i}-${j}`
	let hovered = false
	let clicking = false

	$: if (!disabled && !isSand && hovered && clicking) {
		isWall = !isWall
	}
</script>

<svelte:window on:mousedown={() => (clicking = true)} on:mouseup={() => (clicking = false)} />

<input
	on:mouseenter={() => (hovered = true)}
	on:mouseleave={() => (hovered = false)}
	on:click|preventDefault
	bind:checked={isWall}
	type="checkbox"
	name={id}
	{disabled}
	{id}
	class="h-5 w-5 appearance-none bg-gray-200 checked:bg-gray-700"
	class:cursor-pointer={!disabled && !isSand}
	class:bg-yellow-600={isSand}
/>
