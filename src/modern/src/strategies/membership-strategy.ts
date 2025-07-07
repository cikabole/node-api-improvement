export interface MembershipStrategy {
  calculateMembershipExpiry(startDate: Date, billingPeriods: number): Date;
  calculateMembershipPeriodExpiry(startDate: Date): Date;
}
