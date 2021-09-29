import React from 'react';

import GoodList from '@/pages/home/components/GoodList';

const Wrap = css.div`
  width: ${_gb.pageContentWidth};
  margin: 0 auto;
`;

function NewRelease() {
  return (
    <Wrap>
      <GoodList title="Latest" />
    </Wrap>
  );
}

export default NewRelease;
