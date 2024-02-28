import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Editor as TinyEditor } from '@tinymce/tinymce-react';
import useAxios from 'axios-hooks';
import { useToast } from '@chakra-ui/react';
import { TINY_API_KEY } from 'constants/common';

const Editor = ({ onChange, ...props }, ref) => {
  const editorRef = useRef(null);
  const toast = useToast();

  // const [, uploadImageApi] = useAxios(
  //   {
  //     method: 'post',
  //     url: API_ROUTES.UploadImage,
  //   },
  //   {
  //     manual: true,
  //   }
  // );

  useImperativeHandle(
    ref,
    () => ({
      getContent: () => {
        if (editorRef.current) {
          return editorRef.current.getContent();
        }
      },
    }),
    [editorRef]
  );

  return (
    <>
      <TinyEditor
        apiKey={TINY_API_KEY}
        onInit={(evt, editor) => (editorRef.current = editor)}
        init={{
          height: 350,
          menubar: false,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'code',
            'help',
            'wordcount',
          ],
          toolbar:
            'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          menubar: 'file edit insert view format',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          language: 'vi',
          elementpath: false,
          branding: false,
          file_picker_callback: (cb, value, meta) => {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');

            input.addEventListener('change', e => {
              const file = e.target.files[0];
              const data = new FormData();

              data.append('image', file);

              uploadImageApi({ data })
                .then(res => {
                  cb(res?.data?.data?.imageUrl, { title: file.name });
                })
                .catch(error => {
                  toast({
                    title: error?.response?.data?.errors?.[0]?.msg || error?.response?.data?.msg || `Tải file không thành công`,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                  });
                });
            });

            input.click();
          },
        }}
        onEditorChange={onChange}
        {...props}
      />
    </>
  );
};

export default forwardRef(Editor);
