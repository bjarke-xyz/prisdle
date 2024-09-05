import React from 'react';

interface FeedbackProps {
    feedback: string;
}

const Feedback: React.FC<FeedbackProps> = ({ feedback }) => {
    return (
        <div className="mt-4">
            <p className="text-xl text-gray-700">{feedback}</p>
        </div>
    );
};

export default Feedback;
