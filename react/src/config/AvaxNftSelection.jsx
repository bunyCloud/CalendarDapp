import React from 'react';
import { Select } from '@chakra-ui/react';

function AvaxNftSelection({onCollectionChange}) {
    const collections = [
        { name: 'Daniel Arsham: 20 Years', address: '0x02e591665b785cDa7404e005C323c262667d6F54' },
        { name: 'Dragon Crypto Equipment', address: '0xBBC24053734741d5Bc5BA4dB5B56298e76fF27b5' },
        { name: 'Merkly ONFT', address: '0xE030543b943bdCd6559711Ec8d344389C66e1D56' },
        { name: 'Galxe OAT', address: '0xf9AD3f5eAb7E9214387c75d58Ce40D3A6D05b930' },
       
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

export default AvaxNftSelection;
