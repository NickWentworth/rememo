import { Card } from './Card';
import { getTermFormattedDate } from '../../lib/utility/date';

export function Term({ term, focused, onEditClick, onDeleteClick }) {
    return (
        <Card focused={focused} onEditClick={onEditClick} onDeleteClick={onDeleteClick}>
            <h2>{term.name}</h2>
            <p>{getTermFormattedDate(term.startDate) + ' - ' + getTermFormattedDate(term.endDate)}</p>
        </Card>
    )
}
