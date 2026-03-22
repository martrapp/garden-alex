// import type { Loader } from "astro/loaders";
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// const extendedGlob = () => {
// 	const globLoader = glob({ base: "./src/content/blog", pattern: "**/*.md" });
// 	return {
// 		name: "extended-glob-loader",
// 		schema: z.object({
// 			slug: z.string(),
// 			title: z.string(),
// 			author: z.string(),
// 			date: z.coerce.date(),
// 			metadata: z.unknown().default({}),
// 		}),
// 		async load(context) {
// 			await globLoader.load(context);
// 			const originalEntries = Array.from(context.store.entries());

// 			context.store.clear();

// 			for (const [id, entry] of originalEntries) {
// 				if (!entry.filePath) continue;
// 				context.store.set({
// 					id,
// 					data: { ...entry.data, metadata: "ME" },
// 				});
// 			}
// 		},
// 	} satisfies Loader;
// };

const blog = defineCollection({
	loader: glob({ base: "./src/content/blog", pattern: "**/*.md" }),
	schema: ({ image }) =>
		z.object({
			slug: z.string(),
			title: z.string(),
			author: z.string(),
			date: z.coerce.date(),
			state: z.literal([
				"experimental",
				"building",
				"idea",
				"sharing",
				"final",
			]),
			cover: image(),
			coverAlt: z.string(),
			excerpt: z.string().optional(),
		}),
});

export const collections = {
	blog,
};
