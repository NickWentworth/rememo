import Sidebar from '../components/sidebar';

export default function Dashboard() {
    return (
        <div className='page'>
            <Sidebar currentTab='Dashboard' />
            <p>Dashboard</p>
        </div>
    )
}
