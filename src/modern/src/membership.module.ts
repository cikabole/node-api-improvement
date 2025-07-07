import { Module } from "@nestjs/common";
import { MembershipController } from "./membership.controller";
import { MembershipService } from "./membership.service";
import { MembershipRepository } from "./repositories/membership.repository";
import { MembershipPeriodRepository } from "./repositories/membership-period.repository";

@Module({
  imports: [],
  controllers: [MembershipController],
  providers: [
    MembershipService,
    MembershipRepository,
    MembershipPeriodRepository,
  ],
})
export class MembershipModule {}
