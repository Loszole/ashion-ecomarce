import HomepageLayout from '../models/HomepageLayout.js';
import AuditLog from '../models/AuditLog.js';

export const getHomepageLayout = async (req, res) => {
  try {
    const layout = await HomepageLayout.findOne().sort({ updatedAt: -1 });
    res.json(layout);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateHomepageLayout = async (req, res) => {
  try {
    const { layout } = req.body;
    const homepageLayout = new HomepageLayout({ layout, updatedBy: req.user._id });
    await homepageLayout.save();
    await AuditLog.create({ user: req.user._id, action: 'update_homepage_layout', details: { layoutId: homepageLayout._id } });
    res.json(homepageLayout);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
