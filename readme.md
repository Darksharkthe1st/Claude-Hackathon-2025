# Community DIY Connect

A platform connecting passionate DIY engineer dads with community projects that need their skills. Help your community while doing what you love!

## Overview

Community DIY Connect bridges the gap between skilled DIY engineers looking for meaningful projects and communities needing essential engineering work completed. Whether it's building playground equipment, accessibility ramps, community gardens, or other infrastructure improvements, this platform makes it easy to connect, collaborate, and create positive change.

## Features

### For DIY Engineers
- Browse community projects by location, skills, and category
- Submit bids with proposed budget and timeline
- Track your bids and project involvement
- Build a profile showcasing your skills and experience
- Make a real difference in your community

### For Communities
- Post projects with detailed descriptions and requirements
- Review and manage bids from qualified engineers
- Track project status from open to completion
- Connect with skilled volunteers in your area
- Get essential projects completed

### Key Functionality
- User authentication with JWT tokens
- Role-based access (Engineer vs Community)
- Project creation and management
- Bidding system for engineers
- Real-time project status tracking
- Search and filter capabilities
- Responsive design for mobile and desktop

## Tech Stack

### Backend
- **Node.js** with Express.js framework
- **SQLite3** database with better-sqlite3
- **JWT** for authentication
- **bcrypt** for password hashing
- RESTful API architecture

### Frontend
- Vanilla JavaScript (no framework dependencies)
- Modern CSS with CSS Grid and Flexbox
- Responsive design
- Single-page application architecture

## Project Structure

```
Community-DIY-Connect/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration and schema
│   ├── models/
│   │   ├── User.js              # User model and operations
│   │   ├── Project.js           # Project model and operations
│   │   └── Bid.js               # Bid model and operations
│   ├── middleware/
│   │   ├── auth.js              # Authentication middleware
│   │   └── validation.js        # Request validation
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── projects.js          # Project CRUD endpoints
│   │   ├── bids.js              # Bidding endpoints
│   │   └── engineers.js         # Engineer search endpoints
│   ├── scripts/
│   │   └── initDb.js            # Database initialization script
│   └── server.js                # Main application server
├── public/
│   ├── index.html               # Main HTML file
│   ├── styles.css               # Application styles
│   └── app.js                   # Frontend JavaScript
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   cd Community-DIY-Connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env

   # Edit .env and set your values
   # At minimum, change JWT_SECRET to a secure random string
   ```

4. **Initialize the database**
   ```bash
   npm run init-db
   ```

   This will create the database schema and populate it with sample data including test accounts.

5. **Start the server**
   ```bash
   # Production mode
   npm start

   # Development mode (with auto-reload)
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Sample Accounts

After running `npm run init-db`, you can use these test accounts:

### Engineers
- **Email:** john.engineer@example.com
  **Password:** password123

- **Email:** sarah.maker@example.com
  **Password:** password123

### Communities
- **Email:** greenpark@community.org
  **Password:** password123

- **Email:** oakridge@community.org
  **Password:** password123

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user (engineer or community)

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "userType": "engineer",
  "phone": "555-0100",
  "location": "Portland, OR",
  "bio": "Experienced DIY engineer...",
  "skills": "Carpentry, Plumbing, Electrical"
}
```

#### POST /api/auth/login
Login and receive JWT token

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Get current user profile (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

#### PUT /api/auth/profile
Update user profile (requires authentication)

### Project Endpoints

#### GET /api/projects
Get all projects with optional filters

**Query Parameters:**
- `status` - Filter by status (open, in_progress, completed)
- `category` - Filter by category
- `location` - Search by location
- `skills` - Search by required skills

#### GET /api/projects/:id
Get single project details

#### POST /api/projects
Create new project (community only, requires authentication)

**Body:**
```json
{
  "title": "Community Garden Raised Beds",
  "description": "Build 10 raised garden beds...",
  "category": "Construction",
  "location": "Portland, OR",
  "requiredSkills": "Carpentry",
  "budgetMin": 0,
  "budgetMax": 500,
  "timeline": "2 weekends"
}
```

#### PUT /api/projects/:id
Update project (owner only)

#### DELETE /api/projects/:id
Delete project (owner only)

### Bid Endpoints

#### GET /api/bids/project/:projectId
Get all bids for a project (project owner only)

#### GET /api/bids/my/bids
Get all bids by current user (engineer only)

#### POST /api/bids
Submit a bid (engineer only)

**Body:**
```json
{
  "projectId": "uuid",
  "proposedBudget": 400,
  "proposedTimeline": "2 weekends",
  "message": "I'd love to help with this project..."
}
```

#### PATCH /api/bids/:id/status
Accept or reject a bid (community only)

**Body:**
```json
{
  "status": "accepted"
}
```

### Engineer Endpoints

#### GET /api/engineers
Search engineers

**Query Parameters:**
- `location` - Filter by location
- `skills` - Filter by skills

#### GET /api/engineers/:id
Get engineer profile

## Database Schema

### Users Table
- `id` - UUID primary key
- `email` - Unique email address
- `password` - Hashed password
- `name` - User/organization name
- `user_type` - 'engineer' or 'community'
- `phone` - Contact phone
- `location` - City, State
- `bio` - About text
- `skills` - Comma-separated skills (for engineers)
- `created_at` - Timestamp

### Projects Table
- `id` - UUID primary key
- `community_id` - Foreign key to users
- `title` - Project title
- `description` - Detailed description
- `category` - Project category
- `required_skills` - Needed skills
- `location` - Project location
- `budget_min` - Minimum budget
- `budget_max` - Maximum budget
- `timeline` - Expected timeline
- `status` - open, in_progress, completed, cancelled
- `created_at` - Timestamp

### Bids Table
- `id` - UUID primary key
- `project_id` - Foreign key to projects
- `engineer_id` - Foreign key to users
- `proposed_budget` - Engineer's proposed budget
- `proposed_timeline` - Engineer's proposed timeline
- `message` - Optional message
- `status` - pending, accepted, rejected
- `created_at` - Timestamp

## Development

### Adding New Features

1. **Backend Changes:**
   - Add/modify models in `src/models/`
   - Create/update routes in `src/routes/`
   - Update database schema in `src/config/database.js`

2. **Frontend Changes:**
   - Update HTML structure in `public/index.html`
   - Add styles in `public/styles.css`
   - Implement functionality in `public/app.js`

### Running in Development Mode

```bash
npm run dev
```

This uses nodemon to automatically restart the server when you make changes.

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- SQL injection prevention with parameterized queries
- XSS prevention with HTML escaping
- CORS enabled for API access
- Input validation on all endpoints

## Future Enhancements

- [ ] Image upload for projects and profiles
- [ ] Real-time messaging between users
- [ ] Email notifications for bids and updates
- [ ] Rating and review system
- [ ] Project photo galleries
- [ ] Calendar integration for scheduling
- [ ] Mobile app (React Native)
- [ ] Advanced search with radius-based location filtering
- [ ] Project categories with custom fields
- [ ] Payment integration for budgets

## Contributing

Contributions are welcome! This project is designed to help communities, and we'd love your help making it better.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your community!

## Support

For questions or issues:
- Open an issue on GitHub
- Check existing documentation
- Review the API endpoints above

## Acknowledgments

Built with the goal of connecting passionate DIY engineers with communities in need. Every project completed through this platform makes life better for everyone.

---

**Let's build better communities together!**