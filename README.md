> <img width="30" alt="image" src="https://github.com/user-attachments/assets/d2a7b2d6-a8d9-468b-a02c-a2f3f1d31297" align="left"/>
>
> This project has been created as part of the 42 curriculum by [rgodet](https://profile.intra.42.fr/users/rgodet), [amblanch](https://profile.intra.42.fr/users/amblanch), [mdegache](https://profile.intra.42.fr/users/mdegache), [tcybak](https://profile.intra.42.fr/users/tcybak), and [adeboose](https://profile.intra.42.fr/users/adeboose).

<br/>
<p align="center">
  <img src="https://github.com/ayogun/42-project-badges/blob/main/badges/ft_transcendencee.png?raw=true"/>
  <h1 align="center">ft_transcendence</h1>
</p>
<br/>

## 📝 Description
This project is a website for the association BDE 42 Angoulême. This website is aimed to manage events, services, and clubs.

## 🚀 Getting started

## 👥 Team

| Member | Role                           | Responsibilities |
|--------|--------------------------------|-----------------|
| [Rémy Godet](https://profile.intra.42.fr/users/rgodet) | **Product Manager, Tech Lead** | Project vision, frontend architecture, UI/UX design, component library, SCSS design system, auth proxy, profile & settings pages |
| [Amaury Blanchet](https://profile.intra.42.fr/users/amblanch) | **Product Owner**              | Backend API, Prisma schema, database design, events/organizations CRUD, permissions, search, data import/export |
| [Manuarii Degache](https://profile.intra.42.fr/users/mdegache) | **Developer**                  | Authentication flows, agent signup/approval, forgot password, email service, member invites, photo albums & reports |
| [Timothy Cybak](https://profile.intra.42.fr/users/tcybak) | **Developer**                  | Frontend UI components (Carousel, Calendar, EventPreview), PWA, Sumup payment modal |
| [Aubin de Boose](https://profile.intra.42.fr/users/adeboose) | **Developer**                     | Docker infrastructure, Nginx, ELK stack, Prometheus/Grafana, CI/CD, health checks |

## 🗂️ Project Management

### Organization

Work was distributed by category and difficulty. As the most experienced web developer, Rémy could reassign or pick up tasks from other members when needed.
There were no formal meetings — all discussions happened in person at 42.

### Tools

- **Linear** — issue tracking, task prioritization, and sprint planning
- **GitHub** — code hosting, pull requests, and code reviews
- **Discord** — dedicated server for async communication

### Code Review & Branch Strategy

- One branch per Linear issue, merged into `main` via pull request
- **2 approvals minimum** required before merge
- Direct pushes to `main` are blocked and cannot be bypassed
- **Prettier** formatting is enforced on all code
- All commits must follow [Conventional Commits](https://www.conventionalcommits.org/)

## ⚡️ Technical Stack

### Frontend

| Technology | Purpose | Justification |
|------------|---------|---------------|
| [React 19](https://react.dev) | UI library | Latest stable version with concurrent features |
| [Next.js 16](https://nextjs.org) | Full-stack framework | Industry standard for React apps, monorepo-friendly with App Router |
| [TanStack Query](https://tanstack.com/query) | Server state management | Eliminates double fetches, provides caching, optimistic updates, and state synchronization |
| [TypeScript 5](https://www.typescriptlang.org) | Type safety | Strict mode enabled, catches bugs at compile time |
| [Sass](https://sass-lang.com) | Styling | SCSS modules for scoped, maintainable styles |
| [TipTap](https://tiptap.dev) | Rich text editor | Markdown-capable WYSIWYG editor for event/service descriptions |
| [Lucide React](https://lucide.dev) | Icons | Lightweight, tree-shakeable icon library |
| [Motion](https://motion.dev) | Animations | Declarative animation library for React |
| [Chart.js](https://www.chartjs.org) | Data visualization | Organization dashboards and statistics |

### Backend

| Technology | Purpose | Justification |
|------------|---------|---------------|
| [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) | REST API | Co-located with frontend, simpler to maintain than a separate backend |
| [Prisma 7](https://www.prisma.io) | ORM | Type-safe database access, chosen for team familiarity |
| [PostgreSQL](https://www.postgresql.org) | Database | Relational model fits the data (users, organizations, events, permissions) |
| [bcrypt](https://www.npmjs.com/package/bcrypt) | Password hashing | Industry-standard hashing algorithm |
| [jose](https://github.com/panva/jose) | JWT handling | Secure token signing and verification |
| [Nodemailer](https://nodemailer.com) | Email service | Password reset and verification emails |
| [otplib](https://github.com/yeojz/otplib) | TOTP 2FA | Time-based one-time password generation for two-factor auth |

### Infrastructure

| Technology | Purpose | Justification |
|------------|---------|---------------|
| [PostgreSQL](https://www.postgresql.org) | Primary database | Relational integrity for users, orgs, events, and permissions |
| [Nginx](https://nginx.org) | Reverse proxy | Used in both dev and production environments |
| [Docker](https://www.docker.com) | Containerization | Consistent environments across dev, staging, and production |
| [ELK Stack](https://www.elastic.co/elastic-stack) | Logging & monitoring | **Required by subject** — centralized log management |
| [Prometheus + Grafana](https://prometheus.io) | Metrics & dashboards | **Required by subject** — infrastructure monitoring |
| [Sumup SDK](https://developer.sumup.com) | Payments | Payment provider used by the BDE association |
| [Elasticsearch](https://www.elastic.co/elasticsearch) | Search engine | Full-text search for events and organizations |

### Developer Experience

| Technology | Purpose |
|------------|---------|
| [ESLint](https://eslint.org) | Code linting with Next.js + TypeScript + Prettier rules |
| [Prettier](https://prettier.io) | Code formatting enforced on all PRs |
| [Husky](https://typicode.github.io/husky/) | Git hooks for commit linting |
| [Commitlint](https://commitlint.js.org) | Conventional Commits enforcement |
| [Bruno](https://usebruno.com) | API testing and documentation |

## 🗄️ Database Schema

```mermaid
erDiagram
    users {
        uuid id PK
        string mail UK
        string password
        string first_name
        string last_name
        string full_name
        string profile_picture
        int fortytwo_user_id UK
        boolean agent
        boolean admin
        datetime created_at
        datetime updated_at
    }

    organizations {
        uuid id PK
        uuid owner_id FK
        string name
        string description
        string logo
        boolean club
        boolean verified
        datetime created_at
        datetime updated_at
    }

    events {
        uuid id PK
        uuid organization_id FK
        uuid owner_id FK
        uuid photos_album_id FK
        string image
        string title
        string subtitle
        string description
        int max_registration
        string location
        datetime start_at
        datetime end_at
        datetime created_at
    }

    services {
        uuid id PK
        uuid organization_id FK
        uuid category_id FK
        uuid photo_album_id FK
        string image
        string title
        string subtitle
        int edition
        string description
        string location
        datetime start_at
        datetime end_at
        boolean registration_required
        string registration_details
        string registration_link
        boolean registration_full
        string source_link
        datetime created_at
    }

    service_categories {
        uuid id PK
        string name
        string description
        string icon
        string background_image
        datetime created_at
    }

    organization_members {
        uuid id PK
        uuid organization_id FK
        uuid user_id FK
        uuid permission_id FK
        boolean approved
        datetime invited_at
        datetime registered_at
    }

    organization_followers {
        uuid id PK
        uuid user_id FK
        uuid organization_id FK
        datetime update_at
    }

    organization_permission {
        uuid id PK
        uuid organization_id FK
        string name
        string description
        boolean event_create
        boolean event_update
        boolean event_delete
        boolean service_create
        boolean service_update
        boolean service_delete
        boolean album_create
        boolean album_update
        boolean album_delete
        boolean members_invite
        boolean members_manage
        boolean organization_update_info
        boolean organization_manage
        boolean organization_manage_permission
        datetime created_at
    }

    event_registrations {
        uuid id PK
        uuid user_id FK
        uuid event_id FK
        datetime registered_at
    }

    photos_album {
        uuid id PK
        string name
        string description
        string external_link
        datetime created_at
    }

    photos {
        uuid id PK
        uuid album_id FK
        uuid uploaded_by_id FK
        string path
        datetime created_at
    }

    photos_album_reports {
        uuid id PK
        uuid album_id FK
        uuid user_id FK
        uuid photo_id FK
        string reason
        boolean resolved
        datetime created_at
    }

    fortytwo_oauth {
        uuid id PK
        string access_token
        string refresh_token
        datetime valid_until
    }

    two_factor_auth {
        uuid id PK
        boolean mail_enabled
        boolean totp_enabled
        string totp_secret
        uuid webauthn_credential_id FK
    }

    webauthn_credentials {
        uuid id PK
        uuid user_id UK
        string credential_id
        string public_key
        string sign_count
        datetime created_at
    }

    balance {
        uuid id PK
        int account
        datetime updated_at
    }

    transaction {
        uuid id PK
        uuid balance_id FK
        int amount
        string name
        boolean status
        datetime created_at
    }

    memberships {
        uuid id PK
        datetime start_at
        datetime end_at
    }

    files {
        uuid id PK
        datetime created_at
    }

    upload_request {
        uuid id PK
        uuid uploaded_by_id FK
        uuid file_id FK
        datetime created_at
    }

    ratelimit_login {
        uuid id PK
        uuid user_id FK
        string ip
        boolean success
        datetime created_at
    }

    users ||--o| fortytwo_oauth : "oauth"
    users ||--o| two_factor_auth : "2fa"
    users ||--o| webauthn_credentials : "webauthn"
    users ||--o| balance : "wallet"
    users ||--o| memberships : "membership"
    users ||--o| organizations : "owns"
    users ||--o| events : "creates"
    users ||--o| photos : "uploads"
    users ||--o| upload_request : "uploads"

    organizations ||--o{ organization_members : "has"
    organizations ||--o{ organization_followers : "has"
    organizations ||--o{ events : "hosts"
    organizations ||--o{ services : "offers"
    organizations ||--o{ organization_permission : "defines"

    organization_members }o--|| organization_permission : "granted"
    organization_members }o--|| users : "belongs to"

    organization_followers }o--|| users : "follows"

    events }o--|| organizations : "belongs to"
    events }o--|| users : "created by"
    events ||--o| photos_album : "has"
    events ||--o{ event_registrations : "subscribers"

    event_registrations }o--|| users : "registers"
    event_registrations }o--|| events : "for"

    services }o--|| organizations : "belongs to"
    services }o--|| service_categories : "categorized"
    services ||--o| photos_album : "has"

    photos_album ||--o{ photos : "contains"
    photos_album ||--o{ photos_album_reports : "reported"
    photos }o--|| photos_album : "in"
    photos }o--|| users : "uploaded by"
    photos_album_reports }o--|| users : "reported by"
    photos_album_reports }o--o| photos : "about"

    balance ||--o{ transaction : "history"
    transaction }o--|| balance : "belongs to"

    two_factor_auth ||--o| webauthn_credentials : "uses"
    webauthn_credentials }o--|| users : "belongs to"

    upload_request }o--|| users : "requested by"
    upload_request ||--o| files : "stores"

    ratelimit_login }o--|| users : "tracks"
```

## ✨Features List

### Authentication & User Management

| Feature | Implemented by | Description |
|---------|---------------|-------------|
| Email/Password Login | Amaury, Rémy | Traditional login with email and password, rate limiting on failed attempts |
| OAuth 42 Login | Manuarii, Rémy | Remote authentication via 42's OAuth 2.0 with automatic account creation |
| Agent Signup | Manuarii | Registration flow for BDE agents with admin approval required before access |
| Logout | Amaury, Rémy | Session destruction with CSRF token cleanup |
| Forgot Password | Manuarii, Rémy | Email-based password reset with time-limited tokens and code verification |
| Change Password | Amaury | Authenticated password change with current password verification |
| Profile & Account Settings | Rémy | User profile page with editable name, email, and profile picture |
| Agent Approval | Rémy, Amaury | Admin dashboard to review, approve, or reject pending agent registrations |

### Two-Factor Authentication

| Feature | Implemented by | Description |
|---------|---------------|-------------|
| TOTP 2FA | Rémy | Time-based one-time password setup with QR code generation and recovery codes |

### Organization System

| Feature | Implemented by | Description |
|---------|---------------|-------------|
| Create/Edit/Delete Organization | Amaury | Full CRUD for organizations with owner, name, description, logo, and club flag |
| Follow/Unfollow Organization | Amaury | Public users can follow organizations to stay updated |
| Invite Members | Manuarii | Organization owners/admins can invite users via email with role assignment |
| Approve/Reject Members | Manuarii | Membership approval workflow with optional admin review |
| Member Permissions | Amaury | Granular permission system with 15 boolean flags per role (event/service/album CRUD, member management) |
| Organization Approval | Amaury | Admin validation system for new organizations before they become public |

### Events

| Feature | Implemented by | Description |
|---------|---------------|-------------|
| Create/Edit/Delete Event | Amaury | Full event CRUD with title, description, dates, location, max registration, and image |
| Subscribe/Unsubscribe | Amaury | Event registration with capacity limits and attendee management |
| Calendar View | Rémy | Interactive calendar component for browsing events by date |
| Event Image Upload | Rémy | Image upload to database for event cover photos |

### Services

| Feature | Implemented by | Description |
|---------|---------------|-------------|
| Create/Edit/Delete Service | Amaury | Full service CRUD with registration links, edition tracking, and time-based availability |
| Service Categories | Rémy | Categorized service browsing with icons and background images |

### Photo Albums

| Feature | Implemented by | Description |
|---------|---------------|-------------|
| Photo Albums | Manuarii | Album creation linked to events and services with external link support |
| Upload Photos | Rémy | Photo upload to albums with authorization checks |
| Report Photos | Manuarii | Photo reporting system with reason tracking and admin resolution workflow |

### Search & Analytics

| Feature | Implemented by | Description |
|---------|---------------|-------------|
| Full-Text Search | Amaury | PostgreSQL full-text search across events and organizations with filters, sorting, and pagination |
| Organization Dashboard | Rémy, Amaury | Analytics dashboard with Chart.js data visualization for member stats, events, and activity |

### Data Management

| Feature | Implemented by | Description |
|---------|---------------|-------------|
| Data Import/Export | Rémy, Amaury | CSV/Excel import and export for organization members and events using PapaParse and SheetJS |

### Payment

| Feature | Implemented by | Description |
|---------|---------------|-------------|
| Sumup Payment | Amaury, Timothy, Rémy | Payment integration via Sumup SDK used by the BDE association with modal UI |
| Balance/Wallet | Amaury, Rémy | User balance system with transaction history and payment tracking |

### Policies

| Feature | Implemented by | Description |
|---------|---------------|-------------|
| Privacy & Terms Pages | Rémy | Static policy pages with responsive layout and consistent styling |

### Design System

| Feature | Implemented by | Description |
|---------|---------------|-------------|
| Custom Design System | Rémy | 10+ reusable components (Sidebar, OrganizationDashboardTable, MembershipCard, Toast, Carousel, Calendar, EventPreview, SectionHeaderTitle, ModificationText, Sumup) with SCSS modules, consistent color palette, and typography |

### Progressive Web App

| Feature | Implemented by | Description |
|---------|---------------|-------------|
| PWA | Timothy | Progressive Web App with manifest, icons, and service worker for offline support and installability |

### Email

| Feature | Implemented by | Description |
|---------|---------------|-------------|
| Email Service | Manuarii, Rémy | Nodemailer-based email system for password reset and verification with reusable utility |

### Developer Experience

| Feature | Implemented by | Description |
|---------|---------------|-------------|
| API Testing | Manuarii, Amaury | Comprehensive Bruno API collection covering all endpoints with examples and environment configs |
| Docker Health Checks | Amaury | Automated health checks for all services with recovery procedures |

### Infrastructure

| Feature | Implemented by | Description |
|---------|----------------|-------------|
| Docker Dev/Prod | Amaury, Aubin  | Multi-environment Docker Compose setup with separate configs for development, staging, and production |
| Nginx Reverse Proxy | Amaury, Rémy   | Nginx config with subdomain routing, SSL termination, and default_server blocks for both dev and prod |
| ELK Stack | Amaury, Aubin  | Elasticsearch + Logstash + Kibana with index templates, ILM policies, certs, and Kibana dashboards |
| Prometheus + Grafana | Amaury, Aubin  | Metrics collection and pre-built dashboards for infrastructure monitoring |
| CI/CD | Rémy           | GitHub Actions workflows for formatting checks, commitlint, and automated builds |

## ☑️ Modules

**Total: 22 points** (6 Major × 2pts + 10 Minor × 1pt)

### Major Modules (2 pts each)

| Module | Implemented by | Description |
|--------|---------------|-------------|
| **Framework (Frontend + Backend)** | Rémy | [Next.js 16](https://nextjs.org) with App Router for both frontend UI and backend API routes in a single codebase |
| **Advanced Permissions System** | Amaury, Manuarii | Granular permission model with 15 boolean flags per role (event/service/album CRUD, member management, org settings) stored in `organization_permission` |
| **Organization System** | Amaury, Rémy | Full organization model with owners, members, followers, invitation flow, approval system, and per-org events/services |
| **ELK Stack** | Amaury, Aubin | Elasticsearch + Logstash + Kibana for centralized log management with index templates, ILM policies, and Kibana dashboards |
| **Prometheus + Grafana** | Amaury, Aubin | Metrics collection and visualization for infrastructure monitoring with pre-built dashboards |
| **Advanced Analytics Dashboard** | Rémy | Organization-level dashboards with [Chart.js](https://www.chartjs.org) for data visualization (members, events, activity) |

### Minor Modules (1 pt each)

| Module | Implemented by   | Description |
|--------|------------------|-------------|
| **ORM** | Amaury           | [Prisma 7](https://www.prisma.io) with 21 models, type-safe queries, migrations, and PostgreSQL adapter |
| **SSR** | Rémy             | Server-side rendering via Next.js App Router for improved performance and SEO on public pages |
| **PWA** | Timothy          | Progressive Web App with manifest, service worker, and installable experience on mobile/desktop |
| **Custom Design System** | Rémy, Timothy    | 10+ reusable components (Sidebar, OrganizationDashboardTable, MembershipCard, Toast, Carousel, Calendar, EventPreview, SectionHeaderTitle, ModificationText, Sumup) with SCSS modules and consistent color palette |
| **Advanced Search** | Amaury, Rémy     | Full-text search with filters, sorting, and pagination for events and organizations using PostgreSQL `fullTextSearchPostgres` |
| **Browser Support** | Rémy, Timothy    | Cross-browser compatibility built in from the start (Chrome, Firefox, Safari, Edge) |
| **OAuth 2.0** | Amaury, Manuarii | 42 OAuth remote authentication with proxy routing, token management, and automatic account creation |
| **2FA System** | Rémy             | Complete two-factor authentication with TOTP ([otplib](https://github.com/yeojz/otplib)), email fallback, and WebAuthn credential support |
| **Health Check System** | Amaury           | Docker health checks for all services with automated recovery and status monitoring |
| **Data Export/Import** | Amaury, Rémy     | CSV/Excel import and export for organization members and event data using [PapaParse](https://www.papaparse.com) and [SheetJS](https://www.npmjs.com/package/xlsx) |



## 🤡 Individual Contributions

| Member | Role | Commits | PRs merged |
|--------|------|---------|------------|
| [Rémy Godet](https://profile.intra.42.fr/users/rgodet) | Product Owner | 266 | 13 |
| [Amaury Blanchet](https://profile.intra.42.fr/users/amblanch) | Tech Lead | 223 | 5 |
| [Manuarii Degache](https://profile.intra.42.fr/users/mdegache) | Developer | 44 | 2 |
| [Timothy Cybak](https://profile.intra.42.fr/users/tcybak) | Developer | 54 | 0 |
| [Aubin de Boose](https://profile.intra.42.fr/users/adeboose) | DevOps | 47 | 0 |

### [Rémy Godet](https://profile.intra.42.fr/users/rgodet) — Product Owner

**323 commits**

Rémy acted as Product Owner and lead frontend developer. He drove the project vision, managed the overall architecture, and delivered the majority of the UI:
- **Frontend architecture:** layout, routing, home page, login flows, profile, privacy & terms pages
- **Component library:** Sidebar, OrganizationDashboardTable, MembershipCard, Toast provider, filter system
- **UI/UX:** SCSS design system, loading skeletons, empty states, modals, stickers
- **Auth & session:** 42 OAuth proxy, user context, session management, error handling
- **Database layer:** initial Prisma models, User utilities, OrganizationMembers

### [Amaury Blanchet](https://profile.intra.42.fr/users/amblanch) — Tech Lead

**265 commits**

Amaury served as Tech Lead, owning the backend and data layer of the application:
- **Backend API:** events CRUD, organization CRUD, user routes, agent approval, search & filtering
- **Database:** Prisma schema design, migrations, generated models, Event & Organization data layer
- **Feature development:** event management (creation, subscription, image upload, import/export), organization follow/members system
- **API testing:** comprehensive Bruno API collection for all endpoints
- **Infrastructure:** Docker Node/Nginx setup, PostgreSQL configuration

### [Manuarii Degache](https://profile.intra.42.fr/users/mdegache) — Developer

**56 commits**

Manuarii focused on authentication flows and user-facing features:
- **Auth system:** agent signup, forgot-password flow with email verification, password reset
- **Email service:** reusable sendEmail utility for password recovery
- **User management:** account creation, user API routes, permission schemas
- **Organization features:** member invites, follower system, organization members API
- **Frontend:** signup pages, forgot-password UI, confirmation code input

### [Timothy Cybak](https://profile.intra.42.fr/users/tcybak) — Developer

**51 commits**

Timothy specialized in frontend UI components and user experience:
- **UI components:** Carousel, Calendar, EventPreview, SectionHeaderTitle, ModificationText
- **Pages:** events list, membership, privacy, account settings, 2FA login
- **Login flows:** forgot password page, reset password component, signup templates
- **PWA:** Progressive Web App setup with manifest, icons, and service worker
- **Sumup component:** reusable summary/reload component

### [Aubin de Boose](https://profile.intra.42.fr/users/adeboose) — DevOps

**10 commits**

Aubin owned the entire infrastructure and deployment pipeline:
- **Docker:** dev/prod Docker Compose files, Dockerfiles for Node, Nginx, Elasticsearch
- **ELK Stack:** Elasticsearch, Logstash, Kibana setup with certs, dashboards, and index templates
- **Monitoring:** Prometheus + Grafana dashboards for infrastructure overview
- **Security:** Vault agent, mTLS, ModSecurity WAF, SSL in dev mode
- **CI/CD:** GitHub Actions workflows, commitlint, Husky hooks, Makefile
- **Reverse proxy:** Nginx config with subdomain routing, default_server blocks

## 📚 Resources

### Documentation

- [Next.js 16 Documentation](https://nextjs.org/docs) — Full-stack React framework
- [React 19 Documentation](https://react.dev) — UI library
- [Prisma 7 Documentation](https://www.prisma.io/docs) — TypeScript ORM for PostgreSQL
- [TanStack Query Documentation](https://tanstack.com/query) — Server state management for React
- [TipTap Documentation](https://tiptap.dev/docs) — Extensible rich text editor for React
- [PostgreSQL Documentation](https://www.postgresql.org/docs/) — Relational database
- [Nginx Documentation](https://nginx.org/en/docs/) — Reverse proxy and web server
- [Docker Documentation](https://docs.docker.com) — Containerization platform
- [Elasticsearch Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html) — Search and analytics engine
- [Kibana Documentation](https://www.elastic.co/guide/en/kibana/current/index.html) — Data visualization for Elasticsearch
- [Prometheus Documentation](https://prometheus.io/docs/) — Monitoring and alerting toolkit
- [Grafana Documentation](https://grafana.com/docs/) — Analytics and interactive visualization
- [Sumup Developer Documentation](https://developer.sumup.com) — Payment integration API
- [PapaParse Documentation](https://www.papaparse.com/docs) — CSV parser for JavaScript
- [SheetJS Documentation](https://docs.sheetjs.com) — Spreadsheet data library
- [Lucide React](https://lucide.dev/icons) — Icon library
- [Motion for React](https://motion.dev/docs/react-quick-start) — Animation library
- [Chart.js Documentation](https://www.chartjs.org/docs/) — Data visualization library
- [Bruno API Client](https://docs.usebruno.com) — API testing and documentation

### Tools & References

- [Conventional Commits](https://www.conventionalcommits.org) — Commit message specification
- [Linear](https://linear.app) — Project management
- [GitHub Actions](https://docs.github.com/en/actions) — CI/CD workflows
- [Husky](https://typicode.github.io/husky/) — Git hooks
- [ESLint](https://eslint.org) — JavaScript linting
- [Prettier](https://prettier.io) — Code formatting

### AI Usage

AI was used during the project in the following ways:

- **Aubin de Boosere** used **Claude Code** (Anthropic) to generate 100% of his contributions, primarily on the Docker infrastructure, ELK stack configuration, and monitoring setup. All 10 of his commits were AI-generated. The resulting code quality required significant rework by other team members.
- **Rémy Godet** and **Amaury Blanchet** used **OpenCode** (opencode.ai) as an AI coding assistant for documentation writing and code generation tasks. All AI-generated commits were reviewed by the users.
- **General usage**: AI tools were occasionally used for debugging and code completion, but the core architecture, feature development, and design decisions were made by the team.