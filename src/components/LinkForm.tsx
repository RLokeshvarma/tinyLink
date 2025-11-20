'use client';

import { useState } from 'react';
import { isValidUrl, isValidCode } from '../lib/validation';

interface LinkFormProps {
  onSuccess: () => void;
}

export default function LinkForm({ onSuccess }: LinkFormProps) {
  const [targetUrl, setTargetUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [codeError, setCodeError] = useState('');

  const validateUrl = (url: string) => {
    if (url && !isValidUrl(url)) {
      setUrlError('Please enter a valid URL (must start with http:// or https://)');
      return false;
    }
    setUrlError('');
    return true;
  };

  const validateCustomCode = (code: string) => {
    if (code && !isValidCode(code)) {
      setCodeError('Code must be 6-8 alphanumeric characters');
      return false;
    }
    setCodeError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!targetUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(targetUrl) || !validateCustomCode(customCode)) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_url: targetUrl,
          custom_code: customCode || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create link');
        return;
      }

      setSuccess(true);
      setTargetUrl('');
      setCustomCode('');
      setTimeout(() => setSuccess(false), 3000);
      onSuccess();
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Create Short Link</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="targetUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Target URL *
          </label>
          <input
            type="text"
            id="targetUrl"
            value={targetUrl}
            onChange={(e) => {
              setTargetUrl(e.target.value);
              validateUrl(e.target.value);
            }}
            onBlur={() => validateUrl(targetUrl)}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          {urlError && (
            <p className="text-red-600 text-sm mt-1">{urlError}</p>
          )}
        </div>

        <div>
          <label htmlFor="customCode" className="block text-sm font-medium text-gray-700 mb-1">
            Custom Code (optional)
          </label>
          <input
            type="text"
            id="customCode"
            value={customCode}
            onChange={(e) => {
              setCustomCode(e.target.value);
              validateCustomCode(e.target.value);
            }}
            onBlur={() => validateCustomCode(customCode)}
            placeholder="mycode"
            maxLength={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            6-8 alphanumeric characters (leave empty for auto-generated)
          </p>
          {codeError && (
            <p className="text-red-600 text-sm mt-1">{codeError}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            Link created successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !!urlError || !!codeError}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Creating...' : 'Create Short Link'}
        </button>
      </form>
    </div>
  );
}