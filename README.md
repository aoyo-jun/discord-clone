# Fullstack Discord Clone using React & Next.js

The repository for my Fullstack Discord Clone, I created this project following this [course](https://www.youtube.com/watch?v=ZbX4Ok9YX94), but with my own little tweaks.

Features:

* Real-time messaging using Socket.io
* Send attachments as messages using UploadThing
* Delete & Edit messages in real time for all users
* Create Text, Audio and Video call Channels
* 1:1 conversation between members
* 1:1 video calls between members
* Member management (Kick, Role change Guest / Moderator)
* Unique invite link generation & full working invite system
* Infinite loading for messages in batches of 10 (tanstack/query)
* Server creation and customization
* Beautiful UI using TailwindCSS and ShadcnUI
* Full responsivity and mobile UI
* Light / Dark mode
* Websocket fallback: Polling with alerts
* ORM using Prisma
* MySQL database using Planetscale
* Authentication with Clerk

obs: There's a lot of comments. They are for learning purposes.

## Cloning the repository
```
git clone https://github.com/aoyo-jun/discord-clone.git
```
## Install packages
```
npm i
```
## Setup .env file
Here you will need to insert your:
* [Clerk](https://clerk.com/) Keys and URLs
* Database URL (I used [PlanetScale](https://planetscale.com/), but you can use the database of your choice)
* [Uploadthing](https://uploadthing.com/) Secret and ID
* [LiveKit](https://livekit.io/) Key, Secret and URL

Just follow the corresponding documentation.
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=


DATABASE_URL=

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=
```
## Setup Prisma
Add MySQL Database (I used PlanetScale)
```
npx prisma generate
npx prisma db push
```
## Start the app
```
npm run dev
```
###### This README was partially copied from the original [next13-discord-clone](https://github.com/AntonioErdeljac/next13-discord-clone) repository.

___

Again, this amazing project is a [course](https://www.youtube.com/watch?v=ZbX4Ok9YX94) by [Code with Antonio](https://www.youtube.com/@codewithantonio)!

Here I would like to express how much I liked this course, as my first big project, it helped me understand a lot more about React, Next.js, Tailwind, JS/TS in general and a bunch more.

Thank you, Antonio! ❤️
