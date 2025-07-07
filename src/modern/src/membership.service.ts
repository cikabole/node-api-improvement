import { Injectable } from "@nestjs/common";
import { MembershipRepository } from "./repositories/membership.repository";
import { CreateMembershipDto, Membership } from "./entities/membership.entity";
import { MembershipPeriodRepository } from "./repositories/membership-period.repository";
import { MembershipPeriod } from "./entities/membership-period.entity";
import {
  PostMembershipResponseResource,
  GetMembershipResponseResource,
} from "./membership.types";
import { MembershipStrategyFactory } from "./strategies/membership-strategy-factory";
import { MembershipStrategy } from "./strategies/membership-strategy";

@Injectable()
export class MembershipService {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly periodRepository: MembershipPeriodRepository
  ) {}

  public getAll(): GetMembershipResponseResource[] {
    const rows: GetMembershipResponseResource[] = [];
    const memberships = this.membershipRepository.getAll();

    for (const membership of memberships) {
      const periods = this.periodRepository.getByMembershipId(membership.id);
      rows.push({ membership, periods });
    }

    return rows;
  }

  public store(
    createMembership: CreateMembershipDto
  ): PostMembershipResponseResource {
    const strategy = MembershipStrategyFactory.makeStrategy(
      createMembership.billingInterval
    );
    const membership = this.createMembership(createMembership, strategy);
    const membershipPeriods = this.createMembershipPeriods(
      membership,
      strategy
    );

    return {
      membership,
      membershipPeriods,
    };
  }

  createMembership(
    membership: CreateMembershipDto,
    strategy: MembershipStrategy
  ): Membership {
    membership.validUntil = strategy!.calculateMembershipExpiry(
      structuredClone(membership.validFrom),
      membership.billingPeriods
    );

    membership.state = "active";
    if (membership.validFrom > new Date()) {
      membership.state = "pending";
    }
    if (membership.validUntil < new Date()) {
      membership.state = "expired";
    }

    return this.membershipRepository.store(membership);
  }

  createMembershipPeriods(
    membership: Membership,
    strategy: MembershipStrategy
  ): MembershipPeriod[] {
    const membershipPeriods: MembershipPeriod[] = [];
    let periodStart = structuredClone(membership.validFrom);
    for (let i = 0; i < membership.billingPeriods; i++) {
      const periodEnd = strategy.calculateMembershipPeriodExpiry(
        structuredClone(periodStart)
      );
      const storedPeriod = this.periodRepository.store({
        membershipId: membership.id,
        start: periodStart,
        end: periodEnd,
        state: "planned",
      } as MembershipPeriod);
      membershipPeriods.push(storedPeriod);
      periodStart = periodEnd;
    }

    return membershipPeriods;
  }
}
