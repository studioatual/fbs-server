import jwt from 'jsonwebtoken';
import database from '../../database';
import authConfig from '../../config/auth';

class AuthController {
  async store(req, res) {
    const { email, password } = req.body;
    let db;
    try {
      db = await database.getConnection();
      const result = await db.execute(
        `SELECT * FROM clients WHERE email = '${email}' AND password = '${password}'`
      );
      if (!result.rows.length) {
        return res.status(400).json({ error: 'Dados inválidos!' });
      }
      const id = result.rows[0].ID;
      const name = result.rows[0].NAME;
      const user = {
        id,
        name,
        email,
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      };
      return res.json(user);
    } catch (err) {
      return res.status(500).json({ error: err.message });
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

export default new AuthController();
