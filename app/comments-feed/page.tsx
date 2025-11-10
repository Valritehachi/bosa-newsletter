"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";
import Header from "@/app/components/Header";
import Navbar from "@/app/components/Navbar";

interface Comment {
  id: number;
  comment: string;
  author_name: string;
  article_id: number;
  articles?: { title: string }[] | { title: string };
}

const truncateComment = (text: string, length = 50) =>
  text.length > length ? text.slice(0, length) + "..." : text;

export default function CommentsFeedPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComments() {
      setLoading(true);
      const { data, error } = await supabase
        .from("comments")
        .select(`
          id,
          comment,
          author_name,
          article_id,
          articles!inner(id, title)
        `)
        .order("id", { ascending: false });

      if (error) console.error(error);
      else setComments(data);

      setLoading(false);
    }

    fetchComments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12">
        {/* Fixed header + navbar */}
        <Header />
        <Navbar />

        <section className="flex-grow p-8 bg-gray-50">

        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
            Comments Feed
        </h1>

        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
            <h3 className="italic text-base font-semibold mb-4">All Comments</h3>
            <ul className="space-y-4 text-gray-700">
            {loading ? (
                <li className="text-gray-500 italic text-xs">Loading...</li>
            ) : comments.length === 0 ? (
                <li className="text-gray-500 italic text-xs">No comments yet</li>
            ) : (
                comments.map((c) => (
                <li key={c.id} className="border-b border-gray-200 pb-3">
                    <Link
                    href={`/newsletter/${c.article_id}`}
                    className="block hover:bg-gray-50 p-2 rounded transition"
                    >
                    <span className="text-blue-600 italic text-sm hover:font-bold hover:underline">
                        {c.author_name}
                    </span>{" "}
                    <span className="text-gray-600 italic text-sm">on</span>{" "}
                    <span className="text-blue-600 italic text-sm hover:font-bold hover:underline">
                        {Array.isArray(c.articles)
                        ? c.articles[0]?.title
                        : c.articles?.title || "Unknown Article"}
                    </span>
                    <p className="text-gray-500 italic text-xs mt-1">
                        "{truncateComment(c.comment)}"
                    </p>
                    </Link>
                </li>
                ))
            )}
            </ul>
        </div>
        </section>
    </div>
  );
}
