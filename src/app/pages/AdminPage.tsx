import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, UserX, RefreshCw, LogOut } from 'lucide-react';
import {
  getConfirmations,
  getCancellations,
  deleteAllConfirmations,
  deleteAllCancellations,
  Confirmation,
  Cancellation,
} from '../services/api';

const ADMIN_PASSWORD = 'Ttena';

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [confirmations, setConfirmations] = useState<Confirmation[]>([]);
  const [cancellations, setCancellations] = useState<Cancellation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Prüfe ob bereits eingeloggt
    const auth = sessionStorage.getItem('admin-auth');
    if (auth === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin-auth', password);
      setIsAuthenticated(true);
      setError('');
      loadData();
    } else {
      setError('Falsches Passwort');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin-auth');
    setIsAuthenticated(false);
    setPassword('');
  };

  const loadData = async () => {
    setLoading(true);
    setError('');

    const confirmsResponse = await getConfirmations();
    if (confirmsResponse.success && confirmsResponse.data) {
      setConfirmations(confirmsResponse.data);
    } else {
      console.error('Failed to load confirmations:', confirmsResponse.error);
      setError(confirmsResponse.error || 'Fehler beim Laden der Zusagen');
    }

    const cancelsResponse = await getCancellations();
    if (cancelsResponse.success && cancelsResponse.data) {
      setCancellations(cancelsResponse.data);
    } else {
      console.error('Failed to load cancellations:', cancelsResponse.error);
    }

    setLoading(false);
  };

  const clearAll = async () => {
    if (confirm('Möchtest du wirklich alle Anmeldungen löschen?')) {
      setLoading(true);
      await deleteAllConfirmations();
      await deleteAllCancellations();
      setConfirmations([]);
      setCancellations([]);
      setLoading(false);
    }
  };

  const totalGuests = confirmations.reduce((sum, conf) => sum + conf.names.length, 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20"
        >
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Admin Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-white mb-2">
                Passwort
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Passwort eingeben"
                autoFocus
              />
              {error && (
                <p className="text-red-400 text-sm mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-xl text-white font-semibold hover:shadow-xl hover:shadow-purple-500/50 transition-all"
            >
              Einloggen
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-white/70 hover:text-white transition-colors"
            >
              ← Zurück zur Startseite
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-6 border border-green-500/30">
            <div className="text-center">
              <div className="text-5xl font-bold text-green-400 mb-2">
                {confirmations.length}
              </div>
              <div className="text-white/70">Zusagen</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-6 border border-purple-500/30">
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-400 mb-2">
                {totalGuests}
              </div>
              <div className="text-white/70">Gäste insgesamt</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl p-6 border border-red-500/30">
            <div className="text-center">
              <div className="text-5xl font-bold text-red-400 mb-2">
                {cancellations.length}
              </div>
              <div className="text-white/70">Absagen</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Zusagen */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
              <Users size={24} />
              Zusagen ({confirmations.length})
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {confirmations.length === 0 ? (
                <p className="text-white/50">Noch keine Zusagen</p>
              ) : (
                confirmations.map((conf, index) => (
                  <div
                    key={conf._id}
                    className="bg-white/5 p-4 rounded-lg border border-white/10"
                  >
                    <div className="font-semibold text-white text-lg">
                      {conf.names.join(', ')}
                    </div>
                    <div className="text-sm text-white/70 mt-1">
                      {conf.email}
                    </div>
                    <div className="text-sm text-white/60 mt-1">
                      {conf.names.length} {conf.names.length === 1 ? 'Person' : 'Personen'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Absagen */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-red-400 mb-4 flex items-center gap-2">
              <UserX size={24} />
              Absagen ({cancellations.length})
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {cancellations.length === 0 ? (
                <p className="text-white/50">Noch keine Absagen</p>
              ) : (
                cancellations.map((cancel) => (
                  <div
                    key={cancel._id}
                    className="bg-white/5 p-4 rounded-lg border border-white/10"
                  >
                    <div className="font-semibold text-white">
                      {cancel.name}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={clearAll}
            className="flex-1 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 py-4 rounded-xl text-red-400 transition-all duration-300 font-semibold"
          >
            Alle Anmeldungen löschen
          </button>
          <button
            onClick={() => {
              const data = {
                confirmations,
                cancellations,
                totalGuests,
                exportDate: new Date().toISOString(),
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json',
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `geburtstag-anmeldungen-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
            }}
            className="flex-1 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 py-4 rounded-xl text-purple-400 transition-all duration-300 font-semibold"
          >
            Daten exportieren
          </button>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-white/70 hover:text-white transition-colors"
          >
            ← Zurück zur Startseite
          </a>
        </div>
      </div>
    </div>
  );
}
