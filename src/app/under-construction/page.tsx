import { getDbInitialData } from '@/firebase/db-actions';
import { UnderConstructionPage } from '@/components/shared/UnderConstructionPage';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const initialData = await getDbInitialData();
  return <UnderConstructionPage globalData={initialData?.global} />;
}
