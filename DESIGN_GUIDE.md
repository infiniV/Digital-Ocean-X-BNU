# Trainer Profile Design Guide

This design guide extracts UI patterns and tokens from the `TrainerProfilePage` component to ensure consistency across the app and serve as prompts for GitHub Copilot.

---

## 1. Design Tokens

### Colors

- **Primary Pink**
  - light: `notion-pink-light` (hover backgrounds)
  - base: `notion-pink` (borders, accents)
  - dark: `notion-pink-dark` (dark-mode accents)
- **Accent**
  - light: `notion-accent-light/20`
  - base: `notion-accent` (gradients)
  - dark: `notion-accent-dark/30`
- **Gray**
  - light bg: `notion-gray-light/30`, `notion-gray-light/20`
  - dark bg: `notion-gray-dark/60`, `notion-gray-dark/40`
  - borders: `border-notion-gray-light/20`, `dark:border-notion-gray-dark/30`
  - text: `text-notion-text-light/80`, `dark:text-notion-text-dark/80`
- **Text**
  - light mode: `text-notion-text-light`
  - dark mode: `text-notion-text-dark`

### Typography

- **Font family**: `font-geist`
- **Sizes**:
  - `text-xs` (labels, captions)
  - `text-sm` (body text)
  - `text-base` (default paragraphs)
  - `text-lg` (subheaders)
  - `text-xl` (section titles)
  - `text-2xl`, `text-3xl`, `text-4xl` (headers)

### Spacing

Use `notion-sm`, `notion-md`, `notion-xl` in class names:

- Padding: `p-4 sm:p-6 md:p-8`
- Margins: `mt-2`, `mb-4`, `space-y-notion-md`
- Gaps: `gap-2`, `gap-6`, `gap-notion-xl`

### Border Radius & Shadows

- Border-radius: `rounded-lg`, `rounded-xl`, `rounded-full`
- Shadows: `shadow-notion`, hover: `shadow-notion-hover`

### Utilities & Layout

- Container: `container mx-auto px-2 sm:px-4 md:px-6 lg:px-8`
- Fixed grain background: `bg-grain opacity-10`
- Flex/grid: `flex`, `grid-cols-1`, `sm:grid-cols-2`, `lg:grid-cols-4`
- Animations: `animate-fade-in`, `animate-slide-up`

---

## 2. Component Anatomy

### Card Wrapper

```tsx
<div className="border-notion-gray-light/20 shadow-notion hover:border-notion-pink hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60 dark:hover:border-notion-pink-dark group relative overflow-hidden rounded-xl border bg-white p-6 transition-all duration-300">
  <div className="bg-grain absolute inset-0 opacity-10"></div>
  <div className="relative z-10">...content...</div>
</div>
```

- **Structure**: wrapper → background layer → content container
- **Props**: use `group` for hover, dark-mode classes

### Profile Image

```tsx
<div className="overflow-hidden rounded-full border-4 border-notion-pink/20 shadow-notion">
  <Image ... className="group-hover:scale-110" />
</div>
```

- Use high contrast border + hover scale effect

### Stats Card

Props: `icon`, `count`, `label`, optional `hoverColor`

- Icon size: `h-8 w-8`
- Text: `text-3xl font-semibold`, `text-sm`
- Center aligned flex-col

---

## 3. Example Copilot Prompt

"Create a reusable `StatsCard` component in React TypeScript that accepts props `{ icon: ReactNode; count: number; label: string; }`. Use the notion design tokens: border `border-notion-gray-light/20`, bg `bg-white`, dark variants, `rounded-xl`, `shadow-notion`, and include the grain background layer. Implement hover state to change border to `notion-pink` and elevate shadow. Use `font-geist` for text."

---

## 4. File & Naming Conventions

- **Components folder**: `src/components/ui/StatsCard.tsx`
- Use PascalCase for component names
- Separate presentational components (`ui/`) from domain-specific components

---

## 5. Spacing Guidelines

- Use `p-4` for small cards, `p-6` for medium, `p-8` for large
- Use `gap-4`–`gap-8` consistently within flex/grid
- Wrap sections with `space-y-notion-md`

---

Adhering to these tokens and patterns ensures a unified look and simplifies Copilot prompts.
