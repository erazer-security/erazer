import { NextRequest, NextResponse } from "next/server";
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`);

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  const msg = {
    to: "support@erazer.io",
    from: "support@erazer.io",
    subject: `Add ${email} to the waitlist`,
    text: `Please add ${email} to the waitlist`,
  };

  try {
    await sgMail.send(msg);
    return NextResponse.json(
      { message: "Added to the waitlist" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
