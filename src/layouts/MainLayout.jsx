import { Outlet } from 'react-router-dom';
// import Footer from '../components/pages/Footer';

function MainLayout() {
    return (
        <div className="">
            <Outlet />
            {/* <Footer /> */}
        </div>
    )
}

export default MainLayout