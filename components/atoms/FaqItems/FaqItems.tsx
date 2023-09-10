import { ReactNode, useContext } from 'react';
import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react';

import { darkMode } from 'utilites/constants';

import { ModeContext } from 'providers/ModeProvider';

type FaqItemsType = {
  textHead: string;
  textBody: ReactNode;
};

export const FaqItems = ({ textHead, textBody }: FaqItemsType) => {
  const { isMode } = useContext(ModeContext);

  const backgroundColor = 'transparent';
  const color = isMode === darkMode ? '#FFD068' : '#2D3748';
  const borderColor = '#FFD068';
  const m = '2rem 0';

  return (
    <AccordionItem margin={m} backgroundColor={backgroundColor} color={color}>
      <h2>
        <AccordionButton textAlign="inherit" color={color} borderColor={borderColor}>
          <Box flex="1">{textHead}</Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>{textBody}</AccordionPanel>
    </AccordionItem>
  );
};
