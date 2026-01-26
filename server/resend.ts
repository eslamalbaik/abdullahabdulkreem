import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return { apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email };
}

export async function getUncachableResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail
  };
}

export async function sendQuestionnaireNotification(data: {
  name: string;
  serviceType: string;
  role: string;
  projectInfo: string;
  socialMedia: string;
  companySize: string;
  budget: string;
  contactMethod: string;
  email?: string;
  whatsapp?: string;
  instagram?: string;
}) {
  const { client, fromEmail } = await getUncachableResendClient();
  
  const contactInfo = data.contactMethod === 'email' 
    ? data.email 
    : data.contactMethod === 'whatsapp' 
    ? data.whatsapp 
    : data.instagram;

  await client.emails.send({
    from: fromEmail,
    to: 'abdullah.slwmhgd@gmail.com',
    subject: `طلب جديد من ${data.name} - استبيان التواصل`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #0020a5;">طلب جديد من الاستبيان</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>الاسم:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.name}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>نوع الخدمة:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.serviceType}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>الدور:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.role}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>معلومات المشروع:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.projectInfo}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>حساب السوشيال ميديا:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.socialMedia || 'غير محدد'}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>حجم الشركة:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.companySize}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>الميزانية:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.budget}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>طريقة التواصل:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.contactMethod}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>معلومات التواصل:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${contactInfo}</td></tr>
        </table>
      </div>
    `
  });
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  projectType: string;
  message: string;
}) {
  const { client, fromEmail } = await getUncachableResendClient();

  await client.emails.send({
    from: fromEmail,
    to: 'abdullah.slwmhgd@gmail.com',
    subject: `رسالة جديدة من ${data.name} - نموذج التواصل`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #0020a5;">رسالة جديدة من نموذج التواصل</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>الاسم:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.name}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>البريد الإلكتروني:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.email}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>نوع المشروع:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.projectType}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>الرسالة:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.message}</td></tr>
        </table>
      </div>
    `
  });
}

export async function sendNewsletterNotification(email: string) {
  const { client, fromEmail } = await getUncachableResendClient();

  await client.emails.send({
    from: fromEmail,
    to: 'abdullah.slwmhgd@gmail.com',
    subject: `اشتراك جديد في النشرة البريدية`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #0020a5;">اشتراك جديد في النشرة البريدية</h2>
        <p><strong>البريد الإلكتروني:</strong> ${email}</p>
      </div>
    `
  });
}
