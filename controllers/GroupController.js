const express = require("express");
const { faunadb, client } = require('../core/db');

const { urlParser } = require("../utils/urlParser");

const { Get, Ref, Collection, Update, Map, Paginate, Index, Lambda, Match } = faunadb.query;

class GroupController {
  async index(_, res) {
    try {

      const doc = await client.query(
        Map(
          Paginate(Match(Index('allRef'))),
          Lambda((ref, ts) => Get(ref))
          )
      )

      res.send(doc.data[doc.data.length - 1]);

    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error,
      });
    }
  }

  async show(req, res) {
    try {
      const taskId = req.params.id;

      const doc = await client.query(
        Map(
          Paginate(Match(Index('allRef'))),
          Lambda((ref, ts) => Get(ref))
          )
      )

      const schedule = doc.data[doc.data.length - 1].data.schedule;

      if (!schedule) {
        res.status(404).send();
        return;
      }

      switch (parseInt(taskId)) {
        case 1:
          res.send(schedule.mon);
          break;
        case 2:
          res.send(schedule.tue);
          break;
        case 3:
          res.send(schedule.wed);
          break;
        case 4:
          res.send(schedule.thu);
          break;
        case 5:
          res.send(schedule.fri);
          break;
        default:
          res.status(404).send();
          break;
      }

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