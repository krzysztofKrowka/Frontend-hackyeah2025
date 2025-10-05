import { useState } from "react"
import { service } from "../api/service";
import warning from "../assets/alert-error-svgrepo-com.svg"
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
                <img src={warning} className="rounded- w-full h-2/3 "></img>
            </button>

        </div>
        {openPopup && (
            <div className="fixed inset-0 flex justify-center items-end z-50">
                <div className="relative w-5/5 h-10/20 bg-white rounded-t-2xl text-xl shadow-2xl">

                    {/* HEADER */}
                    <div className="bg-gray-800 text-white rounded-t-2xl p-4 flex justify-between items-center">
                        <h2 className="text-2xl font-semibold">Report Issue</h2>
                        <button
                            onClick={() => setOpenPopup(false)}
                            className="font-bold text-white text-xl hover:text-red-400"
                        >
                            ✕
                        </button>
                    </div>

                    {/* FORM CONTENT */}
                    <div className="flex flex-col items-center">
                        <input
                            onChange={(e) => setDescription(e.target.value)}
                            id="description"
                            placeholder="Description"
                            className="p-3 bg-gray-100 rounded-full shadow-lg mt-6 m-4 w-9/10 focus:outline-none focus:ring-2 focus:ring-grey-200 focus:border-grey-200 transition"
                        />
                        <input
                            onChange={(e) => setDelay(parseInt(e.target.value))}
                            id="time"
                            type="number"
                            placeholder="Delay (in minutes)"
                            className="p-3 bg-gray-100 shadow-lg rounded-full m-4 w-9/10 focus:outline-none focus:ring-2 focus:ring-grey-200 focus:border-grey-200 transition"
                        />
                        <input
                            onChange={(e) => setType(e.target.value)}
                            list="reportTypes"
                            placeholder="Type"
                            id="type"
                            className="p-3 bg-gray-100 rounded-full shadow-lg m-4 w-9/10 focus:outline-none focus:ring-2 focus:ring-grey-200 focus:border-grey-200 transition"
                        />
                        <button
                            onClick={handleReport}
                            className="bg-red-500 text-white text-3xl px-6 py-3 rounded-2xl w-1/2 shadow-lg mt-4"
                        >
                            REPORT
                        </button>
                    </div>

                    <datalist id="reportTypes">
                        {tabs.map((t) => (
                            <option key={t.type} value={t.desc}></option>
                        ))}
                    </datalist>
                </div>
            </div>
        )}
    </div >
}