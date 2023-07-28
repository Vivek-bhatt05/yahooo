import React from 'react'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Heading,
  } from '@chakra-ui/react'

const TableComp = (historicalData) => {

    const data = historicalData.data
    // console.log(historicalData.data)
    const formatDateString = (dateString) => {
        const date = new Date(dateString);
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };
      
        return date.toLocaleDateString('en-US', options);
      };

  return (
            <TableContainer marginTop='30px' >
                <Heading marginBottom='20px' textAlign='center' size='md'>Historical Data</Heading>
            <Table variant='simple'>
                <Thead>
                <Tr>
                    <Th>Date</Th>
                    <Th>Open</Th>
                    <Th>High</Th>
                    <Th>Low</Th>
                    <Th>Close</Th>
                    <Th>Volume</Th>
                </Tr>
                </Thead>
                <Tbody>

                 {data && data.length>0 && 
                 data.map((item,i)=>(
                  <Tr key={i}>
                    <Td>{formatDateString(item.date)}</Td>
                    <Td>{item.open}</Td>
                    <Td>{item.high}</Td>
                    <Td>{item.low}</Td>
                    <Td>{item.close}</Td>
                    <Td>{item.volume.toLocaleString('en-IN')}</Td>
                  </Tr>
                 ))}

                </Tbody>
            </Table>
            </TableContainer>
  )
}

export default TableComp
