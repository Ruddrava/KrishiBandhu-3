# KrishiBandhu UI/UX Design - Project Information

## Overview
KrishiBandhu is a farming application designed "For The Farmers, By The Farmers". This is a React-based web application with a modern UI built using TypeScript, Tailwind CSS, and various Radix UI components.

## Current State
✅ **Successfully imported and configured for Replit environment**
- Frontend running on port 5000
- Development server properly configured
- Dependencies installed and working
- Deployment configuration set up

## Recent Changes (September 21, 2025)
- **Vite Configuration**: Updated to work in Replit environment
  - Host set to 0.0.0.0:5000 for proper proxy support
  - allowedHosts: true for iframe compatibility
  - Added TypeScript configuration files (tsconfig.json, tsconfig.node.json)
- **Dependencies**: All packages properly installed
- **Workflow Setup**: Frontend workflow configured and running
- **Deployment Setup**: Configured for autoscale deployment with build and preview scripts
- **Package.json**: Added preview script for production deployment

## Project Architecture

### Tech Stack
- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.3.6 with SWC plugin for fast builds
- **Styling**: Tailwind CSS (v4.1.3) with comprehensive utility classes
- **UI Components**: Radix UI component library for accessible components
- **Database**: Supabase integration for backend services
- **State Management**: React hooks and local state

### Key Dependencies
- **UI Framework**: React + TypeScript + Vite
- **Styling**: Tailwind CSS with modern design system
- **Components**: Comprehensive Radix UI components collection
- **Forms**: React Hook Form for form management
- **Database**: Supabase client for data management
- **Charts**: Recharts for data visualization
- **Navigation**: React Router DOM for routing

### Project Structure
```
/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components (Radix-based)
│   │   ├── figma/          # Figma-specific components
│   │   └── *.tsx           # Feature components
│   ├── utils/
│   │   └── supabase/       # Supabase client configuration
│   ├── styles/
│   │   └── globals.css     # Global styles and Tailwind
│   └── assets/             # Static assets
├── index.html              # Main HTML template
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

### Supabase Configuration
- **Project ID**: vcnalddoypmhvrahsadg
- **Public Key**: Configured in src/utils/supabase/info.tsx
- **Client**: Properly set up for authentication and data management

## User Preferences
- Modern, clean UI design with focus on usability
- Responsive design for mobile and desktop
- Accessible components using Radix UI
- TypeScript for type safety and better development experience

## Development Workflow
1. **Development**: `npm run dev` - Runs Vite development server on port 5000
2. **Build**: `npm run build` - Creates production build
3. **Preview**: `npm run preview` - Serves production build locally

## Deployment
- **Target**: Autoscale deployment (stateless web application)
- **Build Command**: `npm run build`
- **Start Command**: `npm run preview`
- **Port**: 5000 (configured for Replit environment)

## Notes
- TypeScript LSP shows JSX errors but the application runs correctly due to Vite's SWC transform
- Application is properly configured for Replit's proxy environment
- All dependencies are installed and working
- Ready for development and deployment