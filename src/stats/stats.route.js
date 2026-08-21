import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ success: true, message: "Stats route working!" });
});

export default router;