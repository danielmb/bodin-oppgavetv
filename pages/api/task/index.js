import nextConnect from 'next-connect';
import { connectToDatabase } from '../../../lib/db';
const apiRoute = nextConnect({
  onError(err, req, res) {
    console.log(err);
    res.status(500).json({ error: err });
  },
  onNoMatch(req, res) {
    console.log('no match');
    res.status(404).json({ error: 'Not found' });
  },
});

apiRoute.get(async () => {
  console.log('!');
  let { db } = await connectToDatabase();

  let results = await db.collection('tasks').find({}).toArray();
  return results;
});
apiRoute.post(async (req, res) => {
  let { db } = await connectToDatabase();
  console.log('!');
  let body = req.body;
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
