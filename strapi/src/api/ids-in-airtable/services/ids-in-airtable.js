'use strict';

/**
 * ids-in-airtable service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::ids-in-airtable.ids-in-airtable');
