import { defineConfig, mergeConfig } from "vite";
import { defineConfig as defineTestConfig } from "vitest/config";
import dts from "vite-plugin-dts";
const testConfig = defineTestConfig({
	test: {
		globals: true,
	},
});
export default mergeConfig(
	defineConfig({
		build: {
			target: "modules",
			outDir: "dist",
			minify: true,
			lib: {
				entry: "src/index.tsx",
				formats: ["es", "cjs"],
				fileName: (format) => {
					if (format === "es") return "[name].mjs";
					if (format === "cjs") return "[name].js";
					return `[name].${format}`;
				},
			},
			rollupOptions: {
				external: ["react", "react-dom", "react/jsx-runtime"],
				output: {},
			},
		},
		plugins: [
			dts({
				entryRoot: "src",
				include: "src/**/*",
				insertTypesEntry: false,
				outDir: "dist",
			}),
		],
	}),
	testConfig,
);
