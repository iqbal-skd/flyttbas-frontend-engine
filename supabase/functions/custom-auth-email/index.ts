import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface AuthEmailPayload {
  user: {
    email: string;
    user_metadata?: {
      full_name?: string;
    };
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload: AuthEmailPayload = await req.json();
    const { user, email_data } = payload;

    console.log("Auth email hook triggered:", email_data.email_action_type);

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const siteUrl = (Deno.env.get("SITE_URL") || "https://flyttbas.se").replace(/\/$/, "");
    const fromEmail = Deno.env.get("FROM_EMAIL") || "hello@updates.omnisite.se";
    const formattedFrom = fromEmail.includes("<") ? fromEmail : `Flyttbas <${fromEmail}>`;

    const userName = user.user_metadata?.full_name || user.email.split("@")[0];

    // Build the verification URL
    const verifyUrl = `${supabaseUrl}/auth/v1/verify?token=${email_data.token_hash}&type=${email_data.email_action_type}&redirect_to=${encodeURIComponent(email_data.redirect_to)}`;

    let subject = "";
    let emailHtml = "";

    switch (email_data.email_action_type) {
      case "signup":
        subject = "V\u00e4lkommen till Flyttbas \u2013 Bekr\u00e4fta din e-post";
        emailHtml = buildSignupEmail(userName, verifyUrl, siteUrl);
        break;
      case "magiclink":
        subject = "Logga in p\u00e5 Flyttbas";
        emailHtml = buildMagicLinkEmail(userName, verifyUrl, siteUrl);
        break;
      case "recovery":
        subject = "\u00c5terst\u00e4ll ditt l\u00f6senord \u2013 Flyttbas";
        emailHtml = buildRecoveryEmail(userName, verifyUrl, siteUrl);
        break;
      case "email_change":
        subject = "Bekr\u00e4fta din nya e-postadress \u2013 Flyttbas";
        emailHtml = buildEmailChangeEmail(userName, verifyUrl, siteUrl);
        break;
      default:
        subject = "Meddelande fr\u00e5n Flyttbas";
        emailHtml = buildGenericEmail(userName, verifyUrl, siteUrl, email_data.email_action_type);
    }

    const { error } = await resend.emails.send({
      from: formattedFrom,
      to: [user.email],
      subject,
      html: emailHtml,
    });

    if (error) {
      console.error("Failed to send auth email:", error);
      throw error;
    }

    console.log(`Auth email sent successfully to ${user.email}`);

    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error in custom-auth-email:", error);
    return new Response(
      JSON.stringify({
        error: {
          http_code: 500,
          message: error.message,
        },
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

function buildSignupEmail(name: string, verifyUrl: string, siteUrl: string): string {
  return `
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

        <h2 style="color: #1e293b; font-size: 22px;">V\u00e4lkommen, ${name}!</h2>

        <p style="font-size: 16px;">Tack f\u00f6r att du registrerade dig hos Flyttbas. Klicka p\u00e5 knappen nedan f\u00f6r att bekr\u00e4fta din e-postadress och aktivera ditt konto.</p>

        <div style="text-align: center; margin: 35px 0;">
          <a href="${verifyUrl}" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Bekr\u00e4fta e-postadress
          </a>
        </div>

        <p style="font-size: 14px; color: #64748b;">Om knappen inte fungerar, kopiera och klistra in denna l\u00e4nk i din webbl\u00e4sare:</p>
        <p style="font-size: 12px; color: #64748b; word-break: break-all;">${verifyUrl}</p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

        <p style="font-size: 12px; color: #64748b; text-align: center;">
          Om du inte skapade ett konto hos oss kan du ignorera detta mail.<br>
          <a href="mailto:info@flyttbas.se" style="color: #2563eb;">info@flyttbas.se</a>
        </p>
      </div>
    </body>
    </html>
  `;
}

function buildMagicLinkEmail(name: string, verifyUrl: string, siteUrl: string): string {
  return `
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

        <h2 style="color: #1e293b; font-size: 22px;">Hej ${name}!</h2>

        <p style="font-size: 16px;">Klicka p\u00e5 knappen nedan f\u00f6r att logga in p\u00e5 ditt Flyttbas-konto.</p>

        <div style="text-align: center; margin: 35px 0;">
          <a href="${verifyUrl}" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Logga in
          </a>
        </div>

        <p style="font-size: 14px; color: #64748b;">Denna l\u00e4nk \u00e4r giltig i 1 timme.</p>

        <p style="font-size: 14px; color: #64748b;">Om knappen inte fungerar, kopiera och klistra in denna l\u00e4nk i din webbl\u00e4sare:</p>
        <p style="font-size: 12px; color: #64748b; word-break: break-all;">${verifyUrl}</p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

        <p style="font-size: 12px; color: #64748b; text-align: center;">
          Om du inte beg\u00e4rde denna inloggningsl\u00e4nk kan du ignorera detta mail.<br>
          <a href="mailto:info@flyttbas.se" style="color: #2563eb;">info@flyttbas.se</a>
        </p>
      </div>
    </body>
    </html>
  `;
}

function buildRecoveryEmail(name: string, verifyUrl: string, siteUrl: string): string {
  return `
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

        <h2 style="color: #1e293b; font-size: 22px;">\u00c5terst\u00e4ll ditt l\u00f6senord</h2>

        <p style="font-size: 16px;">Hej ${name},</p>

        <p style="font-size: 16px;">Vi har f\u00e5tt en beg\u00e4ran om att \u00e5terst\u00e4lla l\u00f6senordet f\u00f6r ditt Flyttbas-konto. Klicka p\u00e5 knappen nedan f\u00f6r att v\u00e4lja ett nytt l\u00f6senord.</p>

        <div style="text-align: center; margin: 35px 0;">
          <a href="${verifyUrl}" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
            \u00c5terst\u00e4ll l\u00f6senord
          </a>
        </div>

        <p style="font-size: 14px; color: #64748b;">Denna l\u00e4nk \u00e4r giltig i 1 timme.</p>

        <p style="font-size: 14px; color: #64748b;">Om knappen inte fungerar, kopiera och klistra in denna l\u00e4nk i din webbl\u00e4sare:</p>
        <p style="font-size: 12px; color: #64748b; word-break: break-all;">${verifyUrl}</p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

        <p style="font-size: 12px; color: #64748b; text-align: center;">
          Om du inte beg\u00e4rde l\u00f6senords\u00e5terst\u00e4llning kan du ignorera detta mail.<br>
          <a href="mailto:info@flyttbas.se" style="color: #2563eb;">info@flyttbas.se</a>
        </p>
      </div>
    </body>
    </html>
  `;
}

function buildEmailChangeEmail(name: string, verifyUrl: string, siteUrl: string): string {
  return `
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

        <h2 style="color: #1e293b; font-size: 22px;">Bekr\u00e4fta din nya e-postadress</h2>

        <p style="font-size: 16px;">Hej ${name},</p>

        <p style="font-size: 16px;">Klicka p\u00e5 knappen nedan f\u00f6r att bekr\u00e4fta din nya e-postadress f\u00f6r ditt Flyttbas-konto.</p>

        <div style="text-align: center; margin: 35px 0;">
          <a href="${verifyUrl}" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Bekr\u00e4fta e-postadress
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

        <p style="font-size: 12px; color: #64748b; text-align: center;">
          Om du inte beg\u00e4rde denna \u00e4ndring, kontakta oss.<br>
          <a href="mailto:info@flyttbas.se" style="color: #2563eb;">info@flyttbas.se</a>
        </p>
      </div>
    </body>
    </html>
  `;
}

function buildGenericEmail(name: string, verifyUrl: string, siteUrl: string, actionType: string): string {
  return `
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

        <h2 style="color: #1e293b; font-size: 22px;">Hej ${name}!</h2>

        <p style="font-size: 16px;">Klicka p\u00e5 l\u00e4nken nedan f\u00f6r att forts\u00e4tta:</p>

        <div style="text-align: center; margin: 35px 0;">
          <a href="${verifyUrl}" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Forts\u00e4tt
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

        <p style="font-size: 12px; color: #64748b; text-align: center;">
          <a href="mailto:info@flyttbas.se" style="color: #2563eb;">info@flyttbas.se</a>
        </p>
      </div>
    </body>
    </html>
  `;
}

serve(handler);
