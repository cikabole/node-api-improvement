import { MembershipStrategy } from "./membership-strategy";

export class MembershipYearlyStrategy implements MembershipStrategy {
  public calculateMembershipExpiry(date: Date, billingPeriods: number): Date {
    date.setMonth(date.getMonth() + billingPeriods * 12);
    return date;
  }

  public calculateMembershipPeriodExpiry(date: Date): Date {
    date.setMonth(date.getMonth() + 12);
    return date;
  }
}
