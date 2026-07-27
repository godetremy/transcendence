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

## ☑️ Modules

## 🤡 Individual Contributions

| Member | Role | Commits | PRs merged |
|--------|------|---------|------------|
| [Rémy Godet](https://profile.intra.42.fr/users/rgodet) | Product Owner | 266 | 13 |
| [Amaury Blanchet](https://profile.intra.42.fr/users/amblanch) | Tech Lead | 223 | 5 |
| [Manuarii Degache](https://profile.intra.42.fr/users/mdegache) | Developer | 44 | 2 |
| [Timothy Cybak](https://profile.intra.42.fr/users/tcybak) | Developer | 54 | 0 |
| [Aubin de Boose](https://profile.intra.42.fr/users/adeboose) | DevOps | 47 | 0 |

### [Rémy Godet](https://profile.intra.42.fr/users/rgodet) — Product Owner

**266 commits** · 13 PRs merged

Rémy acted as Product Owner and lead frontend developer. He drove the project vision, managed the overall architecture, and delivered the majority of the UI:
- **Frontend architecture:** layout, routing, home page, login flows, profile, privacy & terms pages
- **Component library:** Sidebar, OrganizationDashboardTable, MembershipCard, Toast provider, filter system
- **UI/UX:** SCSS design system, loading skeletons, empty states, modals, stickers
- **Auth & session:** 42 OAuth proxy, user context, session management, error handling
- **Database layer:** initial Prisma models, User utilities, OrganizationMembers

### [Amaury Blanchet](https://profile.intra.42.fr/users/amblanch) — Tech Lead

**223 commits** · 5 PRs merged

Amaury served as Tech Lead, owning the backend and data layer of the application:
- **Backend API:** events CRUD, organization CRUD, user routes, agent approval, search & filtering
- **Database:** Prisma schema design, migrations, generated models, Event & Organization data layer
- **Feature development:** event management (creation, subscription, image upload, import/export), organization follow/members system
- **API testing:** comprehensive Bruno API collection for all endpoints
- **Infrastructure:** Docker Node/Nginx setup, PostgreSQL configuration

### [Manuarii Degache](https://profile.intra.42.fr/users/mdegache) — Developer

**44 commits** · 2 PRs merged

Manuarii focused on authentication flows and user-facing features:
- **Auth system:** agent signup, forgot-password flow with email verification, password reset
- **Email service:** reusable sendEmail utility for password recovery
- **User management:** account creation, user API routes, permission schemas
- **Organization features:** member invites, follower system, organization members API
- **Frontend:** signup pages, forgot-password UI, confirmation code input

### [Timothy Cybak](https://profile.intra.42.fr/users/tcybak) — Developer

**54 commits**

Timothy specialized in frontend UI components and user experience:
- **UI components:** Carousel, Calendar, EventPreview, SectionHeaderTitle, ModificationText
- **Pages:** events list, membership, privacy, account settings, 2FA login
- **Login flows:** forgot password page, reset password component, signup templates
- **PWA:** Progressive Web App setup with manifest, icons, and service worker
- **Sumup component:** reusable summary/reload component

### [Aubin de Boose](https://profile.intra.42.fr/users/adeboose) — DevOps

**47 commits**

Aubin owned the entire infrastructure and deployment pipeline:
- **Docker:** dev/prod Docker Compose files, Dockerfiles for Node, Nginx, Elasticsearch
- **ELK Stack:** Elasticsearch, Logstash, Kibana setup with certs, dashboards, and index templates
- **Monitoring:** Prometheus + Grafana dashboards for infrastructure overview
- **Security:** Vault agent, mTLS, ModSecurity WAF, SSL in dev mode
- **CI/CD:** GitHub Actions workflows, commitlint, Husky hooks, Makefile
- **Reverse proxy:** Nginx config with subdomain routing, default_server blocks

## 📚 Resources