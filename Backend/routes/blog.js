import express from 'express';

const router = express.Router();

const blogPosts = [
  {
    _id: 'post-1',
    title: 'Streetwear Layers For Transitional Weather',
    author: 'Admin',
    image: '/img/blog/blog-1.jpg',
    createdAt: '2026-02-10T10:00:00.000Z',
    large: true
  },
  {
    _id: 'post-2',
    title: 'How To Build A Capsule Wardrobe In 10 Pieces',
    author: 'Admin',
    image: '/img/blog/blog-2.jpg',
    createdAt: '2026-02-06T10:00:00.000Z',
    large: false
  },
  {
    _id: 'post-3',
    title: 'Monochrome Looks That Never Feel Flat',
    author: 'Admin',
    image: '/img/blog/blog-3.jpg',
    createdAt: '2026-02-01T10:00:00.000Z',
    large: false
  },
  {
    _id: 'post-4',
    title: 'Weekend Minimal: Styling White Sneakers',
    author: 'Editor',
    image: '/img/blog/blog-4.jpg',
    createdAt: '2026-01-28T10:00:00.000Z',
    large: false
  },
  {
    _id: 'post-5',
    title: 'Color Blocking Tips For Bold Outfits',
    author: 'Editor',
    image: '/img/blog/blog-5.jpg',
    createdAt: '2026-01-20T10:00:00.000Z',
    large: true
  },
  {
    _id: 'post-6',
    title: 'Accessorizing Basics: From Day To Night',
    author: 'Admin',
    image: '/img/blog/blog-6.jpg',
    createdAt: '2026-01-11T10:00:00.000Z',
    large: false
  },
  {
    _id: 'post-7',
    title: 'Denim Fits Explained In Simple Terms',
    author: 'Editor',
    image: '/img/blog/blog-7.jpg',
    createdAt: '2026-01-05T10:00:00.000Z',
    large: false
  },
  {
    _id: 'post-8',
    title: 'Textures That Elevate A Basic Look',
    author: 'Admin',
    image: '/img/blog/blog-8.jpg',
    createdAt: '2025-12-29T10:00:00.000Z',
    large: false
  },
  {
    _id: 'post-9',
    title: 'Top 5 Winter Jackets Worth Owning',
    author: 'Editor',
    image: '/img/blog/blog-9.jpg',
    createdAt: '2025-12-20T10:00:00.000Z',
    large: true
  },
  {
    _id: 'post-10',
    title: 'Wardrobe Maintenance: Keep Clothes New',
    author: 'Admin',
    image: '/img/blog/blog-10.jpg',
    createdAt: '2025-12-14T10:00:00.000Z',
    large: false
  }
];

router.get('/', (req, res) => {
  const numericPage = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const numericLimit = Math.min(Math.max(parseInt(req.query.limit, 10) || 9, 1), 50);

  const start = (numericPage - 1) * numericLimit;
  const end = start + numericLimit;
  const posts = blogPosts.slice(start, end);

  res.json({
    posts,
    meta: {
      page: numericPage,
      limit: numericLimit,
      total: blogPosts.length,
      pages: Math.ceil(blogPosts.length / numericLimit)
    }
  });
});

export default router;