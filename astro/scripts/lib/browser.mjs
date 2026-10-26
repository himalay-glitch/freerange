// Shared headless browser for the scripts that need one (verify.mjs, capture-ctas.mjs).
// Uses Playwright's own Chromium (install once with `npx playwright-core install chromium`), or any Chrome/Chromium
// binary given in CHROME_PATH.
import { chromium } from 'playwright-core';

export function launch() {
  return chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined });
}
