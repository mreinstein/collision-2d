# generate animated pngs in docs/ from all of the examples in figures/

deno run --allow-read --allow-write --allow-run --allow-net --allow-import cli-figure-to-apng.ts --module figures/aabb-segments-sweep1-indexed.js --count 245 --output docs/aabb-segments-sweep1-indexed.png

deno run --allow-read --allow-write --allow-run --allow-net --allow-import cli-figure-to-apng.ts --module figures/aabb-segment-sweep1.js --count 245 --output docs/aabb-segment-sweep1.png

deno run --allow-read --allow-write --allow-run --allow-net --allow-import cli-figure-to-apng.ts --module figures/aabb-aabb-overlap.js --count 3000 --output docs/aabb-aabb-overlap.png

deno run --allow-read --allow-write --allow-run --allow-net --allow-import cli-figure-to-apng.ts --module figures/aabb-aabb-sweep1.js --count 245 --output docs/aabb-aabb-sweep1.png

deno run --allow-read --allow-write --allow-run --allow-net --allow-import cli-figure-to-apng.ts --module figures/aabb-aabb-sweep2.js --count 245 --output docs/aabb-aabb-sweep2.png

deno run --allow-read --allow-write --allow-run --allow-net --allow-import cli-figure-to-apng.ts --module figures/aabb-point-overlap.js --count 1200 --output docs/aabb-point-overlap.png

deno run --allow-read --allow-write --allow-run --allow-net --allow-import cli-figure-to-apng.ts --module figures/aabb-segment-overlap.js --count 1600 --output docs/aabb-segment-overlap.png

deno run --allow-read --allow-write --allow-run --allow-net --allow-import cli-figure-to-apng.ts --module figures/ray-plane-distance.js --count 1200 --output docs/ray-plane-distance.png

deno run --allow-read --allow-write --allow-run --allow-net --allow-import cli-figure-to-apng.ts --module figures/segment-point-overlap.js --count 1200 --output docs/segment-point-overlap.png

deno run --allow-read --allow-write --allow-run --allow-net --allow-import cli-figure-to-apng.ts --module figures/segment-segment-overlap.js --count 1200 --output docs/segment-segment-overlap.png

deno run --allow-read --allow-write --allow-run --allow-net --allow-import cli-figure-to-apng.ts --module figures/segments-segment-overlap.js --count 1200 --output docs/segments-segment-overlap.png

deno run --allow-read --allow-write --allow-run --allow-net --allow-import cli-figure-to-apng.ts --module figures/segments-sphere-sweep1.js --count 122 --output docs/segments-sphere-sweep1.png

deno run --allow-read --allow-write --allow-run --allow-net --allow-import cli-figure-to-apng.ts --module figures/sphere-sphere-overlap.js --count 245 --output docs/sphere-sphere-overlap.png

deno run --allow-read --allow-write --allow-run --allow-net --allow-import cli-figure-to-apng.ts --module figures/triangle-point-overlap.js --count 1200 --output docs/triangle-point-overlap.png

deno run --allow-read --allow-write --allow-run --allow-net --allow-import cli-figure-to-apng.ts --module figures/cone-point-overlap.js --count 1200 --output docs/cone-point-overlap.png

deno run --allow-read --allow-write --allow-run --allow-net --allow-import cli-figure-to-apng.ts --module figures/ray-sphere-overlap.js --count 1200 --output docs/ray-sphere-overlap.png

deno run --allow-read --allow-write --allow-run --allow-net --allow-import cli-figure-to-apng.ts --module figures/segment-sphere-overlap.js --count 1200 --output docs/segment-sphere-overlap.png
