# FemiStoreProduct - Categories Module

This repository contains the **FemiStore** module, which is a part of the **FemiStore Fashion App**. The FemiStore Fashion App is a comprehensive e-commerce platform for fashion products, and this module is responsible for managing product categories and subcategories. It includes a Spring Boot backend for handling category data and an Angular frontend for providing a user-friendly interface to interact with categories.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview
The **FemiStoreProduct** module is a core component of the FemiStore Fashion App, designed to manage product categories. It allows users to create, update, delete, and view main categories and their subcategories. For example, a main category like "Women's Clothing" can have subcategories such as "Dresses" or "Tops". This module integrates with the broader FemiStore Fashion App ecosystem via a Eureka server for service discovery.

## Features
- Create, update, delete, and view main categories and subcategories.
- Paginated listing of categories and subcategories.
- Search categories by name.
- Fetch external categories (via an external service).
- Responsive UI with Angular Material for a modern look and feel.
- Service discovery using Eureka for the backend.

## Technologies
### Backend
- **Spring Boot**: 3.x
- **Spring Data JPA**: For database interactions
- **H2 Database**: In-memory database (can be replaced with MySQL/PostgreSQL)
- **Eureka Client**: For service discovery
- **Maven**: Dependency management
- **Java**: 17

### Frontend
- **Angular**: 17.x
- **Angular Material**: For UI components
- **TypeScript**: For type-safe JavaScript
- **RxJS**: For reactive programming
- **Node.js**: 18.x
- **npm**: Package management

## Prerequisites
Before setting up the project, ensure you have the following installed:
- **Java 17**: For the backend
- **Maven**: For building the backend
- **Node.js 18.x**: For the frontend
- **npm**: Comes with Node.js
- **Git**: For cloning the repository
- **Eureka Server**: A running Eureka server instance (e.g., on `http://localhost:8761`)

## Setup Instructions

### Backend Setup
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd femistore-product
