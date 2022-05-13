import nextConnect from 'next-connect';
import { connectToDatabase } from '../../../lib/db';
import { ObjectId } from 'mongodb';
import moment from 'moment';

const apiRoute = nextConnect({
  async onError(err, req, res) {
    try {
      let { db } = await connectToDatabase();
      let errorInsert = await db.collection('errors').insertOne({
        ...{
          err,
        },
        ...{
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      res.status(500).json({ errorId: errorInsert.insertedId });
    } catch (error) {
      console.error("NOTICE: couldn't log error to database");
    }
    console.log(err);
  },
  onNoMatch(req, res) {
    res.status(404).json({ error: 'Not found' });
  },
});

apiRoute.get(async (req, res) => {
  let { db } = await connectToDatabase();
  let { id } = req.query;
  let results = await db
    .collection('tasks')
    .find({
      _id: ObjectId(id),
    })
    .toArray();

  console.log(results);
  if (results.error) throw results.error;
  if (results.length === 0) return res.status(404).json({ error: 'Not found' });
  res.status(200).json(results);
});
apiRoute.put(async (req, res) => {
  let { db } = await connectToDatabase();
  let { id } = req.query;
  let body = req.body;
  if (typeof body == 'string') body = JSON.parse(body);
  if (typeof body !== 'object') throw { error: 'invalid body' };
  if (body.constructor !== Object) throw { error: 'invalid body' };
  if (body._id) delete body._id;
  console.log(body);
  let dateObjects = ['start', 'doneby', 'done'];
  for (let d of dateObjects) {
    if (
      body[d] &&
      body[d].constructor === String &&
      body[d].match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/)
    ) {
      body[d] = new Date(body[d]);
    } else {
      body[d] = null;
    }
  }

  console.log(body);
  let result = await db.collection('tasks').updateOne(
    { _id: ObjectId(id) },
    {
      $set: {
        ...body,
        ...{
          updated_at: new Date(),
        },
      },
    },
  );
  console.log(result);
  if (!result.acknowledged)
    return res.status(500).json({ error: 'update failed' });
  if (result.modifiedCount === 0)
    return res.status(404).json({ error: 'Not found' });
  res.status(200).json({ ...{ _id: id }, ...body });
});
apiRoute.delete(async (req, res) => {
  let { db } = await connectToDatabase();
  let { id } = req.query;
  console.log(id);
  let result = await db.collection('tasks').deleteOne({ _id: ObjectId(id) });
  if (!result.acknowledged)
    return res.status(500).json({ error: 'delete failed' });
  if (result.deletedCount === 0)
    return res.status(404).json({ error: 'Not found' });
  res.status(200).json({ ...{ _id: id } });
});

export default apiRoute;
