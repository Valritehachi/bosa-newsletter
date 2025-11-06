import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabaseClient";

export async function GET(req: NextRequest) {
  const articleId = req.nextUrl.searchParams.get("articleId");

  if (!articleId) {
    return NextResponse.json({ comments: [] });
  }

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("article_id", Number(articleId))
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return NextResponse.json({ comments: [] });
  }

  return NextResponse.json({ comments: data });
}
