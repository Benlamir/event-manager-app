# Project Plan: Event Manager

Ce document sert de contexte, de feuille de route et de liste de tâches pour le développement de l'application Event Manager.

## 1. Objectif du Projet

Construire une application web pour les streamers et créateurs de contenu afin d'automatiser et de simplifier l'organisation d'événements communautaires. L'application doit gérer la création d'événements, les inscriptions, les confirmations et les listes d'attente pour éliminer le travail manuel et améliorer l'expérience des participants.

## 2. Architecture Principale

L'application est construite sur une architecture "serverless" découplée, en utilisant les services AWS.

### Backend (AWS Serverless)

- **Framework**: AWS SAM (Serverless Application Model)
- **API**: API Gateway (HttpApi) avec CORS configuré
- **Logique Métier**: Fonctions Lambda en Python 3.12
- **Base de données**: Une seule table Amazon DynamoDB (EventsManagementTable) utilisant un design pattern "single-table" avec une clé composite (PK/SK)

### Frontend (Single-Page Application)

- **Technologie**: JavaScript vanilla (ES6 Modules), HTML5, CSS3
- **Hébergement**: AWS Amplify, connecté directement au dépôt GitHub pour un déploiement continu

## 3. État Actuel (au 21 Juin 2025)

### Fonctionnalités Terminées

#### Gestion des Événements:

- Création de nouveaux événements via l'interface utilisateur.
- Limitation à 10 événements maximum pour éviter les abus.
- Affichage de la liste de tous les événements dans la sidebar.
- Consultation des détails d'un événement sélectionné (onglet "Aperçu").
- Suppression d'un événement via l'interface.

#### Interface Utilisateur (UI/UX):

- Le titre de la sidebar est dynamique et affiche le nom de l'événement sélectionné.
- L'interface gère correctement le cas où aucun événement n'existe.
- Les listes sont rafraîchies dynamiquement après suppression/création.

#### Styling:

- Un thème de couleurs centralisé a été établi avec des variables CSS.
- Le popup de création d'événement possède un effet de verre (glassmorphism).
- Le style de l'élément sélectionné dans la liste est cohérent avec le reste du design.

### Bugs Corrigés

- Correction de multiples erreurs de déploiement et de configuration (CORS, Schéma DynamoDB, Région AWS).
- Correction de bugs d'affichage et de rafraîchissement de l'interface après les actions de l'utilisateur.

## 4. Liste des Tâches & Prochaines Étapes

Voici les prochaines étapes de développement, organisées par priorité.

### ☐ Priorité Haute : Finaliser le Dashboard pour le Streamer

#### [ ] Onglet "Participants":

Note : Le backend (GetParticipantsFunction) est déjà suffisant car il renvoie tous les participants. Le filtrage se fera sur le frontend.
- [ ] Interface de la Table : Construire l'interface de l'onglet pour afficher tous les participants dans une table avec les colonnes : "Nom d'utilisateur", "Statut", "Date d'inscription", "Actions".
- [ ] Badges de Statut : Styliser la colonne "Statut" avec des badges de couleur (pilules) pour chaque statut (Confirmé, Annulé, Inscrit, etc.) afin d'améliorer la lisibilité.
- [ ] Filtre par Statut : Ajouter un contrôle (par exemple, un menu déroulant) dans l'en-tête de la colonne "Statut" pour permettre au streamer de filtrer la liste des participants.
- [ ] Actions par Participant : Ajouter une colonne "Actions" avec des boutons pour chaque participant (par exemple, une icône de poubelle pour "expulser" et une icône d'œil pour "voir détails").

#### [ ] Onglet "Liste d'attente":

- [ ] Construire l'interface pour afficher la liste des participants en attente.
- [ ] Implémenter la logique pour promouvoir automatiquement un participant de la liste d'attente si une place se libère.

#### [ ] Formulaire de création d'événement:

- [ ] Rendre tous les champs du formulaire fonctionnels (plateforme d'appel vidéo, options "Demander l'UID", etc.).
- [ ] Gérer l'upload d'une image pour l'événement.

### ☐ Priorité Moyenne : Inscription des Participants & Notifications

#### [ ] Page d'Inscription Publique:

- [ ] Créer une nouvelle page HTML (ou une vue dans la SPA) pour qu'un spectateur puisse s'inscrire à un événement via un lien.
- [ ] Connecter le formulaire d'inscription à la fonction RegisterParticipantFunction.

#### [ ] Notifications par Email:

- [ ] Créer une nouvelle fonction Lambda qui utilise Amazon SES (Simple Email Service).
- [ ] Déclencher l'envoi d'un email lors de la confirmation d'inscription.
- [ ] Envoyer un email lorsqu'un participant passe de la liste d'attente à la liste principale.

#### [ ] Onglet "Configuration Email":

- [ ] Permettre au streamer de personnaliser le contenu des emails automatiques.

### ☐ Priorité Basse : Fonctionnalités Avancées

#### [ ] Authentification Utilisateur:

- [ ] Intégrer Amazon Cognito pour permettre aux streamers de se créer un compte et de se connecter.
- [ ] Lier les événements à l'ID de l'utilisateur authentifié.

#### [ ] Améliorations Visuelles:

- [ ] Ajouter des animations et des transitions pour rendre l'interface plus fluide.
