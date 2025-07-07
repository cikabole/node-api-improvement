import z from "zod/v4";

const state = ["planned", "issued"] as const;

export const createMembershipPeriodSchema = z.object({
  membershipId: z.number(),
  start: z.coerce.date(),
  end: z.coerce.date(),
  state: z.enum(state),
});

export const membershipPeriodSchema = z.object({
  id: z.number(),
  uuid: z.uuid(),
  ...createMembershipPeriodSchema.shape,
});

export type CreateMembershipPeriod = z.infer<
  typeof createMembershipPeriodSchema
>;
export type MembershipPeriod = z.infer<typeof membershipPeriodSchema>;
