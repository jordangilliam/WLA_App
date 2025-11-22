# 🌲 WildPraxis - Youth Conservation Education Platform

> **The most engaging conservation app for Gen Alpha students**

WildPraxis (WLA_App) is a mobile-first Progressive Web App designed to engage middle school students in environmental conservation through gamification, social learning, and real-world field experiences.

Built for the Wildlife Leadership Academy and optimized for iPad library deployments across Pennsylvania.

---

## ✨ **Features**

### 🎮 **Engagement & Gamification**
- **Celebration Animations** - Full-screen confetti for achievements, level-ups, first check-ins
- **Sound Effects & Haptics** - Multi-sensory feedback for every action
- **Points & Levels** - Earn XP, level up, unlock rewards
- **Streaks** - Build daily engagement habits
- **Achievements** - 50+ badges to collect

### 📦 **Collections (Pokemon-Style)**
- **Field Sites** - Collect all 140+ locations across PA
- **Species Cards** - 3D flip animation trading cards for 150+ PA wildlife
- **Rarity System** - Common → Uncommon → Rare → Epic → Legendary
- **Progress Tracking** - Visual collection completion

### 🎯 **Challenges**
- **Daily Challenges** - Quick 5-10 min tasks
- **Weekly Challenges** - Longer-term goals
- **Team Challenges** - Collective class goals with shared rewards
- **Photo Challenges** - Scavenger hunts with teacher approval

### 🏆 **Competition & Social**
- **Class Leaderboards** - Weekly rankings across classes
- **Real-Time Feed** - See classmates' recent activities
- **Top Contributors** - Recognize active students
- **Class-Only Social** - Safe, moderated environment

### 📍 **Field Work**
- **Interactive Map** - 140+ field sites with Mapbox
- **Check-In System** - Geofenced location verification
- **Observation Journal** - Document species, weather, notes
- **Photo Documentation** - Capture and share field observations
- **Offline Mode** - Work without internet, sync later

### 🗺️ **140+ Pennsylvania Field Sites**
- **Pittsburgh Area** - 64 sites (parks, libraries, universities)
- **Statewide Coverage** - State College, Harrisburg, Philadelphia, Coatesville, East Stroudsburg
- **Trout Waters** - 16 stocked streams and lakes with schedules
- **State Parks** - Ricketts Glen, Worlds End, Cherry Springs, Presque Isle, Pine Creek Gorge

### 🎣 **Fly Fishing Features**
- **Expert Knowledge System** - Techniques and patterns from Joe Humphreys and George Daniel
- **Macroinvertebrate Hatch Data** - Comprehensive hatch information for 254+ waterways
- **Seasonal Waterway Data** - Best seasons, water temperatures, and fishing notes
- **60+ Fly Fishing Shops** - Complete database of PA fly shops with services and locations
- **Expert Techniques** - High-stick nymphing, French nymphing, Leisenring lift, and more
- **Expert Patterns** - Proven fly patterns from legendary anglers

### 🐟 **PFBC Data Integration**
- **Stocking Schedules** - Complete PFBC trout and species stocking data
- **Access Points** - Boat launches, shore access, and wade access locations
- **Fishing Regulations** - Catch & release, delayed harvest, trophy trout sections
- **Habitat Installations** - Lunker structures, fish attractors, and habitat enhancements
- **Mapping Layers** - Class A trout streams, wild trout, bass waters, and species designations
- **254 Waterways** - Comprehensive waterway database with full PFBC integration

### 👩‍🏫 **Teacher Tools**
- **Live Monitoring** - Real-time student activity feed
- **Field Trip Mode** - Coordinate group outdoor experiences
- **Approval Workflow** - Review and approve student submissions
- **Class Management** - Create classes, add students, track progress
- **Reports & Exports** - CSV downloads, analytics

### 📱 **iPad Optimization**
- **Touch Targets** - 60px minimum (WCAG AA)
- **Landscape Mode** - Adaptive layouts
- **Split-Screen Support** - Works in multitasking
- **Multi-User** - Quick PIN switching for shared devices
- **Offline-First** - IndexedDB queue for remote locations

---

## 🚀 **Tech Stack**

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Mapbox GL** - Interactive maps
- **React Confetti** - Celebration animations
- **IDB** - IndexedDB wrapper for offline storage

### **Backend**
- **Supabase** - PostgreSQL database, Auth, Edge Functions
- **PostGIS** - Geospatial queries
- **Row Level Security** - Fine-grained access control
- **NextAuth.js** - Authentication

### **Deployment**
- **Vercel / Netlify** - Web hosting
- **PWA** - Progressive Web App (installable)
- **Capacitor** - Future native iOS/Android builds

---

## 📦 **Installation**

### **Prerequisites**
- Node.js 18+ (or portable Node for Windows)
- npm or yarn
- Supabase account
- Mapbox account (free tier)

### **Setup**

1. **Clone Repository**
```bash
git clone https://github.com/jordangilliam/WLA_App.git
cd WLA_App
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Variables**

Create `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NextAuth
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token

# App
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=development
```

4. **Run Database Migrations**

See `MIGRATION_ORDER.md` for detailed instructions.

Run migrations 003-006, 012-015, 027-030 in Supabase SQL Editor.

**New Migrations (027-030):**
- **027**: Seasonal waterway data and macroinvertebrate hatch information
- **028**: Fly fishing experts (Joe Humphreys, George Daniel), techniques, patterns, and shops
- **029**: PFBC mapping layers (trout streams, bass waters, species designations)
- **030**: Complete PFBC integration (stocking, access points, regulations, habitat)

See `docs/MIGRATIONS_027_030.md` for detailed migration guide.

5. **Start Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000`

> **New laptop?** Follow the full onboarding steps in `SETUP_CHECKLIST.md`, then run `npm run verify:env` to confirm Supabase, Stripe, Mapbox, NextAuth, and FieldQuest secrets are present.

---

## 📚 **Documentation**

### Core Documentation
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Step-by-step deployment guide
- **[Migration Order](MIGRATION_ORDER.md)** - Database setup instructions
- **[3-Week Sprint Progress](3-WEEK-SPRINT-PROGRESS.md)** - Development timeline
- **[API Audit Report](API_AUDIT_REPORT.md)** - API security review
- **[Setup Checklist](SETUP_CHECKLIST.md)** - Cross-device onboarding + environment verification
- **[Payments Test Plan](PAYMENTS_TEST_PLAN.md)** - Stripe CLI flow + export validation
- **[AI Identification Guide](AI_IDENTIFICATION_GUIDE.md)** - Provider setup + teacher review workflow
- **[Soundscapes Playbook](SOUNDSCAPES_PLAYBOOK.md)** - Purdue export workflow + fallback repo
- **[QA & Deployment Playbook](QA_DEPLOY_PLAYBOOK.md)** - Release checklist

### API & Technical Documentation
- **[API Documentation](API_DOCUMENTATION.md)** - Complete API endpoint reference
- **[Migration Guide 027-030](docs/MIGRATIONS_027_030.md)** - Fly fishing and PFBC migration guide
- **[Architecture Documentation](ARCHITECTURE.md)** - System architecture and design

### User Guides
- **[Fly Fishing Guide](docs/FLY_FISHING_GUIDE.md)** - How to use fly fishing features
- **[PFBC Data Guide](docs/PFBC_DATA_GUIDE.md)** - How to access PFBC data
- **[Expert Knowledge Guide](docs/EXPERT_KNOWLEDGE_GUIDE.md)** - Using expert techniques and patterns

### Tools & Monitoring
- **Env Verification Script:** `npm run verify:env`
- **Health Check Endpoint:** `GET /api/health` (returns Supabase + NextAuth status for monitoring)

---

## 🎯 **Target Audience**

### **Primary Users**
- **Students** - Middle school (ages 11-14)
- **Teachers** - Science, biology, environmental ed
- **Libraries** - iPad lending programs

### **Use Cases**
- Classroom learning
- Field trips
- After-school programs
- Library educational programs
- Home learning

---

## 🏫 **Deployment Scenarios**

### **School Deployment**
- Teacher creates classes
- Students join with class code
- Class-based leaderboards and team challenges
- Teacher monitors and approves submissions

### **Library Deployment**
- Multi-user iPad setup
- PIN-based quick login
- Offline-first for borrowing
- No account required for browsing

### **Field Trip Mode**
- Teacher creates trip with goals
- Students check in at location
- Real-time progress tracking
- Collective challenges
- Trip report generation

---

## 🔒 **Privacy & Safety**

- **Class-Only Social** - No public profiles or posts
- **Teacher Moderation** - All submissions require approval
- **COPPA Compliant** - Parental consent for under-13
- **Data Privacy** - Student data never sold or shared
- **Location Privacy** - Coarse location outside check-ins

---

## 🧪 **Testing**

```bash
# Run linter
npm run lint

# Run type check
npm run type-check

# Build for production
npm run build

# Start production server
npm start
```

---

## 📈 **Roadmap**

### **Phase 1 (Complete)** ✅
- Core check-in and observation features
- Pokemon-style collections
- Daily/weekly challenges
- Class leaderboards

### **Phase 2 (Complete)** ✅
- Species trading cards
- Photo challenges
- iPad optimizations
- Offline mode

### **Phase 3 (Complete)** ✅
- Teacher live monitoring
- Field trip mode
- Multi-user support
- Team challenges

### **Phase 4 (Future)**
- Native iOS/Android apps (Capacitor)
- AR wildlife encounters
- Video submissions
- Parent dashboard
- District analytics

---

## 🤝 **Contributing**

Built for Wildlife Leadership Academy by String Theory Solutions.

For feature requests or bug reports, contact: stringtheorysolutionsllc@gmail.com

---

## 📄 **License**

© 2025 Wildlife Leadership Academy. All rights reserved.

---

## 🙏 **Acknowledgments**

- **Wildlife Leadership Academy** - 20 years of conservation officer education
- **Dr. Sara Mueller** - Educational partnerships
- **PA Game Commission** - Conservation content
- **PA Fish & Boat Commission** - Trout stocking data
- **DCNR & PA Outdoor Corps** - Field site partnerships

---

## 📞 **Support**

- **Email**: stringtheorysolutionsllc@gmail.com
- **GitHub**: https://github.com/jordangilliam/WLA_App
- **Website**: wildlifeleadershipacademy.org

---

**Built with ❤️ for the next generation of conservation leaders**

🌲 Protect. Conserve. Inspire. 🦋
