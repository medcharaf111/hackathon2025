# EDUPLANET (HACAKTHON2025)

EDUPLANET is a monorepo project developed for a hackathon (2nd position winner), aiming to transform education for sustainable development. The platform provides online courses, international mobility opportunities, a collaborative forum, and educational quizzes, all focused on building a more sustainable, equitable, and peaceful future. The project leverages modern web technologies to deliver a scalable, multilingual, and community-driven experience.

## 🌍 Project Mission
Our platform is dedicated to:
- Promoting education for sustainable development at all levels
- Strengthening the capacities of educators and trainers
- Facilitating the sharing of knowledge and best practices
- Encouraging research and innovation in sustainable education
- Supporting policies and programs that integrate sustainability principles

## 🏗️ Monorepo Structure
- `app/` — Next.js frontend (main web platform)
- `hackathon-backend/` — Node.js/Express backend (API, database models)
- `components/`, `hooks/`, `lib/`, `context/` — Shared React components, hooks, and utilities
- `sustainable-platform/` — Additional React platform (legacy or experimental)
- `public/` — Static assets (images, etc.)
- `styles/` — Tailwind and global CSS
- `types/` — Shared TypeScript types

## 🚀 Features
- **Multilingual**: French and English support
- **Courses**: Online learning modules on climate, biodiversity, circular economy, and more
- **Mobility**: International exchange, internship, and volunteering programs
- **Forum**: Community discussions and collaborative projects
- **Quizzes**: Educational quizzes to test and reinforce knowledge
- **Admin/Backend**: Program management, user authentication, and more

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (recommended for monorepo management)

### Install dependencies
```bash
pnpm install
```

### Run the frontend (Next.js)
```bash
pnpm dev
```

### Run the backend
```bash
cd hackathon-backend
pnpm install
pnpm dev
```

## 🤝 Contributing
We welcome contributions! Please open issues or pull requests for improvements, bug fixes, or new features.

## 📄 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

*EDUPLANET — Education for a Sustainable Future*
