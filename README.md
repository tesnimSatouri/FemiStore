🌟 FemiStore – Fashion E-Commerce Platform for Women
Coached by: Sarra AbidiCreated by: Meriem Touzri, Chayma Fouzri, Tesnim Satouri, Wala Ammar , Mouna Ben Rebah

📖 Project Overview
FemiStore is a modern e-commerce platform designed specifically for women, focusing on fashion and online sales. Built as a microservices-based architecture, FemiStore provides a seamless shopping experience with features like product management, category browsing, order processing, stock management, and customer reviews. The platform integrates both backend services (using Spring Boot) and a responsive frontend (using Angular), ensuring scalability, modularity, and a delightful user experience.
FemiStore aims to empower women by offering a curated selection of fashion products, dynamic pricing with currency conversion, trend analysis, and personalized features like demand forecasting and review-based insights.

👥 Team Members & Contributions



Name
GitHub Username
Contribution
Email



Meriem Touzri
maryem001
Order Management Microservice
mariem.touzri@esprit.tn


Chayma Fouzri
Not provided
Product Management Microservice
chayma.fouzri@esprit.tn


Tesnim Satouri
Not provided
Stock Management Microservice
tesnim.satouri@esprit.tn


Wala Ammar
walaammar
Review Management Microservice
wala.ammar@esprit.tn


Mouna ben Rebah
Not provided
Categories Module (Backend & Frontend)
mouna.benrebah@esprit.tn


Repository: femistore

📁 Project Structure
The FemiStore platform is composed of multiple microservices and a frontend module, each handling a specific aspect of the e-commerce ecosystem:

Order Management Microservice (gestion_commandes): Manages customer orders, order items, and statuses.
Product Management Microservice (femi-store-product): Handles product creation, updates, and advanced search with currency conversion.
Stock Management Microservice (TesnimStock): Manages inventory, stock trends, and demand forecasting.
Review Management Microservice (gestion_avis): Manages customer reviews, ratings, and alerts for significant rating drops.
Categories Module (femi-store-product/categories): Manages product categories and subcategories with a Spring Boot backend and Angular frontend.

High-Level Structure
femi-store/
├── gestion_commandes/                  # Order Management Microservice
├── femi-store-product/                 # Product Management Microservice
│   └── categories/                     # Categories Module (Backend & Frontend)
├── TesnimStock/                        # Stock Management Microservice
├── gestion_avis/                       # Review Management Microservice
└── README.md                           # Main project documentation


✅ Features
Order Management (gestion_commandes)

Create, update, and delete customer orders.
Track order statuses (PENDING, EXPIRED, DELIVERED, CANCELLED).
Calculate order totals and send confirmation emails.
Analyze order statistics (e.g., total revenue, average order value).
Identify top 5 most ordered products.
Handle abandoned orders with automatic expiration after 30 minutes.

Product Management (femi-store-product)

Add, update, delete, and retrieve products.
Apply percentage-based discounts and display discounted prices.
Convert prices to multiple currencies (e.g., TND to EUR, USD) using ExchangeRate-API.
Advanced product search by name, price range, stock, and discounted price.
Integration with Eureka for service discovery and API Gateway for routing.

Stock Management (TesnimStock)

Manage stock quantities with add, update, and verification operations.
Log stock movements in a stock_history table.
Predict demand using historical data.
Analyze stock trends with Alpha Vantage API.
Send automated email alerts when stock levels are below predicted demand.

Review Management (gestion_avis)

Manage customer reviews with CRUD operations.
Calculate average ratings per product.
Filter reviews by rating range or categorize them as positive/negative.
Send email alerts to admins when average ratings drop significantly or fall below a threshold.

Categories Module (femi-store-product/categories)

Create, update, delete, and view main categories and subcategories.
Paginated category listing with a custom dropdown for items per page.
Search categories by name.
Responsive UI with Angular Material for category management.
Role-based access (Admin users can edit/add categories).


🌐 API Endpoints
Order Management
Base Path: /orders

GET /orders: Retrieve all orders.
POST /orders: Create a new order.
PUT /orders/{id}: Update an order.
DELETE /orders/{id}: Delete an order.
GET /orders/stats: Get order statistics.
GET /orders/top-products: Get top 5 most ordered products.
PATCH /orders/{id}/status: Update order status.
GET /orders/status?status=PENDING: Filter orders by status.
GET /orders/abandoned?minutes=30: Get abandoned orders.
GET /orders/user/{userId}: Get orders by user ID.

Product Management
Base Path: /prd/product

GET /GetAllProducts: Retrieve all products.
GET /GetAllProductsInCurrency?currency={currency}: Get products in a specific currency.
GET /GetById/{id}: Get a product by ID.
POST /AddProduct: Add a new product.
PUT /UpdateProduct/{id}: Update a product.
DELETE /RemoveProduct/{id}: Delete a product.
GET /search?name={name}&minPrice={minPrice}&maxPrice={maxPrice}&minStock={minStock}&useDiscountedPrice={true/false}: Search products with filters.

Stock Management
Base Path: /femi/api/stock

GET /: Retrieve all stock entries.
GET /test-email: Test email configuration.
GET /{productId}: Get stock details by product ID.
GET /{productId}/check?quantity={quantity}: Check stock availability.
GET /{productId}/trend: Analyze stock trends.
GET /{productId}/demand-forecast: Forecast demand for the next 7 days.
POST /: Add a new stock entry.
PUT /{productId}?quantity={quantity}: Update stock quantity.
DELETE /{id}: Delete a stock entry.

Review Management
Base Path: /avis

GET /: Retrieve all reviews.
POST /: Add a new review.
DELETE /{id}: Delete a review.
GET /average/{productId}: Get average rating for a product.
PUT /{id}: Update a review.
GET /filter?min={min}&max={max}: Filter reviews by rating range.
GET /categorized?threshold={threshold}: Categorize reviews as positive/negative.
GET /highest-rated: Get reviews with the highest rating.
GET /lowest-rated: Get reviews with the lowest rating.

Categories (Backend)
Base Path: /api/categories

GET /: Retrieve main categories.
GET /subcategories/{parentId}: Retrieve subcategories.
GET /search?query={query}: Search categories by name.
POST /: Add a new category.
PUT /{id}: Update a category.
DELETE /{id}: Delete a category.


🔧 Technologies Used
Backend (All Microservices)

Java 17
Spring Boot 3.x
Spring Data JPA
Spring Web (RESTful API)
Spring Mail (Email Notifications)
Spring Scheduling (Automated Tasks)
Spring Cloud Netflix Eureka Client (Service Discovery)
MySQL/H2 Database
Maven (Dependency Management)

External APIs

ExchangeRate-API: For currency conversion (Product Management).
Alpha Vantage API: For stock trend analysis (Stock Management).

Frontend (Categories Module)

Angular 17.x
Angular Material
TypeScript
RxJS
Node.js 18.x
npm


⚙️ Prerequisites

Java 17: For running backend microservices.
Maven: For building backend projects.
Node.js 18.x & npm: For the Angular frontend.
MySQL: For persistent storage (or H2 for testing).
Git: For cloning the repository.
Eureka Server: For service discovery (e.g., http://localhost:8761).
API Gateway: For routing requests (optional).
ExchangeRate-API Key: For currency conversion (Product Management).
Alpha Vantage API Key: For stock trend analysis (Stock Management).


🚀 Setup Instructions
1. Clone the Repository
git clone https://github.com/maryem001/femistore.git
cd femistore

2. Set Up the Database

Create a MySQL database named femistore:
CREATE DATABASE femistore;


Alternatively, use H2 in-memory database for testing (configured by default in some microservices).


3. Configure Eureka Server

Ensure a Eureka server is running at http://localhost:8761.

Update each microservice’s application.properties:
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/



4. Set Up Each Microservice
Order Management (gestion_commandes)

Navigate to the folder:
cd gestion_commandes


Configure application.properties:

Set up H2 database or MySQL.
Configure email settings (spring.mail.*).


Run the service:
mvn spring-boot:run


Access at http://localhost:8087.


Product Management (femi-store-product)

Navigate to the folder:
cd femi-store-product


Configure application.properties:

Set up MySQL (spring.datasource.*).

Add ExchangeRate-API key:
exchangerate.api.key=your_api_key_here




Run the service:
mvn spring-boot:run


Access at http://localhost:8083/prd.


Stock Management (TesnimStock)

Navigate to the folder:
cd TesnimStock


Configure application.properties:

Set up MySQL (spring.datasource.*).
Configure email settings (spring.mail.*).
Add Alpha Vantage API key.


Run the service:
mvn spring-boot:run


Access at http://localhost:8080/femi/api/stock.


Review Management (gestion_avis)

Navigate to the folder:
cd gestion_avis


Configure application.properties:

Set up H2 database or MySQL.
Configure email settings (spring.mail.*).
Set alert thresholds (avis.alert.*).


Run the service:
mvn spring-boot:run


Access at http://localhost:8089/avis.


Categories Module (Backend & Frontend)
Backend:

Navigate to the folder:
cd femi-store-product/categories/backend


Configure application.properties:

Set up H2 or MySQL.
Configure Eureka client.


Run the backend:
mvn spring-boot:run


Access at http://localhost:8080/api/categories.


Frontend:

Navigate to the folder:
cd femi-store-product/categories/frontend


Install dependencies:
npm install


Run the frontend:
ng serve


Access at http://localhost:4200.



📡 Running the Application

Start the Eureka server (if not already running).
Start each microservice as described above.
Start the Angular frontend for the Categories Module.
Use Postman or a browser to interact with the API endpoints.
Access the Eureka dashboard at http://localhost:8761 to verify service registration.


🔮 Future Enhancements

Order Management: Add payment integration and order tracking.
Product Management: Support for product variants (e.g., sizes, colors).
Stock Management: Refine demand prediction algorithms and add batch import/export.
Review Management: Add sentiment analysis for reviews.
Categories Module: Integrate with Product Management to display products under categories.


📬 Support
For issues or feature requests, contact the team:

Meriem Touzri: GitHub
Chayma Fouzri: chayma.fouzri@esprit.tn
Tesnim Satouri: tesnim.satouri@esprit.tn
Wala Ammar: GitHub
Mouna ben rebah : mouna.benrebah@esprit.tn


📜 License
FemiStore is an academic project developed as part of the Microservices module at ESPRIT under the AFL-3.0 license.

