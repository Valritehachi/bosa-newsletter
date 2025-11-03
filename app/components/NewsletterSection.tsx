"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

interface Post {
  id: number;
  title: string;
  content: string;
}

export default function NewsletterSection() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setPosts(data as Post[]);
    };

    fetchArticles();
  }, []);

  return (
    <div className="flex flex-col items-center mt-6 space-y-6 w-full max-w-3xl">
      {posts.length === 0 ? (
        <p>No newsletters yet.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="w-full bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-700">{post.content}</p>
          </div>
        ))
      )}
    </div>
  );
}
