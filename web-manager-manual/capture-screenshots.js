// Standalone Playwright script (not part of the Playwright Test runner) to
// capture real screenshots for the web-manager-manual images/ directory.
// Run against a live `npm run dev:stack` in cubrid-webmanager, using the
// same env vars as local-e2e/.env there.
//
// Usage: node capture-screenshots.js
// Reads env from cubrid-webmanager/local-e2e/.env (not committed — has real
// credentials for a real CUBRID host).

const path = require('path');
const fs = require('fs');
const { chromium } = require(path.join(__dirname, '../../cubrid-webmanager/node_modules/playwright'));
const E2E_DIR = path.join(__dirname, '../../cubrid-webmanager/local-e2e');
const { DatabaseTreePage } = require(path.join(E2E_DIR, 'pages/DatabaseTreePage'));
const { BrokerTreePage } = require(path.join(E2E_DIR, 'pages/BrokerTreePage'));
const { dismissJobResultModal } = require(path.join(E2E_DIR, 'pages/dismissJobResultModal'));

const envPath = path.join(__dirname, '../../cubrid-webmanager/local-e2e/.env');
if (fs.existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

const BASE_URL = process.env.BASE_URL || 'https://localhost:443';
const E2E_USERNAME = process.env.E2E_USERNAME;
const E2E_PASSWORD = process.env.E2E_PASSWORD;
const E2E_HOST_ADDRESS = process.env.E2E_HOST_ADDRESS;
const E2E_HOST_PORT = process.env.E2E_HOST_PORT;
const E2E_DB = process.env.E2E_DB || 'demodb';

const IMAGES_DIR = path.join(__dirname, 'images');
const DEBUG_DIR = path.join(__dirname, 'debug');
fs.mkdirSync(DEBUG_DIR, { recursive: true });

async function shot(page, name) {
  await page.screenshot({ path: path.join(IMAGES_DIR, `${name}.png`) });
  console.log(`captured ${name}.png`);
}

async function debugShot(page, name, err) {
  try {
    await page.screenshot({ path: path.join(DEBUG_DIR, `${name}-fail.png`) });
  } catch {}
  console.log(`${name} screen skipped: ${err.message.split('\n')[0]} (debug/${name}-fail.png saved)`);
}

/** Right-clicks a database's tree row via the DatabaseTreePage helper, retrying
 * a few times since this app's context menus can get knocked closed by a
 * background monitoring re-render mid-attempt (documented in DatabaseTreePage.js). */
async function openDbContextMenuWithRetry(page, dbTree, dbname, attempts = 4) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      await dismissJobResultModal(page);
      await page.mouse.click(2, 2).catch(() => {});
      await dbTree.openContextMenu(dbname);
      return;
    } catch (err) {
      lastErr = err;
      await page.waitForTimeout(500);
    }
  }
  throw lastErr;
}

async function expandSubNodeWithRetry(page, dbTree, dbname, subId, attempts = 4) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
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

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // --- Login screen ---
  await page.goto(`${BASE_URL}/login`);
  await page.waitForTimeout(500);
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
    // UI defaults to Korean in this app (see cmLabels.ko.js) — match Korean labels.
    await page.getByText('호스트 서비스 관리').hover({ timeout: 10000 });
    await page.getByRole('button', { name: '서비스 대시보드' }).click({ timeout: 5000 });
    await page.waitForTimeout(1000);
    await shot(page, 'service-dashboard');
    // Close that tab if one opened, to get back to a clean state.
    const closeBtn = page.locator('[data-testid^="tab-"] [aria-label="Close"]').first();
    await closeBtn.click({ timeout: 2000 }).catch(() => {});
  } catch (err) { await debugShot(page, 'service-dashboard', err); }

  // --- Host tree: find the registered test host row (see HostTreePage.js) ---
  const hostRow = page.locator(`[title="${E2E_HOST_ADDRESS}:${E2E_HOST_PORT}"]`).first();
  if (await hostRow.isVisible({ timeout: 10000 }).catch(() => false)) {
    await shot(page, 'host-tree');

    // Add Host modal (see host_add.spec.js)
    try {
      await page.getByTestId('add-host-toolbar-btn').click({ timeout: 5000 });
      await page.waitForTimeout(300);
      await shot(page, 'host-add');
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
      await dbRow.dblclick();
      await page.waitForTimeout(1500);
      // May hit a Login Database modal first
      const loginDbBtn = page.getByTestId('login-database-submit-btn');
      if (await loginDbBtn.isVisible().catch(() => false)) {
        await loginDbBtn.click();
        await page.waitForTimeout(1000);
        await dbRow.dblclick();
        await page.waitForTimeout(1500);
      }
      await shot(page, 'database-dashboard');

      // Create Database wizard — open first step only, never submit (would
      // create a real database on the live host).
      try {
        await dismissJobResultModal(page);
        await page.mouse.click(2, 2).catch(() => {});
        await page.getByTestId('tree-tab-db').click({ button: 'right' });
        const createBtn = page.getByRole('button', { name: '데이터베이스 생성' });
        await createBtn.waitFor({ state: 'visible', timeout: 5000 });
        await createBtn.click();
        await page.waitForTimeout(800);
        await shot(page, 'database-create');
        await page.keyboard.press('Escape');
        await page.locator('[data-testid$="-discard-btn"], [data-testid$="-cancel-btn"]').first().click({ timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(300);
      } catch (err) { await debugShot(page, 'database-create', err); }

      // Backup Database (Manage Database submenu)
      try {
        await openDbContextMenuWithRetry(page, dbTree, E2E_DB);
        await page.getByRole('button', { name: '데이터베이스 관리' }).hover({ timeout: 5000 });
        const item = page.getByRole('button', { name: /데이터베이스 백업/ });
        await item.waitFor({ state: 'visible', timeout: 5000 });
        await item.click();
        await page.waitForTimeout(800);
        await shot(page, 'backup-database');
        await page.getByTestId('backup-database-cancel-btn').click().catch(() => page.keyboard.press('Escape'));
        await page.waitForTimeout(300);
      } catch (err) { await debugShot(page, 'backup-database', err); }

      // Backup Plan / Query Plan / Users all live one level deeper, inside
      // the "Job automation" (작업 자동화) folder — must expand that first.
      await expandSubNodeWithRetry(page, dbTree, E2E_DB, 'Job automation');

      // Backup Plan
      try {
        const planFolder = await expandSubNodeWithRetry(page, dbTree, E2E_DB, 'Backup Plan');
        await planFolder.locator('> summary').click({ button: 'right' });
        const createBtn = page.getByRole('button', { name: /백업 자동화 계획 추가/ });
        await createBtn.waitFor({ state: 'visible', timeout: 5000 });
        await createBtn.click();
        await page.waitForTimeout(800);
        await shot(page, 'backup-plan');
        await page.getByTestId('add-backup-plan-discard-btn').click().catch(() => page.keyboard.press('Escape'));
        await page.waitForTimeout(300);
      } catch (err) { await debugShot(page, 'backup-plan', err); }

      // Query Plan (Job automation)
      try {
        const queryFolder = await expandSubNodeWithRetry(page, dbTree, E2E_DB, 'Query Plan');
        await queryFolder.locator('> summary').click({ button: 'right' });
        const addBtn = page.getByRole('button', { name: /질의 자동화 계획 추가/ });
        await addBtn.waitFor({ state: 'visible', timeout: 5000 });
        await addBtn.click();
        await page.waitForTimeout(800);
        await shot(page, 'query-plan');
        await page.getByTestId('add-query-plan-cancel-btn').click().catch(() => page.keyboard.press('Escape'));
        await page.waitForTimeout(300);
      } catch (err) { await debugShot(page, 'query-plan', err); }

      // Users folder
      try {
        const usersFolder = await expandSubNodeWithRetry(page, dbTree, E2E_DB, 'Users');
        await usersFolder.locator('> summary').click({ button: 'right' });
        const addUserBtn = page.getByRole('button', { name: /사용자 추가/ });
        await addUserBtn.waitFor({ state: 'visible', timeout: 5000 });
        await addUserBtn.click();
        await page.waitForTimeout(800);
        await shot(page, 'db-user');
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
  } else {
    console.log(`Host row for ${E2E_HOST_ADDRESS}:${E2E_HOST_PORT} not found — skipping host/db/broker screens.`);
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
