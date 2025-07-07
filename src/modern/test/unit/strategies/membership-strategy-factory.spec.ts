import { MembershipYearlyStrategy } from "../../../src/strategies/membership-yearly-strategy";
import { MembershipMonthlyStrategy } from "../../../src/strategies/membership-monthly-strategy";
import { MembershipStrategyFactory } from "../../../src/strategies/membership-strategy-factory";
import { MembershipWeeklyStrategy } from "../../../src/strategies/membership-weekly-strategy";
import { BillingInterval } from "src/modern/src/entities/membership.entity";

describe("MembershipStrategyFactory", () => {
  const strategies = [
    { billingInterval: "yearly", strategy: MembershipYearlyStrategy },
    { billingInterval: "monthly", strategy: MembershipMonthlyStrategy },
    { billingInterval: "weekly", strategy: MembershipWeeklyStrategy },
  ];

  it.each(strategies)(
    "creates strategy for billingInterval",
    ({ billingInterval, strategy }) => {
      expect(
        MembershipStrategyFactory.makeStrategy(
          billingInterval as BillingInterval
        )
      ).toBeInstanceOf(strategy);
    }
  );
});
