// Standalone Playwright script (mirrors capture-screenshots.js's pattern) to
// capture screenshots for the 5 documentation-gap features added this
// session: database space/volume monitors, host multi-select bulk actions,
// the "ALL DATABASES" root context menu, the monitoring refresh-interval
// popover, and the webmanager account profile modal.
//
// Usage: E2E_USERNAME=... E2E_PASSWORD=... node capture-gap-screenshots.js

const path = require('path');
const fs = require('fs');
const E2E_DIR = path.join(__dirname, '../../cubrid-webmanager-e2e');
const { chromium } = require(path.join(E2E_DIR, 'node_modules/@playwright/test'));
const { dismissJobResultModal } = require(path.join(E2E_DIR, 'pages/dismissJobResultModal'));

const BASE_URL = process.env.BASE_URL || 'https://localhost:443';
const E2E_USERNAME = process.env.E2E_USERNAME;
const E2E_PASSWORD = process.env.E2E_PASSWORD;
// The known-working host for this run (has demodb).
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

/** Crops to the monitoring-settings popover panel (MonitoringSettingsPopover.jsx
 * — the floating `div.rounded-2xl.shadow-2xl` opened by the "새로고침 설정"-titled
 * button; not a role="dialog" Modal, so shotModal() doesn't apply). */
async function shotPopover(page, name) {
  const popover = page.locator('div.rounded-2xl.shadow-2xl').last();
  await popover.screenshot({ path: path.join(IMAGES_DIR, `${name}.png`) });
  console.log(`captured ${name}.png (popover)`);
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

/** Closes any leftover role="dialog" Modal (e.g. an Edit Host modal left open
 * after a failed connection attempt) via its Cancel/취소 button, falling back
 * to its X close icon, then Escape. Safe to call when nothing is open. */
async function closeAnyOpenModal(page) {
  const dialog = page.locator('[role="dialog"]').last();
  if (!(await dialog.isVisible({ timeout: 1000 }).catch(() => false))) return;
  const cancelBtn = dialog.getByRole('button', { name: /^Cancel$|^취소$/ });
  if (await cancelBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
    await cancelBtn.click().catch(() => {});
  } else {
    await dialog.locator('button[aria-label="Close"], button:has(svg)').first().click().catch(() => {});
  }
  await page.waitForTimeout(300);
  await page.keyboard.press('Escape').catch(() => {});
  await dialog.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
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

  // ── Feature 5: Webmanager account profile / change-own-password ──
  try {
    await sweepStrayModals(page);
    // Locate the profile pill button precisely: it's a <button> in the header
    // whose text is the logged-in username (see Header.jsx onClick={() => setIsProfileOpen(true)}).
    const profileBtn = page.locator('header button', { hasText: E2E_USERNAME });
    await profileBtn.first().click({ timeout: 5000 });
    await page.waitForTimeout(500);
    await shotModal(page, 'auth-account-profile');

    // Switch to change-password mode
    const changePwBtn = page.getByRole('button', { name: /Change Password|비밀번호 변경/ });
    await changePwBtn.click({ timeout: 3000 });
    await page.waitForTimeout(400);
    await shotModal(page, 'auth-account-change-password');

    // Cancel out without submitting.
    await page.getByRole('button', { name: /^Cancel$|^취소$/ }).click({ timeout: 3000 }).catch(() => {});
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, 'auth-account-profile', err); }

  // ── Login to the known-good host + open its DB tree (for features 1, 3, 4) ──
  // Done BEFORE the host multi-select section below: multi-selecting other
  // hosts first was observed to leave the sidebar's per-host Resources/DB
  // tree panel stuck on "NO DATABASES FOUND" for the next host clicked, so
  // this host's tree + dashboard work happens first, on a clean tree state.
  try {
    await sweepStrayModals(page);
    // Groups render collapsed (<details> closed) on a fresh page load —
    // expand every one so the target host row is actually in the DOM/visible.
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

    // ── Feature 3: "ALL DATABASES" root context menu ──
    try {
      await page.mouse.click(2, 2).catch(() => {});
      await page.getByTestId('tree-tab-db').click({ button: 'right', timeout: 5000 });
      await page.waitForTimeout(500);
      await shotContextMenu(page, 'database-all-databases-menu');

      // One representative confirm dialog off this menu (Start All Databases),
      // to show that each action gates on its own ConfirmDialog — cancel, never submit.
      const startAllBtn = page.getByRole('button', { name: /Start All Databases|모든 데이터베이스 시작/ });
      await startAllBtn.click({ timeout: 3000 });
      await page.waitForTimeout(500);
      await shotModal(page, 'database-start-all-confirm');
      await page.getByRole('button', { name: /^Cancel$|^취소$/ }).click({ timeout: 3000 }).catch(() => page.keyboard.press('Escape'));
      await page.waitForTimeout(300);
    } catch (err) { await debugShot(page, 'database-all-databases-menu', err); }

    // ── Feature 1: Database Space / Volume monitors ──
    const dbRow = page.getByTestId(`tree-node-${E2E_DB}`);
    if (await dbRow.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Log in to the database first (saved profile or via modal), same
      // approach as capture-screenshots.js's ensureDatabaseLoggedIn, reimplemented
      // locally to avoid dragging in the whole DatabaseTreePage object.
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

      // Database Dashboard now open — grab the monitoring settings popover
      // (Feature 4) from here, since it's present on this screen too. The
      // popover's own toggle button carries title=CM.monitoringSync
      // ("새로고침 설정" / "Monitoring & Sync" — see MonitoringSettingsPopover.jsx).
      try {
        const gearBtn = page.locator('button[title="새로고침 설정"], button[title="Refresh Settings"]').first();
        await gearBtn.click({ timeout: 5000 });
        await page.waitForTimeout(400);
        // Floating popover, not a role="dialog" Modal — crop to its own panel.
        await shotPopover(page, 'monitoring-refresh-interval');
        await gearBtn.click({ timeout: 3000 }).catch(() => {}); // close it back
        await page.waitForTimeout(300);
      } catch (err) { await debugShot(page, 'monitoring-refresh-interval', err); }

      // Expand the database, then double-click "Space" to open the Space monitor.
      try {
        const isOpen = await dbRow.evaluate((el) => el.open).catch(() => false);
        if (!isOpen) await dbRow.locator('> summary').click();
        await page.waitForTimeout(500);
        const spaceNode = dbRow.getByTestId('tree-node-Space');
        await spaceNode.waitFor({ state: 'visible', timeout: 10000 });
        await spaceNode.locator('> summary').dblclick();
        await page.waitForTimeout(1500);
        await shot(page, 'database-space-monitor');

        // Expand Space, drill into a category folder (Permanent Data), double-click it.
        const spaceOpen = await spaceNode.evaluate((el) => el.open).catch(() => false);
        if (!spaceOpen) await spaceNode.locator('> summary').click();
        await page.waitForTimeout(500);
        const categoryNode = spaceNode.getByTestId('tree-node-Permanent_PermanentData');
        await categoryNode.waitFor({ state: 'visible', timeout: 10000 });
        await categoryNode.locator('> summary').dblclick();
        await page.waitForTimeout(1500);
        await shot(page, 'database-volume-category-monitor');

        // Expand the category, double-click the first individual volume file.
        const catOpen = await categoryNode.evaluate((el) => el.open).catch(() => false);
        if (!catOpen) await categoryNode.locator('> summary').click();
        await page.waitForTimeout(500);
        const volumeLeaf = categoryNode.locator('[data-testid^="tree-node-"]').first();
        if (await volumeLeaf.isVisible({ timeout: 5000 }).catch(() => false)) {
          await volumeLeaf.dblclick();
          await page.waitForTimeout(1500);
          await shot(page, 'database-volume-info-monitor');
        } else {
          console.log('database-volume-info-monitor skipped: no volume leaf found under Permanent_PermanentData');
        }
      } catch (err) { await debugShot(page, 'database-space-monitor', err); }
    } else {
      console.log(`Database row "${E2E_DB}" not found — skipping space/volume monitor screens.`);
    }
  } catch (err) { await debugShot(page, 'host-login', err); }

  // A failed connection attempt above (host down / stale saved credentials)
  // can leave an Edit Host modal open with a "No response" / "Incorrect
  // password" error — close it so it doesn't block everything below.
  await closeAnyOpenModal(page);

  // ── Host tree: multi-select + bulk context menu (Feature 2) ──
  // Run this last: it deliberately ctrl/cmd-clicks OTHER host rows (not
  // E2E_HOST_ADDRESS), which was observed above to disturb the sidebar's
  // per-host database tree state for whichever host is clicked next.
  try {
    await page.mouse.click(2, 2).catch(() => {});
    await sweepStrayModals(page);
    // Expand every group <details> so all host rows are visible.
    const groupDetails = page.locator('#host-section details, aside details');
    const gCount = await groupDetails.count().catch(() => 0);
    for (let i = 0; i < gCount; i++) {
      const isOpen = await groupDetails.nth(i).evaluate((el) => el.open).catch(() => true);
      if (!isOpen) await groupDetails.nth(i).locator('> summary').click().catch(() => {});
    }
    await page.waitForTimeout(300);

    const hostRows = page.locator('[data-testid^="host-item-"]');
    const hostCount = await hostRows.count();
    if (hostCount >= 2) {
      // A PLAIN click never adds a host to the multi-selection set (it only
      // clears it — see HostGroupTree.jsx's handleMultiSelect: the "outside
      // current selection" branch resets to an empty Set rather than seeding
      // it with the clicked host). Only ctrl/cmd-click or shift-click populate
      // selectedHostUids, so both hosts here must be ctrl/cmd-clicked.
      await hostRows.nth(0).click({ modifiers: ['ControlOrMeta'], timeout: 5000 });
      await hostRows.nth(1).click({ modifiers: ['ControlOrMeta'], timeout: 5000 });
      await page.waitForTimeout(300);
      // Full-content-area shot: this is genuine tree state (several rows
      // highlighted), not a floating overlay, so a full-page shot is correct here.
      await shot(page, 'host-bulk-select');

      // Right-click one of the selected rows -> bulk context menu (a floating
      // ContextMenuWrapper, not a role="dialog" Modal — crop to its own container).
      await hostRows.nth(1).click({ button: 'right', timeout: 5000 });
      await page.waitForTimeout(400);
      await shotContextMenu(page, 'host-bulk-context-menu');

      // The "Delete Selected" item opens a real ConfirmDialog (role="dialog"
      // Modal) showing the selection count — capture then cancel, never confirm.
      const deleteSelectedBtn = page.getByRole('button', { name: /Delete Selected|선택 항목 삭제/ });
      await deleteSelectedBtn.click({ timeout: 3000 });
      await page.waitForTimeout(400);
      await shotModal(page, 'host-bulk-delete-confirm');
      await page.getByRole('button', { name: /^Cancel$|^취소$/ }).click({ timeout: 3000 }).catch(() => page.keyboard.press('Escape'));
      await page.waitForTimeout(300);
    } else {
      console.log(`host-bulk-select skipped: only ${hostCount} host row(s) visible, need >= 2`);
    }
  } catch (err) { await debugShot(page, 'host-bulk-select', err); }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
