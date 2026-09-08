// Standalone Playwright script (not part of the Playwright Test runner) to
// capture real screenshots for the web-manager-manual images/ directory.
// Run against a live `npm run dev:stack` in cubrid-webmanager, using page
// object helpers borrowed from the (now separate) cubrid-webmanager-e2e repo.
//
// Usage: E2E_USERNAME=... E2E_PASSWORD=... node capture-screenshots.js
// cubrid-webmanager-e2e's own .env (CMS_HOST/CMS_PORT/CMS_USER/CMS_PASSWORD)
// only has the CMS host's own credentials — it auto-registers its own
// hardcoded e2e_user webmanager account via global-setup.js rather than
// storing a webmanager account in .env. So E2E_USERNAME/E2E_PASSWORD here
// must be passed on the command line for whichever webmanager account you
// want screenshots taken as.

const path = require('path');
const fs = require('fs');
const E2E_DIR = path.join(__dirname, '../../cubrid-webmanager-e2e');
// Must come from the SAME @playwright/test install that DatabaseTreePage/
// BrokerTreePage use for their internal `expect(...)` calls (required below) —
// mixing this repo's own `playwright` package with e2e's `@playwright/test`
// produces cross-package Locator instances that `expect().toBeVisible()`
// rejects with "can be only used with Locator object".
const { chromium } = require(path.join(E2E_DIR, 'node_modules/@playwright/test'));
const { DatabaseTreePage } = require(path.join(E2E_DIR, 'pages/DatabaseTreePage'));
const { BrokerTreePage } = require(path.join(E2E_DIR, 'pages/BrokerTreePage'));
const { dismissJobResultModal } = require(path.join(E2E_DIR, 'pages/dismissJobResultModal'));

const envPath = path.join(E2E_DIR, '.env');
if (fs.existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

const BASE_URL = process.env.BASE_URL || 'https://localhost:443';
const E2E_USERNAME = process.env.E2E_USERNAME;
const E2E_PASSWORD = process.env.E2E_PASSWORD;
// Match the host row by its visible alias in the server list, not by a
// [title="address:port"] attribute — more robust across however the row's
// tooltip happens to be formatted, and works for a host that's already
// registered under this account (no need to know its CMS address/port).
const E2E_HOST_ALIAS = process.env.E2E_HOST_ALIAS || 'PM';
const E2E_DB = process.env.E2E_DB || 'demodb';

const IMAGES_DIR = path.join(__dirname, 'images');
const DEBUG_DIR = path.join(__dirname, 'debug');
fs.mkdirSync(DEBUG_DIR, { recursive: true });

async function shot(page, name) {
  await page.screenshot({ path: path.join(IMAGES_DIR, `${name}.png`) });
  console.log(`captured ${name}.png`);
}

/**
 * Crops to just the open modal's panel instead of the full viewport, so the
 * manual's modal screenshots look filled-in instead of mostly empty page
 * around a small centered box. Every modal in this app renders through the
 * shared <Modal> component (components/ds/layout/Modal.jsx), which always
 * sets role="dialog" on the panel div regardless of whether a `testId` prop
 * was passed — including ConfirmDialog's untestid'd instances — so this
 * selector works uniformly without needing a testid per call site.
 */
async function shotModal(page, name) {
  const dialog = page.locator('[role="dialog"]').last();
  await dialog.screenshot({ path: path.join(IMAGES_DIR, `${name}.png`) });
  console.log(`captured ${name}.png (modal)`);
}

async function debugShot(page, name, err) {
  try {
    await page.screenshot({ path: path.join(DEBUG_DIR, `${name}-fail.png`) });
  } catch {}
  console.log(`${name} screen skipped: ${err.message.split('\n')[0]} (debug/${name}-fail.png saved)`);
}

/**
 * The borrowed e2e dismissJobResultModal() checks for data-testid
 * "job-result-modal", which doesn't exist anywhere in this codebase — the
 * actual global job-completion toast (JobResultModal.jsx) uses testId
 * "job-result", so that helper has silently been a no-op. It renders via the
 * shared ActionStatus success view too, so closing it means clicking
 * modal-status-confirm-btn scoped to this specific container.
 *
 * This account also has a backlog of REAL jobs from this script's earlier
 * interrupted runs (killing the Playwright browser doesn't cancel an
 * already-submitted CMS job — it keeps running server-side and completes
 * later) — CmsJobProvider polls and surfaces each one in turn, so one dismiss
 * isn't enough; drain the whole queue.
 */
/**
 * Several singleton modals (BackupDatabaseModal's own success view among
 * them, see line ~353 — it passes no `testId` prop to its <Modal> at all)
 * render their success view via the shared ActionStatus component, so
 * *every* one of them exposes the identical modal-status-confirm-btn testid
 * with no way to scope to a specific modal. If more than one happens to be
 * open at once, clicking just .first() closes an arbitrary one and leaves
 * the rest sitting on screen, untestid'd and undetectable — the exact
 * "leftover modal blocks every subsequent click" failure mode. Drain all of
 * them by re-querying and clicking .first() until the locator finds none.
 */
async function drainAllStatusConfirmButtons(page, attempts = 10) {
  for (let i = 0; i < attempts; i++) {
    const btn = page.getByTestId('modal-status-confirm-btn').first();
    if (!(await btn.isVisible({ timeout: 1000 }).catch(() => false))) return;
    await btn.click().catch(() => {});
    await page.waitForTimeout(400);
  }
}

/** Combines both stray-modal sweeps — call this before any context-menu
 * interaction, since either kind of leftover can block it. */
async function sweepStrayModals(page) {
  await drainAllStatusConfirmButtons(page);
  await dismissGlobalJobResultModal(page);
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

async function expandSubNodeWithRetry(page, dbTree, dbname, subId, attempts = 4) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      await sweepStrayModals(page);
      const node = await dbTree.expandSubNode(dbname, subId);
      await node.waitFor({ state: 'visible', timeout: 3000 });
      return node;
    } catch (err) {
      lastErr = err;
      await page.waitForTimeout(500);
    }
  }
  throw lastErr;
}

/**
 * clickManageDatabaseItem() only knows Korean translations for the 11 items
 * ported into MANAGE_DATABASE_MENU_KO (DatabaseTreePage.js) — "Add Database
 * Volume" isn't one of them, so under the Korean locale its English-only
 * pattern never matches the on-screen "데이터베이스 볼륨 추가" label. Reimplement
 * the same hover-then-click-with-retry locally with both languages' text.
 */
async function clickAddVolumeMenuItem(page, dbTree, dbname, attempts = 5) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      await sweepStrayModals(page);
      await dbTree.openContextMenu(dbname);
      await page.getByRole('button', { name: /Manage Database|데이터베이스 관리/i }).hover();
      const item = page.getByRole('button', { name: /Add Database Volume|데이터베이스 볼륨 추가/i });
      await item.waitFor({ state: 'visible', timeout: 3000 });
      await item.click({ timeout: 3000 });
      return;
    } catch (err) {
      lastErr = err;
      await page.mouse.click(2, 2).catch(() => {});
      await page.waitForTimeout(300);
    }
  }
  throw lastErr;
}

/** Captures a "Manage Database" submenu modal (see DatabaseTreePage.clickManageDatabaseItem)
 * then dismisses it via its cancel button testid — never submits. Used for
 * every Manage Database item, including ones that could be safely executed
 * (Check/Compact/Optimize/Backup/Unload) — the manual only needs the form,
 * not a completion/result modal, so none of these run for real anymore. */
async function captureManageItem(page, dbTree, dbname, itemName, shotName, cancelTestId) {
  try {
    await sweepStrayModals(page);
    await dbTree.clickManageDatabaseItem(dbname, itemName);
    await page.waitForTimeout(800);
    await shotModal(page, shotName);
    await page.getByTestId(cancelTestId).click().catch(() => page.keyboard.press('Escape'));
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, shotName, err); }
}

/** Same as captureManageItem, but opens via clickAddVolumeMenuItem (see above)
 * instead of dbTree.clickManageDatabaseItem — Add Database Volume isn't one
 * of the items clickManageDatabaseItem's own menu map knows. Cancel-only,
 * same as every other Manage Database item. */
async function captureAddVolumeModal(page, dbTree, dbname) {
  const shotName = 'database-add-volume';
  try {
    await sweepStrayModals(page);
    await clickAddVolumeMenuItem(page, dbTree, dbname);
    await page.waitForTimeout(800);
    await shotModal(page, shotName);
    await page.getByTestId('add-volume-cancel-btn').click().catch(() => page.keyboard.press('Escape'));
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, shotName, err); }
}

/** Same, for a "Database Info" submenu modal (see DatabaseTreePage.clickDatabaseInfoItem). */
/**
 * Locking Information / Transaction information / Plan Dump are enabled only
 * while `dbContextMenu.isActive` reads true — a client-side snapshot of the
 * activeDatabases list taken at right-click time, not a live server check.
 * Confirmed via direct DOM inspection that this can read stale/disabled for
 * several seconds right after other operations (Unload/Check/Compact/
 * AddVolume/Backup) run — dbTree.clickDatabaseInfoItem's own retry loop just
 * reopens the same context menu 5 times in a row with no real delay, so it
 * doesn't give the underlying state time to settle and instead burns through
 * default (~30s) action timeouts on a genuinely-disabled button. Poll
 * databaseState() until it reads 'running' twice in a row before proceeding.
 */
async function waitForSettledRunningState(page, dbTree, dbname, timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  let consecutive = 0;
  while (Date.now() < deadline) {
    const state = await dbTree.databaseState(dbname).catch(() => 'unknown');
    consecutive = state === 'running' ? consecutive + 1 : 0;
    if (consecutive >= 2) return;
    await page.waitForTimeout(1500);
  }
}

/** Bounds a promise so one stuck step can't silently eat several minutes —
 * dbTree's own retry loops have no single top-level timeout of their own. */
function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`${label}: hard timeout after ${ms}ms`)), ms)),
  ]);
}

async function captureInfoItem(page, dbTree, dbname, itemName, shotName, closeTestId) {
  try {
    await sweepStrayModals(page);
    await withTimeout(dbTree.clickDatabaseInfoItem(dbname, itemName), 60000, itemName);
    await page.waitForTimeout(800);
    await shotModal(page, shotName);
    await page.getByTestId(closeTestId).click().catch(() => page.keyboard.press('Escape'));
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, shotName, err); }
}

/** Clicks a top-level db-context-menu item (Stop/Start/Logout/Forget Credentials —
 * not inside the Manage Database or Database Info flyouts), retrying through the
 * same "leftover menu intercepts pointer events" flakiness clickManageDatabaseItem
 * guards against (see DatabaseTreePage.js). */
async function clickTopLevelDbItem(page, dbTree, dbname, namePattern, attempts = 5) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      await sweepStrayModals(page);
      await dbTree.openContextMenu(dbname);
      const item = page.getByRole('button', { name: namePattern });
      await item.waitFor({ state: 'visible', timeout: 3000 });
      await item.click({ timeout: 3000 });
      return;
    } catch (err) {
      lastErr = err;
      await page.mouse.click(2, 2).catch(() => {});
      await page.waitForTimeout(300);
    }
  }
  throw lastErr;
}

/** Captures a generic ConfirmDialog (Stop/Start/Logout/Forget Credentials) and
 * cancels it — these dialogs render without a data-testid (see ConfirmDialog.jsx,
 * called without a `testId` prop from Sidebar.jsx), so cancel by its label text. */
async function captureConfirmDialog(page, dbTree, dbname, itemNamePattern, shotName) {
  try {
    await clickTopLevelDbItem(page, dbTree, dbname, itemNamePattern);
    await page.waitForTimeout(500);
    await shotModal(page, shotName);
    await page.getByRole('button', { name: /^Cancel$|^취소$/ }).click().catch(() => page.keyboard.press('Escape'));
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, shotName, err); }
}

/**
 * Reimplements Start/Stop Database, bypassing the borrowed e2e page object's
 * ensureDatabaseRunning/ensureDatabaseStopped — those only click the top-level
 * menu item, but Sidebar.jsx now gates every start/stop behind a follow-up
 * ConfirmDialog (see requestActionConfirm), which those helpers never click,
 * leaving the dialog open and every subsequent locator blocked by its overlay.
 */
async function ensureDbState(page, dbTree, dbname, desiredState) {
  const current = await dbTree.databaseState(dbname).catch(() => 'unknown');
  if (current === desiredState) return;
  const label = desiredState === 'running' ? /Start Database|데이터베이스 시작/ : /Stop Database|데이터베이스 중지/;
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await clickTopLevelDbItem(page, dbTree, dbname, label);
      await page.getByRole('button', { name: label }).click({ timeout: 5000 });
      await dbTree.waitForDatabaseState(dbname, desiredState, { timeout: 45000 });
      return;
    } catch (err) {
      lastErr = err;
      await page.mouse.click(2, 2).catch(() => {});
      await page.waitForTimeout(500);
    }
  }
  throw lastErr;
}

/** Walks the 5-step Create Database wizard forward (never clicking Finish),
 * screenshotting each step, filling only the one field (dbName) that gates
 * Next at step 1 — genericVolPath/logVolPath auto-fill from the host env. */
async function captureCreateDatabaseWizard(page) {
  try {
    await dismissJobResultModal(page);
    await sweepStrayModals(page);
    await page.mouse.click(2, 2).catch(() => {});
    await page.getByTestId('tree-tab-db').click({ button: 'right' });
    const createBtn = page.getByRole('button', { name: /Create Database|데이터베이스 생성/ });
    await createBtn.waitFor({ state: 'visible', timeout: 5000 });
    await createBtn.click();
    await page.waitForTimeout(800);
    await shotModal(page, 'database-create');

    await page.getByTestId('create-database-name-input').fill('manual_screenshot_sample');
    const nextBtn = page.getByTestId('create-database-next-btn');
    for (const stepName of ['database-create-step2', 'database-create-step3', 'database-create-step4', 'database-create-step5']) {
      await nextBtn.click({ timeout: 3000 });
      await page.waitForTimeout(500);
      await shotModal(page, stepName);
    }
  } catch (err) { await debugShot(page, 'database-create', err); }
  await page.getByTestId('create-database-cancel-btn').click().catch(() => page.keyboard.press('Escape'));
  await page.waitForTimeout(300);
}

/** Delete Database is a 2-step flow: step 1 shows the volume list + confirm,
 * step 2 (reached via the SAME confirm button, which only advances the step —
 * it does not delete yet) asks for the DBA password. Capture both, then cancel. */
async function captureDeleteDatabaseModal(page, dbTree, dbname) {
  try {
    await sweepStrayModals(page);
    await dbTree.clickManageDatabaseItem(dbname, 'Delete Database');
    await page.waitForTimeout(800);
    await shotModal(page, 'database-delete');
    await page.getByTestId('delete-database-confirm-btn').click({ timeout: 3000 });
    await page.waitForTimeout(500);
    await shotModal(page, 'database-delete-confirm');
  } catch (err) { await debugShot(page, 'database-delete', err); }
  await page.getByTestId('delete-database-cancel-btn').click().catch(() => page.keyboard.press('Escape'));
  await page.waitForTimeout(300);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // --- Login screen ---
  await page.goto(`${BASE_URL}/login`);
  await page.waitForTimeout(500);
  // All manual screenshots are captured in Korean. The toggle persists to
  // localStorage (cwm-ui-locale) and applies immediately with no reload, so
  // this one click covers every screen for the rest of the run.
  await page.getByRole('button', { name: 'KR' }).click({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(300);
  // All manual screenshots are captured in dark mode. Theme (like locale)
  // persists to localStorage and applies via a reactive class on <html>, so
  // one toggle here covers every screen for the rest of the run. Checks the
  // actual current state first instead of blindly toggling — the OS/browser
  // default (or a stale localStorage value) could already be dark.
  const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  if (!isDark) {
    await page.getByTestId('login-theme-toggle').click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(300);
  }
  await shot(page, 'login');

  // --- Register screen ---
  await page.goto(`${BASE_URL}/register`);
  await page.waitForTimeout(500);
  await shot(page, 'register');
  await page.goto(`${BASE_URL}/login`);
  await page.waitForTimeout(500);

  // --- Login ---
  await page.getByTestId('login-username-input').fill(E2E_USERNAME);
  await page.getByTestId('login-password-input').fill(E2E_PASSWORD);
  await page.getByTestId('login-submit-btn').click();
  await page.waitForURL('**/home', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1000);
  await shot(page, 'main-layout');

  // --- Service Dashboard (top nav, independent of any specific host — do
  // this early before any tree/tab state could get into a weird spot) ---
  try {
    // The webmanager account's UI locale (EN/KR toggle, top-right) is whatever
    // that account last selected — not necessarily Korean — so match both
    // languages' labels (see cmLabels.js / cmLabels.ko.js) rather than assuming one.
    await page.getByText(/Host Service Management|호스트 서비스 관리/).hover({ timeout: 10000 });
    await page.getByRole('button', { name: /Service Dashboard|서비스 대시보드/ }).click({ timeout: 5000 });
    await page.waitForTimeout(1000);
    await shot(page, 'service-dashboard');
    // Close that tab if one opened, to get back to a clean state.
    const closeBtn = page.locator('[data-testid^="tab-"] [aria-label="Close"]').first();
    await closeBtn.click({ timeout: 2000 }).catch(() => {});
  } catch (err) { await debugShot(page, 'service-dashboard', err); }

  // --- Host tree: find the registered test host row (see HostTreePage.js) ---
  const hostRow = page.getByText(E2E_HOST_ALIAS, { exact: true }).first();
  if (await hostRow.isVisible({ timeout: 10000 }).catch(() => false)) {
    await shot(page, 'host-tree');

    // Add Host modal (see host_add.spec.js)
    try {
      await page.getByTestId('add-host-toolbar-btn').click({ timeout: 5000 });
      await page.waitForTimeout(300);
      await shotModal(page, 'host-add');
      await page.getByTestId('add-host-cancel-btn').click().catch(() => page.keyboard.press('Escape'));
      await page.waitForTimeout(300);
    } catch (err) { await debugShot(page, 'host-add', err); }

    // Login to host + open DB tree
    await hostRow.dblclick();
    await page.locator('#db-tree-container').waitFor({ timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await shot(page, 'server-dashboard');

    const dbTree = new DatabaseTreePage(page);
    const dbRow = page.getByTestId(`tree-node-${E2E_DB}`);
    if (await dbRow.isVisible().catch(() => false)) {
      await shot(page, 'database-tree');
      // ensureDatabaseLoggedIn (from the repaired e2e page object) both logs
      // in and verifies it actually took via a login-gated menu item — more
      // robust than a bare double-click, since a stale saved profile can log
      // in in the background with no modal at all.
      await dbTree.ensureDatabaseLoggedIn(E2E_DB);
      await dbRow.dblclick();
      await page.waitForTimeout(1500);
      await shot(page, 'database-dashboard');

      // Create Database wizard — walks all 5 steps, never clicks Finish (would
      // create a real database on the live host).
      await captureCreateDatabaseWizard(page);

      // --- Full sweep of "Manage Database" / "Database Info" / top-level db
      // operations. Several menu items are disabled while the database is
      // running (Load/Optimize/Copy/Rename/Restore/Delete — see Sidebar.jsx's
      // `disabled={dbContextMenu.isActive || ...}`) and a few are disabled
      // while it's stopped (Locking/Transaction/Plan Dump info — need a live
      // server to report on). So this actually stops and restarts E2E_DB once
      // to reach both states — never submits anything destructive, only opens
      // each modal, screenshots it, and cancels. The db is restored to
      // whatever state it was in before this sweep, in a finally block.
      const originalDbState = await dbTree.databaseState(E2E_DB).catch(() => 'unknown');
      try {
        // --- Requires the database RUNNING ---
        await ensureDbState(page, dbTree, E2E_DB, 'running');

        await captureConfirmDialog(page, dbTree, E2E_DB, /Stop Database|데이터베이스 중지/, 'database-stop-confirm');
        await captureManageItem(page, dbTree, E2E_DB, 'Unload Database', 'database-unload', 'unload-database-cancel-btn');
        await captureManageItem(page, dbTree, E2E_DB, 'Check Database', 'database-check', 'check-database-cancel-btn');
        await captureManageItem(page, dbTree, E2E_DB, 'Compact Database', 'database-compact', 'compact-database-cancel-btn');
        await captureAddVolumeModal(page, dbTree, E2E_DB);
        await captureManageItem(page, dbTree, E2E_DB, 'Backup Database', 'backup-database', 'backup-database-cancel-btn');

        await waitForSettledRunningState(page, dbTree, E2E_DB);
        await captureInfoItem(page, dbTree, E2E_DB, 'Locking Information', 'database-lock-info', 'lock-information-close-btn');
        await captureInfoItem(page, dbTree, E2E_DB, 'Transaction information', 'database-transaction-info', 'transaction-info-close-btn');
        await captureInfoItem(page, dbTree, E2E_DB, 'Param Dump', 'database-param-dump', 'database-info-cancel-btn');
        await captureInfoItem(page, dbTree, E2E_DB, 'Plan Dump', 'database-plan-dump', 'plan-dump-close-btn');

        await captureConfirmDialog(page, dbTree, E2E_DB, /Logout Database|데이터베이스 로그아웃/, 'database-logout-confirm');
        await captureConfirmDialog(page, dbTree, E2E_DB, /Forget Saved Credentials|저장된 자격증명 삭제/, 'database-forget-credentials-confirm');

        // --- Requires the database STOPPED ---
        await ensureDbState(page, dbTree, E2E_DB, 'stopped');

        await captureConfirmDialog(page, dbTree, E2E_DB, /Start Database|데이터베이스 시작/, 'database-start-confirm');
        // Load Database stays open-then-cancel (not executed): correctly
        // wiring which unload file / target db name to load is complex
        // enough via blind automation that a wrong invocation risks actually
        // corrupting the demo database's data — not worth the risk for a
        // screenshot the form view already documents well enough.
        await captureManageItem(page, dbTree, E2E_DB, 'Load Database', 'database-load', 'load-database-cancel-btn');
        await captureManageItem(page, dbTree, E2E_DB, 'Optimize Database', 'database-optimize', 'optimize-database-cancel-btn');
        await captureManageItem(page, dbTree, E2E_DB, 'Copy Database', 'database-copy', 'copy-database-cancel-btn');
        await captureManageItem(page, dbTree, E2E_DB, 'Rename Database', 'database-rename', 'rename-database-cancel-btn');
        await captureManageItem(page, dbTree, E2E_DB, 'Restore Database', 'database-restore', 'restore-database-cancel-btn');
        await captureDeleteDatabaseModal(page, dbTree, E2E_DB);
      } catch (err) {
        await debugShot(page, 'db-operations-sweep', err);
      } finally {
        try {
          await ensureDbState(page, dbTree, E2E_DB, originalDbState === 'stopped' ? 'stopped' : 'running');
        } catch (err) {
          console.log(`WARNING: failed to restore ${E2E_DB} to its original state (${originalDbState}): ${err.message.split('\n')[0]}`);
        }
      }

      // Backup Plan / Query Plan / Users all live one level deeper, inside
      // the "Job automation" (작업 자동화) folder — must expand that first.
      await expandSubNodeWithRetry(page, dbTree, E2E_DB, 'Job automation');

      // Backup Plan
      try {
        const planFolder = await expandSubNodeWithRetry(page, dbTree, E2E_DB, 'Backup Plan');
        await planFolder.locator('> summary').click({ button: 'right' });
        const createBtn = page.getByRole('button', { name: /Create Backup Plan|백업 자동화 계획 추가/ });
        await createBtn.waitFor({ state: 'visible', timeout: 5000 });
        await createBtn.click();
        await page.waitForTimeout(800);
        await shotModal(page, 'backup-plan');
        await page.getByTestId('add-backup-plan-discard-btn').click().catch(() => page.keyboard.press('Escape'));
        await page.waitForTimeout(300);
      } catch (err) { await debugShot(page, 'backup-plan', err); }

      // Query Plan (Job automation)
      try {
        const queryFolder = await expandSubNodeWithRetry(page, dbTree, E2E_DB, 'Query Plan');
        await queryFolder.locator('> summary').click({ button: 'right' });
        const addBtn = page.getByRole('button', { name: /Add Query Plan|질의 자동화 계획 추가/ });
        await addBtn.waitFor({ state: 'visible', timeout: 5000 });
        await addBtn.click();
        await page.waitForTimeout(800);
        await shotModal(page, 'query-plan');
        await page.getByTestId('add-query-plan-cancel-btn').click().catch(() => page.keyboard.press('Escape'));
        await page.waitForTimeout(300);
      } catch (err) { await debugShot(page, 'query-plan', err); }

      // Users folder
      try {
        const usersFolder = await expandSubNodeWithRetry(page, dbTree, E2E_DB, 'Users');
        await usersFolder.locator('> summary').click({ button: 'right' });
        const addUserBtn = page.getByRole('button', { name: /Add User|사용자 추가/ });
        await addUserBtn.waitFor({ state: 'visible', timeout: 5000 });
        await addUserBtn.click();
        await page.waitForTimeout(800);
        await shotModal(page, 'db-user');
        await page.getByTestId('create-user-cancel-btn').click().catch(() => page.keyboard.press('Escape'));
        await page.waitForTimeout(300);
      } catch (err) { await debugShot(page, 'db-user', err); }
    }

    // Broker tree + log viewer (see BrokerTreePage.js)
    try {
      const brokerTree = new BrokerTreePage(page);
      await brokerTree.switchToBrokerTab();
      await page.waitForTimeout(500);
      await shot(page, 'broker-tree');

      const brokerNodes = page.locator('#broker-tree-container [data-testid^="tree-node-"]');
      const count = await brokerNodes.count();
      let captured = false;
      for (let i = 0; i < count && !captured; i++) {
        const broker = brokerNodes.nth(i);
        const brokerName = (await broker.getAttribute('data-testid')).replace('tree-node-', '');
        if (brokerName.includes('/')) continue; // skip log-file leaves, only top-level brokers
        try {
          // BrokerTreePage.expandSqlLogFolder() only matches the English
          // "SQL Log" text; this app's Korean locale shows "SQL 로그"
          // (see cmLabels.ko.js's sqlLog key) — expand it locale-tolerantly here.
          await brokerTree.expandBroker(brokerName);
          const broker = brokerTree.brokerNode(brokerName);
          const sqlLogSummary = broker.getByText(/SQL Log|SQL 로그/i).first();
          await sqlLogSummary.waitFor({ state: 'visible', timeout: 5000 });
          await sqlLogSummary.click();
          const logFile = brokerTree.firstLogFileNode(brokerName);
          if (await logFile.isVisible({ timeout: 3000 }).catch(() => false)) {
            await logFile.dblclick();
            await page.waitForTimeout(1500);
            await shot(page, 'broker-log-viewer');
            captured = true;
          }
        } catch { /* try next broker */ }
      }
      if (!captured) console.log('broker-log-viewer skipped: no broker with a visible log file found');
    } catch (err) { await debugShot(page, 'broker-tree', err); }

    // Log tab — third tree tab alongside Database/Broker (see TreeTabHeader.jsx).
    try {
      await page.getByTestId('tree-tab-log').click({ timeout: 5000 });
      await page.waitForTimeout(500);
      await shot(page, 'log-tree');
    } catch (err) { await debugShot(page, 'log-tree', err); }
  } else {
    console.log(`Host row for alias "${E2E_HOST_ALIAS}" not found — skipping host/db/broker screens.`);
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
