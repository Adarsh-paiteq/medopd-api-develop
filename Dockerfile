FROM node:20.11.1-bullseye AS build

RUN useradd --user-group --create-home --shell /bin/false medopd    
ENV HOME=/home/medopd
WORKDIR $HOME/api

COPY . .
RUN chown -R medopd:medopd $HOME/*

USER medopd
RUN npm ci && npm run build

FROM node:20.11.1-bullseye-slim AS production
#Install Doppler CLI
RUN apt-get update && apt-get install -y apt-transport-https ca-certificates curl gnupg ffmpeg && \
    curl -sLf --retry 3 --tlsv1.2 --proto "=https" 'https://packages.doppler.com/public/cli/gpg.DE2A7741A397C129.key' | apt-key add - && \
    echo "deb https://packages.doppler.com/public/cli/deb/debian any-version main" | tee /etc/apt/sources.list.d/doppler-cli.list && \
    apt-get update && \
    apt-get -y install doppler

ARG DOPPLER_TOKEN
RUN doppler secrets download doppler.encrypted.json

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN apt-get update && apt-get install gnupg wget -y && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

RUN useradd --user-group --create-home --shell /bin/false medopd
ENV HOME=/home/medopd
WORKDIR $HOME/api

# COPY migrations ./migrations
COPY package.json package-lock.json ./
COPY components ./components
COPY --from=build /home/medopd/api/dist ./dist
RUN chown -R medopd:medopd $HOME/*

USER medopd
RUN npm pkg delete scripts.prepare && npm ci --omit=dev  && npm cache clean --force

ENTRYPOINT ["doppler","run","--fallback=doppler.encrypted.json","--" ]
# CMD npm run start:prod
