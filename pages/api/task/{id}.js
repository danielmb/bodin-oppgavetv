import nextConnect from 'next-connect';
import { connectToDatabase } from '../../../lib/db';
const apiRoute = nextConnect({
  onError(err, req, res) {
    console.log(err);
    res.status(500).json({ error: err });
  },
  onNoMatch(req, res) {
    res.status(404).json({ error: 'Not found' });
  },
});

apiRoute.get(async () => {
  let { db } = await connectToDatabase();
  let { id } = req.query;
  let results = await db
    .collection('tasks')
    .find({
      id: parseInt(id),
    })
    .toArray();
  return results;
});

export default apiRoute;
