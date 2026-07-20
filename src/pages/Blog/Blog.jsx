import React, { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const BLOGS = [
  {
    _id: "1",
    title: "How 360° Virtual Tours Are Transforming Real Estate Marketing",
    slug: "360-virtual-tours-transforming-real-estate",
    shortDescription: "Discover how immersive 360° virtual tours are revolutionizing the way properties are marketed and sold, giving buyers a complete experience from anywhere in the world.",
    thumbnail: null,
    author: "360 EYE Team",
    tags: ["Virtual Tour", "Real Estate", "Technology"],
    status: "published",
    createdAt: "2025-03-15T00:00:00.000Z",
  },
  {
    _id: "2",
    title: "3D ArchViz Rendering: Bringing Unbuilt Spaces to Life",
    slug: "3d-archviz-rendering-unbuilt-spaces",
    shortDescription: "Learn how architectural visualization helps developers, architects, and buyers visualize spaces before a single brick is laid — saving time, money, and miscommunication.",
    thumbnail: null,
    author: "360 EYE Team",
    tags: ["3D Rendering", "Architecture", "Visualization"],
    status: "published",
    createdAt: "2025-02-20T00:00:00.000Z",
  },
  {
    _id: "3",
    title: "The Future of Property Marketing: Immersive Digital Experiences",
    slug: "future-property-marketing-immersive-digital",
    shortDescription: "From virtual staging to AI-powered walkthroughs, we explore how digital innovation is reshaping how developers connect with potential buyers.",
    thumbnail: null,
    author: "360 EYE Team",
    tags: ["PropTech", "Marketing", "Innovation"],
    status: "published",
    createdAt: "2025-01-10T00:00:00.000Z",
  },
];

export const Blog = () => {
  const css = useOutletContext();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/blogs`);
        const data = response.data?.blogs || response.data || [];
        const published = data.filter((b) => b.status === "published");
        setBlogs(published.length > 0 ? published : BLOGS);
      } catch {
        setBlogs(BLOGS);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 top-[9.2svh] bg-[#000000] overflow-y-auto z-40">

      {/* Hero */}
      <div className="w-full flex flex-col items-center justify-center text-center py-16 px-4 border-b border-[#ffffff15]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[#80bb0f] text-xs font-medium tracking-widest uppercase mb-3">
            Insights & Updates
          </p>
          <h1 className="text-3xl md:text-5xl text-white font-light tracking-wide mb-4">
            Our Blog
          </h1>
          <p className="text-[#9B9B9B] text-sm md:text-base font-light max-w-lg mx-auto leading-relaxed">
            Explore the latest blogs in virtual tours, 3D rendering, and property marketing innovation.
          </p>
        </motion.div>
      </div>

      {/* Blog Grid */}
      <div className="w-[90vw] md:w-[80vw] mx-auto py-16">
        {loading ? (
          <p className="text-center text-[#9B9B9B] py-20">Loading articles...</p>
        ) : filteredBlogs.length === 0 ? (
          <p className="text-center text-[#9B9B9B] py-20">No articles found.</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.15 }}
          >
            {filteredBlogs.map((blog, i) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link to={`/blog/${blog.slug}`} className="group block h-full">
                  <div className="h-full flex flex-col bg-[#D9D9D914] border border-[#FFFFFF29] rounded-lg overflow-hidden hover:border-[#80bb0f] transition-all duration-300">

                    {/* Thumbnail */}
                    <div className="relative h-48 bg-black flex items-center justify-center overflow-hidden">
                      {blog.thumbnail ? (
                        <img
                          src={`${API_URL}/uploads/blogs/${blog.thumbnail}`}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-full border border-[#80bb0f]/30 flex items-center justify-center">
                            <span className="text-[#80bb0f] text-xl font-light">360</span>
                          </div>
                        </div>
                      )}
                      {/* Date on image bottom right */}
                      <div className="absolute bottom-2 right-2 bg-black/80 border border-white/20 text-white text-[10px] px-2 py-1 rounded font-medium backdrop-blur-sm">
                        {new Date(blog.publishedDate || blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-5 gap-3">

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 items-center">
                        {blog.tags?.length > 0 && (
                          <>
                            {(Array.isArray(blog.tags) ? blog.tags : blog.tags.split(",")).slice(0, 2).map((tag, i) => (
                              <span key={i} className="text-[#80bb0f] text-xs border border-[#80bb0f]/30 px-2 py-0.5 rounded">
                                {tag.trim()}
                              </span>
                            ))}
                          </>
                        )}
                      </div>

                      <h2
                        className="text-white text-base font-medium leading-snug group-hover:text-[#80bb0f] transition-colors line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: blog.title }}
                      />
                      <p
                        className="text-[#9B9B9B] text-sm font-light leading-relaxed line-clamp-3 flex-1"
                        dangerouslySetInnerHTML={{ __html: blog.shortDescription }}
                      />
                      <div className="flex items-center text-[#80bb0f] text-sm font-medium mt-2">
                        Read More
                        <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

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
    </div>
  );
};

export default Blog;