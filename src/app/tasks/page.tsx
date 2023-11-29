import { Search } from '@/components/icons';
import TaskCard from '@/components/TaskCard';
import { PrismaClient } from '@prisma/client';
import { CSSProperties } from 'react';
import styles from './page.module.css';

const prisma = new PrismaClient();
const TEST_USER = '0';

export default async function Tasks() {
    const tasks = await prisma.task.findMany({ where: { userId: TEST_USER } });

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.count}>
                    <h3>Tasks</h3>

                    <h3 className={styles.numberFill}>{tasks.length}</h3>

                    <button className={styles.addButton}>
                        <h3>+</h3>
                    </button>
                </div>

                <div className={styles.filters}>
                    <FilterButton name='Overdue' count={0} active={false} />
                    <FilterButton name='This Week' count={0} active={true} />
                    <FilterButton name='Next Week' count={0} active={false} />
                </div>

                <div className={styles.search}>
                    {/* TODO: plus sign is slightly off-center, either fix or add new svg */}
                    <div className={styles.searchBox}>
                        <p>Search</p>
                        <Search size={16} color='light' />
                    </div>
                </div>
            </div>

            <div className={styles.list}>
                {tasks.map((t) => (
                    <TaskCard key={t.id} task={t} />
                ))}
            </div>
        </div>
    );
}

type FilterButtonProps = {
    name: string;
    count: number;
    active: boolean;
};

function FilterButton(props: FilterButtonProps) {
    const activeBarStyle = {
        backgroundColor: props.active ? 'var(--accent)' : 'var(--light)',
        height: props.active ? '4px' : '2px',
        marginTop: props.active ? '2px' : '4px',
    } satisfies CSSProperties;

    // conditionally bold a given child element
    function CondBold(active: boolean, children: React.ReactNode) {
        return active ? <b>{children}</b> : children;
    }

    return (
        <div className={styles.filterButton}>
            {CondBold(props.active, <p>{props.name}</p>)}

            {CondBold(
                props.active,
                <p className={styles.numberFill}>{props.count}</p>
            )}

            <div
                className={styles.filterButtonActiveBar}
                style={activeBarStyle}
            />
        </div>
    );
}
