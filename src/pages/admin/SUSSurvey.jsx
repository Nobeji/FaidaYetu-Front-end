import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

export default function SUSSurvey() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const profile = JSON.parse(localStorage.getItem('profile') || '{}');
  const userRole = profile.role || 'customer';
  const userName = profile.user?.username || JSON.parse(localStorage.getItem('user') || '{}').username || 'User';

  const [form, setForm] = useState({ q1:3,q2:3,q3:3,q4:3,q5:3,q6:3,q7:3,q8:3,q9:3,q10:3, user_role: userRole });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [myScore, setMyScore] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdmin) {
      api.adminSUSSurvey().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const calcLocalScore = (f) => {
    const odd = f.q1+f.q3+f.q5+f.q7+f.q9;
    const even = f.q2+f.q4+f.q6+f.q8+f.q10;
    return ((odd - 5) + (25 - even)) * 2.5;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await api.submitSUSSurvey(form);
      setMyScore(res.score);
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
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}>System Usability Scale (SUS)</h1>
        <p style={{ fontSize: 15, color: '#666', marginBottom: 24 }}>Admin view — all submitted responses from all users (Brooke, 1996)</p>

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

            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', overflow: 'hidden' }}>
              <div style={{ padding: 16, fontWeight: 700, borderBottom: '1px solid #eaeaea' }}>All Submitted Responses</div>
              <div style={{ overflowX: 'auto', padding: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8faf9' }}>
                      {['#', 'User', 'Role', 'SUS Score', 'Grade', 'Date'].map(h => (
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
                        <td style={{ padding: 10, fontWeight: 700, color: r.score >= 68 ? '#2e7d32' : '#e65100' }}>{r.score}</td>
                        <td style={{ padding: 10 }}>{r.score >= 80 ? 'A' : r.score >= 68 ? 'B' : r.score >= 50 ? 'C' : r.score >= 30 ? 'D' : 'F'}</td>
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
            <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>No Responses Yet</div>
            <div>Users will submit SUS surveys from their dashboards. Results will appear here.</div>
          </div>
        )}
      </div>
    );
  }

  // ==================== USER VIEW (Customer / Supplier / Driver) ====================
  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}>System Usability Scale Survey</h1>
      <p style={{ fontSize: 15, color: '#666', marginBottom: 24 }}>Rate how easy FaidaYetu is to use — 10 quick questions</p>

      {!showForm && !submitted && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>SUS Usability Survey</div>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 20, maxWidth: 500, margin: '0 auto 20px' }}>
            The System Usability Scale (SUS) is a 10-item industry-standard questionnaire
            that measures how easy a system is to use. It takes about 2 minutes.
          </p>
          <button onClick={() => setShowForm(true)} style={{ padding: '12px 32px', background: '#7b1fa2', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            Start Survey
          </button>
        </div>
      )}

      {showForm && !submitted && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eaeaea', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>SUS Survey — {userName}</h3>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ padding: '4px 12px', background: '#f3e5f5', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#7b1fa2', textTransform: 'capitalize' }}>{userRole}</span>
              <span style={{ padding: '4px 12px', background: calcLocalScore(form) >= 68 ? '#e8f5e9' : '#fff3e0', borderRadius: 20, fontSize: 12, fontWeight: 700, color: calcLocalScore(form) >= 68 ? '#2e7d32' : '#e65100' }}>
                Score: {calcLocalScore(form).toFixed(0)}
              </span>
            </div>
          </div>
          {SUS_QUESTIONS.map((item, idx) => (
            <div key={item.q} style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>{idx + 1}. {item.text}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1,2,3,4,5].map(v => (
                  <button key={v} onClick={() => setForm({...form, [item.q]: v})}
                    style={{ flex: 1, padding: '12px 4px', borderRadius: 8, border: form[item.q] === v ? '2px solid #7b1fa2' : '1px solid #ddd', background: form[item.q] === v ? '#f3e5f5' : '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: form[item.q] === v ? '#7b1fa2' : '#666', transition: 'all 0.15s' }}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button onClick={() => setShowForm(false)} style={{ padding: '12px 24px', border: '1px solid #ddd', borderRadius: 8, background: '#fff', cursor: 'pointer', fontWeight: 600, color: '#666' }}>Cancel</button>
            <button onClick={handleSubmit} disabled={submitting} style={{ flex: 1, padding: '12px 24px', background: '#7b1fa2', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', opacity: submitting ? 0.7 : 1 }}>
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
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#2e7d32', marginBottom: 4 }}>Your SUS Score: {myScore}</div>
          <div style={{ fontSize: 16, color: '#666', marginBottom: 8 }}>
            Grade: <strong style={{ color: myScore >= 68 ? '#2e7d32' : '#e65100' }}>
              {myScore >= 80 ? 'A — Excellent' : myScore >= 68 ? 'B — Good' : myScore >= 50 ? 'C — OK' : myScore >= 30 ? 'D — Poor' : 'F — Terrible'}
            </strong>
          </div>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
            Thank you! Your response has been recorded.
          </p>
          <button onClick={() => { setSubmitted(false); setShowForm(false); setMyScore(null); setForm({ q1:3,q2:3,q3:3,q4:3,q5:3,q6:3,q7:3,q8:3,q9:3,q10:3, user_role: userRole }); }} style={{ padding: '10px 24px', border: '1px solid #ddd', borderRadius: 8, background: '#fff', cursor: 'pointer', fontWeight: 600, color: '#333' }}>
            Submit Another Response
          </button>
        </div>
      )}
    </div>
  );
}
