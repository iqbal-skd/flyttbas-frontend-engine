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
        subject = "Välkommen till Flyttbas - Bekräfta din e-post";
        emailHtml = buildSignupEmail(userName, verifyUrl, siteUrl);
        break;
      case "magiclink":
        subject = "Logga in på Flyttbas";
        emailHtml = buildMagicLinkEmail(userName, verifyUrl, siteUrl);
        break;
      case "recovery":
        subject = "Återställ ditt lösenord - Flyttbas";
        emailHtml = buildRecoveryEmail(userName, verifyUrl, siteUrl);
        break;
      case "email_change":
        subject = "Bekräfta din nya e-postadress - Flyttbas";
        emailHtml = buildEmailChangeEmail(userName, verifyUrl, siteUrl);
        break;
      default:
        subject = "Meddelande från Flyttbas";
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
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0; font-size: 28px;">Flyttbas</h1>
      </div>
      
      <h2 style="color: #1e293b; font-size: 22px;">Välkommen, ${name}!</h2>
      
      <p style="font-size: 16px;">Tack för att du registrerade dig hos Flyttbas. Klicka på knappen nedan för att bekräfta din e-postadress och aktivera ditt konto.</p>
      
      <div style="text-align: center; margin: 35px 0;">
        <a href="${verifyUrl}" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
          Bekräfta e-postadress
        </a>
      </div>
      
      <p style="font-size: 14px; color: #64748b;">Om knappen inte fungerar, kopiera och klistra in denna länk i din webbläsare:</p>
      <p style="font-size: 12px; color: #64748b; word-break: break-all;">${verifyUrl}</p>
      
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
      
      <p style="font-size: 12px; color: #64748b; text-align: center;">
        Om du inte skapade ett konto hos oss kan du ignorera detta mail.<br>
        <a href="${siteUrl}" style="color: #2563eb;">flyttbas.se</a>
      </p>
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
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0; font-size: 28px;">Flyttbas</h1>
      </div>
      
      <h2 style="color: #1e293b; font-size: 22px;">Hej ${name}!</h2>
      
      <p style="font-size: 16px;">Klicka på knappen nedan för att logga in på ditt Flyttbas-konto.</p>
      
      <div style="text-align: center; margin: 35px 0;">
        <a href="${verifyUrl}" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
          Logga in
        </a>
      </div>
      
      <p style="font-size: 14px; color: #64748b;">Denna länk är giltig i 1 timme.</p>
      
      <p style="font-size: 14px; color: #64748b;">Om knappen inte fungerar, kopiera och klistra in denna länk i din webbläsare:</p>
      <p style="font-size: 12px; color: #64748b; word-break: break-all;">${verifyUrl}</p>
      
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
      
      <p style="font-size: 12px; color: #64748b; text-align: center;">
        Om du inte begärde denna inloggningslänk kan du ignorera detta mail.<br>
        <a href="${siteUrl}" style="color: #2563eb;">flyttbas.se</a>
      </p>
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
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0; font-size: 28px;">Flyttbas</h1>
      </div>
      
      <h2 style="color: #1e293b; font-size: 22px;">Återställ ditt lösenord</h2>
      
      <p style="font-size: 16px;">Hej ${name},</p>
      
      <p style="font-size: 16px;">Vi har fått en begäran om att återställa lösenordet för ditt Flyttbas-konto. Klicka på knappen nedan för att välja ett nytt lösenord.</p>
      
      <div style="text-align: center; margin: 35px 0;">
        <a href="${verifyUrl}" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
          Återställ lösenord
        </a>
      </div>
      
      <p style="font-size: 14px; color: #64748b;">Denna länk är giltig i 1 timme.</p>
      
      <p style="font-size: 14px; color: #64748b;">Om knappen inte fungerar, kopiera och klistra in denna länk i din webbläsare:</p>
      <p style="font-size: 12px; color: #64748b; word-break: break-all;">${verifyUrl}</p>
      
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
      
      <p style="font-size: 12px; color: #64748b; text-align: center;">
        Om du inte begärde lösenordsåterställning kan du ignorera detta mail.<br>
        <a href="${siteUrl}" style="color: #2563eb;">flyttbas.se</a>
      </p>
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
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0; font-size: 28px;">Flyttbas</h1>
      </div>
      
      <h2 style="color: #1e293b; font-size: 22px;">Bekräfta din nya e-postadress</h2>
      
      <p style="font-size: 16px;">Hej ${name},</p>
      
      <p style="font-size: 16px;">Klicka på knappen nedan för att bekräfta din nya e-postadress för ditt Flyttbas-konto.</p>
      
      <div style="text-align: center; margin: 35px 0;">
        <a href="${verifyUrl}" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
          Bekräfta e-postadress
        </a>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
      
      <p style="font-size: 12px; color: #64748b; text-align: center;">
        Om du inte begärde denna ändring, kontakta oss omedelbart.<br>
        <a href="${siteUrl}" style="color: #2563eb;">flyttbas.se</a>
      </p>
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
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0; font-size: 28px;">Flyttbas</h1>
      </div>
      
      <h2 style="color: #1e293b; font-size: 22px;">Hej ${name}!</h2>
      
      <p style="font-size: 16px;">Klicka på länken nedan för att fortsätta:</p>
      
      <div style="text-align: center; margin: 35px 0;">
        <a href="${verifyUrl}" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
          Fortsätt
        </a>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
      
      <p style="font-size: 12px; color: #64748b; text-align: center;">
        <a href="${siteUrl}" style="color: #2563eb;">flyttbas.se</a>
      </p>
    </body>
    </html>
  `;
}

serve(handler);
