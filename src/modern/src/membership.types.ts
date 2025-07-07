import { MembershipPeriod } from "./entities/membership-period.entity";
import { GetMembership, Membership } from "./entities/membership.entity";

export type GetMembershipResponseResource = {
  membership: GetMembership;
  periods: MembershipPeriod[];
};
export type PostMembershipResponseResource = {
  membership: Membership;
  membershipPeriods: MembershipPeriod[];
};

export type MembershipResponseResource =
  | GetMembershipResponseResource
  | PostMembershipResponseResource;
