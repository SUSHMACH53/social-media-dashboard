"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);

  // Add form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // NEW: edit state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const fetchPosts = async () => {
    const res = await fetch("http://localhost:5000/api/posts");
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ADD
  const handleAddPost = async () => {
    const res = await fetch("http://localhost:5000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    const newPost = await res.json();
    setPosts([...posts, newPost]);
    setTitle("");
    setContent("");
  };

  // DELETE
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/posts/${id}`, {
      method: "DELETE",
    });

    setPosts(posts.filter((post) => post._id !== id));
  };

  // START EDIT
  const handleEditClick = (post) => {
    setEditingId(post._id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  // SAVE EDIT
  const handleSave = async (id) => {
    const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: editTitle,
        content: editContent,
      }),
    });

    const updatedPost = await res.json();

    // update UI
    setPosts(
      posts.map((post) =>
        post._id === id ? updatedPost : post
      )
    );

    setEditingId(null);
  };

  return (
    <DashboardLayout>
      <h1 className="text-xl font-semibold mb-4">Posts Management</h1>

      {/* ADD POST */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h2 className="font-semibold mb-3">Create New Post</h2>

        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 mb-2"
        />

        <textarea
          placeholder="Post content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border p-2 mb-2"
        />

        <button
          onClick={handleAddPost}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Post
        </button>
      </div>

      {/* POSTS */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        {posts.map((post) => (
          <div key={post._id} className="border p-4 rounded-lg mb-3">
            
            {editingId === post._id ? (
              <>
                {/* EDIT MODE */}
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

                <button
                  onClick={() => handleSave(post._id)}
                  className="text-green-500 mr-4"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                {/* NORMAL VIEW */}
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-gray-600">{post.content}</p>

                <button
                  onClick={() => handleEditClick(post)}
                  className="text-blue-500 mr-4"
                >
                  Edit
                </button>
              </>
            )}

            <button
              onClick={() => handleDelete(post._id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}