import React from 'react';
import ContentLoader, { List } from 'react-content-loader';

module.exports = {

  ListSkeleton: () => {
    return (
      <div >
        {new Array(1).fill('')
          .map((item, i) => (
            <ContentLoader
              key={i}
              height={110}
              width={400}
              speed={2}
              primaryColor="#c0c0c0"
              secondaryColor="#defaf8"
            >
              <rect x="70" y="15" rx="4" ry="4" width="117" height="6" />
              <rect x="70" y="35" rx="3" ry="3" width="85" height="6" />
              <rect x="0" y="80" rx="3" ry="3" width="350" height="6" />
              <rect x="0" y="100" rx="3" ry="3" width="380" height="6" />
              <rect x="0" y="120" rx="3" ry="3" width="201" height="6" />
              <circle cx="30" cy="30" r="30" />
            </ContentLoader >
          ))}
      </div >
    );
  },
  ContentSkeleton: () => {
    return <List />;
  },
};

