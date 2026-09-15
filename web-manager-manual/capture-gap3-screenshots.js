// Standalone Playwright script (sibling of capture-gap2-screenshots.js, same
// pattern) to capture screenshots for 3 documentation-gap features added
// this session: the Login Database modal (empty/default state), and the
// File menu's Export Host / Import Host modals.
//
// Usage: E2E_USERNAME=... E2E_PASSWORD=... node capture-gap3-screenshots.js

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

async function shotModal(page, name) {
  const dialog = page.locator('[role="dialog"]').last();
  await dialog.screenshot({ path: path.join(IMAGES_DIR, `${name}.png`) });
  console.log(`captured ${name}.png (modal)`);
}

/** Crops to the open top-nav dropdown menu (DropdownMenu.jsx's floating panel —
 * shares the `z-1000 rounded-xl` class combo with ContextMenuWrapper, so this
 * excludes `.context-menu-container` to disambiguate). */
function lastDropdown(page) {
  return page.locator('div.z-1000.rounded-xl:not(.context-menu-container)').last();
}

function lastContextMenu(page) {
  return page.locator('.context-menu-container').last();
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
  let dbRow = null;
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

    dbRow = page.getByTestId(`tree-node-${E2E_DB}`);
    await dbRow.waitFor({ state: 'visible', timeout: 10000 });
  } catch (err) { await debugShot(page, 'host-select', err); }

  // ── Feature: File menu → Export Host modal ──
  try {
    // HeaderMenu.jsx's <nav> has exactly 3 top-level DropdownMenu triggers in
    // order: File, Host & Service Management, Help — File is opened on hover.
    const fileBtn = page.locator('nav button').nth(0);
    await fileBtn.hover({ timeout: 5000 });
    await page.waitForTimeout(500);
    // Export Host — icon="file_upload" (see HeaderMenu.jsx).
    await clickMenuItemByIcon(lastDropdown(page), 'file_upload');
    await page.waitForTimeout(1000);
    await shotModal(page, 'host-export');
    await page.getByTestId('import-export-host-cancel-btn').click({ timeout: 3000 }).catch(() => page.keyboard.press('Escape'));
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, 'host-export', err); }

  // ── Feature: File menu → Import Host modal (initial file-picker step) ──
  try {
    const fileBtn = page.locator('nav button').nth(0);
    await fileBtn.hover({ timeout: 5000 });
    await page.waitForTimeout(500);
    // Import Host — icon="file_download" (see HeaderMenu.jsx).
    await clickMenuItemByIcon(lastDropdown(page), 'file_download');
    await page.waitForTimeout(1000);
    await shotModal(page, 'host-import');
    await page.getByTestId('import-export-host-cancel-btn').click({ timeout: 3000 }).catch(() => page.keyboard.press('Escape'));
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, 'host-import', err); }

  // ── Feature: Login Database modal (empty/default state, before submit) ──
  // The target db may already be logged in and/or have a saved credential
  // profile from previous capture-script runs against this same dev:stack —
  // in either case, double-clicking it does a silent/background re-login
  // instead of opening LoginDatabaseModal (see DatabaseTree.jsx's
  // handleDbActivate / Sidebar.jsx's context-menu "Login Database" item:
  // isProfileExists routes to a background loginDatabase() call, not the
  // modal). So first log out (if logged in) and forget the saved profile (if
  // any), which are both reversible, non-destructive housekeeping actions
  // already documented elsewhere in this manual — only then does a
  // double-click open the modal we need.
  try {
    if (!dbRow) throw new Error('demodb tree node not found');

    // Log out first, if currently logged in.
    await dbRow.locator('> summary').click({ button: 'right' });
    await page.waitForTimeout(400);
    let menu = lastContextMenu(page);
    const logoutVisible = await menu.locator('button:has(span.material-symbols-outlined:text-is("logout"))').first().isVisible({ timeout: 1000 }).catch(() => false);
    if (logoutVisible) {
      await clickMenuItemByIcon(menu, 'logout');
      await page.waitForTimeout(400);
      const confirmDialog = page.locator('[role="dialog"]').last();
      await confirmDialog.getByRole('button', { name: '데이터베이스 로그아웃' }).click({ timeout: 5000 });
      await page.waitForTimeout(1000);
      await sweepStrayModals(page);
    } else {
      await page.mouse.click(2, 2).catch(() => {});
    }

    // Forget any saved credential profile, if one exists (only appears in the
    // context menu when db.isProfileExists is true).
    await dbRow.locator('> summary').click({ button: 'right' });
    await page.waitForTimeout(400);
    menu = lastContextMenu(page);
    const forgetVisible = await menu.locator('button:has(span.material-symbols-outlined:text-is("key_off"))').first().isVisible({ timeout: 1000 }).catch(() => false);
    if (forgetVisible) {
      await clickMenuItemByIcon(menu, 'key_off');
      await page.waitForTimeout(400);
      const confirmDialog = page.locator('[role="dialog"]').last();
      await confirmDialog.getByRole('button', { name: '저장된 자격증명 삭제' }).click({ timeout: 5000 });
      await page.waitForTimeout(1000);
      await sweepStrayModals(page);
    } else {
      await page.mouse.click(2, 2).catch(() => {});
    }

    // Now double-click should open the empty Login Database modal.
    await dbRow.locator('> summary').dblclick();
    await page.waitForTimeout(1000);
    const loginModal = page.getByTestId('login-database-modal');
    await loginModal.waitFor({ state: 'visible', timeout: 10000 });
    await shotModal(page, 'database-login');
    await page.getByTestId('login-database-cancel-btn').click({ timeout: 3000 }).catch(() => page.keyboard.press('Escape'));
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, 'database-login', err); }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
