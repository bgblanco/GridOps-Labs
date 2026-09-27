// Builds a single self-contained HTML preview of the site (for sharing without deploying).
import { build } from "esbuild";
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "dist-preview");
mkdirSync(out, { recursive: true });

const shim = (p) => path.join(root, "preview/shims", p);
const alias = {
  "next/link": shim("link.tsx"),
  "next/navigation": shim("navigation.ts"),
  "react/jsx-runtime": shim("jsx-runtime.js"),
  "react/jsx-dev-runtime": shim("jsx-runtime.js"),
  "react-dom/client": shim("react-dom-global.js"),
  react: shim("react-global.js"),
};

const result = await build({
  entryPoints: [path.join(root, "preview/main.tsx")],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2020",
  write: false,
  jsx: "automatic",
  alias: { "@": path.join(root, "src"), ...alias },
  plugins: [{
    name: "globals",
    setup(b) {
      for (const [k, v] of Object.entries(alias)) b.onResolve({ filter: new RegExp(`^${k.replace("/", "\\/")}$`) }, () => ({ path: v }));
      b.onResolve({ filter: /^@\// }, (a) => b.resolve("./" + a.path.slice(2), { resolveDir: path.join(root, "src"), kind: a.kind }));
    },
  }],
  define: { "process.env.NEXT_PUBLIC_SUBMIT_ENDPOINT": '""', "process.env.NEXT_PUBLIC_SITE_URL": '"https://gridopslabs.com"', "process.env.NODE_ENV": '"production"' },
});
const js = result.outputFiles[0].text;

execSync(`npx @tailwindcss/cli -i src/app/globals.css -o dist-preview/site.css --minify`, { cwd: root, stdio: "inherit" });
const css = readFileSync(path.join(out, "site.css"), "utf8");

const html = `<title>GridOps Labs</title>
<meta name="description" content="Scenario-based proficiency training for electric distribution operators.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Silkscreen&display=swap">
<style>${css}</style>
<div id="gridops-root"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
<script>${js.replace(/<\/script/gi, "<\\/script")}</script>
`;
writeFileSync(path.join(out, "gridops-labs.html"), html);
console.log("preview:", (html.length / 1024).toFixed(0), "KB");
