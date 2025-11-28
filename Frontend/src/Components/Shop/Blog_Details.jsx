
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Blog_Details = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [sidebar, setSidebar] = useState({ categories: [], featured: [], tags: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        Promise.all([
            fetch(`/api/blog/${id}`).then(res => res.json()),
            fetch(`/api/blog/${id}/comments`).then(res => res.json()),
            fetch(`/api/blog/sidebar`).then(res => res.json())
        ])
            .then(([blogData, commentsData, sidebarData]) => {
                setBlog(blogData);
                setComments(commentsData);
                setSidebar(sidebarData);
                setLoading(false);
            })
            .catch(err => {
                setError("Failed to load blog details.");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="text-center py-5">Loading...</div>;
    if (error) return <div className="text-danger text-center py-5">{error}</div>;
    if (!blog) return <div className="text-center py-5">No blog found.</div>;

    return (
        <main>
            {/* Blog Details Section Begin */}
            <section className="blog-details spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-md-8">
                            <div className="blog__details__content">
                                <div className="blog__details__item">
                                    <img src={blog.image || "/img/blog/details/blog-details.jpg"} alt="" />
                                    <div className="blog__details__item__title">
                                        <span className="tip">{blog.category || "Blog"}</span>
                                        <h4>{blog.title}</h4>
                                        <ul>
                                            <li>by <span>{blog.author}</span></li>
                                            <li>{new Date(blog.createdAt).toLocaleDateString()}</li>
                                            <li>{comments.length} Comments</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="blog__details__desc">
                                    <p>{blog.content1}</p>
                                    {blog.content2 && <p>{blog.content2}</p>}
                                </div>
                                {blog.quote && (
                                    <div className="blog__details__quote">
                                        <div className="icon"><i className="fa fa-quote-left"></i></div>
                                        <p>{blog.quote}</p>
                                    </div>
                                )}
                                {blog.content3 && (
                                    <div className="blog__details__desc">
                                        <p>{blog.content3}</p>
                                    </div>
                                )}
                                <div className="blog__details__tags">
                                    {blog.tags && blog.tags.map(tag => (
                                        <a key={tag} href="#">{tag}</a>
                                    ))}
                                </div>
                                <div className="blog__details__btns">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-6">
                                            <div className="blog__details__btn__item">
                                                {blog.prevId && (
                                                    <h6><a href={`/blog/${blog.prevId}`}><i className="fa fa-angle-left"></i> Previous posts</a></h6>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6">
                                            <div className="blog__details__btn__item blog__details__btn__item--next">
                                                {blog.nextId && (
                                                    <h6><a href={`/blog/${blog.nextId}`}>Next posts <i className="fa fa-angle-right"></i></a></h6>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="blog__details__comment">
                                    <h5>{comments.length} Comment{comments.length !== 1 ? "s" : ""}</h5>
                                    <a href="#comment-form" className="leave-btn">Leave a comment</a>
                                    {comments.map((c, idx) => (
                                        <div key={c._id || idx} className={`blog__comment__item${c.replyTo ? " blog__comment__item--reply" : ""}`}>
                                            <div className="blog__comment__item__pic">
                                                <img src={c.avatar || "/img/blog/details/comment-1.jpg"} alt="" />
                                            </div>
                                            <div className="blog__comment__item__text">
                                                <h6>{c.name}</h6>
                                                <p>{c.text}</p>
                                                <ul>
                                                    <li><i className="fa fa-clock-o"></i> {new Date(c.createdAt).toLocaleDateString()}</li>
                                                    <li><i className="fa fa-heart-o"></i> {c.likes || 0}</li>
                                                    <li><i className="fa fa-share"></i> {c.replies ? c.replies.length : 0}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4">
                            <div className="blog__sidebar">
                                <div className="blog__sidebar__item">
                                    <div className="section-title">
                                        <h4>Categories</h4>
                                    </div>
                                    <ul>
                                        {sidebar.categories.map(cat => (
                                            <li key={cat.name}><a href="#">{cat.name} <span>({cat.count})</span></a></li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="blog__sidebar__item">
                                    <div className="section-title">
                                        <h4>Feature posts</h4>
                                    </div>
                                    {sidebar.featured.map(fp => (
                                        <a key={fp._id} href={`/blog/${fp._id}`} className="blog__feature__item">
                                            <div className="blog__feature__item__pic">
                                                <img src={fp.image || "/img/blog/sidebar/fp-1.jpg"} alt="" />
                                            </div>
                                            <div className="blog__feature__item__text">
                                                <h6>{fp.title}</h6>
                                                <span>{new Date(fp.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                                <div className="blog__sidebar__item">
                                    <div className="section-title">
                                        <h4>Tags cloud</h4>
                                    </div>
                                    <div className="blog__sidebar__tags">
                                        {sidebar.tags.map(tag => (
                                            <a key={tag} href="#">{tag}</a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Blog Details Section End */}
        </main>
    );
};

export default Blog_Details;
