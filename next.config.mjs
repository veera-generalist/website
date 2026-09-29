/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server build for Docker / Cloud Run (SafetyWing self-hosts on GCP).
  output: "standalone",
  poweredByHeader: true,
  async redirects() {
    // One-page site (SPEC §4): the old standalone pages now live as home-page sections.
    return [
      { source: "/about", destination: "/#about", permanent: true },
      { source: "/projects", destination: "/#work", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
    ];
  },
  async rewrites() {
    // Markdown mirrors for LLMs (SPEC §10.2): /about.md, /projects/<slug>.md, /writing/<slug>.md
    return [
      { source: "/about.md", destination: "/md/about" },
      { source: "/projects/:slug.md", destination: "/md/projects/:slug" },
      { source: "/writing/:slug.md", destination: "/md/writing/:slug" },
    ];
  },
};

export default nextConfig;
