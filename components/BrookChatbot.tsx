'use client';

import { useState, useEffect } from 'react';

export default function BrookChatbot() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show button after a short delay
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const openBrookChat = () => {
    // Trigger the Brook AI chat interface
    if (typeof window !== 'undefined' && (window as any).skl_chat_open) {
      (window as any).skl_chat_open();
      setIsOpen(true);
    } else {
      // Fallback - try to click the embedded chat if it exists
      const chatButton = document.querySelector('[data-chat-id="FX9IIOtCFx"]');
      if (chatButton) {
        (chatButton as HTMLElement).click();
      }
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Brook Button */}
      <button
        onClick={openBrookChat}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0077B6 0%, #023047 100%)',
          border: '3px solid white',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), 0 8px 24px rgba(0, 119, 182, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          zIndex: 9999,
          transition: 'all 0.3s ease',
          animation: 'pulse 2s infinite',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4), 0 12px 32px rgba(0, 119, 182, 0.6)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3), 0 8px 24px rgba(0, 119, 182, 0.4)';
        }}
        aria-label="Chat with Brook, your AI conservation assistant"
        title="Ask Brook about conservation!"
      >
        🐟
      </button>

      {/* Tooltip */}
      <div
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '100px',
          background: 'rgba(0, 0, 0, 0.85)',
          color: 'white',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          fontSize: '0.875rem',
          fontWeight: 600,
          zIndex: 9998,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          opacity: isOpen ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      >
        💬 Ask Brook anything about conservation!
        <div
          style={{
            position: 'absolute',
            right: '-8px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderLeft: '8px solid rgba(0, 0, 0, 0.85)',
          }}
        />
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 8px 24px rgba(0, 119, 182, 0.4);
          }
          50% {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 8px 24px rgba(0, 119, 182, 0.7), 0 0 40px rgba(0, 119, 182, 0.3);
          }
        }
      `}</style>
    </>
  );
}

