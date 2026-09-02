/**
 * InitialLoader – Pre-hydration Loading Screen
 *
 * Server Component that renders raw HTML + inline CSS + an inline <script>
 * directly into the first server response, so it is guaranteed to appear
 * styled on the very first frame (before the design-token CSS or React
 * hydrate). It fades out once fonts + window load both settle.
 */

import { getTranslations } from "next-intl/server";
import { LOADER_CSS } from "./loaderStyles";
import { LOADER_SCRIPT } from "./loaderScript";

export async function InitialLoader(): Promise<JSX.Element> {
  const t = await getTranslations("common.actions");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: LOADER_CSS }} />

      <div id="initial-loader" aria-live="polite">
        <div className="il-glow" />

        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <div style={{ position: "relative", width: "5rem", height: "5rem" }}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              style={{ width: "100%", height: "100%", animation: "ilPulse 1.5s ease-in-out infinite" }}
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                className="il-heart"
                fill="#F5EDE8"
                stroke="#D85A30"
                strokeWidth={2.5}
              />
            </svg>

            <div
              style={{
                position: "absolute",
                bottom: "-2%",
                insetInlineStart: "-2%",
                width: "55%",
                height: "55%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "ilSpin 3s linear infinite",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="il-gear"
                fill="#2E3C52"
                style={{ width: "90%", height: "90%" }}
              >
                <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
              </svg>
            </div>
          </div>

          <span
            className="il-text"
            dir="ltr"
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#2E3C52",
              fontFamily: "var(--font-glacial-indifference, sans-serif)",
              animation: "ilTextPulse 1.5s ease-in-out infinite",
            }}
          >
            HeartNote
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  borderRadius: "50%",
                  background: "#D85A30",
                  animation: `ilDot 0.8s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>

        <span
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: 0,
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0,0,0,0)",
            whiteSpace: "nowrap",
            borderWidth: 0,
          }}
        >
          {t("loading")}
        </span>
      </div>

      <script dangerouslySetInnerHTML={{ __html: LOADER_SCRIPT }} />
    </>
  );
}
