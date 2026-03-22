import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";

export default defineConfig({
	site: "https://alexanderniebuhr.garden",
	output: "server",
	adapter: cloudflare({
		imageService: "cloudflare-binding",
	}),
	compressHTML: false,
	experimental: {
		clientPrerender: true,
		contentIntellisense: true,
		svgo: true,
		rustCompiler: false,
		queuedRendering: {
			enabled: false,
			contentCache: true,
		},
	},
	i18n: {
		locales: ["en", "de"],
		defaultLocale: "en",
		routing: {
			prefixDefaultLocale: true,
			fallbackType: "redirect",
			redirectToDefaultLocale: false,
		},
		fallback: {
			de: "en",
		},
	},
	prefetch: {
		defaultStrategy: "hover",
	},
	integrations: [expressiveCode(), sitemap()],
	devToolbar: {
		enabled: false,
	},
	vite: {
		css: {
			transformer: "lightningcss",
			lightningcss: {
				targets: browserslistToTargets(
					browserslist([
						"> 0.5%",
						"last 2 versions",
						"Firefox ESR",
						"not dead",
						"cover 80% in CN",
						"unreleased versions",
					]),
				),
			},
		},
		build: {
			minify: false,
			cssMinify: false,
		},
		plugins: [tailwindcss()],
	},
});
