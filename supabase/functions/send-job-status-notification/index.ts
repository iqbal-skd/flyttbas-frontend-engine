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

interface JobStatusNotificationRequest {
  customerEmail: string;
  customerName: string;
  companyName: string;
  newStatus: string;
  moveDate: string;
  fromAddress: string;
  toAddress: string;
  jobNotes?: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  confirmed: { label: "Bekr\u00e4ftad", color: "#16a34a" },
  scheduled: { label: "Schemalagd", color: "#2563eb" },
  in_progress: { label: "P\u00e5g\u00e5ende", color: "#b45309" },
  completed: { label: "Genomf\u00f6rd", color: "#16a34a" },
  cancelled: { label: "Avbokad", color: "#64748b" },
};

const handler = async (req: Request): Promise<Response> => {
  console.log("send-job-status-notification function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      customerEmail,
      customerName,
      companyName,
      newStatus,
      moveDate,
      fromAddress,
      toAddress,
      jobNotes,
    }: JobStatusNotificationRequest = await req.json();

    console.log(`Sending job status notification to ${customerEmail}`);
    console.log(`New status: ${newStatus} for move on ${moveDate}`);

    const statusInfo = statusLabels[newStatus] || { label: newStatus, color: "#64748b" };

    const formattedDate = new Date(moveDate).toLocaleDateString('sv-SE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

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

          <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 22px;">Statusuppdatering f\u00f6r ditt uppdrag</h2>

          <p style="font-size: 16px; color: #1e293b;">Hej ${customerName},</p>

          <p style="font-size: 16px;">Ditt uppdrag med <strong>${companyName}</strong> har f\u00e5tt en ny status:</p>

          <div style="background-color: ${statusInfo.color}; border-radius: 12px; padding: 25px; margin: 30px 0; color: white; text-align: center;">
            <p style="margin: 0 0 5px 0; font-size: 14px; opacity: 0.9;">Ny status</p>
            <p style="margin: 0; font-size: 32px; font-weight: bold;">${statusInfo.label}</p>
          </div>

          <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #1a365d;">Uppdragsdetaljer</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Datum</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 500;">${formattedDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Fr\u00e5n</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 500;">${fromAddress}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Till</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 500;">${toAddress}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">F\u00f6retag</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 500;">${companyName}</td>
              </tr>
            </table>
          </div>

          ${jobNotes ? `
          <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #0369a1; font-size: 14px;">
              <strong>Meddelande:</strong><br>
              ${jobNotes}
            </p>
          </div>
          ` : ''}

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

          <p style="color: #64748b; font-size: 14px; text-align: center;">
            Vid fr\u00e5gor, kontakta oss p\u00e5 <a href="mailto:info@flyttbas.se" style="color: #2563eb;">info@flyttbas.se</a>
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
        subject: `Ditt uppdrag \u00e4r nu: ${statusInfo.label}`,
        html: htmlContent,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const emailResponse = await resendResponse.json();
    console.log("Job status notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-job-status-notification function:", error);
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
