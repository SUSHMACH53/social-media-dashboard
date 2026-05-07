"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { apiRequest } from "../../lib/api";

const emptyForm = {
  title: "",
  content: "",
  platform: "Instagram",
  mediaUrl: "",
  scheduledAt: "",
  status: "Draft",
};

export default function PostsPage() {
  return (
    <Suspense fallback={null}>
      <PostsPageContent />
    </Suspense>
  );
}

function PostsPageContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.trim() || "";
  const [posts, setPosts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    const data = await apiRequest("/api/posts");
    setPosts(data);
  };

  useEffect(() => {
    async function loadPageData() {
      try {
        const [postData, videoData] = await Promise.all([
          apiRequest("/api/posts"),
          apiRequest("/api/youtube/videos/GoogleDevelopers"),
        ]);
        setPosts(postData);
        setVideos(videoData);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadPageData();
  }, []);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await apiRequest(`/api/posts/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        toast.success("Post updated");
      } else {
        await apiRequest("/api/posts", {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast.success("Post created");
      }

      resetForm();
      await loadPosts();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (post) => {
    setEditingId(post._id);
    setForm({
      title: post.title || "",
      content: post.content || "",
      platform: post.platform || "Instagram",
      mediaUrl: post.mediaUrl || "",
      scheduledAt: post.scheduledAt ? post.scheduledAt.slice(0, 16) : "",
      status: post.status || "Draft",
    });
  };

  const handleDelete = async (id) => {
    try {
      await apiRequest(`/api/posts/${id}`, { method: "DELETE" });
      toast.success("Post deleted");
      await loadPosts();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEngage = async (id, type) => {
    try {
      const updated = await apiRequest(`/api/posts/${id}/engage`, {
        method: "PATCH",
        body: JSON.stringify({ type }),
      });
      setPosts((current) => current.map((post) => (post._id === id ? updated : post)));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;

    const query = searchQuery.toLowerCase();
    return posts.filter((post) =>
      [post.title, post.content, post.platform, post.status]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [posts, searchQuery]);

  const filteredVideos = useMemo(() => {
    if (!searchQuery) return videos;

    const query = searchQuery.toLowerCase();
    return videos.filter((video) =>
      [video.title, video.publishedAt]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [videos, searchQuery]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h1 className="text-xl font-bold text-slate-950">
              {editingId ? "Edit Post" : "Create Post"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Draft content, schedule it, and track engagement.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <Field label="Title">
                <input
                  required
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                />
              </Field>

              <Field label="Content">
                <textarea
                  required
                  name="content"
                  rows={5}
                  value={form.content}
                  onChange={handleChange}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Platform">
                  <select
                    name="platform"
                    value={form.platform}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                  >
                    <option>Instagram</option>
                    <option>YouTube</option>
                    <option>LinkedIn</option>
                    <option>X</option>
                  </select>
                </Field>

                <Field label="Status">
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                  >
                    <option>Draft</option>
                    <option>Scheduled</option>
                    <option>Published</option>
                  </select>
                </Field>
              </div>

              <Field label="Media URL">
                <input
                  name="mediaUrl"
                  value={form.mediaUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                />
              </Field>

              <Field label="Schedule Time">
                <input
                  type="datetime-local"
                  name="scheduledAt"
                  value={form.scheduledAt}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                />
              </Field>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-slate-950 px-4 py-2 font-semibold text-white transition hover:bg-slate-800"
                >
                  {editingId ? "Save Changes" : "Create Post"}
                </button>
                {editingId ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </section>

          <section>
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Post Library</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {searchQuery
                    ? `Showing results for "${searchQuery}"`
                    : "Manage created posts and quick engagement actions."}
                </p>
              </div>
              {searchQuery ? (
                <Link
                  href="/posts"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Clear
                </Link>
              ) : null}
            </div>

            {loading ? (
              <div className="mt-4 rounded-lg border border-slate-200 bg-white p-6 text-slate-500">
                Loading posts...
              </div>
            ) : (
              <div className="mt-4 grid gap-4">
                {filteredPosts.length === 0 ? (
                  <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-500">
                    {searchQuery
                      ? "No posts match your search."
                      : "No posts yet. Create your first draft from the form."}
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <article
                      key={post._id}
                      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
                              {post.platform}
                            </span>
                            <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                              {post.status}
                            </span>
                          </div>
                          <h3 className="mt-3 text-lg font-bold text-slate-950">{post.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{post.content}</p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(post)}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(post._id)}
                            className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {["likes", "comments", "shares"].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => handleEngage(post._id, type)}
                            className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold capitalize text-slate-700 hover:bg-slate-200"
                          >
                            {type}: {post[type] || 0}
                          </button>
                        ))}
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}

            <section className="mt-6">
              <h2 className="text-xl font-bold text-slate-950">YouTube Feed Preview</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {filteredVideos.length === 0 ? (
                  <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-500 lg:col-span-2">
                    {searchQuery
                      ? "No videos match your search."
                      : "No videos available right now."}
                  </div>
                ) : (
                  filteredVideos.map((video) => (
                  <article key={video.videoId} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                    <div
                      className="h-44 w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${video.thumbnail})` }}
                      role="img"
                      aria-label={video.title}
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-slate-950">{video.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {new Date(video.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </article>
                  ))
                )}
              </div>
            </section>
          </section>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function Field({ label, children }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <div className="mt-2">{children}</div>
    </label>
  );
}
