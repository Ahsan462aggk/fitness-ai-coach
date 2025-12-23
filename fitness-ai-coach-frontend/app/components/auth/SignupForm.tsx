"use client";
// REMOVED: import Link from "next/link"; (This was causing the error)
import { FC, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const RegistrationForm: FC = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("160");
  const [targetWeight, setTargetWeight] = useState("60");
  const [currentWeight, setCurrentWeight] = useState("70");
  const [expertise, setExpertise] = useState("");
  const [equipment, setEquipment] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [workFrequency, setWorkFrequency] = useState("");
  const [restDays, setRestDays] = useState<string[]>([]);

  const [showPasswordMismatchPopup, setShowPasswordMismatchPopup] = useState(false);
  const [showEmailInvalidPopup, setShowEmailInvalidPopup] = useState(false);
  
  // Best practice: use lowercase 'router'
  const router = useRouter();

  const handleNextStep = () => {
    if (step === 1 && name && gender && age) {
      setStep(2);
    } else if (step === 2 && email && password && confirmPassword) {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(email)) {
        setShowEmailInvalidPopup(true);
        return;
      }
      if (password !== confirmPassword) {
        setShowPasswordMismatchPopup(true);
        return;
      }
      setStep(3);
    } else if (step === 3 && height && targetWeight && currentWeight) {
      setStep(4);
    } else if (step === 4 && expertise && equipment) {
      setStep(5);
    } else if (step === 5 && goals.length > 0 && workFrequency && restDays.length > 0) {
      setStep(6);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      email,
      name,
      age: Number(age),
      gender,
      height,
      target_weight: targetWeight,
      current_weight: currentWeight,
      expertise,
      equipment,
      goals,
      work_frequency: Number(workFrequency),
      rest_days: restDays,
      password,
    };

    try {
      const response = await axios.post("https://ahsan462agk-fitness-ai-coach.hf.space/users/signup", payload);
      console.log("Response from API:", response.data);
      toast.success("Registration successful! Redirecting to login page...");
      router.push("/login");
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("An error occurred during registration. Please try again.");
    }
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setGoals([...goals, e.target.value]);
    } else {
      setGoals(goals.filter((goal) => goal !== e.target.value));
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg transition-all duration-500 transform hover:scale-105">
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          {step === 1
            ? "Personal Details"
            : step === 2
            ? "Account Setup"
            : step === 3
            ? "Body Metrics"
            : step === 4
            ? "Fitness Profile"
            : step === 5
            ? "Fitness Goals"
            : "Confirmation"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Male", "Female", "Other", "Prefer not to say"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all ${
                        gender === g ? "bg-purple-500 text-white shadow-lg" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your age"
                  min="12"
                  max="100"
                />
              </div>
            </div>
          )}

          {/* Step 2: Account Setup */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          {/* Step 3: Body Metrics */}
          {step === 3 && (
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Height: <span className="text-purple-600 font-bold ml-2">{height} cm</span>
                </label>
                <input
                  type="range"
                  min="140"
                  max="220"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>140cm</span>
                  <span>220cm</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Target Weight: <span className="text-purple-600 font-bold ml-2">{targetWeight} kg</span>
                </label>
                <input
                  type="range"
                  min="40"
                  max="150"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>40kg</span>
                  <span>150kg</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Current Weight: <span className="text-purple-600 font-bold ml-2">{currentWeight} kg</span>
                </label>
                <input
                  type="range"
                  min="40"
                  max="150"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>40kg</span>
                  <span>150kg</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Fitness Profile */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expertise Level</label>
                <div className="flex gap-4">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setExpertise(level)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all ${
                        expertise === level ? "bg-purple-500 text-white shadow-lg" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Equipment</label>
                <div className="flex gap-4">
                  {["None", "Dumbbells", "Barbell", "Resistance Bands", "Other"].map((equip) => (
                    <button
                      key={equip}
                      type="button"
                      onClick={() => setEquipment(equip)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all ${
                        equipment === equip ? "bg-purple-500 text-white shadow-lg" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {equip}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Fitness Goals */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goals</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Lose Weight", "Build Muscle", "Increase Endurance", "Improve Flexibility", "Other"].map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <input type="checkbox" value={goal} onChange={handleGoalChange} className="rounded-lg" />
                      <span>{goal}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Workout Frequency</label>
                <input
                  type="number"
                  value={workFrequency}
                  onChange={(e) => setWorkFrequency(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Number of days per week"
                  min="1"
                  max="7"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rest Days</label>
                <div className="grid grid-cols-3 gap-4">
                  {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        if (restDays.includes(day)) {
                          setRestDays(restDays.filter((d) => d !== day));
                        } else {
                          setRestDays([...restDays, day]);
                        }
                      }}
                      className={`p-3 rounded-xl text-sm font-medium transition-all ${
                        restDays.includes(day) ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Step */}
          {step === 6 && (
            <div className="text-center space-y-4">
              <p className="text-lg">Your registration is complete!</p>
              <button
                type="submit"
                className="py-3 px-6 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-all"
              >
                Confirm and Start Training
              </button>
            </div>
          )}

          {/* Navigation */}
          {step !== 6 && (
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="py-3 px-6 bg-gray-200 text-gray-600 rounded-lg shadow-md hover:bg-gray-300 transition-all"
                >
                  Back
                </button>
              )}

              <button
                type="button"
                onClick={handleNextStep}
                className="py-3 px-6 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-all"
              >
                {step === 5 ? "Finish" : "Next"}
              </button>
            </div>
          )}
        </form>

        {/* Popups */}
        {showPasswordMismatchPopup && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl shadow-xl">
              <p className="text-red-500">Passwords do not match!</p>
              <button onClick={() => setShowPasswordMismatchPopup(false)} className="mt-4 py-2 px-4 bg-red-600 text-white rounded-lg">
                Close
              </button>
            </div>
          </div>
        )}

        {showEmailInvalidPopup && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl shadow-xl">
              <p className="text-red-500">Invalid email address!</p>
              <button onClick={() => setShowEmailInvalidPopup(false)} className="mt-4 py-2 px-4 bg-red-600 text-white rounded-lg">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationForm;
