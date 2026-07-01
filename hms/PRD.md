# Hotel Management System - Project Requirements Document
## Agile Methodology Implementation for Team of 5

**Project Name:** Hotel Management System (HMS)  
**Team Size:** 5 Members  
**Project Duration:** January 1, 2025 - December 31, 2025  
**Methodology:** Agile/Scrum  
**Sprint Duration:** 2 weeks per sprint  
**Total Sprints:** 26 sprints

---

## 1. PROJECT OVERVIEW

### 1.1 Project Vision
Develop a comprehensive Hotel Management System to streamline hotel operations including room reservations, guest management, billing, housekeeping, and reporting.

### 1.2 Project Objectives
- Manage room inventory and availability
- Process online and walk-in reservations
- Handle guest check-in/check-out
- Manage housekeeping schedules
- Process payments and billing
- Generate occupancy and revenue reports
- Manage staff and shifts
- Handle guest services and requests

### 1.3 Success Criteria
- 100% reservation automation
- Real-time room availability
- Check-in time < 5 minutes
- 99.9% system uptime
- Guest satisfaction score > 4.5/5

---

## 2. TEAM STRUCTURE & ROLES

### 2.1 Team Composition (5 Members)
1. **Scrum Master** - Facilitates sprints, removes impediments
2. **Product Owner** - Manages backlog, defines requirements
3. **Backend Developer** - API development, database design
4. **Frontend Developer** - UI/UX development, responsive design
5. **Full-Stack Developer** - Integration, testing, deployment

---

## 3. MODULE BREAKDOWN & TECHNICAL SPECIFICATIONS

### Module 1: User Authentication & Authorization
**Priority:** P0 (Critical)  
**Sprint:** 1-2  
**Story Points:** 13

#### Technical Details:
- **Frontend:** React.js with React Router
- **Backend:** Node.js/Express or Python/Django
- **Database:** PostgreSQL
- **Authentication:** JWT tokens, role-based access

#### User Stories:
1. **US-001:** As a guest, I want to create an account
2. **US-002:** As staff, I want to login securely
3. **US-003:** As admin, I want to manage user roles

#### Database Schema:
```sql
Users Table:
- id (UUID, Primary Key)
- email (VARCHAR, Unique)
- password_hash (VARCHAR)
- role (ENUM: guest, receptionist, housekeeping, admin)
- created_at (TIMESTAMP)
```

---

### Module 2: Room Management
**Priority:** P0 (Critical)  
**Sprint:** 3-5  
**Story Points:** 21

#### Technical Details:
- **Frontend:** Room catalog, availability calendar
- **Backend:** Room CRUD APIs, availability checking
- **Database:** Room types, amenities, pricing

#### User Stories:
1. **US-004:** As admin, I want to add rooms
2. **US-005:** As guest, I want to view available rooms
3. **US-006:** As admin, I want to set room rates
4. **US-007:** As admin, I want to manage room types

#### Database Schema:
```sql
Rooms Table:
- id (UUID, Primary Key)
- room_number (VARCHAR, Unique)
- room_type_id (UUID, Foreign Key)
- floor (INTEGER)
- status (ENUM: available, occupied, maintenance, cleaning)
- amenities (JSONB)
- created_at (TIMESTAMP)

Room_Types Table:
- id (UUID, Primary Key)
- type_name (VARCHAR)
- description (TEXT)
- max_occupancy (INTEGER)
- base_rate (DECIMAL)
- amenities (JSONB)
```

---

### Module 3: Reservation Management
**Priority:** P0 (Critical)  
**Sprint:** 6-8  
**Story Points:** 21

#### Technical Details:
- **Frontend:** Booking form, reservation calendar
- **Backend:** Reservation APIs, conflict detection
- **Database:** Reservations, booking history

#### User Stories:
1. **US-008:** As guest, I want to book a room online
2. **US-009:** As receptionist, I want to create walk-in reservation
3. **US-010:** As guest, I want to modify my reservation
4. **US-011:** As guest, I want to cancel reservation

#### Database Schema:
```sql
Reservations Table:
- id (UUID, Primary Key)
- reservation_number (VARCHAR, Unique)
- guest_id (UUID, Foreign Key)
- room_id (UUID, Foreign Key)
- check_in_date (DATE)
- check_out_date (DATE)
- number_of_guests (INTEGER)
- status (ENUM: confirmed, checked_in, checked_out, cancelled)
- total_amount (DECIMAL)
- created_at (TIMESTAMP)
```

---

### Module 4: Guest Management
**Priority:** P0 (Critical)  
**Sprint:** 9-10  
**Story Points:** 13

#### Technical Details:
- **Frontend:** Guest profiles, check-in form
- **Backend:** Guest APIs, ID verification
- **Database:** Guest information, preferences

#### User Stories:
1. **US-012:** As receptionist, I want to check-in guests
2. **US-013:** As receptionist, I want to check-out guests
3. **US-014:** As guest, I want to view my profile
4. **US-015:** As admin, I want guest history

---

### Module 5: Billing & Payment
**Priority:** P0 (Critical)  
**Sprint:** 11-13  
**Story Points:** 21

#### Technical Details:
- **Frontend:** Invoice display, payment processing
- **Backend:** Billing calculation, payment APIs
- **Database:** Invoices, payments, charges

#### User Stories:
1. **US-016:** As admin, I want to generate invoices
2. **US-017:** As guest, I want to pay online
3. **US-018:** As admin, I want to add charges
4. **US-019:** As admin, I want payment history

#### Database Schema:
```sql
Invoices Table:
- id (UUID, Primary Key)
- invoice_number (VARCHAR, Unique)
- reservation_id (UUID, Foreign Key)
- room_charges (DECIMAL)
- service_charges (DECIMAL)
- tax (DECIMAL)
- total_amount (DECIMAL)
- payment_status (ENUM: pending, partial, paid)
- created_at (TIMESTAMP)

Payments Table:
- id (UUID, Primary Key)
- invoice_id (UUID, Foreign Key)
- payment_method (ENUM: cash, card, online)
- amount (DECIMAL)
- payment_date (DATE)
- transaction_id (VARCHAR)
```

---

### Module 6: Housekeeping Management
**Priority:** P1 (High)  
**Sprint:** 14-16  
**Story Points:** 21

#### Technical Details:
- **Frontend:** Housekeeping dashboard, task assignment
- **Backend:** Task management APIs
- **Database:** Cleaning tasks, schedules

#### User Stories:
1. **US-020:** As housekeeping manager, I want to assign tasks
2. **US-021:** As housekeeper, I want to view my tasks
3. **US-022:** As housekeeper, I want to update task status
4. **US-023:** As admin, I want housekeeping reports

---

### Module 7: Staff Management
**Priority:** P1 (High)  
**Sprint:** 17-18  
**Story Points:** 13

#### Technical Details:
- **Frontend:** Staff directory, schedule management
- **Backend:** Staff APIs, shift management
- **Database:** Staff records, schedules

#### User Stories:
1. **US-024:** As admin, I want to manage staff
2. **US-025:** As staff, I want to view my schedule
3. **US-026:** As admin, I want staff attendance

---

### Module 8: Guest Services
**Priority:** P1 (High)  
**Sprint:** 19-20  
**Story Points:** 13

#### Technical Details:
- **Frontend:** Service request form, request tracking
- **Backend:** Service request APIs
- **Database:** Service requests, service catalog

#### User Stories:
1. **US-027:** As guest, I want to request services
2. **US-028:** As staff, I want to manage service requests
3. **US-029:** As admin, I want service analytics

---

### Module 9: Reporting & Analytics
**Priority:** P1 (High)  
**Sprint:** 21-23  
**Story Points:** 21

#### Technical Details:
- **Frontend:** Dashboard, charts, reports
- **Backend:** Analytics APIs, data aggregation
- **Database:** Aggregated views, reporting

#### User Stories:
1. **US-030:** As admin, I want occupancy reports
2. **US-031:** As admin, I want revenue reports
3. **US-032:** As admin, I want guest analytics

---

### Module 10: Integration & Notifications
**Priority:** P1 (High)  
**Sprint:** 24-26  
**Story Points:** 21

#### Technical Details:
- **Frontend:** Notification center
- **Backend:** Email/SMS services, webhooks
- **Database:** Notifications, templates

#### User Stories:
1. **US-033:** As guest, I want booking confirmations
2. **US-034:** As admin, I want automated notifications
3. **US-035:** As guest, I want check-in reminders

---

## 4. SPRINT PLANNING & TIMELINE

### Sprint Schedule (2-week sprints)

| Sprint | Dates | Focus Module | Story Points | Deliverables |
|--------|-------|--------------|--------------|--------------|
| Sprint 1 | Jan 1-14 | Setup & Auth (Part 1) | 8 | Project setup, Auth UI |
| Sprint 2 | Jan 15-28 | Auth (Part 2) | 5 | Auth backend |
| Sprint 3 | Jan 29-Feb 11 | Room Mgmt (Part 1) | 8 | Room catalog |
| Sprint 4 | Feb 12-25 | Room Mgmt (Part 2) | 8 | Room APIs |
| Sprint 5 | Feb 26-Mar 11 | Room Mgmt (Part 3) | 5 | Availability calendar |
| Sprint 6 | Mar 12-25 | Reservations (Part 1) | 8 | Booking form |
| Sprint 7 | Mar 26-Apr 8 | Reservations (Part 2) | 8 | Reservation APIs |
| Sprint 8 | Apr 9-22 | Reservations (Part 3) | 5 | Conflict detection |
| Sprint 9 | Apr 23-May 6 | Guest Mgmt | 8 | Check-in/out |
| Sprint 10 | May 7-20 | Guest Mgmt (Part 2) | 5 | Guest profiles |
| Sprint 11 | May 21-Jun 3 | Billing (Part 1) | 8 | Invoice generation |
| Sprint 12 | Jun 4-17 | Billing (Part 2) | 8 | Payment processing |
| Sprint 13 | Jun 18-Jul 1 | Billing (Part 3) | 5 | Payment history |
| Sprint 14 | Jul 2-15 | Housekeeping (Part 1) | 8 | Task assignment |
| Sprint 15 | Jul 16-29 | Housekeeping (Part 2) | 8 | Task management |
| Sprint 16 | Jul 30-Aug 12 | Housekeeping (Part 3) | 5 | Reports |
| Sprint 17 | Aug 13-26 | Staff Mgmt | 8 | Staff management |
| Sprint 18 | Aug 27-Sep 9 | Staff Mgmt (Part 2) | 5 | Schedules |
| Sprint 19 | Sep 10-23 | Guest Services | 8 | Service requests |
| Sprint 20 | Sep 24-Oct 7 | Guest Services (Part 2) | 5 | Service tracking |
| Sprint 21 | Oct 8-21 | Reporting | 8 | Dashboard |
| Sprint 22 | Oct 22-Nov 4 | Reporting (Part 2) | 8 | Reports |
| Sprint 23 | Nov 5-18 | Reporting (Part 3) | 5 | Analytics |
| Sprint 24 | Nov 19-Dec 2 | Integration | 8 | Email/SMS |
| Sprint 25 | Dec 3-16 | Integration (Part 2) | 8 | Notifications |
| Sprint 26 | Dec 17-31 | Final Testing & Deployment | - | UAT, production |

---

## 5. TECHNICAL ARCHITECTURE

### 5.1 Technology Stack

**Frontend:**
- React.js 18+ with TypeScript
- Redux Toolkit for state management
- Material-UI or Ant Design
- FullCalendar for booking calendar

**Backend:**
- Node.js 20+ / Express.js
- PostgreSQL 15+ database
- Redis for caching
- Bull for background jobs

**DevOps:**
- Docker for containerization
- GitHub Actions for CI/CD
- AWS/GCP for hosting

---

## 6. WORK TRACKING & METRICS

### 6.1 Key Metrics
- **Velocity:** 40-50 story points per sprint
- **Check-in Time:** < 5 minutes
- **Reservation Processing:** < 2 minutes
- **System Uptime:** 99.9%
- **Guest Satisfaction:** > 4.5/5

---

## 7. RISK MANAGEMENT

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Double booking | High | Medium | Real-time availability check |
| Payment failures | High | Low | Multiple payment options |
| System downtime | High | Medium | Redundancy, monitoring |
| Peak season overload | Medium | Medium | Auto-scaling |

---

## 8. MILESTONES

| Milestone | Date | Deliverable |
|-----------|------|-------------|
| M1: Project Setup | Jan 28, 2025 | CI/CD, auth |
| M2: Core Booking | Jun 3, 2025 | Rooms, reservations |
| M3: Guest Services | Aug 26, 2025 | Check-in/out, billing |
| M4: Operations | Nov 18, 2025 | Housekeeping, staff |
| M5: Final Release | Dec 31, 2025 | Production deployment |

---

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Next Review:** End of each sprint
