## API modernization

### Requirement

The task is to **refactor two endpoints** implemented in the **legacy codebase** that can be used to list and create memberships:

GET /legacy/memberships (`src/legacy/routes/membership.routes.js`)
POST /legacy/memberships (`src/legacy/routes/membership.routes.js`)

The new implementation should be accessible through new endpoints in the **modern codebase** that are already prepared:

GET /memberships (`src/modern/routes/membership.routes.ts`)
POST /memberships (`src/modern/routes/membership.routes.ts`)

When refactoring, you should consider the following aspects:

- The response from the endpoints should be exactly the same. Use the same error messages that are used in the legacy implementation.
- You write read- and maintainable code
- You use Typescript instead of Javascript to enabled type safety
- Your code is separated based on concerns
- Your code is covered by automated tests to ensure the stability of the application

### Legacy API issues

- existing packages in package-lock.json had some critical vulnerabilities that were needed to be addressed
- in the `GET /legacy/memberships` endpoint. There is a wrong filtering: `p.membershipId === membership.id`, but data from `memberships.json` has `membership` property resulting in memberships not having any related periods.
- `weekly` billing interval is invalid `billingInterval`, according to validation, but in the code this interval is handled.
- providing any other `billingInterval` that is not `yearly` or `monthly` is causing validation error with the message `invalidBillingPeriods`. Probably the error message should be `invalidBillingInterval`
- when `billingInterval` is `yearly` there is a wrong handling of `billingPeriods < 3`
  - `billingPeriods > 3` responds with validation error `billingPeriodsLessThan3Years`
  - `billingPeriods > 10` responds with validation error `billingPeriodsMoreThan10Years`
- creating the membership periods is always creating ids starting from 1, which would be wrong in the real life API.
- `user` is hardcoded to 2000, which limits the endpoint to only one user.
- Issues with `GET /memberships` and `POST /memberships` respond payload inconsistencies which are not recommended:
  - `GET` endpoint responds with `memberships + periods` collection, but `POST /memberships` responds with `membership + membershipPeriods`
  - `GET` endpoint response displays dates in a date format, but `POST` in timestamp format
  - `GET` endpoint respond payload has `userId` property, but `POST` has `user`
- periods are not calculated in UTC. Therefore result it can make variations like: "2023-07-31T23:00:00.000Z" and "2023-08-01T00:00:00.000Z"
- `validFrom` doesn't need to be valid date
- `billingPeriods < 6` validation is not handled properly and it was never triggered
- The API does not check existing memberships, allowing membership creation with the same dates or overlapping memberships for the same user

### Modern implementation scope
Taking into account that the scope of modern implementation should be only refactoring, leads me to the conclusion that the changes in the new implementation can't have any breaking change. Therefore, to avoid breaking changes, only the following changes and bugfixes are done

- `GET /memberships` endpoint responds with correctly attached periods
- `weekly` billing interval is supported and handled
- `validFrom` needs to be a valid date string

All the other changes would cause a breaking change that would not match the given scope and would be needed to represent the new major version according to semantic versioning
