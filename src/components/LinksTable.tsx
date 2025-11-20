'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Link as LinkType } from '../types';
import { formatDate, truncateUrl } from '../lib/utils';

interface LinksTableProps {
  links: LinkType[];
  onDelete: () => void;
}

export default function LinksTable({ links, onDelete }: LinksTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof LinkType>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deletingCode, setDeletingCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleSort = (field: keyof LinkType) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleDelete = async (code: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    setDeletingCode(code);
    try {
      const response = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete();
      } else {
        alert('Failed to delete link');
      }
    } catch (err) {
      alert('Error deleting link');
    } finally {
      setDeletingCode(null);
    }
  };

  const handleCopy = async (code: string) => {
    const shortUrl = `${window.location.origin}/${code}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      alert('Failed to copy');
    }
  };

  const filteredLinks = links.filter(
    (link) =>
      link.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.target_url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedLinks = [...filteredLinks].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (aVal === null) return 1;
    if (bVal === null) return -1;

    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  if (links.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
        No links yet. Create your first short link above!
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by code or URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th
                onClick={() => handleSort('code')}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
              >
                Short Code {sortField === 'code' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('target_url')}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
              >
                Target URL {sortField === 'target_url' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('total_clicks')}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
              >
                Clicks {sortField === 'total_clicks' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('last_clicked')}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
              >
                Last Clicked {sortField === 'last_clicked' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedLinks.map((link) => (
              <tr key={link.code} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/code/${link.code}`}
                    className="text-blue-600 hover:underline font-mono"
                  >
                    {link.code}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={link.target_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-blue-600"
                    title={link.target_url}
                  >
                    {truncateUrl(link.target_url)}
                  </a>
                </td>
                <td className="px-4 py-3 text-gray-700">{link.total_clicks}</td>
                <td className="px-4 py-3 text-gray-700 text-sm">
                  {formatDate(link.last_clicked)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(link.code)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {copiedCode === link.code ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={() => handleDelete(link.code)}
                      disabled={deletingCode === link.code}
                      className="text-red-600 hover:text-red-800 text-sm disabled:text-gray-400"
                    >
                      {deletingCode === link.code ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredLinks.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No links match your search.
        </div>
      )}
    </div>
  );
}