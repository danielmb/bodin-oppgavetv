import nextConnect from 'next-connect';
import { connectToDatabase } from '../../../lib/db';
import moment from 'moment';

const apiRoute = nextConnect({
  async onError(err, req, res) {
    try {
      let { db } = await connectToDatabase();
      await db.collection('errors').insertOne({
        ...{
          err,
        },
        ...{
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    } catch (error) {
      console.error("NOTICE: couldn't log error to database");
    }
    console.log(err);
    res.status(500).json({ error: err });
  },
  onNoMatch(req, res) {
    res.status(404).json({ error: 'Not found' });
  },
});

apiRoute.get(async (req, res) => {
  let { db } = await connectToDatabase();

  let results = await db.collection('tasks').find({}).toArray();
  if (results.error) return res.status(500).json({ error: results.error });
  return res.status(200).json(results);
});
apiRoute.post(async (req, res) => {
  let { db } = await connectToDatabase();
  console.log('!');
  let body = req.body;
  for (let d of ['start', 'doneby', 'done']) {
    if (body[d]) {
      body[d] = moment(body[d]).toDate();
    }
  }
  if (typeof body !== 'object')
    return res.status(400).json({ error: 'invalid body' });
  if (body.constructor !== Object)
    return res.status(400).json({ error: 'invalid body' });

  let dbData = {
    ...body,
    ...{
      created_at: new Date(),
      updated_at: new Date(),
    },
  };
  let result = await db.collection('tasks').insertOne(dbData);
  if (!result.acknowledged)
    return res.status(500).json({ error: 'insert failed' });
  console.log(result);
  return res.status(200).json({ ...{ _id: result.insertedId }, ...dbData });
});
export default apiRoute;
