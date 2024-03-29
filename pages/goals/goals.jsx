// goals.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import PicAndHeadlines from "@/components/UI/picAndheadline";
import style from "../../styles/generalStyle.module.css";
import { useRouter } from "next/router";
import LoadingSpinner from "@/components/loadingSpinner";
import useCustomQuery from "@/utils/useCustomQuery";
import { userStore } from "@/stores/userStore";
import Nevigation from "@/components/nevigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import PatientRow from "@/components/UI/patientRow";

export default function Goals() {
  const router = useRouter();
  const [goals, setGoals] = useState([]);
  const [name, setName] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { patientId } = router.query;
  const { type, id } = userStore.getState();
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const handleAdd = () => {
    const currentDate = new Date().toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Asia/Jerusalem",
    });

    router.push(
      `/goals/specificGoal?time=${encodeURIComponent(
        currentDate
      )}&patientId=${encodeURIComponent(patientId)}`
    );
  };

  useCustomQuery(() => {
    // Keep track of completion status for each fetch operation
    let isGoalsLoaded = false;
    let isPatientNameLoaded = false;

    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/goals/goals", {
          params: { patient_id: patientId },
        });
        setGoals(data);
        isGoalsLoaded = true;
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    async function getPatientName() {
      try {
        if (router.query.patientId) {
          const response = await fetch(
            `../../api/lessonsSummaries/patientIdToName?patient_id=${encodeURIComponent(
              router.query.patientId
            )}`
          );
          const data = await response.json();
          setName(data.name);
          isPatientNameLoaded = true;
        }
      } catch (error) {
        console.error("Error fetching patient name:", error);
      }
    }

    async function checkPremission() {
      try {
        if (type === 1) {
          // Fetch comments for the specific lessonId
          const response = await axios.get(`/api/login/childrens?id=${id}`);
          let isOk = false;

          for (let i = 0; i < response.data.length && !isOk; i++) {
            if (response.data[i].id == patientId) {
              isOk = true;
            }
          }

          if (isOk == false) {
            router.back();
          }
        }
      } catch (error) {
        console.error("Error checking permission:", error);
      }
    }

    checkPremission();

    // Use Promise.all to wait for all asynchronous operations to complete
    Promise.all([fetchData(), getPatientName()])
      .then(() => {
        // Set isLoading to false when all data is fetched
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error during data fetching:", error);
        setIsLoading(false);
      });
  }, []);

  // Handle function to navigate to the specificSummaryWatch page with event.id
  const handleRowClick = (goalId, index) => {
    router.push(
      `/goals/specificGoalWatch?goalId=${encodeURIComponent(
        goalId
      )}&index=${encodeURIComponent(index + 1)}`
    );
  };

  const handleGoBack = () => {
    router.push(`/personalMenu?patientId=${encodeURIComponent(patientId)}`);
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    if (isSmallScreen) {
      // Display date in "dd/mm" format for small screens
      const [day, month] = date.split("-");
      return `${day}-${month}`;
    } else {
      // Keep the original date format for larger screens
      return date;
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />} {/* Use LoadingSpinner component */}
      <div className={style.leftStyle}>
        <Button onClick={handleGoBack}> חזור &gt;</Button>
      </div>
      <PicAndHeadlines
        pictureName="goal"
        picturePath="../goal.png"
        primaryHeadline="מטרות"
        secondaryHeadline={name ? name : "No Name Data"}
      />
      <div className={style.addButtonStyle}>
        <Button onClick={handleAdd}>+ הוספת מטרה</Button>
      </div>
      {goals.length > 0 ? (
        goals.map((goal, index) => (
          <div
            key={goal.id}
            className={style.rowWrapper}
            onClick={() => handleRowClick(goal.id, index)}
          >
            <PatientRow
              date={`${index + 1}`}
              time={formatDate(goal.setting_date)}
              name={goal.field}
              nameWidth={100}
              lesson={goal.status}
            />
          </div>
        ))
      ) : (
        <div style={{ textAlign: "center", marginTop: "20px" }}>אין מטרות</div>
      )}
      <Nevigation patientId={patientId} screen="goals" />
    </>
  );
}
