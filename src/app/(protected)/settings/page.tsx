import { SettingsWindow } from '@/components/windows';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({ title: 'Settings' });

export default async function Settings() {
    return <SettingsWindow />;
}
