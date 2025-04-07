
# FemiStore
---
## Stock Management Service  
**TesnimStock branch**  
**Implemented by Tesnim Satouri**

- **Overview**: Manages inventory in `FemiStore` using Spring Boot and WebFlux, with data stored in a MySQL database (`femistore`).
- **Core Features**:
  - Add, update, delete, and check stock levels.
  - Log stock changes in `stock_history`.
- **Advanced Features**: Stock Trend Analysis with Prediction, History, and Replenishment Mailing
  - Predicts demand using `stock_history`.
  - Analyzes trends and emails the Admin if stock is low (`stockDisponible < predictedDemand`).
- **APIs Used**:
  - Alpha Vantage API (for trend analysis, with fallback).
  - Spring `JavaMailSender` (for email notifications).
- **Endpoints**:
  - `GET /femi/api/stock`: Retrieve all stock entries.
  - `GET /femi/api/stock/test-email`: Test email configuration.
  - `GET /femi/api/stock/{productId}`: Retrieve stock by product ID.
  - `GET /femi/api/stock/{productId}/check?quantity={quantity}`: Check stock availability.
  - `GET /femi/api/stock/{productId}/trend`: Analyze stock trends.
  - `GET /femi/api/stock/{productId}/demand-forecast`: Predict demand for the next 7 days.
  - `POST /femi/api/stock`: Add a new stock entry.
  - `PUT /femi/api/stock/{productId}?quantity={quantity}`: Update stock quantity.
  - `DELETE /femi/api/stock/{id}`: Delete stock by ID.
- **Setup**: Run with `mvn spring-boot:run` after configuring MySQL and email settings in `application.properties`.
- **Future Enhancements**: Improve trend analysis and notification details.
- **Support**: Email `tesnim.satouri@esprit.tn`.
