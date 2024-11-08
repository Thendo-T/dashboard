import Headers from "../Utils/header";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  UserIcon,
  CurrencyDollarIcon,
  UsersIcon,
  NewspaperIcon,
} from "@heroicons/react/16/solid";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [activeUsers, setActiveUsers] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0); 
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auth/active-users");
        setActiveUsers(response.data.activeUsers);
      } catch (error) {
        console.error("Error fetching active users:", error.message);
      }
    };

    const fetchNewUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auth/new-signups");
        setNewUsers(response.data.newUsers);
      } catch (error) {
        console.error("Error fetching new users:", error.message);
      }
    };

    const fetchTotalUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auth/total-users");
        setTotalUsers(response.data.totalUsers);
      } catch (error) {
        console.error("Error fetching total users:", error.message);
      }
    };

    const fetchUserName = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auth/logged-in-user-name", {
          params: { id: 33 } // Assuming a user ID is available, replace with the actual logged-in user ID
        });
        setUserName(response.data.name);
      } catch (error) {
        console.error("Error fetching user name:", error.message);
      }
    };
    

    fetchActiveUsers();
    fetchNewUsers();
    fetchTotalUsers();
    fetchUserName();
  }, []);
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Revenue (in USD)",
        data: [5000, 7000, 8000, 5500, 9000, 11000, 13000],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };
  return (
    <div className="flex bg-white min-h-screen">
      <Headers />
      <div className="ml-16 p-6 w-full" style={{ width: "calc(100% - 4rem)" }}>
        <h2 className="text-3xl font-bold mb-4">Good Day, {userName}</h2>
        <p className="text-md mb-4">Welcome to the User Analysis Dashboard</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="p-4 bg-blue-600 text-white rounded-lg shadow-md flex flex-col justify-between">
            <div className="flex items-center mb-2">
              <UserIcon className="h-6 w-6 mr-2" />
              <h3 className="text-xl font-semibold">Total Users</h3>
            </div>
            <p className="text-2xl">{totalUsers}</p>
          </div>
          <div className="p-4 bg-green-600 text-white rounded-lg shadow-md flex flex-col justify-between">
            <div className="flex items-center mb-2">
              <CurrencyDollarIcon className="h-6 w-6 mr-2" />
              <h3 className="text-xl font-semibold">Monthly Revenue</h3>
            </div>
            <p className="text-2xl">$13,000</p>
          </div>
          <div className="p-4 bg-yellow-600 text-white rounded-lg shadow-md flex flex-col justify-between">
            <div className="flex items-center mb-2">
              <UsersIcon className="h-6 w-6 mr-2" />
              <h3 className="text-xl font-semibold">Active Sessions</h3>
            </div>
            <p className="text-2xl">{activeUsers}</p>
          </div>
          <div className="p-4 bg-purple-600 text-white rounded-lg shadow-md flex flex-col justify-between">
            <div className="flex items-center mb-2">
              <NewspaperIcon className="h-6 w-6 mr-2" />
              <h3 className="text-xl font-semibold">New Signups</h3>
            </div>
            <p className="text-2xl">{newUsers}</p>
          </div>
        </div>

        <div className="p-4 rounded-md shadow-sm mt-16 bg-slate-100">
          <h3 className="text-lg font-semibold mb-2">Monthly Revenue Trend</h3>
          <Line
            data={lineData}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
            height={100} // Adjust this value to control the chart height
          />
        </div>
      </div>
    </div>
  );
}
