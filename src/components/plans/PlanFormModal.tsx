import type { CreatePlanPayload, UpdatePlanPayload } from "@api/adminPlans"
import { createPlan, updatePlan } from "@api/adminPlans"
import { ApiError } from "@api/apiError"
import type { Plan } from "@appTypes/plan"
import { HttpStatus } from "@constants/httpStatus"
import { planKeys } from "@constants/queries/plans"
import { Button, Group, NumberInput, Stack, Switch, Text, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { useModalStore } from "@store/modalStore"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const SLUG_RE = /^[a-z0-9-]{1,30}$/

interface FormValues {
  name: string
  // NumberInput yields number | "" while empty, so limits/price are widened accordingly.
  price: number | string
  maxCategoriesUnlimited: boolean
  maxCategories: number | string
  maxTxUnlimited: boolean
  maxTransactionsPerMonth: number | string
  investingAccess: boolean
}

function isValidLimit(unlimited: boolean, value: number | string): boolean {
  if (unlimited) return true
  const n = Number(value)
  return Number.isInteger(n) && n >= 0
}

/** A limit is null when its "Unlimited" checkbox is on, otherwise the entered number. */
function limitFrom(unlimited: boolean, value: number | string): number | null {
  return unlimited ? null : Number(value)
}

function buildCreateBody(values: FormValues): CreatePlanPayload {
  return {
    name: values.name.trim(),
    price: Number(values.price),
    maxCategories: limitFrom(values.maxCategoriesUnlimited, values.maxCategories),
    maxTransactionsPerMonth: limitFrom(values.maxTxUnlimited, values.maxTransactionsPerMonth),
    investingAccess: values.investingAccess,
  }
}

/** PATCH body with only the fields that actually changed. Name isn't editable on update. */
function buildUpdateBody(values: FormValues, plan: Plan): UpdatePlanPayload {
  const body: UpdatePlanPayload = {}

  const price = Number(values.price)
  if (price !== plan.price) body.price = price

  const maxCategories = limitFrom(values.maxCategoriesUnlimited, values.maxCategories)
  if (maxCategories !== plan.maxCategories) body.maxCategories = maxCategories

  const maxTransactionsPerMonth = limitFrom(values.maxTxUnlimited, values.maxTransactionsPerMonth)
  if (maxTransactionsPerMonth !== plan.maxTransactionsPerMonth) {
    body.maxTransactionsPerMonth = maxTransactionsPerMonth
  }

  if (values.investingAccess !== plan.investingAccess) {
    body.investingAccess = values.investingAccess
  }

  return body
}

/** Create a new tariff or edit an existing one. Toggling "Unlimited" sends the limit as null. */
export function PlanFormModal({ plan }: { plan?: Plan }) {
  const close = useModalStore((s) => s.close)
  const queryClient = useQueryClient()
  const isEdit = plan !== undefined

  const form = useForm<FormValues>({
    initialValues: {
      name: plan?.name ?? "",
      price: plan?.price ?? 0,
      maxCategoriesUnlimited: plan ? plan.maxCategories === null : false,
      maxCategories: plan?.maxCategories ?? 0,
      maxTxUnlimited: plan ? plan.maxTransactionsPerMonth === null : false,
      maxTransactionsPerMonth: plan?.maxTransactionsPerMonth ?? 0,
      investingAccess: plan?.investingAccess ?? false,
    },
    validate: {
      name: (v) =>
        SLUG_RE.test(v) ? null : "Lowercase letters, digits and dashes only (1–30 chars)",
      price: (v) => (Number(v) >= 0 ? null : "Price must be 0 or more"),
      maxCategories: (v, values) =>
        isValidLimit(values.maxCategoriesUnlimited, v) ? null : "Must be a whole number ≥ 0",
      maxTransactionsPerMonth: (v, values) =>
        isValidLimit(values.maxTxUnlimited, v) ? null : "Must be a whole number ≥ 0",
    },
  })

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      isEdit
        ? updatePlan(plan.id, buildUpdateBody(values, plan))
        : createPlan(buildCreateBody(values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.all })
      notifications.show({ color: "green", message: isEdit ? "Plan updated" : "Plan created" })
      close()
    },
    onError: (err) => {
      // 400/409 are name problems (bad slug / already taken) — show them on the field, not a toast
      if (
        err instanceof ApiError &&
        (err.status === HttpStatus.CONFLICT || err.status === HttpStatus.BAD_REQUEST)
      ) {
        form.setFieldError("name", err.message)
        return
      }
      // the plan vanished under us — drop the modal and refresh the list
      if (err instanceof ApiError && err.status === HttpStatus.NOT_FOUND) {
        queryClient.invalidateQueries({ queryKey: planKeys.all })
        notifications.show({ color: "red", message: "Plan not found" })
        close()
        return
      }
      notifications.show({
        color: "red",
        message: err instanceof ApiError ? err.message : "Failed to save plan",
      })
    },
  })

  const handleSubmit = (values: FormValues) => {
    // On edit with no actual changes, skip the request and just close.
    if (isEdit && Object.keys(buildUpdateBody(values, plan)).length === 0) {
      close()
      return
    }
    mutation.mutate(values)
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <Stack gap={4}>
          <TextInput
            label="Name (slug)"
            placeholder="pro"
            withAsterisk={!isEdit}
            disabled={isEdit}
            {...form.getInputProps("name")}
          />
          <Text size="xs" c="dimmed">
            {isEdit
              ? "The name can't be changed after creation"
              : "Lowercase letters, digits and dashes"}
          </Text>
        </Stack>

        <NumberInput
          label="Price"
          prefix="$"
          min={0}
          decimalScale={2}
          fixedDecimalScale
          step={0.01}
          withAsterisk
          {...form.getInputProps("price")}
        />

        <Stack gap={6}>
          <NumberInput
            label="Max categories"
            min={0}
            allowDecimal={false}
            disabled={form.values.maxCategoriesUnlimited}
            placeholder={form.values.maxCategoriesUnlimited ? "Unlimited" : undefined}
            {...form.getInputProps("maxCategories")}
          />
          <Switch
            label="Unlimited categories"
            {...form.getInputProps("maxCategoriesUnlimited", { type: "checkbox" })}
          />
        </Stack>

        <Stack gap={6}>
          <NumberInput
            label="Max transactions / month"
            min={0}
            allowDecimal={false}
            disabled={form.values.maxTxUnlimited}
            placeholder={form.values.maxTxUnlimited ? "Unlimited" : undefined}
            {...form.getInputProps("maxTransactionsPerMonth")}
          />
          <Switch
            label="Unlimited transactions"
            {...form.getInputProps("maxTxUnlimited", { type: "checkbox" })}
          />
        </Stack>

        <Switch
          label="Investing access"
          {...form.getInputProps("investingAccess", { type: "checkbox" })}
        />

        <Group justify="flex-end">
          <Button variant="default" onClick={close} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" loading={mutation.isPending}>
            {isEdit ? "Save" : "Create"}
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
