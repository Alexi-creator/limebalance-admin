import { expect, test } from "@playwright/test"

/**
 * Smoke test for the admin shell. With no backend reachable, the auth check fails and
 * the app drops the user to the public login page — an email/password form (the panel is
 * admin-only, so Telegram/Google sign-in were removed).
 */
test("guest lands on the email login form", async ({ page }) => {
  await page.goto("/auth")

  await expect(page.getByRole("heading", { name: "Admin Sign In" })).toBeVisible()
  await expect(page.getByPlaceholder("you@example.com")).toBeVisible()
  await expect(page.getByPlaceholder("••••••")).toBeVisible()
  await expect(page.getByRole("button", { name: "Sign In", exact: true })).toBeVisible()
})

test("protected route redirects a guest to the login page", async ({ page }) => {
  await page.goto("/")

  // No session → ProtectedRoute bounces to /auth.
  await expect(page).toHaveURL(/\/auth$/)
  await expect(page.getByRole("heading", { name: "Admin Sign In" })).toBeVisible()
})
