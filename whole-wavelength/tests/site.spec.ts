import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const lessons = ['softwarearchitektur', 'system-und-codeebene', 'spring-petclinic', 'monolith', 'modular-monolith', 'microservices', 'scs-isa', 'visit-use-case', 'layered-architecture', 'clean-architecture', 'hexagonal-architecture', 'onion-architecture', 'vergleich'];
test('all public pages load without script errors, overflow or automated accessibility violations', async ({ page }, info) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const route of ['', ...lessons.map(slug => `lernen/${slug}/`), 'explorer/', 'code/', 'quellen/']) {
    const response = await page.goto(route || './');
    expect(response?.status(), route).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), route).toBeTruthy();
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(result.violations.map(item => ({ id: item.id, impact: item.impact, nodes: item.nodes.map(n => n.target) })), route).toEqual([]);
    if (['', 'lernen/clean-architecture/', 'explorer/'].includes(route))
      await page.screenshot({ path: info.outputPath(`${route.replaceAll('/', '-') || 'home'}.png`), fullPage: true });
  }
  expect(errors).toEqual([]);
});
test('search, reading progress, quiz and mobile navigation work', async ({ page }, info) => {
  await page.goto('./');
  await page.locator('[data-open-search]').click();
  await page.locator('#site-search').fill('Dependency Inversion');
  await expect(page.locator('.search-results li:visible')).toHaveCount(3);
  await page.keyboard.press('Escape');
  await expect(page.locator('#search-dialog')).not.toBeVisible();
  if (info.project.name.includes('mobile')) {
    await page.locator('.menu-toggle').click();
    await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded', 'true');
    await page.locator('.sidebar').getByRole('link', { name: 'Clean Architecture', exact: true }).click();
  } else await page.goto('lernen/clean-architecture/');
  const solution = page.locator('.prose details').first();
  await expect(solution).not.toHaveAttribute('open', '');
  await solution.locator('summary').click();
  await expect(solution).toHaveAttribute('open', '');
  await expect(solution.locator('p')).toBeVisible();
  await expect(page.locator('a[href$="code/#java-core-test"]')).toHaveCount(1);
  await page.locator('[data-mark-read]').click();
  await expect(page.locator('[data-mark-read]')).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.locator('[data-mark-read]')).toHaveAttribute('aria-pressed', 'true');
  const correct = await page.locator('[data-quiz]').getAttribute('data-correct');
  await page.locator(`[data-quiz-answer="${correct}"]`).click();
  await expect(page.locator('[data-quiz-feedback]')).toContainText('Richtig');
});
test('all architecture modes run and reject invalid visits; tabs support keyboard', async ({ page }) => {
  await page.goto('explorer/');
  for (const architecture of ['layered', 'clean', 'hexagonal', 'onion']) {
    await page.locator(`[data-architecture="${architecture}"]`).click();
    await page.locator('[data-view="code"]').click();
    await expect(page.locator('#edge-legend')).toContainText('Code-Abhängigkeit');
    await page.locator('[data-view="runtime"]').click();
    await page.locator('#run-visit').click();
    await expect(page.locator('#simulation-status')).toContainText('Visit für Milo');
    await expect(page.locator('#trace-log li')).not.toHaveCount(0);
    await page.locator('[name="date"]').fill('2020-01-01');
    await page.locator('#run-visit').click();
    await expect(page.locator('#simulation-status')).toContainText('nicht erfasst');
    await page.locator('[name="date"]').fill('2099-12-01');
  }
  await page.locator('[data-architecture="layered"]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-architecture="clean"]')).toBeFocused();
  await expect(page.locator('[data-architecture="clean"]')).toHaveAttribute('aria-selected', 'true');
  await page.locator('[data-node="service"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#component-title')).toContainText('BookVisitInteractor');
});
