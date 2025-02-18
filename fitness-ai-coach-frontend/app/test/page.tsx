'use client'
import axios from 'axios'
import React, { useEffect } from 'react'

const Test = () => {
    useEffect(()=>{

        async function abc(){

            let token = localStorage.getItem("token")
            let response=  await axios.post(
                "http://127.0.0.1:8000/feedback/",
                { 
                  plan_id: 1234567,  // Convert userId to number
                  ratings:" feedbackString "
                },
                {
                  headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                  }
                }
              );
            console.log(response?.data);
        }
        abc()
},[])

  return (
    <div>
<div>
    {/* {response?.data.plan_id} */}
</div>
    </div>
  )
}

export default Test