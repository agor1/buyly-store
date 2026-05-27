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

interface OrderConfirmationItem {
  name: string;
  quantity: number;
  unitPrice: string | number;
}

interface SendOrderConfirmationEmailData {
  email: string;
  customerName?: string | null;
  orderId: string;
  shippingAddress: string;
  shippingLabel: string;
  paymentLabel: string;
  items: OrderConfirmationItem[];
  totalPrice: string | number;
}

const formatPrice = (price: string | number) => {
  const value = Number(price);

  if (Number.isNaN(value)) {
    return String(price);
  }

  return new Intl.NumberFormat("pl-PL", {
    currency: "PLN",
    style: "currency",
  }).format(value);
};

export const sendOrderConfirmationEmail = async ({
  email,
  customerName,
  orderId,
  shippingAddress,
  shippingLabel,
  paymentLabel,
  items,
  totalPrice,
}: SendOrderConfirmationEmailData) => {
  const safeEmail = escapeHtml(email);
  const safeCustomerName = escapeHtml(customerName || "Kliencie");
  const safeOrderId = escapeHtml(orderId);
  const safeShippingAddress = escapeHtml(shippingAddress);
  const safeShippingLabel = escapeHtml(shippingLabel);
  const safePaymentLabel = escapeHtml(paymentLabel);
  const safeTotalPrice = escapeHtml(formatPrice(totalPrice));
  const itemRows = items
    .map((item) => {
      const safeName = escapeHtml(item.name);
      const safeQuantity = escapeHtml(String(item.quantity));
      const safeUnitPrice = escapeHtml(formatPrice(item.unitPrice));
      const safeLineTotal = escapeHtml(
        formatPrice(Number(item.unitPrice) * item.quantity),
      );

      return `
        <tr>
          <td style="padding:12px 0; border-bottom:1px solid #e2e8f0; color:#172033; font-size:14px;">${safeName}</td>
          <td align="center" style="padding:12px 8px; border-bottom:1px solid #e2e8f0; color:#475569; font-size:14px;">${safeQuantity}</td>
          <td align="right" style="padding:12px 8px; border-bottom:1px solid #e2e8f0; color:#475569; font-size:14px;">${safeUnitPrice}</td>
          <td align="right" style="padding:12px 0; border-bottom:1px solid #e2e8f0; color:#172033; font-size:14px; font-weight:700;">${safeLineTotal}</td>
        </tr>
      `;
    })
    .join("");
  const textItems = items
    .map(
      (item) =>
        `- ${item.name} x${item.quantity}: ${formatPrice(
          Number(item.unitPrice) * item.quantity,
        )}`,
    )
    .join("\n");

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: `Dziekujemy za zamowienie ${orderId}`,
    text: [
      `Dziekujemy za zamowienie, ${customerName || "Kliencie"}!`,
      "",
      `Numer zamowienia: ${orderId}`,
      `Dostawa: ${shippingLabel}`,
      `Platnosc: ${paymentLabel}`,
      `Adres dostawy: ${shippingAddress}`,
      "",
      "Produkty:",
      textItems,
      "",
      `Razem: ${formatPrice(totalPrice)}`,
    ].join("\n"),
    html: `
      <!doctype html>
      <html lang="pl">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Dzi&#281;kujemy za zam&#243;wienie</title>
        </head>
        <body style="margin:0; padding:0; background:#f4f7fb; font-family:Arial, Helvetica, sans-serif; color:#172033;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb; padding:32px 16px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px; overflow:hidden; border-radius:14px; background:#ffffff; box-shadow:0 16px 40px rgba(23, 32, 51, 0.08);">
                  <tr>
                    <td style="background:#0f172a; padding:28px 32px;">
                      <p style="margin:0 0 8px; color:#67e8f9; font-size:13px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;">Buyly Store</p>
                      <h1 style="margin:0; color:#ffffff; font-size:24px; line-height:1.3;">Dzi&#281;kujemy za zam&#243;wienie</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:28px 32px 8px;">
                      <p style="margin:0 0 20px; color:#475569; font-size:15px; line-height:1.6;">Cze&#347;&#263; ${safeCustomerName}, przyj&#281;li&#347;my Twoje zam&#243;wienie. Poni&#380;ej znajdziesz jego szczeg&#243;&#322;y.</p>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate; border-spacing:0 10px;">
                        <tr>
                          <td style="width:160px; padding:12px 14px; border:1px solid #e2e8f0; border-right:0; border-radius:10px 0 0 10px; background:#f8fafc; color:#64748b; font-size:13px; font-weight:700;">Numer zam&#243;wienia</td>
                          <td style="padding:12px 14px; border:1px solid #e2e8f0; border-radius:0 10px 10px 0; color:#172033; font-size:15px;">${safeOrderId}</td>
                        </tr>
                        <tr>
                          <td style="width:160px; padding:12px 14px; border:1px solid #e2e8f0; border-right:0; border-radius:10px 0 0 10px; background:#f8fafc; color:#64748b; font-size:13px; font-weight:700;">Email</td>
                          <td style="padding:12px 14px; border:1px solid #e2e8f0; border-radius:0 10px 10px 0; color:#172033; font-size:15px;"><a href="mailto:${safeEmail}" style="color:#0891b2; text-decoration:none;">${safeEmail}</a></td>
                        </tr>
                        <tr>
                          <td style="width:160px; padding:12px 14px; border:1px solid #e2e8f0; border-right:0; border-radius:10px 0 0 10px; background:#f8fafc; color:#64748b; font-size:13px; font-weight:700;">Dostawa</td>
                          <td style="padding:12px 14px; border:1px solid #e2e8f0; border-radius:0 10px 10px 0; color:#172033; font-size:15px;">${safeShippingLabel}</td>
                        </tr>
                        <tr>
                          <td style="width:160px; padding:12px 14px; border:1px solid #e2e8f0; border-right:0; border-radius:10px 0 0 10px; background:#f8fafc; color:#64748b; font-size:13px; font-weight:700;">P&#322;atno&#347;&#263;</td>
                          <td style="padding:12px 14px; border:1px solid #e2e8f0; border-radius:0 10px 10px 0; color:#172033; font-size:15px;">${safePaymentLabel}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px 32px;">
                      <h2 style="margin:0 0 12px; color:#172033; font-size:18px; line-height:1.4;">Produkty</h2>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                        <thead>
                          <tr>
                            <th align="left" style="padding:0 0 10px; color:#64748b; font-size:12px; text-transform:uppercase;">Produkt</th>
                            <th align="center" style="padding:0 8px 10px; color:#64748b; font-size:12px; text-transform:uppercase;">Ilo&#347;&#263;</th>
                            <th align="right" style="padding:0 8px 10px; color:#64748b; font-size:12px; text-transform:uppercase;">Cena</th>
                            <th align="right" style="padding:0 0 10px; color:#64748b; font-size:12px; text-transform:uppercase;">Razem</th>
                          </tr>
                        </thead>
                        <tbody>${itemRows}</tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 32px 32px;">
                      <div style="padding:18px; border:1px solid #e2e8f0; border-radius:12px; background:#f8fafc;">
                        <p style="margin:0 0 10px; color:#64748b; font-size:13px; font-weight:700;">Adres dostawy</p>
                        <p style="margin:0; color:#172033; font-size:15px; line-height:1.6; white-space:pre-wrap;">${safeShippingAddress}</p>
                        <p style="margin:18px 0 0; color:#172033; font-size:20px; font-weight:800;">Razem: ${safeTotalPrice}</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 32px; border-top:1px solid #e2e8f0; background:#f8fafc; color:#64748b; font-size:12px; line-height:1.5;">
                      To automatyczne potwierdzenie zam&#243;wienia z Buyly Store.
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

export const sendPasswordResetRequestEmail = async ({
  email,
  name,
  resetUrl,
}: {
  email: string;
  name?: string | null;
  resetUrl: string;
}) => {
  const safeEmail = escapeHtml(email);
  const safeName = escapeHtml(name || "Kliencie");
  const safeResetUrl = escapeHtml(resetUrl);

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "Reset hasla w Buyly Store",
    text: [
      `Czesc ${name || "Kliencie"},`,
      "",
      "Otrzymalismy prosbe o pomoc w odzyskaniu dostepu do Twojego konta Buyly Store.",
      "Kliknij link ponizej, aby ustawic nowe haslo. Link jest wazny przez 60 minut.",
      resetUrl,
      "",
      "Jesli to nie Ty, zignoruj ten email.",
      "",
      `Konto: ${email}`,
    ].join("\n"),
    html: `
      <!doctype html>
      <html lang="pl">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Reset has&#322;a</title>
        </head>
        <body style="margin:0; padding:0; background:#f4f7fb; font-family:Arial, Helvetica, sans-serif; color:#172033;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb; padding:32px 16px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; overflow:hidden; border-radius:14px; background:#ffffff; box-shadow:0 16px 40px rgba(23, 32, 51, 0.08);">
                  <tr>
                    <td style="background:#0f172a; padding:28px 32px;">
                      <p style="margin:0 0 8px; color:#67e8f9; font-size:13px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;">Buyly Store</p>
                      <h1 style="margin:0; color:#ffffff; font-size:24px; line-height:1.3;">Pro&#347;ba o reset has&#322;a</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:28px 32px;">
                      <p style="margin:0 0 18px; color:#172033; font-size:16px; line-height:1.6;">Cze&#347;&#263; ${safeName},</p>
                      <p style="margin:0 0 18px; color:#475569; font-size:15px; line-height:1.7;">Otrzymali&#347;my pro&#347;b&#281; o pomoc w odzyskaniu dost&#281;pu do Twojego konta Buyly Store.</p>
                      <div style="padding:18px; border:1px solid #e2e8f0; border-radius:12px; background:#f8fafc;">
                        <p style="margin:0 0 8px; color:#64748b; font-size:13px; font-weight:700;">Konto</p>
                        <p style="margin:0; color:#172033; font-size:15px;"><a href="mailto:${safeEmail}" style="color:#0891b2; text-decoration:none;">${safeEmail}</a></p>
                      </div>
                      <p style="margin:18px 0 22px; color:#475569; font-size:15px; line-height:1.7;">Kliknij przycisk poni&#380;ej, aby ustawi&#263; nowe has&#322;o. Link jest wa&#380;ny przez 60 minut.</p>
                      <a href="${safeResetUrl}" style="display:inline-block; padding:13px 18px; border-radius:10px; background:#0891b2; color:#ffffff; font-size:14px; font-weight:700; text-decoration:none;">Ustaw nowe has&#322;o</a>
                      <p style="margin:22px 0 0; color:#475569; font-size:13px; line-height:1.7;">Je&#347;li przycisk nie dzia&#322;a, skopiuj ten adres do przegl&#261;darki:<br /><a href="${safeResetUrl}" style="color:#0891b2; word-break:break-all;">${safeResetUrl}</a></p>
                      <p style="margin:18px 0 0; color:#475569; font-size:15px; line-height:1.7;">Je&#347;li to nie Ty wys&#322;a&#322;e&#347; pro&#347;b&#281;, zignoruj ten email.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 32px; border-top:1px solid #e2e8f0; background:#f8fafc; color:#64748b; font-size:12px; line-height:1.5;">
                      To automatyczna wiadomo&#347;&#263; z Buyly Store.
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

export const sendDetailsMessage = async ({
  email,
  subject,
  message,
}: {
  email: string;
  subject: string;
  message: string;
}) => {
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.CONTACT_TO_EMAIL,
    replyTo: email,
    subject: safeSubject,
    text: safeMessage,
    html: `
      <!doctype html>
      <html lang="pl">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${safeSubject}</title>
        </head>
        <body style="margin:0; padding:0; background:#f4f7fb; font-family:Arial, Helvetica, sans-serif; color:#172033;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb; padding:32px 16px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; overflow:hidden; border-radius:14px; background:#ffffff; box-shadow:0 16px 40px rgba(23, 32, 51, 0.08);">
                  <tr>
                    <td style="background:#0f172a; padding:28px 32px;">
                      <p style="margin:0 0 8px; color:#67e8f9; font-size:13px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;">Buyly Store</p>
                      <h1 style="margin:0; color:#ffffff; font-size:24px; line-height:1.3;">${safeSubject}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:28px 32px 8px;">
                      <p style="margin:0 0 20px; color:#475569; font-size:15px; line-height:1.6;">U&#380;ytkownik wys&#322;a&#322; wiadomo&#347;&#263; przez formularz kontaktowy.</p>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate; border-spacing:0 10px;">
                        <tr>
                          <td style="width:150px; padding:12px 14px; border:1px solid #e2e8f0; border-right:0; border-radius:10px 0 0 10px; background:#f8fafc; color:#64748b; font-size:13px; font-weight:700;">Email</td>
                          <td style="padding:12px 14px; border:1px solid #e2e8f0; border-radius:0 10px 10px <PASSWORD>; color:#172<PASSWORD>; font-size:15px;"><a href="mailto:${safeEmail}" style="color:#<PASSWORD>; text-decoration:none;">${safeEmail}</a></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px 32px 32px;">
                      <h2 style="margin:0 <PASSWORD>; color:#172<PASSWORD>; font-size:18px; line-height:1.4;">Tre&#347;&#263; wiadomo&#347;ci</h2>
                      <div style="padding:18px; border:1px solid #e2e8f<PASSWORD>; border-radius:12px; background:#f8fafc; color:#<PASSWORD>; font-size:15px; line-height:<PASSWORD>; white-space:pre-wrap;">${safeMessage}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:<PASSWORD> px;">
                      Odpowiedz bezpo&#347;
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
