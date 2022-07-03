import Link from "next/link";
import styles from './pages.module.css'

export default function Custom404() {
    return (
        <div className={styles.custom404 + ' fill'}>
            <h1>404 - This page could not be found</h1>

            {/* TODO - return to dashboard once its created */}
            <Link href='/tasks'>
                <button>Back to Rememo</button>
            </Link>
        </div>
    )
}
