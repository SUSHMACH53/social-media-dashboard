"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);

  // State for Create form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // State for Edit form
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // ✅ Fetch posts from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error(err));
  }, []);

  // ✅ Add Post (Backend)
  const handleAddPost = () => {
    if (!title || !content) return;

    fetch("http://localhost:5000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    })
      .then((res) => res.json())
      .then((newPost) => {
        setPosts([newPost, ...posts]);
        setTitle("");
        setContent("");
      })
      .catch((err) => console.error(err));
  };

  // Edit setup (frontend only)
  const handleEdit = (post) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  // Update (frontend only for now)
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

  // ✅ DELETE from backend
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/posts/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setPosts(posts.filter((post) => post.id !== id));
      })
      .catch((err) => console.error(err));
  };

  return (
    <DashboardLayout>
      <h1 className="text-xl font-semibold">Posts Management</h1>

      {/* CREATE POST */}
      <div className="bg-white p-4 rounded-lg shadow-sm mt-6 border border-gray-100">
        <h2 className="font-semibold mb-3">Create New Post</h2>

        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded mb-2"
        />

        <textarea
          placeholder="Post content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border p-2 rounded mb-2"
        />

        <button
          onClick={handleAddPost}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Post
        </button>
      </div>

      {/* POSTS LIST */}
      <div className="grid gap-4 mt-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow-sm border">
            {editingId === post.id ? (
              <div>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border p-2 mb-2"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full border p-2 mb-2"
                />
                <button onClick={handleUpdate} className="bg-green-500 text-white px-3 py-1 rounded">
                  Save
                </button>
              </div>
            ) : (
              <div className="flex justify-between">
                <div>
                  <h2 className="font-semibold">{post.title}</h2>
                  <p>{post.content}</p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => handleEdit(post)} className="text-blue-500">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(post.id)} className="text-red-500">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}