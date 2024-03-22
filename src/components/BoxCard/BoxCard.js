import React from 'react';
import { Card, CardBody, CardFooter, CardHeader, Heading } from '@chakra-ui/react';

const BoxCard = ({ title, content, actions, ...rest }) => {
  return (
    <Card backgroundColor="blue.500" color="white" {...rest}>
      {title && (
        <CardHeader>
          <Heading size="md">{title}</Heading>
        </CardHeader>
      )}
      <CardBody>{content}</CardBody>
      {actions && <CardFooter sx={{ marginTop: 'auto', padding: 3 }}>{actions}</CardFooter>}
    </Card>
  );
};

export default BoxCard;
