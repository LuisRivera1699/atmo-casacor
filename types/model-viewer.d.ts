import type React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        ar?: boolean;
        "ar-modes"?: string;
        "ar-placement"?: string;
        "camera-controls"?: boolean;
        "ios-src"?: string;
        reveal?: string;
        src?: string;
      };
    }
  }
}
