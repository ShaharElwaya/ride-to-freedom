import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { Button, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers";
import PicAndHeadlines from '@/components/UI/picAndheadline';
import GoalRow from '@/components/UI/goalRow';
import style from '../../styles/summariesPatientLessons.module.css';
import TextAreaComponent from '@/components/UI/textAreaComponent';
import CustomizedDialogs from '@/components/dialog';
import { useRouter } from 'next/router';

export default function SpecificGoalWatch() {
    const [goalsDetails, setGoalsDetails] = useState({
        patient_id: '',
        patient_name: '',
        summary: '',
        field_id: '',
        field_name: '',
        status_id: '',
        status_name: '',
        destination_date: '',
        setting_date: ''
    });
    const router = useRouter();
    const { goalId, index } = router.query;

    // Inside your component function
    const [summary, setSummary] = useState('');
    const [fieldType, setFieldType] = useState('');
    const [statusType, setStatusType] = useState('');
    const [patientId, setPatientIdType] = useState('');
    const [settingDate, setDate] = useState(null);
    const [destinationDate, setDestinationDate] = useState(null);
    const [statusesOptions, setStatusesOptions] = useState([]);
    const [fieldsOptions, setFieldsOptions] = useState([]);
    const [dialogError, setDialogError] = useState('');
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleCloseDialog = () => {
        setDialogOpen(false);

        if (saveSuccess) {
            router.push(`/goals/goals?patientId=${encodeURIComponent(patientId)}`);
        }
    };

    const handleGoBack = () => {
        router.back();
    };

    const handleClickSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!summary.trim()) {
                setDialogError("המטרה אינה יכולה להיות ריקה");
                setDialogOpen(true);
                return;
            }
            else if (!fieldType) {
                setDialogError("יש לבחור תחום למטרה");
                setDialogOpen(true);
                return;
            }
            else if (!statusType) {
                setDialogError("יש לבחור סטטוס למטרה");
                setDialogOpen(true);
                return;
            }
            else if (!destinationDate) {
                setDialogError("יש לבחור תאריך יעד רצוי");
                setDialogOpen(true);
                return;
            }
            const destinationDateFormat = destinationDate
                ? dayjs(destinationDate).format("YYYY-MM-DD")
                : '';

            const date = settingDate
                ? dayjs(settingDate).format("YYYY-MM-DD")
                : '';

            const res = await axios.post("../api/goals/specficGoalEdit", {
                date,
                summary,
                goalId,
                fieldType,
                destinationDateFormat,
                statusType
            });
            setDialogError('');
            setSaveSuccess(true);
            setDialogOpen(true);
        } catch (err) {
            let errorMessage = "We have a problem, try again";

            if (err.response && err.response.data && err.response.data.error) {
                errorMessage = `Add lesson failed: ${err.response.data.error}`;
            }

            setSaveSuccess(false);
            setDialogOpen(true);
            setDialogError(errorMessage);
        }
    };

    const selectStyle = {
        width: '244px',
    };

    useEffect(() => {
        // Fetch lesson details based on lessonId from the URL
        const fetchGoalsDetails = async () => {
            try {
                const response = await axios.get("/api/goals/specificGoalWatch", {
                    params: { goal_id: goalId },
                });
                const goalDetailsData = response.data;

                setGoalsDetails(goalDetailsData);
                setSummary(goalDetailsData.summary);
                setFieldType(goalDetailsData.field_id);
                setStatusType(goalDetailsData.status_id);
                setDestinationDate(goalDetailsData.destination_date);
                setPatientIdType(goalDetailsData.patient_id);
                setDate(goalDetailsData.setting_date);
            } catch (error) {
                console.error('Error fetching lesson details:', error);
                // Handle error as needed
            }
        };

        async function fetchStatusesOptions() {
            try {
                const response = await fetch('../api/goals/statusesOptions');
                const data = await response.json();
                setStatusesOptions(data);
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        }

        async function fetchFieldsOptions() {
            try {
                const response = await fetch('../api/goals/fieldsOptions');
                const data = await response.json();
                setFieldsOptions(data); // Fix the state variable name
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        }

        fetchStatusesOptions();
        fetchFieldsOptions();
        fetchGoalsDetails();
    }, [goalId]);

    const handleSelectChangeField = (event) => {
        setFieldType(event.target.value);
    };

    const handleSelectChangeStatus = (event) => {
        setStatusType(event.target.value);
    };

    return (
        <>
            <div className={style.leftStyle}>
                <Button onClick={handleGoBack}> חזור &gt;</Button>
            </div>

            <PicAndHeadlines
                pictureName="goal"
                picturePath="../goal.png"
                primaryHeadline="קביעת מטרה"
                secondaryHeadline={goalsDetails.patient_name ? goalsDetails.patient_name : 'No Name Data'}
            />
            <GoalRow goal={`מטרה ${index}`} />
            <form>
                <div className={style.container}>
                    <TextAreaComponent
                        placeholderText=" מה המטרה שתרצה להגדיר? *"
                        value={summary}
                        required
                        onChange={(e) => setSummary(e.target.value)}
                    />
                </div>
                <div className={style.container}>
                    <DatePicker
                        label="תאריך קביעת מטרה"
                        sx={{ width: 255 }}
                        value={dayjs(goalsDetails.setting_date)}
                        disabled
                    />
                    <DatePicker
                        label="תאריך יעד רצוי *"
                        sx={{ width: 255 }}
                        value={dayjs(destinationDate)}
                        required
                        onChange={(v) => setDestinationDate(new Date(v))}
                    />
                </div>
                <div className={style.container}>
                    <FormControl className={style.rightStyle}>
                        <InputLabel id="selectUsersTypes">תחום המטרה *</InputLabel>
                        <Select
                            labelId="selectUsersTypes"
                            id="selectUsersTypesId"
                            label="תחום המטרה"
                            value={fieldType}
                            onChange={handleSelectChangeField}
                            required
                            style={selectStyle}
                        >
                            {fieldsOptions.map(option => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.field}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl className={style.rightStyle}>
                        <InputLabel id="selectUsersTypes">סטטוס המטרה *</InputLabel>
                        <Select
                            labelId="selectUsersTypes"
                            id="selectUsersTypesId"
                            label="סטטוס המטרה"
                            value={statusType}
                            onChange={handleSelectChangeStatus}
                            required
                            style={selectStyle}
                        >
                            {statusesOptions.map(option => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.status}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className={style.submitButtonStyle}>
                    <Button type='submit' onClick={handleClickSubmit}>עדכן מטרה</Button>
                </div>
            </form>
            
            <CustomizedDialogs
                title={dialogError ? "הוספת המטרה נכשלה" : "הוספת המטרה הושלמה"}
                text={dialogError ? dialogError : ""}
                closeText="הבנתי"
                open={dialogOpen}
                onClose={handleCloseDialog}
            />
        </>
    );
}