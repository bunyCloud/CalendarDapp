import { Text } from '@chakra-ui/react'

function AddressList({ title, addresses, formatter }) {
  return (
    <div>
      <Text as="b">{title}</Text>
      <div>
        {addresses.map((address, index) => (
          <div key={index}>
            {address && (
              <>
            <Text>{formatter(address)}</Text>
            </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddressList;
