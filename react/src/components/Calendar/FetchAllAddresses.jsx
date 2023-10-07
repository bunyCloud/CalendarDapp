import React from 'react';
import FetchAllAdminAddresses from './FetchAllAdminAddresses';
import FetchAllGuestAddresses from './FetchAllGuestAddresses';
import FetchAllMemberAddresses from './FetchAllMemberAddresses';

const FetchAllAddresses = () => {
  return (
    <div style={{ marginTop: '6px', borderTop: '1px solid #d4cacd' }}>
      
      <FetchAllMemberAddresses />
      <FetchAllGuestAddresses />
    </div>
  );
};

export default FetchAllAddresses;
