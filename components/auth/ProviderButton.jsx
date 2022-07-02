import { signIn } from "next-auth/react";
import { useState } from "react";

// a single button on the sign in page, added to change image state on hover
export function ProviderButton({ provider, image }) {
    const [hovered, setHovered] = useState(false);

    return (
        <button
            onClick={() => signIn(provider.id)}
            onMouseOver={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <img src={image.replace('[color]', hovered ? 'Accent' : 'White')} height={30} />

            Sign in with {provider.name}
        </button>
    )
}
