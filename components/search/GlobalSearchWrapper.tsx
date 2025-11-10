'use client';

import { useNavigation } from '@/lib/contexts/NavigationContext';
import GlobalSearchModal from './GlobalSearchModal';

export default function GlobalSearchWrapper() {
  const { showSearch, setShowSearch } = useNavigation();

  return (
    <GlobalSearchModal
      isOpen={showSearch}
      onClose={() => setShowSearch(false)}
    />
  );
}

