/* eslint-disable @next/next/no-before-interactive-script-outside-document -- App Router root layout is the documented place for these */
import Script from "next/script";

/**
 * Pre-hydration scripts: FOUT guard, a11y animation-stop guard and
 * Google Consent Mode defaults. Rendered once from the locale layout.
 */
export function BootScripts(): JSX.Element {
  return (
    <>
      <Script id="prevent-fout" strategy="beforeInteractive">
        {`(function(){if(document.documentElement.classList){document.documentElement.classList.add('app-loading');}})();`}
      </Script>
      <Script id="prevent-animation-flash" strategy="beforeInteractive">
        {`(function(){try{var raw=window.localStorage.getItem('hn_a11y_settings');if(raw){var s=JSON.parse(raw);if(s&&s.stopAnimations){document.documentElement.classList.add('a11y-stop-animations');}}}catch(e){}})();`}
      </Script>
      <Script id="gtm-consent-default" strategy="beforeInteractive">
        {`function gtag(){(window.dataLayer=window.dataLayer||[]).push(arguments);}
gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});`}
      </Script>
    </>
  );
}
