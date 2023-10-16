import { createHandlerContext } from "$fresh-testing-library/server.ts";
import { expect } from "$fresh-testing-library/expect.ts";
import { handler } from "../../../www/routes/index.tsx";
import manifest from "../../../demo/fresh.gen.ts";

Deno.test("index.tsx route handler test...", async (t) => {
  await t.step("should redirect to init.ts", () => {
    expect(handler.GET).toBeDefined();
    const req = new Request("http://localhost:8000/");
    req.headers.set("user-agent", "Chrome");
    // @ts-ignore manifest typing
    const ctx = createHandlerContext(req, { manifest });
    const resp = handler.GET(req, ctx);
    console.log("resp", resp);
    expect(resp.status).toBe(307);
    expect(resp.headers.get("Location").endsWith("init.ts"));
  });

  await t.step("should not redirect and return status=200", () => {
    expect(handler.GET).toBeDefined();
    const req = new Request("http://localhost:8000/");
    req.headers.set("user-agent", "Chrome");
    req.headers.set("accept", "text/html");
    // @ts-ignore manifest typing
    const ctx = createHandlerContext(req, { manifest });
    // mock render to return Response-like object
    ctx.render = () => {
      return ({ body: "Hello World!", status: 200 });
    };
    const resp = handler.GET(req, ctx);
    // console.log("resp", resp);
    expect(resp.status).toBe(200);
  });
});
