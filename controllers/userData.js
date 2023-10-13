import { db } from "../db.js";

export const getUserData = (req, res) => {
  const id = req.params.id;
  const querry = "select * from Users where userName = ?";
  db.query(querry, [id], (err, data) => {
    if (err) return res.status(500).json(err);
    if(data.length==0) return res.status(404).json("No user Found!");
    const { password, ...rest } = data[0];
    res.status(200).json(rest);
  });
};
