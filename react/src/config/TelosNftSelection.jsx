import React from 'react';
import { Select } from '@chakra-ui/react';

function TelosNftSelect({onCollectionChange}) {
    const collections = [
        { name: 'Buff Alien', address: '0xfc32a282813f6398c04580540b5bd3fee3ce07c4' },
        { name: 'Doom', address: '0x363f231929c64bb7d05e4360f873171a71ff5f09'},
        { name: 'Footy Alien', address: '0x5c56f2140a24d6734f601a871494d4135f5c9a5d'},
        { name: 'Jessepe', address: '0xd19580fe57615a18cbfac440e681a985531a37bc'},
        { name: 'Nelly', address: '0x363f231929c64bb7d05e4360f873171a71ff5f09'},
        { name: 'Trip of the Stargazers', address: '0x877113795c66afc5f745c3eee3c740c454a01447' },
        { name: 'Multipass', address: '0x33ca8ae8dc0ec79918d711a6091713721f8d1f13' },
    ];
    
    return (
        <Select size="sm" variant={'flushed'} placeholder="Select collection" onChange={(e) => onCollectionChange(e.target.value)}>
            {collections.map((collection, index) => (
                <option key={index} value={collection.address}>
                    {collection.name}
                </option>
            ))}
        </Select>
    );
}

export default TelosNftSelect;
