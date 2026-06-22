FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

ARG SITE_NAME="Guitar Theory Lab"
ARG NEXT_PUBLIC_SITE_URL="http://localhost:8080"
ARG NEXT_PUBLIC_APP_DESCRIPTION="Advanced online tools for guitar theory, harmonic exploration, voice leading, set theory and improvisational practice."

ENV SITE_NAME=$SITE_NAME
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_APP_DESCRIPTION=$NEXT_PUBLIC_APP_DESCRIPTION

RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
