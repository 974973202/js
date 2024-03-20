/*
 * @Author: liangzx liangzx@chinacscs.com
 * @Date: 2022-12-08 10:43:03
 * @LastEditors: liangzx liangzx@chinacscs.com
 * @LastEditTime: 2023-01-10 17:19:25
 * @FilePath: \micro-react-library\src\sys-config\dynamic-page-group\components\iframe-page.tsx
 * @Description: 动态页面组合iframe页面
 *
 */
import React, { useEffect, useState } from 'react';
import cuid from 'cuid';

interface Props {
  address: string;
  // 公共查询条件
  conditionPublic?: Record<string, any>;
  [key: string]: any;
}

function IframePage(props: Props) {
  const { address, conditionPublic, ...rest } = props;
  const [iframePageHeight, setIframePageHeight] = useState(500);
  const [iframeUrl, setIframeUrl] = useState(''); // 初始判断url上有没有自带?

  useEffect(() => {
    if (conditionPublic) {
      const ads = /\?/g.test(address) ? `${address}&iframePage=true` : `${address}?iframePage=true`;

      // 公共查询条件url拼接
      const url = `${ads}&${Object.keys(conditionPublic)
        .map((key) => `${key}=${conditionPublic[key]}`)
        .join('&')}`;
      setIframeUrl(url);
    }
  }, [conditionPublic]);
  const cuId = cuid();

  console.log(`iframe页面高度${iframePageHeight}`, `iframe url地址${iframeUrl}`);

  return (
    <iframe
      name="iframePage"
      id={cuId}
      onLoad={() => {
        setTimeout(() => {
          const iframes: any = document.querySelector(`#${cuId}`);
          setIframePageHeight(iframes?.contentWindow?.document?.body?.scrollHeight || 500);
        }, 2000);
      }}
      src={iframeUrl}
      width="100%"
      height={iframePageHeight}
      frameBorder={0}
      {...rest}
    />
  );
}

export default IframePage;
