

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 9;

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`/api/blog?page=${page}&limit=${pageSize}`)
            .then(res => res.json())
            .then(data => {
                if (page === 1) {
                    setPosts(data.posts);
                } else {
                    setPosts(prev => [...prev, ...data.posts]);
                }
                setHasMore(data.posts.length === pageSize);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load blog posts.");
                setLoading(false);
            });
    }, [page]);

    // Group posts into columns for layout
    const columns = [[], [], []];
    posts.forEach((post, idx) => {
        columns[idx % 3].push(post);
    });

    return (
        <main>
            {/* Blog Section Begin */}
            <section className="blog spad">
                <div className="container">
                    {loading && <div className="text-center py-5">Loading...</div>}
                    {error && <div className="text-danger text-center py-5">{error}</div>}
                    {!loading && !error && (
                        <div className="row">
                            {columns.map((col, colIdx) => (
                                <div className="col-lg-4 col-md-4 col-sm-6" key={colIdx}>
                                    {col.map(post => (
                                        <div className="blog__item" key={post._id}>
                                            <div
                                                className={`blog__item__pic${post.large ? " large__item" : ""} set-bg`}
                                                style={{ backgroundImage: `url(${post.image || "/img/blog/blog-1.jpg"})` }}
                                            ></div>
                                            <div className="blog__item__text">
                                                <h6>
                                                    <Link to={`/blog/${post._id}`}>{post.title}</Link>
                                                </h6>
                                                <ul>
                                                    <li>by <span>{post.author}</span></li>
                                                    <li>{new Date(post.createdAt).toLocaleDateString()}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                            <div className="col-lg-12 text-center">
                                {hasMore && (
                                    <button
                                        className="primary-btn load-btn"
                                        onClick={() => setPage(page + 1)}
                                        disabled={loading}
                                    >
                                        {loading ? "Loading..." : "Load more posts"}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>
            {/* Blog Section End */}
        </main>
    );
};

export default Blog;
