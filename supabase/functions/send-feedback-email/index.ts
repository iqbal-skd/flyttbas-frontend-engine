import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL_RAW = Deno.env.get("FROM_EMAIL") || "noreply@flyttbas.se";
const FROM_EMAIL = FROM_EMAIL_RAW.includes("<")
  ? FROM_EMAIL_RAW
  : `Flyttbas <${FROM_EMAIL_RAW}>`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FeedbackEmailRequest {
  customerEmail: string;
  customerName: string;
  feedbackLink: string;
  isReminder?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-feedback-email function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      customerEmail,
      customerName,
      feedbackLink,
      isReminder,
    }: FeedbackEmailRequest = await req.json();

    console.log(`Sending feedback email to ${customerEmail} (reminder: ${isReminder || false})`);

    const subjectLine = isReminder
      ? "P\u00e5minnelse: Hur upplevde du Flyttbas?"
      : "Hur upplevde du Flyttbas?";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
        <div style="background-color: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a365d; margin: 0; font-size: 28px; letter-spacing: 2px;">FLYTTBAS</h1>
          </div>

          <h2 style="color: #1e293b; font-size: 22px; text-align: center; margin-bottom: 15px;">Hur upplevde du Flyttbas?</h2>

          <p style="font-size: 16px; color: #1e293b;">Hej ${customerName},</p>

          <p style="font-size: 15px; color: #4a5568;">
            Det tar cirka 1 minut och hj\u00e4lper oss att f\u00f6rb\u00e4ttra tj\u00e4nsten.
          </p>

          <div style="text-align: center; margin: 35px 0;">
            <a href="${feedbackLink}" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Ge feedback
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

          <p style="color: #64748b; font-size: 14px; text-align: center;">
            <a href="mailto:info@flyttbas.se" style="color: #2563eb;">info@flyttbas.se</a>
          </p>
        </div>
      </body>
      </html>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [customerEmail],
        subject: subjectLine,
        html: htmlContent,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const emailResponse = await resendResponse.json();
    console.log("Feedback email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-feedback-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
