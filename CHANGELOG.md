# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

Changes since v2025.11.24.1 that will be included in the next release.

### Added

- Funding reconciliation feature to calculate and display monthly funding reconciliation amounts based on adjustment records for each funding period.
  Why? To provide a clear, authoritative view of how funding amounts are reconciled over time.
- Improved administration pages for funding lines, funding periods, and funding submission lines, with dedicated read pages and a shared fiscal year selector.
  Why? To make administration tasks easier, more consistent, and more usable on mobile devices.

### Changed

- Improved accuracy of funding reconciliation and payroll adjustment totals, especially for wage enhancements and employee benefits, by using more precise financial calculations.
- More reliable fiscal period creation and seeding so that fiscal periods align with the correct funding period and fiscal year.
- Increased data validation on funding submission line json records to prevent invalid data from entering reporting and reconciliation flows.
- Various developer experience improvements for funding reconciliation services, seeds, and documentation.
  (Refactors, new tests, and internal tooling changes.)

### Fixed

- Prevented employee benefits from being double counted in employee adjustment amounts during funding reconciliation calculations.
- Resolved occasional authentication issues caused by plugin load order.

### Removed

- Cleaned up legacy wage enhancement data and development helpers that are no longer used by the new funding reconciliation flow.

## [v2025.11.24.1] - 2025-11-24

### Added
- User administration improvements, including a user creation page for system administrators and a funding period creation flow that can also create employee benefits.
- More powerful filtering and visualization on funding dashboards, including occupancy rate filters and a more reactive funding line values enrollment chart.
- Jira auto-link GitHub action and better local SQL logging to make it easier to trace production issues back to code changes.

### Changed
- Upgraded the runtime and front-end stack (Node 22, Vue, Vuetify, vitest, helmet, tedious, and TypeScript) to current supported versions.
- Standardized authentication, routing, and user interface patterns (breadcrumbs, Vuetify colors, component naming, and enrollment chart behavior) for a more consistent administration experience.
- Simplified user roles into an array stored on the user record and streamlined related user services and serializers.
- Developer improvements to migrations, tests, and logging, including a standardized migration file format and clearer test structures.

### Deprecated
- MssqlSimpleTypes utility with deprecation notices.

### Fixed
- System administrator display now relies on roles-based checks instead of a legacy `isAdmin` property.
- Improved reliability of TypeScript builds and database migrations following the Sequelize 7 upgrade.
- Resolved several user interface issues such as search field spacing, extraneous `month` properties, HTML table structure, and tooltip readability.
- Cleaned up warnings around version attributes, SQL `AS` keyword casing, and usage of the legacy Sequelize 6 QueryInterface reference.

### Removed
- Legacy `user_roles` table and related associations, replaced with a `roles` column on the `users` table.
- Deprecated funding period flags, routes, services, serializers, and legacy editor dialogs that conflicted with the newer fiscal period concept.
- Obsolete assets and configuration files, including a duplicate Auth0 configuration, an orphaned centre dashboard summary page, and the CLAUDE.md file.

### Security
- Restrict user creation and destruction to system administrators.

## [v2025.10.1.2] - 2025-10-01

### Changed
- Upgraded the backend Object-Relational Mapper from Sequelize 6 to Sequelize 7 and updated models, migrations, and configuration to match.
- Aligned database utilities and client code with Sequelize 7, including transaction resolution, drop-constraint handling, and simple type helpers.
- Updated testing and build tooling (test factories, vitest configuration, type checking, and development commands) to support the new Sequelize version.

### Fixed
- Resolved type errors, migration warnings, and test failures introduced by the Sequelize 7 upgrade.

## [v2025.10.1.1] - 2025-10-01

### Added
- Enhanced the funding line values enrollment chart with reactive updates and the ability to filter funding submission line jsons by child occupancy rate.
- Improved backend query string handling and server-side ordering support so the front-end can control sort order more precisely.
- Added better local SQL logging to assist with diagnosing data issues.

### Changed
- Refined the enrollment chart user experience with standardized component naming, a simpler skeleton loader, and more readable tooltips.

### Fixed
- Corrected HTML table structure in affected views.

## [v2025.9.30.1] - 2025-09-30

### Added
- Jira auto-link GitHub action so pull requests automatically reference their related issues.
- SQL formatting Prettier plugins in the development configuration for consistent SQL formatting.

### Changed
- Upgraded Vue, Vuetify, and other front-end development dependencies to current supported versions.
- Standardized Auth0 plugin naming and configuration loading, as well as the Jira environment variable name.
- Streamlined routing and layout configuration (Vite and TypeScript configuration, route props, auto-loaded components removal, and main entrypoint cleanup).
- Linted key pages such as the centre dashboard to current standards.

### Removed
- Cleaned up obsolete or duplicate front-end assets, including an orphaned centre dashboard summary page, a duplicate Auth0 configuration, and an accidental URL paste.

### Fixed
- Addressed minor runtime warnings, including obsolete version attributes and SQL `AS` keyword casing.

## [v2024.10.7.1] - 2024-10-07

### Added
- User administration capabilities, including a user creation page for system administrators.
- Funding period creation workflow, with the option to create employee benefits during funding period setup.
- Automated tests covering the funding period and employee benefit creation flow.

### Changed
- Standardized administration layout and styling (breadcrumbs, Vuetify colors, and card elevations) for a more consistent experience.
- Simplified the user model and routing by storing roles as an array on the user record and standardizing back-end routing patterns.
- Updated profile page styling.

### Deprecated
- MssqlSimpleTypes utility with deprecation notices.

### Fixed
- System administrator display now uses roles-based checks instead of a legacy `isAdmin` property.
- Improved TypeScript build and migration reliability for Microsoft SQL Server and Umzug.
- Fixed several administration user interface issues, such as search field spacing and the toggle user role helper.

### Removed
- Legacy `user_roles` table and associated relationships.
- Deprecated funding period flags, roles associations, and editor dialogs that conflicted with the newer fiscal period concept.
- The CLAUDE.md file, which is no longer needed in the repository.

### Security
- Restrict user creation and destruction to system administrators.

## [v2024.10.5.1] - 2024-10-05

### Note

- Initial upstream release tracked in this changelog.
  Earlier history is available in the upstream repository.
