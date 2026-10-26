'use strict';
const {createAdminHandler} = require('../../server/study-korea/admin-service.cjs');
// Intentionally unwired: no production authentication or database is configured.
// Environment flags alone cannot enable this API. See docs/study-korea-admin-api.md.
exports.handler = createAdminHandler();
