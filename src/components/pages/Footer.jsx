import { content } from '../../data/data';
function Footer() {
    return (
        <div className="absolute bg-white w-full mx-auto left-0 right-0 z-10 bottom-0 border-[0.1px] border-[#D9D9D9] p-4 text-center">
            <button className='bg-primary w-full px-16 py-4 text-white rounded-[8px] font-bold font-nato text-[12px]'>{content.footer.loginBtn}</button>
        </div>
    )
}

export default Footer