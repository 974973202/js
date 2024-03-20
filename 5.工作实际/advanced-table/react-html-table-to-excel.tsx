import React from 'react';
import { Button, message } from 'antd';

interface ReactHTMLTableToExcelProps {
  /**
   *  绑定对应表格id
   */
  tableId: string;
  /**
   *  下载的excel名称
   */
  filename?: string;
  /**
   *  sheet页名称
   */
  sheet?: string;
  /**
   *  外部提供内部 button 按钮的id
   */
  id?: string;
  /**
   *  class类名
   */
  className?: string;
  /**
   *  按钮名
   */
  buttonText?: string;
}
const base64 = (s: string | number | boolean) => {
  return window.btoa(unescape(encodeURIComponent(s)));
};

const format = (s: string, c: { [x: string]: any; worksheet?: string; _table?: string | undefined }) => {
  return s.replace(/{(\w+)}/g, (m, p) => c[p]);
};

/**
 * 表格 真·所见即所得导出
 * @param props ReactHTMLTableToExcelProps
 * @returns Excel
 */
function ReactHTMLTableToExcel(props: ReactHTMLTableToExcelProps) {
  const { tableId, filename, sheet, id, className, buttonText } = props;

  const handleDownload = () => {
    if (!document) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Failed to access document object');
      }

      return null;
    }

    const _table = document?.getElementById(tableId)?.outerHTML;
    if (!_table) {
      message.error(`id：${tableId}不存在DOM`);
      return false;
    }

    // if (document?.getElementById(tableId)?.nodeType !== 1 || document?.getElementById(tableId)?.nodeName !== 'TABLE') {
    //   if (process.env.NODE_ENV !== 'production') {
    //     console.error('Provided table property is not html table element');
    //   }
    //   return null;
    // }

    const uri = 'data:application/vnd.ms-excel;base64,';
    const template =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-mic' +
      'rosoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta cha' +
      'rset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:Exce' +
      'lWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/>' +
      '</x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></' +
      'xml><![endif]--></head><body>{_table}</body></html>';

    const context = {
      worksheet: String(sheet) || 'Worksheet',
      _table,
    };

    const element = window.document.createElement('a');
    element.href = uri + base64(format(template, context));
    element.download = `${String(filename || 'excel')}.xls`;
    document.body.append(element);
    element.click();
    element.remove();
    return true;
  };

  return (
    <Button id={id || 'button-download-as-xls'} className={className} onClick={handleDownload}>
      {buttonText || 'Download'}
    </Button>
  );
}

export default ReactHTMLTableToExcel;
