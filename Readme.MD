### Project Overview

This project is a Node.js application written in TypeScript, utilizing Prisma ORM for database interactions with a PostgreSQL database. The application is deployed on an AWS EC2 instance & Load-balanced with **PM2**, with a [custom domain](https://mymovies.store/app) secured by SSL. Continuous integration and deployment pipelines are managed using GitHub Actions. API documentation is provided through Swagger.

### Technical Details

#### 1. **Programming Language**

- **Node.js**: The runtime environment for executing JavaScript code server-side.
- **TypeScript**: A statically typed superset of JavaScript that compiles to plain JavaScript.

#### 2. **Database**

- **PostgreSQL**: An open-source relational database management system.
- **Prisma ORM**: An Object-Relational Mapping tool, used to interact with the PostgreSQL database.

#### 3. **Deployment**

- **AWS EC2**: The application is hosted on an AWS EC2 & Load-balanced with **PM2**.
- **Custom Domain with SSL**: The application is accessible via a [custom domain](https://mymovies.store/app), secured with SSL certificates.

#### 4. **CI/CD Pipelines**

- **GitHub Actions**: Automated workflows for continuous integration and deployment. These pipelines handle tasks such as running tests, building the application, and deploying it to AWS EC2.

#### 5. **API Documentation**

- **Swagger**: API documentation is generated and served using Swagger, providing a user-friendly interface for exploring and testing the API endpoints.

#### 6. **Testing**

- Comprehensive testing is implemented to ensure the reliability and correctness of the application.

### Project Structure

```plaintext
project-root/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── db/
│   ├── handlers/
│   ├── logger/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   └── index.ts
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── package.json
├── tsconfig.json
├── server.ts
└── README.md
```

### Example GitHub Actions Workflow (`.github/workflows/main.yml`)

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  Deploy:
    name: Deploy to EC2
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - name: Build & Deploy
        env:
          PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          HOSTNAME: ${{secrets.HOST_NAME}}
          USER_NAME: ${{secrets.USER_NAME}}

        run: |
          echo "$PRIVATE_KEY" > private_key && chmod 600 private_key
          ssh -o StrictHostKeyChecking=no -i private_key ${USER_NAME}@${HOSTNAME} '

              cd /home/movie-app/movie-backend &&
              git pull  &&
              sudo npm i &&
              pm2 restart api
              '
```
