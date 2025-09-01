'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

export default function AuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<'request' | 'otp'>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('authUser');
    if (auth) {
      router.replace('/');
    }
  }, [router]);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError('Введите e‑mail');
      return;
    }
    // Simulate sending verification code
    setSending(true);
    await new Promise((r) => setTimeout(r, 600));
    setSending(false);
    setStep('otp');
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (code !== '0000') {
      setError('Неверный код. Для теста используйте 0000.');
      return;
    }
    localStorage.setItem('authUser', JSON.stringify({ email }));
    router.replace('/');
  };

  const handleOtpChange = async (val: string) => {
    setCode(val);
    setError(null);
    if (val.length === 4) {
      setVerifying(true);
      // имитация небольшой задержки проверки
      await new Promise((r) => setTimeout(r, 250));
      if (val === '0000') {
        localStorage.setItem('authUser', JSON.stringify({ email }));
        router.replace('/');
      } else {
        setError('Неверный код. Для теста используйте 0000.');
        setVerifying(false);
      }
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 px-4 py-10 text-white">
      <div className="absolute inset-0 pointer-events-none [background:radial-gradient(1200px_600px_at_80%_-10%,rgba(255,255,255,0.08),transparent),radial-gradient(800px_400px_at_10%_110%,rgba(255,255,255,0.06),transparent)]" />

      <div className="mx-auto w-full max-w-md relative">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-white to-indigo-200 flex items-center justify-center text-slate-900 font-black shadow-lg">
            M
          </div>
          <div>
            <div className="text-lg font-semibold tracking-wide">MAOL Agency</div>
            <div className="text-xs text-indigo-100/80">Личный кабинет клиента</div>
          </div>
        </div>

        <Card className="w-full border border-white/10 bg-white/95 text-slate-900 shadow-2xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">Вход по коду</CardTitle>
            <CardDescription>
              Введите e‑mail, отправим код подтверждения. Для теста используйте код <b>0000</b>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'request' ? (
              <form className="space-y-4" onSubmit={handleRequest}>
                <div className="space-y-2">
                  <Label htmlFor="email">E‑mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" className="w-full" disabled={sending}>
                  {sending ? 'Отправляем код…' : 'Отправить код'}
                </Button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={handleVerify}>
                <div className="space-y-2">
                  <Label>Код подтверждения (на e‑mail)</Label>
                  <p className="text-xs text-slate-500">Мы отправили код на {email}. Введите 4 цифры ниже.</p>
                  <InputOTP
                    maxLength={4}
                    value={code}
                    onChange={handleOtpChange}
                    aria-invalid={Boolean(error)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                  <p className="text-xs text-gray-500">Для теста введите 0000</p>
                </div>
                {verifying && !error && (
                  <p className="text-sm text-slate-500">Проверяем…</p>
                )}
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep('request')}>
                    Назад
                  </Button>
                  {/* Кнопка входа больше не требуется — авто-вход при 4 цифрах */}
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
