import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { errorMessage } from '../../services/api';
import { Button, EmptyState, Field, Spinner } from '../../components/common/UI';
import { Page } from './StudentPages';

const feedbackTags = ['Fast service', 'Helpful staff', 'Long wait', 'Easy process', 'Clear communication', 'Needs improvement'];

export default function Feedback() {
  const [visits, setVisits] = useState([]);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadCompletedVisits = async () => {
    try {
      const [tokenResponse, appointmentResponse, feedbackResponse] = await Promise.all([
        api.get('/tokens/my'),
        api.get('/appointments/my'),
        api.get('/feedback/my')
      ]);
      const completedTokens = tokenResponse.data.tokens
        .filter((token) => token.status === 'completed')
        .map((token) => ({ id: token._id, type: 'token', label: `${token.tokenNumber} · ${token.service.name}` }));
      const completedAppointments = appointmentResponse.data.appointments
        .filter((appointment) => appointment.status === 'completed')
        .map((appointment) => ({ id: appointment._id, type: 'appointment', label: `Appointment · ${appointment.service.name}` }));
      const reviewedVisitIds = new Set(feedbackResponse.data.feedback.flatMap((item) => [item.token, item.appointment].filter(Boolean).map(String)));
      setVisits([...completedTokens, ...completedAppointments].filter((visit) => !reviewedVisitIds.has(visit.id)));
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompletedVisits();
  }, []);

  const submitFeedback = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formValues = Object.fromEntries(new FormData(form));
    const [sourceType, sourceId] = formValues.visit.split(':');
    const payload = {
      [sourceType]: sourceId,
      rating,
      tags: Array.from(form.querySelectorAll('[name="tags"]:checked')).map((element) => element.value),
      comment: formValues.comment
    };
    setSubmitting(true);
    try {
      await api.post('/feedback', payload);
      toast.success('Thank you — your feedback helps.');
      setVisits((current) => current.filter((visit) => visit.id !== sourceId));
      form.reset();
      setRating(0);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page title="Share feedback" copy="Tell campus teams what worked and where the experience could improve.">
      {loading ? <Spinner /> : visits.length ? (
        <form className="form-card" onSubmit={submitFeedback}>
          <Field as="select" label="Completed visit" name="visit" required>
            <option value="">Select a completed visit</option>
            {visits.map((visit) => <option value={`${visit.type}:${visit.id}`} key={`${visit.type}:${visit.id}`}>{visit.label}</option>)}
          </Field>
          <div className="field mt-4">
            <span>Overall rating</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button type="button" aria-label={`${value} stars`} onClick={() => setRating(value)} key={value}>
                  <Star fill={value <= rating ? '#f59e0b' : 'none'} className={value <= rating ? 'text-amber-500' : 'text-slate-300'} />
                </button>
              ))}
            </div>
          </div>
          <div className="field mt-4">
            <span>What stood out?</span>
            <div className="flex flex-wrap gap-2">
              {feedbackTags.map((tag) => (
                <label className="badge badge-slate cursor-pointer" key={tag}>
                  <input className="mr-1" type="checkbox" name="tags" value={tag} />{tag}
                </label>
              ))}
            </div>
          </div>
          <Field as="textarea" className="mt-4" label="Comments (optional)" name="comment" />
          <Button className="mt-5" loading={submitting} disabled={!rating}>Submit feedback</Button>
        </form>
      ) : (
        <EmptyState title="No completed visits awaiting feedback" text="After a token or appointment is completed, you can share your experience here." />
      )}
    </Page>
  );
}
