# Medicine Reminder App - GitHub Copilot Instructions

## Project Overview
This is a Medicine Reminder web application built with Next.js 14, TypeScript, Tailwind CSS, and Firebase. The app helps users manage their medicines with AI assistance, timely notifications, and emergency SOS features.

## Key Technologies
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Firebase (Firestore, Auth, Cloud Messaging)
- **AI**: OpenAI GPT API with rule-based fallback
- **PWA**: Service Workers, Web Push API
- **Icons**: Lucide React

## Project Structure
```
src/
├── app/                 # Next.js app directory (App Router)
├── components/          # Reusable React components
├── lib/                # Utility functions and services
├── types/              # TypeScript type definitions
├── styles/             # Global CSS and Tailwind config
└── hooks/              # Custom React hooks
```

## Coding Guidelines

### TypeScript
- Use strict TypeScript with proper type definitions
- Define interfaces for all data structures in `src/types/`
- Use generic types where appropriate
- Prefer type assertions over `any`

### React Components
- Use functional components with hooks
- Implement proper error boundaries for critical components
- Use `'use client'` directive for components that need browser APIs
- Follow the composition pattern for reusable components

### Styling
- Use Tailwind CSS for all styling
- Follow the custom design system defined in `tailwind.config.js`
- Use semantic color classes (primary, medical, emergency)
- Implement responsive design with mobile-first approach

### Firebase Integration
- Use the Firebase v9 modular SDK
- Implement proper error handling for all Firebase operations
- Use TypeScript interfaces for Firestore documents
- Follow security rules for data access

### State Management
- Use React's built-in state management (useState, useContext)
- Implement custom hooks for complex state logic
- Use React Query for server state management if needed

### Performance
- Implement code splitting and lazy loading
- Optimize images and icons
- Use Next.js Image component for better performance
- Implement proper caching strategies

## File Naming Conventions
- Components: PascalCase (e.g., `MedicineCard.tsx`)
- Hooks: camelCase with "use" prefix (e.g., `useMedicineData.ts`)
- Utilities: camelCase (e.g., `dateHelpers.ts`)
- Types: PascalCase interfaces (e.g., `Medicine`, `User`)

## Component Structure
```tsx
'use client' // If using browser APIs

import { useState } from 'react'
import { SomeIcon } from 'lucide-react'

interface ComponentProps {
  // Define props with proper types
}

export default function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Component logic
  
  return (
    <div className="tailwind-classes">
      {/* JSX content */}
    </div>
  )
}
```

## Common Patterns

### Medicine Management
- Always validate medicine data before saving
- Implement proper date handling for expiry dates
- Use consistent time zones for reminders
- Validate dosage formats and frequencies

### Notifications
- Check permission status before sending notifications
- Implement graceful fallbacks for unsupported browsers
- Use service workers for background notifications
- Handle notification click events properly

### Emergency Features
- Implement location services with user consent
- Provide clear confirmation dialogs for emergency actions
- Handle network failures gracefully
- Store emergency contacts securely

### AI Integration
- Implement rule-based fallbacks for OpenAI API failures
- Sanitize user inputs before sending to AI
- Parse AI responses safely
- Provide clear error messages for AI failures

## Security Considerations
- Validate all user inputs
- Use Firebase Security Rules for data protection
- Implement proper authentication flows
- Store sensitive data securely
- Follow HIPAA compliance guidelines where applicable

## Testing Guidelines
- Write unit tests for utility functions
- Test components with React Testing Library
- Mock Firebase services in tests
- Test notification functionality
- Validate accessibility features

## Documentation
- Comment complex algorithms and business logic
- Document component props with JSDoc
- Maintain up-to-date README
- Document Firebase security rules
- Keep API documentation current

## Performance Monitoring
- Monitor Core Web Vitals
- Track notification delivery rates
- Monitor AI response times
- Track user engagement metrics
- Monitor error rates and failures

## Accessibility
- Implement proper ARIA labels
- Ensure keyboard navigation works
- Use semantic HTML elements
- Provide alternative text for images
- Test with screen readers
- Maintain proper color contrast ratios

## Mobile Considerations
- Implement touch-friendly interfaces
- Test on various screen sizes
- Optimize for mobile data usage
- Implement proper PWA features
- Test offline functionality

When implementing features:
1. Start with TypeScript interfaces for data structures
2. Create reusable components following the design system
3. Implement proper error handling and loading states
4. Add proper accessibility features
5. Test on mobile devices
6. Ensure offline capabilities where possible
7. Follow security best practices