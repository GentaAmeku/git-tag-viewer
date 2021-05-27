import { useState, useEffect, useRef } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

import Component from '../index';

const Loading = ({ branch }) => (
  <Dimmer active>
    <Loader size="big">Loading {branch}...</Loader>
  </Dimmer>
);

export const Table = ({ dir, ...rest }) => {
  const ref = useRef({ isWithFetch: false });
  const [repos, setRepos] = useState(dir);
  const [isLoading, setIsLoading] = useState(false);
  const [branch, setBranch] = useState('');
  const branchRef = useRef();
  const handleSetRepos = (_, data) => {
    setIsLoading(false);
    setRepos(data);
  };
  const handleClickApply = () => {
    ref.current.isWithFetch = false;
    setBranch(branchRef.current.inputRef.current.value);
  };

  const handleClickApplyWithFetch = () => {
    ref.current.isWithFetch = true;
    setBranch(branchRef.current.inputRef.current.value);
  };

  useEffect(() => {
    if (branch) {
      setIsLoading(true);
      window.api.on('async-tag', handleSetRepos);
      window.api.getRepos({
        dir,
        branch,
        isWithFetch: ref.current.isWithFetch,
      });
      return () => {
        window.api.off('async-tag', handleSetRepos);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branch]);

  console.log(repos);

  const mergedProps = {
    repos,
    branch,
    branchRef,
    isLoading,
    handleClickApply,
    handleClickApplyWithFetch,
    ...rest,
  };

  if (isLoading) {
    return <Loading branch={branch} />;
  }

  return <Component {...mergedProps} />;
};

export default Table;
