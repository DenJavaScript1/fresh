import { defineRoute } from "../../../../src/__OLD/server/defines.ts";
import { RouteConfig } from "$fresh/server.ts";
import { Partial } from "@fresh/runtime";
import { Fader } from "../../islands/Fader.tsx";

export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
};

export default defineRoute((req, ctx) => {
  return (
    <Partial name="slot-1">
      <Fader>
        <p class="status">no islands</p>
      </Fader>
    </Partial>
  );
});
