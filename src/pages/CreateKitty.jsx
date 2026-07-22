import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { kittyApi, ApiError } from '../api/client';
import { PageHeader } from '../components/PageHeader';
import { Button, Field, Banner, Card } from '../components/ui';

const CATEGORIES = [
  { value: 'Contributions', label: 'Contributions', desc: 'Medical, education, emergencies, welfare' },
  { value: 'Chama', label: 'Chama', desc: 'Group savings / merry-go-round' },
  { value: 'Events', label: 'Events', desc: 'Weddings, harambees, conferences' },
];

export default function CreateKitty() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    category: 'Contributions', name: '', description: '', goalKes: '',
    deadline: '', beneficiaryName: '', beneficiaryPhone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit() {
    setError('');
    if (!form.name || !form.goalKes) { setError('Name and target amount are required.'); return; }
    setLoading(true);
    try {
      const created = await kittyApi.create({
        name: form.name,
        description: form.description || null,
        category: form.category,
        goalKes: Number(form.goalKes),
        deadline: form.deadline || null,
        beneficiaryName: form.beneficiaryName || null,
        beneficiaryPhone: form.beneficiaryPhone || null,
        beneficiaryIdNumber: null,
      });
      nav(`/app/kitty/${created.id}`, { replace: true });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not create kitty.');
    } finally { setLoading(false); }
  }

  return (
    <>
      <PageHeader title="New kitty" subtitle={`Step ${step} of 3`} />
      <div style={{ padding: '0 18px' }}>
        {/* progress dots */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 60,
              background: s <= step ? 'var(--grad)' : 'var(--bg-tint)' }} />
          ))}
        </div>
        <Banner kind="error">{error}</Banner>

        {step === 1 && (
          <div>
            <h3 style={{ marginBottom: 12 }}>What kind of kitty?</h3>
            <div style={{ display: 'grid', gap: 10 }}>
              {CATEGORIES.map((c) => (
                <Card key={c.value} onClick={() => setForm({ ...form, category: c.value })}
                  style={{ cursor: 'pointer', border: `2px solid ${form.category === c.value ? 'var(--brand)' : 'transparent'}` }}>
                  <div style={{ fontWeight: 600 }}>{c.label}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{c.desc}</div>
                </Card>
              ))}
            </div>
            <div style={{ marginTop: 18 }}><Button full onClick={() => setStep(2)}>Continue</Button></div>
          </div>
        )}

        {step === 2 && (
          <div>
            <Field label="Kitty name"><input value={form.name} onChange={set('name')} placeholder="Mama Njeri Medical Fund" /></Field>
            <Field label="Description" hint="What is this fundraiser for?">
              <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Support for hospital bills\u2026" />
            </Field>
            <Field label="Target amount (KES)">
              <input value={form.goalKes} onChange={set('goalKes')} inputMode="numeric" placeholder="500000"
                style={{ fontFamily: 'var(--mono)' }} />
            </Field>
            <Field label="Deadline (optional)"><input type="date" value={form.deadline} onChange={set('deadline')} /></Field>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button full onClick={() => setStep(3)}>Continue</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ marginBottom: 6 }}>Beneficiary (optional)</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 14 }}>
              If the funds are for someone other than you. Locked once contributions start.
            </p>
            <Field label="Beneficiary name"><input value={form.beneficiaryName} onChange={set('beneficiaryName')} placeholder="Njeri Wanjiru" /></Field>
            <Field label="Beneficiary M-PESA phone"><input value={form.beneficiaryPhone} onChange={set('beneficiaryPhone')} placeholder="0722 000 000" inputMode="tel" /></Field>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button full loading={loading} onClick={submit}>Create kitty</Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
