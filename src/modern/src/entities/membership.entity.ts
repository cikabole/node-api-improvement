import z from "zod/v4";

const state = ["active", "expired", "pending"] as const;
const paymentMethod = ["cash", "credit card"] as const;
const billingInterval = ["weekly", "monthly", "yearly"] as const;
const requiredFieldMessage = "missingMandatoryFields";

export const createMembershipSchema = z
  .object({
    name: z.string(requiredFieldMessage),
    userId: z.number().optional().default(2000),
    recurringPrice: z
      .number(requiredFieldMessage)
      .min(0, "negativeRecurringPrice"),
    validFrom: z.coerce.date("invalidDate").optional().default(new Date()),
    validUntil: z.coerce
      .date("invalidDate")
      .optional()
      .nullable()
      .default(null),
    state: z.enum(state).optional(),
    assignedBy: z.string().optional(),
    paymentMethod: z.enum(paymentMethod).nullable().optional(),
    billingInterval: z.enum(billingInterval, "invalidBillingInterval"),
    billingPeriods: z.number().optional().default(0),
  })
  .refine(
    (data) => !(data.recurringPrice > 100 && data.paymentMethod === "cash"),
    { abort: true, message: "cashPriceBelow100" }
  )
  .refine(
    (data) => !(data.billingInterval === "monthly" && data.billingPeriods > 12),
    { abort: true, message: "billingPeriodsMoreThan12Months" }
  )
  .refine(
    (data) => !(data.billingInterval === "yearly" && data.billingPeriods > 10),
    { abort: true, message: "billingPeriodsMoreThan10Years" }
  )
  .refine(
    (data) => !(data.billingInterval === "yearly" && data.billingPeriods > 3),
    { abort: true, message: "billingPeriodsLessThan3Years" }
  );

export const membershipSchema = z.object({
  id: z.number(),
  uuid: z.uuid(),
  ...createMembershipSchema.shape,
});

export const getMembershipSchema = z.object({
  ...membershipSchema.shape,
});

const BillingInterval = z.enum(billingInterval);
export type BillingInterval = z.infer<typeof BillingInterval>;
export type CreateMembershipDto = z.infer<typeof createMembershipSchema>;
export type Membership = z.infer<typeof membershipSchema>;
export type GetMembership = z.infer<typeof getMembershipSchema>;
