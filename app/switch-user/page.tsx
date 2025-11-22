'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { soundManager, haptics } from '@/lib/audio/soundManager';

interface SavedUser {
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  lastUsed: string;
  avatar?: string;
}

export default function SwitchUserPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [savedUsers, setSavedUsers] = useState<SavedUser[]>([]);
  const [pin, setPin] = useState('');
  const [selectedUser, setSelectedUser] = useState<SavedUser | null>(null);
  const [showPinInput, setShowPinInput] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load saved users from localStorage
    const saved = localStorage.getItem('wildpraxis_saved_users');
    if (saved) {
      try {
        const users = JSON.parse(saved);
        // Sort by last used
        users.sort((a: SavedUser, b: SavedUser) => 
          new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime()
        );
        setSavedUsers(users);
      } catch (e) {
        console.error('Error loading saved users:', e);
      }
    }
  }, []);

  const handleSelectUser = (user: SavedUser) => {
    soundManager.play('button-click');
    haptics.light();
    setSelectedUser(user);
    setShowPinInput(true);
    setError('');
  };

  const handlePinInput = (digit: string) => {
    soundManager.play('button-click');
    haptics.light();
    
    const newPin = pin + digit;
    setPin(newPin);

    // Auto-submit after 4 digits
    if (newPin.length === 4) {
      setTimeout(() => handlePinSubmit(newPin), 100);
    }
  };

  const handlePinSubmit = async (pinToSubmit: string = pin) => {
    try {
      // In production, validate PIN against server
      // For now, accept any 4-digit PIN
      if (pinToSubmit.length === 4 && selectedUser) {
        soundManager.play('success');
        haptics.success();

        // Update last used timestamp
        const updatedUsers = savedUsers.map(u =>
          u.email === selectedUser.email ? { ...u, lastUsed: new Date().toISOString() } : u
        );
        localStorage.setItem('wildpraxis_saved_users', JSON.stringify(updatedUsers));

        // Sign in
        const result = await signIn('credentials', {
          email: selectedUser.email,
          password: pinToSubmit, // PIN as password for quick login
          redirect: false,
        });

        if (result?.ok) {
          router.push('/');
        } else {
          setError('Invalid PIN. Please try again.');
          setPin('');
          soundManager.play('error');
          haptics.error();
        }
      }
    } catch (e) {
      setError('Login failed. Please try again.');
      setPin('');
      soundManager.play('error');
      haptics.error();
    }
  };

  const handleClearPin = () => {
    soundManager.play('button-click');
    haptics.light();
    setPin('');
    setError('');
  };

  const handleBack = () => {
    soundManager.play('button-click');
    haptics.light();
    setShowPinInput(false);
    setSelectedUser(null);
    setPin('');
    setError('');
  };

  const handleAddNewUser = () => {
    soundManager.play('button-click');
    haptics.medium();
    router.push('/login');
  };

  const getInitials = (user: SavedUser) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user.email[0].toUpperCase();
  };

  const getDisplayName = (user: SavedUser) => {
    if (user.firstName) {
      return user.firstName;
    }
    return user.email.split('@')[0];
  };

  if (showPinInput && selectedUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mb-6 text-purple-600 font-medium flex items-center gap-2"
          >
            ← Back
          </button>

          {/* User Avatar */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {getInitials(selectedUser)}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome back, {getDisplayName(selectedUser)}!</h2>
            <p className="text-gray-600 mt-1">Enter your 4-digit PIN</p>
          </div>

          {/* PIN Display */}
          <div className="flex justify-center gap-4 mb-6">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center text-2xl font-bold ${
                  pin.length > i
                    ? 'border-purple-600 bg-purple-100 text-purple-600'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}
              >
                {pin.length > i ? '●' : ''}
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 text-center">
              {error}
            </div>
          )}

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <button
                key={digit}
                onClick={() => handlePinInput(digit.toString())}
                className="h-16 bg-white border-2 border-gray-300 rounded-lg text-2xl font-bold text-gray-900 hover:bg-purple-50 hover:border-purple-300 active:bg-purple-100 transition-colors"
              >
                {digit}
              </button>
            ))}
            <button
              onClick={handleClearPin}
              className="h-16 bg-white border-2 border-gray-300 rounded-lg text-lg font-bold text-red-600 hover:bg-red-50 hover:border-red-300 active:bg-red-100 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => handlePinInput('0')}
              className="h-16 bg-white border-2 border-gray-300 rounded-lg text-2xl font-bold text-gray-900 hover:bg-purple-50 hover:border-purple-300 active:bg-purple-100 transition-colors"
            >
              0
            </button>
            <div></div> {/* Empty cell */}
          </div>

          {/* Forgot PIN */}
          <button
            onClick={() => router.push('/login')}
            className="w-full text-center text-purple-600 hover:text-purple-700 font-medium"
          >
            Forgot PIN? Sign in with email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">👥 Switch User</h1>
          <p className="text-purple-100">
            Select your account to continue
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Saved Users */}
        {savedUsers.length > 0 ? (
          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Users</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {savedUsers.map((user) => (
                <button
                  key={user.email}
                  onClick={() => handleSelectUser(user)}
                  className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:border-purple-500 hover:shadow-lg transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xl font-bold">
                      {getInitials(user)}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-lg">
                        {getDisplayName(user)}
                      </div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      {user.role && (
                        <div className="text-xs text-purple-600 capitalize mt-1">
                          {user.role}
                        </div>
                      )}
                    </div>
                    <div className="text-purple-600 text-2xl">→</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center mb-6">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Saved Users</h3>
            <p className="text-gray-600 mb-4">
              Add your first account to get started
            </p>
          </div>
        )}

        {/* Add New User */}
        <button
          onClick={handleAddNewUser}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-6 font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center justify-center gap-3 shadow-lg"
        >
          <span className="text-2xl">➕</span>
          <span>Add New User</span>
        </button>

        {/* Current Session Info */}
        {session && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">Currently signed in as:</div>
                <div className="text-sm text-gray-600">{session.user?.email}</div>
              </div>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-3">💡 Multi-User Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-0.5">•</span>
              <span>Perfect for shared iPads in libraries and classrooms</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-0.5">•</span>
              <span>Each user&rsquo;s progress is saved separately</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-0.5">•</span>
              <span>Quick PIN login for fast switching</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-0.5">•</span>
              <span>Sessions automatically expire after 30 minutes of inactivity</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

