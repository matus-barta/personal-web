<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	// Bob Kerman, cut out of his picture, drifting inside an invisible box: across and up-down are
	// two animations of different lengths, each easing into the box's edges and back, so the path
	// takes long to repeat, and a slow tumble all the way round on top. CSS alone. With reduced
	// motion asked for, he stays still and upright in the middle of the box.
	interface Props {
		/** The box's size and place; it needs a height, as he drifts by its size. */
		class?: ClassValue;
		/** Bob's width, a CSS length. */
		width: string;
		/** The `sizes` for his image, matching `width`. */
		sizes: string;
		/** How long one crossing takes, left to right and top to bottom. */
		across: string;
		down: string;
		/** How long one turn all the way round takes. */
		tumble: string;
	}

	let { class: className, width, sizes, across, down, tumble }: Props = $props();
</script>

<div class={['relative', className]} style:--width={width}>
	<div class="space">
		<div class="across" style:--across={across} style:--down={down}>
			<div class="down">
				<div class="tumble" style:--tumble={tumble}>
					<enhanced:img
						class="bob"
						src="#lib/assets/ksp-bob.png?w=464;232"
						{sizes}
						alt="Bob Kerman, a Kerbal Space Program astronaut, floating in space"
					/>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* The space he drifts in, and the container the drift is measured by: 100cqw is its width.
	   Inset from the box by what the tumble swings his corners out by, so he never leaves the
	   box - nor, on a phone, the screen. */
	.space {
		container-type: size;
		position: absolute;
		inset: calc(var(--width) * 0.35);
	}

	/* At rest, each layer sits halfway, so he is centred; each animation starts halfway through,
	   by a negative delay, so he sets off from the same place. */
	.across {
		position: absolute;
		top: 0;
		left: 0;
		width: var(--width);
		translate: calc((100cqw - 100%) / 2) 0;
		animation: across var(--across) ease-in-out calc(var(--across) / -2) infinite alternate;
	}
	.down {
		translate: 0 calc((100cqh - 100%) / 2);
		animation: down var(--down) ease-in-out calc(var(--down) / -2) infinite alternate;
	}
	.tumble {
		animation: tumble var(--tumble) linear infinite;
	}
	/* a class, not img: svelte-check doesn't see <enhanced:img> become an <img> */
	.bob {
		display: block;
		width: 100%;
		height: auto;
	}

	@keyframes across {
		from {
			translate: 0 0;
		}
		to {
			translate: calc(100cqw - 100%) 0;
		}
	}
	@keyframes down {
		from {
			translate: 0 0;
		}
		to {
			translate: 0 calc(100cqh - 100%);
		}
	}
	@keyframes tumble {
		to {
			rotate: 1turn;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.across,
		.down,
		.tumble {
			animation: none;
		}
	}
</style>
