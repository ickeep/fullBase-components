import { action, extendObservable } from 'mobx'
import { notification } from 'antd'

export default function (target) {
  extendObservable(target.prototype, {
    listOperate: { index: '', action: '', loading: '' }
  })

  target.prototype.setListOperate = action(function ({ index = '', action = '', loading = false, listName = 'list' } = {}) {
    if (this[`${listName}Operate`]) {
      this[`${listName}Operate`].loading = loading
      this[`${listName}Operate`].index = index
      this[`${listName}Operate`].action = action
    }
  })
  target.prototype.freeze = action(async function ({ id, index, listName = 'list', url = this.apiUrl.freeze } = {}) {
    if (!url) {
      notification.error({ message: 'freeze url 不能为空' })
      return false
    }
    this.setListOperate({ index, action: 'freeze', loading: true, listName })
    const freezeData = await this.httpPost(url, { id }, true)
    if (freezeData.errno === 0) {
      if (this[`${listName}Data`] && this[`${listName}Data`].data && this[`${listName}Data`].data.data && this[`${listName}Data`].data.data[index]) {
        this[`${listName}Data`].data.data[index].status = 2
      }
    }
    this.setListOperate({ listName })
    return freezeData
  })


  target.prototype.unfreeze = action(async function ({ id, index, listName = 'list', url = this.apiUrl.unfreeze } = {}) {
    if (!url) {
      notification.error({ message: 'unfreeze url 不能为空' })
      return false
    }
    this.setListOperate({ index, action: 'unfreeze', loading: true, listName })
    const unfreezeData = await this.httpPost(url, { id }, true)
    if (unfreezeData.errno === 0) {
      if (this[`${listName}Data`] && this[`${listName}Data`].data && this[`${listName}Data`].data.data && this[`${listName}Data`].data.data[index]) {
        this[`${listName}Data`].data.data[index].status = 1
      }
    }
    this.setListOperate({ listName })
    return unfreezeData
  })

  target.prototype.pin = action(async function ({ id, index, listName = 'list', url = this.apiUrl.pin } = {}) {
    if (!url) {
      notification.error({ message: 'pin url 不能为空' })
      return false
    }
    this.setListOperate({ index, action: 'pin', loading: true, listName })
    const pinData = await this.httpPost(url, { id }, true)
    if (pinData.errno === 0) {
      if (this[`${listName}Data`] && this[`${listName}Data`].data && this[`${listName}Data`].data.data && this[`${listName}Data`].data.data[index]) {
        this[`${listName}Data`].data.data[index].sticky = 1
      }
    }
    this.setListOperate({ listName })
    return pinData
  })


  target.prototype.unpin = action(async function ({ id, index, listName = 'list', url = this.apiUrl.unpin } = {}) {
    if (!url) {
      notification.error({ message: 'unpin url 不能为空' })
      return false
    }
    this.setListOperate({ index, action: 'unpin', loading: true, listName })
    const unpinData = await this.httpPost(url, { id }, true)
    if (unpinData.errno === 0) {
      if (this[`${listName}Data`] && this[`${listName}Data`].data && this[`${listName}Data`].data.data && this[`${listName}Data`].data.data[index]) {
        this[`${listName}Data`].data.data[index].sticky = 0
      }
    }
    this.setListOperate({ listName })
    return unpinData
  })


  target.prototype.del = action(async function ({ id, index, listName = 'list', url = this.apiUrl.del } = {}) {
    if (!url) {
      notification.error({ message: 'del url 不能为空' })
      return false
    }
    this.setListOperate({ index, action: 'del', loading: true, listName })
    const delData = await this.httpPost(url, { id }, true)
    if (delData.errno === 0) {
      if (this[`${listName}Data`] && this[`${listName}Data`].data && this[`${listName}Data`].data.data && this[`${listName}Data`].data.data[index]) {
        this[`${listName}Data`].data.data.splice(index, 1)
      }
    }
    this.setListOperate({ listName })
    return delData
  })
}
