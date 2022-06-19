import { Card } from './Card';
import { getTermFormattedDate } from '../../lib/dateUtility';
import styles from './cards.module.css';

export function Term({ term, focused }) {
    return (
        <Card focused={focused}>
            <div>
                <h2>{term.name}</h2>
                <p>{getTermFormattedDate(term.startDate) + ' - ' + getTermFormattedDate(term.endDate)}</p>
            </div>
        </Card>
    )
}
