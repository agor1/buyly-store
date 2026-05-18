import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const sendContactMessage = async ({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.CONTACT_TO_EMAIL,
    replyTo: email,
    subject: `Nowa wiadomosc kontaktowa od ${name}`,
    text: [
      "Nowa wiadomosc kontaktowa",
      "",
      `Imie i nazwisko: ${name}`,
      `Email: ${email}`,
      "",
      "Tresc wiadomosci:",
      message,
    ].join("\n"),
    html: `
      <!doctype html>
      <html lang="pl">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Nowa wiadomo&#347;&#263; kontaktowa</title>
        </head>
        <body style="margin:0; padding:0; background:#f4f7fb; font-family:Arial, Helvetica, sans-serif; color:#172033;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb; padding:32px 16px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; overflow:hidden; border-radius:14px; background:#ffffff; box-shadow:0 16px 40px rgba(23, 32, 51, 0.08);">
                  <tr>
                    <td style="background:#0f172a; padding:28px 32px;">
                      <p style="margin:0 0 8px; color:#67e8f9; font-size:13px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;">Buyly Store</p>
                      <h1 style="margin:0; color:#ffffff; font-size:24px; line-height:1.3;">Nowa wiadomo&#347;&#263; kontaktowa</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:28px 32px 8px;">
                      <p style="margin:0 0 20px; color:#475569; font-size:15px; line-height:1.6;">U&#380;ytkownik wys&#322;a&#322; wiadomo&#347;&#263; przez formularz kontaktowy.</p>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate; border-spacing:0 10px;">
                        <tr>
                          <td style="width:150px; padding:12px 14px; border:1px solid #e2e8f0; border-right:0; border-radius:10px 0 0 10px; background:#f8fafc; color:#64748b; font-size:13px; font-weight:700;">Imi&#281; i nazwisko</td>
                          <td style="padding:12px 14px; border:1px solid #e2e8f0; border-radius:0 10px 10px 0; color:#172033; font-size:15px;">${safeName}</td>
                        </tr>
                        <tr>
                          <td style="width:150px; padding:12px 14px; border:1px solid #e2e8f0; border-right:0; border-radius:10px 0 0 10px; background:#f8fafc; color:#64748b; font-size:13px; font-weight:700;">Email</td>
                          <td style="padding:12px 14px; border:1px solid #e2e8f0; border-radius:0 10px 10px 0; color:#172033; font-size:15px;"><a href="mailto:${safeEmail}" style="color:#0891b2; text-decoration:none;">${safeEmail}</a></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px 32px 32px;">
                      <h2 style="margin:0 0 12px; color:#172033; font-size:18px; line-height:1.4;">Tre&#347;&#263; wiadomo&#347;ci</h2>
                      <div style="padding:18px; border:1px solid #e2e8f0; border-radius:12px; background:#f8fafc; color:#172033; font-size:15px; line-height:1.7; white-space:pre-wrap;">${safeMessage}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 32px; border-top:1px solid #e2e8f0; background:#f8fafc; color:#64748b; font-size:12px; line-height:1.5;">
                      Odpowiedz bezpo&#347;rednio na tego maila, aby skontaktowa&#263; si&#281; z u&#380;ytkownikiem.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
};
