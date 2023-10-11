import { db } from "../db.js";

export const getUserData = (req, res) => {
  const id = req.params.id;
  const querry = "select * from Users where userId = ?";
  db.query(querry, [id], (err, data) => {
    if (err) res.status(500).json(err);
    const { password, ...rest } = data[0];
    res.status(200).json(rest);
  });
};
