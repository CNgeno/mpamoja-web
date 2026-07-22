import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { withdrawalApi, ApiError } from '../api/client';
import { PageHeader } from '../components/PageHeader';
import { Button, Field, Banner, Card } from '../components/ui';
import { fmtKes } from '../lib/format';

export default function Withdraw() {
  const { id } = useParams();
  const nav = useNavigate();
  const [stage, setStage] = useState('form'); // form -> otp -> done
  const [amount, setAmount] = useState('');
  const [target, setTarget] = useState('CreatorMpesa');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function requestOtp() {
    setError('');
    if (!amount || Number(amount) <= 0) { setError('Enter an amount to withdraw.'); return; }
    setLoading(true);
    try {
      await withdrawalApi.requestOtp();
      setStage('otp');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not send code.');
    } finally { setLoading(false); }
  }

  async function confirm() {
    setError('');
    if (otp.length < 6) { setError('Enter the 6-digit code.'); return; }
    setLoading(true);
    try {
      const res = await withdrawalApi.initiate({ kittyId: id, amountKes: Number(amount), target, otpCode: otp });
      setResult(res);
      setStage('done');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Withdrawal failed.');
    } finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHeader title="Withdraw funds" subtitle="Sent only to a verified account" />
      <div style={{ padding: '0 18px' }}>
        <Banner kind="error">{error}</Banner>

        {stage === 'form' && (
          <>
            <Field label="Amount (KES)">
              <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
                inputMode="numeric" placeholder="10000" style={{ fontFamily: 'var(--mono)', fontSize: '1.2rem' }} />
            </Field>
            <Field label="Send to">
              <select value={target} onChange={(e) => setTarget(e.target.value)}>
                <option value="CreatorMpesa">My M-PESA (account owner)</option>
                <option value="BeneficiaryMpesa">Beneficiary M-PESA</option>
              </select>
            </Field>
            <Banner kind="info">
              For your protection, withdrawals require a one-time code, go only to verified accounts,
              and appear in this kitty\u2019s public history.
            </Banner>
            <Button full loading={loading} onClick={requestOtp}>Send verification code</Button>
          </>
        )}

        {stage === 'otp' && (
          <>
            <Field label="6-digit code" hint="Sent to your registered phone">
              <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                inputMode="numeric" placeholder="000000"
                style={{ fontFamily: 'var(--mono)', fontSize: '1.4rem', letterSpacing: '0.4em', textAlign: 'center' }} />
            </Field>
            <Button full loading={loading} onClick={confirm}>Confirm withdrawal of {fmtKes(Number(amount))}</Button>
          </>
        )}

        {stage === 'done' && result && (
          <Card style={{ textAlign: 'center', padding: 30 }}>
            <div style={{ fontSize: '2.4rem', marginBottom: 8 }}>{result.status === 'Processing' ? '\u2705' : '\u23f3'}</div>
            <h3>{result.status === 'Processing' ? 'Withdrawal started' : result.status}</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem', margin: '8px 0 4px' }}>{result.message}</p>
            <div style={{ margin: '14px 0' }}>
              <div className="amount" style={{ fontSize: '1.6rem', fontWeight: 600 }}>{fmtKes(result.net)}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                net of {fmtKes(result.fee)} fee
              </div>
            </div>
            <Button full onClick={() => nav(`/app/kitty/${id}`, { replace: true })}>Back to kitty</Button>
          </Card>
        )}
      </div>
    </div>
  );
}
