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

interface RegisterPartnerRequest {
  email: string;
  password: string;
  name: string;
  companyName: string;
  orgNumber: string;
  contactPhone: string;
  address?: string;
  addressLat?: number;
  addressLng?: number;
  trafficLicenseNumber?: string;
  fTaxCertificate: boolean;
  insuranceCompany?: string;
}

const jsonResponse = (body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

const handler = async (req: Request): Promise<Response> => {
  console.log("register-partner function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: RegisterPartnerRequest = await req.json();
    const {
      email, password, name, companyName, orgNumber, contactPhone,
      address, addressLat, addressLng, trafficLicenseNumber,
      fTaxCertificate, insuranceCompany,
    } = body;

    console.log(`Registering partner for ${email}`);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Check if a partner already exists with this email
    const { data: existingPartner } = await supabase
      .from("partners")
      .select("id")
      .eq("contact_email", email)
      .maybeSingle();

    if (existingPartner) {
      return jsonResponse({
        success: false,
        error: "Denna e-postadress används redan av en annan partner. Använd en annan e-postadress.",
      });
    }

    // 2. Check if user already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("email", email)
      .maybeSingle();

    if (existingProfile) {
      return jsonResponse({
        success: false,
        error: "Denna e-postadress är redan registrerad. Vänligen logga in först för att bli partner.",
      });
    }

    // 3. Create user via admin API (no Supabase confirmation email sent)
    const { data: userData, error: createUserError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name },
    });

    if (createUserError) {
      console.error("Error creating user:", createUserError);
      if (createUserError.message?.includes("already been registered")) {
        return jsonResponse({
          success: false,
          error: "Denna e-postadress är redan registrerad. Logga in först eller använd en annan e-post.",
        });
      }
      return jsonResponse({
        success: false,
        error: "Kunde inte skapa användarkonto. Försök igen.",
      });
    }

    const userId = userData.user.id;
    console.log("User created:", userId);

    // 4. Set partner role (the handle_new_user trigger already created 'customer' role)
    await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "customer");
    const { error: roleError } = await supabase.from("user_roles").upsert(
      { user_id: userId, role: "partner" },
      { onConflict: "user_id,role" }
    );

    if (roleError) {
      console.error("Error setting partner role:", roleError);
      return jsonResponse({
        success: false,
        error: "Kunde inte sätta partnerroll. Försök igen.",
      });
    }
    console.log("Partner role set for user:", userId);

    // 5. Create partner record
    const { error: partnerError } = await supabase.from("partners").insert({
      user_id: userId,
      company_name: companyName,
      org_number: orgNumber,
      contact_name: name,
      contact_email: email,
      contact_phone: contactPhone,
      address: address || null,
      address_lat: addressLat || null,
      address_lng: addressLng || null,
      traffic_license_number: trafficLicenseNumber || null,
      f_tax_certificate: fTaxCertificate,
      insurance_company: insuranceCompany || null,
      status: "pending",
    });

    if (partnerError) {
      console.error("Error creating partner record:", partnerError);
      return jsonResponse({
        success: false,
        error: "Kunde inte skapa partnerpost. Försök igen.",
      });
    }
    console.log("Partner record created for user:", userId);

    // 6. Generate magic link for email verification
    const siteUrl = SITE_URL;
    const redirectTo = `${siteUrl}/partner`;

    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: email,
      options: { redirectTo },
    });

    if (linkError) {
      console.error("Error generating magic link:", linkError);
      // Don't fail the whole registration if link generation fails
    }

    const actionLink = linkData?.properties?.action_link || redirectTo;

    // 7. Send confirmation email via Resend
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

          <h2 style="color: #1a365d;">Tack f\u00f6r din ans\u00f6kan, ${name}!</h2>

          <p>Vi har mottagit din partnerans\u00f6kan f\u00f6r <strong>${companyName}</strong>.</p>

          <p>V\u00e5rt team kommer att granska dina uppgifter och \u00e5terkommer inom 1\u20132 arbetsdagar via e-post.</p>

          <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <h3 style="color: #1a365d; margin-top: 0;">Verifiera din e-post</h3>
            <p>Klicka p\u00e5 knappen nedan f\u00f6r att verifiera din e-postadress. Detta kr\u00e4vs innan din ans\u00f6kan kan godk\u00e4nnas.</p>
            <p style="text-align: center;">
              <a href="${actionLink}" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold;">Verifiera e-post</a>
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

    try {
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [email],
          subject: "Verifiera din e-post - Flyttbas",
          html: htmlContent,
        }),
      });

      if (!resendResponse.ok) {
        const errorData = await resendResponse.text();
        console.error("Resend API error:", errorData);
        // Don't fail registration if email fails
      } else {
        console.log("Confirmation email sent successfully");
      }
    } catch (emailErr) {
      console.error("Failed to send email:", emailErr);
      // Don't fail registration if email fails
    }

    return jsonResponse({ success: true, userId });
  } catch (error: any) {
    console.error("Error in register-partner function:", error);
    return jsonResponse({
      success: false,
      error: error.message || "Något gick fel vid registrering. Försök igen.",
    });
  }
};

serve(handler);
