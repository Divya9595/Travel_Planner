import nodemailer from 'nodemailer';
import Trip from '../models/Trip.js';
import User from '../models/User.js';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

const NORMAL_ALERT_DAYS = [7, 5, 3];
const URGENT_WINDOW_DAYS = 14;

export const getDaysUntilTravel = (dateStr) => {
  if (!dateStr) return null;
  const start = new Date(dateStr);
  if (isNaN(start.getTime())) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  return Math.round((start - now) / (1000 * 60 * 60 * 24));
};

export const getPendingReminders = (trip) =>
  (trip.reminders || []).filter((r) => !r.done);

export const checkAlertCondition = (trip) => {
  const days = getDaysUntilTravel(trip.dateFrom || trip.transport?.departDate || trip.dateTo);
  if (days === null || days < 0 || days > URGENT_WINDOW_DAYS) {
    return { send: false, days, pending: [] };
  }
  const pending = getPendingReminders(trip);
  if (pending.length === 0) {
    return { send: false, days, pending };
  }
  const urgentPending = pending.filter((r) => r.urgent);
  const normalPending = pending.filter((r) => !r.urgent);
  const urgentAlert = urgentPending.length > 0;
  const normalAlert = normalPending.length > 0 && NORMAL_ALERT_DAYS.includes(days);
  return { send: urgentAlert || normalAlert, days, pending };
};

const buildEmailHtml = ({ name, trip, pending, days }) => {
  const reminderList = pending
    .map(
      (r) =>
        `<li style="margin: 6px 0; padding: 10px 14px; background: #f1f5f9; border-radius: 8px; font-size: 14px; color: #0f172a;">
           ${r.icon || '•'} ${r.text}${r.urgent ? ' <strong style="color: #dc2626;">[Urgent]</strong>' : ''}
         </li>`
    )
    .join('');
  const countdown = days === 0 ? 'today' : `in ${days} day${days === 1 ? '' : 's'}`;

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #4f46e5; color: #ffffff; padding: 20px 24px;">
        <h2 style="margin: 0; font-size: 20px;">Trip Reminder — ${trip.destination}</h2>
        <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.9;">Your trip is ${countdown}</p>
      </div>
      <div style="padding: 24px;">
        <p style="font-size: 15px; color: #0f172a;">Hi ${name},</p>
        <p style="font-size: 14px; color: #334155;">
          You have <strong>${pending.length} pending reminder${pending.length > 1 ? 's' : ''}</strong> for your upcoming trip
          to <strong>${trip.destination}</strong>${trip.dateFrom ? ` (from ${trip.dateFrom})` : ''}. Please review them before you travel:
        </p>
        <ul style="list-style: none; padding: 0; margin: 16px 0;">${reminderList}</ul>
        <p style="font-size: 13px; color: #64748b;">Log in to your Travel Planner dashboard to mark reminders as completed.</p>
      </div>
      <div style="background: #f8fafc; padding: 14px 24px; text-align: center; font-size: 12px; color: #94a3b8;">
        Travel Planner — plan smarter, travel better
      </div>
    </div>
  `;
};

export const sendReminderAlertEmail = async ({ to, name, trip, pending, days }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[notification] SMTP not configured, skipping reminder email to', to);
    return false;
  }
  const countdown = days === 0 ? 'today' : `in ${days} day${days === 1 ? '' : 's'}`;
  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"Travel Planner" <${process.env.SMTP_USER}>`,
    to,
    subject: `Trip Reminder: ${trip.destination} is ${countdown} — ${pending.length} pending reminder${pending.length > 1 ? 's' : ''}`,
    html: buildEmailHtml({ name, trip, pending, days }),
  });
  return true;
};

export const checkAndNotifyTrip = async (trip, user) => {
  const { send, days, pending } = checkAlertCondition(trip);
  if (!send) return { notified: false, reason: 'not-within-window' };
  if ((trip.reminderAlertDays || []).includes(days)) {
    return { notified: false, reason: 'already-notified' };
  }

  const sent = await sendReminderAlertEmail({
    to: user.email,
    name: user.name || user.email,
    trip,
    pending,
    days,
  });
  if (sent) {
    trip.reminderAlertDays = [...(trip.reminderAlertDays || []), days];
    await trip.save();
  }
  return { notified: sent, days, pendingCount: pending.length };
};

export const scanUpcomingTrips = async () => {
  const trips = await Trip.find({ dateFrom: { $exists: true, $ne: '' } });
  let notified = 0;
  for (const trip of trips) {
    const user = await User.findById(trip.user);
    if (!user) continue;
    try {
      const result = await checkAndNotifyTrip(trip, user);
      if (result.notified) notified++;
    } catch (error) {
      console.error('[notification] scan trip failed:', error.message);
    }
  }
  return { scanned: trips.length, notified };
};
