import oracledb from 'oracledb';
import database from '../../database';

class OrderController {
  async index(req, res) {
    let db;
    try {
      db = await database.getConnection();
      const result = await db.execute(
        `SELECT orders.id AS id, SUM(orders_products.quantity) AS products, orders.total AS total, orders.created_at AS created_at FROM orders
        JOIN orders_products ON orders.id = orders_products.order_id
        WHERE client_id = ${req.clientId}
        GROUP BY orders.id, orders.total, orders.created_at
        ORDER BY orders.id DESC`
      );
      return res.json(result.rows);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    } finally {
      if (db) {
        try {
          await db.close();
        } catch (err) {
          console.log(err);
        }
      }
    }
  }

  async store(req, res) {
    let db;
    try {
      db = await database.getConnection();
      const nextResult = await db.execute(
        'SELECT seq_orders.NEXTVAL FROM dual'
      );
      const id = nextResult.rows[0].NEXTVAL;

      const { items } = req.body;
      let total = 0;
      const binds = [];
      items.forEach(item => {
        binds.push([id, item.id, item.quantity, item.price]);
        total += item.quantity * item.price;
      });
      const options = {
        autoCommit: true,
      };
      const result = await db.execute(
        `INSERT INTO orders VALUES (${id}, ${req.clientId},
          ${total.toFixed(2)}, LOCALTIMESTAMP, LOCALTIMESTAMP)`
      );

      const resultItems = await db.executeMany(
        `INSERT INTO orders_products VALUES (seq_orders_products.NEXTVAL, :1, :2, :3, :4, LOCALTIMESTAMP, LOCALTIMESTAMP)`,
        binds,
        options
      );

      return res.json(resultItems);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    } finally {
      if (db) {
        try {
          await db.close();
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
}

export default new OrderController();
