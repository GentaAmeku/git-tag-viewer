import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';

import Table from '../components/Table/container';
import Initialize from '../components/Initialize';

const Home = () => {
  const [dir, setDir] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { baseDir } = router.query;
  const handleSetDir = (e, dir) => {
    setIsLoading(false);
    setDir(dir);
  };
  const handleNavigate = (e, baseDir) =>
    router.replace({ pathname: '/', query: { baseDir } });

  useEffect(() => {
    window.api.on('navigate', handleNavigate);
    return () => {
      window.api.off('navigate', handleNavigate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseDir]);

  useEffect(() => {
    if (baseDir && isEmpty(dir)) {
      setIsLoading(true);
      window.api.on('async-dir', handleSetDir);
      window.api.getDir({ baseDir });
    }
    return () => {
      window.api.off('async-dir', handleSetDir);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseDir]);

  if (isEmpty(dir)) {
    return <Initialize isLoading={isLoading} />;
  }

  return <Table dir={dir} />;
};

export default Home;
