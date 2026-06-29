import { expect, test } from "@playwright/test"

/**
 * Smoke test for the admin shell. With no backend reachable, the auth check fails and
 * the app drops the user to the public login page — which is exactly what we assert.
 */
test("guest lands on the login page", async ({ page }) => {
  await page.goto("/auth")

  await expect(page.getByRole("heading", { name: "Admin Sign In" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Sign in with email" })).toBeVisible()
})

test("email form opens", async ({ page }) => {
  await page.goto("/auth")

  await page.getByRole("button", { name: "Sign in with email" }).click()

  await expect(page.getByPlaceholder("you@example.com")).toBeVisible()
  await expect(page.getByPlaceholder("••••••")).toBeVisible()
  await expect(page.getByRole("button", { name: "Sign In", exact: true })).toBeVisible()
})
