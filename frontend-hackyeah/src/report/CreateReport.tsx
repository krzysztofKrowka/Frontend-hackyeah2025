import { useState } from "react"
import { service } from "../api/service";
const TYPE_TRAIN_DELAY = 'trainDelay';
const TYPE_TRAIN_FAILURE = 'trainFailure';
const TYPE_ROAD_FAILURE = 'roadFailure';
const TYPE_PASS_OTHER_TRAIN = 'passOtherTrain';
const TYPE_COLLISION = 'collision';
const TYPE_DERAILMENT = 'derailment';
const TYPE_OTHER = 'other';
export const CreateReport = ({ data }: any) => {
    const [openPopup, setOpenPopup] = useState(false)
    const [description, setDescription] = useState("")
    const [delay, setDelay] = useState(0)
    const [type, setType] = useState("")
    const handleReport = () => {
        if (!description || !delay) {
            alert("Description and Delay are required")
            return
        }
        let fullType = tabs.filter(t => t.desc == type)[0]
        if (!fullType) {
            alert("Enter proper type")
            return
        }
        // [POST: tripId, type, userId, reportLat, reportLon, description, ?delayMinutes]
        const postData = {
            tripId: data.user.tickets[0].tripId,
            type: fullType.type,
            userId: data.user.id,
            reportLat: 49.9893095,
            reportLon: 19.5399543,
            description,
            delayMinutes: delay
        }
        service.getTrain(data.user.tickets[0].tripId).then(res => res.data.train)
            .then(train => {
                if (Math.abs(train.positionLat - postData.reportLat) > 0.001 && Math.abs(train.positionLon - postData.reportLon) > 0.001)
                    alert("You are too far away from the train")
                else
                    service.createReport(postData)
            })

    }
    const tabs = [
        { type: TYPE_TRAIN_DELAY, desc: "Train Delay" },
        { type: TYPE_TRAIN_FAILURE, desc: "Train Failure" },
        { type: TYPE_ROAD_FAILURE, desc: "Road Failure" },
        { type: TYPE_PASS_OTHER_TRAIN, desc: "Pass Other Train" },
        { type: TYPE_COLLISION, desc: "Collision" },
        { type: TYPE_DERAILMENT, desc: "Derailment" },
        { type: TYPE_OTHER, desc: "Other" },
    ]
    return <div className="h-screen">
        <div >
            <button

                className="inset-ring-2 inset-ring-red-400 font-bold fixed bottom-4 left-4 bg-red-500 text-white w-25 h-25 rounded-full shadow-lg items-center justify-center"
                onClick={() => setOpenPopup(true)}
            >
                REPORT
            </button>

        </div>
        {openPopup && <div className="absolute w-4/5 h-9/20 bottom-60 left-1/10 bg-gray-200 rounded-2xl border border-black text-xl">
            <p onClick={() => setOpenPopup(false)} className="m-4 absolute right-2 font-bold">X</p>
            <input onChange={(e) => { setDescription(e.target.value) }} id="description" placeholder={"Description"} className="p-3 bg-gray-100  rounded-full border border-red-500 mt-14 m-4 w-9/10" />
            <input onChange={(e) => { setDelay(parseInt(e.target.value)) }} id="time" type={"number"} placeholder={"Delay (in minutes)"} className="p-3 bg-gray-100 rounded-full border border-red-500 m-4 w-9/10 " />
            <input onChange={(e) => { setType(e.target.value) }} list="reportTypes" placeholder="Type" id="type" className="p-3 bg-gray-100 rounded-full border border-red-500 m-4 w-9/10 " />
            <button onClick={handleReport} className="bg-red-500 text-white text-3xl px-6 py-3 rounded-2xl w-1/2 left-1/4 absolute bottom-10">  REPORT</button>
            <datalist id="reportTypes">
                {tabs.map((t) => {
                    return <option key={t.type} value={t.desc}></option>
                })}
            </datalist>
        </div>
        }
    </div >
}