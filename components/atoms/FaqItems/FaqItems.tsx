import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react';
import { ReactNode } from 'react';

type FaqItemsType = {
  textHead: string;
  textBody: ReactNode;
  bcc: string;
  c: string;
  m: string;
}
export const FaqItems = ({textHead, textBody, bcc, c, m}: FaqItemsType) => {
  return (
    <AccordionItem margin={m} backgroundColor={bcc} color={c}>
      <h2>
        <AccordionButton>
          <Box flex='1' textAlign='left'>
            {textHead}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        {textBody}
      </AccordionPanel>
    </AccordionItem>
  )
}