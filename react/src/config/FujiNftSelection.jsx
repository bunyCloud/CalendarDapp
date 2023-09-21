import React from 'react';
import { Select } from '@chakra-ui/react';

function FujiNftSelection({onCollectionChange}) {
    const collections = [
        { name: 'IBUNY', address: '0x39c47F7469b155eBCc9D7319d091b21d203bf836' },
       
        // Add the rest of the collections here...
    ];

    return (
        <Select variant={'flushed'} size="sm" placeholder="Select collection" onChange={(e) => onCollectionChange(e.target.value)}>
            {collections.map((collection, index) => (
                <option key={index} value={collection.address}>
                    {collection.name}
                </option>
            ))}
        </Select>
    );
}

export default FujiNftSelection;
