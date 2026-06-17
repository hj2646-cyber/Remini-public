// Expo Router web root template — PWA meta tags + manifest + iOS apple-touch-icon.
// Renders only on web (SSR/static export). Native builds ignore this file.
import { ScrollViewStyleReset } from "expo-router/html";
import { type PropsWithChildren } from "react";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover, user-scalable=no"
        />
        <meta name="theme-color" content="#1f2937" />

        <link rel="manifest" href="/manifest.webmanifest" />

        {/* iOS 16.4+ Web Push 활성화 조건: standalone PWA + apple-touch-icon */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Remini" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />

        <title>Remini</title>

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
