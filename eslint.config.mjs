import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // The motion wrappers look up `motion.<tag>` from a static const map and
  // assign to an uppercase local for JSX. The result is a stable reference,
  // not a per-render component factory — but `react-hooks/static-components`
  // can't tell. Same for `pickStaticTag` which just returns a string tag
  // name used as a JSX element. False positives.
  {
    files: ["app/_components/motion/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/static-components": "off",
    },
  },
  // One-shot iframe detection (window.self !== window.top) is only testable
  // client-side post-hydration, so `setState` inside the mount effect is
  // the established React pattern here. The recommended `useSyncExternalStore`
  // alternative would need an SSR snapshot for a single boolean — not worth
  // the complexity. Same rationale applies to RouteChangeHandler's path-
  // change listener and any future setState-after-detection patterns under
  // app/_components/.
  {
    files: ["app/_components/lenis-provider.tsx"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
