import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "partner_application" | "quote_request";
  email: string;
  name: string;
  companyName?: string;
  quoteId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-confirmation-email function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, name, companyName, quoteId }: EmailRequest = await req.json();
    console.log(`Processing ${type} email for ${email}`);

    // Create Supabase client to generate magic link
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate magic link for the user
    const siteUrl = Deno.env.get("SITE_URL") || "https://preview--flyttbas.lovable.app";
    
    let redirectTo: string;
    let subject: string;
    let htmlContent: string;
    
    if (type === "partner_application") {
      redirectTo = `${siteUrl}/partner`;
      subject = "Din partneransökan har mottagits - Flyttbas";
      
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
            <h3 style="color: #1a365d; margin-top: 0;">Nästa steg</h3>
            <p>Klicka på knappen nedan för att skapa ditt konto och sätta ett lösenord:</p>
            <p style="text-align: center;">
              <a href="{{MAGIC_LINK}}" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold;">Skapa konto & sätt lösenord</a>
            </p>
            <p style="font-size: 14px; color: #666;">Du kan också alltid logga in med en engångslänk via din e-post.</p>
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
      // Quote request
      redirectTo = quoteId 
        ? `${siteUrl}/dashboard?quote=${quoteId}`
        : `${siteUrl}/dashboard`;
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
            <p>Du kan se alla dina offerter och detaljer i din kundportal.</p>
            
            <p><strong>Alternativ 1:</strong> Skapa ett konto</p>
            <p style="text-align: center;">
              <a href="{{MAGIC_LINK}}" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold;">Skapa konto & se offerter</a>
            </p>
            
            <p style="font-size: 14px; color: #666; margin-top: 20px;"><strong>Alternativ 2:</strong> Logga in med magisk länk varje gång du vill se dina offerter.</p>
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

    // Generate magic link
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: email,
      options: {
        redirectTo: redirectTo,
      },
    });

    if (linkError) {
      console.error("Error generating magic link:", linkError);
      throw new Error(`Failed to generate magic link: ${linkError.message}`);
    }

    // Replace magic link placeholder in email
    const magicLink = linkData?.properties?.action_link;
    console.log("Magic link generated successfully");
    
    const finalHtml = htmlContent.replace("{{MAGIC_LINK}}", magicLink || redirectTo);

    // Send email with Resend API
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Flyttbas <noreply@resend.dev>",
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
