import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../../services/api';
import { FileText, CheckCircle } from 'lucide-react';

const SCALE_LABELS = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];

export default function TAMSurvey() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const profile = JSON.parse(localStorage.getItem('profile') || '{}');
  const userRole = profile.role || 'customer';
  const userName = profile.user?.username || JSON.parse(localStorage.getItem('user') || '{}').username || 'User';

  const [form, setForm] = useState({
    perceived_usefulness: 3, perceived_ease_of_use: 3,
    behavioral_intention: 3, actual_usage: 3,
    comments: '', user_role: userRole,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdmin) {
      api.adminTAMSurvey().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await api.submitTAMSurvey(form);
      setSubmitted(true);
    } catch (e) {
      setError(e.message || 'Failed to submit. Please try again.');
    }
    setSubmitting(false);
  };

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#666' }}>Loading...</div>;

  // ==================== ADMIN VIEW ====================
  if (isAdmin) {
    return (
      <div className="fade-in">
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}>Technology Acceptance Model Survey</h1>
        <p style={{ fontSize: 15, color: '#666', marginBottom: 24 }}>Admin view — all submitted responses from all users (Davis, 1989)</p>

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
              <div style={{ padding: 16, fontWeight: 700, borderBottom: '1px solid #eaeaea' }}>All Submitted Responses</div>
              <div style={{ overflowX: 'auto', padding: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8faf9' }}>
                      {['#', 'User', 'Role', 'PU', 'PEOU', 'BI', 'AU', 'Comments', 'Date'].map(h => (
                        <th key={h} style={{ padding: 10, fontSize: 11, fontWeight: 700, color: '#666', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid #eaeaea' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.responses.map((r, i) => (
                      <tr key={r.id} style={{ borderBottom: '1px solid #fafafa' }}>
                        <td style={{ padding: 10, fontSize: 12, color: '#888' }}>{i + 1}</td>
                        <td style={{ padding: 10, fontWeight: 600 }}>{r.user}</td>
                        <td style={{ padding: 10, textTransform: 'capitalize' }}>{r.role}</td>
                        <td style={{ padding: 10 }}>{r.pu}</td>
                        <td style={{ padding: 10 }}>{r.peou}</td>
                        <td style={{ padding: 10 }}>{r.bi}</td>
                        <td style={{ padding: 10 }}>{r.au}</td>
                        <td style={{ padding: 10, fontSize: 12, color: '#666', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.comments || '—'}</td>
                        <td style={{ padding: 10, fontSize: 12, color: '#888' }}>{new Date(r.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {(!data || data.total === 0) && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', padding: 48, textAlign: 'center', color: '#888' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}><FileText size={32} /></div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>No Responses Yet</div>
            <div>Users will submit TAM surveys from their dashboards. Results will appear here.</div>
          </div>
        )}
      </div>
    );
  }

  // ==================== USER VIEW (Customer / Supplier / Driver) ====================
  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}>Technology Acceptance Model Survey</h1>
      <p style={{ fontSize: 15, color: '#666', marginBottom: 24 }}>Help us improve FaidaYetu by sharing your experience</p>

      {!showForm && !submitted && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}><FileText size={40} /></div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>TAM Survey</div>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 20, maxWidth: 500, margin: '0 auto 20px' }}>
            This survey measures how useful and easy to use you find FaidaYetu.
            It has 4 questions and takes about 2 minutes.
          </p>
          <button onClick={() => setShowForm(true)} style={{ padding: '12px 32px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            Start Survey
          </button>
        </div>
      )}

      {showForm && !submitted && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>TAM Survey — {userName}</h3>
            <span style={{ padding: '4px 12px', background: '#e3f2fd', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#1976d2', textTransform: 'capitalize' }}>{userRole}</span>
          </div>
          {[
            { key: 'perceived_usefulness', label: '1. The system improves my efficiency in purchasing poultry products' },
            { key: 'perceived_ease_of_use', label: '2. I find the system easy to use and navigate' },
            { key: 'behavioral_intention', label: '3. I intend to continue using this platform regularly' },
            { key: 'actual_usage', label: '4. I have already used the system for my poultry supply needs' },
          ].map(q => (
            <div key={q.key} style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>{q.label}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1,2,3,4,5].map(v => (
                  <button key={v} onClick={() => setForm({...form, [q.key]: v})}
                    style={{ flex: 1, padding: '12px 4px', borderRadius: 8, border: form[q.key] === v ? '2px solid #1976d2' : '1px solid #ddd', background: form[q.key] === v ? '#e3f2fd' : '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: form[q.key] === v ? '#1976d2' : '#666', transition: 'all 0.15s' }}>
                    {SCALE_LABELS[v-1]}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Comments (optional)</div>
            <textarea value={form.comments} onChange={e => setForm({...form, comments: e.target.value})} rows={3} placeholder="Any additional feedback..." style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', resize: 'vertical', boxSizing: 'border-box', fontSize: 13 }} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setShowForm(false)} style={{ padding: '12px 24px', border: '1px solid #ddd', borderRadius: 8, background: '#fff', cursor: 'pointer', fontWeight: 600, color: '#666' }}>Cancel</button>
            <button onClick={handleSubmit} disabled={submitting} style={{ flex: 1, padding: '12px 24px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Submitting...' : 'Submit Survey'}
            </button>
          </div>
          {error && (
            <div style={{ marginTop: 12, padding: '10px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#d32f2f', fontSize: 13 }}>
              {error}
            </div>
          )}
        </div>
      )}

      {submitted && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}><CheckCircle size={48} /></div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: '#2e7d32' }}>Asante! Survey Imekamilika</div>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
            Your response has been recorded. Thank you for helping us improve FaidaYetu!
          </p>
          <button onClick={() => { setSubmitted(false); setShowForm(false); setForm({ perceived_usefulness: 3, perceived_ease_of_use: 3, behavioral_intention: 3, actual_usage: 3, comments: '', user_role: userRole }); }} style={{ padding: '10px 24px', border: '1px solid #ddd', borderRadius: 8, background: '#fff', cursor: 'pointer', fontWeight: 600, color: '#333' }}>
            Submit Another Response
          </button>
        </div>
      )}
    </div>
  );
}
