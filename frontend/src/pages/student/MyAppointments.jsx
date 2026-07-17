import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { errorMessage } from '../../services/api';
import { Badge, Button, EmptyState, Field, Modal, Spinner } from '../../components/common/UI';
import { Page } from './StudentPages';

const statusTone = (status) => ({
  pending: 'amber',
  confirmed: 'green',
  completed: 'green',
  cancelled: 'red',
  rejected: 'red'
}[status] || 'slate');

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [rescheduling, setRescheduling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadAppointments = async () => {
    try {
      const { data } = await api.get('/appointments/my');
      setAppointments(data.appointments);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const cancelAppointment = async (appointment) => {
    if (!window.confirm(`Cancel your appointment with ${appointment.service.name}?`)) return;
    try {
      await api.patch(`/appointments/${appointment._id}/cancel`);
      toast.success('Appointment cancelled.');
      loadAppointments();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const submitReschedule = async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    setSaving(true);
    try {
      await api.patch(`/appointments/${rescheduling._id}/reschedule`, values);
      toast.success('Appointment rescheduled and sent for confirmation.');
      setRescheduling(null);
      loadAppointments();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Page
      title="My appointments"
      copy="Your scheduled campus visits, past and present."
      action={<Link className="button button-primary" to="/app/services">Book an appointment</Link>}
    >
      {loading ? <Spinner /> : appointments.length ? (
        <div className="grid-3">
          {appointments.map((appointment) => {
            const editable = ['pending', 'confirmed'].includes(appointment.status);
            return (
              <article className="card" key={appointment._id}>
                <div className="service-head">
                  <span className="icon-tile !mb-0"><CalendarDays /></span>
                  <Badge tone={statusTone(appointment.status)}>{appointment.status}</Badge>
                </div>
                <h3 className="mt-4">{appointment.service.name}</h3>
                <p>{appointment.purpose}</p>
                <div className="mt-4 text-sm">
                  <b>{new Date(appointment.appointmentDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</b>
                  <span className="block text-slate-500">{appointment.timeSlot} · {appointment.service.location}</span>
                </div>
                {editable && (
                  <div className="flex flex-wrap gap-2 mt-5">
                    <Button variant="secondary" onClick={() => setRescheduling(appointment)}>
                      <RefreshCw size={15} /> Reschedule
                    </Button>
                    <Button variant="danger" onClick={() => cancelAppointment(appointment)}>Cancel</Button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No appointments booked"
          text="Choose a campus service and reserve a time that suits your schedule."
          action={<Link className="button button-primary" to="/app/services">Browse services</Link>}
        />
      )}

      <Modal open={Boolean(rescheduling)} onClose={() => setRescheduling(null)} title="Reschedule appointment">
        {rescheduling && (
          <form className="grid gap-4" onSubmit={submitReschedule}>
            <p className="text-sm text-slate-600 m-0">Choose a new time for {rescheduling.service.name}.</p>
            <Field
              label="New date"
              name="appointmentDate"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              required
            />
            <Field as="select" label="New time" name="timeSlot" required>
              <option value="">Choose a time</option>
              {rescheduling.service.availableSlots?.map((slot) => <option key={slot}>{slot}</option>)}
            </Field>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setRescheduling(null)}>Keep current time</Button>
              <Button loading={saving}>Confirm new time</Button>
            </div>
          </form>
        )}
      </Modal>
    </Page>
  );
}
