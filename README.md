# Gestionnaire de Tâches et Utilisateurs

## Présentation

Ce projet est une application Node.js permettant de gérer des utilisateurs et des tâches, avec des fonctionnalités avancées comme la pagination, la gestion des priorités, des tags, des échéances, et l'historique des actions.

## Installation

1. Clonez le dépôt :
   ```bash
   git clone <url-du-repo>
   cd <nom-du-repo>
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```

## Utilisation

- Le point d'entrée principal est `index.js`.
- Les classes principales sont dans le dossier `src/` :
  - `user.js` : gestion des utilisateurs
  - `userManager.js` : gestion de la liste des utilisateurs
  - `task.js` : gestion des tâches
  - `taskManager.js` : gestion de la liste des tâches

## Lancer l'application

Pour exécuter l'application et vérifier son bon fonctionnement :

1. **Lancer l'application principale**

   Dans le terminal, à la racine du projet, lancez :

   ```bash
   node index.js
   ```

   Par défaut, le résultat s'affichera dans la console (voir les messages ou objets affichés par `console.log`).

2. **Vérifier le bon fonctionnement**
   - Si l'application démarre sans erreur et affiche des informations sur les tâches ou utilisateurs, c'est que l'installation est correcte.
   - Pour tester les fonctionnalités, modifiez ou ajoutez des instructions dans `index.js` (par exemple, création de tâches, d'utilisateurs, etc.).

3. **Lancer les tests**

   Le projet utilise [Jest](https://jestjs.io/) comme framework de tests automatisés.

   Pour exécuter la suite de tests :

   ```bash
   npm test
   ```

   Si Jest n'est pas installé globalement, il sera installé automatiquement via les dépendances du projet (`npm install`).

   Tous les tests doivent passer pour garantir le bon fonctionnement de l'application.

## Fonctionnalités principales

- **Gestion des utilisateurs** : création, validation, unicité de l'email, pagination, tri, recherche par ID.
- **Gestion des tâches** : création, assignation à un utilisateur, priorités, tags, échéances, historique, pagination, tri, filtres avancés.

## User Stories

### Tâches

- **US001 - Créer une tâche**
- **US002 - Consulter une tâche**
- **US003 - Modifier une tâche**
- **US004 - Changer le statut d'une tâche**
- **US005 - Supprimer une tâche**
- **US006 - Lister mes tâches avec pagination**
- **US007 - Rechercher des tâches**
- **US008 - Filtrer par statut**
- **US009 - Trier les tâches**

### Utilisateurs

- **US010 - Créer un utilisateur**
- **US011 - Lister les utilisateurs**

### Assignation et filtres avancés

- **US012 - Assigner une tâche**
- **US013 - Filtrer par utilisateur assigné**

## Structure du projet

```
├── src/
│   ├── errors.js
│   ├── user.js
│   ├── userManager.js
│   ├── task.js
│   └── taskManager.js
├── tests/
│   ├── user.test.js
│   ├── userManager.test.js
│   ├── task.test.js
│   └── taskManager.test.js
├── index.js
└── README.md
```

## Gestion des erreurs

L'application utilise une classe d'erreur personnalisée `AppError` pour centraliser la gestion des erreurs et fournir des codes d'erreur explicites.

### Codes d'erreur courants

- `EMAIL_IN_USE` : l'email est déjà utilisé
- `USER_NOT_FOUND` : utilisateur non trouvé
- `NAME_REQUIRED`, `NAME_TOO_LONG` : nom manquant ou trop long
- `EMAIL_REQUIRED`, `EMAIL_INVALID` : email manquant ou invalide
- `TASK_NOT_FOUND` : tâche non trouvée
- `TITLE_REQUIRED`, `TITLE_TOO_LONG` : titre manquant ou trop long
- `DESCRIPTION_TOO_LONG` : description trop longue
- `PRIORITY_INVALID` : priorité invalide
- `TAG_INVALID` : tag invalide
- `STATUS_INVALID` : statut invalide
- `DATE_INVALID` : date invalide

## Auteur

- Projet réalisé dans le cadre du M2 YNOV par :
  - [@zlahmar](https://github.com/zlahmar)
  - [@Omersi33](https://github.com/Omersi33)
