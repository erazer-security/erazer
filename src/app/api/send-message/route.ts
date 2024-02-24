import { NextRequest, NextResponse } from "next/server";
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`);

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  const msg = {
    to: "support@erazer.io",
    from: "support@erazer.io",
    subject: `Message from ${email}`,
    text: `${name} says ${message}`,
  };

  try {
    await sgMail.send(msg);
    return NextResponse.json(
      { message: "Message has been sent " },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
