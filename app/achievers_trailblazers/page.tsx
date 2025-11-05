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
  published_at?: string;
  category?: string;
  image_url?: string; // Added this field
}

export default function AchieversTrailblazersPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("category", "Achievers & Trailblazers")
        .order("published_at", { ascending: false });

      if (error) console.error("Error fetching articles:", error);
      else setPosts(data as Post[]);
    };

    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header + Navbar */}
      <Header />
      <Navbar />

      {/* Page content */}
      <section className="flex-grow p-8 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Achievers & Trailblazers
        </h1>

        <div className="space-y-6 max-w-3xl mx-auto">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">
              No articles found in this category.
            </p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="border-b border-gray-200 py-4">
                <h2 className="text-xl font-semibold">{post.title}</h2>

                {post.image_url && (
                  <div className="w-full md:w-1/3 my-4">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-80 object-cover rounded-md"
                    />
                  </div>
                )}

                {post.published_at && (
                  <p className="text-gray-500 text-sm mb-2">
                    🗓️ {new Date(post.published_at).toLocaleDateString()}
                  </p>
                )}

                <p>{post.content.substring(0, 100)}...</p>
                <ReadMoreButton id={post.id} />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}