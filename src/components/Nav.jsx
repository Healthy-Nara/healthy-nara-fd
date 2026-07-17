import { content } from "../data/data"

function Nav() {
    return (
        <div className="flex justify-between items-center">
            <img src={content.login.logo} alt="" className="w-[57px] h-[32px]" />
            <select className="px-[15px] py-[8px] border border-secondry text-secondry cursor-pointer rounded-[8px] outline-none">
                <option value="burmese" className="text-[10px] font-nato font-bold">မြန်မာ ဘာသာ</option>
                <option value="english" className="text-[10px] font-nato font-bold">English</option>
            </select>
        </div>
    )
}

export default Nav