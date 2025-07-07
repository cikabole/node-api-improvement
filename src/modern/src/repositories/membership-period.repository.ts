import { Injectable } from "@nestjs/common";
import membershipPeriods from "../../../data/membership-periods.json";
import {
  CreateMembershipPeriod,
  MembershipPeriod,
  membershipPeriodSchema,
} from "../entities/membership-period.entity";
import { v4 as generateUuidV4 } from "uuid";

export interface IMembershipPeriodRepository {
  getByMembershipId(id: number): MembershipPeriod[];
  store(membershipPeriod: CreateMembershipPeriod): MembershipPeriod;
}

@Injectable()
export class MembershipPeriodRepository implements IMembershipPeriodRepository {
  private parsedPeriods: MembershipPeriod[];
  constructor() {
    this.parsedPeriods = membershipPeriods.map((item) =>
      membershipPeriodSchema.parse(item)
    );
  }

  getByMembershipId(id: number): MembershipPeriod[] {
    return this.parsedPeriods.filter(
      (p: MembershipPeriod) => p.membershipId === id
    ) as MembershipPeriod[];
  }

  store(membershipPeriod: CreateMembershipPeriod): MembershipPeriod {
    const period = {
      id: this.parsedPeriods.length + 1,
      uuid: generateUuidV4(),
      ...membershipPeriod,
    };

    this.parsedPeriods.push(period);

    return period;
  }
}
