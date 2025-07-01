const User = require('./user');
const AppError = require('./errors');

class UserManager {
  constructor() {
    this.users = [];
  }

  addUser(nom, email) {
    // Vérifier l'unicité du mail
    if (this.users.some((user) => user.email === email)) {
      throw new AppError('Email already in use', 'EMAIL_IN_USE');
    }

    const newUser = new User(nom, email);
    this.users.push(newUser);
    return newUser;
  }

  getUserById(id) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new AppError('User not found', 'USER_NOT_FOUND');
    }
    return user;
  }

  listUsers(options = {}) {
    const { page = 1, limit = 20, sort = { field: 'nom', order: 'asc' } } = options;

    let filteredUsers = [...this.users];

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