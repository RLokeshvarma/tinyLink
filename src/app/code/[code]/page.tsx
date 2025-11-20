'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorMessage from '../../../components/ErrorMessage';
import { Link as LinkType } from '../../../types';
import { formatDate } from '../../../lib/utils';

export default function StatsPage() {
  const params = useParams();
  const code = params.code as string;
  const [link, setLink] = useState<LinkType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchLink = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/links/${code}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Link not found');
          } else {
            setError('Failed to load link details');
          }
          return;
        }
        const data = await response.json();
        setLink(data);
      } catch (err) {
        setError('Failed to load link details');
      } finally {
        setLoading(false);
      }
    };

    fetchLink();
  }, [code]);

  const handleCopy = async () => {
    const shortUrl = `${window.location.origin}/${code}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Failed to copy');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <ErrorMessage message={error} />
        <div className="mt-4">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!link) {
    return null;
  }

  const shortUrl = `${window.location.origin}/${link.code}`;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Link Statistics</h1>

        <div className="space-y-4">
          <div className="border-b pb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Short URL
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-grow bg-gray-50 px-3 py-2 rounded border text-blue-600">
                {shortUrl}
              </code>
              <button
                onClick={handleCopy}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="border-b pb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Target URL
            </label>
            <a
              href={link.target_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {link.target_url}
            </a>
          </div>

          <div className="border-b pb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Short Code
            </label>
            <code className="bg-gray-50 px-3 py-2 rounded border inline-block">
              {link.code}
            </code>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Total Clicks
              </label>
              <p className="text-2xl font-bold text-gray-800">{link.total_clicks}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Last Clicked
              </label>
              <p className="text-gray-800">{formatDate(link.last_clicked)}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Created At
            </label>
            <p className="text-gray-800">{formatDate(link.created_at)}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <a
            href={`/${link.code}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Test Redirect →
          </a>
        </div>
      </div>
    </div>
  );
}