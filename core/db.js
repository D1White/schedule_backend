const faunadb = require('faunadb');

const client = new faunadb.Client({ secret: "fnAD5LbE9_ACByE9A9TxVsRsVbFEcRsrlgt09D21" });

exports.faunadb = faunadb;
exports.client = client;