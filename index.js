const Task = require("./src/task");
const User = require("./src/user");
const UserManager = require("./src/userManager");
const TaskManager = require("./src/taskManager");

console.log("Bienvenue dans le gestionnaire de tâches !\n");

// 1. Créer plusieurs tâches et les afficher
const tache1 = new Task("Apprendre le TDD", "Écrire des tests avant le code.");
const tache2 = new Task("Lire la doc Node.js", "Comprendre les modules.");
const tache3 = new Task("Faire du sport", "30 minutes de marche.");
console.log("Tâches créées :", [tache1.titre, tache2.titre, tache3.titre]);

// 2. Créer des utilisateurs et les afficher
const userManager = new UserManager();
const alice = userManager.addUser("Alice", "alice@example.com");
const bob = userManager.addUser("Bob", "bob@example.com");
console.log("Utilisateurs créés :", userManager.listUsers().data.map(u => u.nom));

// Exemple 1 : Erreur d'email déjà utilisé
try {
  userManager.addUser("Alice", "alice@example.com");
} catch (err) {
  if (err.name === "AppError") {
    console.error(`[${err.code}] ${err.message}`);
  } else {
    console.error(err);
  }
}

// 3. Assigner une tâche à un utilisateur
const taskManager = new TaskManager(userManager);
taskManager.addTask(tache1);
taskManager.addTask(tache2);
taskManager.addTask(tache3);
taskManager.assignTask(tache1.id, alice.id);
console.log(`Tâche '${tache1.titre}' assignée à :`, tache1.assignee.nom);

// 4. Changer le statut d'une tâche
tache1.updateStatus("ONGOING");
console.log(`Statut de la tâche '${tache1.titre}' :`, tache1.statut);

// 5. Lister toutes les tâches
console.log("\nListe de toutes les tâches :");
taskManager.listTasks().data.forEach(t => {
  console.log(`- ${t.titre} [${t.statut}]`);
});

// 6. Filtrer les tâches par statut
console.log("\nTâches en cours :");
taskManager.listTasks({ filter: { status: "ONGOING" } }).data.forEach(t => {
  console.log(`- ${t.titre}`);
});

// 7. Trier les tâches par titre
console.log("\nTâches triées par titre :");
taskManager.listTasks({ sort: { field: "title", order: "asc" } }).data.forEach(t => {
  console.log(`- ${t.titre}`);
});

// 8. Afficher l'historique d'une tâche
console.log("\nHistorique de la tâche 'Apprendre le TDD' :");
taskManager.getTaskHistory(tache1.id).data.forEach(evt => {
  console.log(`[${evt.date.toLocaleString()}] ${evt.type}`, evt.data);
});

// 9. Ajouter une date d'échéance et une priorité à une tâche
const dueDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // dans 3 jours
taskManager.setTaskDueDate(tache2.id, dueDate);
taskManager.setTaskPriority(tache2.id, "HIGH");
console.log(`\nTâche '${tache2.titre}' : échéance = ${tache2.dueDate.toLocaleDateString()}, priorité = ${tache2.priority}`);

// Exemple 2 : Erreur tâche non trouvée
try {
  taskManager.getTaskById("id-inexistant");
} catch (err) {
  if (err.name === "AppError") {
    console.error(`[${err.code}] ${err.message}`);
  } else {
    console.error(err);
  }
}
