import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { trackingScriptsAPI } from "@/lib/api";

/**
 * Maps current route pathname to the page identifier used by the tracking scripts system.
 */
function getPageFromPath(pathname: string): string {
  if (pathname === "/" || pathname === "") return "home";
  if (pathname === "/numbers" || pathname === "/search") return "numbers";
  if (/^\/numbers\/[^/]+$/.test(pathname)) return "number_detail";
  if (pathname === "/cart") return "cart";
  if (pathname === "/checkout") return "checkout";
  if (pathname === "/thank-you" || pathname === "/order-success") return "thank_you";
  if (pathname.startsWith("/blog")) return "blog";
  if (pathname === "/contact") return "contact";
  if (pathname === "/login" || pathname === "/register" || pathname === "/signup") return "auth";
  return "other";
}

/**
 * Injects tracking scripts into the DOM based on the current page.
 * Scripts are fetched from the backend API and injected into the appropriate positions:
 * - head: appended to <head>
 * - body_start: prepended to <body> (after opening tag)
 * - body_end: appended to <body> (before closing tag)
 *
 * Re-runs on route changes to handle page-specific scripts.
 */
export default function ScriptInjector() {
  const location = useLocation();
  const currentPage = getPageFromPath(location.pathname);
  const injectedRef = useRef<Map<string, HTMLElement[]>>(new Map());
  const prevPageRef = useRef<string>("");

  const { data: scripts } = useQuery({
    queryKey: ["tracking-scripts-public", currentPage],
    queryFn: () => trackingScriptsAPI.getForPage(currentPage),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  useEffect(() => {
    if (!scripts) return;

    // Clean up previous injections when page changes
    if (prevPageRef.current && prevPageRef.current !== currentPage) {
      const prevKey = prevPageRef.current;
      const prevElements = injectedRef.current.get(prevKey);
      if (prevElements) {
        prevElements.forEach((el) => el.remove());
        injectedRef.current.delete(prevKey);
      }
    }
    prevPageRef.current = currentPage;

    // Don't re-inject if same page scripts already exist
    if (injectedRef.current.has(currentPage)) return;

    const elements: HTMLElement[] = [];
    injectScripts(scripts.head || [], "head", elements);
    injectScripts(scripts.body_start || [], "body_start", elements);
    injectScripts(scripts.body_end || [], "body_end", elements);

    if (elements.length > 0) {
      injectedRef.current.set(currentPage, elements);
    }

    return () => {
      const els = injectedRef.current.get(currentPage);
      if (els) {
        els.forEach((el) => el.remove());
        injectedRef.current.delete(currentPage);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scripts, currentPage]);

  return null;
}

/**
 * Parse HTML string containing script tags and inject them into the DOM.
 * This handles both inline scripts and external script tags.
 */
function injectScripts(
  codes: string[],
  position: "head" | "body_start" | "body_end",
  elements: HTMLElement[]
) {
  codes.forEach((code) => {
    if (!code) return;

    // Determine target container
    const target =
      position === "head" ? document.head : document.body;

    // Create a temporary container to parse the HTML
    const temp = document.createElement("div");
    temp.innerHTML = code;

    // Process each child node
    Array.from(temp.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;

        if (element.tagName === "SCRIPT") {
          // Scripts need special handling — just setting innerHTML won't execute them
          const script = document.createElement("script");

          // Copy attributes
          Array.from(element.attributes).forEach((attr) => {
            script.setAttribute(attr.name, attr.value);
          });

          // Copy content
          if (element.textContent) {
            script.textContent = element.textContent;
          }

          script.setAttribute("data-tracking-injected", "true");

          if (position === "body_start") {
            target.insertBefore(script, target.firstChild);
          } else {
            target.appendChild(script);
          }

          elements.push(script);
        } else {
          // Non-script elements (like noscript, style, etc.)
          const clone = element.cloneNode(true) as HTMLElement;
          clone.setAttribute("data-tracking-injected", "true");

          if (position === "body_start") {
            target.insertBefore(clone, target.firstChild);
          } else {
            target.appendChild(clone);
          }

          elements.push(clone);
        }
      }
    });
  });
}
