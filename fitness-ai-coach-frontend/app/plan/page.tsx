'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaDumbbell, FaUtensils, FaRunning, FaRegClock } from 'react-icons/fa';
import { GiMuscleUp } from 'react-icons/gi';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  description: string;
}

interface WorkoutPlan {
  warmup: {
    duration: string;
    type: string;
    description: string;
  };
  workout: {
    focus: string;
    exercises: Exercise[];
  };
  cooldown: {
    duration: string;
    type: string;
    description: string;
  };
}

interface Meal {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string;
}

interface Snack {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string;
}

interface DietPlan {
  meals: Meal[];
  snacks: Snack[];
  notes: string;
}

interface PlanData {
  message: string;
  workout_plan: {
    userId: string;
    date: string;
    day: string;
    dayType: string;
    plan: WorkoutPlan;
  };
  diet_plan: {
    diet_plan: DietPlan;
  };
  plan_id:string
}

const PlanPage = () => {
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [needsFeedback, setNeedsFeedback] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetchPlan = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get<PlanData>('https://ahsan462agk-fitness-ai-coach.hf.space/ai-generated-plan/generate-ai-plan', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const planId = response.data.plan_id
        setCurrentPlanId(planId);
        
        const existingFeedback = localStorage.getItem(`feedback-${planId}`);
        setNeedsFeedback(!existingFeedback);

        localStorage.setItem('currentPlan', JSON.stringify({
          planId,
          userId: response.data.workout_plan.userId,
          data: response.data
        }));

        setPlanData(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error("You are unauthorized, Please login again!");
          localStorage.removeItem("token");
          router.push("/login");
        }
        setError('Failed to fetch plan data');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchPlan();
  }, []);

  
const handleFeedbackSubmit = async (feedbackString: string) => {
  try {
    const token = localStorage.getItem("token");
    
    if (!currentPlanId) {
      toast.error('Plan ID is missing');
      return;
    }

    const response = await axios.post(
      "https://ahsan462agk-fitness-ai-coach.hf.space/feedback/",
      { 
        plan_id: currentPlanId,
        ratings: feedbackString 
      },
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json' 
        }
      }
    );

    if (response.status === 200 || response.status === 201) {
      localStorage.setItem(`feedback-${currentPlanId}`, feedbackString);
      toast.success('Feedback submitted successfully!');
      setNeedsFeedback(false);

      // Generate new plan
      const newPlanResponse = await axios.get<PlanData>('https://ahsan462agk-fitness-ai-coach.hf.space/ai-generated-plan/generate-ai-plan', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update plan data with new response
      setPlanData(newPlanResponse.data);
      
      // Update plan ID if it exists in the response
      if (newPlanResponse.data.plan_id) {
        setCurrentPlanId(newPlanResponse.data.plan_id);
        
        localStorage.setItem('currentPlan', JSON.stringify({
          planId: newPlanResponse.data.plan_id,
          data: newPlanResponse.data
        }));
      }
    } else {
      throw new Error('Unexpected response status');
    }
  } catch (error) {
    console.error('Feedback submission error:', error);
    toast.error(error.response?.data?.detail || 'Failed to submit feedback');
  }
};

  // if (loading) return <div className="p-8 text-center text-gray-600">Loading your plan...</div>;
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
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-2">
                <GiMuscleUp className="text-4xl" />
                {planData?.workout_plan.dayType} Plan for {planData?.workout_plan.day}
              </h1>
              <p className="text-gray-600 mt-2">
                {planData?.workout_plan.date && 
                  new Date(planData.workout_plan.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                }
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Plan ID:</p>
              <p className="text-sm font-mono text-gray-600">{currentPlanId}</p>
            </div>
          </div>
          <p className="text-gray-600 mt-2">{planData?.message}</p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-600">
            <FaDumbbell /> Workout Plan
          </h2>
          
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaRunning /> Warmup
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoCard title="Duration" value={planData?.workout_plan.plan.warmup.duration} />
              <InfoCard title="Type" value={planData?.workout_plan.plan.warmup.type} />
              <div className="md:col-span-3">
                <p className="text-gray-600">{planData?.workout_plan.plan.warmup.description}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaDumbbell /> Exercises ({planData?.workout_plan.plan.workout.focus})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {planData?.workout_plan.plan.workout.exercises.map((exercise, index) => (
                <ExerciseCard key={index} exercise={exercise} />
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaRegClock /> Cooldown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoCard title="Duration" value={planData?.workout_plan.plan.cooldown.duration} />
              <InfoCard title="Type" value={planData?.workout_plan.plan.cooldown.type} />
              <div className="md:col-span-3">
                <p className="text-gray-600">{planData?.workout_plan.plan.cooldown.description}</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-green-600">
            <FaUtensils /> Diet Plan
          </h2>
          
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h3 className="text-xl font-semibold mb-4">Daily Meals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {planData?.diet_plan.diet_plan.meals.map((meal, index) => (
                <MealCard key={index} meal={meal} />
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h3 className="text-xl font-semibold mb-4">Snacks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {planData?.diet_plan.diet_plan.snacks.map((snack, index) => (
                <MealCard key={index} meal={snack} />
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Important Notes</h3>
            <p className="whitespace-pre-line text-gray-600">
              {planData?.diet_plan.diet_plan.notes}
            </p>
          </div>
        </section>

        {needsFeedback && (
          <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-purple-600">
              Plan Feedback
            </h2>
            <FeedbackForm onSubmit={handleFeedbackSubmit} />
          </div>
        )}
      </div>
    </div>
  );
};

const FeedbackForm = ({ onSubmit }: { onSubmit: (feedback: string) => Promise<void> }) => {
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [comments, setComments] = useState('');

  const handleSubmit = async () => {
    if (!difficulty) return;
    
    let feedbackString = `Difficulty: ${difficulty}`;
    if (comments.trim()) {
      feedbackString += ` | Comments: ${comments}`;
    }
    
    await onSubmit(feedbackString);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Difficulty Level *</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {['too-easy', 'balanced', 'too-hard'].map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`p-4 rounded-lg transition-all ${
                difficulty === level
                  ? 'bg-purple-600 text-white ring-2 ring-purple-300'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {level.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Additional Comments (optional)</label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows={4}
          placeholder="Any additional feedback..."
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!difficulty}
        className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 transition-colors"
      >
        Submit Feedback & Generate Next Plan
      </button>
    </div>
  );
};

const InfoCard = ({ title, value }: { title: string; value?: string }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h4 className="text-sm font-semibold text-gray-500">{title}</h4>
    <p className="text-lg font-medium">{value || 'N/A'}</p>
  </div>
);

const ExerciseCard = ({ exercise }: { exercise: Exercise }) => (
  <div className="bg-blue-50 p-4 rounded-lg">
    <h4 className="text-lg font-semibold mb-2">{exercise.name}</h4>
    <div className="grid grid-cols-3 gap-2 mb-3">
      <InfoCard title="Sets" value={exercise.sets.toString()} />
      <InfoCard title="Reps" value={exercise.reps} />
      <InfoCard title="Rest" value={exercise.rest} />
    </div>
    <p className="text-gray-600 text-sm">{exercise.description}</p>
  </div>
);

const MealCard = ({ meal }: { meal: Meal | Snack }) => (
  <div className="bg-green-50 p-4 rounded-lg">
    <h4 className="text-lg font-semibold mb-2">{meal.name}</h4>
    <p className="text-gray-600 mb-3">{meal.description}</p>
    
    <h5 className="font-semibold text-sm mb-1">Ingredients:</h5>
    <ul className="list-disc list-inside mb-3">
      {meal.ingredients.map((ingredient, i) => (
        <li key={i} className="text-sm text-gray-600">{ingredient}</li>
      ))}
    </ul>
    
    <h5 className="font-semibold text-sm mb-1">Instructions:</h5>
    <p className="text-gray-600 text-sm">{meal.instructions}</p>
  </div>
);

export default PlanPage;
