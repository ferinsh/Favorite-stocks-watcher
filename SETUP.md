# StockWatch --- Setup & Usage Guide

This guide explains how to clone, configure, run, and use the StockWatch
application locally with Docker.

## 1. Prerequisites

Install the following before starting:

-   Git
-   Docker Desktop
-   A GitHub account
-   A Finnhub account/API key

Make sure Docker Desktop is running.

## 2. Clone the repository

Open PowerShell or a terminal and run:

``` bash
git clone https://github.com/ferinsh/stock-portfolio.git
cd stock-portfolio
```

## 3. Configure environment variables

Inside the project, copy:

``` text
backend/.env.example
```

to:

``` text
backend/.env
```

On PowerShell:

``` powershell
Copy-Item backend/.env.example backend/.env
```

Open `backend/.env` and configure it:

``` env
DEBUG=True
SECRET_KEY=your-django-secret-key

DB_NAME=stock_portfolio
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432

FINNHUB_API_KEY=your-finnhub-api-key
```

### Finnhub API key

Create an account at Finnhub and obtain an API key.

Put your key in:

``` env
FINNHUB_API_KEY=your-actual-api-key
```

Never commit `backend/.env` to GitHub.

## 4. Start the application

From the project root, run:

``` bash
docker compose up --build
```

The first startup may take a few minutes because Docker needs to build
the frontend and backend images.

After the containers start, open:

-   Frontend: http://localhost:5173
-   Backend: http://localhost:8000
-   Django Admin: http://localhost:8000/admin/

## 5. Run in the background

If you don't want Docker logs occupying your terminal:

``` bash
docker compose up --build -d
```

Check the containers:

``` bash
docker compose ps
```

You should see:

``` text
stock_portfolio_db
stock_portfolio_backend
stock_portfolio_frontend
```

## 6. Create a Django admin account

After the containers are running:

``` bash
docker compose exec backend python manage.py createsuperuser
```

Follow the prompts to create the admin account.

You can then access:

``` text
http://localhost:8000/admin/
```

## 7. Using the application

### Create an account

1.  Open http://localhost:5173
2.  Go to Register.
3.  Enter a username, email, and password.
4.  Submit the registration form.
5.  Log in with the new account.

### Add favorite stocks

1.  Open **My Stocks**.
2.  Enter a stock symbol such as:
    -   `AAPL`
    -   `MSFT`
    -   `NVDA`
    -   `TSLA`
3.  Click **Add Stock**.
4.  The stock will be saved to your portfolio.
5.  Its current market price will be retrieved through Finnhub.

### Dashboard

The Dashboard displays the user's favorite stocks and their current
prices.

Prices are refreshed automatically every minute while the page is open.

### Share a portfolio

1.  Open **Share**.
2.  Enter the username of another StockWatch user.
3.  Click **Share Portfolio**.
4.  The other user will receive read-only access to your portfolio.

### View shared portfolios

1.  Log in as the recipient.
2.  Open **Shared With Me**.
3.  Select a shared portfolio.
4.  The portfolio's stocks will be displayed.

## 8. Stop the application

If Docker is running in the foreground, press:

``` text
Ctrl + C
```

If it is running in the background:

``` bash
docker compose down
```

This stops and removes the containers while preserving the PostgreSQL
data volume.

## 9. Start the application again

After the initial setup, you normally only need:

``` bash
docker compose up -d
```

To stop it:

``` bash
docker compose down
```

## 10. Important Docker commands

### View running containers

``` bash
docker compose ps
```

### View all logs

``` bash
docker compose logs
```

### View backend logs

``` bash
docker compose logs backend
```

### View frontend logs

``` bash
docker compose logs frontend
```

### View PostgreSQL logs

``` bash
docker compose logs db
```

### Follow backend logs

``` bash
docker compose logs -f backend
```

### Run Django migrations

``` bash
docker compose exec backend python manage.py migrate
```

### Create migrations after changing models

``` bash
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate
```

### Open a Django shell

``` bash
docker compose exec backend python manage.py shell
```

## 11. Reset the database

**Warning:** This deletes the PostgreSQL data stored by Docker.

Only do this if you intentionally want a completely fresh database:

``` bash
docker compose down -v
docker compose up --build
```

Do not use `-v` for normal shutdowns.

## 12. Project structure

``` text
stock-portfolio/
├── backend/
│   ├── accounts/
│   ├── portfolios/
│   ├── stocks/
│   ├── config/
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   └── .dockerignore
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 13. API overview

### Authentication

``` text
POST /api/auth/register/
POST /api/auth/login/
POST /api/auth/refresh/
GET  /api/auth/me/
```

### Favorite stocks

``` text
GET    /api/portfolio/favorites/
POST   /api/portfolio/favorites/
DELETE /api/portfolio/favorites/{id}/
```

### Stock prices

``` text
GET /api/stocks/quotes/
```

### Portfolio sharing

``` text
GET    /api/portfolio/shares/
POST   /api/portfolio/shares/
DELETE /api/portfolio/shares/{id}/

GET /api/portfolio/shared-with-me/
GET /api/portfolio/shared-with-me/{share_id}/
```

## 14. Troubleshooting

### Port 5432 is already in use

Another PostgreSQL installation may already be using port 5432.

Check:

``` bash
docker compose ps
```

You can also check Windows processes/services for another PostgreSQL
instance.

### Port 8000 is already in use

Stop another Django/backend process or change the host port in
`docker-compose.yml`.

### Port 5173 is already in use

Stop another Vite development server or change the frontend port
mapping.

### The frontend cannot connect to Django

Make sure all containers are running:

``` bash
docker compose ps
```

Then check the backend logs:

``` bash
docker compose logs backend
```

The frontend API base URL should point to:

``` text
http://127.0.0.1:8000/api
```

because browser requests are made from the host machine.

### Finnhub prices are unavailable

Check that:

1.  `backend/.env` exists.
2.  `FINNHUB_API_KEY` contains a valid key.
3.  The backend container was restarted after changing `.env`.

Restart with:

``` bash
docker compose down
docker compose up -d
```

## 15. Security notes

Never commit:

``` text
backend/.env
```

to GitHub.

The repository should contain:

``` text
backend/.env.example
```

but not your real environment file.

Your Finnhub API key, Django secret key, and database credentials should
remain private.

## 16. Development workflow

After cloning and configuring the environment:

``` bash
docker compose up -d
```

Make code changes normally.

For backend model changes:

``` bash
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate
```

For changes to dependencies or Dockerfiles:

``` bash
docker compose build
docker compose up -d
```

For normal source-code changes, Docker's development setup will
generally pick up the changes automatically.

## 17. Quick start

For an experienced user, the entire setup is:

``` bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_REPOSITORY_NAME
```

Create and configure:

``` text
backend/.env
```

Then:

``` bash
docker compose up --build -d
```

Open:

``` text
http://localhost:5173
```

Create an account, add stocks, and start monitoring the portfolio.
