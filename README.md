# 🌲 WLA Conservation Ambassadors App

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**Empowering Pennsylvania youth to become conservation leaders through gamified learning and real-world action.**

[Features](#-features) • [Quick Start](#-quick-start) • [Deployment](#-deployment) • [Documentation](#-documentation)

</div>

---

## 🎯 About

The WLA Conservation Ambassadors App is a comprehensive youth engagement platform built for the **Wildlife Leadership Academy** in Pennsylvania. It combines modern web technology with gamification, interactive learning, and real-world conservation tracking to inspire the next generation of environmental stewards.

### 🦌 Conservation Tracks

- **Bucktails** - Wildlife management & white-tailed deer conservation
- **Bass** - Warm water fisheries & lake ecology  
- **Brookies** - Cold water streams & brook trout
- **Gobblers** - Wild turkey & upland game birds
- **Ursids** - Black bears & forest ecosystems

---

## ✨ Features

### 🎮 Gamification System
- **Points & Levels** - Earn points for activities, level up as you progress
- **Badges & Achievements** - 14+ badges across multiple categories
- **Streaks** - Build daily engagement streaks with fire emoji motivation
- **Leaderboards** - Team competitions across all PA conservation tracks

### 📚 Learning & Education
- **Interactive Modules** - 9 learning modules covering conservation science, PA history, and wildlife biology
- **Progress Tracking** - Visual progress bars and completion status
- **Category Filters** - Organize learning by History, Science, Biology, Culture, Conservation, Policy, and Skills
- **External Resources** - Curated links to PA Game Commission, Fish & Boat Commission, and DCNR

### 🗺️ Field Tools
- **Interactive Maps** - Mapbox-powered watershed monitoring with custom markers
- **Water Quality Tracking** - Record temperature, pH, flow rate, and field notes
- **Species Identification Keys** - Macro-invertebrates, plants, bugs, and bird songs
- **Habitat Builder** - Design and simulate wildlife habitats
- **Digital Journal** - Photo uploads and field observations

### 💾 Data Management
- **Cloud Exports** - Push data to Google Drive or OneDrive
- **Admin Dashboard** - Automated reports, analytics, and data aggregation
- **Batch Processing** - Katie Export tool for bulk student data analysis
- **Live Dashboards** - Google Sheets and Excel integration

### 🔒 Security & Access
- **OAuth Authentication** - Secure sign-in with Google and Microsoft
- **Role-Based Access Control** - Admin permissions by email and domain
- **Protected Routes** - Middleware authentication for sensitive pages
- **Data Privacy** - Client-side localStorage with cloud backup options

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/WLA_App.git
cd WLA_App

# Install dependencies
npm install

# Set up environment variables
cp .env.template .env.local

# Edit .env.local with your credentials
# See .env.template for all required variables

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app in action!

### 🔑 Required Environment Variables

Minimum setup for local development:

```env
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your-mapbox-token

# For full functionality, also configure:
# - Google OAuth (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
# - Azure AD (AZURE_AD_CLIENT_ID, AZURE_AD_CLIENT_SECRET)
# - Admin access (ADMIN_EMAILS, ADMIN_DOMAINS)
```

See [.env.template](.env.template) for complete configuration options.

---

## 📱 Core Pages

| Page | Description | Points |
|------|-------------|--------|
| `/` | Dashboard with stats, missions, and track selection | - |
| `/learn` | Interactive learning modules with progress tracking | 10-20 per module |
| `/map` | Watershed monitoring with Mapbox integration | 15 per reading |
| `/keys/macro` | Macro-invertebrate identification key | 5 per ID |
| `/habitat` | Species habitat design simulator | 8-10 per simulation |
| `/journal` | Photo journal and field observations | 2-5 per entry |
| `/leaderboard` | Team rankings and competition | - |
| `/exports` | Data export to Google Drive/OneDrive | - |
| `/admin/automations` | Admin dashboard for reports and analytics | - |

---

## 🎨 Design Philosophy

Built with youth engagement principles from:
- **ClassDojo** - Points, streaks, and instant feedback
- **Roblox** - Vibrant colors, emojis, and achievement systems
- **Articulate** - Structured learning paths and progress tracking

### Design Features
- 🎨 Vibrant gradient backgrounds and modern color palette
- 🎯 Clear visual hierarchy with emoji icons
- 📱 Fully responsive for mobile, tablet, and desktop
- ♿ Accessibility-first with keyboard navigation and focus states
- ⚡ Smooth animations and transitions
- 🌈 Glassmorphism effects and card-based layouts

---

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/WLA_App)

```bash
npm i -g vercel
vercel login
vercel --prod
```

### GitHub Actions

Automatic deployments are configured via `.github/workflows/deploy.yml`:

- **Quality checks** on every push
- **Automated deployment** to Vercel on main branch
- **Security scanning** with Trivy
- **Performance audits** with Lighthouse CI

### Other Platforms

- **Netlify** - One-click deploy from dashboard
- **AWS** - S3 + CloudFront (advanced)
- **Docker** - Self-hosted option available

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

---

## 📖 Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Complete deployment guide with OAuth setup
- [.env.template](.env.template) - Environment variable reference
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml) - CI/CD configuration

### OAuth Setup

**Google Drive/Sheets:**
1. Create project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Drive API and Sheets API
3. Create OAuth 2.0 credentials
4. Add redirect URIs for local and production

**Microsoft OneDrive:**
1. Register app in [Azure Portal](https://portal.azure.com/)
2. Add Microsoft Graph permissions
3. Create client secret
4. Configure redirect URIs

**Mapbox:**
1. Sign up at [Mapbox](https://account.mapbox.com/)
2. Copy your public token
3. Add to environment variables

---

## 🔧 Development

### Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** CSS3 with CSS Variables
- **Authentication:** NextAuth.js
- **Maps:** Mapbox GL JS
- **State:** React Context + localStorage
- **Deployment:** Vercel / GitHub Actions

### Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Project Structure

```
WLA_App/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Homepage
│   ├── learn/             # Learning modules
│   ├── map/               # Watershed monitoring
│   ├── leaderboard/       # Team rankings
│   ├── api/               # API routes
│   └── ...
├── ui/                    # Reusable components
│   └── points/            # Points & achievements system
├── styles/                # Global CSS
├── data/                  # JSON templates and samples
├── .github/workflows/     # CI/CD automation
└── public/                # Static assets
```

---

## 🎯 Roadmap

### Planned Features

- [ ] **Quiz System** - Interactive assessments with scoring
- [ ] **Real-time Collaboration** - Team challenges and group activities
- [ ] **Push Notifications** - Daily reminders and achievement alerts
- [ ] **Offline Mode** - Progressive Web App with service workers
- [ ] **Advanced Analytics** - Admin insights dashboard
- [ ] **Social Sharing** - Share achievements on social media
- [ ] **AR Features** - Augmented reality species identification
- [ ] **Voice Journaling** - Audio field notes

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Report Bugs** - Open an issue with reproduction steps
2. **Suggest Features** - Share your ideas for improvements
3. **Submit PRs** - Fix bugs or add features
4. **Improve Docs** - Help us make documentation better
5. **Test** - Try the app and provide feedback

### Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Wildlife Leadership Academy** - For their vision and conservation education leadership
- **PA Game Commission** - For conservation resources and support
- **PA Fish & Boat Commission** - For aquatic education materials
- **DCNR** - For environmental education programs
- **All Contributors** - Students, educators, and developers who make this possible

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/YOUR_USERNAME/WLA_App/issues)
- **Email:** [support@wildlifeleadershipacademy.org](mailto:support@wildlifeleadershipacademy.org)
- **Website:** [wildlifeleadershipacademy.org](https://wildlifeleadershipacademy.org)

---

<div align="center">

**Built with ❤️ for Pennsylvania's future conservation leaders**

🌲 🦌 🐟 🦃 🐻

[⭐ Star us on GitHub](https://github.com/YOUR_USERNAME/WLA_App) if you find this project useful!

</div>
