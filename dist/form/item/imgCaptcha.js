'use strict';exports.__esModule=!0,exports.default=void 0;var _class,_class2,_temp,_extends=Object.assign||function(a){for(var b,c=1;c<arguments.length;c++)for(var d in b=arguments[c],b)Object.prototype.hasOwnProperty.call(b,d)&&(a[d]=b[d]);return a},_react=require('react'),_react2=_interopRequireDefault(_react),_mobxReact=require('mobx-react'),_propTypes=require('prop-types'),_propTypes2=_interopRequireDefault(_propTypes),_input=require('./input'),_input2=_interopRequireDefault(_input);require('../../../assets/less/imgCaptcha.less');function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError('Cannot call a class as a function')}function _possibleConstructorReturn(a,b){if(!a)throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');return b&&('object'==typeof b||'function'==typeof b)?b:a}function _inherits(a,b){if('function'!=typeof b&&null!==b)throw new TypeError('Super expression must either be null or a function, not '+typeof b);a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),b&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):a.__proto__=b)}var _default=(0,_mobxReact.observer)(_class=(_temp=_class2=function(a){function b(){return _classCallCheck(this,b),_possibleConstructorReturn(this,a.apply(this,arguments))}return _inherits(b,a),b.prototype.render=function render(){var a=this.props,b=a.onGetImg,c=a.data,d=a.className,e=c.img,f=_extends({},this.props);return delete f.data,delete f.onGetImg,_react2.default.createElement(_input2.default,_extends({placeholder:'\u9A8C\u8BC1\u7801',autocomplete:'off'},f,{className:'c-img-captcha '+(d||''),addonAfter:_react2.default.createElement('a',{className:'c-img-captcha-btn',href:'javascript:;',title:'\u66F4\u65B0\u9A8C\u8BC1\u7801',onClick:function onClick(){return b()}},e?_react2.default.createElement('img',{className:'c-img-captcha-img',src:e,alt:'\u9A8C\u8BC1\u7801'}):'\u83B7\u53D6\u9A8C\u8BC1\u7801')}))},b}(_react.Component),_class2.propTypes={value:_propTypes2.default.string,data:_propTypes2.default.object,onChange:_propTypes2.default.func,onGetImg:_propTypes2.default.func},_class2.defaultProps={value:'',data:{},onChange:function onChange(){return''},onGetImg:function onGetImg(){return''}},_temp))||_class;exports.default=_default;