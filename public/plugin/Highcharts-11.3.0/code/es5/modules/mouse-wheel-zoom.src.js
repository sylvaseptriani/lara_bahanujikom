/**
 * @license Highcharts JS v11.3.0 (2024-01-10)
 *
 * Mousewheel zoom module
 *
 * (c) 2023 Askel Eirik Johansson
 *
 * License: www.highcharts.com/license
 */
(function (factory) {
    if (typeof module === 'object' && module.exports) {
        factory['default'] = factory;
        module.exports = factory;
    } else if (typeof define === 'function' && define.amd) {
        define('highcharts/modules/mouse-wheel-zoom', ['highcharts'], function (Highcharts) {
            factory(Highcharts);
            factory.Highcharts = Highcharts;
            return factory;
        });
    } else {
        factory(typeof Highcharts !== 'undefined' ? Highcharts : undefined);
    }
}(function (Highcharts) {
    'use strict';
    var _modules = Highcharts ? Highcharts._modules : {};
    function _registerModule(obj, path, args, fn) {
        if (!obj.hasOwnProperty(path)) {
            obj[path] = fn.apply(null, args);

            if (typeof CustomEvent === 'function') {
                window.dispatchEvent(new CustomEvent(
                    'HighchartsModuleLoaded',
                    { detail: { path: path, module: obj[path] } }
                ));
            }
        }
    }
    _registerModule(_modules, 'Extensions/Annotations/NavigationBindingsUtilities.js', [_modules['Core/Utilities.js']], function (U) {
        /* *
         *
         *  (c) 2009-2024 Highsoft, Black Label
         *
         *  License: www.highcharts.com/license
         *
         *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
         *
         * */
        var defined = U.defined, isNumber = U.isNumber, pick = U.pick;
        /* *
         *
         *  Constants
         *
         * */
        /**
         * Define types for editable fields per annotation. There is no need to define
         * numbers, because they won't change their type to string.
         * @private
         */
        var annotationsFieldsTypes = {
            backgroundColor: 'string',
            borderColor: 'string',
            borderRadius: 'string',
            color: 'string',
            fill: 'string',
            fontSize: 'string',
            labels: 'string',
            name: 'string',
            stroke: 'string',
            title: 'string'
        };
        /* *
         *
         *  Functions
         *
         * */
        /**
         * Returns the first xAxis or yAxis that was clicked with its value.
         *
         * @private
         *
         * @param {Array<Highcharts.PointerAxisCoordinateObject>} coords
         *        All the chart's x or y axes with a current pointer's axis value.
         *
         * @return {Highcharts.PointerAxisCoordinateObject}
         *         Object with a first found axis and its value that pointer
         *         is currently pointing.
         */
        function getAssignedAxis(coords) {
            return coords.filter(function (coord) {
                var extremes = coord.axis.getExtremes(), axisMin = extremes.min, axisMax = extremes.max, 
                // Correct axis edges when axis has series
                // with pointRange (like column)
                minPointOffset = pick(coord.axis.minPointOffset, 0);
                return isNumber(axisMin) && isNumber(axisMax) &&
                    coord.value >= (axisMin - minPointOffset) &&
                    coord.value <= (axisMax + minPointOffset) &&
                    // don't count navigator axis
                    !coord.axis.options.isInternal;
            })[0]; // If the axes overlap, return the first axis that was found.
        }
        /**
         * Get field type according to value
         *
         * @private
         *
         * @param {'boolean'|'number'|'string'} value
         * Atomic type (one of: string, number, boolean)
         *
         * @return {'checkbox'|'number'|'text'}
         * Field type (one of: text, number, checkbox)
         */
        function getFieldType(key, value) {
            var predefinedType = annotationsFieldsTypes[key];
            var fieldType = typeof value;
            if (defined(predefinedType)) {
                fieldType = predefinedType;
            }
            return {
                'string': 'text',
                'number': 'number',
                'boolean': 'checkbox'
            }[fieldType];
        }
        /* *
         *
         *  Default Export
         *
         * */
        var NavigationBindingUtilities = {
            annotationsFieldsTypes: annotationsFieldsTypes,
            getAssignedAxis: getAssignedAxis,
            getFieldType: getFieldType
        };

        return NavigationBindingUtilities;
    });
    _registerModule(_modules, 'Extensions/MouseWheelZoom/MouseWheelZoom.js', [_modules['Core/Utilities.js'], _modules['Extensions/Annotations/NavigationBindingsUtilities.js']], function (U, NBU) {
        /* *
         *
         *  (c) 2023 Torstein Honsi, Askel Eirik Johansson
         *
         *  License: www.highcharts.com/license
         *
         *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
         *
         * */
        var addEvent = U.addEvent, isObject = U.isObject, pick = U.pick, defined = U.defined, merge = U.merge, isNumber = U.isNumber;
        var getAssignedAxis = NBU.getAssignedAxis;
        /* *
         *
         *  Constants
         *
         * */
        var composedClasses = [], defaultOptions = {
            enabled: true,
            sensitivity: 1.1
        };
        /* *
         *
         *  Functions
         *
         * */
        /**
         * @private
         */
        var optionsToObject = function (options) {
            if (!isObject(options)) {
                return merge(defaultOptions, { enabled: defined(options) ? options : true });
            }
            return merge(defaultOptions, options);
        };
        /**
         * Fit a segment inside a range.
         * @private
         * @param {number} outerStart
         * Beginning of the range.
         * @param {number} outerWidth
         * Width of the range.
         * @param {number} innerStart
         * Beginning of the segment.
         * @param {number} innerWidth
         * Width of the segment.
         * @return {Object}
         * Object containing rangeStart and rangeWidth.
         */
        var fitToRange = function (outerStart, outerWidth, innerStart, innerWidth) {
            if (innerStart + innerWidth > outerStart + outerWidth) {
                if (innerWidth > outerWidth) {
                    innerWidth = outerWidth;
                    innerStart = outerStart;
                }
                else {
                    innerStart = outerStart + outerWidth - innerWidth;
                }
            }
            if (innerWidth > outerWidth) {
                innerWidth = outerWidth;
            }
            if (innerStart < outerStart) {
                innerStart = outerStart;
            }
            return {
                rangeStart: innerStart,
                rangeWidth: innerWidth
            };
        };
        var wheelTimer, startOnTick, endOnTick;
        /**
         * Temporarly disable `axis.startOnTick` and `axis.endOnTick` to allow zooming
         * for small values.
         * @private
        */
        var waitForAutomaticExtremes = function (axis) {
            var axisOptions = axis.options;
            // Options interfering with yAxis zoom by setExtremes() returning
            // integers by default.
            if (defined(wheelTimer)) {
                clearTimeout(wheelTimer);
            }
            if (!defined(startOnTick)) {
                startOnTick = axisOptions.startOnTick;
                endOnTick = axisOptions.endOnTick;
            }
            // Temporarily disable start and end on tick, because they would
            // prevent small increments of zooming.
            if (startOnTick || endOnTick) {
                axisOptions.startOnTick = false;
                axisOptions.endOnTick = false;
            }
            wheelTimer = setTimeout(function () {
                if (defined(startOnTick) && defined(endOnTick)) {
                    // Repeat merge after the wheel zoom is finished, #19178
                    axisOptions.startOnTick = startOnTick;
                    axisOptions.endOnTick = endOnTick;
                    // Set the extremes to the same as they already are, but now
                    // with the original startOnTick and endOnTick. We need
                    // `forceRedraw` otherwise it will detect that the values
                    // haven't changed. We do not use a simple yAxis.update()
                    // because it will destroy the ticks and prevent animation.
                    var _a = axis.getExtremes(), min = _a.min, max = _a.max;
                    axis.forceRedraw = true;
                    axis.setExtremes(min, max);
                    startOnTick = endOnTick = void 0;
                }
            }, 400);
        };
        /**
        * Calculate the ratio of mouse position on the axis to its length. If mousePos
        * doesn't exist, returns 0.5;
        * @private
        */
        var getMouseAxisRatio = function (chart, axis, mousePos) {
            if (!defined(mousePos)) {
                return 0.5;
            }
            var mouseAxisRatio = (mousePos - axis.minPixelPadding - axis.pos) /
                (axis.len - 2 * axis.minPixelPadding), // Prevent sticking (#19976)
            isXAxis = axis.isXAxis;
            if (isXAxis && (!axis.reversed !== !chart.inverted) ||
                !isXAxis && axis.reversed) {
                // We are taking into account that xAxis automatically gets
                // reversed when chart.inverted
                return 1 - mouseAxisRatio;
            }
            return mouseAxisRatio;
        };
        /**
        * Perform zooming on the passed axis.
        * @private
        * @param {Highcharts.Chart} chart
        * Chart object.
        * @param {Highcharts.Axis} axis
        * Axis to zoom.
        * @param {number} mousePos
        * Mouse position on the plot.
        * @param {number} howMuch
        * Amount of zoom to apply.
        * @param {number} centerArg
        * Mouse position in axis units.
        * @return {boolean}
        * True if axis extremes were changed.
        */
        var zoomOnDirection = function (chart, axis, mousePos, howMuch, centerArg) {
            var isXAxis = axis.isXAxis;
            var hasZoomed = false;
            if (defined(axis.max) && defined(axis.min) &&
                defined(axis.dataMax) && defined(axis.dataMin)) {
                if (!isXAxis) {
                    waitForAutomaticExtremes(axis);
                }
                var range = axis.max - axis.min, center = isNumber(centerArg) ? centerArg :
                    axis.min + range / 2, mouseAxisRatio = getMouseAxisRatio(chart, axis, mousePos), newRange = range * howMuch, newMin = center - newRange * mouseAxisRatio, dataRange = pick(axis.options.max, axis.dataMax) -
                    pick(axis.options.min, axis.dataMin), minPaddingOffset = axis.options.min ? 0 :
                    dataRange * axis.options.minPadding, maxPaddingOffset = axis.options.max ? 0 :
                    dataRange * axis.options.maxPadding, outerMin = pick(axis.options.min, axis.dataMin) - minPaddingOffset, outerRange = dataRange + maxPaddingOffset + minPaddingOffset, newExt = fitToRange(outerMin, outerRange, newMin, newRange), zoomOut = (newExt.rangeStart < pick(axis.options.min, outerMin) ||
                    newExt.rangeStart === axis.min &&
                        (newExt.rangeWidth > outerRange &&
                            newExt.rangeStart + newExt.rangeWidth <
                                pick(axis.options.max, Number.MIN_VALUE)) ||
                    newExt.rangeWidth === axis.max - axis.min);
                if (defined(howMuch) && !zoomOut) { // Zoom
                    axis.setExtremes(newExt.rangeStart, newExt.rangeStart + newExt.rangeWidth, false);
                    hasZoomed = true;
                }
                else { // Reset zoom
                    axis.setExtremes(void 0, void 0, false);
                }
            }
            return hasZoomed;
        };
        /**
         * @private
         */
        var zoomBy = function (chart, howMuch, xAxis, yAxis, mouseX, mouseY, options) {
            var type = pick(options.type, chart.zooming.type, ''), zoomX = /x/.test(type), zoomY = /y/.test(type);
            var centerXArg = xAxis.toValue(mouseX), centerYArg = yAxis.toValue(mouseY);
            if (chart.inverted) {
                var emulateRoof = yAxis.pos + yAxis.len;
                // Get the correct values
                centerXArg = xAxis.toValue(mouseY);
                centerYArg = yAxis.toValue(mouseX);
                // Swapping x and y for simplicity when chart is inverted.
                var tmp = mouseX;
                mouseX = mouseY;
                mouseY = emulateRoof - tmp + yAxis.pos;
            }
            var hasZoomedX = zoomX && zoomOnDirection(chart, xAxis, mouseX, howMuch, centerXArg), hasZoomedY = zoomY && zoomOnDirection(chart, yAxis, mouseY, howMuch, centerYArg), hasZoomed = hasZoomedX || hasZoomedY;
            if (hasZoomed) {
                chart.redraw(false);
            }
            return hasZoomed;
        };
        /**
         * @private
         */
        function onAfterGetContainer() {
            var _this = this;
            var chart = this, wheelZoomOptions = optionsToObject(chart.zooming.mouseWheel);
            if (wheelZoomOptions.enabled) {
                addEvent(this.container, 'wheel', function (e) {
                    e = _this.pointer.normalize(e);
                    var allowZoom = !chart.pointer.inClass(e.target, 'highcharts-no-mousewheel');
                    // Firefox uses e.detail, WebKit and IE uses deltaX, deltaY, deltaZ.
                    if (chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop) && allowZoom) {
                        var wheelSensitivity = wheelZoomOptions.sensitivity || 1.1, delta = e.detail || ((e.deltaY || 0) / 120), xAxisCoords = getAssignedAxis(_this.pointer.getCoordinates(e).xAxis), yAxisCoords = getAssignedAxis(_this.pointer.getCoordinates(e).yAxis);
                        var hasZoomed = zoomBy(chart, Math.pow(wheelSensitivity, delta), xAxisCoords ? xAxisCoords.axis : chart.xAxis[0], yAxisCoords ? yAxisCoords.axis : chart.yAxis[0], e.chartX, e.chartY, wheelZoomOptions);
                        // Prevent page scroll
                        if (hasZoomed && e.preventDefault) {
                            e.preventDefault();
                        }
                    }
                });
            }
        }
        /**
         * @private
         */
        function compose(ChartClass) {
            if (composedClasses.indexOf(ChartClass) === -1) {
                composedClasses.push(ChartClass);
                addEvent(ChartClass, 'afterGetContainer', onAfterGetContainer);
            }
        }
        /* *
         *
         *  Default Export
         *
         * */
        var MouseWheelZoomComposition = {
            compose: compose
        };
        /* *
         *
         *  API Options
         *
         * */
        /**
         * The mouse wheel zoom is a feature included in Highcharts Stock, but is also
         * available for Highcharts Core as a module. Zooming with the mouse wheel is
         * enabled by default in Highcharts Stock. In Highcharts Core it is enabled if
         * [chart.zooming.type](chart.zooming.type) is set. It can be disabled by
         * setting this option to `false`.
         *
         * @type      {boolean|object}
         * @since 11.1.0
         * @requires  modules/mouse-wheel-zoom
         * @sample    {highcharts} highcharts/mouse-wheel-zoom/enabled
         *            Enable or disable
         * @sample    {highstock} stock/mouse-wheel-zoom/enabled
         *            Enable or disable
         * @apioption chart.zooming.mouseWheel
         */
        /**
         * Zooming with the mouse wheel can be disabled by setting this option to
         * `false`.
         *
         * @type      {boolean}
         * @default   true
         * @since 11.1.0
         * @requires  modules/mouse-wheel-zoom
         * @apioption chart.zooming.mouseWheel.enabled
         */
        /**
         * Adjust the sensitivity of the zoom. Sensitivity of mouse wheel or trackpad
         * scrolling. `1` is no sensitivity, while with `2`, one mouse wheel delta will
         * zoom in `50%`.
         *
         * @type      {number}
         * @default   1.1
         * @since 11.1.0
         * @requires  modules/mouse-wheel-zoom
         * @sample    {highcharts} highcharts/mouse-wheel-zoom/sensitivity
         *            Change mouse wheel zoom sensitivity
         * @sample    {highstock} stock/mouse-wheel-zoom/sensitivity
         *            Change mouse wheel zoom sensitivity
         * @apioption chart.zooming.mouseWheel.sensitivity
         */
        /**
         * Decides in what dimensions the user can zoom scrolling the wheel. Can be one
         * of `x`, `y` or `xy`. In Highcharts Core, if not specified here, it will
         * inherit the type from [chart.zooming.type](chart.zooming.type). In Highcharts
         * Stock, it defaults to `x`.
         *
         * Note that particularly with mouse wheel in the y direction, the zoom is
         * affected by the default [yAxis.startOnTick](#yAxis.startOnTick) and
         * [endOnTick]((#yAxis.endOnTick)) settings. In order to respect these settings,
         * the zoom level will adjust after the user has stopped zooming. To prevent
         * this, consider setting `startOnTick` and `endOnTick` to `false`.
         *
         * @type      {string}
         * @default   {highcharts} undefined
         * @default   {highstock} x
         * @validvalue ["x", "y", "xy"]
         * @since 11.1.0
         * @requires  modules/mouse-wheel-zoom
         * @apioption chart.zooming.mouseWheel.type
         */
        (''); // Keeps doclets above in JS file

        return MouseWheelZoomComposition;
    });
    _registerModule(_modules, 'masters/modules/mouse-wheel-zoom.src.js', [_modules['Core/Globals.js'], _modules['Extensions/MouseWheelZoom/MouseWheelZoom.js']], function (Highcharts, MouseWheelZoom) {

        var G = Highcharts;
        MouseWheelZoom.compose(G.Chart);

    });
}));