# Build and serve the Vite frontend as a static site with Nginx.
# Debian-based Node avoids musl/native binary issues.

FROM node:20-slim AS build
WORKDIR /app

COPY package*.json ./
# Install deps plus native binaries for rollup/tailwind oxide/lightningcss on linux x64
RUN npm ci \
  && npm install @rollup/rollup-linux-x64-gnu @tailwindcss/oxide-linux-x64-gnu lightningcss-linux-x64-gnu --no-save

COPY . .
# VITE_API_BASE_URL is passed as a build-arg
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
# Fallback to JS if native lightningcss is absent
ENV LIGHTNINGCSS_IGNORE_NATIVE=true

RUN npm run build && ls -la dist

FROM nginx:1.27-alpine AS final
COPY --from=build /app/dist /usr/share/nginx/html

# Basic SPA fallback; uncomment if you want client-side routing to fallback to index.html
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
