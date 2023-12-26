'use client';

import { ReactNode, useContext } from 'react';
import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react';

import { darkMode } from 'constants/links';

import { ModeContext } from 'providers/ModeProvider';

type FaqItemsType = {
  textHead: string;
  textBody: ReactNode;
};

export const FaqItems = ({ textHead, textBody }: FaqItemsType) => {
  const { isMode } = useContext(ModeContext);

  const backgroundColor = 'transparent';
  const color = isMode === darkMode ? '#f7f7f7' : '#2D3748';
  const borderColor = '#FFD068';
  const m = '2rem 0';

  return (
    <AccordionItem margin={m} backgroundColor={backgroundColor} color={color}>
      <h2>
        <AccordionButton
          _hover={{ backgroundColor: borderColor }}
          textAlign="inherit"
          backgroundColor={borderColor}
          borderRadius="1rem">
          <Box flex="1" color="#2D3748">
            {textHead}
          </Box>
          <AccordionIcon color="#2D3748" />
        </AccordionButton>
      </h2>
      <AccordionPanel color={color} pb={4}>
        {textBody}
      </AccordionPanel>
    </AccordionItem>
  );
};
