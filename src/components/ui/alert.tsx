import { ReactElement, ReactNode } from "react"
import { Alert as ChakraAlert } from "@chakra-ui/react"
import { CloseButton } from "./close-button"

export interface AlertProps extends Omit<ChakraAlert.RootProps, "title"> {
  startElement?: ReactNode
  endElement?: ReactNode
  title?: ReactNode
  icon?: ReactElement
  closable?: boolean
  onClose?: () => void
}

export function Alert({
  startElement,
  endElement,
  title,
  icon,
  closable,
  onClose,
  children,
  ...rest
}: AlertProps) {
  return (
    <ChakraAlert.Root {...rest}>
      {startElement || <ChakraAlert.Indicator>{icon}</ChakraAlert.Indicator>}
      {children ? (
        <ChakraAlert.Content>
          <ChakraAlert.Title>{title}</ChakraAlert.Title>
          <ChakraAlert.Description>{children}</ChakraAlert.Description>
        </ChakraAlert.Content>
      ) : (
        <ChakraAlert.Title flex="1">{title}</ChakraAlert.Title>
      )}
      {endElement}
      {closable && (
        <CloseButton
          size="sm"
          pos="relative"
          top="-2"
          insetEnd="-2"
          alignSelf="flex-start"
          onClick={onClose}
        />
      )}
    </ChakraAlert.Root>
  );
}
