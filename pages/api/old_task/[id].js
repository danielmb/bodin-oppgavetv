import excuteQuery from '../../../lib/db';
import moment from 'moment';
export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      {
        try {
          const query = req.query;
          const { id } = query;
          let result;
          if (!id || isNaN(id))
            return res.status(400).json({ error: 'Bad request' });
          result = await excuteQuery({
            query: `SELECT * FROM tasks WHERE id = ?`,
            values: [id],
          });
          if (result.error)
            return res.status(500).json({ error: result.error });
          if (result.length === 0)
            return res.status(404).json({ error: 'Not found' });
          res.status(200).json(result);
        } catch (error) {
          console.log(error);
          res.status(500).json({ error });
        }
      }
      break;

    case 'PUT':
      {
        try {
          let body;
          body = req.body;
          let dateObjects = [
            'start',
            'doneby',
            'done',
            'created_at',
            'updated_at',
          ];
          for (let d of dateObjects) {
            if (body[d]) {
              body[d] = moment(body[d]).format('YYYY-MM-DD HH:mm:ss');
            }
          }
          let {
            what,
            where,
            priority,
            start,
            doneby,
            done,
            created_at,
            updated_at,
          } = body;
          const { id } = req.query;
          const result = await excuteQuery({
            query: `UPDATE tasks SET what = ?, tasks.where = ?, priority = ?, start = ?, doneby = ?, done = ?, created_at = ?, updated_at = ? WHERE id = ?`,
            values: [
              what,
              where,
              priority,
              start,
              doneby,
              done,
              created_at,
              updated_at,
              id,
            ],
          });

          if (result.error)
            return res.status(500).json({ error: result.error });
          if (result.affectedRows === 0)
            return res.status(404).json({ error: 'Not found' });
          res.status(200).json(result);
        } catch (error) {
          console.log(error);
          res.status(500).json({ error });
        }
      }
      break;
    case 'DELETE':
      {
        try {
          const query = req.query;
          const { id } = body;
          console.log(id);
          const result = await excuteQuery({
            query: `DELETE FROM tasks WHERE id = ?`,
            values: [id],
          });
          res.status(200).json(result);
        } catch (error) {
          res.status(500).json({ error });
        }
      }
      break;
    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}
