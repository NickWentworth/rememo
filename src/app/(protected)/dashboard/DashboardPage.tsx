'use client';

import Panel from '@/components/Panel';
import Calendar from '@/components/Calendar';
import { TaskCard } from '@/components/cards';
import { TaskForm } from '@/components/forms';
import { useFormState } from '@/lib/hooks/useFormState';
import { useTaskMutations, useTasksWithOptions } from '@/lib/query/tasks';
import { TaskPayload } from '@/lib/types';

export default function DashboardPage() {
    // TODO: only show tasks due this week
    const {
        tasks,
        query: { status },
    } = useTasksWithOptions({
        search: '',
        show: 'current',
    });
    const { remove: removeTask } = useTaskMutations();

    const taskFormState = useFormState<TaskPayload>();

    // TODO: make (inifinite) list component that will handle these common states
    const list = (() => {
        if (status === 'error') {
            return <p>Error!</p>;
        }

        if (status === 'pending') {
            return <p>Loading...</p>;
        }

        if (tasks.length === 0) {
            return (
                <p>No tasks due this week, create one with the button above!</p>
            );
        }

        return tasks.map((task) => (
            <TaskCard
                key={task.id}
                task={task}
                onEditClick={() => taskFormState.update(task)}
                onDeleteClick={() => removeTask(task.id)}
            />
        ));
    })();

    return (
        <>
            <Panel
                header={<h1>Daily Calendar</h1>}
                body={<Calendar display='day' initialTime={7} />}
                flex={2}
            />

            <Panel header={<h1>This Week's Tasks</h1>} body={list} flex={3} />

            <TaskForm
                state={taskFormState.formState}
                onCloseClick={taskFormState.close}
            />
        </>
    );
}
