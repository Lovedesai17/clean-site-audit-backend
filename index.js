import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { crawlWebsite } from './utils/crawler.js';
import { Audit } from './models/Audit.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.post('/start-audit', async (req, res) => {
  const { url } = req.body;
  try {
    const result = await crawlWebsite(url);
    const audit = new Audit({ url, result, status: 'completed' });
    await audit.save();
    res.json({ auditId: audit._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to audit' });
  }
});

app.get('/audit/:id', async (req, res) => {
  const audit = await Audit.findById(req.params.id);
  if (!audit) return res.status(404).json({ error: 'Audit not found' });
  res.json(audit);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));