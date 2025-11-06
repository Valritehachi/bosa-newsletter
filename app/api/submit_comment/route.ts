import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const { articleId, name, comment, token } = await req.json();

    if (!articleId || !name || !comment || !token) {
      return NextResponse.json(
        { error: "Missing required fields or reCAPTCHA token" },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA server-side
    const secretKey = process.env.RECAPTCHA_SECRET_KEY; // store in .env
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    const verifyRes = await fetch(verifyUrl, { method: "POST" });
    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }

    // Insert comment into Supabase
    const { error } = await supabase.from("comments").insert({
      article_id: articleId,
      name,
      comment,
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to submit comment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Comment submitted successfully!" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
