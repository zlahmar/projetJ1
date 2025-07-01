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

3. **Lancer les tests automatiques**

   Pour vérifier que toutes les fonctionnalités sont conformes aux user stories, lancez :

   ```bash
   npm test
   ```

   Tous les tests doivent passer pour garantir le bon fonctionnement de l'application.

## Fonctionnalités principales

- **Gestion des utilisateurs** : création, validation, unicité de l'email, pagination, tri, recherche par ID.
- **Gestion des tâches** : création, assignation à un utilisateur, priorités, tags, échéances, historique, pagination, tri, filtres avancés.

## User Stories

### Tâches

- **US001 - Créer une tâche**
  - En tant qu'utilisateur, je peux créer une tâche avec un titre, une description optionnelle, un statut par défaut "TODO", une date de création, et l'assigner à un utilisateur.
- **US002 - Consulter une tâche**
  - En tant qu'utilisateur, je peux consulter le détail d'une tâche (titre, description, statut, date de création, utilisateur assigné, etc.).
- **US003 - Modifier une tâche**
  - En tant qu'utilisateur, je peux modifier le titre, la description ou d'autres propriétés d'une tâche existante.
- **US004 - Changer le statut d'une tâche**
  - En tant qu'utilisateur, je peux changer le statut d'une tâche (par exemple : TODO, ONGOING, DONE).
- **US005 - Supprimer une tâche**
  - En tant qu'utilisateur, je peux supprimer une tâche de la liste.
- **US006 - Lister mes tâches avec pagination**
  - En tant qu'utilisateur, je peux lister toutes les tâches avec un système de pagination pour faciliter la navigation.
- **US007 - Rechercher des tâches**
  - En tant qu'utilisateur, je peux rechercher des tâches par mot-clé dans le titre ou la description.
- **US008 - Filtrer par statut**
  - En tant qu'utilisateur, je peux filtrer la liste des tâches selon leur statut (TODO, ONGOING, DONE).
- **US009 - Trier les tâches**
  - En tant qu'utilisateur, je peux trier les tâches par titre, date de création, priorité, etc.

### Utilisateurs

- **US010 - Créer un utilisateur**
  - En tant qu'utilisateur, je peux créer un utilisateur avec un nom et un email valides. Le nom est requis, ne doit pas dépasser 50 caractères. L'email est requis, doit être unique et au bon format.
- **US011 - Lister les utilisateurs**
  - En tant qu'utilisateur, je peux lister tous les utilisateurs, paginer et trier la liste par nom.

### Assignation et filtres avancés

- **US012 - Assigner une tâche**
  - En tant qu'utilisateur, je peux assigner une tâche à un utilisateur spécifique.
- **US013 - Filtrer par utilisateur assigné**
  - En tant qu'utilisateur, je peux filtrer la liste des tâches pour n'afficher que celles qui sont assignées à un utilisateur donné.

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
  - [@Mickael-G](https://github.com/zlahmar)
  - [@Mickael-G](https://github.com/Omersi33)
