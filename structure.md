# 📁 Directory Structure of `D:\Projects\digital-concierge-app`

```
digital-concierge-app
├── .env
├── .env.local
├── .gitignore
├── README.md
├── actions
│   ├── booking.actions.ts
│   ├── index.ts
│   └── user.actions.ts
├── app
│   ├── (admin)
│   │   ├── layout.tsx
│   │   └── overview
│   │       └── page.tsx
│   ├── (auth)
│   │   ├── sign-in
│   │   │   └── [[...sign-in]]
│   │   │       └── page.tsx
│   │   └── sign-up
│   │       └── [[...sign-up]]
│   │           └── page.tsx
│   ├── (butler)
│   │   ├── dashboard
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (guest)
│   │   ├── bookings
│   │   │   └── page.tsx
│   │   ├── home
│   │   │   └── page.tsx
│   │   ├── itinerary
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── profile
│   │       └── page.tsx
│   ├── api
│   │   └── [example-route]
│   │       └── route.ts
│   ├── global.css
│   └── layout.tsx
├── components
│   ├── common
│   │   ├── AvatarDisplay.tsx
│   │   ├── ErrorDisplay.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Logo.tsx
│   │   └── ProtectedRoute.tsx
│   ├── concierge
│   │   ├── CornerNavItem.tsx
│   │   └── RiveAvatar.tsx
│   ├── features
│   │   ├── booking
│   │   │   ├── BookingCard.tsx
│   │   │   ├── BookingForm.tsx
│   │   │   ├── ServiceSelector.tsx
│   │   │   └── index.ts
│   │   ├── itinerary
│   │   │   ├── ItineraryItem.tsx
│   │   │   ├── ItineraryTimeline.tsx
│   │   │   └── index.ts
│   │   ├── notifications
│   │   │   ├── NotificationBell.tsx
│   │   │   ├── NotificationList.tsx
│   │   │   └── index.ts
│   │   └── profile
│   │       ├── ProfileAvatarUpload.tsx
│   │       ├── ProfileForm.tsx
│   │       └── index.ts
│   ├── layout
│   │   ├── GuestHeader.tsx
│   │   ├── MainContainer.tsx
│   │   └── MobileNav.tsx
│   └── ui
│       ├── avatar.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── sheet.tsx
├── components.json
├── constants
│   └── index.ts
├── eslint.config.mjs
├── generate_structure_md.py
├── hooks
│   ├── useRealtime.ts
│   └── useResponsive.ts
├── lib
│   ├── i18n.ts
│   ├── prisma.ts
│   ├── supabase.ts
│   ├── utils.ts
│   └── zod-schemas.ts
├── locales
│   ├── en.json
│   └── es.json
├── middleware.ts
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.js
├── prisma
│   ├── migrations
│   │   └── .keep
│   └── schema.prisma
├── public
│   ├── avatars
│   │   ├── character_test.riv
│   │   └── dummy_concierge.riv
│   ├── favicon.svg
│   ├── fonts
│   │   └── .keep
│   ├── images
│   │   └── .keep
│   └── robots.txt
├── store
│   ├── useAppStore.ts
│   └── useUserStore.ts
├── structure.md
├── styles
│   └── tailwind.css
├── tailwind.config.js
├── tailwind.config.ts
├── tsconfig.json
└── types
    ├── global.d.ts
    ├── index.ts
    └── supabase.ts
```