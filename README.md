# 📦 Product Management Service – FemiStoreProduct

**Developed by Chayma Fouzri**

---

## 🔍 Overview

The `FemiStoreProduct` service is a core component of the **FemiStore Fashion App**, a modern e-commerce platform for fashion products. This service is responsible for managing product data, including product creation, updates, deletions, and advanced search capabilities. It supports features like currency conversion for international pricing and discount management to enhance the shopping experience.

Built with **Spring Boot**, this service leverages a **MySQL database** (femistore) for persistent storage and integrates with **Eureka** for service discovery and a **Gateway** for request routing in a microservices architecture.

---

## ✨ Core Features

- **Product Management**:
  - Add, update, delete, and retrieve products.
  - Manage product details such as name, description, price, stock, and image URL.
- **Discount Support**:
  - Apply discounts to products using a percentage-based system.
  - Calculate and display discounted prices dynamically.
- **Currency Conversion**:
  - Convert product prices from TND (Tunisian Dinar) to other currencies (e.g., EUR, USD) using the ExchangeRate-API.
- **Advanced Search**:
  - Search products by name, price range, stock availability, and discounted price.

---

## 🚀 Advanced Features

- **Dynamic Pricing**:
  - Prices are adjusted based on discounts and currency conversion in real-time.
- **Service Discovery**:
  - Registers with Eureka for seamless integration with other microservices in the FemiStore ecosystem.
- **API Gateway Integration**:
  - Routes requests through a gateway for load balancing and centralized access.
- **Validation**:
  - Ensures product data integrity with constraints (e.g., positive price, non-negative stock).

---

## 🛠️ Technologies & Tools

### Backend
- **Spring Boot**: 3.x – For building the RESTful API.
- **Spring Data JPA**: For database interactions.
- **MySQL Database**: For persistent storage (femistore database).
- **Eureka Client**: For service discovery in a microservices architecture.
- **ExchangeRate-API**: For real-time currency conversion.
- **Maven**: For dependency management.
- **Java**: 17 – For development.

### APIs & Integrations
- **ExchangeRate-API**: Fetches exchange rates for currency conversion (API key required).
- **Eureka Server**: Registers the service for discovery (e.g., `http://localhost:8761`).
- **Gateway**: Routes requests to the service (e.g., via Spring Cloud Gateway).

---

## 📡 API Endpoints

The service exposes the following RESTful endpoints under the base path `/prd/product`:

| Method | Endpoint                              | Description                                      |
|--------|---------------------------------------|--------------------------------------------------|
| GET    | `/GetAllProducts`                    | Retrieve all products in the base currency (TND). |
| GET    | `/GetAllProductsInCurrency?currency={currency}` | Retrieve all products with prices converted to the specified currency (e.g., EUR, USD). |
| GET    | `/GetById/{id}`                      | Retrieve a product by its ID.                    |
| POST   | `/AddProduct`                        | Add a new product (requires a JSON body).        |
| PUT    | `/UpdateProduct/{id}`                | Update an existing product by its ID.            |
| DELETE | `/RemoveProduct/{id}`                | Delete a product by its ID.                      |
| GET    | `/search?name={name}&minPrice={minPrice}&maxPrice={maxPrice}&minStock={minStock}&useDiscountedPrice={true/false}` | Search products with filters (name, price range, stock, and optionally discounted price). |

### Example Request: Get All Products in EUR
```
GET http://localhost:8083/prd/product/GetAllProductsInCurrency?currency=EUR
```
**Response**:
```json
[
    {
        "id": 1,
        "name": "Organic Cotton Shirt",
        "description": "Eco-friendly, breathable cotton t-shirt for daily ...",
        "price": 7.81,
        "stock": 100,
        "imageUrl": "https://example.com/images/tshirt.jpg",
        "discountPercentage": 10.0
    }
]
```

### Example Request: Search Products by Discounted Price
```
GET http://localhost:8083/prd/product/search?minPrice=10&maxPrice=20&useDiscountedPrice=true
```
**Response**:
```json
[
    {
        "id": 4,
        "name": "Wool Scarf",
        "description": "Warm and soft wool scarf, ideal for winter weather ...",
        "price": 19.99,
        "stock": 200,
        "imageUrl": "https://example.com/images/wool-scarf.jpg",
        "discountPercentage": 20.0
    }
]
```

---

## ⚙️ Setup & Configuration

### Prerequisites
Before setting up the project, ensure you have the following installed:
- **Java 17**: For running the backend.
- **Maven**: For building the project.
- **MySQL**: For the database (or configure another database like H2 for testing).
- **Git**: For cloning the repository.
- **Eureka Server**: A running Eureka server instance (e.g., on `http://localhost:8761`).
- **API Gateway**: A running gateway instance for routing requests (optional, depending on your setup).
- **ExchangeRate-API Key**: Sign up at [ExchangeRate-API](https://www.exchangerate-api.com/) to get an API key.

### Setup Instructions

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd femistore-product
```

#### 2. Configure the Database
- Create a MySQL database named `femistore`:
  ```sql
  CREATE DATABASE femistore;
  ```
- Update the `application.properties` file with your MySQL credentials:
  ```properties
  spring.datasource.url=jdbc:mysql://localhost:3306/femistore
  spring.datasource.username=root
  spring.datasource.password=your_password
  spring.jpa.hibernate.ddl-auto=update
  ```

#### 3. Configure Eureka and Gateway
- Ensure the Eureka server is running at `http://localhost:8761`.
- Update `application.properties` to point to the Eureka server:
  ```properties
  eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
  ```
- If using a gateway, ensure it’s configured to route requests to `/prd/**` to this service.

#### 4. Configure the ExchangeRate-API Key
- Replace the API key in `ExchangeRateService.java` with your own key:
  ```java
  private static final String API_KEY = "your_api_key_here";
  ```

#### 5. Build and Run the Application
- Build the project using Maven:
  ```bash
  mvn clean install
  ```
- Run the application:
  ```bash
  mvn spring-boot:run
  ```
- The service will be available at `http://localhost:8083/prd`.

#### 6. Test the Application
- Use Postman or curl to test the API endpoints (see the **API Endpoints** section for examples).
- Ensure the service registers with Eureka by checking the Eureka dashboard at `http://localhost:8761`.

---

## 🗂️ Project Structure

```
femi-store-product/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── tn/femistore/femistoreproduct/
│   │   │       ├── FemiStoreProductApplication.java  # Main application class
│   │   │       ├── Product.java                      # Product entity with discount logic
│   │   │       ├── ProductController.java            # REST controller for product endpoints
│   │   │       ├── ProductService.java               # Service interface
│   │   │       ├── ProductServiceImpl.java           # Service implementation
│   │   │       ├── ProductRepository.java            # JPA repository for product data
│   │   │       ├── ExchangeRateService.java          # Service for currency conversion
│   │   │       └── ExchangeRateResponse.java         # DTO for ExchangeRate-API response
│   │   └── resources/
│   │       └── application.properties               # Configuration file
└── pom.xml                                          # Maven dependencies
```

---

## 📬 Support

For issues, feature requests, or contributions, please contact:

- **Developer**: Chayma Fouzri
- **Email**: [chayma.fouzri@esprit.tn]

---
