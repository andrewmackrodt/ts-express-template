################################################################################
# Cache the nexe nodejs binary and compress it
################################################################################

FROM node:12.9.1-alpine

RUN apk add --no-cache upx

ARG NEXE_TARGET="alpine-x64-12.9.1"

RUN echo "console.log()" > index.js \
 && npx nexe --silent -t "$NEXE_TARGET" -o /tmp/nexe-cache index.js \
 && rm -f /tmp/nexe-cache index.js \
 && chmod +x "/root/.nexe/$NEXE_TARGET" \
 && upx -q --lzma --no-progress "/root/.nexe/$NEXE_TARGET"

WORKDIR /root/.nexe


################################################################################
# Create the release binary
################################################################################

FROM node:12.9.1-alpine

COPY package*.json /opt/app/

WORKDIR /opt/app

RUN npm ci --silent --no-progress

COPY . /opt/app/

RUN npm run build --silent

COPY --from=0 /root/.nexe/ /root/.nexe/

ARG NEXE_TARGET="alpine-x64-12.9.1"

RUN npx nexe \
  --silent \
  -t "$NEXE_TARGET" \
  -o /app \
  build/cluster.js


################################################################################
# Copy the release binary
################################################################################

FROM alpine:3.9.4

COPY --from=1 /app /

ENV NODE_ENV=production

ENTRYPOINT ["/app"]
