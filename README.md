# Plugin Security Scanner 🔒

A React-based security scanner prototype for analyzing plugins and repositories. Built during a 90-minute hackathon session.

## 🚀 Project Overview

This prototype demonstrates a security scanning interface that can:
- Accept plugin uploads (ZIP files)
- Accept repository URLs
- Perform mock security analysis
- Display color-coded results with suggested fixes
- Filter results by severity

## 🛠 Tech Stack

- React + Vite (for rapid development)
- TailwindCSS (styling)
- shadcn/ui (component library)
- JSZip (ZIP file handling)
- Playwright (automation testing)

## 📦 Project Structure

```
src/
  components/   # UI widgets
  pages/        # Page-level components
  hooks/        # Custom React hooks
  utils/        # Mock scan logic
```

## 🏃‍♂️ Development Timeline (90 Minutes)

### Phase 1 (0-15min) - Setup & Scaffolding
- [x] Create React project with Vite
- [x] Install TailwindCSS
- [x] Setup project structure
- [x] Basic App layout

### Phase 2 (15-35min) - Input Handling
- [ ] Upload ZIP component
- [ ] Repository URL input
- [ ] JSZip integration
- [ ] Scan trigger button

### Phase 3 (35-60min) - Mock Scanning & Results
- [ ] Mock scan utility
- [ ] Results table implementation
- [ ] Severity color coding
- [ ] Loading states

### Phase 4 (60-75min) - Polish & UX
- [ ] Severity filters
- [ ] Progress indicators
- [ ] Responsive design
- [ ] Role-based styling

### Phase 5 (75-85min) - Automation Testing
- [ ] Playwright setup
- [ ] Upload flow tests
- [ ] URL input tests
- [ ] Results validation

### Phase 6 (85-90min) - Documentation & Demo
- [ ] README documentation
- [ ] GitHub push
- [ ] Demo preparation

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Run tests:
   ```bash
   npx playwright test
   ```

## 🎯 Demo Flow

1. Upload a ZIP file or enter a repository URL
2. Click "Scan" to initiate analysis
3. View color-coded results table
4. Apply severity filters
5. Check suggested fixes

## ✨ Features

- File upload handling
- Repository URL scanning
- Real-time mock analysis
- Severity-based filtering
- Responsive design
- Automated testing

## 🧪 Testing

The project includes Playwright tests covering:
- File upload workflow
- URL input workflow
- Results rendering
- Filter functionality

## 📝 Notes

This is a prototype built during a 90-minute hackathon. While the security scanning is mocked, the UI and user flow are fully functional to demonstrate the concept.