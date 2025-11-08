# 🔧 Wrench - Feature Overview

## App Name: Wrench
*Building Better Communities Together*

---

## Core Features

### 👷 For Engineers
- **Browse Projects** - Search community projects by location, skills needed, and category
- **Submit Bids** - Propose your budget and timeline with a personal message
- **Track Progress** - Monitor all your bids in one dashboard
- **Build Profile** - Showcase your skills and experience
- **Make Impact** - Work on meaningful projects that help your community

### 🏘️ For Communities
- **Post Projects** - Describe your needs with detailed requirements
- **Review Bids** - Compare proposals from qualified engineers
- **Accept/Reject** - Choose the best fit for your project
- **Track Status** - Monitor projects from open to completion
- **Get Help** - Connect with skilled volunteers in your area

---

## Key Functionality

### 🔐 Authentication System
- Secure JWT-based authentication
- Two user types: Engineers and Communities
- Profile management with editable information
- Password hashing with bcrypt

### 📋 Project Management
- **Create Projects** with:
  - Title and description
  - Category (Construction, Accessibility, Landscaping, Renovation, Other)
  - Location
  - Required skills
  - Budget range (optional)
  - Timeline estimate
- **Project Status Tracking**:
  - Open (accepting bids)
  - In Progress (bid accepted)
  - Completed
  - Cancelled

### 💰 Bidding System
- Engineers submit bids with:
  - Proposed budget
  - Proposed timeline
  - Personal message
- Communities can:
  - Review all bids
  - Accept or reject bids
  - View engineer profiles
- Status tracking: Pending, Accepted, Rejected

### 🔍 Search & Filter
- **Projects**: Filter by location, skills, category, status
- **Engineers**: Search by location and skills
- Real-time results

### 📊 Dashboard
- **Engineer Dashboard**:
  - Total bids submitted
  - Accepted bids count
  - Pending bids
  - Full bid history
- **Community Dashboard**:
  - Total projects posted
  - Open projects count
  - Total bids received
  - Project management

---

## Sample Data Included

### Engineers
1. **John Builder**
   - Location: Portland, OR
   - Skills: Carpentry, Plumbing, Electrical, Landscaping
   - Bio: 15 years experience in construction
   - Email: john.engineer@example.com

2. **Sarah Maker**
   - Location: Seattle, WA
   - Skills: Mechanical Design, Welding, CAD, Accessibility Design
   - Bio: Mechanical engineer, playground equipment specialist
   - Email: sarah.maker@example.com

### Communities
1. **Green Park Community Center**
   - Location: Portland, OR
   - Serves 5,000 families
   - Email: greenpark@community.org

2. **Oak Ridge Neighborhood Association**
   - Location: Seattle, WA
   - Focus: Safe, accessible spaces
   - Email: oakridge@community.org

### Sample Projects
1. **Community Garden Raised Beds**
   - Category: Construction
   - Budget: $0-$500
   - Timeline: 2 weekends
   - Skills: Carpentry, Basic Tools

2. **Playground Safety Fence Installation**
   - Category: Construction
   - Budget: $200-$800
   - Timeline: 1 weekend
   - Skills: Fencing, Post Installation, Concrete

3. **Wheelchair Ramp for Community Center**
   - Category: Accessibility
   - Budget: $1,000-$2,000
   - Timeline: 1 month
   - Skills: Carpentry, ADA Compliance, Construction

---

## Technology Stack

### Backend
- **Node.js** with Express.js
- **SQLite** database (sql.js)
- **JWT** for authentication
- **bcrypt** for password security
- RESTful API architecture

### Frontend
- **Vanilla JavaScript** (no framework bloat)
- **Modern CSS** with CSS Grid and Flexbox
- **Responsive Design** for all devices
- **Single Page Application** architecture

### Security
- Password hashing with bcrypt
- JWT token authentication
- SQL injection prevention
- XSS protection with HTML escaping
- Input validation on all endpoints
- CORS enabled

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update profile

### Projects
- `GET /api/projects` - List all projects (with filters)
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create new project (community only)
- `PUT /api/projects/:id` - Update project (owner only)
- `DELETE /api/projects/:id` - Delete project (owner only)

### Bids
- `GET /api/bids/project/:projectId` - Get project bids (owner only)
- `GET /api/bids/my/bids` - Get my bids (engineer only)
- `POST /api/bids` - Submit bid (engineer only)
- `PATCH /api/bids/:id/status` - Accept/reject bid (community only)
- `DELETE /api/bids/:id` - Withdraw bid (engineer only)

### Engineers
- `GET /api/engineers` - Search engineers
- `GET /api/engineers/:id` - Get engineer profile

---

## User Workflows

### As an Engineer:
1. Register/Login
2. Browse available projects
3. Filter by location and skills
4. View project details
5. Submit a bid with budget and timeline
6. Track bid status in dashboard
7. Get notified of acceptance

### As a Community:
1. Register/Login
2. Create a project with details
3. Wait for engineer bids
4. Review incoming bids
5. View engineer profiles and qualifications
6. Accept the best bid
7. Project status changes to "In Progress"
8. Mark as completed when done

---

## Getting Started

### Quick Start
```bash
npm start
```

### Access the App
Open your browser: **http://localhost:5101**

### Test Accounts
All passwords: `password123`

**Engineers:**
- john.engineer@example.com
- sarah.maker@example.com

**Communities:**
- greenpark@community.org
- oakridge@community.org

---

## Future Enhancements

- [ ] Image upload for projects and profiles
- [ ] Real-time messaging between users
- [ ] Email notifications
- [ ] Rating and review system
- [ ] Project photo galleries
- [ ] Calendar integration
- [ ] Mobile app
- [ ] Advanced location filtering
- [ ] Payment integration

---

**Ready to build better communities? Start using Wrench today!** 🔧
