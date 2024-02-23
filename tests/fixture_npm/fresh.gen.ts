// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/index.tsx": await import("./routes/index.tsx"),
  },
  islands: {
    "./islands/Test.tsx": await import("./islands/Test.tsx"),
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
