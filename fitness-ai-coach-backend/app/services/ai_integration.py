# app/controllers/ai_controller.py

import json
import os
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from fastapi.encoders import jsonable_encoder

from langchain.chains import LLMChain
from dotenv import load_dotenv
import re
load_dotenv()

def generate_initial_plans(user_profile, previous_plans,previous_feedbacks):
    # Generate workout plan
    workout_prompt = create_workout_prompt()
    workout_plan = generate_plan(user_profile, previous_plans,previous_feedbacks, workout_prompt, plan_type="workout")

    # Generate diet plan
    diet_prompt = create_diet_prompt()
    diet_plan = generate_plan(user_profile, None, None, diet_prompt, plan_type="diet")

    return workout_plan, diet_plan

def create_workout_prompt():
    template = """
You are a certified personal trainer creating a *customized workout plan* for **today** for a client.
You must produce **valid JSON** in the **exact** structure shown below — do not deviate from these keys or nesting.
No extra fields, no personal details, no code blocks, and no explanations.
You must always respond in the form of a valid JSON object that has the following structure and fields:
1. A top-level object with these keys:
   - userId (string)
   - date (string)
   - day (string)
   - dayType (string: either "Workout" or "Rest")
   - plan (object)

2. Inside "plan", there are three nested objects:
   a) "warmup"
      - duration (string, e.g., "5 minutes")
      - type (string, e.g., "Light Cardio")
      - description (string, explanation of what to do)
   b) "workout"
      - focus (string, e.g., "Full Body")
      - exercises (array of objects), where each object has:
         • name (string)
         • sets (integer)
         • reps (string or integer)
         • rest (string)
         • description (string)
   c) "cooldown"
      - duration (string, e.g., "5 minutes")
      - type (string, e.g., "Static Stretching")
      - description (string, explanation of what to do)

When responding:
- Always produce **only** that JSON structure—nothing else.
- Replace any placeholder values (like user IDs or the current date) with the correct text.
- Do not add any extra fields or text outside the JSON.
- Make sure the JSON is valid and well-formed. 

**Client Details:**
- User ID: {user_id}
- Name: {name}
- Age: {age}
- Gender: {gender}
- Height: {height}
- Current Weight: {current_weight}
- Target Weight: {target_weight}
- Expertise Level: {expertise}
- Equipment Available: {equipment}
- Fitness Goals: {goals}
- Work Frequency: {work_frequency} times per week
- Rest Days: {rest_days}
- Current Date: {current_date}
- Current Day: {current_day}

**Previous Plan:**
{previous_plan}

**Previous Feedback:**
{previous_feedback}
- The user's feedback. **If a user marks a workout or exercise as “too hard,” reduce the load/volume for the next session or substitute an alternative, lower-intensity exercise. If marked as “too easy,” increase the intensity or switch to a more advanced exercise option.**

**Important Requirements**:
1. **Check if '{current_day}' is listed in '{rest_days}'.** 
   - If yes, set `"dayType": "Rest"`.  
   - If no, set `"dayType": "Workout"`.
2. If no plan exists for today, create a new plan, taking into account:
   - to achieve the  The user's goals
   - Whether it's a rest day or workout day, but ALWAYS preserve a consistent JSON structure.
     - For rest days, you can list "light exercises" (yoga, stretching, walking) inside the same JSON fields (e.g. "exercises") so the format is consistent.
3. **Do NOT** include any personal details of the user in the output. The output must only be the plan in JSON format.
4. Make sure the JSON is valid (no extra text, code blocks, or commentary).
5. Make sure the output is safe, progressive, and aligned with the users goals.
**Ensure that the workout plan for today is unique and does not repeat any exercises that were included in the previous workout plan for at least 7 days. Use previous feedback to adjust the intensity, volume, or substitute exercises as necessary.**

If a plan for today already exists, just return the **previously generated plan in current date**.
"""
    return PromptTemplate(
        input_variables=[
            "user_id", "name", "age", "gender", "height", "current_weight",
            "target_weight", "expertise", "equipment", "goals", "work_frequency",
            "rest_days", "current_date", "current_day", "previous_plan", "previous_feedback"
        ],
        template=template,
    )
    

def create_diet_prompt():
    template = """
You are a certified nutritionist creating a personalized diet plan for today for a client.

**Client Details:**
- User ID: {user_id}
- Name: {name}
- Age: {age}
- Gender: {gender}
- Height: {height}
- Current Weight: {current_weight}
- Target Weight: {target_weight}
- Fitness Goals: {goals}
- Current Date: {current_date}
- Current Day: {current_day}
- Rest Days: {rest_days}


**Instructions:**
You are a helpful assistant.
You must always respond with valid JSON that has exactly one top-level key called "diet_plan". Inside this "diet_plan" object, you must include the following fields:
1. userId (string)  
   - A unique identifier for the user.

2. date (string)  
   - The date for which the plan applies, in YYYY-MM-DD format.

3. day (string)  
   - The day of the week (e.g., "Monday", "Tuesday", etc.).

4. dayType (string)  
   - Specifies whether it is a "Workout" day or a "Rest" day (or similar).

5. meals (array of objects)  
   - Each object in "meals" represents a meal, with these fields:
     - name (string): e.g., "Breakfast", "Lunch", or "Dinner"
     - description (string): A short summary of the meal
     - ingredients (array of strings): A list of items needed
     - instructions (string): How to prepare or serve this meal

6. snacks (array of objects)  
   - Each object in "snacks" represents a snack, with these fields:
     - name (string): e.g., "Mid-morning Snack"
     - description (string): A short summary of the snack
     - ingredients (array of strings): A list of items needed
     - instructions (string): How to prepare or serve this snack

7. notes (string)  
   - Any additional guidance or reminders (e.g., “Drink plenty of water”).

**Important Requirements**:
- Your response must include *only* the JSON object. Do not add extra text, explanations, or formatting outside the JSON.
- The JSON object must be well-formed and valid.
- Do not remove or rename any of the keys described above.

- Incorporate the client's feedback to adjust meal choices, portion sizes, or any other aspects as needed.
- Ensure the plan supports the client's fitness goals and dietary preferences.
-  Output the daily diet plan in a *consistent JSON format only*. This plan must include:
**Check if '{current_day}' is in '{rest_days}'.**  
- If yes, set `"dayType": "Rest"`.  
- If no, set `"dayType": "Workout"`. 
**Additional Requirements:**
- Your response must include *only* the JSON object. Do not add extra text, explanations, or formatting outside the JSON.
- The JSON object must be well-formed and valid.
- Do not remove or rename any of the keys described above..
- Since no specific dietary preferences are provided, create a balanced and varied diet plan that is unique for each day.
**Previous Plan:**
{previous_plan}
- here you can see the previous diet plan for the user. Use this information to adjust the current plan as needed ensure the previous diet is not repeated at least for 7 days.

Present the plan in JSON format.
""".strip()


    return PromptTemplate(
        input_variables=[
            "user_id", "name", "age", "gender", "height", "current_weight",
            "target_weight", "goals", "current_date", "current_day",
            "previous_plan", "previous_feedback","rest_days"
        ],
        template=template,
    )

def generate_plan(user_profile, previous_plans, previous_feedback, prompt_template, plan_type):
    # Initialize the LLM
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash-exp",
        temperature=0.7,
        openai_api_key=os.getenv("GOOGLE_API_KEY")
    )

    # Create the LLM chain
    chain = LLMChain(
        llm=llm,
        prompt=prompt_template
    )

    # Prepare input data for the LLM
    input_data = user_profile.copy()

    # Include previous plan and feedback
    input_data['previous_plan'] = json.dumps(previous_plans) if previous_plans else 'None'
    input_data['previous_feedback'] = json.dumps(jsonable_encoder(previous_feedback)) if previous_feedback else 'None'
    input_data['plan_type'] = plan_type

    # Run the chain with the prepared input data
    

    # Parse the LLM's response as JSON
    response = chain.invoke(input_data)

    # Extract the text from the response
    if isinstance(response, dict):
        plan_text = response.get('text', '')
    else:
        plan_text = response

    # Remove any code blocks or extra formatting
    # For example, if the text is wrapped in ```json ... ```
    plan_text_clean = re.sub(r'^```json\n', '', plan_text)
    plan_text_clean = re.sub(r'\n```$', '', plan_text_clean)

    # Parse the LLM's response as JSON
    try:
        plan = json.loads(plan_text_clean)
    except json.JSONDecodeError as e:
        # Handle parsing errors
        plan = {"error": f"Failed to parse the plan JSON: {e}", "response_text": plan_text}
    
    return plan
