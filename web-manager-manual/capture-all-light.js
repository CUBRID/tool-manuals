// Consolidated Playwright script that recaptures every screenshot in this
// manual's images/ directory, in LIGHT mode instead of dark. It reuses the
// exact navigation/interaction logic from the 4 existing capture-*.js scripts
// (capture-screenshots.js, capture-gap-screenshots.js, capture-gap2-screenshots.js,
// capture-gap3-screenshots.js) plus the ad-hoc approach used for login.png,
// register.png, host-server-version.png and host-login-all-result.png — only
// the color theme changes (KR locale is kept).
//
// Each "section" below opens its own fresh browser context and logs in on its
// own, mirroring how the 4 original scripts were each run as independent
// processes — this avoids carrying cross-section UI/tree state that the
// originals never had to deal with.
//
// Usage: E2E_USERNAME=... E2E_PASSWORD=... node capture-all-light.js

const path = require('path');
const fs = require('fs');
const E2E_DIR = path.join(__dirname, '../../cubrid-webmanager-e2e');
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
const E2E_HOST_ALIAS = process.env.E2E_HOST_ALIAS || 'PM';
const E2E_HOST_ADDRESS = process.env.E2E_HOST_ADDRESS || '192.168.3.120';
const E2E_DB = process.env.E2E_DB || 'demodb';

const IMAGES_DIR = path.join(__dirname, 'images');
const DEBUG_DIR = path.join(__dirname, 'debug-light');
fs.mkdirSync(DEBUG_DIR, { recursive: true });

// ─────────────────────────── shared helpers ───────────────────────────

async function shot(page, name) {
  await page.screenshot({ path: path.join(IMAGES_DIR, `${name}.png`) });
  console.log(`captured ${name}.png`);
}

async function shotModal(page, name) {
  const dialog = page.locator('[role="dialog"]').last();
  await dialog.screenshot({ path: path.join(IMAGES_DIR, `${name}.png`) });
  console.log(`captured ${name}.png (modal)`);
}

async function shotContextMenu(page, name) {
  const menu = page.locator('.context-menu-container').last();
  await menu.screenshot({ path: path.join(IMAGES_DIR, `${name}.png`) });
  console.log(`captured ${name}.png (menu)`);
}

async function shotPopover(page, name) {
  const popover = page.locator('div.rounded-2xl.shadow-2xl').last();
  await popover.screenshot({ path: path.join(IMAGES_DIR, `${name}.png`) });
  console.log(`captured ${name}.png (popover)`);
}

async function shotDropdown(page, name) {
  const menu = page.locator('div.z-1000.rounded-xl:not(.context-menu-container)').last();
  await menu.screenshot({ path: path.join(IMAGES_DIR, `${name}.png`) });
  console.log(`captured ${name}.png (dropdown)`);
}

/** Crops to just a centered rounded-2xl card (login/register pages, and the
 * global StatusModal) instead of a full-viewport shot with black page
 * background bleeding around it. */
async function shotCard(page, name, scope = '') {
  const card = page.locator(`${scope} .rounded-2xl`).first();
  await card.screenshot({ path: path.join(IMAGES_DIR, `${name}.png`) });
  console.log(`captured ${name}.png (card)`);
}

function lastContextMenu(page) {
  return page.locator('.context-menu-container').last();
}

function lastDropdown(page) {
  return page.locator('div.z-1000.rounded-xl:not(.context-menu-container)').last();
}

async function clickMenuItemByIcon(scope, iconName) {
  const item = scope.locator(`button:has(span.material-symbols-outlined:text-is("${iconName}"))`).first();
  await item.waitFor({ state: 'visible', timeout: 5000 });
  await item.click();
}

async function debugShot(page, name, err) {
  try {
    await page.screenshot({ path: path.join(DEBUG_DIR, `${name}-fail.png`) });
  } catch {}
  console.log(`${name} screen skipped: ${err.message.split('\n')[0]} (debug-light/${name}-fail.png saved)`);
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

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`${label}: hard timeout after ${ms}ms`)), ms)),
  ]);
}

async function captureInfoItem(page, dbTree, dbname, itemName, shotName, closeTestId) {
  try {
    await sweepStrayModals(page);
    // Bounded to ~20s per the operator's guidance: don't let one stuck step
    // (e.g. a hung info/version fetch against a shaky host) stall the whole
    // run — abandon it and move on rather than waiting indefinitely.
    await withTimeout(dbTree.clickDatabaseInfoItem(dbname, itemName), 20000, itemName);
    await page.waitForTimeout(800);
    await shotModal(page, shotName);
    await page.getByTestId(closeTestId).click().catch(() => page.keyboard.press('Escape'));
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, shotName, err); }
}

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

async function captureConfirmDialog(page, dbTree, dbname, itemNamePattern, shotName) {
  try {
    await clickTopLevelDbItem(page, dbTree, dbname, itemNamePattern);
    await page.waitForTimeout(500);
    await shotModal(page, shotName);
    await page.getByRole('button', { name: /^Cancel$|^취소$/ }).click().catch(() => page.keyboard.press('Escape'));
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, shotName, err); }
}

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

/** Waits for the Space monitor's async storage-analysis fetch to finish
 * (CM.analyzingStorage / "저장 용량 분석 중...") before screenshotting anything
 * downstream of it — Category/Volume monitors share the same
 * spaceInfoLoading[hostUid:dbname] redux flag, so one wait here covers the
 * whole Space → Category → Volume drill-down chain. Without this, a shot
 * taken too early shows the loading spinner or a stale "0 volumes" empty
 * state instead of the real populated data. */
async function waitForSpaceInfoLoaded(page, timeoutMs = 20000) {
  const loadingText = page.getByText('저장 용량 분석 중...');
  const isLoading = await loadingText.isVisible({ timeout: 1000 }).catch(() => false);
  if (isLoading) {
    await loadingText.waitFor({ state: 'hidden', timeout: timeoutMs }).catch(() => {});
    await page.waitForTimeout(500);
  }
}

/**
 * Double-clicks a host row and waits for its DB tree to appear. Returns
 * whether it actually connected. A host's CMS process can be down/stalled
 * (observed directly during this run: 192.168.3.120's cub_manager stopped
 * responding entirely mid-session — "No response was received from CMS" —
 * a known flaky failure mode, see memory cms-stall-and-branch-fragmentation),
 * in which case the app opens a "Modify Host" error modal instead of the DB
 * tree. That modal blocks every subsequent click if left open, so on failure
 * this always closes it before returning — callers can then skip
 * host-dependent captures without cascading the failure into unrelated ones.
 */
async function connectToHost(page, hostRow, { timeout = 15000 } = {}) {
  await hostRow.dblclick();
  const connected = await page.locator('#db-tree-container').waitFor({ timeout }).then(() => true).catch(() => false);
  if (!connected) {
    await closeAnyOpenModal(page).catch(() => {});
  }
  return connected;
}

async function expandAllHostGroups(page) {
  const groupDetails = page.locator('#host-section details, aside details');
  const gCount = await groupDetails.count().catch(() => 0);
  for (let i = 0; i < gCount; i++) {
    const isOpen = await groupDetails.nth(i).evaluate((el) => el.open).catch(() => true);
    if (!isOpen) await groupDetails.nth(i).locator('> summary').click().catch(() => {});
  }
  await page.waitForTimeout(300);
}

/**
 * Shared login flow for every section: KR locale, then LIGHT mode (forced —
 * checks the actual current state instead of assuming, since localStorage
 * from a prior run could already have either theme set).
 */
async function loginLight(page, { doLogin = true } = {}) {
  await page.goto(`${BASE_URL}/login`);
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'KR' }).click({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(300);
  const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  if (isDark) {
    await page.getByTestId('login-theme-toggle').click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(300);
  }
  if (!doLogin) return;
  await page.getByTestId('login-username-input').fill(E2E_USERNAME);
  await page.getByTestId('login-password-input').fill(E2E_PASSWORD);
  await page.getByTestId('login-submit-btn').click();
  await page.waitForURL('**/home', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1000);
  await sweepStrayModals(page);
}

async function newSection(browser) {
  const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1440, height: 900 } });
  return { context, page: await context.newPage() };
}

// ─────────────────────────── section 1 (capture-screenshots.js) ───────────────────────────

async function sectionMain(browser) {
  const { context, page } = await newSection(browser);

  // --- Login screen (ad-hoc: crop to the centered card, KR + light) ---
  await loginLight(page, { doLogin: false });
  await shotCard(page, 'login');

  // --- Register screen (ad-hoc: crop to the centered card) ---
  await page.goto(`${BASE_URL}/register`);
  await page.waitForTimeout(500);
  await shotCard(page, 'register');
  await page.goto(`${BASE_URL}/login`);
  await page.waitForTimeout(500);

  // --- Actual login ---
  await page.getByTestId('login-username-input').fill(E2E_USERNAME);
  await page.getByTestId('login-password-input').fill(E2E_PASSWORD);
  await page.getByTestId('login-submit-btn').click();
  await page.waitForURL('**/home', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1000);
  await shot(page, 'main-layout');

  // --- Service Dashboard ---
  try {
    await page.getByText(/Host Service Management|호스트 서비스 관리/).hover({ timeout: 10000 });
    await page.getByRole('button', { name: /Service Dashboard|서비스 대시보드/ }).click({ timeout: 5000 });
    await page.waitForTimeout(1000);
    await shot(page, 'service-dashboard');
    const closeBtn = page.locator('[data-testid^="tab-"] [aria-label="Close"]').first();
    await closeBtn.click({ timeout: 2000 }).catch(() => {});
  } catch (err) { await debugShot(page, 'service-dashboard', err); }

  // --- Host tree ---
  // NOTE: the original script's default E2E_HOST_ALIAS ('PM') no longer
  // matches any currently-registered host alias (verified live: the actual
  // host list only has MASTER/SLAVE/REPLICA for the HA group and bare
  // IP-address labels for the Non-HA hosts) — target by address instead,
  // matching how the other 3 capture-gap*.js scripts already do it.
  await expandAllHostGroups(page);
  const hostRow = page.locator(`[data-testid^="host-item-"][title^="${E2E_HOST_ADDRESS}:"]`).first();
  if (await hostRow.waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false)) {
    await shot(page, 'host-tree');

    try {
      await page.getByTestId('add-host-toolbar-btn').click({ timeout: 5000 });
      await page.waitForTimeout(300);
      await shotModal(page, 'host-add');
      await page.getByTestId('add-host-cancel-btn').click().catch(() => page.keyboard.press('Escape'));
      await page.waitForTimeout(300);
    } catch (err) { await debugShot(page, 'host-add', err); }

    const connected = await connectToHost(page, hostRow);
    if (!connected) {
      console.log(`Could not connect to host ${E2E_HOST_ADDRESS} (CMS unreachable) — skipping host/db/broker screens.`);
      await context.close();
      return;
    }
    await page.waitForTimeout(3000);
    await shot(page, 'server-dashboard');

    const dbTree = new DatabaseTreePage(page);
    const dbRow = page.getByTestId(`tree-node-${E2E_DB}`);
    if (await dbRow.waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false)) {
      await shot(page, 'database-tree');
      await dbTree.ensureDatabaseLoggedIn(E2E_DB);
      await dbRow.dblclick();
      await page.waitForTimeout(1500);
      await shot(page, 'database-dashboard');

      await captureCreateDatabaseWizard(page);

      // NOTE: split into two independent try/catch blocks (one per required
      // state) rather than one big sweep — a hung/failed state transition for
      // one subset must not prevent attempting the other, and must not hang
      // indefinitely itself. Each ensureDbState call is bounded so a shaky
      // host degrades to "skip this subset" rather than stalling the whole
      // run for minutes.
      const originalDbState = await dbTree.databaseState(E2E_DB).catch(() => 'unknown');

      let reachedRunning = false;
      try {
        await withTimeout(ensureDbState(page, dbTree, E2E_DB, 'running'), 30000, 'ensureDbState(running)');
        reachedRunning = true;
      } catch (err) {
        console.log(`Could not bring ${E2E_DB} to 'running' — skipping the running-state item set (stop-confirm/unload/check/compact/add-volume/backup/lock-transaction-param-plan-info/logout/forget-credentials): ${err.message.split('\n')[0]}`);
      }
      if (reachedRunning) {
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
      }

      let reachedStopped = false;
      try {
        await withTimeout(ensureDbState(page, dbTree, E2E_DB, 'stopped'), 30000, 'ensureDbState(stopped)');
        reachedStopped = true;
      } catch (err) {
        console.log(`Could not bring ${E2E_DB} to 'stopped' — skipping the stopped-state item set (start-confirm/load/optimize/copy/rename/restore/delete): ${err.message.split('\n')[0]}`);
      }
      if (reachedStopped) {
        await captureConfirmDialog(page, dbTree, E2E_DB, /Start Database|데이터베이스 시작/, 'database-start-confirm');
        await captureManageItem(page, dbTree, E2E_DB, 'Load Database', 'database-load', 'load-database-cancel-btn');
        await captureManageItem(page, dbTree, E2E_DB, 'Optimize Database', 'database-optimize', 'optimize-database-cancel-btn');
        await captureManageItem(page, dbTree, E2E_DB, 'Copy Database', 'database-copy', 'copy-database-cancel-btn');
        await captureManageItem(page, dbTree, E2E_DB, 'Rename Database', 'database-rename', 'rename-database-cancel-btn');
        await captureManageItem(page, dbTree, E2E_DB, 'Restore Database', 'database-restore', 'restore-database-cancel-btn');
        await captureDeleteDatabaseModal(page, dbTree, E2E_DB);
      }

      // Best-effort restore to the ORIGINAL state only — never force a
      // state we don't actually know was the starting one (a prior version
      // of this defaulted unknown-state to 'running', which could itself
      // hang retrying a start against a shaky host for minutes).
      if (originalDbState === 'running' || originalDbState === 'stopped') {
        try {
          await withTimeout(ensureDbState(page, dbTree, E2E_DB, originalDbState), 30000, 'restore original state');
        } catch (err) {
          console.log(`WARNING: failed to restore ${E2E_DB} to its original state (${originalDbState}): ${err.message.split('\n')[0]}`);
        }
      }

      await expandSubNodeWithRetry(page, dbTree, E2E_DB, 'Job automation');

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
    } else {
      console.log(`Database row "${E2E_DB}" not found under ${E2E_HOST_ADDRESS} — skipping database-tree/dashboard/manage-sweep/backup-plan/query-plan/db-user screens.`);
    }

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
        if (brokerName.includes('/')) continue;
        try {
          await brokerTree.expandBroker(brokerName);
          const broker2 = brokerTree.brokerNode(brokerName);
          const sqlLogSummary = broker2.getByText(/SQL Log|SQL 로그/i).first();
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

    try {
      await page.getByTestId('tree-tab-log').click({ timeout: 5000 });
      await page.waitForTimeout(500);
      await shot(page, 'log-tree');
    } catch (err) { await debugShot(page, 'log-tree', err); }
  } else {
    console.log(`Host row for address "${E2E_HOST_ADDRESS}" not found — skipping host/db/broker screens.`);
  }

  await context.close();
}

// ─────────────────────────── section 2 (capture-gap-screenshots.js) ───────────────────────────

async function sectionGap(browser) {
  const { context, page } = await newSection(browser);
  await loginLight(page);

  // Feature 5: account profile / change password
  try {
    await sweepStrayModals(page);
    const profileBtn = page.locator('header button', { hasText: E2E_USERNAME });
    await profileBtn.first().click({ timeout: 5000 });
    await page.waitForTimeout(500);
    await shotModal(page, 'auth-account-profile');

    const changePwBtn = page.getByRole('button', { name: /Change Password|비밀번호 변경/ });
    await changePwBtn.click({ timeout: 3000 });
    await page.waitForTimeout(400);
    await shotModal(page, 'auth-account-change-password');

    await page.getByRole('button', { name: /^Cancel$|^취소$/ }).click({ timeout: 3000 }).catch(() => {});
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, 'auth-account-profile', err); }

  // Login to known-good host + DB tree
  try {
    await sweepStrayModals(page);
    await expandAllHostGroups(page);

    const hostRow = page.locator(`[data-testid^="host-item-"][title^="${E2E_HOST_ADDRESS}:"]`).first();
    await hostRow.waitFor({ state: 'visible', timeout: 10000 });
    const connected = await connectToHost(page, hostRow);
    if (!connected) throw new Error(`could not connect to host ${E2E_HOST_ADDRESS} (CMS unreachable)`);
    await page.waitForTimeout(2000);
    await sweepStrayModals(page);

    // Feature 3: ALL DATABASES root context menu
    try {
      await page.mouse.click(2, 2).catch(() => {});
      await page.getByTestId('tree-tab-db').click({ button: 'right', timeout: 5000 });
      await page.waitForTimeout(500);
      await shotContextMenu(page, 'database-all-databases-menu');

      const startAllBtn = page.getByRole('button', { name: /Start All Databases|모든 데이터베이스 시작/ });
      await startAllBtn.click({ timeout: 3000 });
      await page.waitForTimeout(500);
      await shotModal(page, 'database-start-all-confirm');
      await page.getByRole('button', { name: /^Cancel$|^취소$/ }).click({ timeout: 3000 }).catch(() => page.keyboard.press('Escape'));
      await page.waitForTimeout(300);
    } catch (err) { await debugShot(page, 'database-all-databases-menu', err); }

    // Feature 1: Space / Volume monitors
    // NOTE: locator.isVisible() does NOT actually wait for the `timeout`
    // given — Playwright checks the current DOM state immediately and
    // ignores that option. Use waitFor() wherever the element might still be
    // rendering asynchronously (a plain isVisible() check right after it can
    // race and silently skip a whole section).
    const dbRow = page.getByTestId(`tree-node-${E2E_DB}`);
    if (await dbRow.waitFor({ state: 'visible', timeout: 8000 }).then(() => true).catch(() => false)) {
      await dbRow.locator('> summary').dblclick();
      await page.waitForTimeout(1000);
      const loginModal = page.getByTestId('login-database-modal');
      if (await loginModal.waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false)) {
        await loginModal.locator('input').nth(1).fill('dba');
        await page.getByTestId('login-database-submit-btn').click();
        await loginModal.waitFor({ state: 'hidden', timeout: 20000 }).catch(() => {});
      }
      await page.waitForTimeout(1500);
      await sweepStrayModals(page);

      try {
        const gearBtn = page.locator('button[title="새로고침 설정"], button[title="Refresh Settings"]').first();
        await gearBtn.click({ timeout: 5000 });
        await page.waitForTimeout(400);
        await shotPopover(page, 'monitoring-refresh-interval');
        await gearBtn.click({ timeout: 3000 }).catch(() => {});
        await page.waitForTimeout(300);
      } catch (err) { await debugShot(page, 'monitoring-refresh-interval', err); }

      try {
        const isOpen = await dbRow.evaluate((el) => el.open).catch(() => false);
        if (!isOpen) await dbRow.locator('> summary').click();
        await page.waitForTimeout(500);
        const spaceNode = dbRow.getByTestId('tree-node-Space');
        await spaceNode.waitFor({ state: 'visible', timeout: 10000 });
        await spaceNode.locator('> summary').dblclick();
        await page.waitForTimeout(1500);
        // Wait for the async storage-analysis fetch to actually finish before
        // screenshotting — otherwise this (and everything drilled into below,
        // which shares the same loaded space info) can capture the loading
        // spinner or a stale "0 volumes" empty state instead of real data.
        await waitForSpaceInfoLoaded(page);
        await shot(page, 'database-space-monitor');

        const spaceOpen = await spaceNode.evaluate((el) => el.open).catch(() => false);
        if (!spaceOpen) await spaceNode.locator('> summary').click();
        await page.waitForTimeout(500);
        const categoryNode = spaceNode.getByTestId('tree-node-Permanent_PermanentData');
        await categoryNode.waitFor({ state: 'visible', timeout: 10000 });
        await categoryNode.locator('> summary').dblclick();
        await page.waitForTimeout(1500);
        await waitForSpaceInfoLoaded(page);
        await shot(page, 'database-volume-category-monitor');

        const catOpen = await categoryNode.evaluate((el) => el.open).catch(() => false);
        if (!catOpen) await categoryNode.locator('> summary').click();
        await page.waitForTimeout(500);
        const volumeLeaf = categoryNode.locator('[data-testid^="tree-node-"]').first();
        if (await volumeLeaf.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false)) {
          await volumeLeaf.dblclick();
          await page.waitForTimeout(1500);
          await waitForSpaceInfoLoaded(page);
          await shot(page, 'database-volume-info-monitor');
        } else {
          console.log('database-volume-info-monitor skipped: no volume leaf found under Permanent_PermanentData');
        }
      } catch (err) { await debugShot(page, 'database-space-monitor', err); }
    } else {
      console.log(`Database row "${E2E_DB}" not found — skipping space/volume monitor screens.`);
    }
  } catch (err) { await debugShot(page, 'host-login', err); }

  await closeAnyOpenModal(page);

  // Feature 2: host multi-select + bulk context menu
  try {
    await page.mouse.click(2, 2).catch(() => {});
    await sweepStrayModals(page);
    await expandAllHostGroups(page);

    // Close every open tab from the earlier host/db work above so the main
    // content pane shows the plain "no host selected" welcome screen — this
    // shot is only about the sidebar's multi-select highlighting, and a
    // leftover data tab behind it is just clutter (matches the original
    // capture-gap-screenshots.js run, which did this step first thing after
    // login with nothing else open yet).
    let closeBtn = page.locator('[data-testid^="tab-"] [aria-label="Close"]').first();
    for (let i = 0; i < 10 && (await closeBtn.isVisible({ timeout: 500 }).catch(() => false)); i++) {
      await closeBtn.click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(200);
      closeBtn = page.locator('[data-testid^="tab-"] [aria-label="Close"]').first();
    }

    const hostRows = page.locator('[data-testid^="host-item-"]');
    const hostCount = await hostRows.count();
    if (hostCount >= 2) {
      await hostRows.nth(0).click({ modifiers: ['ControlOrMeta'], timeout: 5000 });
      await hostRows.nth(1).click({ modifiers: ['ControlOrMeta'], timeout: 5000 });
      await page.waitForTimeout(300);
      await shot(page, 'host-bulk-select');

      await hostRows.nth(1).click({ button: 'right', timeout: 5000 });
      await page.waitForTimeout(400);
      await shotContextMenu(page, 'host-bulk-context-menu');

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

  await context.close();
}

// ─────────────────────────── section 3 (capture-gap2-screenshots.js, host-server-version ad-hoc) ───────────────────────────

async function sectionGap2(browser) {
  const { context, page } = await newSection(browser);
  await loginLight(page);

  try {
    await expandAllHostGroups(page);
    const hostRow = page.locator(`[data-testid^="host-item-"][title^="${E2E_HOST_ADDRESS}:"]`).first();
    await hostRow.waitFor({ state: 'visible', timeout: 10000 });
    const connected = await connectToHost(page, hostRow);
    if (!connected) console.log(`WARNING: could not connect to host ${E2E_HOST_ADDRESS} (CMS unreachable) — db-dependent captures below will likely fail.`);
    await page.waitForTimeout(2000);
    await sweepStrayModals(page);
  } catch (err) { await debugShot(page, 'host-select', err); }
  // Always clear any leftover error modal from a failed connection attempt
  // above — otherwise it blocks every subsequent click, cascading one down
  // host into failing unrelated (host-independent) captures too.
  await closeAnyOpenModal(page).catch(() => {});

  // Feature 6: Help menu
  try {
    const helpBtn = page.locator('nav button').nth(2);
    await helpBtn.hover({ timeout: 5000 });
    await page.waitForTimeout(500);
    await shotDropdown(page, 'navigation-help-menu');
    await page.mouse.click(2, 2).catch(() => {});
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, 'navigation-help-menu', err); }

  // Feature 7 (ad-hoc override): Server Version modal via right-click on the
  // known host row directly, rather than through the Help menu — matches the
  // most-recently-used approach for this specific shot.
  try {
    await expandAllHostGroups(page);
    const hostRow = page.locator(`[data-testid^="host-item-"][title^="${E2E_HOST_ADDRESS}:"]`).first();
    await hostRow.waitFor({ state: 'visible', timeout: 10000 });
    await hostRow.click({ button: 'right', timeout: 5000 });
    await page.waitForTimeout(400);
    const menu = lastContextMenu(page);
    await clickMenuItemByIcon(menu, 'info'); // 서버 버전
    await page.waitForTimeout(1200);
    await shotModal(page, 'host-server-version');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, 'host-server-version', err); }

  // DB login (needed for Set Automation Volume etc.)
  const dbRow = page.getByTestId(`tree-node-${E2E_DB}`);
  try {
    await dbRow.waitFor({ state: 'visible', timeout: 10000 });
    const dbOpen = await dbRow.evaluate((el) => el.open).catch(() => false);
    if (!dbOpen) await dbRow.locator('> summary').click();
    await page.waitForTimeout(500);

    await dbRow.locator('> summary').dblclick();
    await page.waitForTimeout(1000);
    const loginModal = page.getByTestId('login-database-modal');
    if (await loginModal.waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false)) {
      await loginModal.locator('input').nth(1).fill('dba');
      await page.getByTestId('login-database-submit-btn').click();
      await loginModal.waitFor({ state: 'hidden', timeout: 20000 }).catch(() => {});
    }
    await page.waitForTimeout(1500);
    await sweepStrayModals(page);
  } catch (err) { await debugShot(page, 'db-login', err); }

  // Feature 9a: Auto Backup Log
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
    await clickMenuItemByIcon(lastContextMenu(page), 'history');
    await page.waitForTimeout(1200);
    await shotModal(page, 'backup-auto-log');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, 'backup-auto-log', err); }

  // Feature 9b: Auto Query Log
  try {
    const jobAutoNode = dbRow.getByTestId('tree-node-Job automation');
    const queryPlanNode = jobAutoNode.getByTestId('tree-node-Query Plan');
    await queryPlanNode.waitFor({ state: 'visible', timeout: 10000 });
    await queryPlanNode.locator('> summary').click({ button: 'right' });
    await page.waitForTimeout(500);
    await clickMenuItemByIcon(lastContextMenu(page), 'history');
    await page.waitForTimeout(1200);
    await shotModal(page, 'automation-auto-query-log');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, 'automation-auto-query-log', err); }

  // Feature 8a: Set Automation Volume
  try {
    const spaceNode = dbRow.getByTestId('tree-node-Space');
    await spaceNode.waitFor({ state: 'visible', timeout: 10000 });
    await spaceNode.locator('> summary').click({ button: 'right' });
    await page.waitForTimeout(500);
    await clickMenuItemByIcon(lastContextMenu(page), 'settings_suggest');
    await page.waitForTimeout(1200);
    await shotModal(page, 'automation-set-volume');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, 'automation-set-volume', err); }

  // Feature 8b: Auto Volume Log
  try {
    const spaceNode = dbRow.getByTestId('tree-node-Space');
    await spaceNode.locator('> summary').click({ button: 'right' });
    await page.waitForTimeout(500);
    await clickMenuItemByIcon(lastContextMenu(page), 'history_edu');
    await page.waitForTimeout(1200);
    await shotModal(page, 'automation-auto-volume-log');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, 'automation-auto-volume-log', err); }

  // Feature 10: per-broker Properties
  try {
    await page.mouse.click(2, 2).catch(() => {});
    await sweepStrayModals(page);
    const brokerTab = page.getByTestId('tree-tab-broker');
    await brokerTab.click({ timeout: 5000 });
    await page.waitForTimeout(700);

    const brokerRow = page.locator('#broker-tree-container [data-testid^="tree-node-"]').first();
    await brokerRow.waitFor({ state: 'visible', timeout: 10000 });
    await brokerRow.locator('> summary').click({ button: 'right' });
    await page.waitForTimeout(500);
    await clickMenuItemByIcon(lastContextMenu(page), 'tune');
    await page.waitForTimeout(1200);
    await shotModal(page, 'broker-properties');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, 'broker-properties', err); }

  // Feature 11: ALL BROKERS Show Status
  try {
    const brokerTab = page.getByTestId('tree-tab-broker');
    await brokerTab.click({ button: 'right', timeout: 5000 });
    await page.waitForTimeout(500);
    await clickMenuItemByIcon(lastContextMenu(page), 'info');
    await page.waitForTimeout(2000);
    await shot(page, 'broker-show-status');
  } catch (err) { await debugShot(page, 'broker-show-status', err); }

  await context.close();
}

// ─────────────────────────── section 4 (capture-gap3-screenshots.js) ───────────────────────────

async function sectionGap3(browser) {
  const failures = [];
  const { context, page } = await newSection(browser);
  await loginLight(page);

  let dbRow = null;
  try {
    await expandAllHostGroups(page);
    const hostRow = page.locator(`[data-testid^="host-item-"][title^="${E2E_HOST_ADDRESS}:"]`).first();
    await hostRow.waitFor({ state: 'visible', timeout: 10000 });
    const connected = await connectToHost(page, hostRow);
    if (!connected) throw new Error(`could not connect to host ${E2E_HOST_ADDRESS} (CMS unreachable)`);
    await page.waitForTimeout(2000);
    await sweepStrayModals(page);

    dbRow = page.getByTestId(`tree-node-${E2E_DB}`);
    await dbRow.waitFor({ state: 'visible', timeout: 10000 });
  } catch (err) { await debugShot(page, 'host-select', err); }
  await closeAnyOpenModal(page).catch(() => {});

  // File menu → Export Host
  try {
    const fileBtn = page.locator('nav button').nth(0);
    await fileBtn.hover({ timeout: 5000 });
    await page.waitForTimeout(500);
    await clickMenuItemByIcon(lastDropdown(page), 'file_upload');
    await page.waitForTimeout(1000);
    await shotModal(page, 'host-export');
    await page.getByTestId('import-export-host-cancel-btn').click({ timeout: 3000 }).catch(() => page.keyboard.press('Escape'));
    await page.waitForTimeout(300);
  } catch (err) { failures.push('host-export'); await debugShot(page, 'host-export', err); }

  // File menu → Import Host
  try {
    const fileBtn = page.locator('nav button').nth(0);
    await fileBtn.hover({ timeout: 5000 });
    await page.waitForTimeout(500);
    await clickMenuItemByIcon(lastDropdown(page), 'file_download');
    await page.waitForTimeout(1000);
    await shotModal(page, 'host-import');
    await page.getByTestId('import-export-host-cancel-btn').click({ timeout: 3000 }).catch(() => page.keyboard.press('Escape'));
    await page.waitForTimeout(300);
  } catch (err) { failures.push('host-import'); await debugShot(page, 'host-import', err); }

  // Login Database modal (empty/default state)
  try {
    if (!dbRow) throw new Error('demodb tree node not found');

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

    await dbRow.locator('> summary').dblclick();
    await page.waitForTimeout(1000);
    const loginModal = page.getByTestId('login-database-modal');
    await loginModal.waitFor({ state: 'visible', timeout: 10000 });
    await shotModal(page, 'database-login');
    await page.getByTestId('login-database-cancel-btn').click({ timeout: 3000 }).catch(() => page.keyboard.press('Escape'));
    await page.waitForTimeout(300);
  } catch (err) { failures.push('database-login'); await debugShot(page, 'database-login', err); }

  await context.close();

  if (failures.length) {
    console.log(`WARNING: ${failures.length} capture(s) failed in sectionGap3: ${failures.join(', ')}`);
  }
}

// ─────────────────────────── section 5 (ad-hoc): host-login-all-result ───────────────────────────

async function sectionLoginAll(browser) {
  const { context, page } = await newSection(browser);
  await loginLight(page);

  try {
    await expandAllHostGroups(page);

    // Uses the ROOT-level "전체 로그인" toolbar button, but arranges for the
    // ONLY currently-unauthorized host to be 192.168.7.32 — which this
    // account has a genuinely wrong saved password for (confirmed directly:
    // its Edit Host modal shows "Incorrect password"), so logging into it
    // always fails with a real, honest error, matching the original dark
    // reference shot's own "실패: 192.168.7.32 (Incorrect password)" example.
    // This deliberately avoids two things: (1) 192.168.3.120, which has a
    // known unpatched CMS crash bug and is shared infra — the root button
    // would otherwise also try any host that's currently unauthenticated,
    // and (2) the HA group — logging a fresh HA peer in pops an unrelated
    // "HA 클러스터 연결됨" side-effect modal at a higher z-index than the actual
    // result card, which visually bleeds into any screenshot of the result
    // card underneath (confirmed repeatedly — even aggressively closing it
    // in a loop couldn't keep up with it reappearing for each peer). Since
    // 7.32 isn't in the HA group and is already known-bad, this sidesteps
    // that whole problem rather than continuing to fight it.
    const host732Row = page.locator('[data-testid^="host-item-"][title^="192.168.7.32:"]').first();
    await host732Row.waitFor({ state: 'visible', timeout: 10000 });
    await host732Row.click({ button: 'right', timeout: 5000 });
    await page.waitForTimeout(400);
    const hostMenu = lastContextMenu(page);
    const disconnectBtn = hostMenu.getByRole('button', { name: '연결 해제' });
    if (await disconnectBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await disconnectBtn.click({ timeout: 3000 });
      await page.waitForTimeout(400);
      const confirmDialog = page.locator('[role="dialog"]').last();
      await confirmDialog.getByRole('button', { name: '연결 해제' }).click({ timeout: 5000 });
      await page.waitForTimeout(1500);
    } else {
      // Already logged out (or menu didn't show disconnect) — close the menu.
      await page.mouse.click(2, 2).catch(() => {});
    }
    await sweepStrayModals(page);

    const loginAllBtn = page.locator('button[title="전체 로그인"]').first();
    await loginAllBtn.waitFor({ state: 'visible', timeout: 10000 });
    await loginAllBtn.click({ timeout: 5000 });

    const statusModal = page.locator('[data-testid="status-modal"]');
    await statusModal.waitFor({ state: 'visible', timeout: 15000 });
    await page.waitForTimeout(500);
    await shotCard(page, 'host-login-all-result', '[data-testid="status-modal"]');
    await page.getByTestId('status-modal-close-btn').click({ timeout: 3000 }).catch(() => page.keyboard.press('Escape'));
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, 'host-login-all-result', err); }

  await context.close();
}

// ─────────────────────────── narrow fix-up sections (targeted re-runs) ───────────────────────────

/** Cluster 1: Space / Volume monitors only (database-space-monitor,
 * database-volume-category-monitor, database-volume-info-monitor) — these 3
 * came out wrong the first time (loading spinner / "0 volumes") because the
 * shot was taken before the async storage-analysis fetch actually finished.
 * Fixed with waitForSpaceInfoLoaded(); this reruns just this cluster. */
async function sectionFixSpaceMonitors(browser) {
  const { context, page } = await newSection(browser);
  await loginLight(page);

  await expandAllHostGroups(page);
  const hostRow = page.locator(`[data-testid^="host-item-"][title^="${E2E_HOST_ADDRESS}:"]`).first();
  await hostRow.waitFor({ state: 'visible', timeout: 10000 });
  const connected = await connectToHost(page, hostRow);
  if (!connected) { console.log(`Could not connect to ${E2E_HOST_ADDRESS}`); await context.close(); return; }
  await page.waitForTimeout(3000);
  await sweepStrayModals(page);

  const dbRow = page.getByTestId(`tree-node-${E2E_DB}`);
  if (!(await dbRow.waitFor({ state: 'visible', timeout: 15000 }).then(() => true).catch(() => false))) {
    console.log(`Database row "${E2E_DB}" not found under ${E2E_HOST_ADDRESS}`);
    await context.close();
    return;
  }

  try {
    // A prior narrow cluster run may have left demodb stopped — the Space
    // monitor needs it running to report live usage, so make sure first.
    const dbTreeForState = new DatabaseTreePage(page);
    try {
      await withTimeout(ensureDbState(page, dbTreeForState, E2E_DB, 'running'), 40000, 'ensureDbState(running)');
    } catch (err) {
      console.log(`WARNING: could not confirm ${E2E_DB} is running before the space monitors: ${err.message.split('\n')[0]}`);
    }

    await dbRow.locator('> summary').dblclick();
    await page.waitForTimeout(1000);
    const loginModal = page.getByTestId('login-database-modal');
    if (await loginModal.waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false)) {
      await loginModal.locator('input').nth(1).fill('dba');
      await page.getByTestId('login-database-submit-btn').click();
      await loginModal.waitFor({ state: 'hidden', timeout: 20000 }).catch(() => {});
    }
    await page.waitForTimeout(1500);
    await sweepStrayModals(page);

    const isOpen = await dbRow.evaluate((el) => el.open).catch(() => false);
    if (!isOpen) await dbRow.locator('> summary').click();
    await page.waitForTimeout(500);
    const spaceNode = dbRow.getByTestId('tree-node-Space');
    await spaceNode.waitFor({ state: 'visible', timeout: 10000 });
    await spaceNode.locator('> summary').dblclick();
    await page.waitForTimeout(1500);
    await waitForSpaceInfoLoaded(page);
    await shot(page, 'database-space-monitor');

    const spaceOpen = await spaceNode.evaluate((el) => el.open).catch(() => false);
    if (!spaceOpen) await spaceNode.locator('> summary').click();
    await page.waitForTimeout(500);
    const categoryNode = spaceNode.getByTestId('tree-node-Permanent_PermanentData');
    await categoryNode.waitFor({ state: 'visible', timeout: 10000 });
    await categoryNode.locator('> summary').dblclick();
    await page.waitForTimeout(1500);
    await waitForSpaceInfoLoaded(page);
    await shot(page, 'database-volume-category-monitor');

    const catOpen = await categoryNode.evaluate((el) => el.open).catch(() => false);
    if (!catOpen) await categoryNode.locator('> summary').click();
    await page.waitForTimeout(500);
    const volumeLeaf = categoryNode.locator('[data-testid^="tree-node-"]').first();
    if (await volumeLeaf.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false)) {
      await volumeLeaf.dblclick();
      await page.waitForTimeout(1500);
      await waitForSpaceInfoLoaded(page);
      await shot(page, 'database-volume-info-monitor');
    } else {
      console.log('database-volume-info-monitor skipped: no volume leaf found under Permanent_PermanentData — trying Permanent_Temp instead');
      const altCategoryNode = spaceNode.getByTestId('tree-node-Permanent_TemporaryData');
      if (await altCategoryNode.waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false)) {
        await altCategoryNode.locator('> summary').dblclick();
        await page.waitForTimeout(1500);
        await waitForSpaceInfoLoaded(page);
        const altOpen = await altCategoryNode.evaluate((el) => el.open).catch(() => false);
        if (!altOpen) await altCategoryNode.locator('> summary').click();
        await page.waitForTimeout(500);
        const altLeaf = altCategoryNode.locator('[data-testid^="tree-node-"]').first();
        if (await altLeaf.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false)) {
          await altLeaf.dblclick();
          await page.waitForTimeout(1500);
          await waitForSpaceInfoLoaded(page);
          await shot(page, 'database-volume-info-monitor');
        } else {
          console.log('database-volume-info-monitor still skipped: no volume leaf under Permanent_Temp either');
        }
      }
    }
  } catch (err) { await debugShot(page, 'space-monitors', err); }

  await context.close();
}

/** Shared connect-to-host-and-DatabaseTreePage setup used by the two
 * remaining narrow clusters below. */
async function connectForDbCluster(page) {
  await expandAllHostGroups(page);
  const hostRow = page.locator(`[data-testid^="host-item-"][title^="${E2E_HOST_ADDRESS}:"]`).first();
  await hostRow.waitFor({ state: 'visible', timeout: 10000 });
  const connected = await connectToHost(page, hostRow);
  if (!connected) return null;
  await page.waitForTimeout(1500);
  await sweepStrayModals(page);
  const dbTree = new DatabaseTreePage(page);
  const dbRow = page.getByTestId(`tree-node-${E2E_DB}`);
  const dbFound = await dbRow.waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false);
  if (!dbFound) return null;
  await dbTree.ensureDatabaseLoggedIn(E2E_DB);
  return dbTree;
}

/** Cluster 3: the "stopped demodb" set (Start confirm / Load / Optimize /
 * Copy / Rename / Restore / Delete) plus Backup Plan / Query Plan / Users
 * (db-user), none of which ever got reached because earlier runs stalled
 * out before this point. */
async function sectionStoppedCluster(browser) {
  const { context, page } = await newSection(browser);
  await loginLight(page);

  const dbTree = await connectForDbCluster(page);
  if (!dbTree) { console.log(`Could not connect to ${E2E_HOST_ADDRESS}/${E2E_DB}`); await context.close(); return; }

  let reachedStopped = false;
  try {
    await withTimeout(ensureDbState(page, dbTree, E2E_DB, 'stopped'), 40000, 'ensureDbState(stopped)');
    reachedStopped = true;
  } catch (err) {
    console.log(`Could not bring ${E2E_DB} to 'stopped' — skipping start-confirm/load/optimize/copy/rename/restore/delete: ${err.message.split('\n')[0]}`);
  }
  if (reachedStopped) {
    await captureConfirmDialog(page, dbTree, E2E_DB, /Start Database|데이터베이스 시작/, 'database-start-confirm');
    await captureManageItem(page, dbTree, E2E_DB, 'Load Database', 'database-load', 'load-database-cancel-btn');
    await captureManageItem(page, dbTree, E2E_DB, 'Optimize Database', 'database-optimize', 'optimize-database-cancel-btn');
    await captureManageItem(page, dbTree, E2E_DB, 'Copy Database', 'database-copy', 'copy-database-cancel-btn');
    await captureManageItem(page, dbTree, E2E_DB, 'Rename Database', 'database-rename', 'rename-database-cancel-btn');
    await captureManageItem(page, dbTree, E2E_DB, 'Restore Database', 'database-restore', 'restore-database-cancel-btn');
    await captureDeleteDatabaseModal(page, dbTree, E2E_DB);
  }

  try {
    await expandSubNodeWithRetry(page, dbTree, E2E_DB, 'Job automation');

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

  try {
    const usersFolder = await expandSubNodeWithRetry(page, dbTree, E2E_DB, 'Users');
    let opened = false;
    let lastErr;
    for (let attempt = 0; attempt < 3 && !opened; attempt++) {
      try {
        await sweepStrayModals(page);
        await usersFolder.locator('> summary').click({ button: 'right' });
        const addUserBtn = page.getByRole('button', { name: /Add User|사용자 추가/ });
        await addUserBtn.waitFor({ state: 'visible', timeout: 5000 });
        await addUserBtn.click({ timeout: 8000 });
        opened = true;
      } catch (err) {
        lastErr = err;
        await page.mouse.click(2, 2).catch(() => {});
        await page.waitForTimeout(500);
      }
    }
    if (!opened) throw lastErr;
    await page.waitForTimeout(800);
    await shotModal(page, 'db-user');
    await page.getByTestId('create-user-cancel-btn').click().catch(() => page.keyboard.press('Escape'));
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, 'db-user', err); }

  await context.close();
}

/** Cluster 4: the "running demodb" info-dump + credential set (Locking
 * Information / Transaction information / Param Dump / Plan Dump / Logout /
 * Forget Saved Credentials) — these failed identically on two different
 * hosts last time (20s timeouts on the 4 info items), which looks like
 * genuine intermittent CMS slowness for these specific calls rather than a
 * host problem, so this just retries cleanly on its own. */
async function sectionInfoDumpCluster(browser) {
  const { context, page } = await newSection(browser);
  await loginLight(page);

  const dbTree = await connectForDbCluster(page);
  if (!dbTree) { console.log(`Could not connect to ${E2E_HOST_ADDRESS}/${E2E_DB}`); await context.close(); return; }

  try {
    await withTimeout(ensureDbState(page, dbTree, E2E_DB, 'running'), 40000, 'ensureDbState(running)');
  } catch (err) {
    console.log(`Could not bring ${E2E_DB} to 'running' — the whole cluster needs it: ${err.message.split('\n')[0]}`);
    await context.close();
    return;
  }

  await waitForSettledRunningState(page, dbTree, E2E_DB);
  await captureInfoItem(page, dbTree, E2E_DB, 'Locking Information', 'database-lock-info', 'lock-information-close-btn');
  await captureInfoItem(page, dbTree, E2E_DB, 'Transaction information', 'database-transaction-info', 'transaction-info-close-btn');
  await captureInfoItem(page, dbTree, E2E_DB, 'Param Dump', 'database-param-dump', 'database-info-cancel-btn');
  await captureInfoItem(page, dbTree, E2E_DB, 'Plan Dump', 'database-plan-dump', 'plan-dump-close-btn');

  await captureConfirmDialog(page, dbTree, E2E_DB, /Logout Database|데이터베이스 로그아웃/, 'database-logout-confirm');
  await captureConfirmDialog(page, dbTree, E2E_DB, /Forget Saved Credentials|저장된 자격증명 삭제/, 'database-forget-credentials-confirm');

  await context.close();
}

/** db-user.png only — a fast targeted retry after the shared "stopped"
 * cluster's own attempt hit a one-off click timeout on the Users folder's
 * context menu (everything else in that cluster succeeded; no need to redo
 * it all just to retry this one shot). */
async function sectionDbUserOnly(browser) {
  const { context, page } = await newSection(browser);
  await loginLight(page);

  const dbTree = await connectForDbCluster(page);
  if (!dbTree) { console.log(`Could not connect to ${E2E_HOST_ADDRESS}/${E2E_DB}`); await context.close(); return; }

  try {
    const usersFolder = await expandSubNodeWithRetry(page, dbTree, E2E_DB, 'Users');
    let opened = false;
    let lastErr;
    for (let attempt = 0; attempt < 4 && !opened; attempt++) {
      try {
        await sweepStrayModals(page);
        await page.mouse.click(2, 2).catch(() => {});
        await usersFolder.locator('> summary').click({ button: 'right' });
        const addUserBtn = page.getByRole('button', { name: /Add User|사용자 추가/ });
        await addUserBtn.waitFor({ state: 'visible', timeout: 5000 });
        await addUserBtn.click({ timeout: 8000 });
        opened = true;
      } catch (err) {
        lastErr = err;
        await page.mouse.click(2, 2).catch(() => {});
        await page.waitForTimeout(800);
      }
    }
    if (!opened) throw lastErr;
    await page.waitForTimeout(800);
    await shotModal(page, 'db-user');
    await page.getByTestId('create-user-cancel-btn').click().catch(() => page.keyboard.press('Escape'));
    await page.waitForTimeout(300);
  } catch (err) { await debugShot(page, 'db-user', err); }

  await context.close();
}

/** backup-database.png only — this one fell through the cracks of every
 * cluster above (it's part of the original "running demodb" sweep but
 * wasn't included in the cluster-4 info-dump retry), and both earlier full
 * attempts (against 192.168.3.120 and 192.168.7.31) failed on it before
 * later succeeding on the neighboring info-dump items, so it needs its own
 * clean retry. */
async function sectionBackupDatabaseOnly(browser) {
  const { context, page } = await newSection(browser);
  await loginLight(page);

  const dbTree = await connectForDbCluster(page);
  if (!dbTree) { console.log(`Could not connect to ${E2E_HOST_ADDRESS}/${E2E_DB}`); await context.close(); return; }

  try {
    await withTimeout(ensureDbState(page, dbTree, E2E_DB, 'running'), 40000, 'ensureDbState(running)');
  } catch (err) {
    console.log(`Could not bring ${E2E_DB} to 'running' for Backup Database: ${err.message.split('\n')[0]}`);
    await context.close();
    return;
  }

  await captureManageItem(page, dbTree, E2E_DB, 'Backup Database', 'backup-database', 'backup-database-cancel-btn');

  await context.close();
}

// ─────────────────────────── main ───────────────────────────

// Optional CLI arg: a comma-separated subset of section names to run (e.g.
// `node capture-all-light.js gap2,gap3` to re-run just those two after fixing
// something, without re-running everything else). Defaults to all 5, in
// their original dependency order.
const ALL_SECTIONS = {
  main: sectionMain, gap: sectionGap, gap2: sectionGap2, gap3: sectionGap3, loginall: sectionLoginAll,
  spacemonitors: sectionFixSpaceMonitors, stopped: sectionStoppedCluster, infodump: sectionInfoDumpCluster,
  dbuser: sectionDbUserOnly, backupdb: sectionBackupDatabaseOnly,
};
const requested = (process.argv[2] || 'main,gap,gap2,gap3,loginall').split(',').map((s) => s.trim().toLowerCase());

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const name of requested) {
      const fn = ALL_SECTIONS[name];
      if (!fn) { console.log(`Unknown section "${name}" — skipping. Valid: ${Object.keys(ALL_SECTIONS).join(', ')}`); continue; }
      console.log(`── running section: ${name} ──`);
      await fn(browser);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
