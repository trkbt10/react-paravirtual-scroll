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
			minify: true,
			lib: {
				entry: "src/index.tsx",
				formats: ["es", "cjs"],
				fileName: (format) => `[name].${format === "cjs" ? "cjs" : "js"}`,
			},
			rollupOptions: {
				external: ["react-dom", /^react\/.+/, "react"],
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
