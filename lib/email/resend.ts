import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? "AiLex <noreply@ailex.fr>"

export async function sendNewsletter(opts: {
  to: string[]
  subject: string
  html: string
  replyTo?: string
}) {
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    replyTo: opts.replyTo,
  })

  if (error) throw new Error(error.message)
  return data
}

export async function sendWelcomeEmail(to: string, name: string) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: "Bienvenue sur AiLex !",
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; padding: 40px 20px; margin: 0;">
  <div style="max-width: 520px; margin: 0 auto; background: #0f172a; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b;">
    <div style="background: linear-gradient(135deg, #0e7490, #1e40af); padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Ai<span style="color: #22d3ee;">Lex</span></h1>
      <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 14px;">Votre veille stratégique automatisée</p>
    </div>
    <div style="padding: 32px;">
      <h2 style="color: white; font-size: 20px; margin: 0 0 12px;">Bienvenue, ${name} !</h2>
      <p style="color: #94a3b8; line-height: 1.6; margin: 0 0 20px;">
        Votre compte AiLex est prêt. Commencez dès maintenant à configurer vos sources de veille
        et laissez l'IA faire le travail pour vous.
      </p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
         style="display: inline-block; background: #06b6d4; color: #0f172a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
        Accéder au tableau de bord →
      </a>
    </div>
    <div style="padding: 16px 32px; border-top: 1px solid #1e293b; text-align: center;">
      <p style="color: #475569; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} AiLex · <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(to)}" style="color: #64748b;">Se désabonner</a>
      </p>
    </div>
  </div>
</body>
</html>`,
  })
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: "Réinitialisation de votre mot de passe AiLex",
    html: `
<!DOCTYPE html>
<html lang="fr">
<body style="font-family: -apple-system, sans-serif; background: #f8fafc; padding: 40px 20px; margin: 0;">
  <div style="max-width: 520px; margin: 0 auto; background: #0f172a; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b; padding: 32px;">
    <h2 style="color: white; margin: 0 0 16px;">Réinitialisation du mot de passe</h2>
    <p style="color: #94a3b8; margin: 0 0 24px; line-height: 1.6;">
      Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe. Ce lien expire dans 1 heure.
    </p>
    <a href="${resetUrl}" style="display: inline-block; background: #06b6d4; color: #0f172a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
      Réinitialiser mon mot de passe →
    </a>
    <p style="color: #475569; font-size: 12px; margin: 24px 0 0;">
      Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
    </p>
  </div>
</body>
</html>`,
  })
}
