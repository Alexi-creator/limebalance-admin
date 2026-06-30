import { getEnv } from "@constants/env"

const API_URL = getEnv("VITE_API_URL") || "http://localhost:3000/api"

export const API_URLS = {
  auth: {
    login: `${API_URL}/auth/login`,
    refresh: `${API_URL}/auth/refresh`,
    logout: `${API_URL}/auth/logout`,
    me: `${API_URL}/auth/me`,
    credentials: `${API_URL}/auth/me/credentials`,
    confirmEmail: `${API_URL}/auth/confirm-email`,
    resendEmailConfirmation: `${API_URL}/auth/resend-email-confirmation`,
    forgotPassword: `${API_URL}/auth/forgot-password`,
    resetPassword: `${API_URL}/auth/reset-password`,
  },
  users: {
    users: `${API_URL}/users`,
    user: `${API_URL}/users/:id`,
  },
}
