'use client';


import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiUser, FiHeart, FiCalendar, FiTarget, FiActivity, FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
// import { GiWeightLifting } from 'react-icons/gi';

interface UserData {
  user_id: string;
  name: string;
  age: number;
  gender: string;
  current_weight: string;
  target_weight: string;
  expertise: string; 
  goals: string[];
  rest_days: string[];
  work_frequency: number;
  current_day: string;
}

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const Router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let token = localStorage.getItem('token');
        // token= "dsadsad"
        const response = await axios.get<UserData>('https://ahsan462agk-fitness-ai-coach.hf.space/users/profile', { // Added type parameter
          headers: {
            Authorization: `Bearer ${token}`,}
        });
        console.log(response);
        
        setUserData(response.data);
      } catch (err:any) {
        
        if(err.response.status==401){
          Router.push('/login');
        }
        

        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return (
    <div className='flex items-center justify-center h-[100vh] w-full bg-white'>
    <svg
      width="100"
      height="100"
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke="#00b4d8"
        // stroke="#3498db"
        strokeWidth="5"
        fill="none"
        strokeDasharray="100"
        strokeDashoffset="50"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  </div>
  );
  if (error) return <div className="p-4 text-center h-[80vh] text-red-500">{error}</div>;
  if (!userData) return <div className="p-4 h-[80vh] text-center">No user data found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-2">
            <FiUser className="inline-block" /> {userData.name}
          </h1>
          <div className="flex gap-4">
          <button 
            onClick={() => {
             Router.push("/plan")
              toast.success("Plan generated successfully!");
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <FiActivity /> Ai Generated Plan
          </button>

          <button onClick={
            () => {
              localStorage.removeItem('token');
              Router.push('/login');
              toast.success("logout successful");
            }
          } className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2">
            <FiLogOut /> Logout
          </button>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            icon={<FiActivity className="w-6 h-6" />} 
            title="Current Weight"
            value={userData.current_weight}
          />
          <StatCard 
            icon={<FiTarget className="w-6 h-6" />} 
            title="Target Weight"
            value={userData.target_weight}
          />
          {/* <StatCard 
            icon={<GiWeightLifting className="w-6 h-6" />} 
            title="Workout Days"
            value={`${userData.work_frequency}/week`}
          /> */}
          <StatCard 
            icon={<FiHeart className="w-6 h-6" />} 
            title="Fitness Level"
            value={userData.expertise}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Goals Section */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiTarget /> Fitness Goals
            </h2>
            <ul className="space-y-3">
              {userData.goals.map((goal, index) => (
                <li key={index} className="flex items-center bg-blue-50 p-3 rounded-lg">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  {goal}
                </li>
              ))}
            </ul>
          </div>

          {/* Schedule Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiCalendar /> Today's Status
            </h2>
            <div className={`p-4 rounded-lg text-center ${
              userData.rest_days.includes(userData.current_day) 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {userData.rest_days.includes(userData.current_day)
                ? 'Rest Day'
                : 'Workout Day'}
            </div>
            
            <h3 className="text-lg font-medium mt-6 mb-3">Rest Days</h3>
            <div className="flex flex-wrap gap-2">
              {userData.rest_days.map(day => (
                <span 
                  key={day}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value?: string;
}

const StatCard = ({ icon, title, value }: StatCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
    <div className="bg-blue-100 p-3 rounded-lg text-blue-600">{icon}</div>
    <div>
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-semibold">{value || 'N/A'}</p>
    </div>
  </div>
);

export default Dashboard;
