import { useState, useEffect } from 'react';

const taskApiRoute = '/api/task/';

export function useTasks() {
    const [tasks, setTasks] = useState(null);

    // on page load, fetch tasks from database
    useEffect(async () => {
        let response = await fetch(`${taskApiRoute}`);
        let data = await response.json();

        // TODO - possibly create a custom fetch method that always checks for bad responses
        if (!response.ok) {
            console.error(data.text);
            return;
        }

        setTasks(data.tasks);
    }, [])

    // functions used by components to modify tasks list
    const taskFunctions = {
        add: async (addedTask) => {
            let response = await fetch(`${taskApiRoute}add`, {
                method: 'POST',
                body: JSON.stringify({ task: addedTask })
            })
            let data = await response.json();

            if (!response.ok) {
                console.error(data.text);
                return;
            }
            
            setTasks(tasks.concat(data.task));
        },
        delete: async (deletedTask) => {
            let response = await fetch(`${taskApiRoute}delete`, {
                method: 'POST',
                body: JSON.stringify({ task: deletedTask })
            })
            let data = await response.json();

            if (!response.ok) {
                console.error(data.text);
                return;
            }
            
            setTasks(tasks.filter((task) => task.id != deletedTask.id));
        },
        edit: async (editedTask) => {
            let response = await fetch(`${taskApiRoute}edit`, {
                method: 'POST',
                body: JSON.stringify({ task: editedTask })
            })
            let data = await response.json();

            if (!response.ok) {
                console.error(data.text);
                return;
            }

            setTasks(tasks.map((task) => {
                return (task.id == editedTask.id) ? data.task : task;
            }))
        }
    }

    return [tasks, taskFunctions];
}
