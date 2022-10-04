import { ReactNode } from 'react';
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from '@chakra-ui/react';

type FaqItemsType = {
  textHead: string;
  textBody: ReactNode;
  bcc: string;
  c: string;
  m: string;
};
export const FaqItems = ({ textHead, textBody, bcc, c, m }: FaqItemsType) => {
  return (
    <AccordionItem margin={m} backgroundColor={bcc} color={c}>
      <h2>
        <AccordionButton color={c} borderColor={c}>
          <Box flex="1">{textHead}</Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>{textBody}</AccordionPanel>
    </AccordionItem>
  );
};
