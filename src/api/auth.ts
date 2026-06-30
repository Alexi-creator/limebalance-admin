import { request } from "@api/request"
import type { User } from "@appTypes/user"
import { userSchema } from "@appTypes/user"
import { API_URLS } from "@constants/apiUrls"
import { HttpMethods } from "@constants/httpMethods"
import { commonRequest } from "@utils/commonRequest"

export interface LoginPayload {
  email: string
  password: string
}

export function login(payload: LoginPayload): Promise<void> {
  return commonRequest<void>(API_URLS.auth.login, {
    method: HttpMethods.POST,
    body: JSON.stringify(payload),
  })
}

export function checkAuth(): Promise<User> {
  return request<User>(API_URLS.auth.me, { skipRedirect: true, schema: userSchema })
}

export function getMe(): Promise<User> {
  return request<User>(API_URLS.auth.me, { schema: userSchema })
}

export interface UpdateMePayload {
  name?: string
  /** ISO 4217 currency code */
  currency?: string
  /** IANA timezone, e.g. "Europe/Moscow" */
  timezone?: string
}

export function updateMe(payload: UpdateMePayload): Promise<User> {
  return request<User>(API_URLS.auth.me, {
    method: HttpMethods.PATCH,
    body: JSON.stringify(payload),
    schema: userSchema,
  })
}

export interface CredentialsPayload {
  /** email; sent only on initial linking, when it does not exist yet */
  email?: string
  /** new password */
  password: string
  /** current password; required when changing the password, when the email is already linked */
  currentPassword?: string
}

// set email+password (if there is no email) or change the password (if the email is already linked)
export function setCredentials(payload: CredentialsPayload): Promise<User> {
  return request<User>(API_URLS.auth.credentials, {
    method: HttpMethods.POST,
    body: JSON.stringify(payload),
    schema: userSchema,
  })
}

// confirm email linking for an account created via Telegram: consumes the token from the email
// and the backend writes the pending email+password onto the account. Public endpoint — no auth.
export function confirmEmail(token: string): Promise<void> {
  return commonRequest<void>(API_URLS.auth.confirmEmail, {
    method: HttpMethods.POST,
    body: JSON.stringify({ token }),
  })
}

// Resend the confirmation link to the email awaiting confirmation, reusing the stored
// email+password (no need to resubmit them). Authenticated — goes through `request`.
export function resendEmailConfirmation(): Promise<void> {
  return request(API_URLS.auth.resendEmailConfirmation, { method: HttpMethods.POST })
}

// Request a password-reset link by email. Public endpoint — no auth.
// Always resolves with { success: true } even for an unknown email (anti-enumeration),
// so callers must show a neutral "if an account exists…" message rather than confirming the address.
export function forgotPassword(email: string): Promise<void> {
  return commonRequest<void>(API_URLS.auth.forgotPassword, {
    method: HttpMethods.POST,
    body: JSON.stringify({ email }),
  })
}

// Set a new password using the one-time UUID token from the reset email. Public — no auth.
// 400 means the token is invalid, already used, or expired (15-minute lifetime).
export function resetPassword(payload: { token: string; password: string }): Promise<void> {
  return commonRequest<void>(API_URLS.auth.resetPassword, {
    method: HttpMethods.POST,
    body: JSON.stringify(payload),
  })
}

export async function logout(): Promise<void> {
  await request(API_URLS.auth.logout, { method: HttpMethods.POST })
}
