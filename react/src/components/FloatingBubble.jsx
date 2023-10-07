import React from 'react';
import { FloatingBubble, Toast, Button } from 'antd-mobile';
import { AddCircleOutline } from 'antd-mobile-icons';

const FloatingButton = () => {
    const onClick = () => {
        Toast.show('You clicked the button!');
    };

    return (
        <div style={{
            textAlign: 'center',
            padding: '50vh 32px 0',
            
            
        }}>
        
        
            <FloatingBubble style={{
                '--initial-position-bottom': '24px',
                '--initial-position-right': '24px',
                '--edge-distance': '24px',
                '--z-index': 9,
                            }} onClick={onClick}>
                <AddCircleOutline  fontSize={32} />
            </FloatingBubble>
        </div>
    );
};

export default FloatingButton;
