const { ObjectId } = require('bson');
const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // ROUTER GET
  router.get('/', (req, res) => {
    db.collection("dataBread").find().toArray((err, data) => {
      if (err) return console.log({ success: false })
      res.json({
        success: true,
        data
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
      if (err) return console.log({ success: false })
      res.json({
        success: true
      })
    })
  });

  // ROUTER EDIT/PATCH
  router.patch('/edit/:id', (req, res) => {
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