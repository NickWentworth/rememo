type LayoutProps = {
    children: React.ReactNode;
};

export default function Layout(props: LayoutProps) {
    return (
        <html>
            <body>{props.children}</body>
        </html>
    );
}
