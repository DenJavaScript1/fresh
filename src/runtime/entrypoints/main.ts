import {
  ComponentChildren,
  ComponentType,
  Fragment,
  h,
  options,
  render,
  VNode,
} from "preact";
import { assetHashingHook } from "../utils.ts";

function createRootFragment(
  parent: Element,
  startMarker: Text | Comment,
  // We need an end marker for islands because multiple
  // islands can share the same parent node. Since
  // islands are root-level render calls any calls to
  // `.appendChild` would lead to a wrong result.
  endMarker: Text | Comment,
) {
  // @ts-ignore this is fine
  return parent.__k = {
    nodeType: 1,
    parentNode: parent,
    get firstChild() {
      const child = startMarker.nextSibling;
      if (child === endMarker) return null;
      return child;
    },
    get childNodes() {
      const children: ChildNode[] = [];

      let child = startMarker.nextSibling;
      while (child !== null && child !== endMarker) {
        children.push(child);
        child = child.nextSibling;
      }

      return children;
    },
    insertBefore(node: Node, child: Node | null) {
      parent.insertBefore(node, child ?? endMarker);
    },
    appendChild(child: Node) {
      // We cannot blindly call `.append()` as that would add
      // the new child to the very end of the parent node. This
      // leads to ordering issues when the multiple islands
      // share the same parent node.
      parent.insertBefore(child, endMarker);
    },
    removeChild(child: Node) {
      parent.removeChild(child);
    },
  };
}

function isCommentNode(node: Node): node is Comment {
  return node.nodeType === Node.COMMENT_NODE;
}
function isTextNode(node: Node): node is Text {
  return node.nodeType === Node.TEXT_NODE;
}
function isElementNode(node: Node): node is HTMLElement {
  return node.nodeType === Node.ELEMENT_NODE;
}

export function revive(
  islands: Record<string, Record<string, ComponentType>>,
  // deno-lint-ignore no-explicit-any
  props: any[],
) {
  _walkInner(
    islands,
    props,
    // markerstack
    [],
    // Keep a root node in the vnode stack to save a couple of checks
    // later during iteration
    [h(Fragment, null)],
    document.body,
  );
}

function ServerComponent(
  props: { children: ComponentChildren },
): ComponentChildren {
  return props.children;
}
ServerComponent.displayName = "PreactServerComponent";

function addPropsChild(parent: VNode, vnode: ComponentChildren) {
  const props = parent.props;
  if (props.children === null) {
    props.children = vnode;
  } else {
    if (!Array.isArray(props.children)) {
      props.children = [props.children, vnode];
    } else {
      props.children.push(vnode);
    }
  }
}

const enum MarkerKind {
  Island,
  Slot,
}

interface Marker {
  kind: MarkerKind;
  // We can remove this once we drop support for RTS <6.1.0 where
  // we rendered incorrect comments leading to `!--` and `--` being
  // included in the comment text. Therefore this is a normalized
  // string representing the actual intended comment value which makes
  // a bunch of stuff easier.
  text: string;
  startNode: Text | Comment | null;
  endNode: Text | Comment | null;
}

const HIDE_MARKERS = true;

/**
 * Replace comment markers with empty text nodes to hide them
 * in DevTools. This is done to avoid user confusion.
 */
function hideMarker(marker: Marker) {
  const { startNode, endNode } = marker;
  const parent = endNode!.parentNode!;

  if (
    !HIDE_MARKERS && startNode !== null &&
    startNode.nodeType === Node.COMMENT_NODE
  ) {
    const text = new Text("");
    marker.startNode = text;
    parent.insertBefore(text, startNode);
  }

  if (
    !HIDE_MARKERS && endNode !== null && endNode.nodeType === Node.COMMENT_NODE
  ) {
    const text = new Text("");
    marker.endNode = text;
    parent.insertBefore(text, endNode);
  }
}

/**
 * Revive islands and stich together any server rendered content.
 *
 * Conceptually we're doing an inorder depth first search over the DOM
 * to find all our comment nodes `<!--frsh-something-->` which act as
 * a marker for islands or server rendered JSX (=slots in islands).
 * Every island or server JSX has a start and an end marker, which
 * means there is no _single_ root nodes for these elements.
 * The hierarchy we need to construct for the virtual-dom tree might
 * be rendered in a flattened manner in the DOM.
 *
 * Example:
 *   <div>
 *     <!--frsh-island:0-->
 *     <!--frsh-slot:children-->
 *     <p>server content</p>
 *     <!--/frsh-slot:children-->
 *     <!--/frsh-island:0-->
 *   </div>
 *
 * Here we have a flat DOM structure, but from the virtual-dom
 * perspective we should render:
 *   <div> -> <Island> -> ServerComponent -> <p>server content</p>
 *
 * To solve this we're keeping track of the virtual-dom hierarchy
 * in a stack-like manner, but do the actual iteration in a list-based
 * fashion over an HTMLElement's children list.
 */
function _walkInner(
  islands: Record<string, Record<string, ComponentType>>,
  // deno-lint-ignore no-explicit-any
  props: any[],
  markerStack: Marker[],
  vnodeStack: VNode[],
  node: Node | Comment,
) {
  let sib: Node | null = node;
  while (sib !== null) {
    const marker = markerStack.length > 0
      ? markerStack[markerStack.length - 1]
      : null;

    // We use comment nodes to mark Fresh islands and slots
    if (isCommentNode(sib)) {
      let comment = sib.data;
      if (comment.startsWith("!--")) {
        comment = comment.slice(3, -2);
      }

      if (comment.startsWith("frsh-slot")) {
        // Note: Nested slots are not possible as they're flattened
        // already on the server.
        markerStack.push({
          startNode: sib,
          text: comment,
          endNode: null,
          kind: MarkerKind.Slot,
        });
        // @ts-ignore TS gets confused
        vnodeStack.push(h(ServerComponent, { key: comment }));
      } else if (
        marker !== null && (
          comment.startsWith("/frsh") ||
          // Check for old Preact RTS
          marker.text === comment
        )
      ) {
        // We're closing either a slot or an island
        marker.endNode = sib;

        markerStack.pop();
        const parent = markerStack.length > 0
          ? markerStack[markerStack.length - 1]
          : null;

        if (marker.kind === MarkerKind.Slot) {
          // If we're closing a slot than it's assumed that we're
          // inside an island
          if (parent?.kind === MarkerKind.Island) {
            const vnode = vnodeStack.pop();

            // For now only `props.children` is supported.
            const islandParent = vnodeStack[vnodeStack.length - 1]!;
            // Overwrite serialized `{__slot: "children"}` with the
            // actual vnode child.
            islandParent.props.children = vnode;
          }

          hideMarker(marker);
          sib = sib.nextSibling;
          continue;
        } else if (marker.kind === MarkerKind.Island) {
          // We're ready to revive this island if it has
          // no roots of its own. Otherwise we'll treat it
          // as a standard component
          if (markerStack.length === 0) {
            const vnode = vnodeStack[vnodeStack.length - 1];

            if (vnode.props.children == null) {
              const [id, exportName, n] = comment.slice("/frsh-".length).split(
                ":",
              );

              const sel = `#frsh-slot-${id}-${exportName}-${n}-children`;
              const template = document.querySelector(sel) as
                | HTMLTemplateElement
                | null;

              if (template !== null) {
                markerStack.push({
                  kind: MarkerKind.Slot,
                  endNode: null,
                  startNode: null,
                  text: "foo",
                });

                const node = template.content.cloneNode(true);
                _walkInner(
                  islands,
                  props,
                  markerStack,
                  vnodeStack,
                  node,
                );

                markerStack.pop();
              }
            }
            vnodeStack.pop();

            const parentNode = sib.parentNode! as HTMLElement;

            hideMarker(marker);

            const _render = () =>
              render(
                vnode,
                createRootFragment(
                  parentNode,
                  marker.startNode!,
                  marker.endNode!,
                  // deno-lint-ignore no-explicit-any
                ) as any as HTMLElement,
              );

            "scheduler" in window
              // `scheduler.postTask` is async but that can easily
              // fire in the background. We don't want waiting for
              // the hydration of an island block us.
              // @ts-ignore scheduler API is not in types yet
              ? scheduler!.postTask(_render)
              : setTimeout(_render, 0);

            sib = sib.nextSibling;
            continue;
          } else if (parent?.kind === MarkerKind.Slot) {
            // Treat the island as a standard component when it
            // has an island parent or a slot parent
            const vnode = vnodeStack.pop();
            const parent = vnodeStack[vnodeStack.length - 1]!;
            addPropsChild(parent, vnode);
          }
        }
      } else if (comment.startsWith("frsh")) {
        // We're opening a new island
        const [id, exportName, n] = comment.slice(5).split(":");
        const islandProps = props[Number(n)];

        markerStack.push({
          startNode: sib,
          endNode: null,
          text: comment,
          kind: MarkerKind.Island,
        });
        const vnode = h(islands[id][exportName], islandProps);
        vnodeStack.push(vnode);
      }
    } else if (isTextNode(sib)) {
      const parentVNode = vnodeStack[vnodeStack.length - 1]!;
      if (
        marker !== null && marker.kind === MarkerKind.Slot
      ) {
        addPropsChild(parentVNode, sib.data);
      }
    } else {
      const parentVNode = vnodeStack[vnodeStack.length - 1];
      if (
        marker !== null &&
        marker.kind === MarkerKind.Slot && isElementNode(sib)
      ) {
        // Parse the server rendered DOM into vnodes that we can
        // attach to the virtual-dom tree. In the future, once
        // Preact supports a way to skip over subtrees, this
        // can be dropped.
        const childLen = sib.childNodes.length;
        const props: Record<string, unknown> = {
          children: childLen <= 1 ? null : [],
        };
        for (let i = 0; i < sib.attributes.length; i++) {
          const attr = sib.attributes[i];

          // Boolean attributes are always `true` when present.
          // See: https://developer.mozilla.org/en-US/docs/Glossary/Boolean/HTML
          props[attr.nodeName] =
            // deno-lint-ignore no-explicit-any
            typeof (sib as any)[attr.nodeName] === "boolean"
              ? true
              : attr.nodeValue;
        }
        const vnode = h(sib.localName, props);
        addPropsChild(parentVNode, vnode);
        vnodeStack.push(vnode);
      }

      // TODO: What about script tags?
      if (
        sib.firstChild && (sib.nodeName !== "SCRIPT")
      ) {
        _walkInner(islands, props, markerStack, vnodeStack, sib.firstChild);
      }

      // Pop vnode if current marker is a slot or we are an island marker
      // that was created inside another island
      if (
        marker !== null &&
        (marker.kind === MarkerKind.Slot ||
          markerStack.length > 1 &&
            markerStack[markerStack.length - 2].kind === MarkerKind.Island)
      ) {
        vnodeStack.pop();
      }
    }

    sib = sib.nextSibling;
  }
}

const originalHook = options.vnode;
options.vnode = (vnode) => {
  assetHashingHook(vnode);
  if (originalHook) originalHook(vnode);
};
