FROM mcr.microsoft.com/playwright:v1.58.2-jammy AS base

WORKDIR /app

COPY package*.json ./
RUN npm ci --prefer-offline

RUN npx playwright install --with-deps chromium firefox webkit

COPY . .

RUN mkdir -p allure-results allure-report playwright-report test-results

ENV HEADLESS=true
ENV CI=true
ENV TEST_ENV=staging

CMD ["npm", "test"]
