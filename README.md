# QA Automation Framework — Playwright + TypeScript

## Overview

Scalable QA automation framework using Playwright and TypeScript. Supports UI and API testing, containerized execution, CI/CD integration, and Allure reporting.

---

## Tech Stack

- Playwright (TypeScript)
- Node.js
- Docker & Docker Compose
- Allure Report
- GitHub Actions (CI/CD)

---

## Features

- Page Object Model (POM) for maintainability
- UI and API test coverage
- Test tagging: smoke, regression, api
- Parallel execution
- Retry mechanism for flaky tests
- Environment-based configuration (staging, production)
- Allure reporting with screenshots and logs
- Dockerized test execution using docker-compose
- Isolated test services (smoke, regression, api, all)

---

## Project Structure

```
.
├── tests/
├── pages/
├── utils/
├── playwright.config.ts
├── package.json
├── Dockerfile
├── docker-compose.yml
└── .github/workflows/playwright.yml
```

---

## Installation

### Local setup

```bash
npm install
```

### Docker setup

Build containers:

```bash
docker-compose build
```

---

## Running Tests

### Local execution

```bash
npx playwright test
```

### Using Docker (recommended)

Run smoke tests:

```bash
docker-compose run --rm smoke
```

Run regression tests:

```bash
docker-compose run --rm regression
```

Run API tests:

```bash
docker-compose run --rm api
```

Run full test suite:

```bash
docker-compose run --rm all
```

---

## Allure Report

### Run Allure server (Docker)

```bash
docker-compose --profile report up allure
```

Then open:

```
http://localhost:5050
```

---

## CI/CD

This project uses GitHub Actions to:

- Run smoke tests on every push
- Execute API tests in parallel
- Run regression tests on schedule or manually
- Generate and publish Allure reports

---

## Environment Configuration

Environment variables are managed using `.env` files:

- `.env.staging`
- `.env.production`

You can override variables when running Docker:

```bash
TEST_ENV=production docker-compose run --rm smoke
```

---

## Notes

- Test results are shared via Docker volumes (`allure-results`, `playwright-report`, `test-results`)
- Avoid running multiple suites simultaneously to prevent result conflicts

---

## Author

eleagp12

---

## Summary

This project demonstrates a production-style QA automation framework with containerized execution, CI/CD pipelines, and scalable test architecture—aligned with real SDET practices.
