# Étape 1 : Installation des dépendances
FROM node:20-alpine AS deps
WORKDIR /prisme
COPY package*.json ./
RUN npm install

# Étape 2 : Build
FROM node:20-alpine AS builder
WORKDIR /prisme
# On récupère les modules de l'étape précédente
COPY --from=deps /prisme/node_modules ./node_modules
# On copie tout le projet (y compris le dossier src)
COPY . .
RUN npm run build

# Étape 3 : Runner (Image finale)
FROM node:20-alpine AS runner
WORKDIR /prisme

ENV NODE_ENV=production
ENV PORT=3000

# On copie les éléments indispensables du build standalone
COPY --from=builder /prisme/public ./public
COPY --from=builder /prisme/.next/standalone ./
COPY --from=builder /prisme/.next/static ./.next/static

EXPOSE 3000

# Next.js standalone génère un server.js à la racine du dossier de build
CMD ["node", "server.js"]