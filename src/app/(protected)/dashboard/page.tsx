import DashboardPage from './DashboardPage';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({ title: 'Dashboard' });

export default () => <DashboardPage />;
