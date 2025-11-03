// "use client";

// import { useState } from "react";
// import dynamic from "next/dynamic";
// import { supabase } from "@/utils/supabaseClient";
// import "react-quill/dist/quill.snow.css";

// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// export default function ArticleEditor(): JSX.Element {
//   const [title, setTitle] = useState<string>("");
//   const [content, setContent] = useState<string>("");
//   const [message, setMessage] = useState<string | null>(null);
//   const [saving, setSaving] = useState<boolean>(false);

//   const saveArticle = async () => {
//     setSaving(true);
//     const { error } = await supabase.from("articles").insert([{ title, content }]);
//     setSaving(false);

//     if (error) setMessage(`Error: ${error.message}`);
//     else {
//       setMessage("Article saved!");
//       setTitle("");
//       setContent("");
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded shadow">
//       <h2 className="text-lg font-semibold mb-4">Create Article</h2>
//       <input
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         placeholder="Title"
//         className="w-full p-2 border rounded mb-4"
//       />
//       <ReactQuill
//         value={content}
//         onChange={setContent}
//         className="mb-4"
//         modules={{
//           toolbar: [
//             [{ header: [1, 2, 3, false] }],
//             ["bold", "italic", "underline", "strike", "blockquote"],
//             [{ list: "ordered" }, { list: "bullet" }],
//             ["link", "image"],
//             ["clean"],
//           ],
//         }}
//         formats={[
//           "header",
//           "bold",
//           "italic",
//           "underline",
//           "strike",
//           "blockquote",
//           "list",
//           "bullet",
//           "link",
//           "image",
//         ]}
//       />
//       <div className="flex items-center gap-3">
//         <button
//           onClick={saveArticle}
//           disabled={saving}
//           className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//         >
//           {saving ? "Saving..." : "Save Article"}
//         </button>
//         {message && <span className="text-gray-700">{message}</span>}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

interface Article {
  id: number;
  title: string;
  content: string;
}

export default function ArticlesEditor() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch articles
  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("id", { ascending: false });
    if (error) console.log(error);
    else setArticles(data as Article[]);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Add or update article
  const saveArticle = async () => {
    if (!title || !content) return;

    if (editingId) {
      // Update
      const { error } = await supabase
        .from("articles")
        .update({ title, content })
        .eq("id", editingId);
      if (error) console.log(error);
    } else {
      // Add
      const { error } = await supabase.from("articles").insert([{ title, content }]);
      if (error) console.log(error);
    }

    setTitle("");
    setContent("");
    setEditingId(null);
    fetchArticles();
  };

  // Delete article
  const deleteArticle = async (id: number) => {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) console.log(error);
    fetchArticles();
  };

  // Edit article
  const editArticle = (article: Article) => {
    setEditingId(article.id);
    setTitle(article.title);
    setContent(article.content);
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>{editingId ? "Edit Article" : "Add New Article"}</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "8px", height: "100px" }}
      />
      <button onClick={saveArticle} style={{ padding: "10px 20px", marginRight: "10px" }}>
        {editingId ? "Update" : "Add"}
      </button>
      {editingId && (
        <button
          onClick={() => {
            setEditingId(null);
            setTitle("");
            setContent("");
          }}
          style={{ padding: "10px 20px" }}
        >
          Cancel
        </button>
      )}

      {/* List Articles */}
      <div style={{ marginTop: "40px" }}>
        <h2>Articles</h2>
        {articles.length === 0 ? (
          <p>No articles yet</p>
        ) : (
          <ul>
            {articles.map((article) => (
              <li key={article.id} style={{ marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
                <strong>{article.title}</strong>
                <p>{article.content}</p>
                <button onClick={() => editArticle(article)} style={{ marginRight: "10px" }}>
                  Edit
                </button>
                <button onClick={() => deleteArticle(article.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

