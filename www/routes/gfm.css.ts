import { gfm, HandlerContext } from "../server_deps.ts";

const extraCSS = `
ol.nested {
	counter-reset: item;
}

ol.nested li {
	display: block;
}

ol.nested li:before {
	font-feature-settings: "kern" 1, "tnum" 1;
	-webkit-font-feature-settings: "kern" 1, "tnum" 1;
	-ms-font-feature-settings: "kern" 1, "tnum" 1;
	-moz-font-feature-settings: "kern" 1, "tnum" 1;
	content: counters(item, ".") ". ";
	counter-increment: item;
}

.markdown-body ul {
  list-style: disk
}

.markdown-body ul {
  list-style: numeric
}`;

export const handler = {
  GET: (_ctx: HandlerContext) => {
    return new Response(
      gfm.CSS + extraCSS,
      {
        headers: {
          "content-type": "text/css",
        },
      },
    );
  },
};
