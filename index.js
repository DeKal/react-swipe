'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _swipeJsIso = require('swipe-js-iso');

var _swipeJsIso2 = _interopRequireDefault(_swipeJsIso);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactSwipe = function (_Component) {
  _inherits(ReactSwipe, _Component);

  function ReactSwipe() {
    _classCallCheck(this, ReactSwipe);

    return _possibleConstructorReturn(this, (ReactSwipe.__proto__ || Object.getPrototypeOf(ReactSwipe)).apply(this, arguments));
  }

  _createClass(ReactSwipe, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var swipeOptions = this.props.swipeOptions;


      this.swipe = (0, _swipeJsIso2.default)(this.container, swipeOptions);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var _props = this.props,
          swipeKey = _props.swipeKey,
          children = _props.children;


      if (prevProps.swipeKey !== swipeKey || children.length == 2 && prevProps.children !== children) {
        // just setup again
        this.swipe.setup();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.swipe.kill();
      this.swipe = void 0;
    }
  }, {
    key: 'next',
    value: function next() {
      setTimeout(this.swipe.next, 0);
    }
  }, {
    key: 'prev',
    value: function prev() {
      setTimeout(this.swipe.prev, 0);
    }
  }, {
    key: 'slide',
    value: function slide() {
      var _swipe;

      (_swipe = this.swipe).slide.apply(_swipe, arguments);
    }
  }, {
    key: 'getPos',
    value: function getPos() {
      return this.swipe.getPos();
    }
  }, {
    key: 'getNumSlides',
    value: function getNumSlides() {
      return this.swipe.getNumSlides();
    }
  }, {
    key: 'renderChildren',
    value: function renderChildren() {
      var _props2 = this.props,
          children = _props2.children,
          style = _props2.style;


      if (!children) {
        return null;
      }

      var childCount = children.length;
      var allChildren = children;

      if (childCount === 2) {
        // special case, we dupplicate the children to avoid outdated cloning in swipe.js
        allChildren = [].concat(_toConsumableArray(children), _toConsumableArray(children));
      }

      return _react2.default.Children.map(allChildren, function (child) {
        if (!child) {
          return null;
        }

        return _react2.default.cloneElement(child, {
          style: _extends({}, style.child, child.props.style)
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props3 = this.props,
          id = _props3.id,
          className = _props3.className,
          style = _props3.style;


      return _react2.default.createElement(
        'div',
        {
          ref: function ref(el) {
            _this2.container = el;
          },
          id: id,
          className: 'react-swipe-container ' + className,
          style: style.container
        },
        _react2.default.createElement(
          'div',
          { style: style.wrapper },
          this.renderChildren()
        )
      );
    }
  }]);

  return ReactSwipe;
}(_react.Component);

ReactSwipe.propTypes = {
  swipeOptions: _propTypes2.default.shape({
    startSlide: _propTypes2.default.number,
    speed: _propTypes2.default.number,
    auto: _propTypes2.default.number,
    continuous: _propTypes2.default.bool,
    disableScroll: _propTypes2.default.bool,
    stopPropagation: _propTypes2.default.bool,
    swiping: _propTypes2.default.func,
    callback: _propTypes2.default.func,
    transitionEnd: _propTypes2.default.func
  }),
  style: _propTypes2.default.shape({
    container: _propTypes2.default.object,
    wrapper: _propTypes2.default.object,
    child: _propTypes2.default.object
  }),
  id: _propTypes2.default.string,
  className: _propTypes2.default.string,
  swipeKey: _propTypes2.default.string
};
ReactSwipe.defaultProps = {
  swipeOptions: {},
  style: {
    container: {
      overflow: 'hidden',
      visibility: 'hidden',
      position: 'relative'
    },

    wrapper: {
      overflow: 'hidden',
      position: 'relative'
    },

    child: {
      float: 'left',
      width: '100%',
      position: 'relative',
      transitionProperty: 'transform'
    }
  },
  className: '',
  swipeKey: null
};
exports.default = ReactSwipe;
module.exports = exports['default'];
