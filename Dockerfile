FROM node:18-slim AS deps



ENV NODE_ENV=development
RUN apt-get update \
  && apt-get install -y build-essential python3 \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app/

COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci --silent

FROM node:18-slim as builder
WORKDIR /usr/src/app/

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-slim as runner
WORKDIR /usr/app/
# COPY ["package.json", "package-lock.json*", "./"]
ENV NODE_ENV=production

# RUN apt-get update \
#   && apt-get install -y build-essential python \
#   && rm -rf /var/lib/apt/lists/*
# RUN npm ci --silent
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist/ /usr/app/
# COPY ./config/ /usr/app/config/
# Add Tini
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]
USER node
EXPOSE 4000
CMD ["node", "/usr/app/index.js"]
