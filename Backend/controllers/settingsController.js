import SiteSetting from '../models/SiteSetting.js';
import AppError from '../utils/AppError.js';

const defaults = {
  general: { siteName: 'Ashion', siteEmail: 'admin@example.com' },
  payment: { provider: 'cod', codEnabled: true, stripeEnabled: false, paypalEnabled: false },
  shipping: { method: 'standard', cost: 0 },
  seo: { metaTitle: 'Ashion Store', metaDescription: 'Fashion e-commerce store' },
  email: { smtpHost: '', smtpPort: '', smtpUser: '', smtpPass: '' }
};

const allowedSections = Object.keys(defaults);

const normalizeBoolean = (value, fallback = false) => {
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
};

const getSectionConfig = (section, value) => {
  if (section !== 'payment') {
    return value;
  }

  const merged = { ...defaults.payment, ...value };
  // Remove sensitive fields from response
  const safe = { ...merged };
  delete safe.apiKey;
  return {
    ...safe,
    codEnabled: normalizeBoolean(merged.codEnabled, true),
    stripeEnabled: normalizeBoolean(merged.stripeEnabled, false),
    paypalEnabled: normalizeBoolean(merged.paypalEnabled, false)
  };
};

const getSettingValue = async (section) => {
  const record = await SiteSetting.findOne({ key: section });
  if (!record) {
    return defaults[section];
  }

  return getSectionConfig(section, record.value || {});
};

export const getSettingsSection = async (req, res, next) => {
  try {
    const { section } = req.params;
    if (!allowedSections.includes(section)) {
      return next(new AppError('Unsupported settings section', 400));
    }

    const value = await getSettingValue(section);
    res.json(value);
  } catch (err) {
    next(err);
  }
};

export const saveSettingsSection = async (req, res, next) => {
  try {
    const { section } = req.params;
    if (!allowedSections.includes(section)) {
      return next(new AppError('Unsupported settings section', 400));
    }

    // Reject attempts to save sensitive fields
    if (section === 'payment' && req.body.apiKey) {
      return next(new AppError('Cannot modify API keys via admin panel. Use environment variables.', 403));
    }

    const mergedValue = getSectionConfig(section, { ...defaults[section], ...req.body });

    await SiteSetting.findOneAndUpdate(
      { key: section },
      { value: mergedValue },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, data: mergedValue });
  } catch (err) {
    next(err);
  }
};

export const getPaymentOptions = async (req, res, next) => {
  try {
    const payment = await getSettingValue('payment');
    const methods = [
      { code: 'cod', enabled: payment.codEnabled },
      { code: 'stripe', enabled: payment.stripeEnabled },
      { code: 'paypal', enabled: payment.paypalEnabled }
    ].filter((method) => method.enabled);

    res.json({
      methods,
      defaultMethod: payment.provider || 'cod'
    });
  } catch (err) {
    next(err);
  }
};
