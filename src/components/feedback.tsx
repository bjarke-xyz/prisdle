import React from 'react';

interface FeedbackProps {
    feedback: string[];
}

const Feedback: React.FC<FeedbackProps> = ({ feedback }) => {
    return (
        <div className="my-8">
            {feedback.map((fb) => (
                <p key={`${fb}`} className="text-xl text-center">{fb}</p>
            ))}
        </div>
    );
};

export default Feedback;
