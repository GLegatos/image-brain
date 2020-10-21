import React from 'react';
import './SubjectBox.css'

const SubjectBox = ({ subject }) => {
    return (
        <div>
            <p className='f3'>
                {'What\'s in the image?'}
            </p>
            <div className='f3 center'>
                {subject}
            </div>
            {/* <div>
                <p>Is this correct?</p>
                <button>Yes</button>
                <button onClick={() => onSubmitAgain() }>Try again</button>
            </div>     */}
        </div>
    )
}

export default SubjectBox;