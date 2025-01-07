import React from 'react';

function Garden({ tasks }) {
    return (
        <div className="garden">
            {tasks.map((task) => (
                <div key={task._id} className="plant">
                    🌱 {task.description}
                </div>
            ))}
        </div>
    );
}

export default Garden;
