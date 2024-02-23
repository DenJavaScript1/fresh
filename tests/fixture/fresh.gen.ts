// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/404-from-middleware-throw/_middleware.ts": await import(
      "./routes/404-from-middleware-throw/_middleware.ts"
    ),
    "./routes/404-from-middleware-throw/index.tsx": await import(
      "./routes/404-from-middleware-throw/index.tsx"
    ),
    "./routes/404-from-middleware/_middleware.ts": await import(
      "./routes/404-from-middleware/_middleware.ts"
    ),
    "./routes/404-from-middleware/index.tsx": await import(
      "./routes/404-from-middleware/index.tsx"
    ),
    "./routes/404_from_throw.tsx": await import("./routes/404_from_throw.tsx"),
    "./routes/[name].tsx": await import("./routes/[name].tsx"),
    "./routes/_404.tsx": await import("./routes/_404.tsx"),
    "./routes/_500.tsx": await import("./routes/_500.tsx"),
    "./routes/_app.tsx": await import("./routes/_app.tsx"),
    "./routes/_middleware.ts": await import("./routes/_middleware.ts"),
    "./routes/admin/[site].tsx": await import("./routes/admin/[site].tsx"),
    "./routes/api/get_only.ts": await import("./routes/api/get_only.ts"),
    "./routes/api/head_override.ts": await import(
      "./routes/api/head_override.ts"
    ),
    "./routes/assetsCaching/index.tsx": await import(
      "./routes/assetsCaching/index.tsx"
    ),
    "./routes/books/[id].tsx": await import("./routes/books/[id].tsx"),
    "./routes/connInfo.ts": await import("./routes/connInfo.ts"),
    "./routes/ctx_config.tsx": await import("./routes/ctx_config.tsx"),
    "./routes/ctx_config_props.tsx": await import(
      "./routes/ctx_config_props.tsx"
    ),
    "./routes/error_boundary.tsx": await import("./routes/error_boundary.tsx"),
    "./routes/event_handler_string.tsx": await import(
      "./routes/event_handler_string.tsx"
    ),
    "./routes/event_handler_string_island.tsx": await import(
      "./routes/event_handler_string_island.tsx"
    ),
    "./routes/evil.tsx": await import("./routes/evil.tsx"),
    "./routes/failure.ts": await import("./routes/failure.ts"),
    "./routes/foo.bar.baz.tsx": await import("./routes/foo.bar.baz.tsx"),
    "./routes/foo.bar.tsx": await import("./routes/foo.bar.tsx"),
    "./routes/head_deduplicate.tsx": await import(
      "./routes/head_deduplicate.tsx"
    ),
    "./routes/hooks-server/island.tsx": await import(
      "./routes/hooks-server/island.tsx"
    ),
    "./routes/hooks-server/useReducer.tsx": await import(
      "./routes/hooks-server/useReducer.tsx"
    ),
    "./routes/hooks-server/useState.tsx": await import(
      "./routes/hooks-server/useState.tsx"
    ),
    "./routes/i18n/[[lang]]/lang.tsx": await import(
      "./routes/i18n/[[lang]]/lang.tsx"
    ),
    "./routes/index.tsx": await import("./routes/index.tsx"),
    "./routes/intercept.tsx": await import("./routes/intercept.tsx"),
    "./routes/intercept_args.tsx": await import("./routes/intercept_args.tsx"),
    "./routes/island_json.tsx": await import("./routes/island_json.tsx"),
    "./routes/islands/index.tsx": await import("./routes/islands/index.tsx"),
    "./routes/islands/multiple_island_exports.tsx": await import(
      "./routes/islands/multiple_island_exports.tsx"
    ),
    "./routes/islands/returning_null.tsx": await import(
      "./routes/islands/returning_null.tsx"
    ),
    "./routes/islands/root_fragment.tsx": await import(
      "./routes/islands/root_fragment.tsx"
    ),
    "./routes/islands/root_fragment_conditional_first.tsx": await import(
      "./routes/islands/root_fragment_conditional_first.tsx"
    ),
    "./routes/layeredMdw/_middleware.ts": await import(
      "./routes/layeredMdw/_middleware.ts"
    ),
    "./routes/layeredMdw/layer2-no-mw/without_mw.ts": await import(
      "./routes/layeredMdw/layer2-no-mw/without_mw.ts"
    ),
    "./routes/layeredMdw/layer2-with-params/[tenantId]/[id].ts": await import(
      "./routes/layeredMdw/layer2-with-params/[tenantId]/[id].ts"
    ),
    "./routes/layeredMdw/layer2-with-params/[tenantId]/_middleware.ts":
      await import(
        "./routes/layeredMdw/layer2-with-params/[tenantId]/_middleware.ts"
      ),
    "./routes/layeredMdw/layer2-with-params/_middleware.ts": await import(
      "./routes/layeredMdw/layer2-with-params/_middleware.ts"
    ),
    "./routes/layeredMdw/layer2/_middleware.ts": await import(
      "./routes/layeredMdw/layer2/_middleware.ts"
    ),
    "./routes/layeredMdw/layer2/abc.ts": await import(
      "./routes/layeredMdw/layer2/abc.ts"
    ),
    "./routes/layeredMdw/layer2/index.ts": await import(
      "./routes/layeredMdw/layer2/index.ts"
    ),
    "./routes/layeredMdw/layer2/layer3/[id].ts": await import(
      "./routes/layeredMdw/layer2/layer3/[id].ts"
    ),
    "./routes/layeredMdw/layer2/layer3/_middleware.ts": await import(
      "./routes/layeredMdw/layer2/layer3/_middleware.ts"
    ),
    "./routes/layeredMdw/nesting/[tenant]/[environment]/[id].tsx": await import(
      "./routes/layeredMdw/nesting/[tenant]/[environment]/[id].tsx"
    ),
    "./routes/layeredMdw/nesting/[tenant]/[environment]/_middleware.ts":
      await import(
        "./routes/layeredMdw/nesting/[tenant]/[environment]/_middleware.ts"
      ),
    "./routes/layeredMdw/nesting/[tenant]/_middleware.ts": await import(
      "./routes/layeredMdw/nesting/[tenant]/_middleware.ts"
    ),
    "./routes/layeredMdw/nesting/_middleware.ts": await import(
      "./routes/layeredMdw/nesting/_middleware.ts"
    ),
    "./routes/middleware-error-handler/_middleware.ts": await import(
      "./routes/middleware-error-handler/_middleware.ts"
    ),
    "./routes/middleware-error-handler/index.tsx": await import(
      "./routes/middleware-error-handler/index.tsx"
    ),
    "./routes/middleware_root.ts": await import("./routes/middleware_root.ts"),
    "./routes/movies/[foo].json.ts": await import(
      "./routes/movies/[foo].json.ts"
    ),
    "./routes/movies/[foo]@[bar].ts": await import(
      "./routes/movies/[foo]@[bar].ts"
    ),
    "./routes/nonce_inline.tsx": await import("./routes/nonce_inline.tsx"),
    "./routes/not_found.ts": await import("./routes/not_found.ts"),
    "./routes/params.tsx": await import("./routes/params.tsx"),
    "./routes/preact/boolean_attrs.tsx": await import(
      "./routes/preact/boolean_attrs.tsx"
    ),
    "./routes/props/[id].tsx": await import("./routes/props/[id].tsx"),
    "./routes/route-groups-islands/index.tsx": await import(
      "./routes/route-groups-islands/index.tsx"
    ),
    "./routes/route-groups/(bar)/(baz)/_layout.tsx": await import(
      "./routes/route-groups/(bar)/(baz)/_layout.tsx"
    ),
    "./routes/route-groups/(bar)/(baz)/baz.tsx": await import(
      "./routes/route-groups/(bar)/(baz)/baz.tsx"
    ),
    "./routes/route-groups/(bar)/_layout.tsx": await import(
      "./routes/route-groups/(bar)/_layout.tsx"
    ),
    "./routes/route-groups/(bar)/bar.tsx": await import(
      "./routes/route-groups/(bar)/bar.tsx"
    ),
    "./routes/route-groups/(bar)/boof/index.tsx": await import(
      "./routes/route-groups/(bar)/boof/index.tsx"
    ),
    "./routes/route-groups/(foo)/_layout.tsx": await import(
      "./routes/route-groups/(foo)/_layout.tsx"
    ),
    "./routes/route-groups/(foo)/index.tsx": await import(
      "./routes/route-groups/(foo)/index.tsx"
    ),
    "./routes/signal_shared.tsx": await import("./routes/signal_shared.tsx"),
    "./routes/spoof_state.tsx": await import("./routes/spoof_state.tsx"),
    "./routes/state-in-props/_middleware.ts": await import(
      "./routes/state-in-props/_middleware.ts"
    ),
    "./routes/state-in-props/index.tsx": await import(
      "./routes/state-in-props/index.tsx"
    ),
    "./routes/state-middleware/_middleware.ts": await import(
      "./routes/state-middleware/_middleware.ts"
    ),
    "./routes/state-middleware/foo/_middleware.ts": await import(
      "./routes/state-middleware/foo/_middleware.ts"
    ),
    "./routes/state-middleware/foo/index.tsx": await import(
      "./routes/state-middleware/foo/index.tsx"
    ),
    "./routes/static.tsx": await import("./routes/static.tsx"),
    "./routes/status_overwrite.tsx": await import(
      "./routes/status_overwrite.tsx"
    ),
    "./routes/std.tsx": await import("./routes/std.tsx"),
    "./routes/umlaut-äöüß.tsx": await import("./routes/umlaut-äöüß.tsx"),
    "./routes/wildcard.tsx": await import("./routes/wildcard.tsx"),
  },
  islands: {
    "./islands/Counter.tsx": await import("./islands/Counter.tsx"),
    "./islands/DangerousIsland.tsx": await import(
      "./islands/DangerousIsland.tsx"
    ),
    "./islands/Foo.Bar.tsx": await import("./islands/Foo.Bar.tsx"),
    "./islands/FormIsland.tsx": await import("./islands/FormIsland.tsx"),
    "./islands/Greeter.tsx": await import("./islands/Greeter.tsx"),
    "./islands/HookIsland.tsx": await import("./islands/HookIsland.tsx"),
    "./islands/JsonIsland.tsx": await import("./islands/JsonIsland.tsx"),
    "./islands/MultipleCounters.tsx": await import(
      "./islands/MultipleCounters.tsx"
    ),
    "./islands/ReturningNull.tsx": await import("./islands/ReturningNull.tsx"),
    "./islands/RootFragment.tsx": await import("./islands/RootFragment.tsx"),
    "./islands/RootFragmentWithConditionalFirst.tsx": await import(
      "./islands/RootFragmentWithConditionalFirst.tsx"
    ),
    "./islands/StringEventIsland.tsx": await import(
      "./islands/StringEventIsland.tsx"
    ),
    "./islands/Test.tsx": await import("./islands/Test.tsx"),
    "./islands/folder/Counter.tsx": await import(
      "./islands/folder/Counter.tsx"
    ),
    "./islands/folder/subfolder/Counter.tsx": await import(
      "./islands/folder/subfolder/Counter.tsx"
    ),
    "./islands/kebab-case-counter-test.tsx": await import(
      "./islands/kebab-case-counter-test.tsx"
    ),
    "./routes/route-groups-islands/(_islands)/Counter.tsx": await import(
      "./routes/route-groups-islands/(_islands)/Counter.tsx"
    ),
    "./routes/route-groups-islands/(_islands)/invalid.tsx": await import(
      "./routes/route-groups-islands/(_islands)/invalid.tsx"
    ),
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
