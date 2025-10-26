'use client';

import { useState, useCallback } from 'react';
import { DocumentType } from '@/types/document';
import { useTranslations } from 'next-intl';

interface FileUploadProps {
  claimId: string;
  documentType: DocumentType;
  onUploadSuccess?: (document: any) => void;
  onUploadError?: (error: string) => void;
}

export default function FileUpload({
  claimId,
  documentType,
  onUploadSuccess,
  onUploadError,
}: FileUploadProps) {
  const t = useTranslations('documents');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      onUploadError?.(t('invalidFileType'));
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      onUploadError?.(t('fileTooLarge'));
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('claimId', claimId);
      formData.append('documentType', documentType);

      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:3001/documents/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t('uploadError'));
      }

      const document = await response.json();
      onUploadSuccess?.(document);

      // Reset
      setSelectedFile(null);
      setPreview(null);
    } catch (error: any) {
      onUploadError?.(error.message);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        {!selectedFile ? (
          <>
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-4">
              <label
                htmlFor={`file-upload-${documentType}`}
                className="cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500"
              >
                <span>{t('selectFile')}</span>
                <input
                  id={`file-upload-${documentType}`}
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                  onChange={handleFileChange}
                />
              </label>
              <p className="text-sm text-gray-500 mt-2">{t('dragAndDrop')}</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {t('allowedFormats')}: JPG, PNG, WEBP, PDF (max 5MB)
            </p>
          </>
        ) : (
          <div className="space-y-4">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mx-auto max-h-48 rounded-lg"
              />
            )}
            <div className="flex items-center justify-center gap-2">
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? t('uploading') : t('upload')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setPreview(null);
                }}
                disabled={uploading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
