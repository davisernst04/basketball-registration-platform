# Shadow Basketball - Tryout Registration Platform

A youth basketball team registration platform for Shadow Basketball, featuring a red and black themed design. This application allows parents to register their children for tryouts and provides coaches with administrative tools to manage tryout sessions and view registrations.

## Features

### For Parents
- **Beautiful Landing Page**: Shadow Basketball branded landing page with team colors (red and black)
- **Tryout Schedule**: View all available tryout sessions with dates, times, and locations
- **Easy Registration**: Simple form to register children for tryouts including:
  - Parent/guardian information
  - Player information (name, age, grade)
  - Medical information
  - Emergency contact details
  - Tryout session selection

### For Coaches (Admin)
- **Admin Dashboard**: Comprehensive dashboard to manage all aspects of tryouts
- **View Registrations**: See all player registrations with complete details
- **Manage Tryout Sessions**: View all scheduled tryout sessions with registration counts
- **Create New Tryouts**: Add new tryout sessions with:
  - Age group categorization
  - Date and time slots
  - Location details
  - Maximum capacity limits
  - Additional notes
- **Search Functionality**: Filter registrations by player or parent name/email

## Tech Stack

- **Frontend**: Next.js 16 with React 19
- **UI Components**: shadcn/ui with Tailwind CSS 4
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth
- **Theme**: Custom red and black color scheme

## Getting Started

### Prerequisites
- Node.js (v20 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd basketball-registration-platform
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory:
```
DATABASE_URL="your-postgresql-connection-string"
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
```

4. Push the database schema
```bash
npx prisma db push
```

5. Seed the database with sample tryout sessions
```bash
npx tsx prisma/seed.ts
```

6. Run the development server
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Pages

- **/** - Landing page with team branding and quick access
- **/register** - Registration form for parents
- **/tryouts** - Public tryout schedule
- **/dashboard** - Admin dashboard for coaches
- **/sign-in** - Authentication for coaches
- **/sign-up** - Registration for coach accounts

## Database Schema

### User
- Authentication and user management
- Role-based access (parent/coach)

### Tryout
- Tryout session information
- Location, date, time details
- Age group categorization
- Capacity management

### Registration
- Player registration data
- Parent contact information
- Medical and emergency contact details
- Links to specific tryout sessions

## Customization

### Theme Colors
The application uses a red and black color scheme matching Shadow Basketball's branding. Colors are defined in `app/globals.css` using CSS custom properties.

### Team Branding
Update the team name and branding in:
- `app/page.tsx` - Landing page
- `app/layout.tsx` - Page metadata
- Headers across all pages

## Development

### Build for Production
```bash
npm run build
npm start
```

### Run Database Migrations
```bash
npx prisma migrate dev
```

### Generate Prisma Client
```bash
npx prisma generate
```

## Support

For issues or questions, please contact the Shadow Basketball administration.

---

**Shadow Basketball** - *Rise From The Shadows*
