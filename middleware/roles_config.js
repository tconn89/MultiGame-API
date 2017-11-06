roles = {};
roles.admin = {
  id: "admin",
  name: "Admin",
  description: "Manager of all",
  resource : [
      {
          id : 'binary_file', 
          permissions: ['create', 'read', 'update', 'delete']
      },
      {
          id : 'user',
          permissions: ['create', 'read', 'update', 'delete']
      },
      {
          id : 'journal',
          permissions: ['create', 'read', 'update', 'delete']
      },

  ]
};

roles.user = {
  id: "user",
  name: "User",
  description: "",
  resource : [
      {
          id : 'binary_file', 
          permissions: ['create', 'read', 'update' ]
      },
      {
          id : 'user',
          permissions: ['read']
      },
      {
          id : 'journal',
          permissions: ['create', 'read', 'update']
      },

  ]
};

module.exports = roles;