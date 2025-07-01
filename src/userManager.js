const User = require('./user');

class UserManager {
  constructor() {
    this.users = [];
  }

  addUser(nom, email) {
    // Vérifier l'unicité de l'email
    if (this.users.some((user) => user.email === email)) {
      throw new Error('Email already in use');
    }

    const newUser = new User(nom, email);
    this.users.push(newUser);
    return newUser;
  }

  getUserById(id) {
    return this.users.find((user) => user.id === id) || null;
  }

  listUsers(options = {}) {
    const { page = 1, limit = 20, sort = { field: 'nom', order: 'asc' } } = options;

    let filteredUsers = [...this.users];

    // Tri
    filteredUsers.sort((a, b) => {
      const fieldA = a[sort.field];
      const fieldB = b[sort.field];
      let comparison = 0;

      if (typeof fieldA === 'string') {
        comparison = fieldA.localeCompare(fieldB, undefined, {
          sensitivity: 'base',
        });
      } else {
        if (fieldA > fieldB) comparison = 1;
        if (fieldA < fieldB) comparison = -1;
      }

      return sort.order === 'desc' ? -comparison : comparison;
    });

    // Pagination
    const totalItems = filteredUsers.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedData = filteredUsers.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }
}

module.exports = UserManager; 