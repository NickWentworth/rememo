import Link from 'next/link';
import Button from '@/components/Button';

const fill: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
};

export default async function NotFoundPage() {
    return (
        <div style={fill}>
            <h1>404 - Page not found</h1>

            <p>
                The page you are looking for doesn't exist or it might have been
                removed
            </p>

            <Link href='/dashboard'>
                <Button type='solid'>Return to Dashboard</Button>
            </Link>
        </div>
    );
}
