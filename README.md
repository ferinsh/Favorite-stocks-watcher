# StockWatch

A full-stack stock portfolio monitoring application built with React, Django REST Framework, PostgreSQL, and Docker.

Users can create accounts, manage favorite stocks, view current market prices, and share their portfolios with other users.

## Features

- User registration and login
- JWT authentication
- Protected routes
- User profile information
- Add and remove favorite stocks
- Current stock prices through Finnhub
- Automatic price refresh every minute
- PostgreSQL persistence
- Share portfolios with other users
- Read-only shared portfolios
- Dockerized development environment
- React frontend
- Django REST API

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios

### Backend

- Python
- Django
- Django REST Framework
- Simple JWT

### Database

- PostgreSQL

### External API

- Finnhub

### Infrastructure

- Docker
- Docker Compose

## Project Structure

```text
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