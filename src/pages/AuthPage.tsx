import { ApiError } from "@api/apiError"
import { getMe, login, loginGoogle, loginTelegram } from "@api/auth"
import { getEnv } from "@constants/env"
import { HttpStatus } from "@constants/httpStatus"
import { RouteNames } from "@constants/routeNames"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Alert,
  Anchor,
  Box,
  Button,
  Divider,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core"
import { GoogleLogin } from "@react-oauth/google"
import { useAuthStore } from "@store/authStore"
import { IconBrandTelegram, IconMail } from "@tabler/icons-react"
import type { TelegramAuthData } from "@telegram-auth/react"
import { LoginButton } from "@telegram-auth/react"
import { syncTimezone } from "@utils/syncTimezone"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

const BOT_USERNAME = getEnv("VITE_TELEGRAM_BOT_USERNAME")

type AuthMethod = "select" | "email"

const authSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(8, "Minimum 8 characters"),
})

type AuthFormValues = z.infer<typeof authSchema>

function EmailForm({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
  })

  const [isPending, setIsPending] = useState(false)

  const onSubmit = async (data: AuthFormValues) => {
    setIsPending(true)
    try {
      await login(data)
      const user = await getMe()
      setUser(user)
      syncTimezone(user)
      navigate(RouteNames.Home)
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === HttpStatus.UNAUTHORIZED
          ? "Invalid email or password"
          : (err as Error).message
      setError("root", { message })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <TextInput
          label="Email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <PasswordInput
          label="Password"
          placeholder="••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        {errors.root && (
          <Text c="red" size="sm">
            {errors.root.message}
          </Text>
        )}

        <Button type="submit" loading={isPending}>
          Sign In
        </Button>

        <Anchor component="button" type="button" size="sm" ta="center" onClick={onBack}>
          Back
        </Anchor>
      </Stack>
    </form>
  )
}

export function AuthPage() {
  const [method, setMethod] = useState<AuthMethod>("select")
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)

  const handleTelegramAuth = async (data: TelegramAuthData) => {
    try {
      await loginTelegram(data)
      const user = await getMe()
      setUser(user)
      syncTimezone(user)
      navigate(RouteNames.Home)
    } catch {
      // stay on page
    }
  }

  const handleGoogleAuth = async (credential: string) => {
    try {
      await loginGoogle(credential)
      const user = await getMe()
      setUser(user)
      syncTimezone(user)
      navigate(RouteNames.Home)
    } catch {
      // stay on page
    }
  }

  return (
    <Stack align="center" justify="center" mih="calc(100vh - 60px)" px="md">
      <Paper withBorder shadow="sm" p="xl" w="100%" maw={400} radius="md">
        <Stack>
          <Title order={2} ta="center">
            Admin Sign In
          </Title>

          {method === "select" && (
            <Stack>
              <Alert variant="light" color="blue" icon={<IconBrandTelegram size={16} />}>
                <Stack gap="sm">
                  <Text size="sm">
                    If you've used our Telegram bot — sign in via Telegram to keep your full
                    history.
                  </Text>
                  <Box style={{ display: "flex", justifyContent: "center" }}>
                    <LoginButton
                      botUsername={BOT_USERNAME}
                      onAuthCallback={handleTelegramAuth}
                      buttonSize="large"
                      cornerRadius={8}
                      showAvatar
                    />
                  </Box>
                  <Text size="xs" c="dimmed" ta="center">
                    Wrong Telegram account? Open this page in a private/incognito window.
                  </Text>
                </Stack>
              </Alert>

              <Box style={{ display: "flex", justifyContent: "center" }}>
                <GoogleLogin
                  onSuccess={({ credential }) => credential && handleGoogleAuth(credential)}
                  onError={() => {}}
                  width={320}
                />
              </Box>

              <Divider label="or" labelPosition="center" />

              <Button
                variant="light"
                fullWidth
                leftSection={<IconMail size={18} />}
                onClick={() => setMethod("email")}
              >
                Sign in with email
              </Button>
            </Stack>
          )}

          {method === "email" && <EmailForm onBack={() => setMethod("select")} />}

          <Text size="xs" c="dimmed" ta="center">
            By signing in, you agree to our terms of service
          </Text>
        </Stack>
      </Paper>
    </Stack>
  )
}
