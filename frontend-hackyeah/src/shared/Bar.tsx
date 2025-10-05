import { useState } from "react"
import konto from "../assets/konto.svg"
import Clock from "./Clock"
import { service } from "../api/service"
export const Bar = ({ data, setData, interval }: any) => {

    const [openInput, setOpenInput] = useState(false)
    const [biletId, setBiletId] = useState("")
    const handleLogout = () => {
        const copy = structuredClone(data)
        copy.user = {}
        clearInterval(interval)
        setData(copy)
    }
    const handleAddBilet = () => {
        if (biletId) {
            const copy = structuredClone(data)
            if (!copy.user.tickets)
                copy.user.tickets = []
            copy.user.tickets.push(biletId)
            setData(copy)
            service.addTicket(copy.user.id, biletId)
        }
        else {
            alert("BiletId jest wymagane")
        }
    }
    return <div
        onLoad={(event) => {
            event.stopPropagation()
        }}
    >
        <div className="bg-white h-15 flex items-center justify-end pr-4 p-1 border-gray-300 shadow-[0_8px_20px_2px_rgba(0,0,0,0.35)]">
            <Clock />
            <p className="float-right text-black mr-2">{data.user.points}</p>
            <button

                onClick={() => { setOpenInput(!openInput) }}
            >
                <img src={konto} className="w-13 h-13 border border-black rounded-full"></img>

            </button>
            {openInput && <div className="absolute z-2 w-2/5 h-40 top-15 right-4 bg-gray-200 rounded-2xl border border-black text-lg">
                <input onChange={(e) => { setBiletId(e.target.value) }} id="biletId" placeholder={"Ticket"} className="p-1 bg-gray-100 rounded-full border border-red-500 mx-2 mt-2 w-9/10 " />
                <button onClick={handleAddBilet} className="bg-gray-500 text-white text-xl px-3 py-1 rounded-2xl w-3/4 left-1/8 absolute bottom-16"> Add</button>
                <button onClick={handleLogout} className="bg-red-500 text-white text-xl px-3 py-1 rounded-2xl w-3/4 left-1/8 absolute bottom-4"> Log out</button>
            </div>
            }
        </div>

    </div >
}