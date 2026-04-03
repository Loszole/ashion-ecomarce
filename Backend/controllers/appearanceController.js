import SiteSetting from '../models/SiteSetting.js';

const getSetting = async (key, fallback = {}) => {
  const setting = await SiteSetting.findOne({ key });
  return setting?.value || fallback;
};

export const uploadBanner = async (req, res, next) => {
  try {
    const bannerUrl = req.file ? `/uploads/${req.file.filename}` : '';
    await SiteSetting.findOneAndUpdate(
      { key: 'appearance_banner' },
      { value: { bannerUrl } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, bannerUrl });
  } catch (err) {
    next(err);
  }
};

export const saveColors = async (req, res, next) => {
  try {
    const colors = {
      primary: req.body.primary || '#007bff',
      secondary: req.body.secondary || '#6c757d'
    };

    await SiteSetting.findOneAndUpdate(
      { key: 'appearance_colors' },
      { value: colors },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, data: colors });
  } catch (err) {
    next(err);
  }
};

export const getAppearance = async (req, res, next) => {
  try {
    const banner = await getSetting('appearance_banner', { bannerUrl: '' });
    const colors = await getSetting('appearance_colors', { primary: '#007bff', secondary: '#6c757d' });
    res.json({ banner, colors });
  } catch (err) {
    next(err);
  }
};
