import { Curd, Form } from 'fullbase-components'
import IStore from 'fullbase-components/dist/store/_i'
import { observable, action, computed } from 'mobx'
import { list } from '../../api/system/table'

@Curd @Form
export default class Table implements IStore {

}
