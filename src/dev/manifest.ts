import { join, normalize } from "./deps.ts";

/**
 * Import specifiers must have forward slashes
 */
function toImportSpecifier(file: string) {
  let specifier = normalize(file).replace(/\\/g, "/");
  if (!specifier.startsWith(".")) {
    specifier = "./" + specifier;
  }
  return specifier;
}

export interface Manifest {
  routes: string[];
  islands: string[];
}

export async function generate(directory: string, manifest: Manifest) {
  const { routes, islands } = manifest;

  const normalizedRoutes: string[] = [];
  for (let i = 0; i < routes.length; i++) {
    const file = routes[i];
    const specifier = toImportSpecifier(file);
    normalizedRoutes.push(specifier);
  }

  const normalizedIslands: string[] = [];
  for (let i = 0; i < islands.length; i++) {
    const file = islands[i];
    const specifier = toImportSpecifier(file);
    normalizedIslands.push(specifier);
  }

  const output = `// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running \`dev.ts\`.

import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    ${
    normalizedRoutes.map((specifier) =>
      `${JSON.stringify(`${specifier}`)}: await import("${specifier}"),`
    )
      .join("\n    ")
  }
  },
  islands: {
    ${
    normalizedIslands.map((specifier) =>
      `${JSON.stringify(`${specifier}`)}: await import("${specifier}"),`
    )
      .join("\n    ")
  }
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
`;

  const proc = new Deno.Command(Deno.execPath(), {
    args: ["fmt", "-"],
    stdin: "piped",
    stdout: "piped",
    stderr: "null",
  }).spawn();

  const raw = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(output));
      controller.close();
    },
  });
  await raw.pipeTo(proc.stdin);
  const { stdout } = await proc.output();

  const manifestStr = new TextDecoder().decode(stdout);
  const manifestPath = join(directory, "./fresh.gen.ts");

  await Deno.writeTextFile(manifestPath, manifestStr);
  console.log(
    `%cThe manifest has been generated for ${routes.length} routes and ${islands.length} islands.`,
    "color: blue; font-weight: bold",
  );
}
