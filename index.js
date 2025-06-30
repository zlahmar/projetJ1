const Task = require("./src/task");

console.log("Bienvenue dans le gestionnaire de tâches !");

// Ceci est un exemple simple de comment utiliser la classe Task.
// Plus tard, nous remplacerons cela par une vraie logique
// pour lire les commandes de l'utilisateur.

const maPremiereTache = new Task(
  "Apprendre le TDD",
  "Écrire des tests avant le code.",
);

console.log("Tâche créée avec succès :");
console.log(maPremiereTache);
