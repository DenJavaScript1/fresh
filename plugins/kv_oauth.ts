import { handleCallback, signIn, signOut } from "./kv_oauth/plugin_deps.ts";
import { OAuth2ClientConfig } from "./kv_oauth/plugin_deps.ts";
import type { Plugin } from "../server.ts";

/**
 * This is a helper type to infer the routes created by the `kvOAuthPlugin` function.
 *
 * Use a KV OAuth plugin instance to infer the routes paths.
 *
 * @example
 * ```ts
 * // main.ts
 * import { start } from "$fresh/server.ts";
 * import { createGitHubOAuthConfig } from "https://deno.land/x/deno_kv_oauth@$VERSION/mod.ts";
 * import { kvOAuthPlugin } from "https://deno.land/x/deno_kv_oauth@$VERSION/fresh.ts";
 * import manifest from "./fresh.gen.ts";
 *
 * const kvOAuth = kvOAuthPlugin({
 *   github: createGitHubOAuthConfig(),
 * });
 *
 * export type KVOAuthRoutes = InferOAuthProviders<typeof kvOAuth>;
 * //            ^? type Foo = "/oauth/github/signin" | "/oauth/github/callback" | "/oauth/github/signout"
 *
 * await start(manifest, {
 *   plugins: [kvOAuth],
 * });
 * ```
 */
export type InferOAuthProviders<T, U = T extends Plugin<infer U> ? U : never> =
  {
    [K in keyof U]: K extends string ?
        | `/oauth/${K}/signin`
        | `/oauth/${K}/callback`
        | `/oauth/${K}/signout`
      : never;
  }[keyof U];

export interface KvOAuthPluginOptions {
  /**
   * Sign-in page path
   *
   * @default {"/oauth/signin"}
   */
  signInPath?: string;
  /**
   * Callback page path
   *
   * @default {"/oauth/callback"}
   */
  callbackPath?: string;
  /**
   * Sign-out page path
   *
   * @default {"/oauth/signout"}
   */
  signOutPath?: string;
}

/**
 * This creates handlers for the following routes:
 * - `GET /oauth/signin` for the sign-in page
 * - `GET /oauth/callback` for the callback page
 * - `GET /oauth/signout` for the sign-out page
 *
 * ```ts
 * // main.ts
 * import { start } from "$fresh/server.ts";
 * import kvOAuthPlugin from "$fresh/plugins/kv_oauth.ts";
 * import { createGitHubOAuthConfig } from "https://deno.land/x/deno_kv_oauth@$VERSION/mod.ts";
 * import manifest from "./fresh.gen.ts";
 *
 * await start(manifest, {
 *   plugins: [
 *     kvOAuthPlugin(createGitHubOAuthConfig())
 *   ]
 * });
 * ```
 */
export function kvOAuthPlugin(
  oauthConfig: OAuth2ClientConfig,
  options?: KvOAuthPluginOptions,
): Plugin;

/**
 * This creates handlers for the following routes:
 * - `GET /oauth/[PROVIDER_SLUG]/signin` for the sign-in page
 * - `GET /oauth/[PROVIDER_SLUG]/callback` for the callback page
 * - `GET /oauth/[PROVIDER_SLUG]/signout` for the sign-out page
 *
 * ```ts
 * // main.ts
 * import { start } from "$fresh/server.ts";
 * import { createGitHubOAuthConfig } from "https://deno.land/x/deno_kv_oauth@$VERSION/mod.ts";
 * import { kvOAuthPlugin } from "https://deno.land/x/deno_kv_oauth@$VERSION/fresh.ts";
 * import manifest from "./fresh.gen.ts";
 *
 * await start(manifest, {
 *   plugins: [
 *     kvOAuthPlugin({
 *       github: createGitHubOAuthConfig(),
 *     }),
 *   ]
 * });
 * ```
 */
export function kvOAuthPlugin<
  const TProviders extends Record<string, OAuth2ClientConfig>,
>(providers: TProviders): Plugin<TProviders>;

/**
 * This creates handlers for the following routes:
 * - `GET /oauth/signin` for the sign-in page
 * - `GET /oauth/callback` for the callback page
 * - `GET /oauth/signout` for the sign-out page
 *
 * ```ts
 * // main.ts
 * import { start } from "$fresh/server.ts";
 * import kvOAuthPlugin from "$fresh/plugins/kv_oauth.ts";
 * import { createGitHubOAuthConfig } from "https://deno.land/x/deno_kv_oauth@$VERSION/mod.ts";
 * import manifest from "./fresh.gen.ts";
 *
 * await start(manifest, {
 *   plugins: [
 *     kvOAuthPlugin(createGitHubOAuthConfig())
 *   ]
 * });
 * ```
 */
export default function kvOAuthPlugin<
  const TProviders extends Record<string, OAuth2ClientConfig>,
>(
  ...args: [
    oauthConfig: OAuth2ClientConfig,
    options?: KvOAuthPluginOptions,
  ] | [
    providers: TProviders,
  ]
): Plugin<Record<keyof TProviders, unknown>> {
  const routes: Plugin["routes"] = [];

  const [providersOrOAuthConfig] = args;

  if (providersOrOAuthConfig.clientId) {
    const [_, options] = args;
    routes.push(
      {
        path: options?.signInPath ?? "/oauth/signin",
        handler: async (req) =>
          await signIn(req, providersOrOAuthConfig as OAuth2ClientConfig),
      },
      {
        path: options?.callbackPath ?? "/oauth/callback",
        handler: async (req) => {
          // Return object also includes `accessToken` and `sessionId` properties.
          const { response } = await handleCallback(
            req,
            providersOrOAuthConfig as OAuth2ClientConfig,
          );
          return response;
        },
      },
      {
        path: options?.signOutPath ?? "/oauth/signout",
        handler: signOut,
      },
    );
  } else {
    Object.entries(providersOrOAuthConfig)
      .forEach(([providerName, oauthConfig]) =>
        routes.push(
          {
            path: `/oauth/${providerName}/signin`,
            handler: async (req) => await signIn(req, oauthConfig),
          },
          {
            path: `/oauth/${providerName}/callback`,
            handler: async (req) => {
              // Return object also includes `accessToken` and `sessionId` properties.
              const { response } = await handleCallback(
                req,
                oauthConfig,
              );
              return response;
            },
          },
          {
            path: `/oauth/${providerName}/signout`,
            handler: signOut,
          },
        )
      );
  }

  return {
    name: "kv-oauth",
    routes,
  };
}
