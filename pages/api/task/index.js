import excuteQuery from '../../../lib/db';
export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      {
        try {
          let result;
          result = await excuteQuery({
            query: `SELECT * FROM tasks`,
            values: [],
          });
          if (result.error)
            return res.status(500).json({ error: result.error });

          res.status(200).json(result);
        } catch (error) {
          console.log(error);
          res.status(500).json({ error });
        }
      }
      break;
    case 'POST':
      {
        try {
          const body = req.body;
          const {
            what,
            where,
            priority,
            start,
            doneby,
            done,
            created_at,
            updated_at,
          } = body;
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
          const result = await excuteQuery({
            query: `INSERT INTO tasks (what, where, priority, start, doneby, done, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            values: [
              what,
              where,
              priority,
              start,
              doneby,
              done,
              created_at,
              updated_at,
            ],
          });
          if (result.error)
            return res.status(500).json({ error: result.error });
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
