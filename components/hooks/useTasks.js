import { useState, useEffect, useContext } from 'react';
import { TokenContext } from '../../pages/_app';

const taskApiRoute = '/api/task/';

export function useTasks() {
    const { token, setToken } = useContext(TokenContext);
    const [tasks, setTasks] = useState(null);

    // on page load, fetch tasks from database
    useEffect(async () => {
        let response = await fetch(`${taskApiRoute}${token}`);

        // TODO - possibly create a custom fetch method that always checks for bad responses
        // need to login again, bad token
        if (response.status == 401) {
            console.log('Bad token');
            setToken('');
            return;
        }

        let data = await response.json();
        setTasks(data.tasks);
        setToken(data.token);
    }, [])

    // functions used by components to modify tasks list
    const taskFunctions = {
        add: async (addedTask) => {
            let response = await fetch(`${taskApiRoute}add`, {
                method: 'POST',
                body: JSON.stringify({
                    task: addedTask,
                    token: token
                })
            })

            // need to login again, bad token
            if (response.status == 401) {
                console.log('Bad token');
                setToken('');
                return;
            }
            
            let data = await response.json();
            
            setTasks(tasks.concat(data.task));
            setToken(data.token);
        },
        delete: async (deletedTask) => {
            let response = await fetch(`${taskApiRoute}delete`, {
                method: 'POST',
                body: JSON.stringify({
                    task: deletedTask,
                    token: token
                })
            })

            // need to login again, bad token
            if (response.status == 401) {
                console.log('Bad token');
                setToken('');
                return;
            }
            
            let data = await response.json();
            setTasks(tasks.filter((task) => task.id != deletedTask.id));
            setToken(data.token);
        },
        edit: async (editedTask) => {
            let response = await fetch(`${taskApiRoute}edit`, {
                method: 'POST',
                body: JSON.stringify({
                    task: editedTask,
                    token: token
                })
            })

            // need to login again, bad token
            if (response.status == 401) {
                console.log('Bad token');
                setToken('');
                return;
            }

            let data = await response.json();

            setTasks(tasks.map((task) => {
                return (task.id == editedTask.id) ? data.task : task;
            }))
            setToken(data.token);
        }
    }

    return [tasks, taskFunctions];
}
