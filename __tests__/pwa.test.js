import { readFileSync } from "node:fs";
import path from "node:path";

import { registerServiceWorker } from "@/components/PwaRegistration";

describe("PWA configuration", () => {
  it("provides an installable manifest with standard and maskable icons", () => {
    const manifest = JSON.parse(
      readFileSync(path.join(process.cwd(), "public/manifest.json"), "utf8")
    );

    expect(manifest).toEqual(
      expect.objectContaining({
        id: "/",
        start_url: "/",
        scope: "/",
        display: "standalone",
        lang: "de-DE",
      })
    );
    expect(manifest.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ sizes: "192x192", purpose: "any" }),
        expect.objectContaining({ sizes: "512x512", purpose: "any" }),
        expect.objectContaining({ sizes: "512x512", purpose: "maskable" }),
      ])
    );
  });

  it("registers the root service worker without HTTP caching", async () => {
    const serviceWorker = { register: jest.fn().mockResolvedValue({}) };

    await registerServiceWorker(serviceWorker);

    expect(serviceWorker.register).toHaveBeenCalledWith("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
  });

  it("does nothing when service workers are unavailable", async () => {
    await expect(registerServiceWorker(undefined)).resolves.toBeNull();
  });

  it("keeps authenticated API responses out of the offline cache", () => {
    const serviceWorker = readFileSync(
      path.join(process.cwd(), "public/sw.js"),
      "utf8"
    );

    expect(serviceWorker).toContain('url.pathname.startsWith("/api/")');
    expect(serviceWorker).toContain("MAX_RUNTIME_ENTRIES = 60");
  });
});
