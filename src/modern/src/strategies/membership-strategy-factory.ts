import { BillingInterval } from "../entities/membership.entity";
import { MembershipMonthlyStrategy } from "./membership-monthly-strategy";
import { MembershipStrategy } from "./membership-strategy";
import { MembershipWeeklyStrategy } from "./membership-weekly-strategy";
import { MembershipYearlyStrategy } from "./membership-yearly-strategy";

export class MembershipStrategyFactory {
  public static makeStrategy(
    billingInterval: BillingInterval
  ): MembershipStrategy {
    switch (billingInterval) {
      case "yearly":
        return new MembershipYearlyStrategy();
      case "monthly":
        return new MembershipMonthlyStrategy();
      case "weekly":
        return new MembershipWeeklyStrategy();
    }
  }
}
