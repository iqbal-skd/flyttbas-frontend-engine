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
      subject = "Vi behöver mer information - Flyttbas";
      
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a365d; margin: 0;">Flyttbas</h1>
          </div>
          
          <div style="background-color: #dbeafe; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: center;">
            <h2 style="color: #1e40af; margin: 0;">Hej ${name}!</h2>
            <p style="color: #1e40af; margin: 10px 0 0 0; font-size: 18px;">Vi behöver lite mer information om din ansökan</p>
          </div>
          
          <p>Tack för din partneransökan för <strong>${companyName}</strong>.</p>
          
          <p>Vårt team har granskat din ansökan och behöver lite mer information innan vi kan gå vidare.</p>
          
          ${statusReason ? `
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
            <h4 style="color: #92400e; margin: 0 0 10px 0;">Meddelande från administratören:</h4>
            <p style="color: #78350f; margin: 0;">${statusReason}</p>
          </div>
          ` : ''}
          
          <div style="background-color: #f7fafc; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <h3 style="color: #1a365d; margin-top: 0;">Vad behöver du göra?</h3>
            <ol style="padding-left: 20px; margin: 0;">
              <li style="margin-bottom: 10px;">Logga in på din partnerpanel</li>
              <li style="margin-bottom: 10px;">Uppdatera din information enligt ovan</li>
              <li style="margin-bottom: 10px;">Din ansökan kommer automatiskt att granskas igen</li>
            </ol>
          </div>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="${siteUrl}/partner" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 14px 35px; border-radius: 6px; font-weight: bold; font-size: 16px;">Uppdatera din ansökan</a>
          </p>
          
          <p style="color: #666; font-size: 14px;">
            Har du frågor? Kontakta oss på <a href="mailto:support@flyttbas.se" style="color: #2563eb;">support@flyttbas.se</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} Flyttbas. Sveriges ledande marknadsplats för flyttjänster.
          </p>
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
      subject = "Din partneransökan har godkänts! - Flyttbas";
      
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a365d; margin: 0;">Flyttbas</h1>
          </div>
          
          <div style="background-color: #dcfce7; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: center;">
            <h2 style="color: #166534; margin: 0;">🎉 Grattis, ${name}!</h2>
            <p style="color: #166534; margin: 10px 0 0 0; font-size: 18px;">Din partneransökan har godkänts!</p>
          </div>
          
          <p>Vi är glada att meddela att <strong>${companyName}</strong> nu är en godkänd partner på Flyttbas!</p>
          
          <div style="background-color: #f7fafc; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <h3 style="color: #1a365d; margin-top: 0;">Vad händer nu?</h3>
            <ul style="padding-left: 20px; margin: 0;">
              <li style="margin-bottom: 10px;">Du kommer nu att börja ta emot offertförfrågningar från kunder i ditt område</li>
              <li style="margin-bottom: 10px;">Logga in på din partnerpanel för att se och svara på förfrågningar</li>
              <li style="margin-bottom: 10px;">Ju snabbare du svarar, desto större chans att vinna kunden!</li>
            </ul>
          </div>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="${siteUrl}/partner" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 14px 35px; border-radius: 6px; font-weight: bold; font-size: 16px;">Gå till partnerpanelen</a>
          </p>
          
          <p style="color: #666; font-size: 14px;">
            Har du frågor? Kontakta oss på <a href="mailto:support@flyttbas.se" style="color: #2563eb;">support@flyttbas.se</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} Flyttbas. Sveriges ledande marknadsplats för flyttjänster.
          </p>
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
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a365d; margin: 0;">Flyttbas</h1>
          </div>
          
          <h2 style="color: #1a365d;">Tack för din ansökan, ${name}!</h2>
          
          <p>Vi har mottagit din partneransökan för <strong>${companyName}</strong>.</p>
          
          <p>Vårt team kommer att granska dina uppgifter och återkommer inom 1-2 arbetsdagar via e-post.</p>
          
          <div style="background-color: #f7fafc; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <h3 style="color: #1a365d; margin-top: 0;">Verifiera din e-post</h3>
            <p>Klicka på knappen nedan för att verifiera din e-postadress. Detta krävs innan din ansökan kan godkännas.</p>
            <p style="text-align: center;">
              <a href="{{CONFIRM_LINK}}" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold;">Verifiera e-post</a>
            </p>
            <p style="font-size: 14px; color: #666;">Efter verifiering kan du logga in med e-post och lösenord som du angav vid registreringen.</p>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Har du frågor? Kontakta oss på <a href="mailto:support@flyttbas.se" style="color: #2563eb;">support@flyttbas.se</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} Flyttbas. Sveriges ledande marknadsplats för flyttjänster.
          </p>
        </body>
        </html>
      `;
    } else {
      // Quote request - redirect to setup password page
      redirectTo = quoteId 
        ? `${siteUrl}/setup-password?quote=${quoteId}`
        : `${siteUrl}/setup-password`;
      subject = "Din offertförfrågan har mottagits - Flyttbas";
      
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a365d; margin: 0;">Flyttbas</h1>
          </div>
          
          <h2 style="color: #1a365d;">Tack för din förfrågan, ${name}!</h2>
          
          <p>Vi har mottagit din offertförfrågan och skickat den till verifierade flyttfirmor i ditt område.</p>
          
          <div style="background-color: #dcfce7; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <h3 style="color: #166534; margin-top: 0;">✓ Vad händer nu?</h3>
            <ul style="color: #166534; padding-left: 20px;">
              <li>Våra partners granskar din förfrågan</li>
              <li>Du får offerter direkt till din e-post</li>
              <li>Du väljer den offert som passar dig bäst</li>
            </ul>
          </div>
          
          <div style="background-color: #f7fafc; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <h3 style="color: #1a365d; margin-top: 0;">Se dina offerter online</h3>
            <p>Klicka på knappen nedan för att skapa ditt konto och se dina offerter. Du kommer att kunna välja ett lösenord så du enkelt kan logga in nästa gång.</p>
            
            <p style="text-align: center; margin: 20px 0;">
              <a href="{{MAGIC_LINK}}" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 14px 35px; border-radius: 6px; font-weight: bold; font-size: 16px;">Skapa konto</a>
            </p>
            
            <p style="font-size: 13px; color: #666; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
              <strong>Tips:</strong> Om du inte vill skapa ett lösenord kan du alltid begära en ny inloggningslänk via <a href="${siteUrl}/auth" style="color: #2563eb;">inloggningssidan</a>.
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Har du frågor? Kontakta oss på <a href="mailto:support@flyttbas.se" style="color: #2563eb;">support@flyttbas.se</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} Flyttbas. Sveriges ledande marknadsplats för flyttjänster.
          </p>
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
