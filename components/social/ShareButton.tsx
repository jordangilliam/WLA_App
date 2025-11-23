'use client';

import { useState } from 'react';

interface ShareButtonProps {
  title: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  type: 'observation' | 'achievement' | 'discovery' | 'progress';
  itemId: string;
  onShare?: () => void;
}

export default function ShareButton({
  title,
  description,
  url,
  imageUrl,
  type,
  itemId,
  onShare,
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || `${window.location.origin}/share/${type}/${itemId}`;
  const shareText = `${title}${description ? ` - ${description}` : ''}`;

  const handleShare = async (platform: 'class' | 'copy' | 'native') => {
    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
        if (onShare) onShare();
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        if (onShare) onShare();
      } catch (error) {
        console.error('Copy failed:', error);
      }
    } else if (platform === 'class') {
      // Share to class feed
      try {
        const response = await fetch('/api/social/share', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type,
            itemId,
            title,
            description,
            imageUrl,
          }),
        });
        if (response.ok) {
          if (onShare) onShare();
          setIsOpen(false);
        }
      } catch (error) {
        console.error('Class share failed:', error);
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <span>🔗</span>
        Share
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Share {title}</h3>
            </div>
            <div className="p-2">
              <button
                onClick={() => handleShare('class')}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
              >
                <span className="text-2xl">👥</span>
                <div>
                  <div className="font-semibold text-gray-900">Share to Class</div>
                  <div className="text-xs text-gray-600">Post to class feed</div>
                </div>
              </button>

              {navigator.share && (
                <button
                  onClick={() => handleShare('native')}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                >
                  <span className="text-2xl">📱</span>
                  <div>
                    <div className="font-semibold text-gray-900">Share via...</div>
                    <div className="text-xs text-gray-600">Use device share</div>
                  </div>
                </button>
              )}

              <button
                onClick={() => handleShare('copy')}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
              >
                <span className="text-2xl">{copied ? '✓' : '📋'}</span>
                <div>
                  <div className="font-semibold text-gray-900">
                    {copied ? 'Copied!' : 'Copy Link'}
                  </div>
                  <div className="text-xs text-gray-600">Copy to clipboard</div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

