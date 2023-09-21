import React from 'react';
import { Select } from '@chakra-ui/react';

function TelosTestnetNftSelection({onCollectionChange}) {
    const collections = [
        { name: 'IBUNY', address: '0xDAd5Ce751d85CB93D578dB2C60527DB4F9Eb05B8' },
        { name: 'Vote', address: '0xDAd5Ce751d85CB93D578dB2C60527DB4F9Eb05B8' },
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

export default TelosTestnetNftSelection;
