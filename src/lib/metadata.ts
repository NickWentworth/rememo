import { Metadata } from 'next';

type MetadataData = {
    title?: string;
};

export function buildMetadata(data?: MetadataData): Metadata {
    return {
        icons: '/favicon.ico',
        title: data?.title ? `${data.title} | Rememo` : 'Rememo',
    };
}
