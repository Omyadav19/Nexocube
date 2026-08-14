import io
import logging
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white, black
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import PageBreak

logger = logging.getLogger(__name__)

# Brand colors
PRIMARY_COLOR = HexColor('#65a30d')
SECONDARY_COLOR = HexColor('#4d7c0f')
ACCENT_COLOR = HexColor('#06b6d4')
DARK_COLOR = HexColor('#1e293b')
MUTED_COLOR = HexColor('#64748b')
LIGHT_BG = HexColor('#f8fafc')
BORDER_COLOR = HexColor('#e2e8f0')


def _create_styles():
    styles = getSampleStyleSheet()
    
    custom_styles = {
        'ProposalTitle': ParagraphStyle(
            'ProposalTitle',
            parent=styles['Heading1'],
            fontSize=28,
            leading=34,
            textColor=DARK_COLOR,
            fontName='Helvetica-Bold',
            spaceAfter=12,
            spaceBefore=0,
        ),
        'SubTitle': ParagraphStyle(
            'SubTitle',
            parent=styles['Normal'],
            fontSize=14,
            textColor=MUTED_COLOR,
            fontName='Helvetica',
            spaceAfter=4,
        ),
        'SectionTitle': ParagraphStyle(
            'SectionTitle',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=PRIMARY_COLOR,
            fontName='Helvetica-Bold',
            spaceBefore=16,
            spaceAfter=8,
        ),
        'SectionSubTitle': ParagraphStyle(
            'SectionSubTitle',
            parent=styles['Heading3'],
            fontSize=13,
            textColor=DARK_COLOR,
            fontName='Helvetica-Bold',
            spaceBefore=8,
            spaceAfter=4,
        ),
        'Body': ParagraphStyle(
            'Body',
            parent=styles['Normal'],
            fontSize=10,
            textColor=DARK_COLOR,
            fontName='Helvetica',
            spaceAfter=6,
            leading=16,
            alignment=TA_JUSTIFY,
        ),
        'BulletItem': ParagraphStyle(
            'BulletItem',
            parent=styles['Normal'],
            fontSize=10,
            textColor=DARK_COLOR,
            fontName='Helvetica',
            spaceAfter=4,
            leftIndent=12,
            leading=14,
        ),
        'Disclaimer': ParagraphStyle(
            'Disclaimer',
            parent=styles['Normal'],
            fontSize=9,
            textColor=MUTED_COLOR,
            fontName='Helvetica-Oblique',
            spaceAfter=6,
            alignment=TA_CENTER,
        ),
        'MetaLabel': ParagraphStyle(
            'MetaLabel',
            parent=styles['Normal'],
            fontSize=9,
            textColor=MUTED_COLOR,
            fontName='Helvetica-Bold',
            spaceAfter=2,
        ),
        'MetaValue': ParagraphStyle(
            'MetaValue',
            parent=styles['Normal'],
            fontSize=11,
            textColor=DARK_COLOR,
            fontName='Helvetica-Bold',
            spaceAfter=4,
        ),
    }
    
    return custom_styles


def generate_proposal_pdf(proposal_data: dict, lead_data: dict) -> bytes:
    """Generate a professional PDF proposal using ReportLab. Returns PDF bytes."""
    # Fix Rupee symbol (₹) rendering issue in ReportLab's standard Helvetica font
    def replace_rupee(obj):
        if isinstance(obj, str):
            return obj.replace('₹', 'INR ')
        elif isinstance(obj, list):
            return [replace_rupee(item) for item in obj]
        elif isinstance(obj, dict):
            return {k: replace_rupee(v) for k, v in obj.items()}
        return obj
        
    proposal_data = replace_rupee(proposal_data)
    lead_data = replace_rupee(lead_data)

    buffer = io.BytesIO()
    
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=20*mm,
        leftMargin=20*mm,
        topMargin=20*mm,
        bottomMargin=20*mm,
    )
    
    styles = _create_styles()
    story = []
    
    # ── HEADER SECTION ─────────────────────────────────────────────────────────
    # Logo/Brand row
    header_data = [
        [
            Paragraph('<b>Proposal<font color="#65a30d">AI</font></b>', ParagraphStyle(
                'Brand', fontSize=20, textColor=DARK_COLOR, fontName='Helvetica-Bold'
            )),
            Paragraph(f'<font color="#64748b">Generated: {datetime.now().strftime("%B %d, %Y")}</font>',
                      ParagraphStyle('Date', fontSize=10, textColor=MUTED_COLOR,
                                     fontName='Helvetica', alignment=2)),
        ]
    ]
    header_table = Table(header_data, colWidths=[90*mm, 90*mm])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 4*mm))
    story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY_COLOR, spaceBefore=4, spaceAfter=12))
    
    # Proposal Title
    title = proposal_data.get('title', f"Project Proposal for {lead_data.get('company', 'Client')}")
    story.append(Paragraph(title, styles['ProposalTitle']))
    story.append(Paragraph(f"Prepared for: <b>{lead_data.get('name', '')}</b> | {lead_data.get('company', '')}", styles['SubTitle']))
    story.append(Spacer(1, 4*mm))
    
    # Client info cards
    meta_data = [
        [
            Paragraph('CLIENT', styles['MetaLabel']),
            Paragraph('SERVICE', styles['MetaLabel']),
            Paragraph('BUDGET RANGE', styles['MetaLabel']),
            Paragraph('TIMELINE', styles['MetaLabel']),
        ],
        [
            Paragraph(lead_data.get('company', lead_data.get('name', 'N/A')), styles['MetaValue']),
            Paragraph(lead_data.get('service', 'N/A'), styles['MetaValue']),
            Paragraph(proposal_data.get('budget_range', lead_data.get('budget', 'TBD')), styles['MetaValue']),
            Paragraph(proposal_data.get('timeline', lead_data.get('timeline', 'TBD')), styles['MetaValue']),
        ],
    ]
    meta_table = Table(meta_data, colWidths=[45*mm, 45*mm, 50*mm, 40*mm])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), LIGHT_BG),
        ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 6*mm))
    
    # ── DISCLAIMER BANNER ──────────────────────────────────────────────────────
    disclaimer_data = [[
        Paragraph(
            '⚠  AI-GENERATED PRELIMINARY ESTIMATE — REQUIRES HUMAN REVIEW BEFORE COMMERCIAL USE',
            ParagraphStyle('DisclaimerBanner', fontSize=9, textColor=HexColor('#92400e'),
                           fontName='Helvetica-Bold', alignment=TA_CENTER)
        )
    ]]
    disclaimer_table = Table(disclaimer_data, colWidths=[170*mm])
    disclaimer_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), HexColor('#fef3c7')),
        ('BOX', (0, 0), (-1, -1), 1, HexColor('#f59e0b')),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ]))
    story.append(disclaimer_table)
    story.append(Spacer(1, 8*mm))
    
    # ── EXECUTIVE SUMMARY ─────────────────────────────────────────────────────
    story.append(Paragraph('Executive Summary', styles['SectionTitle']))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceAfter=6))
    summary = proposal_data.get('executive_summary', '')
    story.append(Paragraph(summary, styles['Body']))
    story.append(Spacer(1, 4*mm))
    
    # ── PROJECT SCOPE ─────────────────────────────────────────────────────────
    story.append(Paragraph('Project Scope', styles['SectionTitle']))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceAfter=6))
    scope = proposal_data.get('scope', '')
    story.append(Paragraph(scope, styles['Body']))
    story.append(Spacer(1, 4*mm))
    
    # ── FEATURES ──────────────────────────────────────────────────────────────
    features = proposal_data.get('features', [])
    if features:
        story.append(Paragraph('Key Features & Deliverables', styles['SectionTitle']))
        story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceAfter=6))
        for feature in features:
            story.append(Paragraph(f'• {feature}', styles['BulletItem']))
        story.append(Spacer(1, 4*mm))
    
    # ── USER ROLES ────────────────────────────────────────────────────────────
    user_roles = proposal_data.get('user_roles', [])
    integrations = proposal_data.get('integrations', [])
    technology = proposal_data.get('technology', [])
    
    if user_roles or integrations:
        cols_data = [[], []]
        if user_roles:
            cols_data[0].append(Paragraph('<b>User Roles</b>', ParagraphStyle(
                'ColHeader', fontSize=11, textColor=DARK_COLOR, fontName='Helvetica-Bold', spaceAfter=4
            )))
            for role in user_roles:
                cols_data[0].append(Paragraph(f'• {role}', styles['BulletItem']))
        
        if integrations:
            cols_data[1].append(Paragraph('<b>Integrations</b>', ParagraphStyle(
                'ColHeader', fontSize=11, textColor=DARK_COLOR, fontName='Helvetica-Bold', spaceAfter=4
            )))
            for intg in integrations:
                cols_data[1].append(Paragraph(f'• {intg}', styles['BulletItem']))
        
        if any(cols_data):
            story.append(Paragraph('Technical Overview', styles['SectionTitle']))
            story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceAfter=6))
            two_col = Table([[cols_data[0], cols_data[1]]], colWidths=[85*mm, 85*mm])
            two_col.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('TOPPADDING', (0, 0), (-1, -1), 0),
            ]))
            story.append(two_col)
            story.append(Spacer(1, 4*mm))
    
    # ── TECHNOLOGY STACK ──────────────────────────────────────────────────────
    if technology:
        story.append(Paragraph('Recommended Technology Stack', styles['SectionTitle']))
        story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceAfter=6))
        tech_items = [technology[i:i+3] for i in range(0, len(technology), 3)]
        for row in tech_items:
            row_data = []
            for tech in row:
                row_data.append(Paragraph(tech, ParagraphStyle(
                    'TechBadge', fontSize=10, textColor=PRIMARY_COLOR,
                    fontName='Helvetica-Bold', alignment=TA_CENTER
                )))
            while len(row_data) < 3:
                row_data.append(Paragraph('', styles['Body']))
            tech_table = Table([row_data], colWidths=[56*mm, 56*mm, 56*mm])
            tech_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), HexColor('#f7fee7')),
                ('BOX', (0, 0), (-1, -1), 1, HexColor('#d9f99d')),
                ('INNERGRID', (0, 0), (-1, -1), 0.5, HexColor('#bef264')),
                ('TOPPADDING', (0, 0), (-1, -1), 8),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ]))
            story.append(tech_table)
            story.append(Spacer(1, 2*mm))
        story.append(Spacer(1, 4*mm))
    
    # ── DEVELOPMENT PHASES ────────────────────────────────────────────────────
    phases = proposal_data.get('phases', [])
    if phases:
        story.append(Paragraph('Development Phases', styles['SectionTitle']))
        story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceAfter=6))
        
        phase_header = [
            Paragraph('<b>Phase</b>', ParagraphStyle('PH', fontSize=10, textColor=white, fontName='Helvetica-Bold')),
            Paragraph('<b>Duration</b>', ParagraphStyle('PH', fontSize=10, textColor=white, fontName='Helvetica-Bold')),
            Paragraph('<b>Deliverables</b>', ParagraphStyle('PH', fontSize=10, textColor=white, fontName='Helvetica-Bold')),
        ]
        phase_rows = [phase_header]
        
        for i, phase in enumerate(phases):
            deliverables = ', '.join(phase.get('deliverables', []))
            phase_rows.append([
                Paragraph(phase.get('phase', ''), styles['BulletItem']),
                Paragraph(phase.get('duration', ''), styles['BulletItem']),
                Paragraph(deliverables, styles['BulletItem']),
            ])
        
        phase_table = Table(phase_rows, colWidths=[70*mm, 35*mm, 65*mm])
        phase_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_COLOR),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_BG]),
            ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('LEFTPADDING', (0, 0), (-1, -1), 10),
            ('RIGHTPADDING', (0, 0), (-1, -1), 10),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        story.append(phase_table)
        story.append(Spacer(1, 6*mm))
    
    # ── TIMELINE & BUDGET ─────────────────────────────────────────────────────
    tb_section = []
    tb_section.append(Paragraph('Timeline & Investment', styles['SectionTitle']))
    tb_section.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceAfter=6))
    
    tb_data = [
        [
            Paragraph('ESTIMATED TIMELINE', ParagraphStyle('MLC', parent=styles['MetaLabel'], alignment=TA_CENTER)),
            Paragraph('BUDGET RANGE', ParagraphStyle('MLC', parent=styles['MetaLabel'], alignment=TA_CENTER)),
            Paragraph('ESTIMATED COST', ParagraphStyle('MLC', parent=styles['MetaLabel'], alignment=TA_CENTER)),
        ],
        [
            Paragraph(proposal_data.get('timeline', 'TBD'), ParagraphStyle(
                'BigNum', fontSize=13, textColor=PRIMARY_COLOR, fontName='Helvetica-Bold', alignment=TA_CENTER
            )),
            Paragraph(proposal_data.get('budget_range', 'TBD'), ParagraphStyle(
                'BigNum', fontSize=13, textColor=PRIMARY_COLOR, fontName='Helvetica-Bold', alignment=TA_CENTER
            )),
            Paragraph(proposal_data.get('estimated_cost', 'TBD'), ParagraphStyle(
                'BigNum', fontSize=13, textColor=PRIMARY_COLOR, fontName='Helvetica-Bold', alignment=TA_CENTER
            )),
        ],
    ]
    
    # 170mm total width / 3 columns = ~56.6mm per column for perfect symmetry
    tb_table = Table(tb_data, colWidths=[56.6*mm, 56.6*mm, 56.6*mm])
    tb_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), LIGHT_BG),
        ('BOX', (0, 0), (-1, -1), 2, PRIMARY_COLOR),
        ('LINEAFTER', (0, 0), (0, -1), 1, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    tb_section.append(tb_table)
    tb_section.append(Spacer(1, 4*mm))
    
    # Budget disclaimer
    tb_section.append(Paragraph(
        '* AI-generated preliminary estimate. Final pricing will be provided after discovery call and detailed requirements analysis.',
        styles['Disclaimer']
    ))
    tb_section.append(Spacer(1, 4*mm))
    
    story.append(KeepTogether(tb_section))
    
    # ── DELIVERABLES ──────────────────────────────────────────────────────────
    deliverables = proposal_data.get('deliverables', [])
    if deliverables:
        story.append(Paragraph('Project Deliverables', styles['SectionTitle']))
        story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceAfter=6))
        for d in deliverables:
            story.append(Paragraph(f'✓  {d}', styles['BulletItem']))
        story.append(Spacer(1, 4*mm))
    
    # ── NEXT STEPS ────────────────────────────────────────────────────────────
    next_steps = proposal_data.get('next_steps', [])
    if next_steps:
        story.append(Paragraph('Next Steps', styles['SectionTitle']))
        story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceAfter=6))
        for i, step in enumerate(next_steps, 1):
            story.append(Paragraph(f'{i}.  {step}', styles['BulletItem']))
        story.append(Spacer(1, 6*mm))
    
    # ── FOOTER ────────────────────────────────────────────────────────────────
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceAfter=8))
    footer_data = [[
        Paragraph('ProposalAI — AI Sales & Proposal Automation', ParagraphStyle(
            'Footer', fontSize=9, textColor=MUTED_COLOR, fontName='Helvetica'
        )),
        Paragraph(f'Confidential | {datetime.now().strftime("%B %Y")}', ParagraphStyle(
            'FooterRight', fontSize=9, textColor=MUTED_COLOR, fontName='Helvetica', alignment=2
        )),
    ]]
    footer_table = Table(footer_data, colWidths=[110*mm, 60*mm])
    footer_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(footer_table)
    
    # Build PDF
    doc.build(story)
    buffer.seek(0)
    return buffer.read()
