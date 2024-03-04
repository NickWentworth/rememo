import SettingsPage from './SettingsPage';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({ title: 'Settings' });

export default () => <SettingsPage />;
