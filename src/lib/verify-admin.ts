import { firebaseConfig } from '@/firebase/config';
import { ALLOWED_ADMIN_EMAILS } from '@/lib/site-config';

/**
 * Verifies the Firebase ID token sent as `Authorization: Bearer <token>` and
 * checks the signed-in email against the admin allowlist. Uses the Identity
 * Toolkit REST API (validated against Google, not just decoded) so this works
 * without the firebase-admin SDK / a service account.
 */
export async function requireAdmin(request: Request): Promise<{ email: string } | null> {
  const authHeader = request.headers.get('authorization') || '';
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!idToken) return null;

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const email = data.users?.[0]?.email;
    if (!email || !ALLOWED_ADMIN_EMAILS.includes(email)) return null;
    return { email };
  } catch {
    return null;
  }
}
