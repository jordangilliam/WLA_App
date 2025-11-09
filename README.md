# 🌲 WildPraxis

**Next-Generation Conservation Education Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black)]()

> Where Conservation Meets Adventure

WildPraxis is an innovative conservation education platform that gamifies outdoor learning for youth through location-based challenges, AI-powered species identification, and immersive experiences. Built in partnership with the **Wildlife Leadership Academy** (WLA).

---

## 🎯 Mission

Inspire the next generation of conservation leaders through engaging, technology-enhanced outdoor experiences that drive real-world environmental action.

---

## ✨ Features

### 🗺️ **Pokemon GO-Style Location System**
- GPS-based check-ins at parks, trails, and conservation sites
- Geofencing for location-triggered content
- Distance-based bonuses and rare location discoveries
- Route tracking and expedition logging
- 50+ Pennsylvania locations (growing to 500+)

### 🎮 **Advanced Gamification**
- 25-level progression system
- Multi-tier badge system (Bronze → Elite)
- Ambassador titles (Novice → Legend)
- Streak tracking with milestone rewards
- Real-world scholarships and prizes
- Team challenges and competitions
- Leaderboards (global, regional, school)

### 🤖 **AI-Powered Features**
- Real-time species identification (TensorFlow.js)
- AI conservation tutor (local LLM via Ollama)
- Personalized learning recommendations
- Predictive engagement analytics
- Offline-capable AI (runs in browser)

### 🥽 **AR/VR Integration** (Coming Soon)
- WebXR location-based augmented reality
- Virtual field trips to PA ecosystems
- 3D species models and anatomy
- Underwater exploration experiences
- Seasonal ecosystem transformations

### 📱 **Progressive Web App**
- Works offline in remote areas
- Background sync for data collection
- Push notifications for nearby opportunities
- Install as native app (iOS/Android)
- Battery-optimized GPS tracking

### 🏆 **Real-World Rewards**
- Scholarship opportunities ($5,000+)
- Summer internships with conservation agencies
- Workshop and certification access
- Outdoor gear from sponsor partners
- Park passes and experiences

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js 18+ and npm/yarn
PostgreSQL 14+ with PostGIS extension
Git
```

### Installation

```bash
# Clone the repository
git clone https://github.com/jordangilliam/WildPraxis.git
cd WildPraxis

# Install dependencies
npm install

# Set up environment variables
cp env.template .env.local
# Edit .env.local with your configuration

# Set up database
npm run db:setup

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see your local instance.

### Docker Setup (Alternative)

```bash
# Coming soon
docker-compose up
```

---

## 📖 Documentation

- **[Getting Started Guide](./QUICK_START.md)** - Quick setup for developers
- **[API Documentation](./API_DOCS.md)** - API endpoints and usage (coming soon)
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Production deployment
- **[Contributing Guidelines](./CONTRIBUTING.md)** - How to contribute (coming soon)
- **[Business Plan](./WILDPRAXIS_BUSINESS_PLAN.md)** - Vision and strategy

---

## 💼 Business Model

### Open Core Licensing

**WildPraxis uses a dual-licensing model:**

#### **Open Source (MIT License)**
The core platform is **free and open source** under the MIT License:
- All educational content
- Gamification engine
- Location-based features
- Species identification
- Community features
- Self-hosting capability

Perfect for individuals, educators, and small organizations.

#### **Enterprise Edition (Proprietary)**
Advanced features for schools and organizations require a [paid license](./ENTERPRISE_LICENSE.md):
- Multi-tenant administration
- Advanced analytics & reporting  
- White-label branding
- SSO and LMS integration
- Priority support
- Custom feature development

See our **[Pricing Page](./public/pricing.html)** for details.

---

## 🤝 Partnership with Wildlife Leadership Academy

WildPraxis is built in partnership with the **Wildlife Leadership Academy** (WLA), Pennsylvania's premier conservation education program.

**WLA receives**:
- ✅ Unlimited free access (all features)
- ✅ Priority feature development
- ✅ Co-branding opportunities
- ✅ Revenue sharing on referrals

[Learn more about our partnership](./WLA_PARTNERSHIP_AGREEMENT.md)

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Maps**: MapLibre GL JS (open-source)
- **3D/AR**: Three.js, A-Frame, WebXR

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL with PostGIS
- **Cache**: Redis
- **Auth**: NextAuth.js
- **Storage**: Cloud storage (AWS S3/similar)

### AI/ML
- **Computer Vision**: TensorFlow.js (client-side)
- **NLP**: Ollama (local LLM)
- **APIs**: iNaturalist, PlantNet, GBIF

### Infrastructure
- **Hosting**: Vercel (frontend)
- **Backend Services**: AWS/GCP
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry, Posthog

---

## 🗺️ Roadmap

### ✅ Phase 1: Foundation (Complete)
- Core platform architecture
- Educational content system
- Basic gamification
- GPS location system
- Database schema
- Type system and APIs

### 🚧 Phase 2: WLA Launch (In Progress - Q1 2025)
- Deploy for Wildlife Leadership Academy
- Beta testing with students
- Feedback integration
- Case study development

### 📋 Phase 3: Enterprise Features (Q2 2025)
- Multi-tenant architecture
- Admin dashboards
- Advanced analytics
- API access
- Payment integration

### 🎯 Phase 4: Market Entry (Q3 2025)
- First paying customers
- Sales materials
- Conference presentations
- Marketing website

### 🚀 Phase 5: Scale (Q4 2025+)
- AR/VR experiences
- National expansion
- Mobile apps (native)
- Advanced AI features
- International localization

[View detailed roadmap](./NEXT_GENERATION_PLATFORM_ROADMAP.md)

---

## 📊 Impact

### Target Metrics (Year 1)
- **5,000+** active students
- **50,000+** location check-ins
- **25,000+** species observations
- **15,000+** learning modules completed
- **All 121** PA State Parks visited

### Educational Outcomes
- **+30%** increase in conservation knowledge
- **+50%** increase in outdoor activity
- **+25%** increase in conservation career interest
- **+40%** increase in environmental awareness

---

## 🤲 Contributing

We welcome contributions from the community! Whether you're a developer, educator, conservationist, or student, there are many ways to help.

### Ways to Contribute
- 🐛 Report bugs and issues
- 💡 Suggest new features
- 📝 Improve documentation
- 🎨 Design UI/UX improvements
- 🧪 Write tests
- 🌍 Add location data
- 📚 Create educational content
- 🌐 Translate to other languages

### Development Setup
See our [Contributing Guidelines](./CONTRIBUTING.md) (coming soon) for detailed instructions.

---

## 📜 License

This project uses a **dual licensing model**:

### Open Source Core
The core WildPraxis platform is licensed under the **MIT License**. See [LICENSE](./LICENSE) for details.

### Enterprise Features  
Enterprise features are proprietary and require a commercial license. See [ENTERPRISE_LICENSE.md](./ENTERPRISE_LICENSE.md) for details.

### Summary
- ✅ Free to use, modify, and self-host the core platform
- ✅ Open source contributions welcome
- ✅ Enterprise features available for purchase
- ✅ WLA partnership includes full access

---

## 🙏 Acknowledgments

### Built With Love By
- **Jordan Gilliam** - Founder & Developer

### In Partnership With
- **Wildlife Leadership Academy** - Conservation education expertise
- **Ned Smith Center for Nature & Art** - Content and artwork

### Powered By
- Pennsylvania Department of Conservation & Natural Resources (DCNR)
- PA Fish & Boat Commission (PFBC)
- PA Game Commission (PGC)
- Open source community

### Special Thanks
- All contributors and testers
- Conservation educators providing feedback
- Students using the platform
- Open source projects we build upon

---

## 📞 Contact

### For General Inquiries
- **Email**: info@wildpraxis.org
- **GitHub**: [github.com/jordangilliam/WildPraxis](https://github.com/jordangilliam/WildPraxis)

### For Enterprise/Schools
- **Email**: enterprise@wildpraxis.org
- **Demo Request**: [Schedule a demo](mailto:enterprise@wildpraxis.org?subject=Demo%20Request)

### For Partnerships
- **Email**: partners@wildpraxis.org

### For Support
- **Email**: support@wildpraxis.org
- **Issues**: [GitHub Issues](https://github.com/jordangilliam/WildPraxis/issues)

---

## 🌟 Star Us!

If you find WildPraxis useful, please consider giving us a star on GitHub! It helps us reach more people and grow the community.

[![GitHub Stars](https://img.shields.io/github/stars/jordangilliam/WildPraxis?style=social)](https://github.com/jordangilliam/WildPraxis)

---

## 📱 Stay Connected

- **Website**: wildpraxis.org (coming soon)
- **Twitter**: @wildpraxis (coming soon)
- **LinkedIn**: /company/wildpraxis (coming soon)
- **Newsletter**: [Subscribe](https://wildpraxis.org/newsletter) (coming soon)

---

**Built with 💚 for conservation education**

*WildPraxis • Where Conservation Meets Adventure • Est. 2024*
#   F o r c e   V e r c e l   d e p l o y m e n t  
 D e p l o y   t r i g g e r  
 #   F o r c e   r e d e p l o y  
 