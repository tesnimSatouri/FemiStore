# femistore

# 🛒 Gestion des Commandes - Microservice

Microservice Spring Boot pour gérer les commandes, les articles commandés et les statuts dans une architecture orientée microservices.

![Current Version](https://img.shields.io/badge/version-v1.0-blue)
![GitHub contributors](https://img.shields.io/github/contributors/maryem001/femistore)
![GitHub stars](https://img.shields.io/github/stars/maryem001/femistore)
![GitHub top language](https://img.shields.io/github/languages/top/maryem001/femistore)

&nbsp;&nbsp;&nbsp;**Coached by:** `Sarra Abidi`  
&nbsp;&nbsp;&nbsp;**Created by:** `Meriem Touzri`

## 👩‍💻 Auteur

- **Nom d'utilisateur GitHub :** maryem001
- **Nom du repository :** femistore
## Table of Contents

- [📖 Présentation du Projet](#📖-présentation-du-projet)
- [👥 Membres de l'Équipe et Contributions](#👥-membres-de-léquipe-et-contributions)
- [📁 Structure du Projet](#📁-structure-du-projet)
- [✅ Fonctionnalités](#✅-fonctionnalités)
- [🌐 API REST - OrderController](#🌐-api-rest---ordercontroller)
- [🔧 Technologies utilisées](#🔧-technologies-utilisées)
- [📬 Email de Confirmation](#📬-email-de-confirmation)
- [📅 Tâches planifiées](#📅-tâches-planifiées)
- [⚙️ Configuration (application.properties)](#⚙️-configuration-applicationproperties)
- [🚀 Démarrer le projet](#🚀-démarrer-le-projet)
- [📜 License](#📜-license)

## 📁 Structure du projet

```
gestion_commandes/
├── controller/
│   └── OrderController.java
├── entity/
│   ├── Order.java
│   ├── OrderItem.java
│   └── OrderStatus.java
├── repository/
│   ├── OrderItemRepository.java
│   └── OrderRepository.java
├── service/
│   ├── EmailService.java
│   └── OrderService.java
├── resources/
│   └── application.properties
└── GestionCommandesApplication.java
```

## ✅ Fonctionnalités

### 🎯 OrderService

- `getAllOrders()` : Récupérer toutes les commandes.
- `createOrder()` : Créer une commande avec ses articles, calcule le prix total, envoie un email de confirmation.
- `updateOrder()` : Mettre à jour une commande et recalculer son prix.
- `deleteOrder()` : Supprimer une commande.
- `getOrderStats()` : Statistiques globales (nombre, revenus, moyenne).
- `getMostOrderedProducts()` : Top 5 des produits les plus commandés.
- `updateOrderStatus()` : Mise à jour du statut (`PENDING`, `EXPIRED`, `DELIVERED`, `CANCELLED`...).
- `getOrdersByStatus()` : Liste des commandes selon leur statut.
- `getAbandonedOrders()` : Récupérer les commandes abandonnées.
- `expireAbandonedOrders()` : Planificateur qui expire les commandes non finalisées.
- `getOrdersByUserId()` : Récupère les commandes d’un utilisateur spécifique.

### 🌐 OrderController

- `GET /orders` : Toutes les commandes.
- `POST /orders` : Créer une commande.
- `PUT /orders/{id}` : Modifier une commande.
- `DELETE /orders/{id}` : Supprimer une commande.
- `GET /orders/stats` : Statistiques générales.
- `GET /orders/top-products` : Top 5 produits.
- `PATCH /orders/{id}/status` : Mise à jour du statut.
- `GET /orders/status?status=PENDING` : Filtrer par statut.
- `GET /orders/abandoned?minutes=30` : Commandes abandonnées depuis 30 min.
- `GET /orders/user/{userId}` : Commandes d’un utilisateur.

## 🔧 Technologies utilisées

- Java 17
- Spring Boot
- Spring Data JPA
- H2 Database
- Spring Scheduling (tâches automatiques)
- RESTful API

## 📬 Email de Confirmation

Lors de la création d’une commande, un email de confirmation est envoyé via le `EmailService`.

## 📅 Tâches planifiées

- Expiration automatique des commandes **PENDING** après 30 minutes d'inactivité (via `@Scheduled`).

🚀 Démarrer le projet
1. Cloner le dépôt : git clone https://github.com/maryem001/femistore.git
2. Ouvrir le dossier gestion_commandes dans votre IDE (IntelliJ, VSCode...)

3. Lancer l'application avec Spring Boot

4. Accéder à la console H2 : http://localhost:8087/h2-console

## License

`Gestion Commandes` est un projet académique réalisé dans le cadre du module **Microservices** à ESPRIT sous licence AFL-3.0.

> Ce microservice est conçu pour être intégré dans un système plus large de e-commerce avec d'autres services comme produit, paiement, utilisateur...
