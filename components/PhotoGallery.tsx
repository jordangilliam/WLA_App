/**
 * Photo Gallery Component
 * 
 * Professional photo gallery for field documentation:
 * - Grid and masonry layouts
 * - Lightbox viewing
 * - Photo metadata (GPS, date, species)
 * - Filtering and sorting
 * - Download and share
 * - EXIF data display
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export interface Photo {
  id: string;
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  timestamp: number;
  location?: {
    lat: number;
    lon: number;
    name?: string;
  };
  tags?: string[];
  species?: string;
  waterBody?: string;
  category: 'catch' | 'habitat' | 'species' | 'landscape' | 'macro' | 'other';
  width?: number;
  height?: number;
}

interface PhotoGalleryProps {
  photos: Photo[];
  layout?: 'grid' | 'masonry';
  columns?: number;
  onPhotoClick?: (photo: Photo) => void;
  showMetadata?: boolean;
  allowDownload?: boolean;
  allowShare?: boolean;
}

/**
 * Main Photo Gallery Component
 */
export function PhotoGallery({
  photos,
  layout = 'grid',
  columns = 3,
  onPhotoClick,
  showMetadata = true,
  allowDownload = true,
  allowShare = true
}: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'category' | 'location'>('date');

  // Filter and sort photos
  const filteredPhotos = photos
    .filter(photo => filter === 'all' || photo.category === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.timestamp - a.timestamp;
        case 'category':
          return a.category.localeCompare(b.category);
        case 'location':
          return (a.waterBody || '').localeCompare(b.waterBody || '');
        default:
          return 0;
      }
    });

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    if (onPhotoClick) onPhotoClick(photo);
  };

  return (
    <div>
      {/* Gallery Controls */}
      <div style={{
        background: 'white',
        padding: '1rem',
        borderRadius: '12px',
        marginBottom: '1rem',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.85rem', 
            fontWeight: 600, 
            color: '#6B7280', 
            marginBottom: '0.25rem' 
          }}>
            Filter by Category
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '2px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}
          >
            <option value="all">All Photos ({photos.length})</option>
            <option value="catch">Catches</option>
            <option value="habitat">Habitats</option>
            <option value="species">Species</option>
            <option value="landscape">Landscapes</option>
            <option value="macro">Macro</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.85rem', 
            fontWeight: 600, 
            color: '#6B7280', 
            marginBottom: '0.25rem' 
          }}>
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '2px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}
          >
            <option value="date">Date (Newest First)</option>
            <option value="category">Category</option>
            <option value="location">Location</option>
          </select>
        </div>

        <div style={{ 
          fontSize: '0.9rem', 
          color: '#6B7280',
          padding: '0.5rem 0'
        }}>
          Showing {filteredPhotos.length} of {photos.length} photos
        </div>
      </div>

      {/* Photo Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {filteredPhotos.map(photo => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onClick={() => handlePhotoClick(photo)}
            showMetadata={showMetadata}
          />
        ))}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <PhotoLightbox
          photo={selectedPhoto}
          photos={filteredPhotos}
          onClose={() => setSelectedPhoto(null)}
          onNavigate={(direction) => {
            const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
            const newIndex = direction === 'next' 
              ? (currentIndex + 1) % filteredPhotos.length
              : (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
            setSelectedPhoto(filteredPhotos[newIndex]);
          }}
          allowDownload={allowDownload}
          allowShare={allowShare}
        />
      )}
    </div>
  );
}

/**
 * Individual Photo Card
 */
function PhotoCard({ 
  photo, 
  onClick,
  showMetadata 
}: { 
  photo: Photo; 
  onClick: () => void;
  showMetadata: boolean;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        aspectRatio: '1',
        background: '#F3F4F6',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
    >
      {/* Photo */}
      <div style={{
        width: '100%',
        height: '100%',
        backgroundImage: `url(${photo.thumbnail || photo.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} />

      {/* Category Badge */}
      <div style={{
        position: 'absolute',
        top: '0.75rem',
        right: '0.75rem',
        padding: '0.25rem 0.75rem',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        color: 'white',
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'capitalize'
      }}>
        {photo.category}
      </div>

      {/* Metadata Overlay */}
      {showMetadata && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1rem',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
          color: 'white'
        }}>
          {photo.title && (
            <div style={{ 
              fontWeight: 700, 
              fontSize: '0.9rem', 
              marginBottom: '0.25rem' 
            }}>
              {photo.title}
            </div>
          )}
          {photo.waterBody && (
            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
              📍 {photo.waterBody}
            </div>
          )}
          <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '0.25rem' }}>
            {new Date(photo.timestamp).toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Photo Lightbox / Viewer
 */
function PhotoLightbox({
  photo,
  photos,
  onClose,
  onNavigate,
  allowDownload,
  allowShare
}: {
  photo: Photo;
  photos: Photo[];
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  allowDownload: boolean;
  allowShare: boolean;
}) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onClose, onNavigate]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `${photo.title || 'photo'}_${photo.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: photo.title || 'WLA Photo',
          text: photo.description || 'Check out this photo from WLA',
          url: photo.url
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: Copy link
      navigator.clipboard.writeText(photo.url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.95)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
          border: 'none',
          color: 'white',
          fontSize: '1.5rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        ✕
      </button>

      {/* Navigation Buttons */}
      {photos.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('prev');
            }}
            style={{
              position: 'absolute',
              left: '1rem',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ←
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('next');
            }}
            style={{
              position: 'absolute',
              right: '1rem',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            →
          </button>
        </>
      )}

      {/* Main Image */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '90%',
          maxHeight: '80%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <img
          src={photo.url}
          alt={photo.title || 'Photo'}
          style={{
            maxWidth: '100%',
            maxHeight: '70vh',
            objectFit: 'contain',
            borderRadius: '12px'
          }}
        />

        {/* Photo Info */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(16px)',
          padding: '1.5rem',
          borderRadius: '12px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              {photo.title && (
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {photo.title}
                </h3>
              )}
              {photo.description && (
                <p style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: '0.75rem' }}>
                  {photo.description}
                </p>
              )}
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem', opacity: 0.9 }}>
                <div>📅 {new Date(photo.timestamp).toLocaleDateString()}</div>
                {photo.waterBody && <div>📍 {photo.waterBody}</div>}
                {photo.species && <div>🐟 {photo.species}</div>}
                {photo.tags && photo.tags.length > 0 && (
                  <div>🏷️ {photo.tags.join(', ')}</div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {allowDownload && (
                <button
                  onClick={handleDownload}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  ⬇️ Download
                </button>
              )}
              {allowShare && (
                <button
                  onClick={handleShare}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  📤 Share
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Masonry Layout (Pinterest-style)
 */
export function MasonryGallery({ photos }: { photos: Photo[] }) {
  return (
    <div style={{
      columnCount: 3,
      columnGap: '1rem',
      '@media (max-width: 768px)': {
        columnCount: 2
      },
      '@media (max-width: 480px)': {
        columnCount: 1
      }
    }}>
      {photos.map(photo => (
        <div
          key={photo.id}
          style={{
            breakInside: 'avoid',
            marginBottom: '1rem'
          }}
        >
          <PhotoCard photo={photo} onClick={() => {}} showMetadata={true} />
        </div>
      ))}
    </div>
  );
}

export default PhotoGallery;

