const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');

const User = require('../models/user');

AdminBro.registerAdapter(AdminBroMongoose)

const adminBro = new AdminBro({

});

module.exports = AdminBroExpress.buildRouter(adminBro);