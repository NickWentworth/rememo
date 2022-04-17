import Sidebar from '../components/sidebar';
import { TaskList } from '../components/taskList/taskList';

export default function Tasks() {
    return (
        <div className='page'>
            <Sidebar currentTab='Tasks' />
            <TaskList />
        </div>
    )
}
