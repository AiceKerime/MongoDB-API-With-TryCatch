const { ObjectId } = require('bson');
const express = require('express');
const router = express.Router();
const moment = require('moment')

module.exports = (db) => {
  // ROUTER GET
  router.get('/', (req, res) => {
    const page = req.query.page || 1;
    const limit = 3;
    const offset = (page - 1) * limit;

    const wheres = {}

    // SORTING
    const sortMongo = {}

    let sortBy = req.query.sortBy || "_id"
    let sortMode = req.query.sortMode || "asc"

    sortMongo[sortBy] = sortMode == "asc" ? 1 : -1;

    // FILTERS
    if (req.query.string) {
      wheres["string"] = new RegExp(`${req.query.string}`, 'i')
    }

    if (req.query.integer) {
      wheres['integer'] = parseInt(req.query.integer)
    }

    if (req.query.float) {
      wheres['float'] = JSON.parse(req.query.float)
    }

    if (req.query.startDate && req.query.endDate) {
      wheres["date"] = {
        $gte: new Date(`${req.query.startDate}`),
        $lte: new Date(`${req.query.endDate}`)
      }
    } else if (req.query.startDate) {
      wheres["date"] = { $gte: new Date(`${req.query.startDate}`) };
    } else if (req.query.endDate) {
      wheres["date"] = { $lte: new Date(`${req.query.endDate}`) };
    }

    if (req.query.boolean) {
      wheres['boolean'] = JSON.parse(req.query.boolean)
    }

    // Pagination
    db.collection("dataBread").find(wheres).count((err, data) => {
      if (err) { return res.json({ success: false }) }
      const total = data;
      const totalPages = Math.ceil(total / limit)
      const limitation = { limit: parseInt(limit), skip: offset }

      db.collection("dataBread").find(wheres).skip(offset).limit(limit, limitation).sort(sortMongo).toArray((err, data) => {
        if (err) return res.json({ success: false, err })
        res.json({
          success: true,
          data,
          limitation,
          page,
          offset,
          totalPages
        })
      })
    })
  });

  // ROUTER POST
  router.post('/add', (req, res) => {
    const { string, integer, float, date, boolean } = req.body

    let Obj = {
      string: string,
      integer: Number(integer),
      float: parseFloat(float),
      date: date,
      boolean: JSON.parse(boolean)
    }

    db.collection("dataBread").insertOne(Obj, (err) => {
      if (err) return res.json({ success: false })
      res.json({
        success: true
      })
    })
  });

  // ROUTER EDIT
  router.get('/edit/:id', (req, res) => {
    db.collection("dataBread").findOne({ "_id": ObjectId(`${req.params.id}`) }, (err, data) => {
      if (err) res.json({ success: false })
      if (data.length == 0) return res.json({ success: false, message: 'Failed to get data' })
      res.json({
        success: true,
        data: data[0]
      })
    })
  })

  router.put('/edit/:id', (req, res) => {
    const { string, integer, float, date, boolean } = req.body

    let Obj = {
      string: string,
      integer: Number(integer),
      float: parseFloat(float),
      date: date,
      boolean: JSON.parse(boolean)
    }

    db.collection("dataBread").updateOne({ "_id": ObjectId(`${req.params.id}`) }, { $set: Obj }, (err) => {
      if (err) return res.json({ success: false })
      res.json({
        success: true
      })
    })
  })

  // ROUTER DELETE
  router.delete('/delete/:id', (req, res) => {
    db.collection("dataBread").deleteOne({ "_id": ObjectId(`${req.params.id}`) }, (err) => {
      if (err) return res.json({ success: false })
      res.json({
        success: true
      })
    })
  });

  return router;
}