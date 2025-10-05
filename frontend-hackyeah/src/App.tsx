import { createContext, useEffect, useState } from "react";
import { Map } from "./map/Map";
import { Bar } from "./shared/Bar";
import { service } from "./api/service";

const baseData = {
  user: {
    id: 0,
    username: "",
    position: [0, 0],
    admin: false,
    tickets: []
  },
}
const setBaseData = () => { }
export const AppContext = createContext<any>({ data: baseData, setData: setBaseData });

function App() {
  const [data, setData] = useState(baseData)
  const [interval, setMyInterval] = useState<any>()
  useEffect(() => {
    console.log("tomas", data)
  }, [data])
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const handleLogin = () => {
    if (login && password)
      service.login(login, password).then(res => res.data)
        .then(res => {
          let copy = structuredClone(data)
          copy.user = res.user
          navigator.geolocation.getCurrentPosition(
            (position) => {
              copy.user.position = [position.coords.latitude, position.coords.longitude]
            },
            (error) => {
              console.error('Error getting user location:', error);
            }
          );

          setData(copy)
          let myinterval = setInterval(function () {
            service.getPoints(copy.user.id)
            service.login(login, password).then(res => res.data)
              .then(res => {
                let copy = structuredClone(data)
                copy.user = res.user
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    copy.user.position = [position.coords.latitude, position.coords.longitude]
                  },
                  (error) => {
                    console.error('Error getting user location:', error);
                  }
                );
                service.getAllTickets(copy.user.id).then(res => res.data)
                  .then(tickets => {
                    copy.user.tickets = tickets.tickets
                    setData(copy)
                  })
              })
          }, 5000);
          setMyInterval(myinterval)
        })
        .catch(err => {
          if (err.status == 500)
            alert("Błędny login lub hasło")
          else
            alert(err.message)
        })
    else
      alert("Login i Hasło są wymagane")
  }
  return (
    <div>
      {data.user.username &&
        <div className="w-full h-screen">
          <Bar data={data} setData={setData} interval={interval} />
          <Map stateData={data} />
        </div>
      }
      {!data.user.username &&
        <div className="w-screen h-screen bg-gray-300">
          <div className="absolute w-4/5 h-8/20 bottom-60 left-1/10 bg-gray-200 rounded-2xl border border-black text-xl">
            <input onChange={(e) => { setLogin(e.target.value) }} id="login" placeholder={"Login"} className="p-3 bg-gray-100  rounded-full border border-red-500 mt-14 m-4 w-9/10" />
            <input onChange={(e) => { setPassword(e.target.value) }} id="password" placeholder={"Password"} className="p-3 bg-gray-100 rounded-full border border-red-500 m-4 w-9/10 " />
            <button onClick={handleLogin} className="bg-red-500 text-white text-3xl px-6 py-3 rounded-2xl w-1/2 left-1/4 absolute bottom-10"> Log in</button>
          </div>
        </div>
      }
    </div>
  );
}

export default App;
