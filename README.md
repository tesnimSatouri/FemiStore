## 📦 Stock Management Service – `TesnimStock` Branch  
**Implemented by Tesnim Satouri**

### 🔍 Overview  
This service handles inventory operations for **FemiStore**, built with **Spring Boot** and **Spring WebFlux**. It leverages a **MySQL** database (`femistore`) to store and manage stock data.

---

### ✨ Core Features
- Add, update, and verify stock quantities.
- Log every stock movement in the `stock_history` table.

### 🚀 Advanced Features
- **Demand Prediction** using historical stock data.
- **Trend Analysis** to identify stock patterns.
- **Automated Email Alerts** to notify the admin when:
  - `stockDisponible < predictedDemand`.

---

### 🔗 APIs & Tools
- 📈 **Alpha Vantage API** – Used for stock trend analysis (with fallback support).
- 📧 **Spring JavaMailSender** – Sends notification emails.

---

### 📡 Endpoints
GET /femi/api/stock
➤ Retrieve all stock entries.

GET /femi/api/stock/test-email
➤ Test email configuration and delivery.

GET /femi/api/stock/{productId}
➤ Retrieve stock details by product ID.

GET /femi/api/stock/{productId}/check?quantity={quantity}
➤ Check if the specified quantity is available for a given product.

GET /femi/api/stock/{productId}/trend
➤ Analyze stock trends for a specific product.

GET /femi/api/stock/{productId}/demand-forecast
➤ Forecast demand for the next 7 days based on historical data.

POST /femi/api/stock
➤ Add a new stock entry.

PUT /femi/api/stock/{productId}?quantity={quantity}
➤ Update stock quantity for a specific product.

DELETE /femi/api/stock/{id}
➤ Delete a stock entry by its unique ID.

---

### ⚙️ Setup & Configuration
1. Configure your `application.properties`:
   - MySQL database credentials.
   - Email server settings.
2. Run the service with:
   ```bash
   mvn spring-boot:run
   ```

---

### 🔮 Future Enhancements
- Refine prediction algorithms.
- Add detailed reporting in email notifications.
- Introduce batch stock import/export features.

---

### 📬 Support
For issues or feature requests, contact: **tesnim.satouri@esprit.tn**
