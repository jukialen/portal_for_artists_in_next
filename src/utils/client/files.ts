'use client';

import { useI18n, useScopedI18n } from 'locales/client';

const MAX_PHOTO_SIZE = 6291456;
export const filesProfileTypes = '.jpg, .jpeg, .png, .webp, .avif';
export const filesTypes = '.apng, .mp4, .webm';
const ACCEPTED_IMAGE_TYPES = filesProfileTypes.split(', ').map((n) => 'image/' + n.replace('.', ''));
const ACCEPTED_ANIM_VIDEOS_TYPES = filesTypes
  .split(', ')
  .map((a) => `${a.includes('apng') ? 'image/' : 'video/'}` + a.replace('.', ''));
export const isFileAccessApiSupported =
  typeof window !== 'undefined' && typeof window.showOpenFilePicker === 'function';

console.log(window.showOpenFilePicker);
export const handleFileSelection = async (
  tAnotherForm: any,
  profile: boolean = true,
): Promise<File | null | string> => {
  try {
    const [handle] = await window.showOpenFilePicker({
      types: [
        !profile
          ? {
              description: 'Images',
              accept: {
                'image/*': filesProfileTypes.split(', ').concat('.apng'),
              },
            }
          : {
              description: 'Images',
              accept: {
                'image/*': filesProfileTypes.split(', '),
              },
            },
        ...(!profile
          ? [
              {
                description: 'Videos',
                accept: {
                  'video/*': filesTypes
                    .split(', ')
                    .filter((r) => r !== '.apng')
                    .join(', '),
                },
              },
            ]
          : []),
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

export const validatePhoto = async (
  tAnotherForm: any,
  t: any,
  file: File,
  profile: boolean = true,
): Promise<string | null> => {
  if (!file) {
    return t('NavForm.validateRequired');
  }

  profile && file.size > MAX_PHOTO_SIZE && tAnotherForm('fileTooLarge');

  if (!profile) {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type) && !ACCEPTED_ANIM_VIDEOS_TYPES.includes(file.type)) {
      return tAnotherForm('unsupportedFileType');
    }
  } else if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return tAnotherForm('unsupportedFileType');
  }
  return null;
};
