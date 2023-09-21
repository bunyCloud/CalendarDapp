import { Col, ColorPicker, Row, Space } from 'antd';
import React, { useMemo, useState } from 'react';
export default () => {
  const [colorHex, setColorHex] = useState('#1677ff');
  const [formatHex, setFormatHex] = useState('hex');
  
  
  
  
  const hexString = useMemo(
    () => (typeof colorHex === 'string' ? colorHex : colorHex.toHexString()),
    [colorHex],
  );
  
  return (
    <Space
      direction="vertical"
      size="middle"
      style={{
        display: 'flex',
      }}
    >
      <Row align="middle">
        <Space>
          <Col>
            <ColorPicker
              format={formatHex}
              value={colorHex}
              onChange={setColorHex}
              onFormatChange={setFormatHex}
            />
          </Col>
          <Col>
            HEX: <span>{hexString}</span>
          </Col>
        </Space>
      </Row>
      
    </Space>
  );
};