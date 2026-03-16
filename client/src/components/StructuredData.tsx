/**
 * StructuredData — injects JSON-LD schema markup into the document.
 * Runs as a Server Component so the <script> tag is present in the
 * initial HTML response, which is optimal for SEO crawlers.
 *
 * XSS safety: JSON.stringify may produce the literal sequence </script>
 * inside a string value, which would prematurely close the script tag.
 * We replace every occurrence of </ with <\/ before injecting, which is
 * valid JSON and prevents early tag termination regardless of future
 * data changes.
 */

const SITE_URL = "https://heartnote.co.il";

// TODO: replace with the actual hosted logo URL when available
const LOGO_URL = "https://heartnote.co.il/assets/images/logo_heartnote.png";

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Heartnote",
      url: SITE_URL,
      logo: LOGO_URL,
    },
    {
      "@type": "WebSite",
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

// Serialize once; sanitize </script> sequences to prevent early tag close.
const jsonLd = JSON.stringify(schema).replace(/<\//g, "<\\/");

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  );
}
