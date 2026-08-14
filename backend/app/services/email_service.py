import smtplib
import logging
import asyncio
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from app.config import settings

logger = logging.getLogger(__name__)


def _send_email_sync(to_email: str, subject: str, html_content: str, pdf_bytes: bytes = None, pdf_filename: str = None) -> dict:
    if not settings.SMTP_EMAIL or not settings.SMTP_PASSWORD:
        logger.error("SMTP credentials are not configured.")
        return {"success": False, "error": "SMTP credentials not configured."}

    msg = MIMEMultipart()
    msg['From'] = f"ProposalAI <{settings.SMTP_EMAIL}>"
    msg['To'] = to_email
    msg['Subject'] = subject

    msg.attach(MIMEText(html_content, 'html'))

    if pdf_bytes and pdf_filename:
        attachment = MIMEApplication(pdf_bytes, _subtype="pdf")
        attachment.add_header('Content-Disposition', 'attachment', filename=pdf_filename)
        msg.attach(attachment)

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(settings.SMTP_EMAIL, settings.SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        logger.info(f"Email sent successfully to {to_email} via SMTP")
        return {"success": True, "message": "Email sent successfully"}
    except Exception as e:
        logger.error(f"Failed to send email via SMTP: {e}")
        return {"success": False, "error": str(e), "message": "Failed to send email via SMTP"}


async def send_proposal_email(
    to_email: str,
    to_name: str,
    company: str,
    proposal_title: str,
    pdf_bytes: bytes = None,
    proposal_summary: str = "",
) -> dict:
    """Send proposal email via Gmail SMTP."""
    
    html_body = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; background: #f8fafc; }}
    .container {{ max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }}
    .header {{ background: linear-gradient(135deg, #65a30d 0%, #4d7c0f 100%); padding: 40px 40px 32px; }}
    .header h1 {{ color: white; margin: 0; font-size: 28px; font-weight: 700; }}
    .header p {{ color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px; }}
    .body {{ padding: 40px; }}
    .greeting {{ font-size: 16px; color: #1e293b; margin-bottom: 20px; }}
    .proposal-card {{ background: #f7fee7; border: 1px solid #d9f99d; border-radius: 8px; padding: 20px; margin: 24px 0; }}
    .proposal-card h3 {{ color: #65a30d; margin: 0 0 8px; font-size: 18px; }}
    .proposal-card p {{ color: #64748b; margin: 0; font-size: 14px; line-height: 1.6; }}
    .disclaimer {{ background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 12px 16px; margin: 24px 0; font-size: 12px; color: #92400e; }}
    .footer {{ padding: 24px 40px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; }}
    .footer p {{ color: #94a3b8; font-size: 12px; margin: 0; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ProposalAI</h1>
      <p>AI Sales & Proposal Automation</p>
    </div>
    <div class="body">
      <p class="greeting">Dear {to_name},</p>
      <p style="color: #475569; line-height: 1.7;">
        Thank you for your interest in our services. We have reviewed your project requirements 
        and are excited to present our tailored proposal for <strong>{company}</strong>.
      </p>
      
      <div class="proposal-card">
        <h3>📋 {proposal_title}</h3>
        <p>{proposal_summary[:300] if proposal_summary else "Please find your detailed project proposal attached to this email."}</p>
      </div>
      
      <p style="color: #475569; line-height: 1.7;">
        Our team has analyzed your requirements and prepared a comprehensive proposal covering:
      </p>
      <ul style="color: #475569; line-height: 2;">
        <li>Project scope and deliverables</li>
        <li>Technical architecture and stack</li>
        <li>Development timeline and phases</li>
        <li>Preliminary budget estimate</li>
        <li>Recommended next steps</li>
      </ul>
      
      <div class="disclaimer">
        ⚠️ <strong>Please note:</strong> The budget estimate in this proposal is AI-generated and serves as a preliminary 
        indicator only. Final pricing will be confirmed after a discovery call and detailed requirements review.
      </div>
      
      <p style="color: #475569; line-height: 1.7;">
        We would love to schedule a <strong>30-minute discovery call</strong> to discuss your project in detail. 
        Please feel free to reply to this email to arrange a convenient time.
      </p>
      
      <p style="color: #475569;">
        Looking forward to the opportunity to work with you!
      </p>
      
      <p style="color: #475569;">
        Best regards,<br>
        <strong>The ProposalAI Team</strong>
      </p>
    </div>
    <div class="footer">
      <p>ProposalAI — Automating Your Sales Process with AI</p>
      <p style="margin-top: 4px;">This is an automated email. Please reply to connect with our team.</p>
    </div>
  </div>
</body>
</html>
"""
    
    subject = f"Your Project Proposal: {proposal_title}"
    pdf_filename = f"proposal_{company.replace(' ', '_').lower()}.pdf" if pdf_bytes else None
    
    # Run SMTP in a thread so it doesn't block FastAPI's async event loop
    return await asyncio.to_thread(_send_email_sync, to_email, subject, html_body, pdf_bytes, pdf_filename)


async def send_lead_notification_email(lead_data: dict) -> dict:
    """Send internal notification when new lead arrives."""
    
    # Send internal notification to the admin email
    admin_email = settings.ADMIN_EMAIL
    
    html_body = f"""
<!DOCTYPE html>
<html>
<head><style>
  body {{ font-family: Arial, sans-serif; background: #f8fafc; padding: 20px; }}
  .card {{ background: white; border-radius: 8px; padding: 24px; max-width: 500px; margin: 0 auto; }}
  .badge {{ display: inline-block; background: #65a30d; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }}
  table {{ width: 100%; border-collapse: collapse; margin-top: 16px; }}
  td {{ padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #475569; }}
  td:first-child {{ font-weight: 600; color: #1e293b; width: 140px; }}
</style></head>
<body>
  <div class="card">
    <h2 style="color: #65a30d; margin: 0 0 8px;">🚀 New Lead Received</h2>
    <span class="badge">Action Required</span>
    <table>
      <tr><td>Name</td><td>{lead_data.get('name', '')}</td></tr>
      <tr><td>Email</td><td>{lead_data.get('email', '')}</td></tr>
      <tr><td>Company</td><td>{lead_data.get('company', 'N/A')}</td></tr>
      <tr><td>Service</td><td>{lead_data.get('service', '')}</td></tr>
      <tr><td>Budget</td><td>{lead_data.get('budget', 'Not specified')}</td></tr>
      <tr><td>Timeline</td><td>{lead_data.get('timeline', 'Not specified')}</td></tr>
    </table>
    <p style="color: #64748b; font-size: 13px; margin-top: 16px;">
      <strong>Description:</strong><br>
      {lead_data.get('description', '')[:300]}
    </p>
  </div>
</body>
</html>
"""
    
    subject = f"New Lead: {lead_data.get('name')} - {lead_data.get('service')}"
    return await asyncio.to_thread(_send_email_sync, admin_email, subject, html_body)
