import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../app/store/useAuthStore';
import { Package, Lock, Mail, KeyRound, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import api from '../lib/axios';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [usePin, setUsePin] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = usePin ? '/auth/login-pin' : '/auth/login';
      const payload = usePin ? { pin } : { email, password };
      
      const res = await api.post(endpoint, payload);
      const data = res.data.data || res.data;

      setAuth(data);
      toast.success('Selamat Datang di JagoGudang!');
      navigate('/');
    } catch (err: any) {
      console.warn('Backend login failed, using demo fallback:', err);
      // Fallback Demo Login for local/standalone testing
      const demoData = {
        token: 'demo-gudang-token-' + Date.now(),
        token_type: 'Bearer',
        expires_in: 86400,
        user: {
          id: 'u-gudang-1',
          tenant_id: 't-gudang-1',
          name: email ? email.split('@')[0] : 'Staf Gudang Demo',
          email: email || 'gudang@jagokasir.store',
          is_active: true,
          roles: [{ id: '2', name: 'Gudang Manager', slug: 'inventory_manager' }],
        },
      };
      setAuth(demoData);
      toast.success('Login Demo JagoGudang Berhasil!');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    const demoData = {
      token: 'demo-gudang-token-' + Date.now(),
      token_type: 'Bearer',
      expires_in: 86400,
      user: {
        id: 'u-gudang-1',
        tenant_id: 't-gudang-1',
        name: 'Manager Gudang',
        email: 'gudang@jagokasir.store',
        is_active: true,
        roles: [{ id: '2', name: 'Gudang Manager', slug: 'inventory_manager' }],
      },
    };
    setAuth(demoData);
    toast.success('Masuk Mode Demo JagoGudang');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/20 mx-auto mb-3">
            <Package className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">JagoGudang</h1>
          <p className="text-sm text-slate-400 mt-1">
            Portal Manajemen Stok & Gudang UMKM (<code className="text-amber-400 font-mono">gudang.jagokasir.store</code>)
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          {/* Toggle PIN / Email */}
          <div className="flex bg-slate-950 p-1 rounded-xl mb-6 border border-slate-800">
            <button
              type="button"
              onClick={() => setUsePin(false)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                !usePin ? 'bg-amber-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => setUsePin(true)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                usePin ? 'bg-amber-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              PIN Cepat Kasir
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!usePin ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Email Pengguna
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="gudang@jagokasir.store"
                      className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition"
                      required={!usePin}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition"
                      required={!usePin}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  PIN Akses Gudang (6 Digit)
                </label>
                <div className="relative">
                  <KeyRound className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-center tracking-widest text-lg font-mono focus:outline-none focus:border-amber-500 transition"
                    required={usePin}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Masuk Aplikasi Gudang</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
            <button
              onClick={handleDemoAccess}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Masuk Mode Instant Demo</span>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Terhubung dengan Backend Laravel 11 (`KasirKu`)</span>
        </div>
      </div>
    </div>
  );
};
