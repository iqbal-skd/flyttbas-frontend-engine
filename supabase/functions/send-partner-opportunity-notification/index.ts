import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuoteNotificationRequest {
  quoteId: string;
  fromAddress: string;
  toAddress: string;
  moveDate: string;
  dwellingType: string;
  areaM2: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quoteId, fromAddress, toAddress, moveDate, dwellingType, areaM2 }: QuoteNotificationRequest = await req.json();

    console.log("Sending partner opportunity notifications for quote:", quoteId);

    // Validate required fields
    if (!quoteId) {
      throw new Error("Missing quoteId");
    }

    // Create Supabase client with service role to fetch all partners
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    // SUPABASE_SERVICE_ROLE_KEY is automatically provided by Supabase Edge Functions
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    
    console.log("Supabase URL:", supabaseUrl ? "Set" : "Missing");
    console.log("Service Role Key:", supabaseServiceKey ? "Set (length: " + supabaseServiceKey.length + ")" : "Missing");
    
    // Create client with service role - must explicitly set Authorization header
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
      },
    });

    // Fetch all approved partners
    const { data: partners, error: partnersError } = await supabase
      .from("partners")
      .select("id, contact_email, contact_name, company_name")
      .eq("status", "approved");

    if (partnersError) {
      console.error("Error fetching partners - Code:", partnersError.code);
      console.error("Error fetching partners - Message:", partnersError.message);
      console.error("Error fetching partners - Details:", partnersError.details);
      console.error("Error fetching partners - Hint:", partnersError.hint);
      throw new Error(`Failed to fetch partners: ${partnersError.message}`);
    }

    if (!partners || partners.length === 0) {
      console.log("No approved partners found to notify");
      return new Response(
        JSON.stringify({ success: true, notified: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Found ${partners.length} approved partners to notify`);

    const siteUrl = (Deno.env.get("SITE_URL") || "https://flyttbas.se").replace(/\/$/, "");
    const fromEmail = Deno.env.get("FROM_EMAIL") || "hello@updates.omnisite.se";
    const formattedFrom = fromEmail.includes("<") ? fromEmail : `Flyttbas <${fromEmail}>`;

    // Format move date
    const formattedDate = new Date(moveDate).toLocaleDateString("sv-SE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Dwelling type labels
    const dwellingLabels: Record<string, string> = {
      apartment: "Lägenhet",
      house: "Villa/Hus",
      room: "Rum",
      office: "Kontor",
      storage: "Förråd",
    };
    const dwellingLabel = dwellingLabels[dwellingType] || dwellingType;

    // Send emails to all partners
    const emailPromises = partners.map(async (partner) => {
      try {
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0; font-size: 24px;">🚚 Ny Flyttförfrågan!</h1>
            </div>
            
            <p style="font-size: 16px;">Hej ${partner.contact_name || partner.company_name}!</p>
            
            <p style="font-size: 16px;">En ny flyttförfrågan har kommit in som kan passa er verksamhet.</p>
            
            <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0;">
              <h2 style="margin: 0 0 16px 0; font-size: 18px; color: #1e293b;">Sammanfattning</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; width: 40%;">📍 Från:</td>
                  <td style="padding: 8px 0; font-weight: 500;">${fromAddress || "Ej angiven"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">📍 Till:</td>
                  <td style="padding: 8px 0; font-weight: 500;">${toAddress || "Ej angiven"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">📅 Flyttdatum:</td>
                  <td style="padding: 8px 0; font-weight: 500;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">🏠 Bostadstyp:</td>
                  <td style="padding: 8px 0; font-weight: 500;">${dwellingLabel}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">📐 Storlek:</td>
                  <td style="padding: 8px 0; font-weight: 500;">${areaM2} m²</td>
                </tr>
              </table>
            </div>
            
            <p style="font-size: 16px;">Logga in för att se alla detaljer och skicka din offert!</p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${siteUrl}/partner" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Visa och Offerera
              </a>
            </div>
            
            <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin: 24px 0;">
              <p style="margin: 0; font-size: 14px; color: #92400e;">
                💡 <strong>Tips:</strong> Snabba svar ökar chansen att vinna jobbet!
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #64748b; text-align: center;">
              Du får detta mail eftersom du är registrerad partner hos Flyttbas.<br>
              <a href="${siteUrl}" style="color: #2563eb;">flyttbas.se</a>
            </p>
          </body>
          </html>
        `;

        await resend.emails.send({
          from: formattedFrom,
          to: [partner.contact_email],
          subject: `🚚 Ny flyttförfrågan - ${fromAddress?.split(",")[0] || "Se detaljer"}`,
          html: emailHtml,
        });

        console.log(`Email sent to partner: ${partner.contact_email}`);
        return { success: true, email: partner.contact_email };
      } catch (emailError) {
        console.error(`Failed to send email to ${partner.contact_email}:`, emailError);
        return { success: false, email: partner.contact_email, error: emailError };
      }
    });

    const results = await Promise.all(emailPromises);
    const successCount = results.filter(r => r.success).length;

    console.log(`Successfully notified ${successCount}/${partners.length} partners`);

    return new Response(
      JSON.stringify({ success: true, notified: successCount, total: partners.length }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in send-partner-opportunity-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
