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

interface OfferNotificationRequest {
  customerEmail: string;
  customerName: string;
  serviceDate?: string;
  moveDate?: string;
  offerCount?: number;
  ctaLink?: string;
  quoteId?: string;
  googleRating?: number;
  googleReviewCount?: number;
}

const SITE_URL = (Deno.env.get("SITE_URL") || "https://flyttbas.se").replace(/\/$/, "");

const handler = async (req: Request): Promise<Response> => {
  console.log("send-offer-notification function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: OfferNotificationRequest = await req.json();
    const {
      customerEmail,
      customerName,
      googleRating,
      googleReviewCount,
    } = body;

    const dateValue = body.moveDate || body.serviceDate;
    const resolvedCtaLink = body.ctaLink || (body.quoteId ? `${SITE_URL}/mina-offerter` : `${SITE_URL}/dashboard`);

    console.log(`Sending offer notification to ${customerEmail}`);
    console.log(`moveDate: ${dateValue}`);

    let formattedDate = "Ej angivet";
    if (dateValue) {
      const parsed = new Date(dateValue);
      if (!isNaN(parsed.getTime())) {
        formattedDate = parsed.toLocaleDateString('sv-SE', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }
    }

    const googleBlock = (googleRating && googleReviewCount)
      ? `
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <p style="margin: 0 0 5px 0; font-size: 14px; color: #64748b; font-weight: 500;">Extern kundfeedback (k\u00e4lla: Google)</p>
            <p style="margin: 0; font-size: 18px; color: #1e293b;">
              \u2B50 ${googleRating} / 5 (${googleReviewCount} recensioner)
            </p>
          </div>
      `
      : '';

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

          <p style="font-size: 16px; color: #1e293b;">Hej ${customerName},</p>

          <p style="font-size: 16px; color: #1e293b; font-weight: 600;">Du har nu offerter att j\u00e4mf\u00f6ra via Flyttbas.</p>

          <p style="font-size: 15px; color: #4a5568;">
            Vi har samlat offerter fr\u00e5n verifierade f\u00f6retag baserat p\u00e5 ditt uppdrag.<br>
            Du j\u00e4mf\u00f6r i lugn och ro \u2013 ingen f\u00f6rpliktelse, och du v\u00e4ljer sj\u00e4lv om och vem du vill boka.
          </p>

          <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <p style="margin: 0 0 5px 0; font-size: 14px; color: #64748b; font-weight: 500;">Ditt uppdrag</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Datum</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 500; color: #1e293b;">${formattedDate}</td>
              </tr>
              ${body.offerCount ? `<tr>
                <td style="padding: 8px 0; color: #64748b;">Antal offerter hittills</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 500; color: #1e293b;">${body.offerCount}</td>
              </tr>` : ''}
            </table>
            <p style="margin: 10px 0 0 0; font-size: 13px; color: #94a3b8; font-style: italic;">(Fler offerter kan tillkomma.)</p>
          </div>

          <div style="margin: 25px 0;">
            <p style="font-size: 15px; color: #1e293b; font-weight: 600; margin-bottom: 10px;">S\u00e5 g\u00f6r du nu:</p>
            <ol style="padding-left: 20px; margin: 0; color: #4a5568; font-size: 15px;">
              <li style="margin-bottom: 8px;">G\u00e5 till din kundportal</li>
              <li style="margin-bottom: 8px;">J\u00e4mf\u00f6r pris, villkor och vad som ing\u00e5r</li>
              <li style="margin-bottom: 8px;">Godk\u00e4nn eller avb\u00f6j offerter direkt online</li>
            </ol>
          </div>

          <div style="text-align: center; margin: 35px 0;">
            <a href="${resolvedCtaLink}" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
              J\u00e4mf\u00f6r offerter och v\u00e4lj tryggt
            </a>
          </div>

          ${googleBlock}

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
        subject: "Du har offerter att j\u00e4mf\u00f6ra via Flyttbas",
        html: htmlContent,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const emailResponse = await resendResponse.json();
    console.log("Offer notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-offer-notification function:", error);
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
