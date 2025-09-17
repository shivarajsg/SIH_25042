# 🧬 eDNA Explorer

*Interactive, modern dashboard for exploring environmental DNA (eDNA) biodiversity data*  

> ✨ Clean UX, instant feedback, and exportable insights for biodiversity analysis

---

## ✨ Key Features

### 🚀 Performance
- ⚡ Instant analysis - Upload and get insights in seconds  
- 📊 Real-time processing - Live data visualization  
- 🎯 Optimized algorithms - Fast biodiversity calculations  

### 🔬 Science-Ready
- 🧪 eDNA workflows - Built for environmental DNA analysis  
- 📈 Advanced metrics - Comprehensive biodiversity KPIs  
- 🔍 Data validation - Quality checks and error handling  

### 🎨 User Experience
- 💫 Modern UI - Clean, intuitive interface  
- 📱 Responsive design - Works on all devices  
- 🎛️ Interactive dashboards - Customizable views  

### 📤 Export & Share
- 📥 Multiple formats - CSV, JSON, PDF reports  
- 🖼️ Visual exports - High-quality charts and graphs  
- 🔗 Easy sharing - Direct link generation  

---

## 🛠️ Tech Stack

React | TypeScript | Vite | Tailwind CSS | Node.js  

| Category | Technology | Purpose |
|----------|------------|---------|
| 🎨 Frontend | React 18+ | Component-based UI framework |
| 📝 Language | TypeScript 5+ | Type-safe development |
| ⚡ Build Tool | Vite | Fast development & building |
| 🎨 Styling | Tailwind CSS | Utility-first CSS framework |
| 🧩 UI Components | shadcn/ui | Pre-built accessible components |
| 📊 Charts | Custom utilities | Lightweight data visualization |

---

## 🚀 Quick Start

### Prerequisites
- 📦 Node.js 18+ ([Download](https://nodejs.org/))  
- 📦 npm / yarn / pnpm  

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/edna-explorer.git
cd edna-explorer

# Install dependencies
npm install

# Start development server
npm run dev
Open http://localhost:5173 in your browser.

Build for Production
bash
Copy code
# Create production build
npm run build

# Preview production build locally
npm run preview
🌐 Deployment
Option 1: Vercel (Recommended)
Connect repository at vercel.com

Framework Preset: Vite

Build Command: npm run build

Output Directory: dist

Install Command: npm install

Deploy → Live at your project URL

Option 2: Netlify
Connect repository at netlify.com

Build Command: npm run build

Publish Directory: dist

Environment: NODE_VERSION=18

Deploy → Live at your site URL

🗂 Project Structure
pgsql
Copy code
edna-explorer-main/
├─ public/
│  ├─ favicon.ico
│  └─ placeholder.svg
├─ src/
│  ├─ assets/
│  │  └─ hero-edna-analysis.jpg
│  ├─ components/
│  │  ├─ eDNA/
│  │  │  ├─ BiodiversityDashboard.tsx
│  │  │  ├─ DataProcessor.tsx
│  │  │  ├─ ExportResults.tsx
│  │  │  └─ FileUpload.tsx
│  │  └─ ui/          # shadcn/ui components
│  ├─ hooks/
│  │  ├─ use-mobile.tsx
│  │  └─ use-toast.ts
│  ├─ pages/
│  │  ├─ Index.tsx
│  │  └─ NotFound.tsx
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ index.css
├─ .gitignore
├─ package.json
├─ package-lock.json
├─ tsconfig.json
├─ vite.config.ts
├─ tailwind.config.ts
└─ README.md
📝 Usage Guide
Launch the dev server

Open Index.tsx

Use File Upload to add your eDNA dataset (supported formats depend on your FileUpload.tsx)

Data Processor computes key biodiversity metrics

Explore Biodiversity Dashboard (charts, tables, summaries)

Use Export Results to save outputs

Key modules:

src/components/eDNA/FileUpload.tsx: Handles file ingestion

src/components/eDNA/DataProcessor.tsx: Parses and processes dataset

src/components/eDNA/BiodiversityDashboard.tsx: Renders insights and charts

src/components/eDNA/ExportResults.tsx: Exports data/visuals

🎨 Theming and UI
Tailwind CSS manages styles (tailwind.config.ts, src/index.css)

UI primitives in src/components/ui/ (shadcn/ui)

Customize spacing, colors, tokens via Tailwind and component props

🤝 Contributing
Fork repository

Create a feature branch: git checkout -b feature/amazing-feature

Make changes & test: npm run dev

Commit & push: git commit -m 'Add amazing feature' → git push origin feature/amazing-feature

Open a Pull Request with description and screenshots

Guidelines:

Follow existing code style and conventions

Write clear commit messages

Test thoroughly

Update documentation if needed

Report bugs using GitHub Issues
