export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  // Configure via .env:
  //   PING_DOMAIN   — full base URL, e.g. https://myapp.onrender.com
  //   PING_INTERVAL — seconds between pings (default: 22)
  const domain =
    process.env.PING_DOMAIN ||
    process.env.RENDER_EXTERNAL_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "";

  if (!domain) {
    console.log("[keep-alive] PING_DOMAIN not set — self-ping disabled.");
    return;
  }

  const intervalSec = parseInt(process.env.PING_INTERVAL ?? "22", 10);
  const intervalMs = intervalSec * 1000;
  const pingUrl = `${domain.replace(/\/$/, "")}/api/ping`;

  console.log(`[keep-alive] Self-ping ready → ${pingUrl} every ${intervalSec}s`);

  const ping = async () => {
    try {
      const res = await fetch(pingUrl, { cache: "no-store" });
      console.log(`[keep-alive] ping ${res.ok ? "✓" : "✗"} (${res.status})`);
    } catch (err) {
      console.warn("[keep-alive] ping failed:", (err as Error).message);
    }
  };

  // First ping after 30s to let the server fully boot
  setTimeout(() => {
    ping();
    setInterval(ping, intervalMs);
  }, 30_000);
}
