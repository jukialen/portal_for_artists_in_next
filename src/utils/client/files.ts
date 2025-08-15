'use client';

import { useI18n, useScopedI18n } from 'locales/client';

const MAX_PHOTO_SIZE = 6291456;
export const filesTypes = '.jpg, .jpeg, .png, .webp, .avif';
const ACCEPTED_IMAGE_TYPES = filesTypes.split(', ').map((n) => 'image/' + n);
export const isFileAccessApiSupported =
  typeof window !== 'undefined' && typeof window.showOpenFilePicker === 'function';

export const handleFileSelection = async (): Promise<File | null | string> => {
  const tAnotherForm = useScopedI18n('AnotherForm');

  try {
    const [handle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'Images',
          accept: {
            'image/*': filesTypes.split(', '),
          },
        },
      ],
      multiple: false,
    });
    return (await handle.getFile()) as File | null;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return tAnotherForm('fileSelectionCancelled');
    } else {
      console.error('Błąd podczas otwierania showOpenFilePicker:', err);
      return tAnotherForm('errorOpeningFilePicker');
    }
  }
};

export const validatePhoto = async (file: File): Promise<string | null> => {
  const tAnotherForm = useScopedI18n('AnotherForm');
  const t = useI18n();

  if (!file) {
    return t('NavForm.validateRequired');
  }
  if (file.size > MAX_PHOTO_SIZE) {
    return tAnotherForm('fileTooLarge');
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return tAnotherForm('unsupportedFileType');
  }
  return null;
};
