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
- `POST /femi/api/stock` – Add or update stock.
- `GET /femi/api/stock/{productId}/check?quantity={quantity}` – Check stock availability.
- `GET /femi/api/stock/{productId}/trend` – Analyze product stock trends.

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
