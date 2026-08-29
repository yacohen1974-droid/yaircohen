import { firebaseConfig } from '@/firebase/config';

/**
 * Verifies the Firebase ID token sent as `Authorization: Bearer <token>`, then
 * checks that an `admins/{email}` document exists in Firestore for the signed-in
 * email. Uses REST APIs (Identity Toolkit + Firestore) so this works without the
 * firebase-admin SDK / a service account. The Firestore read is itself gated by
 * security rules (a user may only read their own admin doc), so this can only
 * ever confirm — never spoof — admin status.
 */
export async function requireAdmin(request: Request): Promise<{ email: string } | null> {
  const authHeader = request.headers.get('authorization') || '';
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!idToken) return null;

  try {
    const lookupRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    );
    if (!lookupRes.ok) return null;
    const lookupData = await lookupRes.json();
    const email: string | undefined = lookupData.users?.[0]?.email;
    if (!email) return null;

    const adminDocRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/admins/${encodeURIComponent(email.toLowerCase())}`,
      { headers: { Authorization: `Bearer ${idToken}` } }
    );
    if (!adminDocRes.ok) return null;

    return { email };
  } catch {
    return null;
  }
}
