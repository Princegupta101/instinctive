# SecureSight - CCTV Monitoring Dashboard

A comprehensive CCTV monitoring dashboard that displays real-time security incidents with the ability to view footage and manage incident resolution.

## Features

- **Real-time Incident Monitoring**: View active security incidents from multiple camera feeds
- **Incident Player**: Large video player with controls and camera thumbnails
- **Incident Management**: Resolve incidents with optimistic UI updates
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Modern dark UI optimized for security operations

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd instinctive
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Create database and apply schema
npm run db:push

# Seed the database with sample data
npm run db:seed
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Camera Model
- `id`: Unique identifier
- `name`: Camera name (e.g., "Shop Floor A")
- `location`: Physical location description

### Incident Model
- `id`: Unique identifier
- `cameraId`: Foreign key to Camera
- `type`: Incident type ("Unauthorized Access", "Gun Threat", "Face Recognized", "Suspicious Activity")
- `tsStart`: Incident start timestamp
- `tsEnd`: Incident end timestamp
- `thumbnailUrl`: Path to incident thumbnail
- `resolved`: Boolean flag for resolution status

## API Endpoints

### GET /api/incidents?resolved=false
Returns newest-first list of incidents. Filter by resolution status.

**Query Parameters:**
- `resolved`: "true" | "false" (optional)

### PATCH /api/incidents/:id/resolve
Toggles the resolved status of an incident.

### GET /api/cameras
Returns list of all cameras.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables:
   ```
   DATABASE_URL="file:./dev.db"
   ```
4. Deploy

### Railway

1. Install Railway CLI
2. Login and create new project:
   ```bash
   railway login
   railway new
   ```
3. Add environment variables
4. Deploy:
   ```bash
   railway up
   ```

### Docker

1. Build the image:
   ```bash
   docker build -t securesight .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 securesight
   ```

## Tech Decisions

### Database: SQLite + Prisma
- **SQLite**: Lightweight, file-based database perfect for prototyping and small-scale deployments
- **Prisma**: Type-safe ORM with excellent TypeScript integration and migration system

### Frontend: Next.js 15 App Router
- **App Router**: Modern React patterns with built-in loading states and error boundaries
- **Server Components**: Better performance for data fetching
- **API Routes**: Simplified backend with the frontend

### Styling: Tailwind CSS
- **Utility-first**: Rapid prototyping and consistent design system
- **Dark theme**: Optimized for security operations with reduced eye strain
- **Responsive**: Mobile-first approach with responsive grid layouts

### State Management: React Hooks
- **useState**: Local component state for UI interactions
- **Optimistic Updates**: Immediate UI feedback before server confirmation
- **No external state library**: Keeps the bundle small for this scope

## If I Had More Time...

### Performance Optimizations
- [ ] Implement React Query for better caching and background updates
- [ ] Add WebSocket connection for real-time incident updates
- [ ] Implement virtual scrolling for large incident lists
- [ ] Add image optimization and lazy loading

### Enhanced Features
- [ ] **Interactive Timeline**: 24-hour ruler with incident markers and scrubber
- [ ] **Advanced Filtering**: Filter by incident type, camera, date range
- [ ] **Bulk Actions**: Select and resolve multiple incidents
- [ ] **Incident Details Modal**: Expanded view with full incident information
- [ ] **User Authentication**: Role-based access control
- [ ] **Audit Logs**: Track all user actions and system events

### Infrastructure
- [ ] **PostgreSQL Migration**: Move to production-grade database
- [ ] **Redis Caching**: Cache frequently accessed data
- [ ] **CDN Integration**: Optimize static asset delivery
- [ ] **Monitoring**: Add error tracking and performance monitoring
- [ ] **Testing**: Unit tests, integration tests, and E2E tests

### UX Improvements
- [ ] **Keyboard Shortcuts**: Quick navigation and actions
- [ ] **Drag & Drop**: Reorder incident priority
- [ ] **Export Features**: PDF reports and CSV exports
- [ ] **Mobile App**: Native mobile application
- [ ] **Notifications**: Browser push notifications for critical incidents

### AI/ML Integration
- [ ] **Smart Filtering**: AI-powered incident classification
- [ ] **Predictive Analytics**: Incident pattern detection
- [ ] **Auto-Resolution**: Automatic resolution of false positives
- [ ] **Risk Scoring**: AI-based threat level assessment

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── cameras/
│   │   └── incidents/
│   ├── globals.css
│   ├── layout.js
│   └── page.tsx
├── components/
│   ├── IncidentList.tsx
│   ├── IncidentPlayer.tsx
│   └── Navbar.tsx
├── lib/
│   └── prisma.ts
└── types/
    └── index.ts

prisma/
├── schema.prisma
└── seed.ts

public/
├── thumbnails/
└── videos/
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License.
