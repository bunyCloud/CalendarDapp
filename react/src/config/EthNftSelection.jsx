import React from 'react';
import { Select } from '@chakra-ui/react';

function EthNftSelect({onCollectionChange}) {
    const collections = [
        { name: 'Art Blocks', address: '0x059edd72cd353df5106d2b9cc5ab83a52287ac3a' },
        { name: 'Azuki', address: '0xed5af388653567af2f388e6224dc7c4b3241c544' },
        { name: 'Beanz', address: '0x306b1ea3ecdf94ab739f1910bbda052ed4a9f949' },
        { name: 'BoredApeKennelClub', address: '0xba30e5f9bb24caa003e9f2f0497ad287fdf95623' },
        { name: 'BoredApeYachtClub', address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d' },
        { name: 'Captainz', address: '0x769272677fab02575e84945f03eca517acc544cc' },
        { name: 'CloneX', address: '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b' },
        { name: 'Doodle', address: '0x8a90cab2b38dba80c64b7734e58ee1db38b8992e' },
        { name: 'Dreadfulz', address: '0x81ae0be3a8044772d04f32398bac1e1b4b215aa8' },
        { name: 'Elemental', address: '0xb6a37b5d14d502c3ab0ae6f3a0e058bc9517786e' },
        { name: 'Koda', address: '0xe012baf811cf9c05c408e879c399960d1f305903' },
        { name: 'MysterBean', address: '0x3af2a97414d1101e2107a70e7f33955da1346305' },
        { name: 'MutantApeYachtClub', address: '0x60e4d786628fea6478f785a6d7e704777c86a7c6' },
        { name: 'Pixelmon', address: '0x32973908faee0bf825a343000fe412ebe56f802a' },
        { name: 'Potatoz', address: '0x39ee2c7b3cb80254225884ca001f57118c8f21b6' },
        { name: 'PudgyPenguins', address: '0xbd3531da5cf5857e7cfaa92426877b022e612cf8' },
        { name: 'Wrapped Cryptopunks', address: '0xb7f7f6c52f2e2fdb1963eab30438024864c313f6' }
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

export default EthNftSelect;
