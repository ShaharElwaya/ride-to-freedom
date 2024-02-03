import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import PicAndHeadlines from '@/components/UI/picAndheadline';
import GoalRow from '@/components/UI/goalRow';
import style from '../../styles/summariesPatientLessons.module.css';
import { useRouter } from 'next/router';

export default function Goals() {
  const router = useRouter();
  const [goals, setGoals] = useState([]);
  const [name, setName] = useState();
  const { patientId } = router.query;

  const handleAdd = () => {
    const currentDate = new Date().toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "Asia/Jerusalem", // Set the timezone to Israel
      });

    router.push(`/goals/specificGoal?time=${encodeURIComponent(currentDate)}&patientId=${encodeURIComponent(patientId)}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/goals/goals', {
          params: { patient_id: patientId }, // Send patient_id as a query parameter
        });
        setGoals(data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    async function getPatientName() {
      try {
        if (router.query.patientId) {
          const response = await fetch(`../../api/lessonsSummaries/patientIdToName?patient_id=${encodeURIComponent(router.query.patientId)}`);
          const data = await response.json();
          setName(data.name);
        }
      } catch (error) {
        console.error('Error fetching patient name:', error);
      }
    }

    fetchData();
    getPatientName();
  }, []); // Empty dependency array to run the effect only once on mount

  // Handle function to navigate to the specificSummaryWatch page with event.id
  const handleRowClick = (goalId, index) => {
    router.push(`/goals/specificGoalWatch?goalId=${encodeURIComponent(goalId)}&index=${encodeURIComponent(index + 1)}`);
  };

  return (
    <>
      <PicAndHeadlines
        pictureName="goal"
        picturePath="../goal.png"
        primaryHeadline="מטרות"
        secondaryHeadline={name ? name : 'No Name Data'}
      />
      <div className={style.addButtonStyle}>
        <Button onClick={handleAdd}>+ הוספת מטרה</Button>
      </div>
      {goals.map((goal, index) => (
        <div key={goal.id} className={style.rowWrapper} onClick={() => handleRowClick(goal.id, index)}>
          <GoalRow goal={`מטרה ${index + 1}`} isCenter={false}/>
        </div>
      ))}
    </>
  );
}