import database from '../../database';

class ProductController {
  async index(req, res) {
    let db;
    try {
      db = await database.getConnection();
      const result = await db.execute('SELECT * FROM products');
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
}

export default new ProductController();
