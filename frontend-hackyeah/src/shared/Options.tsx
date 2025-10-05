import { useState } from "react"
import { service } from "../api/service"
import listaIcon from "../assets/info-svgrepo-com.svg"
export const Settings = ({ data }: any) => {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState("")
    return <div>
        {open && <div className="absolute bottom-50 right-4 w-5/8 bg-white p-3 rounded-xl font-bold text-xl">
            {message}
        </div>}
        <button
            className="fixed bottom-4 right-4 bg-white flex text-white w-25 h-25 rounded-full shadow-lg items-center justify-center"
            onClick={() => {
                service.analyzeTrip(data.user.tickets[0].tripId).then(res => res.data)
                    .then(res => {
                        setOpen(!open)
                        setMessage(res.message)
                    })
            }}
        >
            <img src={listaIcon} className="w-15 h-15"></img>
        </button>

    </div>
}