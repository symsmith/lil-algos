<script lang="ts">
	export let name: string
	export let label = name
	export let min = 1
	export let max = 10
	export let step = 1
	export let value: number
</script>

<label for={name} class="flex w-60 items-center justify-center gap-3">
	<p class="w-full select-none text-right">{label}</p>
	<input type="range" class="w-full" {name} id={name} {min} {max} bind:value {step} />
</label>
