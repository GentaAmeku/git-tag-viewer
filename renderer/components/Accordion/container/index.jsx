import { useCallback, useState } from 'react';

import Component from '../index';

export const Accordion = (props) => {
  const [isActive, setIsActive] = useState(false);
  const handleClick = useCallback(() => {
    setIsActive((s) => !s);
  }, []);

  const mergedProps = {
    isActive,
    handleClick,
    ...props,
  };

  return <Component {...mergedProps} />;
};

export default Accordion;
