import '../global.css';

// Pages in the (public) layout group do NOT require the user to be signed into an active session.

// This is only currently used for the login page as there will be no user data when they are not signed in.

type LayoutProps = {
    children: React.ReactNode;
};

export default async function Layout(props: LayoutProps) {
    return (
        <html>
            <body>{props.children}</body>
        </html>
    );
}
