import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useOutletContext, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const DUMMY_BLOGS = [
  {
    _id: "1",
    title: "How 360° Virtual Tours Are Transforming Real Estate Marketing",
    slug: "360-virtual-tours-transforming-real-estate",
    shortDescription: "Discover how immersive 360° virtual tours are revolutionizing the way properties are marketed and sold.",
    content: `<p>The real estate industry has always been about one thing: helping people find their perfect space.</p><p>360° virtual tours have changed that equation entirely.</p><h3>What Makes Virtual Tours So Powerful?</h3><p>A virtual tour lets a potential buyer walk through a property from anywhere in the world.</p>`,
    author: "360 EYE Team",
    tags: ["Virtual Tour", "Real Estate", "Technology"],
    createdAt: "2025-03-15T00:00:00.000Z",
  },
  {
    _id: "2",
    title: "3D ArchViz Rendering: Bringing Unbuilt Spaces to Life",
    slug: "3d-archviz-rendering-unbuilt-spaces",
    shortDescription: "Learn how architectural visualization helps developers visualize spaces before a single brick is laid.",
    content: `<p>Imagine being able to walk through your dream home before the foundation is even poured.</p><h3>What Is 3D ArchViz?</h3><p>3D architectural visualization is the process of creating photorealistic digital renders of buildings and interiors.</p>`,
    author: "360 EYE Team",
    tags: ["3D Rendering", "Architecture", "Visualization"],
    createdAt: "2025-02-20T00:00:00.000Z",
  },
  {
    _id: "3",
    title: "The Future of Property Marketing: Immersive Digital Experiences",
    slug: "future-property-marketing-immersive-digital",
    shortDescription: "From virtual staging to AI-powered walkthroughs, digital innovation is reshaping property marketing.",
    content: `<p>The way people discover and decide on properties has fundamentally shifted.</p><h3>The Shift to Digital-First</h3><p>Buyers now start their property search online. If your property doesn't present well online, you're losing buyers.</p>`,
    author: "360 EYE Team",
    tags: ["PropTech", "Marketing", "Innovation"],
    createdAt: "2025-01-10T00:00:00.000Z",
  },
];

export const BlogDetail = () => {
  const css = useOutletContext();
  const { slug } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/blogs/slug/${slug}`);
        setBlog(response.data?.blog || response.data);
        const allRes = await axios.get(`${API_URL}/admin/blogs`);
        const all = allRes.data?.blogs || allRes.data || [];
        setRelatedBlogs(all.filter((b) => b.slug !== slug).slice(0, 2));
      } catch {
        const found = DUMMY_BLOGS.find((b) => b.slug === slug);
        setBlog(found || null);
        setRelatedBlogs(DUMMY_BLOGS.filter((b) => b.slug !== slug).slice(0, 2));
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  const handleReadMore = (newSlug) => {
    const el = scrollRef.current;
    if (el) {
      const duration = 500;
      const start = el.scrollTop;
      const startTime = performance.now();
      const scroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.scrollTop = start * (1 - ease);
        if (progress < 1) {
          requestAnimationFrame(scroll);
        } else {
          navigate(`/blog/${newSlug}`);
        }
      };
      requestAnimationFrame(scroll);
    } else {
      navigate(`/blog/${newSlug}`);
    }
  };

  if (loading) return (
    <div className="fixed inset-0 top-[9.2svh] bg-[#000000] flex items-center justify-center z-40">
      <p className="text-[#9B9B9B]">Loading article...</p>
    </div>
  );

  if (!blog) return (
    <div className="fixed inset-0 top-[9.2svh] bg-[#000000] flex flex-col items-center justify-center gap-4 z-40">
      <p className="text-[#9B9B9B]">Article not found.</p>
      <Link to="/blog" className="text-[#80bb0f] hover:underline text-sm">← Back to Blog</Link>
    </div>
  );

  return (
    <div ref={scrollRef} className="fixed inset-0 top-[9.2svh] bg-[#000000] overflow-y-auto z-40">
      <AnimatePresence mode="wait">
        <motion.div
          key={slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Back link */}
          <div className="w-[90vw] md:w-[80vw] mx-auto pt-10">
            <Link to="/blog" className="inline-flex items-center text-[#80bb0f] text-sm hover:opacity-80 transition-opacity">
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>

          {/* Header */}
          <div className="w-[90vw] md:w-[70vw] lg:w-[60vw] mx-auto pt-8 pb-10 border-b border-[#ffffff15]">
            {blog.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {(Array.isArray(blog.tags) ? blog.tags : blog.tags.split(",")).map((tag, i) => (
                  <span key={i} className="text-[#80bb0f] text-xs border border-[#80bb0f]/30 px-3 py-1 rounded">{tag.trim()}</span>
                ))}
              </div>
            )}
            <h1
              className="text-2xl md:text-4xl lg:text-5xl text-white font-light leading-tight mb-6"
              dangerouslySetInnerHTML={{ __html: blog.title }}
            />
            <div className="flex items-center gap-4 text-[#9B9B9B] text-sm font-light">
              <span>{blog.author || "360 EYE Team"}</span>
              <span className="text-[#ffffff29]">•</span>
              <span>{new Date(blog.publishedDate || blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
          </div>

          {/* Thumbnail */}
          {blog.thumbnail && (
            <div className="w-[90vw] md:w-[70vw] lg:w-[60vw] mx-auto mt-8">
              <img src={`${API_URL}/uploads/blogs/${blog.thumbnail}`} alt={blog.title} className="w-full h-64 md:h-96 object-cover rounded-lg" />
            </div>
          )}

          {/* Content */}
          <div className="w-[90vw] md:w-[70vw] lg:w-[60vw] mx-auto py-12">
            <div
              className="prose prose-invert max-w-none text-[#9B9B9B] font-light text-sm md:text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* Related Articles */}
          {relatedBlogs.length > 0 && (
            <div className="border-t border-[#ffffff15] py-16 px-4">
              <div className="w-[90vw] md:w-[80vw] mx-auto">
                <h2 className="text-xl md:text-2xl text-white font-light mb-8 text-center">More Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedBlogs.map((b) => (
                    <div key={b._id} className="group cursor-pointer" onClick={() => handleReadMore(b.slug)}>
                      <div className="bg-[#D9D9D914] border border-[#FFFFFF29] rounded-lg overflow-hidden hover:border-[#80bb0f] transition-all">
                        <div className="relative h-48 bg-black flex items-center justify-center overflow-hidden">
                          {b.thumbnail ? (
                            <img src={`${API_URL}/uploads/blogs/${b.thumbnail}`} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-12 h-12 rounded-full border border-[#80bb0f]/30 flex items-center justify-center">
                              <span className="text-[#80bb0f] text-xl font-light">360</span>
                            </div>
                          )}
                          <div className="absolute bottom-2 right-2 bg-black/80 border border-white/20 text-white text-[10px] px-2 py-1 rounded font-medium backdrop-blur-sm">
                            {new Date(b.publishedDate || b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </div>
                        </div>
                        <div className="p-5">
                          <h3
                            className="text-white font-medium mb-2 group-hover:text-[#80bb0f] transition-colors line-clamp-2 text-sm md:text-base"
                            dangerouslySetInnerHTML={{ __html: b.title }}
                          />
                          <p
                            className="text-[#9B9B9B] text-sm font-light line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: b.shortDescription }}
                          />
                          <span className="inline-flex items-center text-[#80bb0f] text-sm mt-3">
                            Read More
                            <svg className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Read more About Us */}
          <div className="border-t border-[#ffffff15] py-12 flex items-center justify-center">
            <Link
              to="/aboutus"
              className="flex items-center gap-2 text-[#9B9B9B] text-sm hover:text-white transition-colors group"
            >
              <span className="text-[#80bb0f] font-medium">Read more</span>
              <span>About Us</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default BlogDetail;