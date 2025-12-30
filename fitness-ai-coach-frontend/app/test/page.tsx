'use client'
import axios from 'axios'
import React, { useEffect } from 'react'

const Test = () => {
  useEffect(() => {
    async function abc() {
      // FIX: Changed 'let' to 'const' because these are never reassigned
      const token = localStorage.getItem("token")
      const response = await axios.post(
        "http://127.0.0.1:8000/feedback/",
        {
          plan_id: 1234567,
          ratings: " feedbackString "
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
  }, [])

  return (
    <div>
      {/* Cleaned up empty div */}
      <p>Test Page Loaded</p>
    </div>
  )
}

export default Test
