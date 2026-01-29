import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL_RAW = Deno.env.get("FROM_EMAIL") || "noreply@flyttbas.se";
const FROM_EMAIL = FROM_EMAIL_RAW.includes("<")
  ? FROM_EMAIL_RAW
  : `Flyttbas <${FROM_EMAIL_RAW}>`;
const SITE_URL = (Deno.env.get("SITE_URL") || "https://flyttbas.se").replace(/\/+$/, "");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "partner_application" | "quote_request" | "partner_approved" | "partner_more_info";
  email: string;
  name: string;
  companyName?: string;
  quoteId?: string;
  statusReason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-confirmation-email function called");
  console.log("FROM_EMAIL:", FROM_EMAIL);
  console.log("SITE_URL:", SITE_URL);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, name, companyName, quoteId, statusReason }: EmailRequest = await req.json();
    console.log(`Processing ${type} email for ${email}`);

    // Create Supabase client to generate magic link
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const siteUrl = SITE_URL;

    let redirectTo: string;
    let subject: string;
    let htmlContent: string;

    if (type === "partner_more_info") {
      // More info requested notification
      redirectTo = `${siteUrl}/partner`;
      subject = "Vi beh\u00f6ver mer information - Flyttbas";

      htmlContent = `
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

            <h2 style="color: #1e293b; font-size: 20px;">Hej ${name},</h2>
            <p style="color: #1e293b; font-size: 16px;">Vi beh\u00f6ver lite mer information om din ans\u00f6kan.</p>

            <p>Tack f\u00f6r din partnerans\u00f6kan f\u00f6r <strong>${companyName}</strong>.</p>

            <p>V\u00e5rt team har granskat din ans\u00f6kan och beh\u00f6ver lite mer information innan vi kan g\u00e5 vidare.</p>

            ${statusReason ? `
            <div style="background-color: #f1f5f9; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
              <h4 style="color: #1e293b; margin: 0 0 10px 0;">Meddelande fr\u00e5n administrat\u00f6ren:</h4>
              <p style="color: #4a5568; margin: 0;">${statusReason}</p>
            </div>
            ` : ''}

            <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #1a365d; margin-top: 0;">Vad beh\u00f6ver du g\u00f6ra?</h3>
              <ol style="padding-left: 20px; margin: 0;">
                <li style="margin-bottom: 10px;">Logga in p\u00e5 din partnerpanel</li>
                <li style="margin-bottom: 10px;">Uppdatera din information enligt ovan</li>
                <li style="margin-bottom: 10px;">Din ans\u00f6kan kommer automatiskt att granskas igen</li>
              </ol>
            </div>

            <p style="text-align: center; margin: 30px 0;">
              <a href="${siteUrl}/partner" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 14px 35px; border-radius: 6px; font-weight: bold; font-size: 16px;">Uppdatera din ans\u00f6kan</a>
            </p>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

            <p style="color: #64748b; font-size: 14px; text-align: center;">
              Vid fr\u00e5gor, kontakta oss p\u00e5 <a href="mailto:info@flyttbas.se" style="color: #2563eb;">info@flyttbas.se</a>
            </p>
          </div>
        </body>
        </html>
      `;

      // Send email directly without magic link
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [email],
          subject: subject,
          html: htmlContent,
        }),
      });

      if (!resendResponse.ok) {
        const errorData = await resendResponse.text();
        console.error("Resend API error:", errorData);
        throw new Error(`Failed to send email: ${errorData}`);
      }

      const emailResponse = await resendResponse.json();
      console.log("More info requested email sent successfully:", emailResponse);

      return new Response(JSON.stringify({ success: true, emailId: emailResponse.id }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } else if (type === "partner_approved") {
      // Partner approval notification - no magic link needed
      redirectTo = `${siteUrl}/partner`;
      subject = "Din partnerans\u00f6kan har godk\u00e4nts - Flyttbas";

      htmlContent = `
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

            <div style="background-color: #dcfce7; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: center;">
              <h2 style="color: #166534; margin: 0;">Grattis, ${name}!</h2>
              <p style="color: #166534; margin: 10px 0 0 0; font-size: 18px;">Din partnerans\u00f6kan har godk\u00e4nts!</p>
            </div>

            <p>Vi \u00e4r glada att meddela att <strong>${companyName}</strong> nu \u00e4r en godk\u00e4nd partner p\u00e5 Flyttbas.</p>

            <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #1a365d; margin-top: 0;">Vad h\u00e4nder nu?</h3>
              <ul style="padding-left: 20px; margin: 0;">
                <li style="margin-bottom: 10px;">Du kommer nu att b\u00f6rja ta emot offertf\u00f6rfr\u00e5gningar fr\u00e5n kunder i ditt omr\u00e5de</li>
                <li style="margin-bottom: 10px;">Logga in p\u00e5 din partnerpanel f\u00f6r att se och svara p\u00e5 f\u00f6rfr\u00e5gningar</li>
                <li style="margin-bottom: 10px;">Tydliga och tidiga offerter f\u00e5r ofta mer uppm\u00e4rksamhet</li>
              </ul>
            </div>

            <p style="text-align: center; margin: 30px 0;">
              <a href="${siteUrl}/partner" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 14px 35px; border-radius: 6px; font-weight: bold; font-size: 16px;">G\u00e5 till partnerpanelen</a>
            </p>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

            <p style="color: #64748b; font-size: 14px; text-align: center;">
              Vid fr\u00e5gor, kontakta oss p\u00e5 <a href="mailto:info@flyttbas.se" style="color: #2563eb;">info@flyttbas.se</a>
            </p>
          </div>
        </body>
        </html>
      `;

      // For partner_approved, send email directly without magic link
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [email],
          subject: subject,
          html: htmlContent,
        }),
      });

      if (!resendResponse.ok) {
        const errorData = await resendResponse.text();
        console.error("Resend API error:", errorData);
        throw new Error(`Failed to send email: ${errorData}`);
      }

      const emailResponse = await resendResponse.json();
      console.log("Partner approval email sent successfully:", emailResponse);

      return new Response(JSON.stringify({ success: true, emailId: emailResponse.id }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } else if (type === "partner_application") {
      redirectTo = `${siteUrl}/partner`;
      subject = "Verifiera din e-post - Flyttbas";

      htmlContent = `
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

            <h2 style="color: #1a365d;">Tack f\u00f6r din ans\u00f6kan, ${name}!</h2>

            <p>Vi har mottagit din partnerans\u00f6kan f\u00f6r <strong>${companyName}</strong>.</p>

            <p>V\u00e5rt team kommer att granska dina uppgifter och \u00e5terkommer inom 1\u20132 arbetsdagar via e-post.</p>

            <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #1a365d; margin-top: 0;">Verifiera din e-post</h3>
              <p>Klicka p\u00e5 knappen nedan f\u00f6r att verifiera din e-postadress. Detta kr\u00e4vs innan din ans\u00f6kan kan godk\u00e4nnas.</p>
              <p style="text-align: center;">
                <a href="{{CONFIRM_LINK}}" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold;">Verifiera e-post</a>
              </p>
              <p style="font-size: 14px; color: #64748b;">Efter verifiering kan du logga in med e-post och l\u00f6senord som du angav vid registreringen.</p>
            </div>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

            <p style="color: #64748b; font-size: 14px; text-align: center;">
              Vid fr\u00e5gor, kontakta oss p\u00e5 <a href="mailto:info@flyttbas.se" style="color: #2563eb;">info@flyttbas.se</a>
            </p>
          </div>
        </body>
        </html>
      `;
    } else {
      // Quote request - redirect to setup password page
      redirectTo = quoteId
        ? `${siteUrl}/setup-password?quote=${quoteId}`
        : `${siteUrl}/setup-password`;
      subject = "Din offertf\u00f6rfr\u00e5gan har mottagits - Flyttbas";

      htmlContent = `
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

            <h2 style="color: #1a365d;">Tack f\u00f6r din f\u00f6rfr\u00e5gan, ${name}!</h2>

            <p>Vi har mottagit din offertf\u00f6rfr\u00e5gan och skickat den till verifierade f\u00f6retag i ditt omr\u00e5de.</p>

            <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #1a365d; margin-top: 0;">Vad h\u00e4nder nu?</h3>
              <ul style="color: #4a5568; padding-left: 20px;">
                <li>V\u00e5ra partners granskar din f\u00f6rfr\u00e5gan</li>
                <li>Du f\u00e5r offerter att j\u00e4mf\u00f6ra</li>
                <li>Du v\u00e4ljer den offert som passar dig b\u00e4st</li>
              </ul>
            </div>

            <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #1a365d; margin-top: 0;">Se dina offerter online</h3>
              <p>Klicka p\u00e5 knappen nedan f\u00f6r att skapa ditt konto och se dina offerter. Du kommer att kunna v\u00e4lja ett l\u00f6senord s\u00e5 du enkelt kan logga in n\u00e4sta g\u00e5ng.</p>

              <p style="text-align: center; margin: 20px 0;">
                <a href="{{MAGIC_LINK}}" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 14px 35px; border-radius: 6px; font-weight: bold; font-size: 16px;">Skapa konto</a>
              </p>

              <p style="font-size: 13px; color: #64748b; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
                <strong>Tips:</strong> Om du inte vill skapa ett l\u00f6senord kan du alltid beg\u00e4ra en ny inloggningsl\u00e4nk via <a href="${siteUrl}/auth" style="color: #2563eb;">inloggningssidan</a>.
              </p>
            </div>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

            <p style="color: #64748b; font-size: 14px; text-align: center;">
              Vid fr\u00e5gor, kontakta oss p\u00e5 <a href="mailto:info@flyttbas.se" style="color: #2563eb;">info@flyttbas.se</a>
            </p>
          </div>
        </body>
        </html>
      `;
    }

    // Generate magic link for both types
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: email,
      options: {
        redirectTo: redirectTo,
      },
    });

    if (linkError) {
      console.error("Error generating link:", linkError);
      throw new Error(`Failed to generate link: ${linkError.message}`);
    }

    // For partner applications, confirm the user's email since they set a password during registration
    if (type === "partner_application") {
      try {
        const { data: users } = await supabase.auth.admin.listUsers();
        const user = users?.users?.find(u => u.email === email);
        if (user) {
          await supabase.auth.admin.updateUserById(user.id, { email_confirm: true });
          console.log("Email confirmed for user:", email);
        }
      } catch (confirmError) {
        console.log("Could not auto-confirm email:", confirmError);
        // Not critical - user can still use the link
      }
    }

    // Replace link placeholder in email
    const actionLink = linkData?.properties?.action_link;
    console.log("Link generated successfully");

    const finalHtml = htmlContent
      .replace("{{CONFIRM_LINK}}", actionLink || redirectTo)
      .replace("{{MAGIC_LINK}}", actionLink || redirectTo);

    // Send email with Resend API
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: subject,
        html: finalHtml,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const emailResponse = await resendResponse.json();
    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation-email function:", error);
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
