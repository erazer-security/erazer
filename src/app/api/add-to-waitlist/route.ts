import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("waitlist")
    .insert([{ email: email }]);

  if (error) {
    console.error(error);
    return NextResponse.error();
  } else {
    return NextResponse.json(
      { message: "Added to the waitlist" },
      { status: 200 }
    );
  }
}
