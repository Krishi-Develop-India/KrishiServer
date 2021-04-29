const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');

const User = require('../models/user');
const Ride = require('../models/rides');
const Service = require('../models/service');
const ActiveTractors = require('../models/tractorUser');

AdminBro.registerAdapter(AdminBroMongoose)

const adminBro = new AdminBro({
    resources: [
        {
            resource: User,
            options: {
                properties: {
                    _id: {
                        isVisible: false,
                    },
                    number: {
                        number: false,
                    },
                    name: {
                        isVisible: { list: true, filter: true, show: true, edit: false }
                    },
                    previousServices: {
                        isVisible: { list: true, filter: true, show: true, edit: false }
                    },
                    locations: {
                        isVisible: { list: true, filter: true, show: true, edit: false }
                    },
                    userType: {
                        isVisible: { list: true, filter: true, show: true, edit: false }
                    },
                    rating: {
                        isVisible: { list: true, filter: true, show: true, edit: false }
                    },
                    uri: {
                        isVisible: { list: true, filter: true, show: true, edit: false }
                    },
                    vehicle: {
                        isVisible: { list: true, filter: true, show: true, edit: false }
                    },
                }
            }
        },
        {
            resource: Ride,
            options: {
                properties: {
                    _id: {
                        isVisible: false,
                    },
                    consumer: {
                        isVisible: { list: true, filter: true, show: true, edit: false }
                    },
                    provider: {
                        isVisible: { list: true, filter: true, show: true, edit: false }
                    },
                    price: {
                        isVisible: { list: true, filter: true, show: true, edit: false }
                    },
                    location: {
                        isVisible: { list: true, filter: true, show: true, edit: false }
                    },
                    serviceType: {
                        isVisible: { list: true, filter: true, show: true, edit: false }
                    },
                    status: {
                        isVisible: { list: true, filter: true, show: true, edit: false }
                    },
                },
            }
        },
        {
            resource: Service,
            options: {
                properties: {
                    _id: {
                        isVisible: false,
                    },
                    tractor: {
                        isVisible: { list: true, filter: true, show: true, edit: true }
                    },
                    harvester: {
                        isVisible: { list: true, filter: true, show: true, edit: true }
                    },
                    labour: {
                        isVisible: { list: true, filter: true, show: true, edit: true }
                    },
                    inventory: {
                        isVisible: { list: true, filter: true, show: true, edit: true }
                    },
                    area: {
                        isVisible: { list: true, filter: true, show: true, edit: false }
                    },
                },
            },
        },
        {
            resource: ActiveTractors,
            options: {
                properties: {
                    _id: {
                        isVisible: false,
                    },
                    name: {
                        isVisible: { list: true, filter: true, show: true, edit: false }
                    },
                    tractorNumber: {
                        isVisible: { list: true, filter: true, show: true, edit: false }
                    },
                    location: {
                        isVisible: { list: true, filter: true, show: true, edit: false }
                    },
                },
            },
        },
    ],
    branding: {
        companyName: 'Krishi Admin Portal'
    },
});

module.exports = AdminBroExpress.buildRouter(adminBro);