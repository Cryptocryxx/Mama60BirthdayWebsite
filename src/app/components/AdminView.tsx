import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Users, UserX, RefreshCw } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  getConfirmations,
  getCancellations,
  deleteAllConfirmations,
  deleteAllCancellations,
  Confirmation,
  Cancellation,
} from '../services/api';

export function AdminView() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmations, setConfirmations] = useState<Confirmation[]>([]);
  const [cancellations, setCancellations] = useState<Cancellation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);

    // GET /api/confirmations
    const confirmsResponse = await getConfirmations();
    if (confirmsResponse.success && confirmsResponse.data) {
      setConfirmations(confirmsResponse.data);
    }

    // GET /api/cancellations
    const cancelsResponse = await getCancellations();
    if (cancelsResponse.success && cancelsResponse.data) {
      setCancellations(cancelsResponse.data);
    }

    setLoading(false);
  };

  const totalGuests = confirmations.reduce((sum, conf) => sum + conf.guestCount, 0);

  const clearAll = async () => {
    if (confirm('Möchtest du wirklich alle Anmeldungen löschen?')) {
      setLoading(true);

      // DELETE /api/confirmations
      await deleteAllConfirmations();

      // DELETE /api/cancellations
      await deleteAllCancellations();

      setConfirmations([]);
      setCancellations([]);
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all z-50"
        >
          <Users size={24} />
        </motion.button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-6 md:p-8 w-[90vw] max-w-3xl max-h-[80vh] overflow-y-auto z-50 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-3xl font-bold text-white">
              Anmeldungen & Absagen
            </Dialog.Title>
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          <Dialog.Description className="sr-only">
            Übersicht aller Zusagen und Absagen für den Geburtstag
          </Dialog.Description>

          <div className="mb-6 p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl border border-pink-500/30">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                {totalGuests}
              </div>
              <div className="text-white/70">Gäste insgesamt</div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Zusagen */}
            <div>
              <h3 className="text-xl font-bold text-green-400 mb-3 flex items-center gap-2">
                <Users size={20} />
                Zusagen ({confirmations.length})
              </h3>
              <div className="space-y-2">
                {confirmations.length === 0 ? (
                  <p className="text-white/50 text-sm">Noch keine Zusagen</p>
                ) : (
                  confirmations.map((conf, index) => (
                    <div
                      key={index}
                      className="bg-white/5 p-3 rounded-lg border border-white/10"
                    >
                      <div className="font-semibold text-white">
                        {conf.names.join(', ')}
                      </div>
                      <div className="text-sm text-white/60">
                        {conf.email} · {conf.guestCount} {conf.guestCount === 1 ? 'Person' : 'Personen'}
                      </div>
                      <div className="text-xs text-white/40 mt-1">
                        {new Date(conf.timestamp).toLocaleString('de-DE')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Absagen */}
            <div>
              <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2">
                <UserX size={20} />
                Absagen ({cancellations.length})
              </h3>
              <div className="space-y-2">
                {cancellations.length === 0 ? (
                  <p className="text-white/50 text-sm">Noch keine Absagen</p>
                ) : (
                  cancellations.map((cancel, index) => (
                    <div
                      key={index}
                      className="bg-white/5 p-3 rounded-lg border border-white/10"
                    >
                      <div className="font-semibold text-white">
                        {cancel.name}
                      </div>
                      <div className="text-xs text-white/40 mt-1">
                        {new Date(cancel.timestamp).toLocaleString('de-DE')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={clearAll}
              className="flex-1 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 py-3 rounded-xl text-red-400 transition-all duration-300"
            >
              Alle löschen
            </button>
            <button
              onClick={() => {
                const data = {
                  confirmations,
                  cancellations,
                  totalGuests,
                  exportDate: new Date().toISOString()
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'geburtstag-anmeldungen.json';
                a.click();
              }}
              className="flex-1 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 py-3 rounded-xl text-purple-400 transition-all duration-300"
            >
              Exportieren
            </button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
              aria-label="Schließen"
            >
              <X size={24} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
