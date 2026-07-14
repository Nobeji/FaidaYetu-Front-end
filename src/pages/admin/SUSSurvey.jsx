import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const SUS_QUESTIONS = [
  { q: 'q1', text: 'I think I would like to use this system frequently.' },
  { q: 'q2', text: 'I found the system unnecessarily complex.' },
  { q: 'q3', text: 'I thought the system was easy to use.' },
  { q: 'q4', text: 'I think I would need technical support to use this system.' },
  { q: 'q5', text: 'I found the various functions were well integrated.' },
  { q: 'q6', text: 'I thought there was too much inconsistency in this system.' },
  { q: 'q7', text: 'I would imagine most people would learn to use this system quickly.' },
  { q: 'q8', text: 'I found the system very cumbersome to use.' },
  { q: 'q9', text: 'I felt very confident using the system.' },
  { q: 'q10', text: 'I needed to learn a lot of things before I could get going.' },
];
const SCALE = ['1 - Strongly Disagree', '2', '3 - Neutral', '4', '5 - Strongly Agree'];

export default function SUSSurvey() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ q1:3,q2:3,q3:3,q4:3,q5:3,q6:3,q7:3,q8:3,q9:3,q10:3, user_role: 'customer' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [myScore, setMyScore] = useState(null);

  useEffect(() => {
    api.adminSUSSurvey().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const calcLocalScore = (f) => {
    const odd = f.q1+f.q3+f.q5+f.q7+f.q9;
    const even = f.q2+f.q4+f.q6+f.q8+f.q10;
    return ((odd - 5) + (25 - even)) * 2.5;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await api.submitSUSSurvey(form);
      setMyScore(res.score);
      setSubmitted(true);
      const d = await api.adminSUSSurvey();
      setData(d);
    } catch (e) {}
    setSubmitting(false);
  };

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#666' }}>Loading SUS survey data...</div>;

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}>System Usability Scale (SUS)</h1>
          <p style={{ fontSize: 15, color: '#666', margin: 0 }}>Industry-standard 10-question usability assessment (Brooke, 1996)</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setSubmitted(false); setMyScore(null); }} style={{ padding: '10px 20px', background: '#7b1fa2', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
          {showForm ? 'Hide Form' : '+ Take Survey'}
        </button>
      </div>

      {showForm && !submitted && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>SUS Questionnaire (10 Questions)</h3>
          {SUS_QUESTIONS.map((item, idx) => (
            <div key={item.q} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{idx + 1}. {item.text}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[1,2,3,4,5].map(v => (
                  <button key={v} onClick={() => setForm({...form, [item.q]: v})}
                    style={{ flex: 1, padding: '10px 4px', borderRadius: 6, border: form[item.q] === v ? '2px solid #7b1fa2' : '1px solid #ddd', background: form[item.q] === v ? '#f3e5f5' : '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: form[item.q] === v ? '#7b1fa2' : '#666' }}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Role</div>
            <select value={form.user_role} onChange={e => setForm({...form, user_role: e.target.value})} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', width: '100%' }}>
              <option value="customer">Customer</option>
              <option value="supplier">Supplier</option>
              <option value="driver">Delivery Person</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>Your current score: <strong style={{ color: calcLocalScore(form) >= 68 ? '#2e7d32' : '#e65100' }}>{calcLocalScore(form).toFixed(1)}</strong></div>
          <button onClick={handleSubmit} disabled={submitting} style={{ padding: '10px 24px', background: '#7b1fa2', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
            {submitting ? 'Submitting...' : 'Submit Survey'}
          </button>
        </div>
      )}

      {submitted && myScore !== null && (
        <div style={{ background: '#e8f5e9', borderRadius: 12, padding: 20, marginBottom: 24, border: '1px solid #c8e6c9', textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#2e7d32' }}>Your SUS Score: <span style={{ fontSize: 28 }}>{myScore}</span></div>
          <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{myScore >= 80 ? 'Excellent' : myScore >= 68 ? 'Good (above average)' : myScore >= 50 ? 'OK (marginal)' : 'Poor'}</div>
        </div>
      )}

      {data?.summary?.total_responses > 0 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Total Responses', value: data.summary.total_responses, color: '#1976d2' },
              { label: 'Average Score', value: data.summary.avg_score, color: '#2e7d32' },
              { label: 'Grade', value: data.summary.grade, color: '#7b1fa2' },
              { label: 'Interpretation', value: data.summary.interpretation, color: '#e65100' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #eaeaea' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>{item.label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>

          {data.role_breakdown && Object.keys(data.role_breakdown).length > 0 && (
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', padding: 20, marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Score by Role</h3>
              <div style={{ display: 'flex', gap: 16 }}>
                {Object.entries(data.role_breakdown).map(([role, info]) => (
                  <div key={role} style={{ flex: 1, background: '#f8faf9', borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{role}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: info.avg_score >= 68 ? '#2e7d32' : '#e65100' }}>{info.avg_score}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{info.count} responses</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ background: '#f5f5f5', borderRadius: 8, padding: 16, marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 8 }}>SUS Score Interpretation</div>
            <div style={{ display: 'flex', gap: 8, fontSize: 12 }}>
              {[
                { range: '80-100', label: 'Excellent', color: '#2e7d32' },
                { range: '68-79', label: 'Good', color: '#1976d2' },
                { range: '50-67', label: 'OK', color: '#e65100' },
                { range: '0-49', label: 'Poor', color: '#d32f2f' },
              ].map(g => (
                <div key={g.range} style={{ flex: 1, background: '#fff', borderRadius: 6, padding: 8, textAlign: 'center', border: `2px solid ${g.color}` }}>
                  <div style={{ fontWeight: 700, color: g.color }}>{g.range}</div>
                  <div style={{ color: '#666' }}>{g.label}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {data?.total === 0 && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', padding: 48, textAlign: 'center', color: '#888' }}>
          No SUS survey responses yet. Click "Take Survey" to submit the first response.
        </div>
      )}
    </div>
  );
}
