"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Navbar from "@/app/components/Navbar";
import ReadMoreButton from "@/app/components/ReadMoreButton";
import { supabase } from "@/utils/supabaseClient";

interface Post {
  id: number;
  title: string;
  content: string;
}

export default function NewsletterPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) console.error("Error fetching articles:", error);
      else setPosts(data as Post[]);
    };

    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed header + navbar */}
      <Header />
      <Navbar />

      {/* Page content */}
      <section className="flex-grow p-8 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Newsletters
        </h1>

        <div className="space-y-6 max-w-3xl mx-auto">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">No newsletters yet.</p>
          ) : (
            posts.map((n) => (
              <div key={n.id} className="border-b border-gray-200 py-4">
                <h2 className="text-xl font-semibold">{n.title}</h2>
                <p>{n.content.substring(0, 100)}...</p>
                <ReadMoreButton id={n.id} />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
