import React, { useEffect, useState } from 'react';
import './Plant.css';
import plantGif from '../assets/plant.gif';

function Plant({ taskCount }) {

    if (taskCount === 0) {
        return null; // Do not render anything if task list is empty
    }

    const maxTasks = 20; // The number of tasks after which the plant stops growing
    const minScale = 0.5;
    const maxScale = 1;

    // Ensure taskCount doesn't exceed maxTasks
    const effectiveTaskCount = Math.min(taskCount, maxTasks);

    // Calculate scale factor
    const scale =
        minScale + ((maxScale - minScale) * (effectiveTaskCount - 1)) / (maxTasks - 1);

    return (
        <div className="plant-container">
            <img
                src={plantGif}
                alt="Growing Plant"
                className="plant-image"
                style={{ transform: `scale(${scale})` }}
            />
        </div>
    );
}

export default Plant;
