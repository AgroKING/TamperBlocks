const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export const api = {
    async issueCertificate(studentMetadata) {
        const res = await fetch(`${API_BASE}/issue`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentMetadata),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || 'Failed to issue certificate');
        }
        return res.json();
    },

    async verifyCertificate(targetHashHex) {
        const res = await fetch(`${API_BASE}/verify/${encodeURIComponent(targetHashHex)}`);
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || 'Verification failed');
        }
        return res.json();
    },

    async revokeCertificate(targetHashHex, reason = '') {
        const res = await fetch(`${API_BASE}/revoke/${encodeURIComponent(targetHashHex)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || 'Revocation failed');
        }
        return res.json();
    },

    async getStatus() {
        const res = await fetch(`${API_BASE}/status`);
        if (!res.ok) throw new Error('Failed to fetch system status');
        return res.json();
    },

    async getBlocks() {
        const res = await fetch(`${API_BASE}/blocks`);
        if (!res.ok) throw new Error('Failed to fetch blocks');
        return res.json();
    },

    async lookupByStudentId(studentId) {
        const res = await fetch(`${API_BASE}/lookup/${encodeURIComponent(studentId)}`);
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || 'Lookup failed');
        }
        return res.json();
    },

    async generatePdf(studentMetadata) {
        const res = await fetch(`${API_BASE}/generate-pdf`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentMetadata),
        });
        if (!res.ok) throw new Error('PDF generation failed');
        return res.json();
    },
};
