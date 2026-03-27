"use client";

import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function PostsPage() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Instagram Growth Tips",
      content: "Use reels and consistent posting to grow faster.",
    },
  ]);

  // State for Create form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // State for Edit form
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const handleAddPost = () => {
    if (!title || !content) return;
    const newPost = { id: Date.now(), title, content };
    setPosts([newPost, ...posts]);
    setTitle("");
    setContent("");
  };

  const handleEdit = (post) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleUpdate = () => {
    setPosts(
      posts.map((post) =>
        post.id === editingId
          ? { ...post, title: editTitle, content: editContent }
          : post
      )
    );
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <DashboardLayout>
      <h1 className="text-xl font-semibold">Posts Management</h1>

      {/* --- CREATE POST SECTION --- */}
      <div className="bg-white p-4 rounded-lg shadow-sm mt-6 border border-gray-100">
        <h2 className="font-semibold mb-3">Create New Post</h2>
        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded mb-2 focus:ring-2 focus:ring-blue-200 outline-none"
        />
        <textarea
          placeholder="Post content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border p-2 rounded mb-2 focus:ring-2 focus:ring-blue-200 outline-none"
        />
        <button
          onClick={handleAddPost}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          Add Post
        </button>
      </div>

      {/* --- POSTS LIST SECTION --- */}
      <div className="grid gap-4 mt-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            {editingId === post.id ? (
              /* EDIT MODE UI */
              <div className="flex flex-col">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdate}
                    className="bg-green-500 text-white px-4 py-1 rounded"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-500 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* VIEW MODE UI */
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-lg">{post.title}</h2>
                    <p className="text-gray-600 mt-2 whitespace-pre-wrap">{post.content}</p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}