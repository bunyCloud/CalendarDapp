import React from 'react';
import { Select } from '@chakra-ui/react';

function PolygonNftSelection({onCollectionChange}) {
    const collections = [
        { name: 'Bitnauts Collection', address: '0x029519BBc5dec8E53AA5Ba657567a8BcC22e4409' },
        { name: 'DOLZ', address: '0x1fbF4e542018f893351170478e7404149e8C29B1' },
        { name: 'DraftKings Reignmakers UFC', address: '0xFe265d7dA0B67E3417492f5D4A32E5Bf6923A98e' },
        { name: 'Galxe OAT', address: '0x5D666F215a85B87Cb042D59662A7ecd2C8Cc44e6' },
        { name: 'Mainnet Alpha', address: '0x9d5D479a84F3358E8e27Afe056494BD2dA239acD' },
        { name: 'Pandra: PixelProwler', address: '0x141A1fb33683C304DA7C3fe6fC6a49B5C0c2dC42' },
        { name: 'PlanetIx', address: '0xB2435253C71FcA27bE41206EB2793E44e1Df6b6D' },
        { name: 'Postereum 5', address: '0x0F70E3e9C8Ac01691B6300876A681DdA91915726' },
        { name: 'The Flippsides', address: '0x86B56762Ba22D98851a1963A9687C5c8a8A9C2D1' },
        { name: 'The Spacebirds', address: '0x0B7E6D8295123309FD77c893C6f1c8aB48aE600A' },
        { name: 'TheBraveBlossomsBubbleheads2023', address: '0xeCB75d9b699128a5740c0512633556137C1bdaAA' },
        { name: 'STRIKER', address: '0x8a40cD9f7AbeDf96E7C1ac54723b9061A215364C' },
        { name: 'Neon Doodles', address: '0x5D11f412aEa21163c183fc1019A78037eAD81354' },
        { name: 'Holograph x LayerZero', address: '0x2c4BD4e25D83285f417E26a44069F41d1a8aD0e7' },
        { name: 'Cyberdeck Avatar ID System', address: '0x215d8056B1ee8F5e921138924E47Cb72C4A50462' },
    ];
    
    collections.sort((a, b) => a.name.localeCompare(b.name));
    
    
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

export default PolygonNftSelection;
