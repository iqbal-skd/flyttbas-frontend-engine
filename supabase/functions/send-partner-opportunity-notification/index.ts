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
  serviceType: string;
  fromAddress: string;
  toAddress: string;
  moveDate: string;
  scope: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quoteId, serviceType, fromAddress, toAddress, moveDate, scope }: QuoteNotificationRequest = await req.json();

    console.log("Sending partner opportunity notifications for quote:", quoteId);

    // Validate required fields
    if (!quoteId) {
      throw new Error("Missing quoteId");
    }

    // Create Supabase client with service role to fetch all partners
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    console.log("Supabase URL:", supabaseUrl ? "Set" : "Missing");
    console.log("Service Role Key:", supabaseServiceKey ? "Set (length: " + supabaseServiceKey.length + ")" : "Missing");

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

    const ctaLink = `${siteUrl}/partner`;

    // Build all email objects
    const emails = partners.map((partner) => {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background-color: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1a365d; margin: 0; font-size: 28px; letter-spacing: 2px;">FLYTTBAS</h1>
            </div>

            <p style="font-size: 16px; color: #1e293b;">Hej ${partner.contact_name || partner.company_name},</p>

            <p style="font-size: 16px; color: #1e293b;">En ny uppdragsförfrågan matchar er verksamhet.</p>

            <div style="background-color: #f1f5f9; border-radius: 8px; padding: 24px; margin: 24px 0;">
              <p style="margin: 0 0 16px 0; font-size: 18px; color: #1e293b; font-weight: 600;">Sammanfattning</p>

              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; width: 40%;">Tjänst</td>
                  <td style="padding: 8px 0; font-weight: 500;">${serviceType || "Ej angiven"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">Datum</td>
                  <td style="padding: 8px 0; font-weight: 500;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">Från</td>
                  <td style="padding: 8px 0; font-weight: 500;">${fromAddress || "Ej angiven"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">Till</td>
                  <td style="padding: 8px 0; font-weight: 500;">${toAddress || "Ej angiven"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">Omfattning</td>
                  <td style="padding: 8px 0; font-weight: 500;">${scope || "Ej angiven"}</td>
                </tr>
              </table>
            </div>

            <p style="font-size: 15px; color: #1e293b; font-weight: 600; margin-bottom: 5px;">Nästa steg:</p>
            <p style="font-size: 15px; color: #4a5568; margin-top: 5px;">
              Logga in i partnerportalen för att se fullständiga detaljer och lämna offert.
            </p>

            <div style="text-align: center; margin: 35px 0;">
              <a href="${ctaLink}" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Visa förfrågan och lämna offert
              </a>
            </div>

            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 16px; margin: 24px 0;">
              <p style="margin: 0 0 5px 0; font-size: 14px; color: #1e293b; font-weight: 600;">Bra att veta:</p>
              <ul style="margin: 0; padding-left: 20px; color: #4a5568; font-size: 14px;">
                <li style="margin-bottom: 6px;">Kunder börjar ofta jämföra offerter så snart de första kommer in</li>
                <li style="margin-bottom: 6px;">Tydliga och tidiga offerter får därför ofta mer uppmärksamhet</li>
                <li style="margin-bottom: 0;">Det är alltid kvalitet och transparens som avgör kundens val</li>
              </ul>
            </div>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

            <p style="font-size: 13px; color: #64748b; text-align: center;">
              Du får detta mejl eftersom du är registrerad partner hos Flyttbas.
            </p>
            <p style="font-size: 13px; color: #64748b; text-align: center; margin-top: 5px;">
              Kontakt: <a href="mailto:info@flyttbas.se" style="color: #2563eb;">info@flyttbas.se</a>
            </p>
          </div>
        </body>
        </html>
      `;

      return {
        from: formattedFrom,
        to: [partner.contact_email],
        subject: "Ny uppdragsförfrågan att offerera via Flyttbas",
        html: emailHtml,
      };
    });

    // Send in batches of 100 (Resend Batch API limit) with retry and backoff
    const BATCH_SIZE = 100;
    const MAX_RETRIES = 3;
    let successCount = 0;

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);
      const batchIndex = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(emails.length / BATCH_SIZE);

      let lastError: Error | null = null;
      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          if (attempt > 0) {
            const backoffMs = Math.pow(2, attempt) * 1000; // 2s, 4s
            console.log(`Batch ${batchIndex}: retry ${attempt}, waiting ${backoffMs}ms`);
            await new Promise((r) => setTimeout(r, backoffMs));
          }

          const result = await resend.batch.send(batch);
          console.log(`Batch ${batchIndex}/${totalBatches} sent: ${batch.length} emails`, result);
          successCount += batch.length;
          lastError = null;
          break;
        } catch (err: any) {
          lastError = err;
          const isRateLimit = err?.statusCode === 429 || err?.message?.includes("rate");
          console.error(`Batch ${batchIndex} attempt ${attempt + 1} failed:`, err.message);
          if (!isRateLimit || attempt === MAX_RETRIES - 1) break;
        }
      }

      if (lastError) {
        console.error(`Batch ${batchIndex} failed after ${MAX_RETRIES} retries`);
      }

      // Wait between batches to stay under rate limit
      if (i + BATCH_SIZE < emails.length) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

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
