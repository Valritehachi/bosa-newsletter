
"use client";

import { use, useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Navbar from "@/app/components/Navbar";
import { supabase } from "@/utils/supabaseClient";
import CommentForm from "@/app/components/CommentForm";
import Link from "next/link";
import Image from "next/image";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at?: string;
  image_url?: string;
  published_at?: string;
  category?: string;
}

interface Comment {
  id: number;
  name: string;
  comment: string;
  created_at: string;
}

export default function NewsletterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch article and comments on page load
  useEffect(() => {
    const fetchArticleAndComments = async () => {
      setLoading(true);

      // Fetch article
      const { data: articleData, error: articleError } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (articleError) {
        console.error("Error fetching article:", articleError);
        setError("Newsletter not found");
      } else {
        setPost(articleData as Post);
      }

      // Fetch comments
      const { data: commentData, error: commentError } = await supabase
        .from("comments")
        .select("*")
        .eq("article_id", id)
        .order("created_at", { ascending: false });

      if (commentError) {
        console.error("Error fetching comments:", commentError);
      } else {
        setComments(commentData as Comment[]);
      }

      setLoading(false);
    };

    fetchArticleAndComments();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />

      <section className="flex-grow p-8 bg-gray-50">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : post ? (
          <article className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
            {post.image_url && (
              <div className="mb-6">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-auto rounded-lg object-contain"
                />
              </div>
            )}

            <h1 className="text-4xl font-bold mb-4 text-blue-600">
              {post.title}
            </h1>

            {post.published_at && (
              <p className="text-gray-500 text-sm mb-6">
                {new Date(post.published_at).toLocaleDateString()}
              </p>
            )}

            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {/* Comments List
            <section className="mt-10">
              <h2 className="text-3xl mb-4 font-semibold">Comments</h2>
              {comments?.length ? (
                comments.map((comment) => (
                  <div key={comment.id} className="mb-4 border-b pb-2">
                    <p className="font-semibold text-gray-800">{comment.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                    <p className="mt-1 text-gray-700">{comment.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No comments yet.</p>
              )}
            </section> */}

            {/* Comment Form */}
            <CommentForm articleId={Number(id)} />
          </article>
        ) : (
          <p className="text-center text-gray-500">Newsletter not found</p>
        )}
      </section>
    </div>
  );
}

