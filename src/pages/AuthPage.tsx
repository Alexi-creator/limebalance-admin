import { ApiError } from "@api/apiError"
import { getMe, login, logout } from "@api/auth"
import { HttpStatus } from "@constants/httpStatus"
import { RouteNames } from "@constants/routeNames"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Paper, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core"
import { useAuthStore } from "@store/authStore"
import { syncTimezone } from "@utils/syncTimezone"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

const authSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(8, "Minimum 8 characters"),
})

type AuthFormValues = z.infer<typeof authSchema>

export function AuthPage() {
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

      // The login endpoint is shared with the regular app and issues a cookie to any valid user.
      // Admin gating happens here: a non-admin who knows their password still cannot get in —
      // we drop the freshly issued session and refuse, so only ADMIN accounts reach the panel.
      if (user.role !== "ADMIN") {
        await logout()
        setError("root", { message: "This account is not allowed here" })
        return
      }

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
    <Stack align="center" justify="center" mih="calc(100vh - 60px)" px="md">
      <Paper withBorder shadow="sm" p="xl" w="100%" maw={400} radius="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Title order={2} ta="center">
              Admin Sign In
            </Title>

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
          </Stack>
        </form>
      </Paper>
    </Stack>
  )
}
