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
  const [totalUsers, setTotalUsers] = useState(0); // State for total users
  const [userName, setUserName] = useState("User"); // Default to "User"

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/auth/active-users"
        );
        console.log("Active Users Response:", response.data);
        setActiveUsers(response.data.activeUsers);
      } catch (error) {
        console.error(
          "Error fetching active users:",
          error.response ? error.response.data : error.message
        );
      }
    };

    const fetchNewUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/auth/new-signups"
        );
        console.log("New Users Response:", response.data);
        setNewUsers(response.data.newUsers);
      } catch (error) {
        console.error(
          "Error fetching new users:",
          error.response ? error.response.data : error.message
        );
      }
    };

    const fetchTotalUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/auth/total-users"
        );
        console.log("Total Users Response:", response.data);
        setTotalUsers(response.data.totalUsers);
      } catch (error) {
        console.error(
          "Error fetching total users:",
          error.response ? error.response.data : error.message
        );
      }
    };

    const fetchUserName = async () => {
      const userId = 1; // Replace with actual user ID, if available in your context
      try {
        const response = await axios.post(
          "http://localhost:5000/auth/logged-in-user-name",
          { id: userId }
        );
        console.log("User Name Response:", response.data);
        setUserName(response.data.name);
      } catch (error) {
        console.error(
          "Error fetching user name:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchActiveUsers();
    fetchNewUsers();
    fetchTotalUsers();
    fetchUserName(); // Fetch the user name

    const interval = setInterval(() => {
      fetchActiveUsers();
      fetchNewUsers();
      fetchTotalUsers();
      fetchUserName(); // Fetch the user name periodically if necessary
    }, 60000);

    return () => clearInterval(interval);
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

  console.log("Rendering Dashboard...");
  return (
    <div className="flex bg-blue-200 min-h-screen">
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

        <div className="p-4 rounded-md shadow-sm mt-16 bg-white">
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
