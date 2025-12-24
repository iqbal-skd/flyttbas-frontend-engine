import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL_RAW = Deno.env.get("FROM_EMAIL") || "noreply@resend.dev";
const FROM_EMAIL = FROM_EMAIL_RAW.includes("<") 
  ? FROM_EMAIL_RAW 
  : `Flyttbas <${FROM_EMAIL_RAW}>`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OfferAcceptedRequest {
  // Partner details
  partnerEmail: string;
  partnerName: string;
  companyName: string;
  // Customer details
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  // Offer details
  offerPrice: number;
  moveDate: string;
  fromAddress: string;
  toAddress: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-offer-accepted function called");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      partnerEmail,
      partnerName,
      companyName,
      customerName,
      customerEmail,
      customerPhone,
      offerPrice,
      moveDate,
      fromAddress,
      toAddress,
    }: OfferAcceptedRequest = await req.json();
    
    console.log(`Sending offer accepted notification to partner ${partnerEmail}`);
    console.log(`Customer: ${customerName}, ${customerEmail}, ${customerPhone}`);

    const formattedDate = new Date(moveDate).toLocaleDateString('sv-SE', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const formattedPrice = offerPrice.toLocaleString('sv-SE');

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
            <h1 style="color: #16a34a; margin: 0; font-size: 28px;">🎉 Grattis! Din offert har godkänts!</h1>
          </div>
          
          <p style="font-size: 18px; color: #1a365d;">Hej ${partnerName}!</p>
          
          <p style="font-size: 16px;">Fantastiska nyheter! <strong>${customerName}</strong> har godkänt er offert för flytten.</p>
          
          <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); border-radius: 12px; padding: 25px; margin: 30px 0; color: white;">
            <div style="text-align: center;">
              <p style="margin: 0 0 5px 0; font-size: 14px; opacity: 0.9;">Godkänt pris</p>
              <p style="margin: 0; font-size: 36px; font-weight: bold;">${formattedPrice} kr</p>
            </div>
          </div>
          
          <div style="background-color: #f0fdf4; border: 2px solid #16a34a; border-radius: 12px; padding: 25px; margin: 25px 0;">
            <h2 style="color: #16a34a; margin: 0 0 15px 0; font-size: 18px;">📞 Kontaktuppgifter till kunden</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-weight: 500;">Namn</td>
                <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #1a365d;">${customerName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-weight: 500;">E-post</td>
                <td style="padding: 10px 0; text-align: right;">
                  <a href="mailto:${customerEmail}" style="color: #2563eb; font-weight: 600; text-decoration: none;">${customerEmail}</a>
                </td>
              </tr>
              ${customerPhone ? `
              <tr>
                <td style="padding: 10px 0; color: #64748b; font-weight: 500;">Telefon</td>
                <td style="padding: 10px 0; text-align: right;">
                  <a href="tel:${customerPhone}" style="color: #2563eb; font-weight: 600; text-decoration: none;">${customerPhone}</a>
                </td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #1a365d;">📦 Flyttdetaljer</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b;">📅 Datum</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 500;">${formattedDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">📍 Från</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 500;">${fromAddress}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">📍 Till</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 500;">${toAddress}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #fef3c7; border-radius: 8px; padding: 15px; margin: 25px 0;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              ⏰ <strong>Viktigt:</strong> Kontakta kunden så snart som möjligt för att bekräfta detaljerna för flytten.
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="color: #64748b; font-size: 14px; text-align: center;">
            Har du frågor? Kontakta oss på <a href="mailto:support@flyttbas.se" style="color: #2563eb;">support@flyttbas.se</a>
          </p>
          
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
            © ${new Date().getFullYear()} Flyttbas. Sveriges ledande marknadsplats för flyttjänster.
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
        to: [partnerEmail],
        subject: `🎉 Din offert har godkänts av ${customerName}!`,
        html: htmlContent,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const emailResponse = await resendResponse.json();
    console.log("Offer accepted email sent successfully to partner:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-offer-accepted function:", error);
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
