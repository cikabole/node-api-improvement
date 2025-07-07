import { MembershipStrategy } from "./membership-strategy";

export class MembershipWeeklyStrategy implements MembershipStrategy {
  public calculateMembershipExpiry(date: Date, billingPeriods: number): Date {
    date.setDate(date.getDate() + billingPeriods * 7);
    return date;
  }

  public calculateMembershipPeriodExpiry(date: Date): Date {
    date.setDate(date.getDate() + 7);
    return date;
  }
}
