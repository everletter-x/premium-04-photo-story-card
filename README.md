# Premium 04 - Photo Story Card

A beautiful Next.js template for EverLetter that displays photos as a carousel with captions, telling a story.

## Features

- Photo carousel with swipe gestures
- Dot navigation indicators
- Auto-advance every 5 seconds
- Responsive design (mobile/tablet/desktop)
- Music floating button
- Smooth animations with Framer Motion
- Custom color themes
- All content from config.json

## Setup

```bash
pnpm install
pnpm dev
```

## Configuration

Edit `public/config.json` to customize:

- `recipient` / `sender` - Names
- `title` - Page title
- `message` / `closing` - Text content
- `photos` - Photo filenames
- `captions` - Photo captions
- `theme` - Color theme
- `music` / `musicTitle` - Background music

## Build

```bash
pnpm build
pnpm start
```

## Tech Stack

- Next.js 13
- TypeScript
- Tailwind CSS
- Framer Motion
