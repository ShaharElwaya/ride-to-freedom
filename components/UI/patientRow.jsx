// PatientRow.jsx

import React from 'react';
import style from "../../styles/patientRowCss.module.css";
import { Typography, Tooltip } from '@mui/material';

export default function PatientRow({ pictureName, picturePath, date, time, name, lesson, isCenter = false, hasBottomBorder = false, maxTextLengthName, maxTextLengthLesson, nameWidth, lessonWidth }) {
  let needTooltipName = false;
  let needTooltipLesson = false;

  const getFormattedName = (text) => {
    if (text && text.length > maxTextLengthName) {
      needTooltipName = true;
      return `${text.substring(0, maxTextLengthName)}...`;
    }
    return text;
  };

  const getFormattedLesson = (text) => {
    if (text && text.length > maxTextLengthLesson) {
      needTooltipLesson = true;
      return `${text.substring(0, maxTextLengthLesson)}...`;
    }
    return text;
  };

  const renderTooltip = (text, variableName, width) => {
    if (!text) {
      return null; // If the variable is not provided, don't render spaces or tooltips
    }

    let formattedText = "";

    if(variableName === 'name'){
      formattedText = getFormattedName(text);
    }
    else {
      formattedText = getFormattedLesson(text);
    }

    return (
      <Tooltip title={(variableName === 'name' && needTooltipName) || (variableName === 'lesson' && needTooltipLesson) ? text : ""} key={variableName}>
        <div style={{ width: `${width}px`, display:'inline-block', textAlign:'right'}}>
          {formattedText}
        </div>
      </Tooltip>
    );
  };

  return (
    <div className={`${isCenter ? style.containerCenter : style.container} ${hasBottomBorder ? style.bottomBorder : ''}`}>
      <img src={picturePath} alt={pictureName} className={style.pic}/>
      <div className={style.textContainer}>
        <Typography className={style.txt}>
          {date}
          {date && <> &nbsp;</>}
          {time}
          {time && <> &nbsp;</>}
          {renderTooltip(name, 'name', nameWidth)}{/* Set the desired width, e.g., 150px */}
          {name && <>&nbsp;</>}
          {renderTooltip(lesson, 'lesson', lessonWidth)}{/* Set the desired width, e.g., 150px */}
        </Typography>
      </div>
    </div>
  );
}
