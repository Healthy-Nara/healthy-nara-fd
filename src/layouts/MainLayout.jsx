import { Outlet } from 'react-router-dom';

function MainLayout() {
    return (
        <div className="">
            <Outlet />
        </div>
    );
}

export default MainLayout;
