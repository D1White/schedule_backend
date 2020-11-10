const express = require("express");
const { faunadb, client } = require('../core/db');

const { urlParser } = require("../utils/urlParser");

const { Get, Ref, Collection, Update, Map, Paginate, Index, Lambda, Match } = faunadb.query;

class GroupController {
  async index(_, res) {
    try {

      // const doc = await client.query(
      //   Get(
      //     Ref(Collection("schedule"), "280711444225327623")
      //   )
      // )
      const doc = await client.query(
        Map(
          Paginate(Match(Index('allRef'))),
          Lambda((ref, ts) => Get(ref))
          )
      )

      res.send(doc.data[doc.data.length - 1]);

      // res.json({
      //   status: "succes",
      //   data: doc.data[doc.data.length - 1],
      // });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error,
      });
    }
  }
  async update(_, res) {
    try {
      
      urlParser();

      res.json({
        status: "succes",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error,
      });
    }
  }
  async downloadUrl(_, res) {
    try {

      const doc = await client.query(
        Get(
          Ref(Collection("downloadUrl"), "280625102128677381")
        )
      )

      res.send(doc);

      // res.json({
      //   status: "succes",
      //   data: [],
      // });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error,
      });
    }
  }
}

const GroupCtrl = new GroupController();
exports.GroupCtrl = GroupCtrl;