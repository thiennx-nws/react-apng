'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _parser = require('./apngJs/parser');

var _parser2 = _interopRequireDefault(_parser);

var _ajax = require('./ajax');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * [ApngComponent description]
 * @param {string} className canvas' className
 * @param {object} style canvas' style
 * @param {string} src apng's path
 * @param {number} rate apng play rate
 * @param {function} onClick bind animation's click event
 * @param {function} onFinished bind animation finish
 * @param {bool} autoPlay auto play apng
 * @extends React
 */

var ApngComponent = function (_React$Component) {
    _inherits(ApngComponent, _React$Component);

    function ApngComponent(props) {
        _classCallCheck(this, ApngComponent);

        var _this2 = _possibleConstructorReturn(this, (ApngComponent.__proto__ || Object.getPrototypeOf(ApngComponent)).call(this, props));

        _initialiseProps.call(_this2);

        var _props$src = props.src,
            src = _props$src === undefined ? '' : _props$src,
            _props$rate = props.rate,
            rate = _props$rate === undefined ? 1.0 : _props$rate,
            _props$autoPlay = props.autoPlay,
            autoPlay = _props$autoPlay === undefined ? false : _props$autoPlay,
            onFinished = props.onFinished;

        _this2.state = {
            src: src,
            rate: rate,
            autoPlay: autoPlay,
            staticImg: null
        };
        _this2.apng = null;
        _this2.player = null;
        _this2.isOne = false;
        _this2.timer = [];
        _this2.isPlay = false;
        _this2.hasPerformance = typeof performance !== 'undefined';
        _this2.speed = 1000 / (rate * 24); //1000/24 每秒24帧
        _this2.onFinished = onFinished;
        return _this2;
    }

    _createClass(ApngComponent, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.getImgData();
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (this.state.src !== nextProps.src) {
                this.reset(nextProps);
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (this.player) {
                this.player.stop();
                this.player._apng = null;
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var staticImg = this.state.staticImg;

            return staticImg ? _react2.default.createElement('img', _extends({ src: staticImg }, this.props, { alt: '\u9759\u6001\u56FE\u7247' })) : _react2.default.createElement('canvas', _extends({ ref: 'canvasBox' }, this.props));
        }
    }]);

    return ApngComponent;
}(_react2.default.Component);

var _initialiseProps = function _initialiseProps() {
    var _this3 = this;

    this.reset = function (nextProps) {
        var _nextProps$src = nextProps.src,
            src = _nextProps$src === undefined ? '' : _nextProps$src,
            _nextProps$rate = nextProps.rate,
            rate = _nextProps$rate === undefined ? 1.0 : _nextProps$rate,
            _nextProps$autoPlay = nextProps.autoPlay,
            autoPlay = _nextProps$autoPlay === undefined ? false : _nextProps$autoPlay;

        _this3.stop();
        _this3.apng = null;
        _this3.player = null;
        _this3.isOne = false;
        _this3.timer = [];
        _this3.isPlay = false;
        _this3.setState({
            src: src,
            rate: rate,
            autoPlay: autoPlay,
            staticImg: null
        }, function () {
            _this3.getImgData();
        });
    };

    this.play = function () {
        if (!_this3.player) return;
        if (!_this3.player.paused) return;
        _this3.player.play();
        _this3.isPlay = true;
    };

    this.pause = function () {
        if (!_this3.player) return;
        _this3.player.pause();
        _this3.resetPlayState();
        _this3.isPlay = false;
    };

    this.stop = function () {
        if (!_this3.player) return;
        _this3.player.stop();
        _this3.resetPlayState();
        _this3.isPlay = false;
    };

    this.one = function () {
        if (!_this3.player) return;
        _this3.resetPlayState();
        _this3.player.stop();
        var length = _this3.apng.frames.length || 0;
        _this3.isPlay = true;
        var performance = _this3.hasPerformance ? performance || window.performance : Date; // supports ios8 Safari
        var nextRenderTime = performance.now() + _this3.speed;
        var i = 0;
        var tick = function tick(now) {
            var _now = _this3.hasPerformance ? now : Date.now(); // supports ios8 Safari
            if (!_this3.isPlay || i > length - 2) {
                _this3.isPlay = false;
                return;
            }
            if (_now >= nextRenderTime) {
                _this3.player.renderNextFrame();
                i++;
                nextRenderTime = performance.now() + _this3.speed;
            }
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    this.resetPlayState = function () {
        if (_this3.timer.length > 0) {
            _this3.timer.forEach(function (item) {
                return clearTimeout(item);
            });
            _this3.timer = [];
        }
    };

    this.getImgData = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var canvas, _state, rate, src, autoPlay, data, p, _this;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        canvas = _this3.refs.canvasBox;
                        _state = _this3.state, rate = _state.rate, src = _state.src, autoPlay = _state.autoPlay;
                        _context.next = 4;
                        return (0, _ajax.getImgBuffer)(src);

                    case 4:
                        data = _context.sent;

                        _this3.apng = (0, _parser2.default)(data);
                        //错误检测

                        if (!(typeof _this3.apng.width === 'number')) {
                            _context.next = 24;
                            break;
                        }

                        if (!(_this3.apng instanceof Error)) {
                            _context.next = 9;
                            break;
                        }

                        return _context.abrupt('return');

                    case 9:
                        _context.next = 11;
                        return _this3.apng.createImages();

                    case 11:
                        canvas.width = _this3.apng.width;
                        canvas.height = _this3.apng.height;
                        //创建canvas播放器
                        _context.next = 15;
                        return _this3.apng.getPlayer(canvas.getContext('2d'));

                    case 15:
                        p = _context.sent;

                        _this3.player = p;
                        _this3.player.playbackRate = rate;
                        if (autoPlay) {
                            _this3.player.play();
                            _this3.isPlay = true;
                        }
                        _this = _this3;

                        setTimeout(function () {
                            _this.onFinished();
                        }, _this3.apng.playTime);
                        _this3.player.on('end', function () {
                            _this3.isPlay = false;
                        });
                        _context.next = 25;
                        break;

                    case 24:
                        _this3.setState({
                            staticImg: src
                        });

                    case 25:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, _this3);
    }));
};

exports.default = ApngComponent;