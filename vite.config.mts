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
			lib: {
				entry: "src/index.tsx",
				formats: ["es", "cjs"],
				fileName: (format) => `index.${format === "cjs" ? "cjs" : "js"}`,
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
