FROM node:22-alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy root workspace config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy package.json of both apps (needed for workspace resolution)
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

# Install dependencies (devDeps included — vite is needed for preview)
RUN pnpm install --frozen-lockfile

# Copy source code and build
COPY . .
RUN pnpm --filter @saas/web build

EXPOSE 3000
CMD ["pnpm", "--filter", "@saas/web", "exec", "vite", "preview", "--host", "0.0.0.0"]
