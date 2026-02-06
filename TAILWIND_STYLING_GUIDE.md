# Tailwind CSS Dashboard Styling Guide

## Overview
This document outlines the comprehensive Tailwind CSS styling applied to the Team Tasks Dashboard. The design uses a modern, professional aesthetic with consistent color schemes, smooth transitions, and responsive layouts.

---

## 1. Core Setup

### Tailwind Configuration
- **Version**: Tailwind CSS 4.1.18 with `@tailwindcss/vite` plugin
- **File**: `src/index.css`
- **Features**:
  - Custom color theme with CSS variables
  - Dark mode support
  - Custom component utilities via `@layer`
  - Animation definitions

### Color Palette
- **Primary**: Blue (#2563eb) - Used for actions, highlights, and focus states
- **Secondary**: Slate/Gray - Used for text, borders, and backgrounds
- **Success**: Green - Task completion indicators
- **Warning**: Yellow/Orange - Medium priority and in-progress tasks
- **Danger**: Red - Urgent tasks and destructive actions

---

## 2. Layout Components

### Layout (`src/layout/Layout.tsx`)
**Features**:
- Gradient background (`bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100`)
- Responsive flex layout with sidebar and main content area
- Maximum width constraint on content (`max-w-7xl`)
- Consistent padding and spacing

### Sidebar (`src/layout/sidebar.tsx`)
**Styling Highlights**:
- Frosted glass effect (`backdrop-blur-sm`, `bg-white/90`)
- Active navigation state with gradient background
- Left border indicator for active items (`border-l-4 border-blue-600`)
- Icons with color transitions
- Sticky positioning for viewport anchoring

**Key Classes**:
- `bg-gradient-to-r from-blue-50 to-blue-100` (active state)
- `hover:bg-slate-100/60` (interactive hover)
- `text-transparent bg-clip-text` (gradient text on logo)

### Topbar (`src/layout/topbar.tsx`)
**Features**:
- Backdrop blur with `bg-white/80 backdrop-blur-md`
- Frosted glass appearance
- Profile avatar with hover scale effect (`hover:scale-105`)
- Gradient text for branding
- Focus ring on interactive elements

---

## 3. Component Styling

### Custom Component Classes (Layer Components)

#### Card Components
```css
.card-section: Rounded card with shadow and border
.card-header: Top section with border separator
.card-body: Main content area with padding
.stat-card: Special variation for metric display cards
```

#### Button Styles
```css
.btn-primary: Blue action buttons
.btn-secondary: Gray neutral buttons
.btn-ghost: Borderless, subtle buttons
.btn-danger: Red destructive action buttons
```

#### Form Elements
```css
.input-field: Text inputs with focus ring
.label-form: Consistent label styling
```

#### Badge/Status Indicators
```css
.badge-success: Green success badges
.badge-warning: Yellow warning badges
.badge-danger: Red danger badges
.badge-info: Blue info badges
.badge-neutral: Gray neutral badges
```

---

## 4. Page Styling

### Home Page (`src/pages/Home.tsx`)
**Stats Cards**:
- Grid layout: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Card-based design with hover effects
- Icon badges with background colors
- Gradient progress bars with smooth animations

**Task Breakdown Section**:
- Gradient progress bars (`bg-gradient-to-r`)
- Smooth transitions (`transition-all duration-500 ease-out`)
- Interactive hover states

**Recent Tasks**:
- Card list with subtle backgrounds
- Status badges with color coding
- Emoji indicators for quick visual cues (✓, ⟳, ⚡)

### Projects Page (`src/pages/Projects.tsx`)
**Header**:
- Gradient text with `bg-linear-to-r` effect
- Subtitle for context

**Table Design**:
- Header with gray background (`bg-slate-50`)
- Hover states for rows (`hover:bg-slate-50`)
- Action buttons with icon-based UI
- Status badges with background colors
- Empty state with icon and descriptive text

**Modal Dialog**:
- Backdrop blur effect (`bg-black/50 backdrop-blur-sm`)
- Rounded corners (`rounded-xl`)
- Sticky header for large forms
- Multi-column form layout on larger screens

### Tasks Page (`src/pages/Tasks.tsx`)
**Search & Filter Section**:
- Icon prefix in search input
- Responsive filter dropdowns
- Grouped filter controls

**Task Table**:
- Comprehensive data display
- Priority and status badges with colors
- Assigned user with icon
- Due date with calendar icon
- Attachment link with paperclip icon
- Action buttons per row

**Task Modal**:
- Comprehensive form with sections
- File upload with drag-drop appearance
- Current attachment preview
- Smooth file transition states
- Error display with icon and message
- Sticky footer with action buttons

---

## 5. Interactive Elements

### Hover Effects
All interactive elements feature smooth transitions:
```css
hover:shadow-md
hover:bg-slate-50
hover:text-slate-900
hover:border-blue-400
transition-all duration-200
```

### Focus States
```css
focus:outline-none
focus:ring-2
focus:ring-blue-500
focus:ring-offset-2
```

### Loading States
- Spinning loader: `animate-spin rounded-full h-4 w-4 border-4 border-blue-200 border-t-blue-600`
- Skeleton loading: `bg-gradient-to-r animate-pulse`
- Disabled state opacity: `disabled:opacity-50`

### Animations
- Smooth transitions: `transition-all duration-200/300/500`
- Spin animation: `animate-spin`
- Pulse animation: `animate-pulse`
- Scale transform on hover: `hover:scale-105`

---

## 6. Responsive Design

### Breakpoints Used
- **sm**: Small screens (640px)
- **md**: Medium screens (768px)
- **lg**: Large screens (1024px)

### Responsive Patterns
```css
Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
Text: text-2xl md:text-4xl
Display: hidden sm:block
Width: w-full md:w-1/2 lg:w-1/4
```

---

## 7. Typography

### Heading Hierarchy
- **H1/Page Title**: `text-3xl md:text-4xl font-bold`
- **H2/Section Header**: `text-xl font-bold` or `text-lg font-semibold`
- **H3/Subsection**: `text-sm font-semibold text-slate-700`

### Text Colors
- **Primary text**: `text-slate-900`
- **Secondary text**: `text-slate-600`
- **Tertiary text**: `text-slate-500`
- **Muted text**: `text-slate-400`

### Font Weights
- Headings: `font-bold` (700)
- Labels: `font-semibold` (600)
- Body text: `font-medium` (500) or default (400)

---

## 8. Spacing & Layout

### Padding Scale
- Cards: `p-4` to `p-6`
- Sections: `px-6 py-4`
- Items: `px-2.5 py-1` (badges), `px-4 py-2` (buttons)

### Gap Spacing
- Component gaps: `gap-2` to `gap-4`
- Grid gaps: `gap-5` to `gap-6`
- Section spacing: `space-y-6` to `space-y-8`

### Border Styling
- Default borders: `border border-slate-200`
- Subtle borders: `border-slate-200/50`
- Dashed borders: `border-2 border-dashed border-slate-300`

---

## 9. Shadow Hierarchy

```css
.shadow-sm      /* Cards, elevated elements */
.shadow-md      /* Hover states, modals */
.shadow-lg      /* Dropdowns, large modals */
.shadow-xl      /* Maximum elevation */
```

---

## 10. Dark Mode Support

Dark mode variables are defined in CSS but not yet fully implemented in components:
```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... other variables ... */
}
```

To enable dark mode on components, add the `dark:` prefix:
```css
dark:bg-slate-900
dark:text-white
dark:border-slate-700
```

---

## 11. Best Practices Applied

1. **Consistency**: Reusable component classes reduce duplication
2. **Accessibility**: Focus rings, proper contrast ratios, semantic HTML
3. **Performance**: Utility-only approach minimizes CSS bloat
4. **Responsive**: Mobile-first design with progressive enhancement
5. **Maintainability**: Organized color system and component layers
6. **User Experience**: Smooth transitions, clear feedback states, intuitive controls

---

## 12. Future Enhancements

Potential improvements to explore:
- [ ] Complete dark mode implementation (`prefers-color-scheme` media query)
- [ ] Animation library integration (for advanced transitions)
- [ ] Custom shadows for better depth perception
- [ ] Enhanced accessibility audits
- [ ] Performance optimization with CSS purging for production
- [ ] Additional component variants (outline, text buttons, etc.)

---

## 13. How to Update Styles

### Adding a New Component
1. Create component classes in `src/index.css` under `@layer components`
2. Use consistent naming: `.component-name`
3. Reuse existing color and spacing variables
4. Add responsive variants with `@apply` for complex logic

### Modifying Existing Styles
1. Use Tailwind utilities directly in JSX for quick changes
2. Update `@layer` components for global component consistency
3. Test responsive behavior across breakpoints
4. Verify focus and hover states are accessible

### Color Adjustments
Update the `@theme` block in `src/index.css` to modify global colors used throughout the application.

---

## 14. Browser Support

Tailwind v4 with modern CSS features:
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (14.1+)
- Mobile browsers: Full support (iOS Safari 14.5+, Chrome Android)

---

**Last Updated**: February 6, 2026  
**Tailwind Version**: 4.1.18  
**Project**: Team Tasks Dashboard
