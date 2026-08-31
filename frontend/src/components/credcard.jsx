import React from 'react';

export default function CredentialCard({ data = {} }) {
    // Extract initials for the avatar fallback
    const getInitial = (name) => (name ? name.trim().charAt(0).toUpperCase() : 'S');

    return (
        <div style={cardStyles.card}>
            {/* Top Banner */}
            <div style={{...cardStyles.header, backgroundColor: data.revoked ? '#7f1d1d' : '#0f172a'}}>
                <span style={cardStyles.institution}>UNIVERSITY ACADEMIC CREDENTIAL</span>
                <span style={{...cardStyles.statusBadge, backgroundColor: data.revoked ? '#ef4444' : '#22c55e', color: data.revoked ? '#fff' : '#000'}}>
                    {data.revoked ? 'REVOKED' : 'OFFICIAL'}
                </span>
            </div>

            {/* Main Body */}
            <div style={cardStyles.body}>
                {/* Avatar Section */}
                <div style={cardStyles.avatarContainer}>
                    <div style={cardStyles.avatar}>{getInitial(data.name)}</div>
                    <span style={cardStyles.rollBadge}>{data.student_id || 'ID MISSING'}</span>
                </div>

                {/* Details Grid */}
                <div style={cardStyles.infoSection}>
                    <h3 style={cardStyles.studentName}>{data.name || 'Student Name'}</h3>

                    <div style={cardStyles.dataGrid}>
                        <div>
                            <span style={cardStyles.metaLabel}>Degree</span>
                            <p style={cardStyles.metaValue}>{data.degree || '—'}</p>
                        </div>
                        <div>
                            <span style={cardStyles.metaLabel}>Major</span>
                            <p style={cardStyles.metaValue}>{data.major || '—'}</p>
                        </div>
                        <div>
                            <span style={cardStyles.metaLabel}>GPA</span>
                            <p style={cardStyles.metaValue}>{data.gpa || '—'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Footer */}
            <div style={{...cardStyles.footer, backgroundColor: data.revoked ? '#fee2e2' : '#f1f5f9'}}>
                <span style={{color: data.revoked ? '#ef4444' : '#64748b', fontWeight: '800'}}>
                    STATUS: {data.revoked ? 'REVOKED' : 'VERIFIED'}
                </span>
                <span>ISSUED: {data.timestamp ? new Date(data.timestamp * 1000).toLocaleDateString() : new Date().toLocaleDateString()}</span>
            </div>
        </div>
    );
}

// Self-contained inline styles
const cardStyles = {
    card: {
        width: '100%',
        maxWidth: '420px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
        border: '1px solid #cbd5e1',
        overflow: 'hidden',
        fontFamily: 'Segoe UI, Roboto, sans-serif',
        boxSizing: 'border-box',
    },
    header: {
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        padding: '12px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    institution: {
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '0.8px',
    },
    statusBadge: {
        fontSize: '9px',
        backgroundColor: '#22c55e',
        color: '#000',
        padding: '2px 8px',
        borderRadius: '10px',
        fontWeight: '800',
    },
    body: {
        padding: '20px',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
    },
    avatarContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
    },
    avatar: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    rollBadge: {
        fontSize: '10px',
        fontWeight: '700',
        color: '#475569',
        backgroundColor: '#e2e8f0',
        padding: '2px 6px',
        borderRadius: '4px',
        textAlign: 'center',
    },
    infoSection: {
        flex: 1,
    },
    studentName: {
        margin: '0 0 10px 0',
        fontSize: '17px',
        color: '#0f172a',
        fontWeight: '700',
    },
    dataGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    metaLabel: {
        display: 'block',
        fontSize: '9px',
        color: '#64748b',
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    metaValue: {
        margin: 0,
        fontSize: '13px',
        color: '#1e293b',
        fontWeight: '600',
    },
    footer: {
        backgroundColor: '#f1f5f9',
        borderTop: '1px solid #e2e8f0',
        padding: '8px 18px',
        fontSize: '10px',
        color: '#64748b',
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: '600',
    },
};