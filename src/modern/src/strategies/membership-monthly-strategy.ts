import { MembershipStrategy } from "./membership-strategy";

export class MembershipMonthlyStrategy implements MembershipStrategy {
  public calculateMembershipExpiry(date: Date, billingPeriods: number): Date {
    date.setMonth(date.getMonth() + billingPeriods);
    return date;
  }

  public calculateMembershipPeriodExpiry(date: Date): Date {
    date.setMonth(date.getMonth() + 1);
    return date;
  }
}
