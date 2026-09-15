// Standalone Playwright script (sibling of capture-gap-screenshots.js, same
// pattern) to capture screenshots for the 6 documentation-gap features added
// this session: the Help menu, the Server Version modal, Set Automation
// Volume / Auto Volume Log (Space folder), Auto Backup Log (Backup Plan
// folder), Auto Query Log (Query Plan folder), per-broker Properties, and
// the ALL BROKERS "Show Status" overview tab.
//
// Usage: E2E_USERNAME=... E2E_PASSWORD=... node capture-gap2-screenshots.js

const path = require('path');
const fs = require('fs');
const E2E_DIR = path.join(__dirname, '../../cubrid-webmanager-e2e');
const { chromium } = require(path.join(E2E_DIR, 'node_modules/@playwright/test'));

const BASE_URL = process.env.BASE_URL || 'https://localhost:443';
const E2E_USERNAME = process.env.E2E_USERNAME;
const E2E_PASSWORD = process.env.E2E_PASSWORD;
// The known-working host for this run (has demodb, and a couple of real brokers).
const E2E_HOST_ADDRESS = process.env.E2E_HOST_ADDRESS || '192.168.3.120';
const E2E_DB = process.env.E2E_DB || 'demodb';

const IMAGES_DIR = path.join(__dirname, 'images');
const DEBUG_DIR = path.join(__dirname, 'debug');
fs.mkdirSync(DEBUG_DIR, { recursive: true });

async function shot(page, name) {
  await page.screenshot({ path: path.join(IMAGES_DIR, `${name}.png`) });
  console.log(`captured ${name}.png`);
}

async function shotModal(page, name) {
  const dialog = page.locator('[role="dialog"]').last();
  await dialog.screenshot({ path: path.join(IMAGES_DIR, `${name}.png`) });
  console.log(`captured ${name}.png (modal)`);
}

/** Crops to the open context menu (ContextMenuWrapper's `.context-menu-container`
 * class — see components/common/ContextMenuWrapper.jsx). */
async function shotContextMenu(page, name) {
  const menu = page.locator('.context-menu-container').last();
  await menu.screenshot({ path: path.join(IMAGES_DIR, `${name}.png`) });
  console.log(`captured ${name}.png (menu)`);
}

/** Crops to the open top-nav dropdown menu (DropdownMenu.jsx's floating panel —
 * shares the `z-1000 rounded-xl` class combo with ContextMenuWrapper, so this
 * excludes `.context-menu-container` to disambiguate). */
async function shotDropdown(page, name) {
  const menu = page.locator('div.z-1000.rounded-xl:not(.context-menu-container)').last();
  await menu.screenshot({ path: path.join(IMAGES_DIR, `${name}.png`) });
  console.log(`captured ${name}.png (dropdown)`);
}

function lastContextMenu(page) {
  return page.locator('.context-menu-container').last();
}

function lastDropdown(page) {
  return page.locator('div.z-1000.rounded-xl:not(.context-menu-container)').last();
}

/** Clicks a MenuItem inside an open menu by its Material Symbols icon name
 * (the Icon component renders the icon name as the span's literal text
 * content — see components/ds/foundation/Icon.jsx) rather than by label text,
 * since the UI is captured in KR locale and every label is Korean. */
async function clickMenuItemByIcon(scope, iconName) {
  const item = scope.locator(`button:has(span.material-symbols-outlined:text-is("${iconName}"))`).first();
  await item.waitFor({ state: 'visible', timeout: 5000 });
  await item.click();
}

async function debugShot(page, name, err) {
  try {
    await page.screenshot({ path: path.join(DEBUG_DIR, `${name}-fail.png`) });
  } catch {}
  console.log(`${name} screen skipped: ${err.message.split('\n')[0]} (debug/${name}-fail.png saved)`);
}

async function drainAllStatusConfirmButtons(page, attempts = 10) {
  for (let i = 0; i < attempts; i++) {
    const btn = page.getByTestId('modal-status-confirm-btn').first();
    if (!(await btn.isVisible({ timeout: 1000 }).catch(() => false))) return;
    await btn.click().catch(() => {});
    await page.waitForTimeout(400);
  }
}

async function dismissGlobalJobResultModal(page) {
  for (let i = 0; i < 10; i++) {
    const modal = page.getByTestId('job-result');
    if (!(await modal.isVisible({ timeout: 1500 }).catch(() => false))) return;
    await modal.getByTestId('modal-status-confirm-btn').click().catch(() => {});
    await modal.getByTestId('modal-status-cancel-btn').click().catch(() => {});
    await modal.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(500);
  }
}

async function sweepStrayModals(page) {
  await drainAllStatusConfirmButtons(page);
  await dismissGlobalJobResultModal(page);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // --- Login (KR locale + dark mode, matching every existing manual shot) ---
  await page.goto(`${BASE_URL}/login`);
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'KR' }).click({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(300);
  const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  if (!isDark) {
    await page.getByTestId('login-theme-toggle').click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(300);
  }

  await page.getByTestId('login-username-input').fill(E2E_USERNAME);
  await page.getByTestId('login-password-input').fill(E2E_PASSWORD);
  await page.getByTestId('login-submit-btn').click();
  await page.waitForURL('**/home', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1000);
  await sweepStrayModals(page);

  // ── Select + open the known-good host (sets selectedHostUid, expands its DB tree) ──
  try {
    const groupDetails = page.locator('#host-section details, aside details');
    const gCount = await groupDetails.count().catch(() => 0);
    for (let i = 0; i < gCount; i++) {
      const isOpen = await groupDetails.nth(i).evaluate((el) => el.open).catch(() => true);
      if (!isOpen) await groupDetails.nth(i).locator('> summary').click().catch(() => {});
    }
    await page.waitForTimeout(300);

    const hostRow = page.locator(`[data-testid^="host-item-"][title^="${E2E_HOST_ADDRESS}:"]`).first();
    await hostRow.waitFor({ state: 'visible', timeout: 10000 });
    await hostRow.dblclick();
    await page.locator('#db-tree-container').waitFor({ timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);
    await sweepStrayModals(page);
  } catch (err) { await debugShot(page, 'host-select', err); }

  // ── Feature 6: Help menu ──
  try {
    // HeaderMenu.jsx's <nav> has exactly 3 top-level DropdownMenu triggers in
    // order: File, Host & Service Management, Help — Help is opened on hover.
    const helpBtn = page.locator('nav button').nth(2);
    await helpBtn.hover({ timeout: 5000 });
    await page.waitForTimeout(500);
    await shotDropdown(page, 'navigation-help-menu');

    // ── Feature 7: Server Version modal, opened from this same Help menu
    // (icon="info" — see HeaderMenu.jsx). A host is already selected above,
    // so this item is enabled.
    await clickMenuItemByIcon(lastDropdown(page), 'info');
    await page.waitForTimeout(1200);
    await shotModal(page, 'host-server-version');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, 'navigation-help-menu', err); }

  // ── DB tree: expand target database, log into it (needed for Set
  // Automation Volume, which is gated on isLoggedIn — see Sidebar.jsx
  // spaceContextMenu) ──
  const dbRow = page.getByTestId(`tree-node-${E2E_DB}`);
  try {
    await dbRow.waitFor({ state: 'visible', timeout: 10000 });
    const dbOpen = await dbRow.evaluate((el) => el.open).catch(() => false);
    if (!dbOpen) await dbRow.locator('> summary').click();
    await page.waitForTimeout(500);

    await dbRow.locator('> summary').dblclick();
    await page.waitForTimeout(1000);
    const loginModal = page.getByTestId('login-database-modal');
    if (await loginModal.isVisible({ timeout: 3000 }).catch(() => false)) {
      await loginModal.locator('input').nth(1).fill('dba');
      await page.getByTestId('login-database-submit-btn').click();
      await loginModal.waitFor({ state: 'hidden', timeout: 20000 }).catch(() => {});
    }
    await page.waitForTimeout(1500);
    await sweepStrayModals(page);
  } catch (err) { await debugShot(page, 'db-login', err); }

  // ── Feature 9a: Auto Backup Log (Backup Plan folder context menu) ──
  try {
    const jobAutoNode = dbRow.getByTestId('tree-node-Job automation');
    await jobAutoNode.waitFor({ state: 'visible', timeout: 10000 });
    const jobOpen = await jobAutoNode.evaluate((el) => el.open).catch(() => false);
    if (!jobOpen) await jobAutoNode.locator('> summary').click();
    await page.waitForTimeout(500);

    const backupPlanNode = jobAutoNode.getByTestId('tree-node-Backup Plan');
    await backupPlanNode.waitFor({ state: 'visible', timeout: 10000 });
    await backupPlanNode.locator('> summary').click({ button: 'right' });
    await page.waitForTimeout(500);
    await clickMenuItemByIcon(lastContextMenu(page), 'history'); // Auto Backup Log
    await page.waitForTimeout(1200);
    await shotModal(page, 'backup-auto-log');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, 'backup-auto-log', err); }

  // ── Feature 9b: Auto Query Log (Query Plan folder context menu) ──
  try {
    const jobAutoNode = dbRow.getByTestId('tree-node-Job automation');
    const queryPlanNode = jobAutoNode.getByTestId('tree-node-Query Plan');
    await queryPlanNode.waitFor({ state: 'visible', timeout: 10000 });
    await queryPlanNode.locator('> summary').click({ button: 'right' });
    await page.waitForTimeout(500);
    await clickMenuItemByIcon(lastContextMenu(page), 'history'); // Auto Query Log
    await page.waitForTimeout(1200);
    await shotModal(page, 'automation-auto-query-log');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, 'automation-auto-query-log', err); }

  // ── Feature 8a: Set Automation Volume (Space folder context menu) ──
  try {
    const spaceNode = dbRow.getByTestId('tree-node-Space');
    await spaceNode.waitFor({ state: 'visible', timeout: 10000 });
    await spaceNode.locator('> summary').click({ button: 'right' });
    await page.waitForTimeout(500);
    await clickMenuItemByIcon(lastContextMenu(page), 'settings_suggest'); // Set Automation Volume
    await page.waitForTimeout(1200);
    await shotModal(page, 'automation-set-volume');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, 'automation-set-volume', err); }

  // ── Feature 8b: Auto Volume Log (Space folder context menu) ──
  try {
    const spaceNode = dbRow.getByTestId('tree-node-Space');
    await spaceNode.locator('> summary').click({ button: 'right' });
    await page.waitForTimeout(500);
    await clickMenuItemByIcon(lastContextMenu(page), 'history_edu'); // Auto Volume Log
    await page.waitForTimeout(1200);
    await shotModal(page, 'automation-auto-volume-log');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, 'automation-auto-volume-log', err); }

  // ── Feature 10: per-broker Properties ──
  try {
    await page.mouse.click(2, 2).catch(() => {});
    await sweepStrayModals(page);
    const brokerTab = page.getByTestId('tree-tab-broker');
    await brokerTab.click({ timeout: 5000 });
    await page.waitForTimeout(700);

    // First real broker row under the broker tree (its own <details>, before
    // any nested SQL Log children in document order).
    const brokerRow = page.locator('#broker-tree-container [data-testid^="tree-node-"]').first();
    await brokerRow.waitFor({ state: 'visible', timeout: 10000 });
    await brokerRow.locator('> summary').click({ button: 'right' });
    await page.waitForTimeout(500);
    await clickMenuItemByIcon(lastContextMenu(page), 'tune'); // Properties
    await page.waitForTimeout(1200);
    await shotModal(page, 'broker-properties');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, 'broker-properties', err); }

  // ── Feature 11: ALL BROKERS "Show Status" overview tab ──
  try {
    const brokerTab = page.getByTestId('tree-tab-broker');
    await brokerTab.click({ button: 'right', timeout: 5000 });
    await page.waitForTimeout(500);
    await clickMenuItemByIcon(lastContextMenu(page), 'info'); // Show Status
    await page.waitForTimeout(2000);
    // Genuine full-tab view (not an overlay) — full-page shot is correct here.
    await shot(page, 'broker-show-status');
  } catch (err) { await debugShot(page, 'broker-show-status', err); }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
