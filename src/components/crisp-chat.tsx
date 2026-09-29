import Script from "next/script";

const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

// Free live-chat widget (stand-in for SafetyWing's paid Intercom).
export function CrispChat() {
  if (!websiteId) return null;
  return (
    <Script id="crisp-chat" strategy="lazyOnload">
      {`window.$crisp=[];window.CRISP_WEBSITE_ID=${JSON.stringify(websiteId)};(function(){var d=document,s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.head.appendChild(s);})();`}
    </Script>
  );
}
