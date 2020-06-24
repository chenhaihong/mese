import styles from "./common.less";

import React from "react";

function NotFound() {
  return (
    <div className={styles.app}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.description}>Page not found.</p>
    </div>
  );
}

export function createPage() {
  return <NotFound />;
}

export async function getPageConfig() {
  return {
    onMemoryCache: true,
    onSSR: true,
    onCSR: false,

    body: {
      beforePageJs: [
        '<script src="https://cdn.bootcss.com/react/16.8.4/umd/react.development.js"></script>',
        '<script src="https://cdn.bootcss.com/react-dom/16.8.4/umd/react-dom.development.js"></script>',
      ].join(""),
    },
  };
}
