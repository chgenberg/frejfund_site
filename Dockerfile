# 1. Base image for installing dependencies
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package.json and lock file
COPY package.json package-lock.json* ./
RUN npm ci

# 2. Builder image
FROM node:18-alpine AS builder
# Cache-buster: gör varje commit unikt så BuildKit inte återanvänder lagret där vi kör npm run build
ARG RAILWAY_GIT_COMMIT_SHA
ENV RAILWAY_GIT_COMMIT_SHA=$RAILWAY_GIT_COMMIT_SHA
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
RUN echo "Building commit $RAILWAY_GIT_COMMIT_SHA with SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL"
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# We need to copy the standalone server dependencies
COPY --from=deps /app/node_modules ./node_modules

# Build the application
RUN npm run build

# 3. Production image
FROM node:18-alpine AS runner
WORKDIR /app

# Copy built app from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Start the app
# The standalone output creates a server.js file
CMD ["node", "server.js"]
