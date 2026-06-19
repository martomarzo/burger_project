FROM node:22-alpine

WORKDIR /app

# Install all deps (devDeps needed for `next build`).
COPY package.json package-lock.json* ./
RUN npm install

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

ENV NODE_ENV=production
ENV PORT=8788
ENV HOSTNAME=0.0.0.0
EXPOSE 8788

# `npm run start` -> `next start` (reads PORT). Migrate is run manually once.
CMD ["npm", "run", "start"]
