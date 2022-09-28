import { request } from './request';
import { Buffer } from 'buffer';
import { AxiosResponse } from 'axios';

const fetchExportList = async(url: string, params: Record<string, unknown>, fileName: string) => {
  await request
    .get(url, {
      params,
      headers: {
        Accept: 'application/json',
        responseType: 'blob'
      }
    })
    .then((response: AxiosResponse) => response?.data?.data)
    .then((blob) => {
      const decode = Buffer.from(blob);
      const response = new Blob([decode], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' });
      const url = window.URL.createObjectURL(response);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    });
};

export default fetchExportList;
