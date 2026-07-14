import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../../services/api';

const SCALE_LABELS = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];

export default function TAMSurvey() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.includes('/customer') || location.pathname.includes('/supplier') || location.pathname.includes('/delivery');
  const [form, setForm] = useState(() => {
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    const role = profile.role || 'customer';
    return { perceived_usefulness: 3, perceived_ease_of_use: 3, behavioral_intention: 3, actual_usage: 3, comments: '', user_role: role };
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.adminTAMSurvey().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.submitTAMSurvey(form);
      setSubmitted(true);
      const d = await api.adminTAMSurvey();
      setData(d);
    } catch (e) {}
    setSubmitting(false);
  };

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#666' }}>Loading TAM survey data...</div>;

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}>Technology Acceptance Model Survey</h1>
          <p style={{ fontSize: 15, color: '#666', margin: 0 }}>{isDashboard ? 'Help us improve FaidaYetu by sharing your experience' : 'Perceived usefulness, ease of use, and behavioral intention (Davis, 1989)'}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
          {showForm ? 'Hide Form' : '+ Take Survey'}
        </button>
      </div>

      {showForm && !submitted && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>TAM Survey</h3>
          {[
            { key: 'perceived_usefulness', label: 'The system improves my efficiency in purchasing poultry products' },
            { key: 'perceived_ease_of_use', label: 'I find the system easy to use and navigate' },
            { key: 'behavioral_intention', label: 'I intend to continue using this platform regularly' },
            { key: 'actual_usage', label: 'I have already used the system for my poultry supply needs' },
          ].map(q => (
            <div key={q.key} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{q.label}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1,2,3,4,5].map(v => (
                  <button key={v} onClick={() => setForm({...form, [q.key]: v})}
                    style={{ flex: 1, padding: '10px 4px', borderRadius: 6, border: form[q.key] === v ? '2px solid #1976d2' : '1px solid #ddd', background: form[q.key] === v ? '#e3f2fd' : '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: form[q.key] === v ? '#1976d2' : '#666' }}>
                    {SCALE_LABELS[v-1]}
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
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Comments (optional)</div>
            <textarea value={form.comments} onChange={e => setForm({...form, comments: e.target.value})} rows={3} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', resize: 'vertical' }} />
          </div>
          <button onClick={handleSubmit} disabled={submitting} style={{ padding: '10px 24px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
            {submitting ? 'Submitting...' : 'Submit Survey'}
          </button>
        </div>
      )}

      {submitted && (
        <div style={{ background: '#e8f5e9', borderRadius: 12, padding: 20, marginBottom: 24, border: '1px solid #c8e6c9' }}>
          <div style={{ fontWeight: 700, color: '#2e7d32' }}>Survey submitted successfully!</div>
        </div>
      )}

      {data?.summary?.total_responses > 0 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Total Responses', value: data.summary.total_responses, color: '#1976d2' },
              { label: 'Avg Perceived Usefulness', value: `${data.summary.avg_perceived_usefulness}/5`, color: '#2e7d32' },
              { label: 'Avg Ease of Use', value: `${data.summary.avg_perceived_ease_of_use}/5`, color: '#7b1fa2' },
              { label: 'Avg Behavioral Intention', value: `${data.summary.avg_behavioral_intention}/5`, color: '#e65100' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #eaeaea' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>{item.label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>

          {data.role_breakdown && Object.keys(data.role_breakdown).length > 0 && (
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', padding: 20, marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Role Breakdown</h3>
              <div style={{ display: 'flex', gap: 16 }}>
                {Object.entries(data.role_breakdown).map(([role, info]) => (
                  <div key={role} style={{ flex: 1, background: '#f8faf9', borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{role}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{info.count} responses</div>
                    <div style={{ fontSize: 12, color: '#666' }}>PU: {info.avg_pu} | PEOU: {info.avg_peou}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', overflow: 'hidden' }}>
            <div style={{ padding: 16, fontWeight: 700, borderBottom: '1px solid #eaeaea' }}>Recent Responses</div>
            <div style={{ overflowX: 'auto', padding: 16 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8faf9' }}>
                    {['User', 'Role', 'PU', 'PEOU', 'BI', 'AU', 'Date'].map(h => (
                      <th key={h} style={{ padding: 10, fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid #eaeaea' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.responses.map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #fafafa' }}>
                      <td style={{ padding: 10, fontWeight: 600 }}>{r.user}</td>
                      <td style={{ padding: 10, textTransform: 'capitalize' }}>{r.role}</td>
                      <td style={{ padding: 10 }}>{r.pu}</td>
                      <td style={{ padding: 10 }}>{r.peou}</td>
                      <td style={{ padding: 10 }}>{r.bi}</td>
                      <td style={{ padding: 10 }}>{r.au}</td>
                      <td style={{ padding: 10, fontSize: 12, color: '#888' }}>{new Date(r.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {data?.total === 0 && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', padding: 48, textAlign: 'center', color: '#888' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📝</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Share Your Experience</div>
          <div>Click "Take Survey" above to tell us how FaidaYetu works for you.</div>
        </div>
      )}
    </div>
  );
}
