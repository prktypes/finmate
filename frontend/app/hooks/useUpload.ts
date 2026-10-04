'use client';

import { useState, useCallback } from 'react';

interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
  statementId: string | null;
}

export function useUpload() {
  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    statementId: null,
  });

  const upload = useCallback(async (file: File) => {
    setState({
      uploading: true,
      progress: 0,
      error: null,
      statementId: null,
    });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setState((prev) => ({ ...prev, progress }));
        }
      });

      const response = await new Promise<any>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.open('POST', 'http://localhost:8000/api/statements/upload');
        xhr.send(formData);
      });

      setState({
        uploading: false,
        progress: 100,
        error: null,
        statementId: response.statement_id,
      });

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setState({
        uploading: false,
        progress: 0,
        error: errorMessage,
        statementId: null,
      });
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      uploading: false,
      progress: 0,
      error: null,
      statementId: null,
    });
  }, []);

  return { ...state, upload, reset };
}
