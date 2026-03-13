'use client';

import { useState } from 'react';
import type { QRContent, QRContentMode, VCardData } from '@/types';

interface Props {
  content: QRContent;
  onChange: (content: QRContent) => void;
}

const TABS: { id: QRContentMode; label: string }[] = [
  { id: 'url', label: 'URL' },
  { id: 'text', label: 'Text' },
  { id: 'vcard', label: 'vCard' },
];

const EMPTY_VCARD: VCardData = {
  firstName: '', lastName: '', phone: '', email: '',
  company: '', title: '', website: '',
};

export function QRContentForm({ content, onChange }: Props) {
  const mode = content.mode;

  function setMode(m: QRContentMode) {
    if (m === 'url') onChange({ mode: 'url', value: '' });
    else if (m === 'text') onChange({ mode: 'text', value: '' });
    else onChange({ mode: 'vcard', data: EMPTY_VCARD });
  }

  function setSimpleValue(value: string) {
    if (content.mode === 'url') onChange({ mode: 'url', value });
    else if (content.mode === 'text') onChange({ mode: 'text', value });
  }

  function setVCardField(field: keyof VCardData, value: string) {
    if (content.mode !== 'vcard') return;
    onChange({ mode: 'vcard', data: { ...content.data, [field]: value } });
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">QR Content</label>
      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMode(tab.id)}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
              mode === tab.id
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {(mode === 'url' || mode === 'text') && (
        mode === 'url' ? (
          <input
            type="url"
            value={(content as { mode: 'url'; value: string }).value}
            onChange={(e) => setSimpleValue(e.target.value)}
            placeholder="https://example.com"
            className="input"
          />
        ) : (
          <textarea
            value={(content as { mode: 'text'; value: string }).value}
            onChange={(e) => setSimpleValue(e.target.value)}
            placeholder="Enter any text..."
            rows={3}
            className="input resize-none"
          />
        )
      )}

      {mode === 'vcard' && content.mode === 'vcard' && (
        <div className="grid grid-cols-2 gap-2">
          <input className="input" placeholder="First name" value={content.data.firstName} onChange={(e) => setVCardField('firstName', e.target.value)} />
          <input className="input" placeholder="Last name" value={content.data.lastName} onChange={(e) => setVCardField('lastName', e.target.value)} />
          <input className="input" placeholder="Phone" value={content.data.phone} onChange={(e) => setVCardField('phone', e.target.value)} />
          <input className="input" placeholder="Email" value={content.data.email} onChange={(e) => setVCardField('email', e.target.value)} />
          <input className="input" placeholder="Company" value={content.data.company} onChange={(e) => setVCardField('company', e.target.value)} />
          <input className="input" placeholder="Title" value={content.data.title} onChange={(e) => setVCardField('title', e.target.value)} />
          <input className="input col-span-2" placeholder="Website" value={content.data.website} onChange={(e) => setVCardField('website', e.target.value)} />
        </div>
      )}
    </div>
  );
}
