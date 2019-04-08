import Editor from '../components/form/item/editor'

export default Editor({
  apiKey: 'w7gauf4rkzmbdyw80xbeu7lw9cy1j0sg9g7a8324u8i2suhm',
  init: {
    language_url: '//cdn.kidhappy.cn/static/js/tinymce/zh_CN.js',
    images_upload_handler: async (blobInfo: any, success: Function, failure: Function) => {
      const formData = new FormData()
      formData.append('file', blobInfo.blob())
      formData.append('type', 'editor')
      // todo 上传图片方法
      console.error('上传未处理')
      // const upData = await upImp(formData)
      // if (upData.errno !== 0) {
      //   failure(`上传失败：${upData.errmsg}`);
      // } else {
      //   success(upData.data.url);
      // }
    }
  }
})
