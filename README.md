# ⭐ Gestion Avis - Microservice

Microservice Spring Boot pour la gestion des avis clients sur des produits, incluant le calcul de statistiques et un système d'alertes par e-mail.

<!-- Remplacez les placeholders par les vraies informations si votre dépôt est sur GitHub -->
![Current Version](https://img.shields.io/badge/version-0.0.1--SNAPSHOT-blue)
![GitHub contributors](https://img.shields.io/github/contributors/VOTRE_NOM_UTILISATEUR_GITHUB/VOTRE_REPO_NAME)
![GitHub stars](https://img.shields.io/github/stars/VOTRE_NOM_UTILISATEUR_GITHUB/VOTRE_REPO_NAME)
![GitHub top language](https://img.shields.io/github/languages/top/VOTRE_NOM_UTILISATEUR_GITHUB/VOTRE_REPO_NAME)

   **Coached by:** [sarra abidi]
   **Created by:** [wala ammar]

## 👩‍💻 Auteur

- *Nom d'utilisateur GitHub :* [walaammar]
- *Nom du repository :* [femistore]

## Table of Contents

[📖 Présentation du Projet](#📖-présentation-du-projet)
[📁 Structure du Projet](#📁-structure-du-projet)
[✅ Fonctionnalités](#✅-fonctionnalités)
[🌐 API REST - AvisController](#🌐-api-rest---aviscontroller)
[🔧 Technologies utilisées](#🔧-technologies-utilisées)
[📧 Alertes par E-mail](#📧-alertes-par-e-mail)
[⚙️ Configuration (application.properties)](#⚙️-configuration-applicationproperties)
[🚀 Démarrer le projet](#🚀-démarrer-le-projet)
[📜 License](#📜-license)

## 📖 Présentation du Projet

Ce microservice Spring Boot fournit une API RESTful pour gérer les avis (reviews) laissés par les utilisateurs sur des produits. Il permet les opérations CRUD standard, le calcul de notes moyennes, le filtrage avancé des avis, et l'envoi d'alertes par e-mail aux administrateurs en cas de variations négatives significatives des notes.

## 📁 Structure du Projet
gestion_avis/
├── .mvn/
├── src/
│ ├── main/
│ │ ├── java/
│ │ │ └── com/esprit/twin/gestion_avis/
│ │ │ ├── controller/
│ │ │ │ └── Aviscontroller.java # Contrôleur REST pour les avis
│ │ │ ├── entity/
│ │ │ │ └── Avis.java # Entité JPA représentant un avis
│ │ │ ├── repository/
│ │ │ │ └── Avisrepository.java # Interface Spring Data JPA pour l'accès aux données
│ │ │ ├── service/
│ │ │ │ ├── Avisservice.java # Logique métier principale
│ │ │ │ ├── EmailService.java # Service d'envoi d'e-mails
│ │ │ │ └── Iserviceimpl.java # Interface définissant les services
│ │ │ └── GestionAvisApplication.java # Point d'entrée de l'application
│ │ └── resources/
│ │ └── application.properties # Fichier de configuration Spring Boot
│ └── test/
│ └── java/
│ └── com/esprit/twin/gestion_avis/
│ └── GestionAvisApplicationTests.java # Tests unitaires/intégration
├── .gitattributes
├── .gitignore
├── mvnw
├── mvnw.cmd
└── pom.xml # Fichier de configuration Maven

## ✅ Fonctionnalités

### 🎯 Avisservice (Implémentation de `Iserviceimpl`)

- `getAllReviews()` : Récupérer tous les avis enregistrés.
- `addReview(Avis a)` : Ajouter un nouvel avis. Déclenche le calcul de la nouvelle moyenne et potentiellement une alerte email.
- `deleteReview(Long id)` : Supprimer un avis par son identifiant.
- `getAverageRating(Long productId)` : Calculer et retourner la note moyenne pour un produit donné.
- `updateReview(Long id, Avis a)` : Mettre à jour un avis existant. Recalcule la moyenne et peut déclencher une alerte email si la note change.
- `getReviewsByNoteRange(int min, int max)` : Récupérer les avis dont la note est comprise dans une fourchette spécifiée.
- `categorizeReviewsByPositivity(int threshold)` : Séparer les avis en deux listes ("positive", "negative") basées sur un seuil de note.
- `getReviewsWithHighestNote()` : Obtenir la liste des avis ayant la note maximale attribuée.
- `getReviewsWithLowestNote()` : Obtenir la liste des avis ayant la note minimale attribuée.
- `checkAndSendAlert(...)` (privé) : Vérifie si les conditions d'alerte sont remplies (moyenne sous seuil critique ou baisse significative) et appelle `EmailService`.

### 📧 EmailService

- `sendAverageRatingDropAlert(...)` : Construit et envoie un e-mail d'alerte formaté lorsque la note moyenne d'un produit baisse de manière significative ou passe sous un seuil critique.

## 🌐 API REST - AvisController

| Méthode HTTP | Chemin                     | Description                                                      | Corps Requis | Paramètres Query               |
| :----------- | :------------------------- | :--------------------------------------------------------------- | :----------- | :----------------------------- |
| `GET`        | `/avis`                    | Récupérer tous les avis.                                         | Non          | -                              |
| `POST`       | `/avis`                    | Ajouter un nouvel avis.                                          | Oui (`Avis`) | -                              |
| `DELETE`     | `/avis/{id}`               | Supprimer un avis par son ID.                                    | Non          | -                              |
| `GET`        | `/avis/average/{productId}`| Obtenir la note moyenne pour un produit spécifique.              | Non          | -                              |
| `PUT`        | `/avis/{id}`               | Mettre à jour un avis existant par son ID.                       | Oui (`Avis`) | -                              |
| `GET`        | `/avis/filter`             | Filtrer les avis par une fourchette de notes (min/max incluses). | Non          | `min` (int), `max` (int)     |
| `GET`        | `/avis/categorized`        | Catégoriser les avis en 'positifs' et 'négatifs'.                | Non          | `threshold` (int, défaut: 3) |
| `GET`        | `/avis/highest-rated`      | Récupérer les avis ayant la note maximale.                       | Non          | -                              |
| `GET`        | `/avis/lowest-rated`       | Récupérer les avis ayant la note minimale.                       | Non          | -                              |

## 🔧 Technologies utilisées

- Java 17
- Spring Boot 3.x
- Spring Data JPA
- Spring Web (RESTful API)
- Spring Mail
- H2 Database (Base de données en mémoire)
- Lombok (Réduction du code répétitif)
- Maven (Gestion des dépendances et build)
- Spring Cloud Netflix Eureka Client (pour la découverte de services, configurable)
- Spring Cloud Config Client (pour la configuration centralisée, configurable)

## 📧 Alertes par E-mail

Une fonctionnalité clé est l'envoi automatique d'e-mails d'alerte via `EmailService` lorsque :
1.  La nouvelle note moyenne d'un produit passe **en dessous du seuil critique** défini (`avis.alert.critical-threshold`).
2.  La note moyenne d'un produit subit une **baisse supérieure ou égale** à la valeur définie (`avis.alert.significant-drop`).

L'e-mail est envoyé à l'adresse configurée dans `avis.alert.recipient-email`.

## ⚙️ Configuration (application.properties)

Le fichier `src/main/resources/application.properties` contient la configuration essentielle :

- **Base de données H2 :** URL, identifiants, activation de la console H2 (`/h2`).
- **Serveur :** Port d'écoute (`server.port=8089`).
- **Eureka Client :** Activation et URL du serveur Eureka (si utilisé).
- **Spring Cloud Config :** Activation (désactivé par défaut ici).
- **Serveur Mail (SMTP) :** Hôte, port, identifiants (`spring.mail.*`). **Attention : Ne commitez pas vos mots de passe réels. Utilisez des mots de passe d'application ou des méthodes sécurisées.**
- **Seuils d'Alerte :** `avis.alert.critical-threshold`, `avis.alert.significant-drop`.
- **Emails d'Alerte :** Adresse du destinataire (`avis.alert.recipient-email`) et de l'expéditeur (`avis.alert.from-email`).

## 🚀 Démarrer le projet

1.  **Cloner le dépôt :**
    ```bash
    git clone https://github.com/walaammar/femistore.git
    cd femistore
    ```
2.  **Configurer `application.properties` :** Assurez-vous que les configurations SMTP (`spring.mail.*`) et les emails d'alerte (`avis.alert.*`) sont correctement définis pour vos tests.
3.  **Lancer l'application via Maven Wrapper :**
    *   Sur Linux/macOS :
        ```bash
        ./mvnw spring-boot:run
        ```
    *   Sur Windows :
        ```bash
        ./mvnw.cmd spring-boot:run
        ```
4.  **Accéder à l'application :** L'API sera disponible sur `http://localhost:8089/avis`.
5.  **Accéder à la console H2 (optionnel) :** Ouvrez `http://localhost:8089/h2` dans votre navigateur (JDBC URL: `jdbc:h2:mem:reviewdb`, User Name: `sa`, Password: laisser vide).

## 📜 License

Ce microservice "Gestion Avis" est développé dans un cadre [ESPRIT/MICROSERVICE]. 

Ce microservice est conçu pour s'intégrer facilement dans une architecture e-commerce plus large, interagissant potentiellement avec des services de produits, utilisateurs, etc.
