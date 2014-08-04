/*

Ext Gantt 2.2.9
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/

Ext.define("Sch.locale.Locale", {
	l10n: null,
	legacyMode: true,
	constructor: function() {
		if (!Sch.locale.Active) {
			Sch.locale.Active = {};
			this.bindRequire()
		}
		var a = this.self.getName().split(".");
		a.pop();
		this.namespaceId = a.join(".");
		this.apply()
	},
	bindRequire: function() {
		var a = Ext.ClassManager.triggerCreated;
		Ext.ClassManager.triggerCreated = function(d) {
			a.apply(this, arguments);
			var c = Ext.ClassManager.get(d);
			for (var b in Sch.locale.Active) {
				Sch.locale.Active[b].apply(c)
			}
		}
	},
	apply: function(a) {
		if (this.l10n) {
			var h = this,
			f,
			e;
			var g = this.self.getName();
			var d = function(l, k) {
				k = k || Ext.ClassManager.get(l);
				if (k && (k.activeLocaleId !== g)) {
					var i = h.l10n[l];
					if (typeof i === "function") {
						i(l)
					} else {
						if (k.singleton) {
							k.l10n = Ext.apply(k.l10n || {},
							i)
						} else {
							Ext.override(k, {
								l10n: i
							})
						}
					}
					if (h.legacyMode) {
						var n;
						if (k.prototype) {
							n = k.prototype
						} else {
							if (k.singleton) {
								n = k
							}
						}
						if (n) {
							if (n.legacyHolderProp) {
								if (!n[n.legacyHolderProp]) {
									n[n.legacyHolderProp] = {}
								}
								n = n[n.legacyHolderProp]
							}
							for (var m in i) {
								if (typeof n[m] !== "function") {
									n[m] = i[m]
								}
							}
						}
					}
					k.activeLocaleId = g;
					if (k.onLocalized) {
						k.onLocalized()
					}
				}
			};
			if (a) {
				if (!Ext.isArray(a)) {
					a = [a]
				}
				var b,
				j;
				for (f = 0, e = a.length; f < e; f++) {
					if (Ext.isObject(a[f])) {
						if (a[f].singleton) {
							j = a[f];
							b = Ext.getClassName(Ext.getClass(j))
						} else {
							j = Ext.getClass(a[f]);
							b = Ext.getClassName(j)
						}
					} else {
						j = null;
						b = "string" === typeof a[f] ? a[f] : Ext.getClassName(a[f])
					}
					if (b && b in this.l10n) {
						d(b, j)
					}
				}
			} else {
				Sch.locale.Active[this.namespaceId] = this;
				for (var c in this.l10n) {
					d(c)
				}
			}
		}
	}
});
Ext.define("Sch.locale.En", {
	extend: "Sch.locale.Locale",
	singleton: true,
	l10n: {
		"Sch.util.Date": {
			unitNames: {
				YEAR: {
					single: "year",
					plural: "years",
					abbrev: "yr"
				},
				QUARTER: {
					single: "quarter",
					plural: "quarters",
					abbrev: "q"
				},
				MONTH: {
					single: "month",
					plural: "months",
					abbrev: "mon"
				},
				WEEK: {
					single: "week",
					plural: "weeks",
					abbrev: "w"
				},
				DAY: {
					single: "day",
					plural: "days",
					abbrev: "d"
				},
				HOUR: {
					single: "hour",
					plural: "hours",
					abbrev: "h"
				},
				MINUTE: {
					single: "minute",
					plural: "minutes",
					abbrev: "min"
				},
				SECOND: {
					single: "second",
					plural: "seconds",
					abbrev: "s"
				},
				MILLI: {
					single: "ms",
					plural: "ms",
					abbrev: "ms"
				}
			}
		},
		"Sch.plugin.CurrentTimeLine": {
			tooltipText: "Current time"
		},
		"Sch.plugin.EventEditor": {
			saveText: "Save",
			deleteText: "Delete",
			cancelText: "Cancel"
		},
		"Sch.plugin.SimpleEditor": {
			newEventText: "New booking..."
		},
		"Sch.widget.ExportDialog": {
			generalError: "An error occured, try again.",
			title: "Export Settings",
			formatFieldLabel: "Paper format",
			orientationFieldLabel: "Orientation",
			rangeFieldLabel: "Export range",
			showHeaderLabel: "Add page number",
			orientationPortraitText: "Portrait",
			orientationLandscapeText: "Landscape",
			completeViewText: "Complete schedule",
			currentViewText: "Current view",
			dateRangeText: "Date range",
			dateRangeFromText: "Export from",
			pickerText: "Resize column/rows to desired value",
			dateRangeToText: "Export to",
			exportButtonText: "Export",
			cancelButtonText: "Cancel",
			progressBarText: "Exporting...",
			exportToSingleLabel: "Export as single page",
			adjustCols: "Adjust column width",
			adjustColsAndRows: "Adjust column width and row height",
			specifyDateRange: "Specify date range"
		},
		"Sch.preset.Manager": function() {
			var b = Sch.preset.Manager,
			a = b.getPreset("hourAndDay");
			if (a) {
				a.displayDateFormat = "G:i";
				a.headerConfig.middle.dateFormat = "G:i";
				a.headerConfig.top.dateFormat = "D m-d"
			}
			a = b.getPreset("dayAndWeek");
			if (a) {
				a.displayDateFormat = "m-d h:i A";
				a.headerConfig.middle.dateFormat = "D d M"
			}
			a = b.getPreset("weekAndDay");
			if (a) {
				a.displayDateFormat = "m-d";
				a.headerConfig.bottom.dateFormat = "d M";
				a.headerConfig.middle.dateFormat = "Y F d"
			}
			a = b.getPreset("weekAndMonth");
			if (a) {
				a.displayDateFormat = "Y-m-d";
				a.headerConfig.middle.dateFormat = "m-d";
				a.headerConfig.top.dateFormat = "Y-m-d"
			}
			a = b.getPreset("weekAndDayLetter");
			if (a) {
				a.displayDateFormat = "Y-m-d";
				a.headerConfig.middle.dateFormat = "D d M Y"
			}
			a = b.getPreset("weekDateAndMonth");
			if (a) {
				a.displayDateFormat = "Y-m-d";
				a.headerConfig.middle.dateFormat = "d";
				a.headerConfig.top.dateFormat = "Y F"
			}
			a = b.getPreset("monthAndYear");
			if (a) {
				a.displayDateFormat = "Y-m-d";
				a.headerConfig.middle.dateFormat = "M Y";
				a.headerConfig.top.dateFormat = "Y"
			}
			a = b.getPreset("year");
			if (a) {
				a.displayDateFormat = "Y-m-d";
				a.headerConfig.middle.dateFormat = "Y"
			}
			a = b.getPreset("manyyears");
			if (a) {
				a.displayDateFormat = "Y-m-d";
				a.headerConfig.middle.dateFormat = "Y"
			}
		}
	}
});
Ext.define("Sch.util.Patch", {
	target: null,
	minVersion: null,
	maxVersion: null,
	reportUrl: null,
	description: null,
	applyFn: null,
	ieOnly: false,
	overrides: null,
	onClassExtended: function(a, b) {
		if (Sch.disableOverrides) {
			return
		}
		if (b.ieOnly && !Ext.isIE) {
			return
		}
		if ((!b.minVersion || Ext.versions.extjs.equals(b.minVersion) || Ext.versions.extjs.isGreaterThan(b.minVersion)) && (!b.maxVersion || Ext.versions.extjs.equals(b.maxVersion) || Ext.versions.extjs.isLessThan(b.maxVersion))) {
			if (b.applyFn) {
				b.applyFn()
			} else {
				Ext.ClassManager.get(b.target).override(b.overrides)
			}
		}
	}
});
Ext.define("Sch.patches.ElementScroll", {
	override: "Sch.mixin.TimelineView",
	_onAfterRender: function() {
		this.callParent(arguments);
		if (Ext.versions.extjs.isLessThan("4.2.1")) {
			return
		}
		this.el.scroll = function(i, a, c) {
			if (!this.isScrollable()) {
				return false
			}
			i = i.substr(0, 1);
			var h = this,
			e = h.dom,
			g = i === "r" || i === "l" ? "left": "top",
			b = false,
			d,
			f;
			if (i === "r" || i === "t" || i === "u") {
				a = -a
			}
			if (g === "left") {
				d = e.scrollLeft;
				f = h.constrainScrollLeft(d + a)
			} else {
				d = e.scrollTop;
				f = h.constrainScrollTop(d + a)
			}
			if (f !== d) {
				this.scrollTo(g, f, c);
				b = true
			}
			return b
		}
	}
});
Ext.define("Sch.mixin.Localizable", {
	requires: [typeof Sch != "undefined" && Sch.config && Sch.config.locale || "Sch.locale.En"],
	legacyMode: true,
	activeLocaleId: "",
	l10n: null,
	isLocaleApplied: function() {
		var b = (this.singleton && this.activeLocaleId) || this.self.activeLocaleId;
		if (!b) {
			return false
		}
		for (var a in Sch.locale.Active) {
			if (b === Sch.locale.Active[a].self.getName()) {
				return true
			}
		}
		return false
	},
	applyLocale: function() {
		for (var a in Sch.locale.Active) {
			Sch.locale.Active[a].apply(this.singleton ? this: this.self.getName())
		}
	},
	L: function() {
		return this.localize.apply(this, arguments)
	},
	localize: function(b, d, g) {
		if (!this.isLocaleApplied() && !g) {
			this.applyLocale()
		}
		if (this.hasOwnProperty("l10n") && this.l10n.hasOwnProperty(b) && "function" != typeof this.l10n[b]) {
			return this.l10n[b]
		}
		var c = this.self && this.self.prototype;
		if (this.legacyMode) {
			var a = d || this.legacyHolderProp;
			var h = a ? this[a] : this;
			if (h && h.hasOwnProperty(b) && "function" != typeof h[b]) {
				return h[b]
			}
			if (c) {
				var e = a ? c[a] : c;
				if (e && e.hasOwnProperty(b) && "function" != typeof e[b]) {
					return e[b]
				}
			}
		}
		var i = c.l10n[b];
		if (i === null || i === undefined) {
			var f = c && c.superclass;
			if (f && f.localize) {
				i = f.localize(b, d, g)
			}
			if (i === null || i === undefined) {
				throw "Cannot find locale: " + b + " [" + this.self.getName() + "]"
			}
		}
		return i
	}
});
Ext.define("Sch.util.Date", {
	requires: "Ext.Date",
	mixins: ["Sch.mixin.Localizable"],
	singleton: true,
	stripEscapeRe: /(\\.)/g,
	hourInfoRe: /([gGhHisucUOPZ]|MS)/,
	unitHash: null,
	unitsByName: {},
	constructor: function() {
		var a = Ext.Date;
		var c = this.unitHash = {
			MILLI: a.MILLI,
			SECOND: a.SECOND,
			MINUTE: a.MINUTE,
			HOUR: a.HOUR,
			DAY: a.DAY,
			WEEK: "w",
			MONTH: a.MONTH,
			QUARTER: "q",
			YEAR: a.YEAR
		};
		Ext.apply(this, c);
		var b = this;
		this.units = [b.MILLI, b.SECOND, b.MINUTE, b.HOUR, b.DAY, b.WEEK, b.MONTH, b.QUARTER, b.YEAR]
	},
	onLocalized: function() {
		this.setUnitNames(this.L("unitNames"))
	},
	setUnitNames: function(f, b) {
		var e = this.unitsByName = {};
		this.l10n.unitNames = f;
		this._unitNames = Ext.apply({},
		f);
		var c = this.unitHash;
		for (var a in c) {
			if (c.hasOwnProperty(a)) {
				var d = c[a];
				this._unitNames[d] = this._unitNames[a];
				e[a] = d;
				e[d] = d
			}
		}
	},
	betweenLesser: function(b, d, a) {
		var c = b.getTime();
		return d.getTime() <= c && c < a.getTime()
	},
	constrain: function(b, c, a) {
		return this.min(this.max(b, c), a)
	},
	compareUnits: function(c, b) {
		var a = Ext.Array.indexOf(this.units, c),
		d = Ext.Array.indexOf(this.units, b);
		return a > d ? 1: (a < d ? -1: 0)
	},
	isUnitGreater: function(b, a) {
		return this.compareUnits(b, a) > 0
	},
	copyTimeValues: function(b, a) {
		b.setHours(a.getHours());
		b.setMinutes(a.getMinutes());
		b.setSeconds(a.getSeconds());
		b.setMilliseconds(a.getMilliseconds())
	},
	add: function(b, c, e) {
		var f = Ext.Date.clone(b);
		if (!c || e === 0) {
			return f
		}
		switch (c.toLowerCase()) {
		case this.MILLI:
			f = new Date(b.getTime() + e);
			break;
		case this.SECOND:
			f = new Date(b.getTime() + (e * 1000));
			break;
		case this.MINUTE:
			f = new Date(b.getTime() + (e * 60000));
			break;
		case this.HOUR:
			f = new Date(b.getTime() + (e * 3600000));
			break;
		case this.DAY:
			f.setDate(b.getDate() + e);
			break;
		case this.WEEK:
			f.setDate(b.getDate() + e * 7);
			break;
		case this.MONTH:
			var a = b.getDate();
			if (a > 28) {
				a = Math.min(a, Ext.Date.getLastDateOfMonth(this.add(Ext.Date.getFirstDateOfMonth(b), this.MONTH, e)).getDate())
			}
			f.setDate(a);
			f.setMonth(f.getMonth() + e);
			break;
		case this.QUARTER:
			f = this.add(b, this.MONTH, e * 3);
			break;
		case this.YEAR:
			f.setFullYear(b.getFullYear() + e);
			break
		}
		return f
	},
	getMeasuringUnit: function(a) {
		if (a === this.WEEK) {
			return this.DAY
		}
		return a
	},
	getDurationInUnit: function(d, a, c) {
		var b;
		switch (c) {
		case this.YEAR:
			b = Math.round(this.getDurationInYears(d, a));
			break;
		case this.QUARTER:
			b = Math.round(this.getDurationInMonths(d, a) / 3);
			break;
		case this.MONTH:
			b = Math.round(this.getDurationInMonths(d, a));
			break;
		case this.WEEK:
			b = Math.round(this.getDurationInDays(d, a)) / 7;
			break;
		case this.DAY:
			b = Math.round(this.getDurationInDays(d, a));
			break;
		case this.HOUR:
			b = Math.round(this.getDurationInHours(d, a));
			break;
		case this.MINUTE:
			b = Math.round(this.getDurationInMinutes(d, a));
			break;
		case this.SECOND:
			b = Math.round(this.getDurationInSeconds(d, a));
			break;
		case this.MILLI:
			b = Math.round(this.getDurationInMilliseconds(d, a));
			break
		}
		return b
	},
	getUnitToBaseUnitRatio: function(b, a) {
		if (b === a) {
			return 1
		}
		switch (b) {
		case this.YEAR:
			switch (a) {
			case this.QUARTER:
				return 1 / 4;
			case this.MONTH:
				return 1 / 12
			}
			break;
		case this.QUARTER:
			switch (a) {
			case this.YEAR:
				return 4;
			case this.MONTH:
				return 1 / 3
			}
			break;
		case this.MONTH:
			switch (a) {
			case this.YEAR:
				return 12;
			case this.QUARTER:
				return 3
			}
			break;
		case this.WEEK:
			switch (a) {
			case this.DAY:
				return 1 / 7;
			case this.HOUR:
				return 1 / 168
			}
			break;
		case this.DAY:
			switch (a) {
			case this.WEEK:
				return 7;
			case this.HOUR:
				return 1 / 24;
			case this.MINUTE:
				return 1 / 1440
			}
			break;
		case this.HOUR:
			switch (a) {
			case this.DAY:
				return 24;
			case this.MINUTE:
				return 1 / 60
			}
			break;
		case this.MINUTE:
			switch (a) {
			case this.HOUR:
				return 60;
			case this.SECOND:
				return 1 / 60;
			case this.MILLI:
				return 1 / 60000
			}
			break;
		case this.SECOND:
			switch (a) {
			case this.MILLI:
				return 1 / 1000
			}
			break;
		case this.MILLI:
			switch (a) {
			case this.SECOND:
				return 1000
			}
			break
		}
		return - 1
	},
	getDurationInMilliseconds: function(b, a) {
		return (a - b)
	},
	getDurationInSeconds: function(b, a) {
		return (a - b) / 1000
	},
	getDurationInMinutes: function(b, a) {
		return (a - b) / 60000
	},
	getDurationInHours: function(b, a) {
		return (a - b) / 3600000
	},
	getDurationInDays: function(b, a) {
		return (a - b) / 86400000
	},
	getDurationInBusinessDays: function(g, b) {
		var c = Math.round((b - g) / 86400000),
		a = 0,
		f;
		for (var e = 0; e < c; e++) {
			f = this.add(g, this.DAY, e).getDay();
			if (f !== 6 && f !== 0) {
				a++
			}
		}
		return a
	},
	getDurationInMonths: function(b, a) {
		return ((a.getFullYear() - b.getFullYear()) * 12) + (a.getMonth() - b.getMonth())
	},
	getDurationInYears: function(b, a) {
		return this.getDurationInMonths(b, a) / 12
	},
	min: function(b, a) {
		return b < a ? b: a
	},
	max: function(b, a) {
		return b > a ? b: a
	},
	intersectSpans: function(c, d, b, a) {
		return this.betweenLesser(c, b, a) || this.betweenLesser(b, c, d)
	},
	getNameOfUnit: function(a) {
		a = this.getUnitByName(a);
		switch (a.toLowerCase()) {
		case this.YEAR:
			return "YEAR";
		case this.QUARTER:
			return "QUARTER";
		case this.MONTH:
			return "MONTH";
		case this.WEEK:
			return "WEEK";
		case this.DAY:
			return "DAY";
		case this.HOUR:
			return "HOUR";
		case this.MINUTE:
			return "MINUTE";
		case this.SECOND:
			return "SECOND";
		case this.MILLI:
			return "MILLI"
		}
		throw "Incorrect UnitName"
	},
	getReadableNameOfUnit: function(b, a) {
		if (!this.isLocaleApplied()) {
			this.applyLocale()
		}
		return this._unitNames[b][a ? "plural": "single"]
	},
	getShortNameOfUnit: function(a) {
		if (!this.isLocaleApplied()) {
			this.applyLocale()
		}
		return this._unitNames[a].abbrev
	},
	getUnitByName: function(a) {
		if (!this.isLocaleApplied()) {
			this.applyLocale()
		}
		if (!this.unitsByName[a]) {
			Ext.Error.raise("Unknown unit name: " + a)
		}
		return this.unitsByName[a]
	},
	getNext: function(c, g, a, f) {
		var e = Ext.Date.clone(c);
		f = arguments.length < 4 ? 1: f;
		a = a || 1;
		switch (g) {
		case this.MILLI:
			e = this.add(c, g, a);
			break;
		case this.SECOND:
			e = this.add(c, g, a);
			e.setMilliseconds(0);
			break;
		case this.MINUTE:
			e = this.add(c, g, a);
			e.setSeconds(0);
			e.setMilliseconds(0);
			break;
		case this.HOUR:
			e = this.add(c, g, a);
			e.setMinutes(0);
			e.setSeconds(0);
			e.setMilliseconds(0);
			break;
		case this.DAY:
			var d = c.getHours() === 23 && this.add(e, this.HOUR, 1).getHours() === 1;
			if (d) {
				e = this.add(e, this.DAY, 2);
				Ext.Date.clearTime(e);
				return e
			}
			Ext.Date.clearTime(e);
			e = this.add(e, this.DAY, a);
			break;
		case this.WEEK:
			Ext.Date.clearTime(e);
			var b = e.getDay();
			e = this.add(e, this.DAY, f - b + 7 * (a - (f <= b ? 0: 1)));
			if (e.getDay() !== f) {
				e = this.add(e, this.HOUR, 1)
			} else {
				Ext.Date.clearTime(e)
			}
			break;
		case this.MONTH:
			e = this.add(e, this.MONTH, a);
			e.setDate(1);
			Ext.Date.clearTime(e);
			break;
		case this.QUARTER:
			e = this.add(e, this.MONTH, ((a - 1) * 3) + (3 - (e.getMonth() % 3)));
			Ext.Date.clearTime(e);
			e.setDate(1);
			break;
		case this.YEAR:
			e = new Date(e.getFullYear() + a, 0, 1);
			break;
		default:
			throw "Invalid date unit"
		}
		return e
	},
	getNumberOfMsFromTheStartOfDay: function(a) {
		return a - Ext.Date.clearTime(a, true) || 86400000
	},
	getNumberOfMsTillTheEndOfDay: function(a) {
		return this.getStartOfNextDay(a, true) - a
	},
	getStartOfNextDay: function(b, f, e) {
		var d = this.add(e ? b: Ext.Date.clearTime(b, f), this.DAY, 1);
		if (d.getDate() == b.getDate()) {
			var c = this.add(Ext.Date.clearTime(b, f), this.DAY, 2).getTimezoneOffset();
			var a = b.getTimezoneOffset();
			d = this.add(d, this.MINUTE, a - c)
		}
		return d
	},
	getEndOfPreviousDay: function(b, c) {
		var a = c ? b: Ext.Date.clearTime(b, true);
		if (a - b) {
			return a
		} else {
			return this.add(a, this.DAY, -1)
		}
	},
	timeSpanContains: function(c, b, d, a) {
		return (d - c) >= 0 && (b - a) >= 0
	}
});
Ext.define("Sch.util.DragTracker", {
	extend: "Ext.dd.DragTracker",
	xStep: 1,
	yStep: 1,
	setXStep: function(a) {
		this.xStep = a
	},
	setYStep: function(a) {
		this.yStep = a
	},
	getRegion: function() {
		var e = this.startXY,
		d = this.getXY(),
		b = Math.min(e[0], d[0]),
		f = Math.min(e[1], d[1]),
		c = Math.abs(e[0] - d[0]),
		a = Math.abs(e[1] - d[1]);
		return new Ext.util.Region(f, b + c, f + a, b)
	},
	onMouseDown: function(f, d) {
		if (this.disabled || f.dragTracked) {
			return
		}
		var c = f.getXY(),
		g,
		b,
		a = c[0],
		h = c[1];
		if (this.xStep > 1) {
			g = this.el.getX();
			a -= g;
			a = Math.round(a / this.xStep) * this.xStep;
			a += g
		}
		if (this.yStep > 1) {
			b = this.el.getY();
			h -= b;
			h = Math.round(h / this.yStep) * this.yStep;
			h += b
		}
		this.dragTarget = this.delegate ? d: this.handle.dom;
		this.startXY = this.lastXY = [a, h];
		this.startRegion = Ext.fly(this.dragTarget).getRegion();
		if (this.fireEvent("mousedown", this, f) === false || this.fireEvent("beforedragstart", this, f) === false || this.onBeforeStart(f) === false) {
			return
		}
		this.mouseIsDown = true;
		f.dragTracked = true;
		if (this.preventDefault !== false) {
			f.preventDefault()
		}
		Ext.getDoc().on({
			scope: this,
			mouseup: this.onMouseUp,
			mousemove: this.onMouseMove,
			selectstart: this.stopSelect
		});
		if (this.autoStart) {
			this.timer = Ext.defer(this.triggerStart, this.autoStart === true ? 1000: this.autoStart, this, [f])
		}
	},
	onMouseMove: function(g, f) {
		if (this.active && Ext.isIE && Ext.ieVersion < 10 && !g.browserEvent.button) {
			g.preventDefault();
			this.onMouseUp(g);
			return
		}
		g.preventDefault();
		var d = g.getXY(),
		b = this.startXY;
		if (!this.active) {
			if (Math.max(Math.abs(b[0] - d[0]), Math.abs(b[1] - d[1])) > this.tolerance) {
				this.triggerStart(g)
			} else {
				return
			}
		}
		var a = d[0],
		h = d[1];
		if (this.xStep > 1) {
			a -= this.startXY[0];
			a = Math.round(a / this.xStep) * this.xStep;
			a += this.startXY[0]
		}
		if (this.yStep > 1) {
			h -= this.startXY[1];
			h = Math.round(h / this.yStep) * this.yStep;
			h += this.startXY[1]
		}
		var c = this.xStep > 1 || this.yStep > 1;
		if (!c || a !== d[0] || h !== d[1]) {
			this.lastXY = [a, h];
			if (this.fireEvent("mousemove", this, g) === false) {
				this.onMouseUp(g)
			} else {
				this.onDrag(g);
				this.fireEvent("drag", this, g)
			}
		}
	}
});
Ext.define("Sch.model.Customizable", {
	extend: "Ext.data.Model",
	idProperty: null,
	customizableFields: null,
	previous: null,
	onClassExtended: function(b, d, a) {
		var c = a.onBeforeCreated;
		a.onBeforeCreated = function(f, k) {
			c.call(this, f, k);
			var j = f.prototype;
			if (!j.customizableFields) {
				return
			}
			j.customizableFields = (f.superclass.customizableFields || []).concat(j.customizableFields);
			var g = j.customizableFields;
			var i = {};
			Ext.Array.each(g,
			function(l) {
				if (typeof l == "string") {
					l = {
						name: l
					}
				}
				i[l.name] = l
			});
			var e = j.fields;
			var h = [];
			e.each(function(l) {
				if (l.isCustomizableField) {
					h.push(l)
				}
			});
			e.removeAll(h);
			Ext.Object.each(i,
			function(l, o) {
				o.isCustomizableField = true;
				var p = o.name || o.getName();
				var t = p === "Id" ? "idProperty": p.charAt(0).toLowerCase() + p.substr(1) + "Field";
				var q = j[t];
				var s = q || p;
				if (e.containsKey(s)) {
					e.getByKey(s).isCustomizableField = true;
					g.push(new Ext.data.Field(Ext.applyIf({
						name: p,
						isCustomizableField: true
					},
					e.getByKey(s))))
				} else {
					e.add(new Ext.data.Field(Ext.applyIf({
						name: s,
						isCustomizableField: true
					},
					o)))
				}
				var n = Ext.String.capitalize(p);
				if (n != "Id") {
					var r = "get" + n;
					var m = "set" + n;
					if (!j[r] || j[r].__getterFor__ && j[r].__getterFor__ != s) {
						j[r] = function() {
							return this.data[s]
						};
						j[r].__getterFor__ = s
					}
					if (!j[m] || j[m].__setterFor__ && j[m].__setterFor__ != s) {
						j[m] = function(u) {
							return this.set(s, u)
						};
						j[m].__setterFor__ = s
					}
				}
			})
		}
	},
	set: function(d, b) {
		var a;
		this.previous = this.previous || {};
		if (arguments.length > 1) {
			a = this.get(d);
			if (a !== b) {
				this.previous[d] = a
			}
		} else {
			for (var c in d) {
				a = this.get(c);
				if (a !== d[c]) {
					this.previous[c] = a
				}
			}
		}
		this.callParent(arguments)
	},
	afterEdit: function() {
		this.callParent(arguments);
		delete this.previous
	},
	reject: function() {
		var b = this,
		a = b.modified,
		c;
		b.previous = b.previous || {};
		for (c in a) {
			if (a.hasOwnProperty(c)) {
				if (typeof a[c] != "function") {
					b.previous[c] = b.get(c)
				}
			}
		}
		b.callParent(arguments);
		delete b.previous
	}
});
Ext.define("Sch.data.mixin.EventStore", {
	model: "Sch.model.Event",
	config: {
		model: "Sch.model.Event"
	},
	requires: ["Sch.util.Date"],
	isEventStore: true,
	setResourceStore: function(a) {
		if (this.resourceStore) {
			this.resourceStore.un({
				beforesync: this.onResourceStoreBeforeSync,
				write: this.onResourceStoreWrite,
				scope: this
			})
		}
		this.resourceStore = a;
		if (a) {
			a.on({
				beforesync: this.onResourceStoreBeforeSync,
				write: this.onResourceStoreWrite,
				scope: this
			})
		}
	},
	onResourceStoreBeforeSync: function(b, c) {
		var a = b.create;
		if (a) {
			for (var e, d = a.length - 1; d >= 0; d--) {
				e = a[d];
				e._phantomId = e.internalId
			}
		}
	},
	onResourceStoreWrite: function(c, b) {
		if (b.wasSuccessful()) {
			var d = this,
			a = b.getRecords();
			Ext.each(a,
			function(e) {
				if (e._phantomId && !e.phantom) {
					d.each(function(f) {
						if (f.getResourceId() === e._phantomId) {
							f.assign(e)
						}
					})
				}
			})
		}
	},
	isDateRangeAvailable: function(f, a, b, d) {
		var c = true,
		e = Sch.util.Date;
		this.forEachScheduledEvent(function(h, g, i) {
			if (e.intersectSpans(f, a, g, i) && d === h.getResource() && (!b || b !== h)) {
				c = false;
				return false
			}
		});
		return c
	},
	getEventsInTimeSpan: function(d, b, a) {
		if (a !== false) {
			var c = Sch.util.Date;
			return this.queryBy(function(g) {
				var f = g.getStartDate(),
				e = g.getEndDate();
				return f && e && c.intersectSpans(f, e, d, b)
			})
		} else {
			return this.queryBy(function(g) {
				var f = g.getStartDate(),
				e = g.getEndDate();
				return f && e && (f - d >= 0) && (b - e >= 0)
			})
		}
	},
	forEachScheduledEvent: function(b, a) {
		this.each(function(e) {
			var d = e.getStartDate(),
			c = e.getEndDate();
			if (d && c) {
				return b.call(a || this, e, d, c)
			}
		},
		this)
	},
	getTotalTimeSpan: function() {
		var a = new Date(9999, 0, 1),
		b = new Date(0),
		c = Sch.util.Date;
		this.each(function(d) {
			if (d.getStartDate()) {
				a = c.min(d.getStartDate(), a)
			}
			if (d.getEndDate()) {
				b = c.max(d.getEndDate(), b)
			}
		});
		a = a < new Date(9999, 0, 1) ? a: null;
		b = b > new Date(0) ? b: null;
		return {
			start: a || null,
			end: b || a || null
		}
	},
	getEventsForResource: function(e) {
		var c = [],
		d,
		f = e.getId() || e.internalId;
		for (var b = 0, a = this.getCount(); b < a; b++) {
			d = this.getAt(b);
			if (d.data[d.resourceIdField] == f) {
				c.push(d)
			}
		}
		return c
	},
	append: function(a) {
		throw "Must be implemented by consuming class"
	}
});
Ext.define("Sch.model.Range", {
	extend: "Sch.model.Customizable",
	requires: ["Sch.util.Date"],
	idProperty: "Id",
	startDateField: "StartDate",
	endDateField: "EndDate",
	nameField: "Name",
	clsField: "Cls",
	customizableFields: [{
		name: "StartDate",
		type: "date",
		dateFormat: "c"
	},
	{
		name: "EndDate",
		type: "date",
		dateFormat: "c"
	},
	{
		name: "Cls",
		type: "string"
	},
	{
		name: "Name",
		type: "string"
	}],
	setStartDate: function(a, d) {
		var c = this.getEndDate();
		var b = this.getStartDate();
		this.set(this.startDateField, a);
		if (d === true && c && b) {
			this.setEndDate(Sch.util.Date.add(a, Sch.util.Date.MILLI, c - b))
		}
	},
	setEndDate: function(b, d) {
		var a = this.getStartDate();
		var c = this.getEndDate();
		this.set(this.endDateField, b);
		if (d === true && a && c) {
			this.setStartDate(Sch.util.Date.add(b, Sch.util.Date.MILLI, -(c - a)))
		}
	},
	setStartEndDate: function(b, a) {
		this.beginEdit();
		this.set(this.startDateField, b);
		this.set(this.endDateField, a);
		this.endEdit()
	},
	getDates: function() {
		var c = [],
		b = this.getEndDate();
		for (var a = Ext.Date.clearTime(this.getStartDate(), true); a < b; a = Sch.util.Date.add(a, Sch.util.Date.DAY, 1)) {
			c.push(a)
		}
		return c
	},
	forEachDate: function(b, a) {
		return Ext.each(this.getDates(), b, a)
	},
	isValid: function() {
		var b = this.callParent(arguments);
		if (b) {
			var c = this.getStartDate(),
			a = this.getEndDate();
			b = !c || !a || (a - c >= 0)
		}
		return b
	},
	shift: function(b, a) {
		this.setStartEndDate(Sch.util.Date.add(this.getStartDate(), b, a), Sch.util.Date.add(this.getEndDate(), b, a))
	}
});
Ext.define("Sch.model.TimeAxisTick", {
	extend: "Sch.model.Range",
	startDateField: "start",
	endDateField: "end"
});
Ext.define("Sch.model.Resource", {
	extend: "Sch.model.Customizable",
	idProperty: "Id",
	config: {
		idProperty: "Id"
	},
	nameField: "Name",
	customizableFields: ["Id", {
		name: "Name",
		type: "string"
	}],
	getEventStore: function() {
		return this.stores[0] && this.stores[0].eventStore || this.parentNode && this.parentNode.getEventStore()
	},
	getEvents: function(d) {
		var c = [],
		e,
		f = this.getId() || this.internalId;
		d = d || this.getEventStore();
		for (var b = 0, a = d.getCount(); b < a; b++) {
			e = d.getAt(b);
			if (e.data[e.resourceIdField] === f) {
				c.push(e)
			}
		}
		return c
	}
});
Ext.define("Sch.data.mixin.ResourceStore", {});
Ext.define("Sch.data.FilterableNodeStore", {
	extend: "Ext.data.NodeStore",
	onNodeExpand: function(f, d, c) {
		var b = [];
		for (var e = 0; e < d.length; e++) {
			var a = d[e];
			if (! (a.isHidden && a.isHidden() || a.hidden || a.data.hidden)) {
				b[b.length] = a
			}
		}
		return this.callParent([f, b, c])
	}
});
Ext.define("Sch.data.mixin.FilterableTreeStore", {
	requires: ["Sch.data.FilterableNodeStore"],
	nodeStoreClassName: "Sch.data.FilterableNodeStore",
	nodeStore: null,
	isFilteredFlag: false,
	lastTreeFilter: null,
	initTreeFiltering: function() {
		if (!this.nodeStore) {
			this.nodeStore = this.createNodeStore(this)
		}
		this.addEvents("filter-set", "filter-clear", "nodestore-datachange-start", "nodestore-datachange-end")
	},
	createNodeStore: function(a) {
		return Ext.create(this.nodeStoreClassName, {
			treeStore: a,
			recursive: true,
			rootVisible: this.rootVisible
		})
	},
	clearTreeFilter: function() {
		if (!this.isTreeFiltered()) {
			return
		}
		this.refreshNodeStoreContent();
		this.isFilteredFlag = false;
		this.lastTreeFilter = null;
		this.fireEvent("filter-clear", this)
	},
	refreshNodeStoreContent: function(f) {
		var a = this.getRootNode(),
		d = [];
		var c = this.rootVisible;
		var b = function(i) {
			if (i.isHidden && i.isHidden() || i.hidden || i.data.hidden) {
				return
			}
			if (c || i != a) {
				d[d.length] = i
			}
			if (!i.data.leaf && i.isExpanded()) {
				var j = i.childNodes,
				h = j.length;
				for (var g = 0; g < h; g++) {
					b(j[g])
				}
			}
		};
		b(a);
		this.fireEvent("nodestore-datachange-start", this);
		var e = this.nodeStore;
		if (!this.loadDataInNodeStore || !this.loadDataInNodeStore(d)) {
			e.loadRecords(d)
		}
		if (!f) {
			e.fireEvent("clear", e)
		}
		this.fireEvent("nodestore-datachange-end", this)
	},
	getIndexInTotalDataset: function(b) {
		var a = this.getRootNode(),
		d = -1;
		var e = this.rootVisible;
		if (!e && b == a) {
			return - 1
		}
		var c = function(h) {
			if (h.isHidden && h.isHidden() || h.hidden || h.data.hidden) {
				if (h == b) {
					return false
				}
			}
			if (e || h != a) {
				d++
			}
			if (h == b) {
				return false
			}
			if (!h.data.leaf && h.isExpanded()) {
				var i = h.childNodes,
				g = i.length;
				for (var f = 0; f < g; f++) {
					if (c(i[f]) === false) {
						return false
					}
				}
			}
		};
		c(a);
		return d
	},
	isTreeFiltered: function() {
		return this.isFilteredFlag
	},
	filterTreeBy: function(s, b) {
		var g;
		if (arguments.length == 1 && Ext.isObject(arguments[0])) {
			b = s.scope;
			g = s.filter
		} else {
			g = s;
			s = {
				filter: g
			}
		}
		this.fireEvent("nodestore-datachange-start", this);
		s = s || {};
		var j = s.shallow;
		var r = s.checkParents || j;
		var h = s.fullMathchingParents;
		var c = s.onlyParents || h;
		var e = this.rootVisible;
		if (c && r) {
			throw new Error("Can't combine `onlyParents` and `checkParents` options")
		}
		var o = {};
		var m = this.getRootNode(),
		d = [];
		var a = function(t) {
			var i = t.parentNode;
			while (i && !o[i.internalId]) {
				o[i.internalId] = true;
				i = i.parentNode
			}
		};
		var k = function(v) {
			if (v.isHidden && v.isHidden() || v.hidden || v.data.hidden) {
				return
			}
			var t,
			w,
			u,
			i;
			if (v.data.leaf) {
				if (g.call(b, v, o)) {
					d[d.length] = v;
					a(v)
				}
			} else {
				if (e || v != m) {
					d[d.length] = v
				}
				if (c) {
					t = g.call(b, v);
					w = v.childNodes;
					u = w.length;
					if (t) {
						o[v.internalId] = true;
						a(v);
						if (h) {
							v.cascadeBy(function(x) {
								if (x != v) {
									d[d.length] = x;
									if (!x.data.leaf) {
										o[x.internalId] = true
									}
								}
							});
							return
						}
					}
					for (i = 0; i < u; i++) {
						if (t && w[i].data.leaf) {
							d[d.length] = w[i]
						} else {
							if (!w[i].data.leaf) {
								k(w[i])
							}
						}
					}
				} else {
					if (r) {
						t = g.call(b, v, o);
						if (t) {
							o[v.internalId] = true;
							a(v)
						}
					}
					if (!r || !j || j && (t || v == m && !e)) {
						w = v.childNodes;
						u = w.length;
						for (i = 0; i < u; i++) {
							k(w[i])
						}
					}
				}
			}
		};
		k(m);
		var f = [];
		for (var p = 0, q = d.length; p < q; p++) {
			var l = d[p];
			if (l.data.leaf || o[l.internalId]) {
				f[f.length] = l
			}
		}
		var n = this.nodeStore;
		if (!this.loadDataInNodeStore || !this.loadDataInNodeStore(f)) {
			n.loadRecords(f, false);
			n.fireEvent("clear", n)
		}
		this.isFilteredFlag = true;
		this.lastTreeFilter = s;
		this.fireEvent("nodestore-datachange-end", this);
		this.fireEvent("filter-set", this)
	},
	hideNodesBy: function(b, a) {
		if (this.isFiltered()) {
			throw new Error("Can't hide nodes of the filtered tree store")
		}
		var c = this;
		a = a || this;
		this.getRootNode().cascadeBy(function(d) {
			d.hidden = b.call(a, d, c)
		});
		this.refreshNodeStoreContent()
	},
	showAllNodes: function() {
		this.getRootNode().cascadeBy(function(a) {
			a.hidden = a.data.hidden = false
		});
		this.refreshNodeStoreContent()
	}
});
Ext.define("Sch.data.ResourceStore", {
	extend: "Ext.data.Store",
	model: "Sch.model.Resource",
	config: {
		model: "Sch.model.Resource"
	},
	mixins: ["Sch.data.mixin.ResourceStore"]
});
Ext.define("Sch.data.TimeAxis", {
	extend: "Ext.data.JsonStore",
	requires: ["Sch.util.Date"],
	model: "Sch.model.TimeAxisTick",
	continuous: true,
	autoAdjust: true,
	preset: null,
	unit: null,
	increment: null,
	resolutionUnit: null,
	resolutionIncrement: null,
	weekStartDay: null,
	mainUnit: null,
	shiftUnit: null,
	headerConfig: null,
	shiftIncrement: 1,
	defaultSpan: 1,
	constructor: function(a) {
		var b = this;
		if (b.setModel) {
			b.setModel(b.model)
		}
		b.originalContinuous = b.continuous;
		b.callParent(arguments);
		b.addEvents("beforereconfigure", "reconfigure");
		b.on("datachanged",
		function() {
			b.fireEvent("reconfigure", b)
		});
		if (a && b.start) {
			b.reconfigure(a)
		}
	},
	reconfigure: function(a) {
		Ext.apply(this, a);
		var b = this.generateTicks(this.start, this.end, this.unit, this.increment || 1, this.mainUnit);
		if (this.fireEvent("beforereconfigure", this, this.start, this.end) !== false) {
			this.removeAll(true);
			this.suspendEvents();
			this.add(b);
			if (this.getCount() === 0) {
				Ext.Error.raise("Invalid time axis configuration or filter, please check your input data.")
			}
			this.resumeEvents();
			this.fireEvent("datachanged", this);
			this.fireEvent("refresh", this)
		}
	},
	setTimeSpan: function(c, a) {
		var b = this.getAdjustedDates(c, a);
		if (this.getStart() - b.start !== 0 || this.getEnd() - b.end !== 0) {
			this.reconfigure({
				start: c,
				end: a
			})
		}
	},
	filterBy: function(b, a) {
		this.continuous = false;
		a = a || this;
		this.clearFilter(true);
		this.suspendEvents(true);
		this.filter([{
			filterFn: function(d, c) {
				return b.call(a, d.data, c)
			}
		}]);
		if (this.getCount() === 0) {
			Ext.Error.raise("Invalid time axis filter - no columns passed through the filter. Please check your filter method.");
			this.clearFilter();
			this.resumeEvents();
			Ext.Error.raise("Invalid time axis filter - no ticks passed through the filter. Please check your filter method.");
			return
		}
		this.resumeEvents()
	},
	isContinuous: function() {
		return this.continuous && !this.isFiltered()
	},
	clearFilter: function() {
		this.continuous = this.originalContinuous;
		this.callParent(arguments)
	},
	generateTicks: function(a, d, g, i) {
		var h = [],
		f,
		b = Sch.util.Date,
		e = 0;
		g = g || this.unit;
		i = i || this.increment;
		if (this.autoAdjust) {
			var j = this.getAdjustedDates(a, d);
			a = j.start;
			d = j.end
		}
		while (a < d) {
			f = this.getNext(a, g, i);
			if (g === b.HOUR && i > 1 && h.length > 0 && e === 0) {
				var c = h[h.length - 1];
				e = ((c.start.getHours() + i) % 24) - c.end.getHours();
				if (e !== 0) {
					f = b.add(f, b.HOUR, e)
				}
			}
			h.push({
				start: a,
				end: f
			});
			a = f
		}
		return h
	},
	getAdjustedDates: function(b, a) {
		if (this.autoAdjust) {
			b = this.floorDate(b || this.getStart(), false);
			a = this.ceilDate(a || Sch.util.Date.add(b, this.mainUnit, this.defaultSpan), false)
		}
		return {
			start: b,
			end: a
		}
	},
	getTickFromDate: function(c) {
		if (this.getStart() > c || this.getEnd() < c) {
			return - 1
		}
		var f = this.getRange(),
		e,
		a,
		d,
		b;
		for (d = 0, b = f.length; d < b; d++) {
			a = f[d].data.end;
			if (c <= a) {
				e = f[d].data.start;
				return d + (c > e ? (c - e) / (a - e) : 0)
			}
		}
		return - 1
	},
	getDateFromTick: function(d, f) {
		var g = this.getCount();
		if (d === g) {
			return this.getEnd()
		}
		var a = Math.floor(d),
		e = d - a,
		c = this.getAt(a).data;
		var b = Sch.util.Date.add(c.start, Sch.util.Date.MILLI, e * (c.end - c.start));
		if (f) {
			b = this[f + "Date"](b)
		}
		return b
	},
	getTicks: function() {
		var a = [];
		this.each(function(b) {
			a.push(b.data)
		});
		return a
	},
	getStart: function() {
		var a = this.first();
		if (a) {
			return Ext.Date.clone(a.data.start)
		}
		return null
	},
	getEnd: function() {
		var a = this.last();
		if (a) {
			return Ext.Date.clone(a.data.end)
		}
		return null
	},
	floorDate: function(t, d, v) {
		d = d !== false;
		var n = Ext.Date.clone(t),
		b = d ? this.getStart() : null,
		u = this.resolutionIncrement,
		k;
		if (v) {
			k = v
		} else {
			k = d ? this.resolutionUnit: this.mainUnit
		}
		switch (k) {
		case Sch.util.Date.MILLI:
			if (d) {
				var f = Sch.util.Date.getDurationInMilliseconds(b, n),
				e = Math.floor(f / u) * u;
				n = Sch.util.Date.add(b, Sch.util.Date.MILLI, e)
			}
			break;
		case Sch.util.Date.SECOND:
			if (d) {
				var j = Sch.util.Date.getDurationInSeconds(b, n),
				s = Math.floor(j / u) * u;
				n = Sch.util.Date.add(b, Sch.util.Date.MILLI, s * 1000)
			} else {
				n.setMilliseconds(0)
			}
			break;
		case Sch.util.Date.MINUTE:
			if (d) {
				var p = Sch.util.Date.getDurationInMinutes(b, n),
				a = Math.floor(p / u) * u;
				n = Sch.util.Date.add(b, Sch.util.Date.SECOND, a * 60)
			} else {
				n.setSeconds(0);
				n.setMilliseconds(0)
			}
			break;
		case Sch.util.Date.HOUR:
			if (d) {
				var o = Sch.util.Date.getDurationInHours(this.getStart(), n),
				l = Math.floor(o / u) * u;
				n = Sch.util.Date.add(b, Sch.util.Date.MINUTE, l * 60)
			} else {
				n.setMinutes(0);
				n.setSeconds(0);
				n.setMilliseconds(0)
			}
			break;
		case Sch.util.Date.DAY:
			if (d) {
				var c = Sch.util.Date.getDurationInDays(b, n),
				g = Math.floor(c / u) * u;
				n = Sch.util.Date.add(b, Sch.util.Date.DAY, g)
			} else {
				Ext.Date.clearTime(n)
			}
			break;
		case Sch.util.Date.WEEK:
			var r = n.getDay();
			Ext.Date.clearTime(n);
			if (r !== this.weekStartDay) {
				n = Sch.util.Date.add(n, Sch.util.Date.DAY, -(r > this.weekStartDay ? (r - this.weekStartDay) : (7 - r - this.weekStartDay)))
			}
			break;
		case Sch.util.Date.MONTH:
			if (d) {
				var q = Sch.util.Date.getDurationInMonths(b, n),
				i = Math.floor(q / u) * u;
				n = Sch.util.Date.add(b, Sch.util.Date.MONTH, i)
			} else {
				Ext.Date.clearTime(n);
				n.setDate(1)
			}
			break;
		case Sch.util.Date.QUARTER:
			Ext.Date.clearTime(n);
			n.setDate(1);
			n = Sch.util.Date.add(n, Sch.util.Date.MONTH, -(n.getMonth() % 3));
			break;
		case Sch.util.Date.YEAR:
			if (d) {
				var m = Sch.util.Date.getDurationInYears(b, n),
				h = Math.floor(m / u) * u;
				n = Sch.util.Date.add(b, Sch.util.Date.YEAR, h)
			} else {
				n = new Date(t.getFullYear(), 0, 1)
			}
			break
		}
		return n
	},
	roundDate: function(r) {
		var l = Ext.Date.clone(r),
		b = this.getStart(),
		s = this.resolutionIncrement;
		switch (this.resolutionUnit) {
		case Sch.util.Date.MILLI:
			var e = Sch.util.Date.getDurationInMilliseconds(b, l),
			d = Math.round(e / s) * s;
			l = Sch.util.Date.add(b, Sch.util.Date.MILLI, d);
			break;
		case Sch.util.Date.SECOND:
			var i = Sch.util.Date.getDurationInSeconds(b, l),
			q = Math.round(i / s) * s;
			l = Sch.util.Date.add(b, Sch.util.Date.MILLI, q * 1000);
			break;
		case Sch.util.Date.MINUTE:
			var n = Sch.util.Date.getDurationInMinutes(b, l),
			a = Math.round(n / s) * s;
			l = Sch.util.Date.add(b, Sch.util.Date.SECOND, a * 60);
			break;
		case Sch.util.Date.HOUR:
			var m = Sch.util.Date.getDurationInHours(this.getStart(), l),
			j = Math.round(m / s) * s;
			l = Sch.util.Date.add(b, Sch.util.Date.MINUTE, j * 60);
			break;
		case Sch.util.Date.DAY:
			var c = Sch.util.Date.getDurationInDays(b, l),
			f = Math.round(c / s) * s;
			l = Sch.util.Date.add(b, Sch.util.Date.DAY, f);
			break;
		case Sch.util.Date.WEEK:
			Ext.Date.clearTime(l);
			var o = l.getDay() - this.weekStartDay,
			t;
			if (o < 0) {
				o = 7 + o
			}
			if (Math.round(o / 7) === 1) {
				t = 7 - o
			} else {
				t = -o
			}
			l = Sch.util.Date.add(l, Sch.util.Date.DAY, t);
			break;
		case Sch.util.Date.MONTH:
			var p = Sch.util.Date.getDurationInMonths(b, l) + (l.getDate() / Ext.Date.getDaysInMonth(l)),
			h = Math.round(p / s) * s;
			l = Sch.util.Date.add(b, Sch.util.Date.MONTH, h);
			break;
		case Sch.util.Date.QUARTER:
			Ext.Date.clearTime(l);
			l.setDate(1);
			l = Sch.util.Date.add(l, Sch.util.Date.MONTH, 3 - (l.getMonth() % 3));
			break;
		case Sch.util.Date.YEAR:
			var k = Sch.util.Date.getDurationInYears(b, l),
			g = Math.round(k / s) * s;
			l = Sch.util.Date.add(b, Sch.util.Date.YEAR, g);
			break
		}
		return l
	},
	ceilDate: function(c, b, f) {
		var e = Ext.Date.clone(c);
		b = b !== false;
		var a = b ? this.resolutionIncrement: 1,
		g = false,
		d;
		if (f) {
			d = f
		} else {
			d = b ? this.resolutionUnit: this.mainUnit
		}
		switch (d) {
		case Sch.util.Date.HOUR:
			if (e.getMinutes() > 0 || e.getSeconds() > 0 || e.getMilliseconds() > 0) {
				g = true
			}
			break;
		case Sch.util.Date.DAY:
			if (e.getHours() > 0 || e.getMinutes() > 0 || e.getSeconds() > 0 || e.getMilliseconds() > 0) {
				g = true
			}
			break;
		case Sch.util.Date.WEEK:
			Ext.Date.clearTime(e);
			if (e.getDay() !== this.weekStartDay) {
				g = true
			}
			break;
		case Sch.util.Date.MONTH:
			Ext.Date.clearTime(e);
			if (e.getDate() !== 1) {
				g = true
			}
			break;
		case Sch.util.Date.QUARTER:
			Ext.Date.clearTime(e);
			if (e.getMonth() % 3 !== 0) {
				g = true
			}
			break;
		case Sch.util.Date.YEAR:
			Ext.Date.clearTime(e);
			if (e.getMonth() !== 0 || e.getDate() !== 1) {
				g = true
			}
			break;
		default:
			break
		}
		if (g) {
			return this.getNext(e, d, a)
		} else {
			return e
		}
	},
	getNext: function(b, c, a) {
		return Sch.util.Date.getNext(b, c, a, this.weekStartDay)
	},
	getResolution: function() {
		return {
			unit: this.resolutionUnit,
			increment: this.resolutionIncrement
		}
	},
	setResolution: function(b, a) {
		this.resolutionUnit = b;
		this.resolutionIncrement = a || 1
	},
	shift: function(a, b) {
		this.setTimeSpan(Sch.util.Date.add(this.getStart(), b, a), Sch.util.Date.add(this.getEnd(), b, a))
	},
	shiftNext: function(a) {
		a = a || this.getShiftIncrement();
		var b = this.getShiftUnit();
		this.setTimeSpan(Sch.util.Date.add(this.getStart(), b, a), Sch.util.Date.add(this.getEnd(), b, a))
	},
	shiftPrevious: function(a) {
		a = -(a || this.getShiftIncrement());
		var b = this.getShiftUnit();
		this.setTimeSpan(Sch.util.Date.add(this.getStart(), b, a), Sch.util.Date.add(this.getEnd(), b, a))
	},
	getShiftUnit: function() {
		return this.shiftUnit || this.getMainUnit()
	},
	getShiftIncrement: function() {
		return this.shiftIncrement || 1
	},
	getUnit: function() {
		return this.unit
	},
	getIncrement: function() {
		return this.increment
	},
	dateInAxis: function(a) {
		return Sch.util.Date.betweenLesser(a, this.getStart(), this.getEnd())
	},
	timeSpanInAxis: function(b, a) {
		if (this.isContinuous()) {
			return Sch.util.Date.intersectSpans(b, a, this.getStart(), this.getEnd())
		} else {
			return (b < this.getStart() && a > this.getEnd()) || this.getTickFromDate(b) !== this.getTickFromDate(a)
		}
	},
	forEachInterval: function(b, a, c) {
		c = c || this;
		if (!this.headerConfig) {
			return
		}
		if (b === "top" || (b === "middle" && this.headerConfig.bottom)) {
			this.forEachAuxInterval(b, a, c)
		} else {
			this.each(function(e, d) {
				return a.call(c, e.data.start, e.data.end, d)
			})
		}
	},
	forEachMainInterval: function(a, b) {
		this.forEachInterval("middle", a, b)
	},
	forEachAuxInterval: function(b, a, f) {
		f = f || this;
		var c = this.getEnd(),
		g = this.getStart(),
		e = 0,
		d;
		if (g > c) {
			throw "Invalid time axis configuration"
		}
		while (g < c) {
			d = Sch.util.Date.min(this.getNext(g, this.headerConfig[b].unit, this.headerConfig[b].increment || 1), c);
			a.call(f, g, d, e);
			g = d;
			e++
		}
	}
});
Ext.define("Sch.preset.ViewPreset", {
	columnWidth: null,
	rowHeight: null,
	timeAxisColumnWidth: null,
	displayDateFormat: "G:i",
	shiftUnit: "HOUR",
	shiftIncrement: 1,
	defaultSpan: 12,
	timeResolution: null,
	headerConfig: null,
	headers: null,
	mainHeader: 0,
	constructor: function(a) {
		Ext.apply(this, a)
	},
	getHeaders: function() {
		if (this.headers) {
			return this.headers
		}
		var a = this.headerConfig;
		this.mainHeader = a.top ? 1: 0;
		return this.headers = [].concat(a.top || [], a.middle || [], a.bottom || [])
	},
	getMainHeader: function() {
		return this.getHeaders()[this.mainHeader]
	},
	getBottomHeader: function() {
		var a = this.getHeaders();
		return a[a.length - 1]
	},
	getTimeAxisConfig: function() {
		return {
			mainUnit: this.getMainHeader().unit,
			unit: this.getBottomHeader().unit,
			increment: this.getBottomHeader().increment,
			shiftUnit: this.shiftUnit,
			shiftIncrement: this.shiftIncrement,
			defaultSpan: this.defaultSpan,
			resolutionUnit: this.timeResolution.unit,
			resolutionIncrement: this.timeResolution.increment
		}
	},
	clone: function() {
		var a = {};
		var b = this;
		Ext.each(["columnWidth", "rowHeight", "timeAxisColumnWidth", "dateFormat", "shiftUnit", "shiftIncrement", "defaultSpan", "timeResolution", "headerConfig"],
		function(c) {
			a[c] = b[c]
		});
		return new this.self(Ext.clone(a))
	}
});
Ext.define("Sch.preset.Manager", {
	extend: "Ext.util.MixedCollection",
	requires: ["Sch.util.Date", "Sch.preset.ViewPreset"],
	mixins: ["Sch.mixin.Localizable"],
	singleton: true,
	constructor: function() {
		this.callParent(arguments);
		this.registerDefaults()
	},
	registerPreset: function(b, a) {
		if (a) {
			var c = a.headerConfig;
			var d = Sch.util.Date;
			for (var e in c) {
				if (c.hasOwnProperty(e)) {
					if (d[c[e].unit]) {
						c[e].unit = d[c[e].unit.toUpperCase()]
					}
				}
			}
			if (!a.timeColumnWidth) {
				a.timeColumnWidth = 50
			}
			if (a.timeResolution && d[a.timeResolution.unit]) {
				a.timeResolution.unit = d[a.timeResolution.unit.toUpperCase()]
			}
			if (a.shiftUnit && d[a.shiftUnit]) {
				a.shiftUnit = d[a.shiftUnit.toUpperCase()]
			}
		}
		if (this.isValidPreset(a)) {
			if (this.containsKey(b)) {
				this.removeAtKey(b)
			}
			this.add(b, new Sch.preset.ViewPreset(a))
		} else {
			throw "Invalid preset, please check your configuration"
		}
	},
	isValidPreset: function(a) {
		var d = Sch.util.Date,
		b = true,
		c = Sch.util.Date.units;
		for (var e in a.headerConfig) {
			if (a.headerConfig.hasOwnProperty(e)) {
				b = b && Ext.Array.indexOf(c, a.headerConfig[e].unit) >= 0
			}
		}
		if (a.timeResolution) {
			b = b && Ext.Array.indexOf(c, a.timeResolution.unit) >= 0
		}
		if (a.shiftUnit) {
			b = b && Ext.Array.indexOf(c, a.shiftUnit) >= 0
		}
		return b
	},
	getPreset: function(a) {
		return this.get(a)
	},
	deletePreset: function(a) {
		this.removeAtKey(a)
	},
	registerDefaults: function() {
		var b = this,
		a = this.defaultPresets;
		for (var c in a) {
			b.registerPreset(c, a[c])
		}
	},
	defaultPresets: {
		minuteAndHour: {
			timeColumnWidth: 100,
			rowHeight: 24,
			resourceColumnWidth: 100,
			displayDateFormat: "G:i",
			shiftIncrement: 1,
			shiftUnit: "HOUR",
			defaultSpan: 24,
			timeResolution: {
				unit: "MINUTE",
				increment: 30
			},
			headerConfig: {
				middle: {
					unit: "MINUTE",
					increment: "30",
					align: "center",
					dateFormat: "i"
				},
				top: {
					unit: "HOUR",
					align: "center",
					dateFormat: "D, gA/d"
				}
			}
		},
		hourAndDay: {
			timeColumnWidth: 60,
			rowHeight: 24,
			resourceColumnWidth: 100,
			displayDateFormat: "G:i",
			shiftIncrement: 1,
			shiftUnit: "DAY",
			defaultSpan: 24,
			timeResolution: {
				unit: "MINUTE",
				increment: 30
			},
			headerConfig: {
				middle: {
					unit: "HOUR",
					align: "center",
					dateFormat: "G:i"
				},
				top: {
					unit: "DAY",
					align: "center",
					dateFormat: "D d/m"
				}
			}
		},
		dayAndWeek: {
			timeColumnWidth: 100,
			rowHeight: 24,
			resourceColumnWidth: 100,
			displayDateFormat: "Y-m-d G:i",
			shiftUnit: "DAY",
			shiftIncrement: 1,
			defaultSpan: 5,
			timeResolution: {
				unit: "HOUR",
				increment: 1
			},
			headerConfig: {
				middle: {
					unit: "DAY",
					align: "center",
					dateFormat: "D d M"
				},
				top: {
					unit: "WEEK",
					align: "center",
					renderer: function(c, b, a) {
						return Sch.util.Date.getShortNameOfUnit("WEEK") + "." + Ext.Date.format(c, "W M Y")
					}
				}
			}
		},
		weekAndDay: {
			timeColumnWidth: 100,
			rowHeight: 24,
			resourceColumnWidth: 100,
			displayDateFormat: "Y-m-d",
			shiftUnit: "WEEK",
			shiftIncrement: 1,
			defaultSpan: 1,
			timeResolution: {
				unit: "DAY",
				increment: 1
			},
			headerConfig: {
				bottom: {
					unit: "DAY",
					align: "center",
					increment: 1,
					dateFormat: "d/m"
				},
				middle: {
					unit: "WEEK",
					dateFormat: "D d M"
				}
			}
		},
		weekAndMonth: {
			timeColumnWidth: 100,
			rowHeight: 24,
			resourceColumnWidth: 100,
			displayDateFormat: "Y-m-d",
			shiftUnit: "WEEK",
			shiftIncrement: 5,
			defaultSpan: 6,
			timeResolution: {
				unit: "DAY",
				increment: 1
			},
			headerConfig: {
				middle: {
					unit: "WEEK",
					renderer: function(c, b, a) {
						return Ext.Date.format(c, "d M")
					}
				},
				top: {
					unit: "MONTH",
					align: "center",
					dateFormat: "M Y"
				}
			}
		},
		monthAndYear: {
			timeColumnWidth: 110,
			rowHeight: 24,
			resourceColumnWidth: 100,
			displayDateFormat: "Y-m-d",
			shiftIncrement: 3,
			shiftUnit: "MONTH",
			defaultSpan: 12,
			timeResolution: {
				unit: "DAY",
				increment: 1
			},
			headerConfig: {
				middle: {
					unit: "MONTH",
					align: "center",
					dateFormat: "M Y"
				},
				top: {
					unit: "YEAR",
					align: "center",
					dateFormat: "Y"
				}
			}
		},
		year: {
			timeColumnWidth: 100,
			rowHeight: 24,
			resourceColumnWidth: 100,
			displayDateFormat: "Y-m-d",
			shiftUnit: "YEAR",
			shiftIncrement: 1,
			defaultSpan: 1,
			timeResolution: {
				unit: "MONTH",
				increment: 1
			},
			headerConfig: {
				middle: {
					unit: "QUARTER",
					align: "center",
					renderer: function(c, b, a) {
						return Ext.String.format(Sch.util.Date.getShortNameOfUnit("QUARTER").toUpperCase() + "{0}", Math.floor(c.getMonth() / 3) + 1)
					}
				},
				top: {
					unit: "YEAR",
					align: "center",
					dateFormat: "Y"
				}
			}
		},
		manyyears: {
			timeColumnWidth: 50,
			rowHeight: 24,
			resourceColumnWidth: 100,
			displayDateFormat: "Y-m-d",
			shiftUnit: "YEAR",
			shiftIncrement: 1,
			defaultSpan: 1,
			timeResolution: {
				unit: "YEAR",
				increment: 1
			},
			headerConfig: {
				middle: {
					unit: "YEAR",
					align: "center",
					dateFormat: "Y"
				}
			}
		},
		weekAndDayLetter: {
			timeColumnWidth: 20,
			rowHeight: 24,
			resourceColumnWidth: 100,
			displayDateFormat: "Y-m-d",
			shiftUnit: "WEEK",
			shiftIncrement: 1,
			defaultSpan: 10,
			timeResolution: {
				unit: "DAY",
				increment: 1
			},
			headerConfig: {
				bottom: {
					unit: "DAY",
					align: "center",
					renderer: function(a) {
						return Ext.Date.dayNames[a.getDay()].substring(0, 1)
					}
				},
				middle: {
					unit: "WEEK",
					dateFormat: "D d M Y"
				}
			}
		},
		weekDateAndMonth: {
			timeColumnWidth: 30,
			rowHeight: 24,
			resourceColumnWidth: 100,
			displayDateFormat: "Y-m-d",
			shiftUnit: "WEEK",
			shiftIncrement: 1,
			defaultSpan: 10,
			timeResolution: {
				unit: "DAY",
				increment: 1
			},
			headerConfig: {
				middle: {
					unit: "WEEK",
					align: "center",
					dateFormat: "d"
				},
				top: {
					unit: "MONTH",
					dateFormat: "Y F"
				}
			}
		}
	}
});
Ext.define("Sch.feature.AbstractTimeSpan", {
	extend: "Ext.AbstractPlugin",
	lockableScope: "top",
	schedulerView: null,
	timeAxis: null,
	containerEl: null,
	expandToFitView: false,
	disabled: false,
	cls: null,
	template: null,
	store: null,
	renderElementsBuffered: false,
	renderDelay: 15,
	refreshSizeOnItemUpdate: true,
	_resizeTimer: null,
	_renderTimer: null,
	constructor: function(a) {
		this.uniqueCls = this.uniqueCls || ("sch-timespangroup-" + Ext.id());
		Ext.apply(this, a);
		this.callParent(arguments)
	},
	setDisabled: function(a) {
		if (a) {
			this.removeElements()
		}
		this.disabled = a
	},
	getElements: function() {
		if (this.containerEl) {
			return this.containerEl.select("." + this.uniqueCls)
		}
		return null
	},
	removeElements: function() {
		var a = this.getElements();
		if (a) {
			a.each(function(b) {
				b.destroy()
			})
		}
	},
	init: function(a) {
		if (Ext.versions.touch && !a.isReady()) {
			a.on("viewready",
			function() {
				this.init(a)
			},
			this);
			return
		}
		this.schedulerView = a.getSchedulingView();
		this.panel = a;
		this.timeAxis = a.getTimeAxis();
		this.store = Ext.StoreManager.lookup(this.store);
		if (!this.store) {
			Ext.Error.raise("Error: You must define a store for this plugin")
		}
		if (!this.schedulerView.getEl()) {
			this.schedulerView.on({
				afterrender: this.onAfterRender,
				scope: this
			})
		} else {
			this.onAfterRender()
		}
		this.schedulerView.on({
			destroy: this.onDestroy,
			scope: this
		})
	},
	onAfterRender: function(c) {
		var a = this.schedulerView;
		this.containerEl = a.getSecondaryCanvasEl();
		this.storeListeners = {
			load: this.renderElements,
			datachanged: this.renderElements,
			clear: this.renderElements,
			add: this.renderElements,
			remove: this.renderElements,
			update: this.refreshSingle,
			addrecords: this.renderElements,
			removerecords: this.renderElements,
			updaterecord: this.refreshSingle,
			scope: this
		};
		this.store.on(this.storeListeners);
		if (Ext.data.NodeStore && a.store instanceof Ext.data.NodeStore) {
			if (a.animate) {} else {
				a.mon(a.store, {
					expand: this.renderElements,
					collapse: this.renderElements,
					scope: this
				})
			}
		}
		a.on({
			bufferedrefresh: this.renderElements,
			refresh: this.renderElements,
			itemadd: this.refreshSizeOnItemUpdate ? this.refreshSizes: this.renderElements,
			itemremove: this.refreshSizeOnItemUpdate ? this.refreshSizes: this.renderElements,
			itemupdate: this.refreshSizeOnItemUpdate ? this.refreshSizes: this.renderElements,
			groupexpand: this.renderElements,
			groupcollapse: this.renderElements,
			columnwidthchange: this.renderElements,
			resize: this.renderElements,
			scope: this
		});
		if (a.headerCt) {
			a.headerCt.on({
				add: this.renderElements,
				remove: this.renderElements,
				scope: this
			})
		}
		this.panel.on({
			viewchange: this.renderElements,
			show: this.refreshSizes,
			orientationchange: function() {
				this.renderElementsBuffered = false;
				clearTimeout(this._renderTimer);
				clearTimeout(this._resizeTimer);
				this.renderElements()
			},
			scope: this
		});
		var b = a.getRowContainerEl();
		if (b && b.down(".sch-timetd")) {
			this.renderElements()
		}
	},
	refreshSizes: function() {
		clearTimeout(this._resizeTimer);
		this._resizeTimer = Ext.Function.defer(function() {
			if (!this.schedulerView.isDestroyed && this.schedulerView.getOrientation() === "horizontal") {
				var a = this.schedulerView.getTimeSpanRegion(new Date(), null, this.expandToFitView);
				this.getElements().setHeight(a.bottom - a.top)
			}
		},
		this.renderDelay, this)
	},
	renderElements: function() {
		if (this.renderElementsBuffered || this.disabled) {
			return
		}
		this.renderElementsBuffered = true;
		clearTimeout(this._renderTimer);
		this._renderTimer = Ext.Function.defer(this.renderElementsInternal, this.renderDelay, this)
	},
	renderElementsInternal: function() {
		this.renderElementsBuffered = false;
		if (this.disabled || this.schedulerView.isDestroyed) {
			return
		}
		if (Ext.versions.extjs && !this.schedulerView.el.down("table")) {
			return
		}
		this.removeElements();
		Ext.DomHelper.append(this.containerEl, this.generateMarkup())
	},
	generateMarkup: function(b) {
		var d = this.timeAxis.getStart(),
		a = this.timeAxis.getEnd(),
		c = this.getElementData(d, a, null, b);
		return this.template.apply(c)
	},
	getElementData: function(b, a) {
		throw "Abstract method call"
	},
	onDestroy: function() {
		clearTimeout(this._renderTimer);
		clearTimeout(this._resizeTimer);
		if (this.store.autoDestroy) {
			this.store.destroy()
		}
		this.store.un(this.storeListeners)
	},
	refreshSingle: function(c, b) {
		var e = Ext.get(this.uniqueCls + "-" + b.internalId);
		if (e) {
			var g = this.timeAxis.getStart(),
			a = this.timeAxis.getEnd(),
			f = this.getElementData(g, a, [b])[0],
			d = b.clsField || "Cls";
			if (f) {
				e.dom.className = this.cls + " " + this.uniqueCls + " " + (f[d] || "");
				e.setTop(f.top);
				e.setLeft(f.left);
				e.setSize(f.width, f.height)
			} else {
				Ext.destroy(e)
			}
		} else {
			this.renderElements()
		}
	}
});
Ext.define("Sch.plugin.Lines", {
	extend: "Sch.feature.AbstractTimeSpan",
	alias: "plugin.scheduler_lines",
	cls: "sch-timeline",
	showTip: true,
	innerTpl: null,
	prepareTemplateData: null,
	side: null,
	init: function(a) {
		this.callParent(arguments);
		if (Ext.isString(this.innerTpl)) {
			this.innerTpl = new Ext.XTemplate(this.innerTpl)
		}
		this.side = a.rtl ? "right": "left";
		var b = this.innerTpl;
		if (!this.template) {
			this.template = new Ext.XTemplate('<tpl for=".">', '<div id="' + this.uniqueCls + '-{id}"' + (this.showTip ? 'title="{[this.getTipText(values)]}" ': "") + 'class="' + this.cls + " " + this.uniqueCls + ' {Cls}" style="' + this.side + ':{left}px;top:{top}px;height:{height}px;width:{width}px">' + (b ? "{[this.renderInner(values)]}": "") + "</div>", "</tpl>", {
				getTipText: function(c) {
					return a.getSchedulingView().getFormattedDate(c.Date) + " " + (c.Text || "")
				},
				renderInner: function(c) {
					return b.apply(c)
				}
			})
		}
	},
	getElementData: function(k, n, d) {
		var o = this.store,
		j = this.schedulerView,
		f = d || o.getRange(),
		b = j.getOrientation(),
		h = [],
		a,
		c,
		m;
		for (var g = 0, e = f.length; g < e; g++) {
			a = f[g];
			c = a.get("Date");
			if (c && Sch.util.Date.betweenLesser(c, k, n)) {
				m = j.getTimeSpanRegion(c, null, this.expandToFitView);
				if (b === "horizontal") {
					h[h.length] = Ext.apply({
						id: a.internalId,
						left: m.left,
						top: m.top,
						width: 1,
						height: Ext.versions.touch ? "100%": m.bottom - m.top
					},
					this.prepareTemplateData ? this.prepareTemplateData(a) : a.data)
				} else {
					h[h.length] = Ext.apply({
						id: a.internalId,
						left: m.left,
						top: m.top,
						width: m.right - m.left,
						height: 1
					},
					this.prepareTemplateData ? this.prepareTemplateData(a) : a.data)
				}
			}
		}
		return h
	}
});
Ext.define("Sch.plugin.Zones", {
	extend: "Sch.feature.AbstractTimeSpan",
	alias: "plugin.scheduler_zones",
	innerTpl: null,
	requires: ["Sch.model.Range"],
	cls: "sch-zone",
	side: null,
	init: function(a) {
		if (Ext.isString(this.innerTpl)) {
			this.innerTpl = new Ext.XTemplate(this.innerTpl)
		}
		this.side = a.rtl ? "right": "left";
		var b = this.innerTpl;
		if (!this.template) {
			this.template = new Ext.XTemplate('<tpl for="."><div id="' + this.uniqueCls + '-{id}" class="' + this.cls + " " + this.uniqueCls + ' {Cls}" style="' + this.side + ':{left}px;top:{top}px;height:{height}px;width:{width}px;{style}">' + (b ? "{[this.renderInner(values)]}": "") + "</div></tpl>", {
				renderInner: function(c) {
					return b.apply(c)
				}
			})
		}
		this.callParent(arguments)
	},
	getElementData: function(j, o, d, p) {
		var m = this.schedulerView,
		f = [];
		d = d || this.store.getRange();
		for (var g = 0, e = d.length; g < e; g++) {
			var h = d[g];
			var n = h.getStartDate();
			var c = h.getEndDate();
			if (n && c && Sch.util.Date.intersectSpans(n, c, j, o)) {
				var k = m.getTimeSpanRegion(Sch.util.Date.max(n, j), Sch.util.Date.min(c, o), this.expandToFitView);
				var b = k.right - k.left + 1;
				var a = Ext.apply({
					id: h.internalId,
					left: k.left,
					top: k.top,
					width: p ? 0: b,
					height: Ext.versions.touch ? "100%": k.bottom - k.top,
					style: p ? ("border-left-width:" + b + "px") : "",
					Cls: h.getCls()
				},
				h.data);
				f[f.length] = a
			}
		}
		return f
	}
});
Ext.define("Sch.plugin.Pan", {
	extend: "Ext.AbstractPlugin",
	alias: "plugin.scheduler_pan",
	lockableScope: "top",
	enableVerticalPan: true,
	panel: null,
	constructor: function(a) {
		Ext.apply(this, a)
	},
	init: function(a) {
		this.panel = a.normalGrid || a;
		this.view = a.getSchedulingView();
		this.view.on("afterrender", this.onRender, this)
	},
	onRender: function(a) {
		this.view.el.on("mousedown", this.onMouseDown, this)
	},
	onMouseDown: function(b, a) {
		if (b.getTarget("." + this.view.timeCellCls, 10) && !b.getTarget(this.view.eventSelector)) {
			this.mouseX = b.getPageX();
			this.mouseY = b.getPageY();
			Ext.getBody().on("mousemove", this.onMouseMove, this);
			Ext.getDoc().on("mouseup", this.onMouseUp, this);
			if (Ext.isIE || Ext.isGecko) {
				Ext.getBody().on("mouseenter", this.onMouseUp, this)
			}
			b.stopEvent()
		}
	},
	onMouseMove: function(d) {
		d.stopEvent();
		var a = d.getPageX(),
		f = d.getPageY(),
		c = a - this.mouseX,
		b = f - this.mouseY;
		this.panel.scrollByDeltaX( - c);
		this.mouseX = a;
		this.mouseY = f;
		if (this.enableVerticalPan) {
			this.panel.scrollByDeltaY( - b)
		}
	},
	onMouseUp: function(a) {
		Ext.getBody().un("mousemove", this.onMouseMove, this);
		Ext.getDoc().un("mouseup", this.onMouseUp, this);
		if (Ext.isIE || Ext.isGecko) {
			Ext.getBody().un("mouseenter", this.onMouseUp, this)
		}
	}
});
Ext.define("Sch.tooltip.ClockTemplate", {
	constructor: function() {
		var i = Math.PI / 180,
		l = Math.cos,
		j = Math.sin,
		m = 7,
		c = 2,
		d = 10,
		k = 6,
		f = 3,
		a = 10,
		e = Ext.isIE && (Ext.ieVersion < 9 || Ext.isIEQuirks);
		function b(n) {
			var q = n * i,
			o = l(q),
			t = j(q),
			r = k * j((90 - n) * i),
			s = k * l((90 - n) * i),
			u = Math.min(k, k - r),
			p = n > 180 ? s: 0,
			v = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11 = " + o + ", M12 = " + ( - t) + ", M21 = " + t + ", M22 = " + o + ")";
			return Ext.String.format("filter:{0};-ms-filter:{0};top:{1}px;left:{2}px;", v, u + f, p + a)
		}
		function h(n) {
			var q = n * i,
			o = l(q),
			t = j(q),
			r = m * j((90 - n) * i),
			s = m * l((90 - n) * i),
			u = Math.min(m, m - r),
			p = n > 180 ? s: 0,
			v = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11 = " + o + ", M12 = " + ( - t) + ", M21 = " + t + ", M22 = " + o + ")";
			return Ext.String.format("filter:{0};-ms-filter:{0};top:{1}px;left:{2}px;", v, u + c, p + d)
		}
		function g(n) {
			return Ext.String.format("transform:rotate({0}deg);-ms-transform:rotate({0}deg);-moz-transform: rotate({0}deg);-webkit-transform: rotate({0}deg);-o-transform:rotate({0}deg);", n)
		}
		return new Ext.XTemplate('<div class="sch-clockwrap {cls}"><div class="sch-clock"><div class="sch-hourIndicator" style="{[this.getHourStyle((values.date.getHours()%12) * 30)]}">{[Ext.Date.monthNames[values.date.getMonth()].substr(0,3)]}</div><div class="sch-minuteIndicator" style="{[this.getMinuteStyle(values.date.getMinutes() * 6)]}">{[values.date.getDate()]}</div></div><span class="sch-clock-text">{text}</span></div>', {
			compiled: true,
			disableFormats: true,
			getMinuteStyle: e ? h: g,
			getHourStyle: e ? b: g
		})
	}
});
Ext.define("Sch.tooltip.Tooltip", {
	extend: "Ext.tip.ToolTip",
	requires: ["Sch.tooltip.ClockTemplate"],
	autoHide: false,
	anchor: "b",
	padding: "0 3 0 0",
	showDelay: 0,
	hideDelay: 0,
	quickShowInterval: 0,
	dismissDelay: 0,
	trackMouse: false,
	valid: true,
	anchorOffset: 5,
	shadow: false,
	frame: false,
	constructor: function(b) {
		var a = Ext.create("Sch.tooltip.ClockTemplate");
		this.renderTo = document.body;
		this.startDate = this.endDate = new Date();
		if (!this.template) {
			this.template = Ext.create("Ext.XTemplate", '<div class="{[values.valid ? "sch-tip-ok" : "sch-tip-notok"]}">', '{[this.renderClock(values.startDate, values.startText, "sch-tooltip-startdate")]}', '{[this.renderClock(values.endDate, values.endText, "sch-tooltip-enddate")]}', "</div>", {
				compiled: true,
				disableFormats: true,
				renderClock: function(d, e, c) {
					return a.apply({
						date: d,
						text: e,
						cls: c
					})
				}
			})
		}
		this.callParent(arguments)
	},
	update: function(a, e, d) {
		if (this.startDate - a !== 0 || this.endDate - e !== 0 || this.valid !== d) {
			this.startDate = a;
			this.endDate = e;
			this.valid = d;
			var c = this.schedulerView.getFormattedDate(a),
			b = this.schedulerView.getFormattedEndDate(e, a);
			if (this.mode === "calendar" && e.getHours() === 0 && e.getMinutes() === 0 && !(e.getYear() === a.getYear() && e.getMonth() === a.getMonth() && e.getDate() === a.getDate())) {
				e = Sch.util.Date.add(e, Sch.util.Date.DAY, -1)
			}
			this.callParent([this.template.apply({
				valid: d,
				startDate: a,
				endDate: e,
				startText: c,
				endText: b
			})])
		}
	},
	show: function(b, a) {
		if (!b) {
			return
		}
		if (Sch.util.Date.compareUnits(this.schedulerView.getTimeResolution().unit, Sch.util.Date.DAY) >= 0) {
			this.mode = "calendar";
			this.addCls("sch-day-resolution")
		} else {
			this.mode = "clock";
			this.removeCls("sch-day-resolution")
		}
		this.mouseOffsets = [a - 18, -7];
		this.setTarget(b);
		this.callParent();
		this.alignTo(b, "bl-tl", this.mouseOffsets);
		this.mon(Ext.getBody(), "mousemove", this.onMyMouseMove, this);
		this.mon(Ext.getBody(), "mouseup", this.onMyMouseUp, this, {
			single: true
		})
	},
	onMyMouseMove: function() {
		this.el.alignTo(this.target, "bl-tl", this.mouseOffsets)
	},
	onMyMouseUp: function() {
		this.mun(Ext.getBody(), "mousemove", this.onMyMouseMove, this)
	},
	afterRender: function() {
		this.callParent(arguments);
		this.el.on("mouseenter", this.onElMouseEnter, this)
	},
	onElMouseEnter: function() {
		this.alignTo(this.target, "bl-tl", this.mouseOffsets)
	}
});
Ext.define("Sch.view.model.TimeAxis", {
	extend: "Ext.util.Observable",
	requires: ["Ext.Date", "Sch.util.Date"],
	timeAxis: null,
	availableWidth: 0,
	tickWidth: 100,
	snapToIncrement: false,
	forceFit: false,
	suppressFit: false,
	refCount: 0,
	columnConfig: {},
	constructor: function(a) {
		var b = this;
		Ext.apply(this, a);
		b.addEvents("update");
		if (b.timeAxis.preset) {
			b.tickWidth = b.timeAxis.preset.timeColumnWidth
		}
		b.timeAxis.on("reconfigure", b.onTimeAxisReconfigure, b);
		this.callParent(arguments)
	},
	destroy: function() {
		this.timeAxis.un("reconfigure", this.onTimeAxisReconfigure, this)
	},
	onTimeAxisReconfigure: function() {
		this.tickWidth = this.timeAxis.preset.timeColumnWidth;
		this.update()
	},
	getColumnConfig: function() {
		return this.columnConfig
	},
	update: function(d, b) {
		var e = this.timeAxis,
		c = e.headerConfig;
		this.availableWidth = Math.max(d || this.availableWidth, 0);
		if (this.forceFit && this.availableWidth <= 0) {
			return
		}
		this.columnConfig = {};
		for (var f in c) {
			if (c[f].cellGenerator) {
				this.columnConfig[f] = c[f].cellGenerator.call(this, this.timeAxis.getStart(), this.timeAxis.getEnd())
			} else {
				this.columnConfig[f] = this.createHeaderRow(f, c[f])
			}
		}
		var a = this.columnConfig.bottom || this.columnConfig.middle;
		this.tickWidth = this.calculateTickWidth(this.getTickWidth());
		if (!Ext.isNumber(this.availableWidth) || this.availableWidth < 0) {
			throw "Invalid available width provided to Sch.view.model.TimeAxis"
		}
		if (!Ext.isNumber(this.tickWidth) || this.tickWidth <= 0) {
			throw "Invalid column width calculated in Sch.view.model.TimeAxis"
		}
		if (!b) {
			this.fireEvent("update", this)
		}
	},
	createHeaderRow: function(a, d) {
		var c = [],
		e = this,
		g,
		f = d.align,
		b = Ext.Date.clearTime(new Date());
		e.timeAxis.forEachInterval(a,
		function(k, h, j) {
			g = {
				align: f,
				start: k,
				end: h,
				headerCls: ""
			};
			if (d.renderer) {
				g.header = d.renderer.call(d.scope || e, k, h, g, j)
			} else {
				g.header = Ext.Date.format(k, d.dateFormat)
			}
			if (d.unit === Sch.util.Date.DAY && (!d.increment || d.increment === 1)) {
				g.headerCls += " sch-dayheadercell-" + k.getDay();
				if (Ext.Date.clearTime(k, true) - b === 0) {
					g.headerCls += " sch-dayheadercell-today"
				}
			}
			c.push(g)
		});
		return c
	},
	getDistanceBetweenDates: function(f, b) {
		var d = this.timeAxis.unit,
		c,
		e = Sch.util.Date.getMeasuringUnit(d),
		a = Sch.util.Date.getDurationInUnit(f, b, e);
		if (this.timeAxis.isContinuous()) {
			c = a * this.getSingleUnitInPixels(e)
		} else {
			c = this.getPositionFromDate(b) - this.getPositionFromDate(f)
		}
		return c
	},
	getPositionFromDate: function(a) {
		var c = -1,
		b = this.timeAxis.getTickFromDate(a);
		if (b >= 0) {
			c = this.tickWidth * b
		}
		return c
	},
	getDateFromPosition: function(a, d) {
		var c = a / this.getTickWidth(),
		b = this.timeAxis.getCount();
		if (c < 0 || c > b) {
			return null
		}
		return this.timeAxis.getDateFromTick(c, d)
	},
	getSingleUnitInPixels: function(a) {
		return Sch.util.Date.getUnitToBaseUnitRatio(this.timeAxis.getUnit(), a) * this.tickWidth / this.timeAxis.increment
	},
	getSnapPixelAmount: function() {
		if (this.snapToIncrement) {
			var a = this.timeAxis.getResolution();
			return (a.increment || 1) * this.getSingleUnitInPixels(a.unit)
		} else {
			return 1
		}
	},
	getTickWidth: function() {
		return this.tickWidth
	},
	setTickWidth: function(b, a) {
		this.tickWidth = b;
		this.update(null, a)
	},
	getTotalWidth: function() {
		return this.tickWidth * this.timeAxis.getCount()
	},
	calculateTickWidth: function(c) {
		var i = this.forceFit;
		var b = 0,
		e = this.timeAxis.getUnit(),
		k = this.timeAxis.getCount(),
		h = Number.MAX_VALUE,
		f,
		a;
		if (this.snapToIncrement) {
			var g = this.timeAxis.getResolution(),
			j = g.unit,
			d = g.increment;
			h = Sch.util.Date.getUnitToBaseUnitRatio(e, j) * d
		}
		f = Sch.util.Date.getMeasuringUnit(e);
		h = Math.min(h, Sch.util.Date.getUnitToBaseUnitRatio(e, f));
		a = Math[i ? "floor": "round"](this.getAvailableWidth() / this.timeAxis.getCount());
		if (!this.suppressFit) {
			b = (i || c < a) ? a: c;
			if (h > 0 && (!i || h < 1)) {
				b = Math.round(Math.max(1, Math[i ? "floor": "round"](h * b)) / h)
			}
		} else {
			b = c
		}
		return b
	},
	getAvailableWidth: function() {
		return this.availableWidth
	},
	setAvailableWidth: function(a) {
		this.availableWidth = Math.max(0, a);
		var b = this.calculateTickWidth(this.tickWidth);
		if (b !== this.tickWidth) {
			this.tickWidth = b;
			this.update()
		}
	},
	fitToAvailableWidth: function(a) {
		var b = Math.floor(this.availableWidth / this.timeAxis.getCount());
		this.setTickWidth(b, a)
	},
	setForceFit: function(a) {
		if (a !== this.forceFit) {
			this.forceFit = a;
			this.update()
		}
	},
	setSnapToIncrement: function(a) {
		if (a !== this.snapToIncrement) {
			this.snapToIncrement = a;
			this.update()
		}
	}
});
Ext.define("Sch.view.HorizontalTimeAxis", {
	extend: "Ext.util.Observable",
	requires: ["Ext.XTemplate"],
	trackHeaderOver: true,
	compactCellWidthThreshold: 15,
	baseCls: "sch-column-header",
	tableCls: "sch-header-row",
	headerHtmlRowTpl: '<table border="0" cellspacing="0" cellpadding="0" style="width: {totalWidth}px; {tstyle}" class="{{tableCls}} sch-header-row-{position} {cls}"><thead><tr><tpl for="cells"><td class="{{baseCls}} {headerCls}" style="position : static; text-align: {align}; width: {width}px; {style}" tabIndex="0"headerPosition="{parent.position}" headerIndex="{[xindex-1]}"><div class="sch-simple-timeheader">{header}</div></td></tpl></tr></thead></table>',
	model: null,
	hoverCls: "",
	containerEl: null,
	constructor: function(d) {
		var e = this;
		var b = !!Ext.versions.touch;
		var a = b ? "tap": "click";
		Ext.apply(this, d);
		e.callParent(arguments);
		e.model.on({
			update: e.onModelUpdate,
			scope: e
		});
		this.addEvents("refresh");
		e.containerEl = Ext.get(e.containerEl);
		if (! (e.headerHtmlRowTpl instanceof Ext.Template)) {
			e.headerHtmlRowTpl = e.headerHtmlRowTpl.replace("{{baseCls}}", this.baseCls).replace("{{tableCls}}", this.tableCls);
			e.headerHtmlRowTpl = new Ext.XTemplate(e.headerHtmlRowTpl)
		}
		if (e.trackHeaderOver && e.hoverCls) {
			e.containerEl.on({
				mousemove: e.highlightCell,
				delegate: ".sch-column-header",
				scope: e
			});
			e.containerEl.on({
				mouseleave: e.clearHighlight,
				scope: e
			})
		}
		var c = {
			scope: this,
			delegate: ".sch-column-header"
		};
		if (b) {
			c.tap = this.onElClick("tap");
			c.doubletap = this.onElClick("doubletap");
			this.addEvents("timeheadertap", "timeheaderdoubletap")
		} else {
			c.click = this.onElClick("click");
			c.dblclick = this.onElClick("dblclick");
			this.addEvents("timeheaderclick", "timeheaderdblclick")
		}
		e._listenerCfg = c;
		if (e.containerEl) {
			e.containerEl.on(c)
		}
	},
	destroy: function() {
		var a = this;
		if (a.containerEl) {
			a.containerEl.un(a._listenerCfg);
			a.containerEl.un({
				mousemove: a.highlightCell,
				delegate: ".sch-simple-timeheader",
				scope: a
			});
			a.containerEl.un({
				mouseleave: a.clearHighlight,
				scope: a
			})
		}
		a.model.un({
			update: a.onModelUpdate,
			scope: a
		})
	},
	onModelUpdate: function() {
		this.render()
	},
	getHTML: function(g, f, d) {
		var b = this.model.getColumnConfig();
		var a = this.model.getTotalWidth();
		var c = "";
		var e;
		if (b.top) {
			this.embedCellWidths(b.top);
			c += this.headerHtmlRowTpl.apply({
				totalWidth: a,
				cells: b.top,
				position: "top",
				tstyle: "border-top : 0;"
			})
		}
		if (b.middle) {
			this.embedCellWidths(b.middle);
			c += this.headerHtmlRowTpl.apply({
				totalWidth: a,
				cells: b.middle,
				position: "middle",
				tstyle: b.top ? "": "border-top : 0;",
				cls: !b.bottom && this.model.getTickWidth() <= this.compactCellWidthThreshold ? "sch-header-row-compact": ""
			})
		}
		if (b.bottom) {
			this.embedCellWidths(b.bottom);
			c += this.headerHtmlRowTpl.apply({
				totalWidth: a,
				cells: b.bottom,
				position: "bottom",
				tstyle: "",
				cls: this.model.getTickWidth() <= this.compactCellWidthThreshold ? "sch-header-row-compact": ""
			})
		}
		return c + '<div class="sch-header-secondary-canvas"></div>'
	},
	render: function() {
		if (!this.containerEl) {
			return
		}
		var e = this.containerEl,
		f = e.dom,
		d = f.style.display,
		a = this.model.getColumnConfig(),
		b = f.parentNode;
		f.style.display = "none";
		b.removeChild(f);
		var c = this.getHTML();
		f.innerHTML = c;
		if (!a.top && !a.middle) {
			this.containerEl.addCls("sch-header-single-row")
		} else {
			this.containerEl.removeCls("sch-header-single-row")
		}
		b && b.appendChild(f);
		f.style.display = d;
		this.fireEvent("refresh", this)
	},
	embedCellWidths: function(b) {
		var e = (Ext.isIE7 || Ext.isSafari) ? 1: 0;
		for (var c = 0; c < b.length; c++) {
			var a = b[c];
			var d = this.model.getDistanceBetweenDates(a.start, a.end);
			if (d) {
				a.width = d - (c ? e: 0)
			} else {
				a.width = 0;
				a.style = "display: none"
			}
		}
	},
	onElClick: function(a) {
		return function(e, f) {
			f = e.delegatedTarget || f;
			var b = Ext.fly(f).getAttribute("headerPosition"),
			c = Ext.fly(f).getAttribute("headerIndex"),
			d = this.model.getColumnConfig()[b][c];
			this.fireEvent("timeheader" + a, this, d.start, d.end, e)
		}
	},
	highlightCell: function(c, a) {
		var b = this;
		if (a !== b.highlightedCell) {
			b.clearHighlight();
			b.highlightedCell = a;
			Ext.fly(a).addCls(b.hoverCls)
		}
	},
	clearHighlight: function() {
		var b = this,
		a = b.highlightedCell;
		if (a) {
			Ext.fly(a).removeCls(b.hoverCls);
			delete b.highlightedCell
		}
	}
});
Ext.define("Sch.column.timeAxis.Horizontal", {
	extend: "Ext.grid.column.Column",
	alias: "widget.timeaxiscolumn",
	draggable: false,
	groupable: false,
	hideable: false,
	sortable: false,
	fixed: true,
	menuDisabled: true,
	cls: "sch-simple-timeaxis",
	tdCls: "sch-timetd",
	requires: ["Sch.view.HorizontalTimeAxis"],
	timeAxisViewModel: null,
	headerView: null,
	hoverCls: "sch-column-header-over",
	trackHeaderOver: true,
	compactCellWidthThreshold: 20,
	initComponent: function() {
		this.ownHoverCls = this.hoverCls;
		this.hoverCls = "";
		this.callParent(arguments)
	},
	afterRender: function() {
		var a = this;
		a.headerView = new Sch.view.HorizontalTimeAxis({
			model: a.timeAxisViewModel,
			containerEl: a.titleEl,
			hoverCls: a.ownHoverCls,
			trackHeaderOver: a.trackHeaderOver,
			compactCellWidthThreshold: a.compactCellWidthThreshold
		});
		a.headerView.on("refresh", a.onTimeAxisViewRefresh, a);
		a.ownerCt.on("afterlayout",
		function() {
			a.mon(a.ownerCt, "resize", a.onHeaderContainerResize, a);
			if (this.getWidth() > 0) {
				a.timeAxisViewModel.update(a.getAvailableWidthForSchedule());
				a.setWidth(a.timeAxisViewModel.getTotalWidth())
			}
		},
		null, {
			single: true
		});
		this.enableBubble("timeheaderclick", "timeheaderdblclick");
		a.relayEvents(a.headerView, ["timeheaderclick", "timeheaderdblclick"]);
		a.callParent(arguments)
	},
	initRenderData: function() {
		var a = this;
		a.renderData.headerCls = a.renderData.headerCls || a.headerCls;
		return a.callParent(arguments)
	},
	destroy: function() {
		if (this.headerView) {
			this.headerView.destroy()
		}
		this.callParent(arguments)
	},
	onTimeAxisViewRefresh: function() {
		this.headerView.un("refresh", this.onTimeAxisViewRefresh, this);
		this.setWidth(this.timeAxisViewModel.getTotalWidth());
		this.headerView.on("refresh", this.onTimeAxisViewRefresh, this)
	},
	getAvailableWidthForSchedule: function() {
		var c = this.ownerCt.getWidth();
		var a = this.ownerCt.items;
		for (var b = 1; b < a.length; b++) {
			c -= a.get(b).getWidth()
		}
		return c - Ext.getScrollbarSize().width - 1
	},
	onResize: function() {
		this.callParent(arguments);
		this.timeAxisViewModel.setAvailableWidth(this.getAvailableWidthForSchedule())
	},
	onHeaderContainerResize: function() {
		this.timeAxisViewModel.setAvailableWidth(this.getAvailableWidthForSchedule());
		this.headerView.render()
	}
});
Ext.define("Sch.mixin.Lockable", {
	extend: "Ext.grid.locking.Lockable",
	useSpacer: true,
	syncRowHeight: false,
	injectLockable: function() {
		var j = this;
		var h = Ext.data.TreeStore && j.store instanceof Ext.data.TreeStore;
		var c = j.getEventSelectionModel ? j.getEventSelectionModel() : j.getSelectionModel();
		j.lockedGridConfig = Ext.apply({},
		j.lockedGridConfig || {});
		j.normalGridConfig = Ext.apply({},
		j.schedulerConfig || j.normalGridConfig || {});
		if (j.lockedXType) {
			j.lockedGridConfig.xtype = j.lockedXType
		}
		if (j.normalXType) {
			j.normalGridConfig.xtype = j.normalXType
		}
		var a = j.lockedGridConfig,
		i = j.normalGridConfig;
		Ext.applyIf(j.lockedGridConfig, {
			useArrows: true,
			trackMouseOver: false,
			split: true,
			animCollapse: false,
			collapseDirection: "left",
			region: "west"
		});
		Ext.applyIf(j.normalGridConfig, {
			viewType: j.viewType,
			layout: "fit",
			sortableColumns: false,
			enableColumnMove: false,
			enableColumnResize: false,
			enableColumnHide: false,
			getSchedulingView: function() {
				var m = typeof console !== "undefined" ? console: false;
				if (m && m.log) {
					m.log('getSchedulingView is deprecated on the inner grid panel. Instead use getView on the "normal" subgrid.')
				}
				return this.getView()
			},
			selModel: c,
			collapseDirection: "right",
			animCollapse: false,
			region: "center"
		});
		if (j.orientation === "vertical") {
			a.store = i.store = j.timeAxis
		}
		if (a.width) {
			j.syncLockedWidth = Ext.emptyFn;
			a.scroll = "horizontal";
			a.scrollerOwner = true
		}
		var e = j.lockedViewConfig = j.lockedViewConfig || {};
		var k = j.normalViewConfig = j.normalViewConfig || {};
		if (h) {
			var g = Ext.tree.View.prototype.onUpdate;
			e.onUpdate = function() {
				this.refreshSize = function() {
					var n = this,
					m = n.getBodySelector();
					if (m) {
						n.body.attach(n.el.child(m, true))
					}
				};
				Ext.suspendLayouts();
				g.apply(this, arguments);
				Ext.resumeLayouts();
				this.refreshSize = Ext.tree.View.prototype.refreshSize
			};
			e.store = k.store = j.store.nodeStore
		}
		var f = j.layout;
		var d = a.width;
		this.callParent(arguments);
		var l = j.lockedGrid.getView();
		var b = j.normalGrid.getView();
		if (d || f === "border") {
			if (d) {
				j.lockedGrid.setWidth(d)
			}
			b.addCls("sch-timeline-horizontal-scroll");
			l.addCls("sch-locked-horizontal-scroll")
		}
		if (j.normalGrid.collapsed) {
			j.normalGrid.collapsed = false;
			b.on("boxready",
			function() {
				j.normalGrid.collapse()
			},
			j, {
				delay: 10
			})
		}
		if (j.lockedGrid.collapsed) {
			if (l.bufferedRenderer) {
				l.bufferedRenderer.disabled = true
			}
		}
		if (Ext.getScrollbarSize().width === 0) {
			l.addCls("sch-ganttpanel-force-locked-scroll")
		}
		if (h) {
			this.setupLockableTree()
		}
		if (j.useSpacer) {
			b.on("refresh", j.updateSpacer, j);
			l.on("refresh", j.updateSpacer, j)
		}
		if (f !== "fit") {
			j.layout = f
		}
		if (l.store !== b.store) {
			Ext.Error.raise("Sch.mixin.Lockable setup failed, not sharing store between the two views")
		}
		if (b.bufferedRenderer) {
			this.lockedGrid.on("expand",
			function() {
				l.el.dom.scrollTop = b.el.dom.scrollTop
			});
			this.patchSubGrid(this.lockedGrid);
			this.patchSubGrid(this.normalGrid);
			this.patchBufferedRenderingPlugin(b.bufferedRenderer);
			this.patchBufferedRenderingPlugin(l.bufferedRenderer)
		}
	},
	setupLockableTree: function() {
		var c = this;
		var b = c.lockedGrid.getView();
		var a = Sch.mixin.FilterableTreeView.prototype;
		b.initTreeFiltering = a.initTreeFiltering;
		b.onFilterChangeStart = a.onFilterChangeStart;
		b.onFilterChangeEnd = a.onFilterChangeEnd;
		b.onFilterCleared = a.onFilterCleared;
		b.onFilterSet = a.onFilterSet;
		b.initTreeFiltering()
	},
	updateSpacer: function() {
		var g = this.lockedGrid.getView();
		var e = this.normalGrid.getView();
		if (g.rendered && e.rendered && g.el.child("table")) {
			var f = this,
			c = g.el,
			d = e.el.dom,
			b = c.dom.id + "-spacer",
			h = (d.offsetHeight - d.clientHeight) + "px";
			f.spacerEl = Ext.getDom(b);
			if (Ext.isIE6 || Ext.isIE7 || (Ext.isIEQuirks && Ext.isIE8) && f.spacerEl) {
				Ext.removeNode(f.spacerEl);
				f.spacerEl = null
			}
			if (f.spacerEl) {
				f.spacerEl.style.height = h
			} else {
				var a = c;
				Ext.core.DomHelper.append(a, {
					id: b,
					style: "height: " + h
				})
			}
		}
	},
	onLockedViewScroll: function() {
		this.callParent(arguments);
		var a = this.lockedGrid.getView().bufferedRenderer;
		if (a) {
			a.onViewScroll()
		}
	},
	onNormalViewScroll: function() {
		this.callParent(arguments);
		var a = this.normalGrid.getView().bufferedRenderer;
		if (a) {
			a.onViewScroll()
		}
	},
	patchSubGrid: function(a) {
		var b = a.getView().bufferedRenderer;
		a.on({
			collapse: function() {
				b.disabled = true
			},
			expand: function() {
				b.disabled = false
			}
		})
	},
	patchBufferedRenderingPlugin: function(c) {
		c.variableRowHeight = true;
		if (Ext.getVersion("extjs").isLessThan("4.2.1.883")) {
			c.view.on("afterrender",
			function() {
				c.view.el.un("scroll", c.onViewScroll, c)
			},
			this, {
				single: true,
				delay: 1
			});
			var b = c.stretchView;
			c.stretchView = function(e, d) {
				var g = this,
				f = (g.store.buffered ? g.store.getTotalCount() : g.store.getCount());
				if (f && (g.view.all.endIndex === f - 1)) {
					d = g.bodyTop + e.body.dom.offsetHeight
				}
				b.apply(this, [e, d])
			}
		} else {
			var a = c.enable;
			c.enable = function() {
				if (c.grid.collapsed) {
					return
				}
				return a.apply(this, arguments)
			}
		}
	},
	showMenuBy: function(b, f) {
		var e = this.getMenu(),
		c = e.down("#unlockItem"),
		d = e.down("#lockItem"),
		a = c.prev();
		a.hide();
		c.hide();
		d.hide()
	}
});
Ext.define("Sch.plugin.TreeCellEditing", {
	extend: "Ext.grid.plugin.CellEditing",
	alias: "plugin.scheduler_treecellediting",
	lockableScope: "locked",
	init: function(a) {
		this._grid = a;
		this.on("beforeedit", this.checkReadOnly, this);
		this.on("beforeedit", this.onBeforeCellEdit, this);
		this.callParent(arguments)
	},
	bindPositionFixer: function() {
		Ext.on({
			afterlayout: this.fixEditorPosition,
			scope: this
		})
	},
	unbindPositionFixer: function() {
		Ext.un({
			afterlayout: this.fixEditorPosition,
			scope: this
		})
	},
	fixEditorPosition: function(a) {
		var b = this.getActiveEditor();
		if (b) {
			var d = this.getEditingContext(this.context.record, this.context.column);
			if (d) {
				this.context.row = d.row;
				this.context.rowIdx = d.rowIdx;
				b.boundEl = this.getCell(d.record, d.column);
				b.realign();
				var c = this._grid.getView();
				c.focusedRow = c.getNode(d.rowIdx)
			}
		}
	},
	checkReadOnly: function() {
		var a = this._grid;
		if (! (a instanceof Sch.panel.TimelineTreePanel)) {
			a = a.up("tablepanel")
		}
		return ! a.isReadOnly()
	},
	startEdit: function(a, d, b) {
		this._grid.suspendLayouts();
		var c = d.getEditor && d.getEditor(),
		e;
		if (c && c.setSuppressTaskUpdate) {
			e = c.getSuppressTaskUpdate();
			c.setSuppressTaskUpdate(true)
		}
		this.completeEdit();
		var f = this.callParent(arguments);
		if (c && c.setSuppressTaskUpdate) {
			c.setSuppressTaskUpdate(e)
		}
		this._grid.resumeLayouts();
		return f
	},
	onBeforeCellEdit: function(c, a) {
		var b = a.column;
		var d = b.field;
		if (d) {
			if (d.setTask) {
				d.setTask(a.record);
				a.value = a.originalValue = d.getValue()
			} else {
				if (!b.dataIndex && a.value === undefined) {
					a.value = d.getDisplayValue(a.record)
				}
			}
		}
	},
	onEditComplete: function(c, f, b) {
		var e = this,
		a,
		d;
		if (c.field.applyChanges) {
			a = c.field.task || e.context.record;
			d = true;
			a.set = function() {
				delete a.set;
				d = false;
				c.field.applyChanges(a)
			}
		}
		this.callParent(arguments);
		if (d) {
			delete a.set
		}
		this.unbindPositionFixer()
	},
	showEditor: function(a, b, c) {
		var f = this.grid.getSelectionModel();
		var e = f.selectByPosition;
		f.selectByPosition = Ext.emptyFn;
		var d;
		if (a.field && a.field.setSuppressTaskUpdate) {
			d = a.field.getSuppressTaskUpdate();
			a.field.setSuppressTaskUpdate(true)
		}
		this.callParent(arguments);
		if (a.field && a.field.setSuppressTaskUpdate) {
			a.field.setSuppressTaskUpdate(d)
		}
		f.selectByPosition = e;
		this.bindPositionFixer()
	},
	cancelEdit: function() {
		this.callParent(arguments);
		this.unbindPositionFixer()
	}
});
Ext.define("Sch.feature.ResizeZone", {
	extend: "Ext.util.Observable",
	requires: ["Ext.resizer.Resizer", "Sch.tooltip.Tooltip"],
	showTooltip: true,
	validatorFn: Ext.emptyFn,
	validatorFnScope: null,
	schedulerView: null,
	origEl: null,
	handlePos: null,
	eventRec: null,
	tip: null,
	constructor: function(a) {
		Ext.apply(this, a);
		var b = this.schedulerView;
		b.on({
			destroy: this.cleanUp,
			scope: this
		});
		b.mon(b.el, {
			mousedown: this.onMouseDown,
			mouseup: this.onMouseUp,
			scope: this,
			delegate: ".sch-resizable-handle"
		});
		this.callParent(arguments)
	},
	onMouseDown: function(f, a) {
		var b = this.schedulerView;
		var d = this.eventRec = b.resolveEventRecord(a);
		var c = d.isResizable();
		if (c === false || typeof c === "string" && !a.className.match(c)) {
			return
		}
		this.eventRec = d;
		this.handlePos = this.getHandlePosition(a);
		this.origEl = Ext.get(f.getTarget(".sch-event"));
		b.el.on({
			mousemove: this.onMouseMove,
			scope: this,
			single: true
		})
	},
	onMouseUp: function(c, a) {
		var b = this.schedulerView;
		b.el.un({
			mousemove: this.onMouseMove,
			scope: this,
			single: true
		})
	},
	onMouseMove: function(f, a) {
		var b = this.schedulerView;
		var d = this.eventRec;
		if (!d || b.fireEvent("beforeeventresize", b, d, f) === false) {
			return
		}
		delete this.eventRec;
		f.stopEvent();
		var c = this.handlePos;
		this.resizer = this.createResizer(this.origEl, d, c, f, a);
		this.resizer.resizeTracker.onMouseDown(f, this.resizer[c].dom);
		if (this.showTooltip) {
			if (!this.tip) {
				this.tip = Ext.create("Sch.tooltip.Tooltip", {
					schedulerView: b,
					cls: "sch-resize-tip"
				})
			}
			this.tip.update(d.getStartDate(), d.getEndDate(), true);
			this.tip.show(this.origEl)
		}
		b.fireEvent("eventresizestart", b, d)
	},
	getHandlePosition: function(a) {
		if (this.schedulerView.getOrientation() === "horizontal") {
			if (this.schedulerView.rtl) {
				return a.className.match("start") ? "east": "west"
			}
			return a.className.match("start") ? "west": "east"
		} else {
			return a.className.match("start") ? "north": "south"
		}
	},
	createResizer: function(c, g, b) {
		var l = this.schedulerView,
		f = l.resolveResource(c),
		h = l.getSnapPixelAmount(),
		j = l.getScheduleRegion(f, g),
		a = l.getDateConstraints(f, g),
		e = {
			target: c,
			dateConstraints: a,
			resourceRecord: f,
			eventRecord: g,
			handles: b.substring(0, 1),
			minHeight: c.getHeight(),
			constrainTo: j,
			listeners: {
				resizedrag: this.partialResize,
				resize: this.afterResize,
				scope: this
			}
		};
		var k = c.id;
		var d = "_" + k;
		c.id = c.dom.id = d;
		Ext.cache[d] = Ext.cache[k];
		if (l.getOrientation() === "vertical") {
			if (h > 0) {
				Ext.apply(e, {
					minHeight: h,
					heightIncrement: h
				})
			}
		} else {
			if (h > 0) {
				Ext.apply(e, {
					minWidth: h,
					widthIncrement: h
				})
			}
		}
		var i = Ext.create("Ext.resizer.Resizer", e);
		c.setStyle("z-index", parseInt(c.getStyle("z-index"), 10) + 1);
		return i
	},
	getStartEndDates: function(f) {
		var e = this.resizer,
		c = e.el,
		d = this.schedulerView,
		b = (d.rtl && e.handles[0] === "e") || (!d.rtl && e.handles[0] === "w") || e.handles[0] === "n",
		g,
		a;
		if (b) {
			a = e.eventRecord.getEndDate();
			g = d.getDateFromXY([d.rtl ? c.getRight() : c.getLeft(), c.getTop()], "round")
		} else {
			g = e.eventRecord.getStartDate();
			a = d.getDateFromXY([d.rtl ? c.getLeft() : c.getRight(), c.getBottom()], "round")
		}
		if (e.dateConstraints) {
			g = Sch.util.Date.constrain(g, e.dateConstraints.start, e.dateConstraints.end);
			a = Sch.util.Date.constrain(a, e.dateConstraints.start, e.dateConstraints.end)
		}
		return {
			start: g,
			end: a
		}
	},
	partialResize: function(b, d, h, g) {
		var j = this.schedulerView,
		i = this.getStartEndDates(g.getXY()),
		c = i.start,
		f = i.end;
		if (!c || !f || ((b.start - c === 0) && (b.end - f === 0))) {
			return
		}
		var a = this.validatorFn.call(this.validatorFnScope || this, b.resourceRecord, b.eventRecord, c, f) !== false;
		b.end = f;
		b.start = c;
		j.fireEvent("eventpartialresize", j, b.eventRecord, c, f, b.el);
		if (this.showTooltip) {
			this.tip.update(c, f, a)
		}
	},
	afterResize: function(a, m, f, g) {
		if (this.showTooltip) {
			this.tip.hide()
		}
		delete Ext.cache[a.el.id];
		a.el.id = a.el.dom.id = a.el.id.substr(1);
		var j = this,
		i = a.resourceRecord,
		k = a.eventRecord,
		d = k.getStartDate(),
		p = k.getEndDate(),
		b = a.start || d,
		c = a.end || p,
		o = j.schedulerView,
		n = false,
		l = true;
		j.resizeContext = {
			eventRecord: k,
			start: b,
			end: c,
			finalize: function() {
				j.finalize.apply(j, arguments)
			}
		};
		if (b && c && (c - b > 0) && ((b - d !== 0) || (c - p !== 0)) && j.validatorFn.call(j.validatorFnScope || j, i, k, b, c, g) !== false) {
			l = o.fireEvent("beforeeventresizefinalize", j, j.resizeContext, g) !== false;
			n = true
		} else {
			o.refreshKeepingScroll()
		}
		if (l) {
			j.finalize(n)
		}
	},
	finalize: function(a) {
		var b = this.schedulerView;
		var c = this.resizeContext;
		if (a) {
			c.eventRecord.setStartEndDate(c.start, c.end, b.eventStore.skipWeekendsDuringDragDrop)
		} else {
			b.refreshKeepingScroll()
		}
		this.resizer.destroy();
		b.fireEvent("eventresizeend", b, c.eventRecord);
		this.resizeContext = null
	},
	cleanUp: function() {
		if (this.tip) {
			this.tip.destroy()
		}
	}
});
Ext.define("Sch.feature.PointDragZone", {
	extend: "Ext.dd.DragZone",
	requires: ["Sch.tooltip.Tooltip"],
	repairHighlight: false,
	repairHighlightColor: "transparent",
	containerScroll: true,
	dropAllowed: "sch-dragproxy",
	dropNotAllowed: "sch-dragproxy",
	constructor: function(b, a) {
		this.proxy = this.proxy || Ext.create("Ext.dd.StatusProxy", {
			shadow: false,
			dropAllowed: this.dropAllowed,
			dropNotAllowed: this.dropNotAllowed
		});
		this.callParent(arguments);
		this.isTarget = true;
		this.scroll = false;
		this.ignoreSelf = false;
		Ext.dd.ScrollManager.register(this.schedulerView.el);
		if (this.schedulerView.rtl) {
			this.proxy.addCls("sch-rtl")
		}
	},
	destroy: function() {
		this.callParent(arguments);
		if (this.tip) {
			this.tip.destroy()
		}
		Ext.dd.ScrollManager.unregister(this.schedulerView.el)
	},
	autoOffset: function(a, b) {
		this.setDelta(this.dragData.offsets[0], this.dragData.offsets[1])
	},
	constrainTo: function(a, b) {
		this.resetConstraints();
		this.initPageX = a.left;
		this.initPageY = a.top;
		this.setXConstraint(a.left, a.right - (b.right - b.left), this.xTickSize);
		this.setYConstraint(a.top, a.bottom - (b.bottom - b.top), this.yTickSize)
	},
	setXConstraint: function(c, b, a) {
		this.leftConstraint = c;
		this.rightConstraint = b;
		this.minX = c;
		this.maxX = b;
		if (a) {
			this.setXTicks(this.initPageX, a)
		}
		this.constrainX = true
	},
	setYConstraint: function(a, c, b) {
		this.topConstraint = a;
		this.bottomConstraint = c;
		this.minY = a;
		this.maxY = c;
		if (b) {
			this.setYTicks(this.initPageY, b)
		}
		this.constrainY = true
	},
	onDragEnter: Ext.emptyFn,
	onDragOut: Ext.emptyFn,
	resolveStartEndDates: function(e) {
		var a = this.dragData,
		c,
		d = a.origStart,
		b = a.origEnd;
		if (!a.startsOutsideView) {
			c = this.schedulerView.getStartEndDatesFromRegion(e, "round");
			if (c) {
				d = c.start || a.startDate;
				b = Sch.util.Date.add(d, Sch.util.Date.MILLI, a.duration)
			}
		} else {
			if (!a.endsOutsideView) {
				c = this.schedulerView.getStartEndDatesFromRegion(e, "round");
				if (c) {
					b = c.end || a.endDate;
					d = Sch.util.Date.add(b, Sch.util.Date.MILLI, -a.duration)
				}
			}
		}
		return {
			startDate: d,
			endDate: b
		}
	},
	onDragOver: function(c, f) {
		var a = this.dragData;
		if (!a.originalHidden) {
			Ext.each(a.eventEls,
			function(e) {
				e.hide()
			});
			a.originalHidden = true
		}
		var d = a.startDate;
		var b = a.newResource;
		this.updateDragContext(c);
		if (a.startDate - d !== 0 || b !== a.newResource) {
			this.schedulerView.fireEvent("eventdrag", this.schedulerView, a.eventRecords, a.startDate, a.newResource, a)
		}
		if (this.showTooltip) {
			this.tip.update(a.startDate, a.endDate, a.valid)
		}
	},
	onStartDrag: function(b, d) {
		var c = this.schedulerView,
		a = this.dragData;
		c.fireEvent("eventdragstart", c, a.eventRecords)
	},
	startDrag: function() {
		var b = this.callParent(arguments);
		this.dragData.refElement = this.proxy.el.down("#sch-id-dd-ref");
		if (this.showTooltip) {
			var a = this.schedulerView;
			if (!this.tip) {
				this.tip = Ext.create("Sch.tooltip.Tooltip", {
					schedulerView: a,
					cls: "sch-dragdrop-tip",
					renderTo: document.body
				})
			}
			this.tip.update(this.dragData.origStart, this.dragData.origEnd, true);
			this.tip.el.setStyle("visibility");
			this.tip.show(this.dragData.refElement, this.dragData.offsets[0])
		}
		return b
	},
	getDragData: function(x) {
		var q = this.schedulerView,
		p = x.getTarget(q.eventSelector);
		if (!p) {
			return
		}
		var l = q.resolveEventRecord(p);
		if (!l || l.isDraggable() === false || q.fireEvent("beforeeventdrag", q, l, x) === false) {
			return null
		}
		var i = x.getXY(),
		a = Ext.get(p),
		y = a.getXY(),
		k = [i[0] - y[0], i[1] - y[1]],
		m = a.getRegion(),
		u = q.getSnapPixelAmount();
		var b = q.resolveResource(p);
		this.clearTicks();
		a.removeCls("sch-event-hover");
		if (q.constrainDragToResource) {
			if (!b) {
				throw "Resource could not be resolved for event: " + l.getId()
			}
			this.constrainToResource(q.getScheduleRegion(b, l), m, q.getOrientation())
		} else {
			this.constrainTo(q.getScheduleRegion(null, l), m)
		}
		if (u > 1) {
			if (q.getOrientation() === "horizontal") {
				this.setXConstraint(this.leftConstraint, this.rightConstraint, u)
			} else {
				this.setYConstraint(this.topConstraint, this.bottomConstraint, u)
			}
		}
		var d = l.getStartDate(),
		o = l.getEndDate(),
		n = q.timeAxis,
		j = n.getStart(),
		h = n.getEnd(),
		v = d < j,
		r = o > h,
		c = Ext.getBody().getScroll(),
		g = this.getRelatedRecords(l),
		w = [a];
		Ext.Array.each(g,
		function(s) {
			var e = q.getElementFromEventRecord(s);
			if (e) {
				w.push(e)
			}
		});
		var f = {
			offsets: k,
			eventEls: w,
			repairXY: y,
			eventRecords: [l].concat(g),
			relatedEventRecords: g,
			resourceRecord: b,
			origStart: d,
			origEnd: o,
			startDate: d,
			endDate: o,
			duration: o - d,
			startsOutsideView: v,
			endsOutsideView: r,
			bodyScroll: c,
			eventObj: x
		};
		f.ddel = this.getDragElement(a, f);
		return f
	},
	constrainToResource: function(b, c, a) {
		this.resetConstraints();
		this.initPageX = b.left;
		this.initPageY = b.top;
		if (a === "horizontal") {
			this.setXConstraint(b.left, b.right - (c.right - c.left), this.xTickSize);
			this.setYConstraint(c.top, c.top, this.yTickSize)
		} else {
			this.setXConstraint(c.left, c.left, this.xTickSize);
			this.setYConstraint(b.top, b.bottom - (c.bottom - c.top), this.yTickSize)
		}
	},
	getRelatedRecords: function(c) {
		var b = this.schedulerView;
		var d = b.selModel;
		var a = [];
		if (d.selected.getCount() > 1) {
			d.selected.each(function(e) {
				if (e !== c && e.isDraggable() !== false) {
					a.push(e)
				}
			})
		}
		return a
	},
	getDragElement: function(a, e) {
		var c = this.schedulerView;
		var d = e.eventEls;
		var f;
		if (d.length > 1) {
			var b = Ext.get(Ext.core.DomHelper.createDom({
				tag: "div",
				cls: "sch-dd-wrap",
				style: {
					overflow: "visible"
				}
			}));
			Ext.Array.each(d,
			function(h) {
				f = h.dom.cloneNode(true);
				if (h.dom === a.dom) {
					f.id = "sch-id-dd-ref"
				} else {
					f.id = Ext.id()
				}
				b.appendChild(f);
				var g = h.getOffsetsTo(a);
				Ext.fly(f).setStyle({
					left: g[0] + "px",
					top: g[1] + "px"
				})
			});
			return b.dom
		} else {
			f = a.dom.cloneNode(true);
			f.id = "sch-id-dd-ref";
			f.style.left = 0;
			f.style.top = 0;
			return f
		}
	},
	onDragDrop: function(h, i) {
		this.updateDragContext(h);
		var d = this,
		b = d.schedulerView,
		g = d.cachedTarget || Ext.dd.DragDropMgr.getDDById(i),
		f = d.dragData,
		a = false,
		c = true;
		f.ddCallbackArgs = [g, h, i];
		if (f.valid && f.startDate && f.endDate) {
			f.finalize = function() {
				d.finalize.apply(d, arguments)
			};
			c = b.fireEvent("beforeeventdropfinalize", d, f, h) !== false;
			if (c && d.isValidDrop(f.resourceRecord, f.newResource, f.relatedEventRecords, f.eventRecords[0])) {
				a = (f.startDate - f.origStart) !== 0 || f.newResource !== f.resourceRecord
			}
		}
		if (c) {
			d.finalize(f.valid && a)
		}
	},
	finalize: function(c) {
		var e = this,
		b = e.schedulerView,
		f = e.dragData;
		if (e.tip) {
			e.tip.hide()
		}
		if (c) {
			var a,
			d = function() {
				a = true
			};
			b.on("itemupdate", d, null, {
				single: true
			});
			e.updateRecords(f);
			b.un("itemupdate", d, null, {
				single: true
			});
			if (!a) {
				e.onInvalidDrop.apply(e, f.ddCallbackArgs)
			} else {
				if (Ext.isIE9) {
					e.proxy.el.setStyle("visibility", "hidden");
					Ext.Function.defer(e.onValidDrop, 10, e, f.ddCallbackArgs)
				} else {
					e.onValidDrop.apply(e, f.ddCallbackArgs)
				}
				b.fireEvent("aftereventdrop", b, f.eventRecords)
			}
		} else {
			e.onInvalidDrop.apply(e, f.ddCallbackArgs)
		}
	},
	updateRecords: function(a) {
		throw "Must be implemented by subclass"
	},
	isValidDrop: function(a, b, d, c) {
		return true
	},
	onInvalidDrop: function(d, c, f) {
		if (Ext.isIE && !c) {
			c = d;
			d = d.getTarget() || document.body
		}
		var a = this.schedulerView,
		b;
		if (this.tip) {
			this.tip.hide()
		}
		Ext.each(this.dragData.eventEls,
		function(e) {
			e.show()
		});
		b = this.callParent([d, c, f]);
		a.fireEvent("aftereventdrop", a, this.dragData.eventRecords);
		return b
	}
});
Ext.define("Sch.feature.ColumnLines", {
	extend: "Sch.plugin.Lines",
	cls: "sch-column-line",
	showTip: false,
	requires: ["Ext.data.JsonStore"],
	init: function(a) {
		this.timeAxis = a.getTimeAxis();
		this.store = Ext.create("Ext.data.JsonStore", {
			fields: ["Date"],
			data: a.getOrientation() === "horizontal" ? this.getData() : []
		});
		this.callParent(arguments);
		this.panel = a;
		this.panel.on({
			orientationchange: this.populate,
			destroy: this.onHostDestroy,
			scope: this
		});
		this.timeAxis.on("reconfigure", this.populate, this)
	},
	onHostDestroy: function() {
		this.timeAxis.un("reconfigure", this.populate, this)
	},
	populate: function() {
		var a = this.panel;
		var b = a.getOrientation() === "horizontal" && a.getStore().getCount() > 0;
		this.store.removeAll(b);
		this.store.add(this.getData())
	},
	getElementData: function() {
		var a = this.schedulerView;
		if (a.getOrientation() === "horizontal" && a.store.getCount() > 0) {
			return this.callParent(arguments)
		}
		return []
	},
	getData: function() {
		var a = [];
		this.timeAxis.forEachMainInterval(function(d, b, c) {
			if (c > 0) {
				a.push({
					Date: d
				})
			}
		});
		return a
	}
});
Ext.define("Sch.plugin.CurrentTimeLine", {
	extend: "Sch.plugin.Lines",
	alias: "plugin.scheduler_currenttimeline",
	mixins: ["Sch.mixin.Localizable"],
	updateInterval: 60000,
	autoUpdate: true,
	expandToFitView: true,
	timer: null,
	init: function(c) {
		var b = Ext.create("Ext.data.JsonStore", {
			fields: ["Date", "Cls", "Text"],
			data: [{
				Date: new Date(),
				Cls: "sch-todayLine",
				Text: this.L("tooltipText")
			}]
		});
		var a = b.first();
		if (this.autoUpdate) {
			this.timer = setInterval(function() {
				a.set("Date", new Date())
			},
			this.updateInterval)
		}
		c.on("destroy", this.onHostDestroy, this);
		this.store = b;
		this.callParent(arguments)
	},
	onHostDestroy: function() {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null
		}
		if (this.store.autoDestroy) {
			this.store.destroy()
		}
	}
});
Ext.define("Sch.view.Horizontal", {
	requires: ["Ext.util.Region", "Ext.Element", "Sch.util.Date"],
	view: null,
	constructor: function(a) {
		Ext.apply(this, a)
	},
	translateToScheduleCoordinate: function(a) {
		var b = this.view;
		if (b.rtl) {
			return b.getTimeAxisColumn().getEl().getRight() - a
		}
		return a - b.getEl().getX() + b.getScroll().left
	},
	translateToPageCoordinate: function(a) {
		var b = this.view;
		return a + b.getEl().getX() - b.getScroll().left
	},
	getEventRenderData: function(a, b, c) {
		var h = b || a.getStartDate(),
		g = c || a.getEndDate() || h,
		j = this.view,
		f = j.timeAxis.getStart(),
		k = j.timeAxis.getEnd(),
		i = Math,
		e = j.getXFromDate(Sch.util.Date.max(h, f)),
		l = j.getXFromDate(Sch.util.Date.min(g, k)),
		d = {};
		if (this.view.rtl) {
			d.right = i.min(e, l)
		} else {
			d.left = i.min(e, l)
		}
		d.width = i.max(1, i.abs(l - e)) - j.eventBorderWidth;
		if (j.managedEventSizing) {
			d.top = i.max(0, (j.barMargin - ((Ext.isIE && !Ext.isStrict) ? 0: j.eventBorderWidth - j.cellTopBorderWidth)));
			d.height = j.rowHeight - (2 * j.barMargin) - j.eventBorderWidth
		}
		d.start = h;
		d.end = g;
		d.startsOutsideView = h < f;
		d.endsOutsideView = g > k;
		return d
	},
	getScheduleRegion: function(e, g) {
		var c = Ext.Element.prototype.getRegion ? "getRegion": "getPageBox",
		j = this.view,
		i = e ? Ext.fly(j.getRowNode(e))[c]() : j.getTableRegion(),
		f = j.timeAxis.getStart(),
		l = j.timeAxis.getEnd(),
		b = j.getDateConstraints(e, g) || {
			start: f,
			end: l
		},
		d = this.translateToPageCoordinate(j.getXFromDate(b.start)),
		k = this.translateToPageCoordinate(j.getXFromDate(b.end)),
		h = i.top + j.barMargin,
		a = i.bottom - j.barMargin - j.eventBorderWidth;
		return new Ext.util.Region(h, Math.max(d, k), a, Math.min(d, k))
	},
	getResourceRegion: function(j, e, i) {
		var m = this.view,
		d = m.getRowNode(j),
		f = Ext.fly(d).getOffsetsTo(m.getEl()),
		k = m.timeAxis.getStart(),
		o = m.timeAxis.getEnd(),
		c = e ? Sch.util.Date.max(k, e) : k,
		g = i ? Sch.util.Date.min(o, i) : o,
		h = m.getXFromDate(c),
		n = m.getXFromDate(g),
		l = f[1] + m.cellTopBorderWidth,
		a = f[1] + Ext.fly(d).getHeight() - m.cellBottomBorderWidth;
		if (!Ext.versions.touch) {
			var b = m.getScroll();
			l += b.top;
			a += b.top
		}
		return new Ext.util.Region(l, Math.max(h, n), a, Math.min(h, n))
	},
	columnRenderer: function(d, q, k, n, p) {
		var o = this.view;
		var b = o.eventStore.getEventsForResource(k);
		if (b.length === 0) {
			return
		}
		var h = o.timeAxis,
		m = [],
		g,
		e;
		for (g = 0, e = b.length; g < e; g++) {
			var a = b[g],
			c = a.getStartDate(),
			f = a.getEndDate();
			if (c && f && h.timeSpanInAxis(c, f)) {
				m[m.length] = o.generateTplData(a, k, n)
			}
		}
		if (o.dynamicRowHeight) {
			var j = o.eventLayout.horizontal;
			j.applyLayout(m, k);
			q.rowHeight = j.getRowHeight(k, b)
		}
		return o.eventTpl.apply(m)
	},
	resolveResource: function(b) {
		var a = this.view;
		var c = a.findRowByChild(b);
		if (c) {
			return a.getRecordForRowNode(c)
		}
		return null
	},
	getTimeSpanRegion: function(b, h, g) {
		var d = this.view,
		c = d.getXFromDate(b),
		e = d.getXFromDate(h || b),
		a,
		f;
		if (!f) {
			f = d.getTableRegion()
		}
		if (g) {
			a = Math.max(f ? f.bottom - f.top: 0, d.getEl().dom.clientHeight)
		} else {
			a = f ? f.bottom - f.top: 0
		}
		return new Ext.util.Region(0, Math.max(c, e), a, Math.min(c, e))
	},
	getStartEndDatesFromRegion: function(c, b) {
		var a = this.view.getDateFromCoordinate(c.left, b),
		d = this.view.getDateFromCoordinate(c.right, b);
		if (d && a) {
			return {
				start: Sch.util.Date.min(a, d),
				end: Sch.util.Date.max(a, d)
			}
		}
		return null
	},
	onEventAdd: function(n, m) {
		var h = this.view;
		var e = {};
		for (var g = 0, c = m.length; g < c; g++) {
			var a = m[g].getResources();
			for (var f = 0, d = a.length; f < d; f++) {
				var b = a[f];
				e[b.getId()] = b
			}
		}
		Ext.Object.each(e,
		function(j, i) {
			h.repaintEventsForResource(i)
		})
	},
	onEventRemove: function(k, e) {
		var h = this.view;
		var j = this.resourceStore;
		var f = Ext.tree && Ext.tree.View && h instanceof Ext.tree.View;
		if (!Ext.isArray(e)) {
			e = [e]
		}
		var g = function(i) {
			if (h.store.indexOf(i) >= 0) {
				h.repaintEventsForResource(i)
			}
		};
		for (var d = 0; d < e.length; d++) {
			var a = e[d].getResources();
			if (a.length > 1) {
				Ext.each(a, g, this)
			} else {
				var b = h.getEventNodeByRecord(e[d]);
				if (b) {
					var c = h.resolveResource(b);
					if (Ext.Element.prototype.fadeOut) {
						Ext.get(b).fadeOut({
							callback: function() {
								g(c)
							}
						})
					} else {
						Ext.Anim.run(Ext.get(b), "fade", {
							out: true,
							duration: 500,
							after: function() {
								g(c)
							},
							autoClear: false
						})
					}
				}
			}
		}
	},
	onEventUpdate: function(c, d, b) {
		var e = d.previous;
		var a = this.view;
		if (e && e[d.resourceIdField]) {
			var f = d.getResource(e[d.resourceIdField]);
			if (f) {
				a.repaintEventsForResource(f, true)
			}
		}
		var g = d.getResources();
		Ext.each(g,
		function(h) {
			a.repaintEventsForResource(h, true)
		})
	},
	setColumnWidth: function(c, b) {
		var a = this.view;
		a.getTimeAxisViewModel().setTickWidth(c, b);
		a.fireEvent("columnwidthchange", a, c)
	},
	getVisibleDateRange: function() {
		var d = this.view;
		if (!d.getEl()) {
			return null
		}
		var c = d.getTableRegion(),
		b = d.timeAxis.getStart(),
		f = d.timeAxis.getEnd(),
		e = d.getWidth();
		if ((c.right - c.left) < e) {
			return {
				startDate: b,
				endDate: f
			}
		}
		var a = d.getScroll();
		return {
			startDate: d.getDateFromCoordinate(a.left, null, true),
			endDate: d.getDateFromCoordinate(a.left + e, null, true)
		}
	}
});
Ext.define("Sch.mixin.AbstractTimelineView", {
	requires: ["Sch.data.TimeAxis", "Sch.view.Horizontal"],
	selectedEventCls: "sch-event-selected",
	readOnly: false,
	horizontalViewClass: "Sch.view.Horizontal",
	timeCellCls: "sch-timetd",
	timeCellSelector: ".sch-timetd",
	eventBorderWidth: 1,
	timeAxis: null,
	timeAxisViewModel: null,
	eventPrefix: null,
	rowHeight: null,
	orientation: "horizontal",
	horizontal: null,
	vertical: null,
	secondaryCanvasEl: null,
	panel: null,
	displayDateFormat: null,
	snapToIncrement: null,
	el: null,
	_initializeTimelineView: function() {
		if (this.horizontalViewClass) {
			this.horizontal = Ext.create(this.horizontalViewClass, {
				view: this
			})
		}
		if (this.verticalViewClass) {
			this.vertical = Ext.create(this.verticalViewClass, {
				view: this
			})
		}
		var a = this.eventPrefix || this.getId();
		if (!a) {
			throw "No event prefix specified for the scheduler"
		}
		Ext.apply(this, {
			eventPrefix: a + "-"
		})
	},
	getTimeAxisViewModel: function() {
		return this.timeAxisViewModel
	},
	getFormattedDate: function(a) {
		return Ext.Date.format(a, this.getDisplayDateFormat())
	},
	getFormattedEndDate: function(c, a) {
		var b = this.getDisplayDateFormat();
		if (c.getHours() === 0 && c.getMinutes() === 0 && !(c.getYear() === a.getYear() && c.getMonth() === a.getMonth() && c.getDate() === a.getDate()) && !Sch.util.Date.hourInfoRe.test(b.replace(Sch.util.Date.stripEscapeRe, ""))) {
			c = Sch.util.Date.add(c, Sch.util.Date.DAY, -1)
		}
		return Ext.Date.format(c, b)
	},
	getDisplayDateFormat: function() {
		return this.displayDateFormat
	},
	setDisplayDateFormat: function(a) {
		this.displayDateFormat = a
	},
	fitColumns: function(b) {
		if (this.orientation === "horizontal") {
			this.getTimeAxisViewModel().fitToAvailableWidth(b)
		} else {
			var a = Math.floor((this.panel.getWidth() - Ext.getScrollbarSize().width - 1) / this.headerCt.getColumnCount());
			this.setColumnWidth(a, b)
		}
	},
	getElementFromEventRecord: function(a) {
		return Ext.get(this.eventPrefix + a.internalId)
	},
	getEventNodeByRecord: function(a) {
		return document.getElementById(this.eventPrefix + a.internalId)
	},
	getEventNodesByRecord: function(a) {
		return this.el.select("[id=" + this.eventPrefix + a.internalId + "]")
	},
	getStartEndDatesFromRegion: function(b, a) {
		return this[this.orientation].getStartEndDatesFromRegion(b, a)
	},
	getTimeResolution: function() {
		return this.timeAxis.getResolution()
	},
	setTimeResolution: function(b, a) {
		this.timeAxis.setResolution(b, a);
		if (this.snapToIncrement) {
			this.refreshKeepingScroll()
		}
	},
	getEventIdFromDomNodeId: function(a) {
		return a.substring(this.eventPrefix.length)
	},
	getDateFromDomEvent: function(b, a) {
		return this.getDateFromXY(b.getXY(), a)
	},
	getSnapPixelAmount: function() {
		return this.getTimeAxisViewModel().getSnapPixelAmount()
	},
	getTimeColumnWidth: function() {
		return this.getTimeAxisViewModel().getTickWidth()
	},
	setSnapEnabled: function(a) {
		this.snapToIncrement = a;
		if (a) {
			this.refreshKeepingScroll()
		}
	},
	setReadOnly: function(a) {
		this.readOnly = a;
		this[a ? "addCls": "removeCls"](this._cmpCls + "-readonly")
	},
	isReadOnly: function() {
		return this.readOnly
	},
	setOrientation: function(a) {
		this.orientation = a
	},
	getOrientation: function() {
		return this.orientation
	},
	getDateFromXY: function(c, b, a) {
		return this.getDateFromCoordinate(this.orientation === "horizontal" ? c[0] : c[1], b, a)
	},
	getDateFromCoordinate: function(c, b, a) {
		if (!a) {
			c = this[this.orientation].translateToScheduleCoordinate(c)
		}
		return this.timeAxisViewModel.getDateFromPosition(c, b)
	},
	getDateFromX: function(a, b) {
		return this.getDateFromCoordinate(a, b)
	},
	getDateFromY: function(b, a) {
		return this.getDateFromCoordinate(b, a)
	},
	getCoordinateFromDate: function(a, b) {
		var c = this.timeAxisViewModel.getPositionFromDate(a);
		if (b === false) {
			c = this[this.orientation].translateToPageCoordinate(c)
		}
		return Math.round(c)
	},
	getXFromDate: function(a, b) {
		return this.getCoordinateFromDate(a, b)
	},
	getYFromDate: function(a, b) {
		return this.getCoordinateFromDate(a, b)
	},
	getTimeSpanDistance: function(a, b) {
		return this.timeAxisViewModel.getDistanceBetweenDates(a, b)
	},
	getTimeSpanRegion: function(a, b) {
		return this[this.orientation].getTimeSpanRegion(a, b)
	},
	getScheduleRegion: function(b, a) {
		return this[this.orientation].getScheduleRegion(b, a)
	},
	getTableRegion: function() {
		throw "Abstract method call"
	},
	getRowNode: function(a) {
		throw "Abstract method call"
	},
	getRecordForRowNode: function(a) {
		throw "Abstract method call"
	},
	getVisibleDateRange: function() {
		return this[this.orientation].getVisibleDateRange()
	},
	setColumnWidth: function(b, a) {
		this[this.orientation].setColumnWidth(b, a)
	},
	findRowByChild: function(a) {
		throw "Abstract method call"
	},
	setBarMargin: function(b, a) {
		this.barMargin = b;
		if (!a) {
			this.refreshKeepingScroll()
		}
	},
	getRowHeight: function() {
		return this.rowHeight
	},
	setRowHeight: function(a, b) {
		this.rowHeight = a || 24;
		if (this.orientation === "vertical") {
			this.timeAxisViewModel.setTickWidth(this.rowHeight, b)
		} else {
			if (this.getEl() && !b) {
				this.refreshKeepingScroll()
			}
		}
	},
	refreshKeepingScroll: function() {
		throw "Abstract method call"
	},
	scrollVerticallyTo: function(b, a) {
		throw "Abstract method call"
	},
	scrollHorizontallyTo: function(a, b) {
		throw "Abstract method call"
	},
	getVerticalScroll: function() {
		throw "Abstract method call"
	},
	getHorizontalScroll: function() {
		throw "Abstract method call"
	},
	getEl: Ext.emptyFn,
	getSecondaryCanvasEl: function() {
		if (!this.secondaryCanvasEl) {
			this.secondaryCanvasEl = this.getEl().createChild({
				cls: "sch-secondary-canvas"
			})
		}
		return this.secondaryCanvasEl
	},
	getScroll: function() {
		throw "Abstract method call"
	},
	getOuterEl: function() {
		return this.getEl()
	},
	getRowContainerEl: function() {
		return this.getEl()
	},
	getScrollEventSource: function() {
		return this.getEl()
	},
	getViewportHeight: function() {
		return this.getEl().getHeight()
	},
	getViewportWidth: function() {
		return this.getEl().getWidth()
	},
	getDateConstraints: Ext.emptyFn
});
Ext.apply(Sch, {
	VERSION: "2.2.9"
});
Ext.define("Sch.mixin.TimelineView", {
	extend: "Sch.mixin.AbstractTimelineView",
	requires: ["Sch.patches.ElementScroll"],
	overScheduledEventClass: "sch-event-hover",
	altColCls: "sch-col-alt",
	timeCellCls: "sch-timetd",
	timeCellSelector: ".sch-timetd",
	ScheduleEventMap: {
		click: "Click",
		mousedown: "MouseDown",
		mouseup: "MouseUp",
		dblclick: "DblClick",
		contextmenu: "ContextMenu",
		keydown: "KeyDown",
		keyup: "KeyUp"
	},
	_initializeTimelineView: function() {
		this.callParent(arguments);
		this.timeCellSelector = "." + this.timeCellCls;
		this.on("destroy", this._onDestroy, this);
		this.on("afterrender", this._onAfterRender, this);
		this.setOrientation(this.orientation);
		this.addEvents("beforetooltipshow", "columnwidthchange");
		this.enableBubble("columnwidthchange");
		this.addCls("sch-timelineview");
		if (this.readOnly) {
			this.addCls(this._cmpCls + "-readonly")
		}
		this.addCls(this._cmpCls);
		if (this.eventAnimations) {
			this.addCls("sch-animations-enabled")
		}
	},
	inheritables: function() {
		return {
			processUIEvent: function(d) {
				var a = d.getTarget(this.eventSelector),
				c = this.ScheduleEventMap,
				b = d.type,
				f = false;
				if (a && b in c) {
					this.fireEvent(this.scheduledEventName + b, this, this.resolveEventRecord(a), d);
					f = !(this.getSelectionModel() instanceof Ext.selection.RowModel)
				}
				if (!f) {
					return this.callParent(arguments)
				}
			}
		}
	},
	_onDestroy: function() {
		if (this.tip) {
			this.tip.destroy()
		}
	},
	_onAfterRender: function() {
		if (this.overScheduledEventClass) {
			this.setMouseOverEnabled(true)
		}
		if (this.tooltipTpl) {
			this.el.on("mousemove", this.setupTooltip, this, {
				single: true
			})
		}
		var a = this.bufferedRenderer;
		if (a) {
			this.patchBufferedRenderingPlugin(a);
			this.patchBufferedRenderingPlugin(this.lockingPartner.bufferedRenderer)
		}
		this.on("bufferedrefresh", this.onBufferedRefresh, this, {
			buffer: 10
		});
		this.setupTimeCellEvents();
		if (!this.secondaryCanvasEl) {
			this.secondaryCanvasEl = this.getEl().createChild({
				cls: "sch-secondary-canvas"
			})
		}
	},
	patchBufferedRenderingPlugin: function(c) {
		var b = this;
		var a = c.setBodyTop;
		c.setBodyTop = function(d, e) {
			if (d < 0) {
				d = 0
			}
			var f = a.apply(this, arguments);
			b.fireEvent("bufferedrefresh", this);
			return f
		}
	},
	onBufferedRefresh: function() {
		this.getSecondaryCanvasEl().dom.style.top = this.body.dom.style.top
	},
	setMouseOverEnabled: function(a) {
		this[a ? "mon": "mun"](this.el, {
			mouseover: this.onMouseOver,
			mouseout: this.onMouseOut,
			delegate: this.eventSelector,
			scope: this
		})
	},
	onMouseOver: function(c, a) {
		if (a !== this.lastItem) {
			this.lastItem = a;
			Ext.fly(a).addCls(this.overScheduledEventClass);
			var b = this.resolveEventRecord(a);
			if (b) {
				this.fireEvent("eventmouseenter", this, b, c)
			}
		}
	},
	onMouseOut: function(b, a) {
		if (this.lastItem) {
			if (!b.within(this.lastItem, true, true)) {
				Ext.fly(this.lastItem).removeCls(this.overScheduledEventClass);
				this.fireEvent("eventmouseleave", this, this.resolveEventRecord(this.lastItem), b);
				delete this.lastItem
			}
		}
	},
	highlightItem: function(b) {
		if (b) {
			var a = this;
			a.clearHighlight();
			a.highlightedItem = b;
			Ext.fly(b).addCls(a.overItemCls)
		}
	},
	setupTooltip: function() {
		var b = this,
		a = Ext.apply({
			renderTo: Ext.getBody(),
			delegate: b.eventSelector,
			target: b.el,
			anchor: "b",
			rtl: b.rtl,
			show: function() {
				Ext.ToolTip.prototype.show.apply(this, arguments);
				if (this.triggerElement && b.getOrientation() === "horizontal") {
					this.setX(this.targetXY[0] - 10);
					this.setY(Ext.fly(this.triggerElement).getY() - this.getHeight() - 10)
				}
			}
		},
		b.tipCfg);
		b.tip = Ext.create("Ext.ToolTip", a);
		b.tip.on({
			beforeshow: function(d) {
				if (!d.triggerElement || !d.triggerElement.id) {
					return false
				}
				var c = this.resolveEventRecord(d.triggerElement);
				if (!c || this.fireEvent("beforetooltipshow", this, c) === false) {
					return false
				}
				d.update(this.tooltipTpl.apply(this.getDataForTooltipTpl(c)))
			},
			scope: this
		})
	},
	getTimeAxisColumn: function() {
		if (!this.timeAxisColumn) {
			this.timeAxisColumn = this.headerCt.down("timeaxiscolumn")
		}
		return this.timeAxisColumn
	},
	getDataForTooltipTpl: function(a) {
		return Ext.apply({
			_record: a
		},
		a.data)
	},
	refreshKeepingScroll: function() {
		Ext.suspendLayouts();
		this.saveScrollState();
		this.refresh();
		if (this.up("tablepanel[lockable=true]").lockedGridDependsOnSchedule) {
			this.lockingPartner.refresh()
		}
		this.restoreScrollState();
		Ext.resumeLayouts(true)
	},
	setupTimeCellEvents: function() {
		this.mon(this.el, {
			click: this.handleScheduleEvent,
			dblclick: this.handleScheduleEvent,
			contextmenu: this.handleScheduleEvent,
			scope: this
		})
	},
	getTableRegion: function() {
		var a = this.el.down("." + Ext.baseCSSPrefix + "grid-table");
		return (a || this.el).getRegion()
	},
	getRowNode: function(a) {
		return this.getNodeByRecord(a)
	},
	findRowByChild: function(a) {
		return this.findItemByChild(a)
	},
	getRecordForRowNode: function(a) {
		return this.getRecord(a)
	},
	refreshKeepingResourceScroll: function() {
		var a = this.getScroll();
		this.refresh();
		if (this.getOrientation() === "horizontal") {
			this.scrollVerticallyTo(a.top)
		} else {
			this.scrollHorizontallyTo(a.left)
		}
	},
	scrollHorizontallyTo: function(a, b) {
		var c = this.getEl();
		if (c) {
			c.scrollTo("left", Math.max(0, a), b)
		}
	},
	scrollVerticallyTo: function(c, a) {
		var b = this.getEl();
		if (b) {
			b.scrollTo("top", Math.max(0, c), a)
		}
	},
	getVerticalScroll: function() {
		var a = this.getEl();
		return a.getScroll().top
	},
	getHorizontalScroll: function() {
		var a = this.getEl();
		return a.getScroll().left
	},
	getScroll: function() {
		var a = this.getEl().getScroll();
		return {
			top: a.top,
			left: a.left
		}
	},
	getXYFromDate: function() {
		var a = this.getCoordinateFromDate.apply(this, arguments);
		return this.orientation === "horizontal" ? [a, 0] : [0, a]
	},
	handleScheduleEvent: function(a) {}
});
Ext.define("Sch.view.TimelineGridView", {
	extend: "Ext.grid.View",
	mixins: ["Sch.mixin.TimelineView"]
},
function() {
	this.override(Sch.mixin.TimelineView.prototype.inheritables() || {})
});
Ext.define("Sch.mixin.FilterableTreeView", {
	prevBlockRefresh: null,
	initTreeFiltering: function() {
		var a = function() {
			var b = this.up("tablepanel").store;
			if (b instanceof Ext.data.NodeStore) {
				b = this.up("tablepanel[lockable=true]").store
			}
			this.mon(b, "nodestore-datachange-start", this.onFilterChangeStart, this);
			this.mon(b, "nodestore-datachange-end", this.onFilterChangeEnd, this);
			this.mon(b, "filter-clear", this.onFilterCleared, this);
			this.mon(b, "filter-set", this.onFilterSet, this)
		};
		if (this.rendered) {
			a.call(this)
		} else {
			this.on("beforerender", a, this, {
				single: true
			})
		}
	},
	onFilterChangeStart: function() {
		this.prevBlockRefresh = this.blockRefresh;
		this.blockRefresh = true;
		Ext.suspendLayouts()
	},
	onFilterChangeEnd: function() {
		Ext.resumeLayouts(true);
		this.blockRefresh = this.prevBlockRefresh
	},
	onFilterCleared: function() {
		delete this.toggle;
		var a = this.getEl();
		if (a) {
			a.removeCls("sch-tree-filtered")
		}
	},
	onFilterSet: function() {
		this.toggle = function() {};
		var a = this.getEl();
		if (a) {
			a.addCls("sch-tree-filtered")
		}
	}
});
Ext.define("Sch.mixin.Zoomable", {
	zoomLevels: [{
		width: 80,
		increment: 5,
		resolution: 1,
		preset: "manyyears",
		resolutionUnit: "YEAR"
	},
	{
		width: 40,
		increment: 1,
		resolution: 1,
		preset: "manyyears",
		resolutionUnit: "YEAR"
	},
	{
		width: 80,
		increment: 1,
		resolution: 1,
		preset: "manyyears",
		resolutionUnit: "YEAR"
	},
	{
		width: 30,
		increment: 1,
		resolution: 1,
		preset: "year",
		resolutionUnit: "MONTH"
	},
	{
		width: 50,
		increment: 1,
		resolution: 1,
		preset: "year",
		resolutionUnit: "MONTH"
	},
	{
		width: 100,
		increment: 1,
		resolution: 1,
		preset: "year",
		resolutionUnit: "MONTH"
	},
	{
		width: 200,
		increment: 1,
		resolution: 1,
		preset: "year",
		resolutionUnit: "MONTH"
	},
	{
		width: 100,
		increment: 1,
		resolution: 7,
		preset: "monthAndYear",
		resolutionUnit: "DAY"
	},
	{
		width: 30,
		increment: 1,
		resolution: 1,
		preset: "weekDateAndMonth",
		resolutionUnit: "DAY"
	},
	{
		width: 35,
		increment: 1,
		resolution: 1,
		preset: "weekAndMonth",
		resolutionUnit: "DAY"
	},
	{
		width: 50,
		increment: 1,
		resolution: 1,
		preset: "weekAndMonth",
		resolutionUnit: "DAY"
	},
	{
		width: 20,
		increment: 1,
		resolution: 1,
		preset: "weekAndDayLetter"
	},
	{
		width: 50,
		increment: 1,
		resolution: 1,
		preset: "weekAndDay",
		resolutionUnit: "HOUR"
	},
	{
		width: 100,
		increment: 1,
		resolution: 1,
		preset: "weekAndDay",
		resolutionUnit: "HOUR"
	},
	{
		width: 50,
		increment: 6,
		resolution: 30,
		preset: "hourAndDay",
		resolutionUnit: "MINUTE"
	},
	{
		width: 100,
		increment: 6,
		resolution: 30,
		preset: "hourAndDay",
		resolutionUnit: "MINUTE"
	},
	{
		width: 60,
		increment: 2,
		resolution: 30,
		preset: "hourAndDay",
		resolutionUnit: "MINUTE"
	},
	{
		width: 60,
		increment: 1,
		resolution: 30,
		preset: "hourAndDay",
		resolutionUnit: "MINUTE"
	},
	{
		width: 30,
		increment: 15,
		resolution: 5,
		preset: "minuteAndHour"
	},
	{
		width: 60,
		increment: 15,
		resolution: 5,
		preset: "minuteAndHour"
	},
	{
		width: 130,
		increment: 15,
		resolution: 5,
		preset: "minuteAndHour"
	},
	{
		width: 60,
		increment: 5,
		resolution: 5,
		preset: "minuteAndHour"
	},
	{
		width: 100,
		increment: 5,
		resolution: 5,
		preset: "minuteAndHour"
	}],
	minZoomLevel: null,
	maxZoomLevel: null,
	visibleZoomFactor: 5,
	cachedCenterDate: null,
	isFirstZoom: true,
	isZooming: false,
	initializeZooming: function() {
		this.zoomLevels = this.zoomLevels.slice();
		this.setMinZoomLevel(this.minZoomLevel || 0);
		this.setMaxZoomLevel(this.maxZoomLevel !== null ? this.maxZoomLevel: this.zoomLevels.length - 1);
		this.on("viewchange", this.clearCenterDateCache, this)
	},
	getZoomLevelUnit: function(b) {
		var a = Sch.preset.Manager.getPreset(b.preset).headerConfig;
		return a.bottom ? a.bottom.unit: a.middle.unit
	},
	getMilliSecondsPerPixelForZoomLevel: function(b) {
		var a = Sch.util.Date;
		return Math.round((a.add(new Date(1, 0, 1), this.getZoomLevelUnit(b), b.increment) - new Date(1, 0, 1)) / b.width)
	},
	presetToZoomLevel: function(e) {
		var d = Sch.preset.Manager.getPreset(e);
		var c = d.headerConfig;
		var a = c.bottom;
		var b = c.middle;
		return {
			preset: e,
			increment: (a ? a.increment: b.increment) || 1,
			resolution: d.timeResolution.increment,
			resolutionUnit: d.timeResolution.unit,
			width: d.timeColumnWidth
		}
	},
	calculateCurrentZoomLevel: function() {
		var d = this.presetToZoomLevel(this.viewPreset);
		var c = this.timeAxis.headerConfig;
		var a = c.bottom;
		var b = c.middle;
		d.width = this.timeAxis.preset.timeColumnWidth;
		d.increment = (a ? a.increment: b.increment) || 1;
		return d
	},
	getCurrentZoomLevelIndex: function() {
		var f = this.calculateCurrentZoomLevel();
		var b = this.getMilliSecondsPerPixelForZoomLevel(f);
		var e = this.zoomLevels;
		for (var c = 0; c < e.length; c++) {
			var d = this.getMilliSecondsPerPixelForZoomLevel(e[c]);
			if (d == b) {
				return c
			}
			if (c === 0 && b > d) {
				return - 0.5
			}
			if (c == e.length - 1 && b < d) {
				return e.length - 1 + 0.5
			}
			var a = this.getMilliSecondsPerPixelForZoomLevel(e[c + 1]);
			if (d > b && b > a) {
				return c + 0.5
			}
		}
		throw "Can't find current zoom level index"
	},
	setMaxZoomLevel: function(a) {
		if (a < 0 || a >= this.zoomLevels.length) {
			throw new Error("Invalid range for `setMinZoomLevel`")
		}
		this.maxZoomLevel = a
	},
	setMinZoomLevel: function(a) {
		if (a < 0 || a >= this.zoomLevels.length) {
			throw new Error("Invalid range for `setMinZoomLevel`")
		}
		this.minZoomLevel = a
	},
	getViewportCenterDateCached: function() {
		if (this.cachedCenterDate) {
			return this.cachedCenterDate
		}
		return this.cachedCenterDate = this.getViewportCenterDate()
	},
	clearCenterDateCache: function() {
		this.cachedCenterDate = null
	},
	zoomToLevel: function(b, r) {
		b = Ext.Number.constrain(b, this.minZoomLevel, this.maxZoomLevel);
		var q = this.calculateCurrentZoomLevel();
		var e = this.getMilliSecondsPerPixelForZoomLevel(q);
		var l = this.zoomLevels[b];
		var a = this.getMilliSecondsPerPixelForZoomLevel(l);
		if (e == a && !r) {
			return null
		}
		var t = this;
		var m = this.getSchedulingView();
		var g = m.getOuterEl();
		var s = m.getScrollEventSource();
		if (this.isFirstZoom) {
			this.isFirstZoom = false;
			s.on("scroll", this.clearCenterDateCache, this)
		}
		var i = this.orientation == "vertical";
		var f = r ? new Date((r.start.getTime() + r.end.getTime()) / 2) : this.getViewportCenterDateCached();
		var n = i ? g.getHeight() : g.getWidth();
		var o = Ext.clone(Sch.preset.Manager.getPreset(l.preset));
		r = r || this.calculateOptimalDateRange(f, n, l);
		var c = o.headerConfig;
		var h = c.bottom;
		var u = c.middle;
		o[i ? "rowHeight": "timeColumnWidth"] = l.width;
		if (h) {
			h.increment = l.increment
		} else {
			u.increment = l.increment
		}
		this.isZooming = true;
		this.viewPreset = l.preset;
		var p = h ? h.unit: u.unit;
		var d = this.timeAxis;
		d.reconfigure({
			preset: o,
			headerConfig: c,
			unit: p,
			increment: l.increment,
			resolutionUnit: Sch.util.Date.getUnitByName(l.resolutionUnit || p),
			resolutionIncrement: l.resolution,
			weekStartDay: this.weekStartDay,
			mainUnit: u.unit,
			shiftUnit: o.shiftUnit,
			shiftIncrement: o.shiftIncrement || 1,
			defaultSpan: o.defaultSpan || 1,
			start: r.start || this.getStart(),
			end: r.end || this.getEnd()
		});
		if (r) {
			f = new Date((d.getStart().getTime() + d.getEnd().getTime()) / 2)
		}
		s.on("scroll",
		function() {
			t.cachedCenterDate = f
		},
		this, {
			single: true
		});
		if (i) {
			var j = m.getYFromDate(f, true);
			m.scrollVerticallyTo(j - n / 2)
		} else {
			var k = m.getXFromDate(f, true);
			m.scrollHorizontallyTo(k - n / 2)
		}
		t.isZooming = false;
		this.fireEvent("zoomchange", this, b);
		return b
	},
	zoomToSpan: function(r, u) {
		if (r.start && r.end && r.start < r.end) {
			u = Ext.applyIf(u || {},
			{
				adjustStart: 1,
				adjustEnd: 1
			});
			var f = r.start,
			e = r.end,
			h = function(w) {
				return w
			},
			t = h,
			s = h;
			if (this.timeAxis.autoAdjust) {
				if (u.adjustStart) {
					t = function(A, y, z) {
						var w = Sch.util.Date.add(A, z && z.mainUnit || y, -u.adjustStart);
						if (z) {
							var x = z.getAdjustedDates(w, e);
							return x.start
						}
						return w
					}
				}
				if (u.adjustEnd) {
					s = function(x, z, A) {
						var w = Sch.util.Date.add(x, A && A.mainUnit || z, u.adjustEnd);
						if (A) {
							var y = A.getAdjustedDates(f, w);
							return y.end
						}
						return w
					}
				}
			} else {
				if (u.adjustStart) {
					t = function(x, w) {
						return Sch.util.Date.add(x, w, -u.adjustStart)
					}
				}
				if (u.adjustEnd) {
					s = function(w, x) {
						return Sch.util.Date.add(w, x, u.adjustEnd)
					}
				}
			}
			var d = Ext.create("Sch.data.TimeAxis");
			var q = this.getSchedulingView().getTimeAxisViewModel().getAvailableWidth();
			var l = Math.floor(this.getCurrentZoomLevelIndex());
			if (l == -1) {
				l = 0
			}
			var b = s(e, this.timeAxis.mainUnit, this.timeAxis) - t(f, this.timeAxis.mainUnit, this.timeAxis),
			n = this.getMilliSecondsPerPixelForZoomLevel(this.zoomLevels[l]),
			k = b / n > q ? -1: 1,
			a = l + k,
			j = this.orientation == "vertical" ? "rowHeight": "timeColumnWidth";
			var o,
			p,
			m,
			g = null,
			c = this.timeAxis.mainUnit;
			while (a >= 0 && a <= this.zoomLevels.length - 1) {
				o = this.zoomLevels[a];
				p = Ext.clone(Sch.preset.Manager.getPreset(o.preset));
				var i = p.headerConfig.bottom;
				var v = p.headerConfig.middle;
				p[j] = o.width;
				if (i) {
					i.increment = o.increment;
					m = i.unit
				} else {
					v.increment = o.increment;
					m = v.unit
				}
				Ext.apply(d, {
					autoAdjust: this.timeAxis.autoAdjust,
					preset: p,
					headerConfig: p.headerConfig,
					unit: m,
					increment: o.increment,
					resolutionUnit: Sch.util.Date.getUnitByName(o.resolutionUnit || m),
					resolutionIncrement: o.resolution,
					mainUnit: v.unit,
					shiftUnit: p.shiftUnit,
					shiftIncrement: p.shiftIncrement || 1,
					defaultSpan: p.defaultSpan || 1
				});
				b = s(e, m, d) - t(f, m, d);
				n = this.getMilliSecondsPerPixelForZoomLevel(o);
				if (k < 0) {
					if (b / n <= q) {
						g = a;
						c = m;
						break
					}
				} else {
					if (b / n <= q) {
						if (l !== a - k) {
							g = a - k;
							c = m
						}
					} else {
						break
					}
				}
				a += k
			}
			g = g !== null ? g: a - k;
			return this.zoomToLevel(g, {
				start: t(f, c),
				end: s(e, c)
			})
		}
		return null
	},
	zoomIn: function(a) {
		a = a || 1;
		var b = this.getCurrentZoomLevelIndex();
		if (b >= this.zoomLevels.length - 1) {
			return null
		}
		return this.zoomToLevel(Math.floor(b) + a)
	},
	zoomOut: function(a) {
		a = a || 1;
		var b = this.getCurrentZoomLevelIndex();
		if (b <= 0) {
			return null
		}
		return this.zoomToLevel(Math.ceil(b) - a)
	},
	zoomInFull: function() {
		return this.zoomToLevel(this.maxZoomLevel)
	},
	zoomOutFull: function() {
		return this.zoomToLevel(this.minZoomLevel)
	},
	calculateOptimalDateRange: function(c, h, e) {
		var b = Sch.util.Date;
		var i = Sch.preset.Manager.getPreset(e.preset).headerConfig;
		var f = i.top ? i.top.unit: i.middle.unit;
		var j = this.getZoomLevelUnit(e);
		var d = Math.ceil(h / e.width * e.increment * this.visibleZoomFactor / 2);
		var a = b.add(c, j, -d);
		var g = b.add(c, j, d);
		return {
			start: this.timeAxis.floorDate(a, false, f),
			end: this.timeAxis.ceilDate(g, false, f)
		}
	}
});
Ext.define("Sch.mixin.AbstractTimelinePanel", {
	requires: ["Sch.data.TimeAxis", "Sch.view.model.TimeAxis", "Sch.feature.ColumnLines", "Sch.preset.Manager"],
	mixins: ["Sch.mixin.Zoomable"],
	orientation: "horizontal",
	weekStartDay: 1,
	snapToIncrement: false,
	readOnly: false,
	eventResizeHandles: "both",
	timeAxis: null,
	timeAxisViewModel: null,
	viewPreset: "weekAndDay",
	trackHeaderOver: true,
	startDate: null,
	endDate: null,
	columnLines: true,
	trackMouseOver: false,
	eventBorderWidth: 1,
	getOrientation: function() {
		return this.orientation
	},
	cellBorderWidth: 1,
	cellTopBorderWidth: 1,
	cellBottomBorderWidth: 1,
	_initializeTimelinePanel: function() {
		this.initializeZooming();
		this.renderers = [];
		if (!this.timeAxis) {
			this.timeAxis = Ext.create("Sch.data.TimeAxis")
		}
		if (!this.timeAxisViewModel || !(this.timeAxisViewModel instanceof Sch.view.model.TimeAxis)) {
			var a = Ext.apply({
				snapToIncrement: this.snapToIncrement,
				forceFit: this.forceFit,
				timeAxis: this.timeAxis
			},
			this.timeAxisViewModel || {});
			this.timeAxisViewModel = new Sch.view.model.TimeAxis(a)
		}
		this.timeAxisViewModel.on("update", this.onTimeAxisViewModelUpdate, this);
		this.timeAxisViewModel.refCount++;
		if (!this.viewPreset) {
			throw "You must define a valid view preset object. See Sch.preset.Manager class for reference"
		}
		this.on("destroy", this.onPanelDestroyed, this);
		this.timeAxis.on("reconfigure", this.onTimeAxisReconfigure, this);
		this.addCls(["sch-timelinepanel", "sch-" + this.orientation])
	},
	onTimeAxisViewModelUpdate: function() {
		var a = this.getSchedulingView();
		if (a && a.viewReady) {
			a.refreshKeepingScroll()
		}
	},
	onPanelDestroyed: function() {
		this.timeAxisViewModel.un("update", this.onTimeAxisViewModelUpdate, this);
		this.timeAxisViewModel.refCount--;
		if (this.timeAxisViewModel.refCount <= 0) {
			this.timeAxisViewModel.destroy()
		}
		this.timeAxis.un("reconfigure", this.onTimeAxisReconfigure, this)
	},
	getSchedulingView: function() {
		throw "Abstract method call"
	},
	setReadOnly: function(a) {
		this.getSchedulingView().setReadOnly(a)
	},
	isReadOnly: function() {
		return this.getSchedulingView().isReadOnly()
	},
	switchViewPreset: function(d, a, f, b) {
		if (b && this.timeAxis.preset) {
			this.applyViewSettings(this.timeAxis.preset);
			return
		}
		if (this.fireEvent("beforeviewchange", this, d, a, f) !== false) {
			if (Ext.isString(d)) {
				this.viewPreset = d;
				d = Sch.preset.Manager.getPreset(d)
			}
			if (!d) {
				throw "View preset not found"
			}
			var e = d.headerConfig;
			var c = {
				unit: e.bottom ? e.bottom.unit: e.middle.unit,
				increment: (e.bottom ? e.bottom.increment: e.middle.increment) || 1,
				resolutionUnit: d.timeResolution.unit,
				resolutionIncrement: d.timeResolution.increment,
				weekStartDay: this.weekStartDay,
				mainUnit: e.middle.unit,
				shiftUnit: d.shiftUnit,
				headerConfig: d.headerConfig,
				shiftIncrement: d.shiftIncrement || 1,
				preset: d,
				defaultSpan: d.defaultSpan || 1
			};
			if (b) {
				if (this.timeAxis.getCount() === 0 || a) {
					c.start = a || new Date()
				}
			} else {
				c.start = a || this.timeAxis.getStart()
			}
			c.end = f;
			this.timeAxis.reconfigure(c);
			this.applyViewSettings(d);
			if (this.getOrientation() === "horizontal") {
				this.getSchedulingView().scrollHorizontallyTo(0)
			} else {
				this.getSchedulingView().scrollVerticallyTo(0)
			}
		}
	},
	applyViewSettings: function(b) {
		var a = this.getSchedulingView();
		a.setDisplayDateFormat(b.displayDateFormat);
		if (this.orientation === "horizontal") {
			a.setRowHeight(this.rowHeight || b.rowHeight, true)
		}
	},
	getStart: function() {
		return this.getStartDate()
	},
	getStartDate: function() {
		return this.timeAxis.getStart()
	},
	getEnd: function() {
		return this.getEndDate()
	},
	getEndDate: function() {
		return this.timeAxis.getEnd()
	},
	setTimeColumnWidth: function(b, a) {
		this.timeAxisViewModel.setTickWidth(b, a)
	},
	getTimeColumnWidth: function() {
		return this.timeAxisViewModel.getTickWidth()
	},
	onTimeAxisReconfigure: function() {
		this.fireEvent("viewchange", this)
	},
	shiftNext: function(a) {
		this.suspendLayouts && this.suspendLayouts();
		this.timeAxis.shiftNext(a);
		this.suspendLayouts && this.resumeLayouts(true)
	},
	shiftPrevious: function(a) {
		this.suspendLayouts && this.suspendLayouts();
		this.timeAxis.shiftPrevious(a);
		this.suspendLayouts && this.resumeLayouts(true)
	},
	goToNow: function() {
		this.setTimeSpan(new Date())
	},
	setTimeSpan: function(b, a) {
		if (this.timeAxis) {
			this.timeAxis.setTimeSpan(b, a)
		}
	},
	setStart: function(a) {
		this.setTimeSpan(a)
	},
	setEnd: function(a) {
		this.setTimeSpan(null, a)
	},
	getTimeAxis: function() {
		return this.timeAxis
	},
	scrollToDate: function(d, c) {
		var b = this.getSchedulingView();
		var f = b.getCoordinateFromDate(d, true);
		if (f < 0) {
			var a = (this.timeAxis.getEnd() - this.timeAxis.getStart()) / 2;
			var e = this;
			this.setTimeSpan(new Date(d.getTime() - a), new Date(d.getTime() + a));
			setTimeout(function() {
				e.scrollToDate(d, c)
			},
			20);
			return
		}
		if (this.orientation === "horizontal") {
			b.scrollHorizontallyTo(f, c)
		} else {
			b.scrollVerticallyTo(f, c)
		}
	},
	getViewportCenterDate: function() {
		var b = this.getSchedulingView(),
		a = b.getScroll(),
		c;
		if (this.getOrientation() === "vertical") {
			c = [0, a.top + b.getViewportHeight() / 2]
		} else {
			c = [a.left + b.getViewportWidth() / 2, 0]
		}
		return b.getDateFromXY(c, null, true)
	},
	addCls: function() {
		throw "Abstract method call"
	},
	removeCls: function() {
		throw "Abstract method call"
	},
	registerRenderer: function(b, a) {
		this.renderers.push({
			fn: b,
			scope: a
		})
	},
	deregisterRenderer: function(b, a) {
		Ext.each(this.renderers,
		function(c, d) {
			if (b === c) {
				Ext.Array.removeAt(this.renderers, d);
				return false
			}
		})
	}
});
Ext.define("Sch.mixin.TimelinePanel", {
	extend: "Sch.mixin.AbstractTimelinePanel",
	requires: ["Sch.util.Patch", "Sch.column.timeAxis.Horizontal", "Sch.preset.Manager"],
	mixins: ["Sch.mixin.Zoomable", "Sch.mixin.Lockable"],
	tipCfg: {
		cls: "sch-tip",
		showDelay: 1000,
		hideDelay: 0,
		autoHide: true,
		anchor: "b"
	},
	inheritables: function() {
		return {
			columnLines: true,
			enableLocking: true,
			lockable: true,
			initComponent: function() {
				if (this.partnerTimelinePanel) {
					this.timeAxisViewModel = this.partnerTimelinePanel.timeAxisViewModel;
					this.timeAxis = this.partnerTimelinePanel.getTimeAxis();
					this.startDate = this.timeAxis.getStart();
					this.endDate = this.timeAxis.getEnd()
				}
				if (this.viewConfig && this.viewConfig.forceFit) {
					this.forceFit = true
				}
				if (Ext.versions.extjs.isGreaterThanOrEqual("4.2.1")) {
					this.cellTopBorderWidth = 0
				}
				this._initializeTimelinePanel();
				this.configureColumns();
				var b = this.normalViewConfig = this.normalViewConfig || {};
				Ext.apply(this.normalViewConfig, {
					timeAxisViewModel: this.timeAxisViewModel,
					eventBorderWidth: this.eventBorderWidth,
					timeAxis: this.timeAxis,
					readOnly: this.readOnly,
					orientation: this.orientation,
					rtl: this.rtl,
					cellBorderWidth: this.cellBorderWidth,
					cellTopBorderWidth: this.cellTopBorderWidth,
					cellBottomBorderWidth: this.cellBottomBorderWidth
				});
				Ext.Array.forEach(["eventRendererScope", "eventRenderer", "dndValidatorFn", "resizeValidatorFn", "createValidatorFn", "tooltipTpl", "validatorFnScope", "snapToIncrement", "eventResizeHandles", "enableEventDragDrop", "enableDragCreation", "resizeConfig", "createConfig", "tipCfg", "getDateConstraints"],
				function(c) {
					if (c in this) {
						b[c] = this[c]
					}
				},
				this);
				this.mon(this.timeAxis, "reconfigure", this.onMyTimeAxisReconfigure, this);
				this.addEvents("timeheaderclick", "timeheaderdblclick", "beforeviewchange", "viewchange");
				this.callParent(arguments);
				this.switchViewPreset(this.viewPreset, this.startDate || this.timeAxis.getStart(), this.endDate || this.timeAxis.getEnd(), true);
				var a = this.columnLines;
				if (a) {
					this.columnLinesFeature = new Sch.feature.ColumnLines(Ext.isObject(a) ? a: undefined);
					this.columnLinesFeature.init(this);
					this.columnLines = true
				}
				this.relayEvents(this.getSchedulingView(), ["beforetooltipshow"]);
				this.on("afterrender", this.__onAfterRender, this);
				this.on("zoomchange",
				function() {
					this.normalGrid.scrollTask.cancel()
				})
			},
			getState: function() {
				var a = this,
				b = a.callParent(arguments);
				Ext.apply(b, {
					viewPreset: a.viewPreset,
					startDate: a.getStart(),
					endDate: a.getEnd(),
					zoomMinLevel: a.zoomMinLevel,
					zoomMaxLevel: a.zoomMaxLevel,
					currentZoomLevel: a.currentZoomLevel
				});
				return b
			},
			applyState: function(b) {
				var a = this;
				a.callParent(arguments);
				if (b && b.viewPreset) {
					a.switchViewPreset(b.viewPreset, b.startDate, b.endDate)
				}
				if (b && b.currentZoomLevel) {
					a.zoomToLevel(b.currentZoomLevel)
				}
			}
		}
	},
	onMyTimeAxisReconfigure: function(a) {
		if (this.stateful && this.rendered) {
			this.saveState()
		}
	},
	onLockedGridItemDblClick: function(b, a, c, e, d) {
		if (this.orientation === "vertical" && a) {
			this.fireEvent("timeheaderdblclick", this, a.get("start"), a.get("end"), e, d)
		}
	},
	getSchedulingView: function() {
		return this.normalGrid.getView()
	},
	getTimeAxisColumn: function() {
		if (!this.timeAxisColumn) {
			this.timeAxisColumn = this.down("timeaxiscolumn")
		}
		return this.timeAxisColumn
	},
	configureColumns: function() {
		var a = this.columns = this.columns || [];
		var c = [];
		var b = [];
		Ext.Array.each(a,
		function(d) {
			if (d.position === "right") {
				if (!Ext.isNumber(d.width)) {
					Ext.Error.raise('"Right" columns must have a fixed width')
				}
				d.locked = false;
				b.push(d)
			} else {
				d.locked = true;
				c.push(d)
			}
			d.lockable = false
		});
		Ext.Array.erase(a, 0, a.length);
		Ext.Array.insert(a, 0, c.concat({
			xtype: "timeaxiscolumn",
			timeAxisViewModel: this.timeAxisViewModel,
			trackHeaderOver: this.trackHeaderOver,
			renderer: this.mainRenderer,
			scope: this
		}).concat(b));
		this.horizontalColumns = Ext.Array.clone(a);
		this.verticalColumns = [Ext.apply({
			xtype: "verticaltimeaxis",
			width: 100,
			locked: true,
			timeAxis: this.timeAxis,
			timeAxisViewModel: this.timeAxisViewModel,
			cellTopBorderWidth: this.cellTopBorderWidth,
			cellBottomBorderWidth: this.cellBottomBorderWidth
		},
		this.timeAxisColumnCfg || {})];
		if (this.orientation === "vertical") {
			this.columns = this.verticalColumns;
			this.store = this.timeAxis;
			this.on("beforerender",
			function() {
				this.normalGrid.headerCt.add(this.createResourceColumns())
			},
			this)
		}
	},
	mainRenderer: function(b, m, f, j, l) {
		var g = this.renderers,
		k = this.orientation === "horizontal",
		c = k ? f: this.resourceStore.getAt(l),
		a = "&nbsp;";
		m.rowHeight = null;
		for (var d = 0; d < g.length; d++) {
			a += g[d].fn.call(g[d].scope || this, b, m, c, j, l) || ""
		}
		if (this.variableRowHeight) {
			var h = this.getSchedulingView();
			var e = k ? h.getRowHeight() : this.timeAxisViewModel.getTickWidth();
			m.style = "height:" + ((m.rowHeight || e) - h.cellTopBorderWidth - h.cellBottomBorderWidth) + "px"
		}
		return a
	},
	__onAfterRender: function() {
		var a = this;
		a.normalGrid.on({
			collapse: a.onNormalGridCollapse,
			expand: a.onNormalGridExpand,
			scope: a
		});
		a.lockedGrid.on({
			collapse: a.onLockedGridCollapse,
			itemdblclick: a.onLockedGridItemDblClick,
			scope: a
		});
		if (a.lockedGridDependsOnSchedule) {
			a.normalGrid.getView().on("itemupdate", a.onNormalViewItemUpdate, a)
		}
		if (this.partnerTimelinePanel) {
			if (this.partnerTimelinePanel.rendered) {
				this.setupPartnerTimelinePanel()
			} else {
				this.partnerTimelinePanel.on("afterrender", this.setupPartnerTimelinePanel, this)
			}
		}
	},
	onLockedGridCollapse: function() {
		if (this.normalGrid.collapsed) {
			this.normalGrid.expand()
		}
	},
	onNormalGridCollapse: function() {
		var a = this;
		if (!a.normalGrid.reExpander) {
			a.normalGrid.reExpander = a.normalGrid.placeholder
		}
		if (!a.lockedGrid.rendered) {
			a.lockedGrid.on("render", a.onNormalGridCollapse, a, {
				delay: 1
			})
		} else {
			a.lockedGrid.flex = 1;
			a.lockedGrid.doLayout();
			if (a.lockedGrid.collapsed) {
				a.lockedGrid.expand()
			}
			a.addCls("sch-normalgrid-collapsed")
		}
	},
	onNormalGridExpand: function() {
		this.removeCls("sch-normalgrid-collapsed");
		delete this.lockedGrid.flex;
		this.lockedGrid.doLayout()
	},
	onNormalViewItemUpdate: function(a, b, d) {
		if (this.lockedGridDependsOnSchedule) {
			var c = this.lockedGrid.getView();
			c.suspendEvents();
			c.refreshNode(b);
			c.resumeEvents()
		}
	},
	setupPartnerTimelinePanel: function() {
		var f = this.partnerTimelinePanel;
		var d = f.down("splitter");
		var c = this.down("splitter");
		if (d) {
			d.on("dragend",
			function() {
				this.lockedGrid.setWidth(f.lockedGrid.getWidth())
			},
			this)
		}
		if (c) {
			c.on("dragend",
			function() {
				f.lockedGrid.setWidth(this.lockedGrid.getWidth())
			},
			this)
		}
		var b = this.partnerTimelinePanel.lockedGrid.getWidth();
		this.lockedGrid.setWidth(b);
		var a = this.partnerTimelinePanel.getSchedulingView().getEl(),
		e = this.getSchedulingView().getEl();
		this.partnerTimelinePanel.mon(e, "scroll",
		function(h, g) {
			a.scrollTo("left", g.scrollLeft)
		});
		this.mon(a, "scroll",
		function(h, g) {
			e.scrollTo("left", g.scrollLeft)
		})
	}
},
function() {
	var a = "4.2.0";
	Ext.apply(Sch, {
		VERSION: "2.2.9"
	});
	if (Ext.versions.extjs.isLessThan(a)) {
		alert("The Ext JS version you are using needs to be updated to at least " + a)
	}
});
Ext.define("Sch.panel.TimelineGridPanel", {
	extend: "Ext.grid.Panel",
	mixins: ["Sch.mixin.TimelinePanel"],
	subGridXType: "gridpanel",
	initComponent: function() {
		this.callParent(arguments);
		this.getSchedulingView()._initializeTimelineView()
	}
},
function() {
	this.override(Sch.mixin.TimelinePanel.prototype.inheritables() || {})
});
Ext.define("Sch.panel.TimelineTreePanel", {
	extend: "Ext.tree.Panel",
	requires: ["Ext.data.TreeStore", "Sch.mixin.FilterableTreeView"],
	mixins: ["Sch.mixin.TimelinePanel"],
	useArrows: true,
	rootVisible: false,
	lockedXType: "treepanel",
	initComponent: function() {
		this.callParent(arguments);
		this.getSchedulingView()._initializeTimelineView()
	}
},
function() {
	this.override(Sch.mixin.TimelinePanel.prototype.inheritables() || {})
});
Ext.define("Sch.plugin.Printable", {
	extend: "Ext.AbstractPlugin",
	alias: "plugin.scheduler_printable",
	lockableScope: "top",
	docType: "<!DOCTYPE HTML>",
	beforePrint: Ext.emptyFn,
	afterPrint: Ext.emptyFn,
	autoPrintAndClose: true,
	fakeBackgroundColor: true,
	scheduler: null,
	constructor: function(a) {
		Ext.apply(this, a)
	},
	init: function(a) {
		this.scheduler = a;
		a.print = Ext.Function.bind(this.print, this)
	},
	mainTpl: new Ext.XTemplate('{docType}<html class="' + Ext.baseCSSPrefix + 'border-box {htmlClasses}"><head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type" /><title>{title}</title>{styles}</head><body class="sch-print-body {bodyClasses}"><div class="sch-print-ct {componentClasses}" style="width:{totalWidth}px"><div class="sch-print-headerbg" style="border-left-width:{totalWidth}px;height:{headerHeight}px;"></div><div class="sch-print-header-wrap">{[this.printLockedHeader(values)]}{[this.printNormalHeader(values)]}</div>{[this.printLockedGrid(values)]}{[this.printNormalGrid(values)]}</div><script type="text/javascript">{setupScript}<\/script></body></html>', {
		printLockedHeader: function(a) {
			var b = "";
			if (a.lockedGrid) {
				b += '<div style="left:-' + a.lockedScroll + "px;margin-right:-" + a.lockedScroll + "px;width:" + (a.lockedWidth + a.lockedScroll) + 'px"';
				b += 'class="sch-print-lockedheader ' + a.lockedGrid.headerCt.el.dom.className + '">';
				b += a.lockedHeader;
				b += "</div>"
			}
			return b
		},
		printNormalHeader: function(a) {
			var b = "";
			if (a.normalGrid) {
				b += '<div style="left:' + (a.lockedGrid ? a.lockedWidth: "0") + "px;width:" + a.normalWidth + 'px;" class="sch-print-normalheader ' + a.normalGrid.headerCt.el.dom.className + '">';
				b += '<div style="margin-left:-' + a.normalScroll + 'px">' + a.normalHeader + "</div>";
				b += "</div>"
			}
			return b
		},
		printLockedGrid: function(a) {
			var b = "";
			if (a.lockedGrid) {
				b += '<div id="lockedRowsCt" style="left:-' + a.lockedScroll + "px;margin-right:-" + a.lockedScroll + "px;width:" + (a.lockedWidth + a.lockedScroll) + "px;top:" + a.headerHeight + 'px;" class="sch-print-locked-rows-ct ' + a.innerLockedClasses + " " + Ext.baseCSSPrefix + 'grid-inner-locked">';
				b += a.lockedRows;
				b += "</div>"
			}
			return b
		},
		printNormalGrid: function(a) {
			var b = "";
			if (a.normalGrid) {
				b += '<div id="normalRowsCt" style="left:' + (a.lockedGrid ? a.lockedWidth: "0") + "px;top:" + a.headerHeight + "px;width:" + a.normalWidth + 'px" class="sch-print-normal-rows-ct ' + a.innerNormalClasses + '">';
				b += '<div style="position:relative;overflow:visible;margin-left:-' + a.normalScroll + 'px">' + a.normalRows + "</div>";
				b += "</div>"
			}
			return b
		}
	}),
	getGridContent: function(n) {
		var m = n.normalGrid,
		e = n.lockedGrid,
		o = e.getView(),
		g = m.getView(),
		j,
		d,
		l,
		i,
		k,
		b,
		h;
		this.beforePrint(n);
		if (e.collapsed && !m.collapsed) {
			b = e.getWidth() + m.getWidth()
		} else {
			b = m.getWidth();
			h = e.getWidth()
		}
		var c = o.store.getRange();
		d = o.tpl.apply(o.collectData(c, 0));
		l = g.tpl.apply(g.collectData(c, 0));
		i = o.el.getScroll().left;
		k = g.el.getScroll().left;
		var a = document.createElement("div");
		a.innerHTML = d;
		if (Ext.versions.extjs.isLessThan("4.2.1")) {
			e.headerCt.items.each(function(q, p) {
				if (q.isHidden()) {
					Ext.fly(a).down("colgroup:nth-child(" + (p + 1) + ") col").setWidth(0)
				}
			})
		}
		d = a.innerHTML;
		if (Sch.feature && Sch.feature.AbstractTimeSpan) {
			var f = (n.plugins || []).concat(n.normalGrid.plugins || []).concat(n.columnLinesFeature || []);
			Ext.each(f,
			function(p) {
				if (p instanceof Sch.feature.AbstractTimeSpan && p.generateMarkup) {
					l = p.generateMarkup(true) + l
				}
			})
		}
		this.afterPrint(n);
		return {
			normalHeader: m.headerCt.el.dom.innerHTML,
			lockedHeader: e.headerCt.el.dom.innerHTML,
			lockedGrid: e.collapsed ? false: e,
			normalGrid: m.collapsed ? false: m,
			lockedRows: d,
			normalRows: l,
			lockedScroll: i,
			normalScroll: k,
			lockedWidth: h - (Ext.isWebKit ? 1: 0),
			normalWidth: b,
			headerHeight: m.headerCt.getHeight(),
			innerLockedClasses: e.view.el.dom.className,
			innerNormalClasses: m.view.el.dom.className + (this.fakeBackgroundColor ? " sch-print-fake-background": ""),
			width: n.getWidth()
		}
	},
	getStylesheets: function() {
		return Ext.getDoc().select('link[rel="stylesheet"]')
	},
	print: function() {
		var g = this.scheduler;
		if (! (this.mainTpl instanceof Ext.Template)) {
			var a = 22;
			this.mainTpl = Ext.create("Ext.XTemplate", this.mainTpl, {
				compiled: true,
				disableFormats: true
			})
		}
		var h = g.getView(),
		i = this.getStylesheets(),
		e = Ext.get(Ext.core.DomHelper.createDom({
			tag: "div"
		})),
		b;
		i.each(function(j) {
			e.appendChild(j.dom.cloneNode(true))
		});
		b = e.dom.innerHTML + "";
		var f = this.getGridContent(g),
		c = this.mainTpl.apply(Ext.apply({
			waitText: this.waitText,
			docType: this.docType,
			htmlClasses: Ext.getBody().parent().dom.className,
			bodyClasses: Ext.getBody().dom.className,
			componentClasses: g.el.dom.className,
			title: (g.title || ""),
			styles: b,
			totalWidth: g.getWidth(),
			setupScript: ("window.onload = function(){ (" + this.setupScript.toString() + ")(" + g.syncRowHeight + ", " + this.autoPrintAndClose + ", " + Ext.isChrome + ", " + Ext.isIE + "); };")
		},
		f));
		var d = window.open("", "printgrid");
		this.printWindow = d;
		d.document.write(c);
		d.document.close()
	},
	setupScript: function(e, a, d, b) {
		var c = function() {
			if (e) {
				var f = document.getElementById("lockedRowsCt"),
				o = document.getElementById("normalRowsCt"),
				g = f && f.getElementsByTagName("tr"),
				m = o && o.getElementsByTagName("tr"),
				k = m && g ? m.length: 0;
				for (var j = 0; j < k; j++) {
					var h = m[j].clientHeight;
					var l = g[j].clientHeight;
					var n = Math.max(h, l) + "px";
					g[j].style.height = m[j].style.height = n
				}
			}
			if (a) {
				window.print();
				if (!d) {
					window.close()
				}
			}
		};
		if (b) {
			setTimeout(c, 0)
		} else {
			c()
		}
	}
});
Ext.define("Sch.plugin.Export", {
	extend: "Ext.util.Observable",
	alternateClassName: "Sch.plugin.PdfExport",
	alias: "plugin.scheduler_export",
	mixins: ["Ext.AbstractPlugin"],
	requires: ["Ext.XTemplate"],
	lockableScope: "top",
	printServer: undefined,
	tpl: null,
	exportDialogClassName: "Sch.widget.ExportDialog",
	exportDialogConfig: {},
	defaultConfig: {
		format: "A4",
		orientation: "portrait",
		range: "complete",
		showHeader: true,
		singlePageExport: false
	},
	expandAllBeforeExport: false,
	pageSizes: {
		A5: {
			width: 5.8,
			height: 8.3
		},
		A4: {
			width: 8.3,
			height: 11.7
		},
		A3: {
			width: 11.7,
			height: 16.5
		},
		Letter: {
			width: 8.5,
			height: 11
		},
		Legal: {
			width: 8.5,
			height: 14
		}
	},
	openAfterExport: true,
	beforeExport: Ext.emptyFn,
	afterExport: Ext.emptyFn,
	fileFormat: "pdf",
	DPI: 72,
	constructor: function(a) {
		a = a || {};
		if (a.exportDialogConfig) {
			Ext.Object.each(this.defaultConfig,
			function(c, b, e) {
				var d = a.exportDialogConfig[c];
				if (d) {
					e[c] = d
				}
			})
		}
		this.callParent([a]);
		if (!this.tpl) {
			this.tpl = new Ext.XTemplate('<!DOCTYPE html><html class="' + Ext.baseCSSPrefix + 'border-box {htmlClasses}"><head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type" /><title>{column}/{row}</title>{styles}</head><body class="' + Ext.baseCSSPrefix + 'webkit sch-export {bodyClasses}"><tpl if="showHeader"><div class="sch-export-header" style="width:{totalWidth}px"><h2>{column}/{row}</h2></div></tpl><div class="{componentClasses}" style="height:{bodyHeight}px; width:{totalWidth}px; position: relative !important">{HTML}</div></body></html>', {
				disableFormats: true
			})
		}
		this.addEvents("hidedialogwindow", "showdialogerror", "updateprogressbar");
		this.setFileFormat(this.fileFormat)
	},
	init: function(a) {
		this.scheduler = a;
		a.showExportDialog = Ext.Function.bind(this.showExportDialog, this);
		a.doExport = Ext.Function.bind(this.doExport, this)
	},
	setFileFormat: function(a) {
		if (typeof a !== "string") {
			this.fileFormat = "pdf"
		} else {
			a = a.toLowerCase();
			if (a === "png") {
				this.fileFormat = a
			} else {
				this.fileFormat = "pdf"
			}
		}
	},
	showExportDialog: function() {
		var b = this,
		a = b.scheduler.getSchedulingView();
		if (b.win) {
			b.win.destroy();
			b.win = null
		}
		b.win = Ext.create(b.exportDialogClassName, {
			plugin: b,
			exportDialogConfig: Ext.apply({
				startDate: b.scheduler.getStart(),
				endDate: b.scheduler.getEnd(),
				rowHeight: a.rowHeight,
				columnWidth: a.timeAxisViewModel.getTickWidth(),
				defaultConfig: b.defaultConfig
			},
			b.exportDialogConfig)
		});
		b.saveRestoreData();
		b.win.show()
	},
	saveRestoreData: function() {
		var b = this.scheduler,
		a = b.getSchedulingView(),
		c = b.normalGrid,
		d = b.lockedGrid;
		this.restoreSettings = {
			width: b.getWidth(),
			height: b.getHeight(),
			rowHeight: a.rowHeight,
			columnWidth: a.timeAxisViewModel.getTickWidth(),
			startDate: b.getStart(),
			endDate: b.getEnd(),
			normalWidth: c.getWidth(),
			normalLeft: c.getEl().getStyle("left"),
			lockedWidth: d.getWidth(),
			lockedCollapse: d.collapsed,
			normalCollapse: c.collapsed
		}
	},
	getStylesheets: function() {
		var c = Ext.getDoc().select('link[rel="stylesheet"]'),
		a = Ext.get(Ext.core.DomHelper.createDom({
			tag: "div"
		})),
		b;
		c.each(function(d) {
			a.appendChild(d.dom.cloneNode(true))
		});
		b = a.dom.innerHTML + "";
		return b
	},
	doExport: function(n, j, q) {
		this.mask();
		var K = this,
		p = K.scheduler,
		r = p.getSchedulingView(),
		m = K.getStylesheets(),
		I = n || K.defaultConfig,
		s = p.normalGrid,
		F = p.lockedGrid,
		A = s.headerCt.getHeight();
		K.saveRestoreData();
		s.expand();
		F.expand();
		K.fireEvent("updateprogressbar", 0.1);
		if (this.expandAllBeforeExport && p.expandAll) {
			p.expandAll()
		}
		var J = p.timeAxis.getTicks(),
		t = r.timeAxisViewModel.getTickWidth(),
		D,
		e,
		g;
		if (!I.singlePageExport) {
			if (I.orientation === "landscape") {
				D = K.pageSizes[I.format].height * K.DPI;
				g = K.pageSizes[I.format].width * K.DPI
			} else {
				D = K.pageSizes[I.format].width * K.DPI;
				g = K.pageSizes[I.format].height * K.DPI
			}
			var H = 41;
			e = Math.floor(g) - A - (I.showHeader ? H: 0)
		}
		r.timeAxisViewModel.suppressFit = true;
		var E = 0;
		var k = 0;
		if (I.range !== "complete") {
			var d,
			b;
			switch (I.range) {
			case "date":
				d = new Date(I.dateFrom);
				b = new Date(I.dateTo);
				if (Sch.util.Date.getDurationInDays(d, b) < 1) {
					b = Sch.util.Date.add(b, Sch.util.Date.DAY, 1)
				}
				d = Sch.util.Date.constrain(d, p.getStart(), p.getEnd());
				b = Sch.util.Date.constrain(b, p.getStart(), p.getEnd());
				break;
			case "current":
				var L = r.getVisibleDateRange();
				d = L.startDate;
				b = L.endDate || r.timeAxis.getEnd();
				if (I.cellSize) {
					t = I.cellSize[0];
					if (I.cellSize.length > 1) {
						r.setRowHeight(I.cellSize[1])
					}
				}
				break
			}
			p.setTimeSpan(d, b);
			var c = Math.floor(r.timeAxis.getTickFromDate(d));
			var x = Math.floor(r.timeAxis.getTickFromDate(b));
			J = p.timeAxis.getTicks();
			J = Ext.Array.filter(J,
			function(i, a) {
				if (a < c) {
					E++;
					return false
				} else {
					if (a > x) {
						k++;
						return false
					}
				}
				return true
			})
		}
		this.beforeExport(p, J);
		var C,
		z,
		h;
		if (!I.singlePageExport) {
			p.setWidth(D);
			p.setTimeColumnWidth(t);
			r.timeAxisViewModel.setTickWidth(t);
			h = K.calculatePages(I, J, t, D, e);
			z = K.getExportJsonHtml(h, {
				styles: m,
				config: I,
				ticks: J,
				skippedColsBefore: E,
				skippedColsAfter: k,
				printHeight: e,
				paperWidth: D,
				headerHeight: A
			});
			C = I.format
		} else {
			z = K.getExportJsonHtml(null, {
				styles: m,
				config: I,
				ticks: J,
				skippedColsBefore: E,
				skippedColsAfter: k,
				timeColumnWidth: t
			});
			var f = K.getRealSize(),
			v = Ext.Number.toFixed(f.width / K.DPI, 1),
			u = Ext.Number.toFixed(f.height / K.DPI, 1);
			C = v + "in*" + u + "in"
		}
		K.fireEvent("updateprogressbar", 0.4);
		if (K.printServer) {
			if (!K.debug && !K.test) {
				Ext.Ajax.request({
					type: "POST",
					url: K.printServer,
					timeout: 60000,
					params: {
						html: {
							array: z
						},
						format: C,
						orientation: I.orientation,
						range: I.range,
						fileFormat: K.fileFormat
					},
					success: function(a) {
						K.onSuccess(a, j, q)
					},
					failure: function(a) {
						K.onFailure(a, q)
					},
					scope: K
				})
			} else {
				if (K.debug) {
					var o,
					G = Ext.JSON.decode(z);
					for (var B = 0, y = G.length; B < y; B++) {
						o = window.open();
						o.document.write(G[B].html);
						o.document.close()
					}
				}
			}
		} else {
			throw "Print server URL is not defined, please specify printServer config"
		}
		r.timeAxisViewModel.suppressFit = false;
		K.restorePanel();
		this.afterExport(p);
		if (K.test) {
			return {
				htmlArray: Ext.JSON.decode(z),
				calculatedPages: h
			}
		}
	},
	getRealSize: function() {
		var c = this.scheduler,
		b = c.normalGrid.headerCt.getHeight(),
		a = (b + c.lockedGrid.getView().getEl().down("." + Ext.baseCSSPrefix + "grid-table").getHeight()),
		d = (c.lockedGrid.headerCt.getEl().first().getWidth() + c.normalGrid.body.select("." + Ext.baseCSSPrefix + "grid-table").first().getWidth());
		return {
			width: d,
			height: a
		}
	},
	calculatePages: function(r, s, j, p, b) {
		var t = this,
		i = t.scheduler,
		q = i.lockedGrid,
		c = i.getSchedulingView().rowHeight,
		u = q.headerCt,
		o = u.getEl().first().getWidth(),
		h = null,
		k = 0;
		if (o > q.getWidth()) {
			var g = 0,
			d = 0,
			m = 0,
			n = false,
			e;
			h = [];
			q.headerCt.items.each(function(y, w, v) {
				e = y.width;
				if (!m || m + e < p) {
					m += e;
					if (w === v - 1) {
						n = true;
						var x = p - m;
						k = Math.floor(x / j)
					}
				} else {
					n = true
				}
				if (n) {
					d = w;
					h.push({
						firstColumnIdx: g,
						lastColumnIdx: d,
						totalColumnsWidth: m || e
					});
					g = d + 1;
					m = 0
				}
			})
		} else {
			k = Math.floor((p - o) / j)
		}
		var l = Math.floor(p / j),
		a = Math.ceil((s.length - k) / l),
		f = Math.floor(b / c);
		if (!h || a === 0) {
			a += 1
		}
		return {
			columnsAmountLocked: k,
			columnsAmountNormal: l,
			lockedColumnPages: h,
			rowsAmount: f,
			rowPages: Math.ceil(i.getSchedulingView().store.getCount() / f),
			columnPages: a,
			timeColumnWidth: j,
			lockedGridWidth: o,
			rowHeight: c,
			panelHTML: {}
		}
	},
	getExportJsonHtml: function(f, E) {
		var H = this,
		n = H.scheduler,
		y = [],
		v = new RegExp(Ext.baseCSSPrefix + "ie\\d?|" + Ext.baseCSSPrefix + "gecko", "g"),
		B = Ext.getBody().dom.className.replace(v, ""),
		q = n.el.dom.className,
		m = E.styles,
		F = E.config,
		G = E.ticks,
		o,
		d,
		e,
		p,
		r;
		if (Ext.isIE) {
			B += " sch-ie-export"
		}
		n.timeAxis.autoAdjust = false;
		if (!F.singlePageExport) {
			var s = f.columnsAmountLocked,
			u = f.columnsAmountNormal,
			l = f.lockedColumnPages,
			h = f.rowsAmount,
			t = f.rowPages,
			a = f.columnPages,
			C = E.paperWidth,
			c = E.printHeight,
			z = E.headerHeight,
			j = null,
			b,
			g;
			r = f.timeColumnWidth;
			o = f.panelHTML;
			o.skippedColsBefore = E.skippedColsBefore;
			o.skippedColsAfter = E.skippedColsAfter;
			if (l) {
				g = l.length;
				a += g
			}
			for (var A = 0; A < a; A++) {
				if (l && A < g) {
					if (A === g - 1 && s !== 0) {
						n.normalGrid.show();
						j = Ext.Number.constrain((s - 1), 0, (G.length - 1));
						n.setTimeSpan(G[0].start, G[j].end)
					} else {
						n.normalGrid.hide()
					}
					var D = l[A];
					this.showLockedColumns();
					this.hideLockedColumns(D.firstColumnIdx, D.lastColumnIdx);
					n.lockedGrid.setWidth(D.totalColumnsWidth + 1)
				} else {
					if (A === 0) {
						this.showLockedColumns();
						if (s !== 0) {
							n.normalGrid.show()
						}
						j = Ext.Number.constrain(s - 1, 0, G.length - 1);
						n.setTimeSpan(G[0].start, G[j].end)
					} else {
						n.lockedGrid.hide();
						n.normalGrid.show();
						if (j === null) {
							j = -1
						}
						if (G[j + u]) {
							n.setTimeSpan(G[j + 1].start, G[j + u].end);
							j = j + u
						} else {
							n.setTimeSpan(G[j + 1].start, G[G.length - 1].end)
						}
					}
				}
				n.setTimeColumnWidth(r, true);
				n.getSchedulingView().timeAxisViewModel.setTickWidth(r);
				for (var x = 0; x < t; x += 1) {
					H.hideRows(h, x);
					o.dom = n.body.dom.innerHTML;
					o.k = x;
					o.i = A;
					d = H.resizePanelHTML(o);
					p = H.tpl.apply(Ext.apply({
						bodyClasses: B,
						bodyHeight: c + z,
						componentClasses: q,
						styles: m,
						showHeader: F.showHeader,
						HTML: d.dom.innerHTML,
						totalWidth: C,
						headerHeight: z,
						column: A + 1,
						row: x + 1
					}));
					e = {
						html: p
					};
					y.push(e);
					H.showRows()
				}
			}
		} else {
			r = E.timeColumnWidth;
			o = f ? f.panelHTML: {};
			n.setTimeSpan(G[0].start, G[G.length - 1].end);
			n.lockedGrid.setWidth(n.lockedGrid.headerCt.getEl().first().getWidth());
			n.setTimeColumnWidth(r);
			n.getSchedulingView().timeAxisViewModel.setTickWidth(r);
			var w = H.getRealSize();
			Ext.apply(o, {
				dom: n.body.dom.innerHTML,
				column: 1,
				row: 1,
				timeColumnWidth: E.timeColumnWidth,
				skippedColsBefore: E.skippedColsBefore,
				skippedColsAfter: E.skippedColsAfter
			});
			d = H.resizePanelHTML(o);
			p = H.tpl.apply(Ext.apply({
				bodyClasses: B,
				bodyHeight: w.height,
				componentClasses: q,
				styles: m,
				showHeader: false,
				HTML: d.dom.innerHTML,
				totalWidth: w.width
			}));
			e = {
				html: p
			};
			y.push(e)
		}
		n.timeAxis.autoAdjust = true;
		return Ext.JSON.encode(y)
	},
	resizePanelHTML: function(f) {
		var k = Ext.get(Ext.core.DomHelper.createDom({
			tag: "div",
			html: f.dom
		})),
		j = this.scheduler,
		d = j.lockedGrid,
		i = j.normalGrid,
		g,
		e,
		b;
		if (Ext.isIE6 || Ext.isIE7 || Ext.isIEQuirks) {
			var h = document.createDocumentFragment(),
			a,
			c;
			if (h.getElementById) {
				a = "getElementById";
				c = ""
			} else {
				a = "querySelector";
				c = "#"
			}
			h.appendChild(k.dom);
			g = d.view.el;
			e = [h[a](c + j.id + "-targetEl"), h[a](c + j.id + "-innerCt"), h[a](c + d.id), h[a](c + d.body.id), h[a](c + g.id)];
			b = [h[a](c + i.id), h[a](c + i.headerCt.id), h[a](c + i.body.id), h[a](c + i.getView().id)];
			Ext.Array.each(e,
			function(l) {
				if (l !== null) {
					l.style.height = "100%";
					l.style.width = "100%"
				}
			});
			Ext.Array.each(b,
			function(m, l) {
				if (m !== null) {
					if (l === 1) {
						m.style.width = "100%"
					} else {
						m.style.height = "100%";
						m.style.width = "100%"
					}
				}
			});
			k.dom.innerHTML = h.firstChild.innerHTML
		} else {
			g = d.view.el;
			e = [k.select("#" + j.id + "-targetEl").first(), k.select("#" + j.id + "-innerCt").first(), k.select("#" + d.id).first(), k.select("#" + d.body.id).first(), k.select("#" + g.id)];
			b = [k.select("#" + i.id).first(), k.select("#" + i.headerCt.id).first(), k.select("#" + i.body.id).first(), k.select("#" + i.getView().id).first()];
			Ext.Array.each(e,
			function(m, l) {
				if (m) {
					m.setHeight("100%");
					if (l !== 3 && l !== 2) {
						m.setWidth("100%")
					}
				}
			});
			Ext.Array.each(b,
			function(m, l) {
				if (l === 1) {
					m.setWidth("100%")
				} else {
					m.applyStyles({
						height: "100%",
						width: "100%"
					})
				}
			})
		}
		return k
	},
	getWin: function() {
		return this.win || null
	},
	onSuccess: function(c, h, b) {
		var d = this,
		g = d.getWin(),
		a;
		try {
			a = Ext.JSON.decode(c.responseText)
		} catch(f) {
			this.onFailure(c, b);
			return
		}
		d.fireEvent("updateprogressbar", 1);
		if (a.success) {
			setTimeout(function() {
				d.fireEvent("hidedialogwindow");
				d.unmask();
				if (d.openAfterExport) {
					window.open(a.url, "ExportedPanel")
				}
			},
			g ? g.hideTime: 3000)
		} else {
			d.fireEvent("showdialogerror", g, a.msg);
			d.unmask()
		}
		if (h) {
			h.call(this, c)
		}
	},
	onFailure: function(b, a) {
		var c = this.getWin(),
		d = b.status === 200 ? b.responseText: b.statusText;
		this.fireEvent("showdialogerror", c, d);
		this.unmask();
		if (a) {
			a.call(this, b)
		}
	},
	hideRows: function(e, g) {
		var d = this.scheduler.lockedGrid.view.getNodes(),
		a = this.scheduler.normalGrid.view.getNodes(),
		h = e * g,
		c = h + e;
		for (var f = 0, b = a.length; f < b; f++) {
			if (f < h || f >= c) {
				d[f].className += " sch-none";
				a[f].className += " sch-none"
			}
		}
	},
	showRows: function() {
		this.scheduler.getEl().select(this.scheduler.getSchedulingView().getItemSelector()).each(function(a) {
			a.removeCls("sch-none")
		})
	},
	hideLockedColumns: function(c, e) {
		var d = this.scheduler.lockedGrid.headerCt.items.items;
		for (var b = 0, a = d.length; b < a; b++) {
			if (b < c || b > e) {
				d[b].hide()
			}
		}
	},
	showLockedColumns: function() {
		this.scheduler.lockedGrid.headerCt.items.each(function(a) {
			a.show()
		})
	},
	mask: function() {
		var a = Ext.getBody().mask();
		a.addCls("sch-export-mask")
	},
	unmask: function() {
		Ext.getBody().unmask()
	},
	restorePanel: function() {
		var b = this.scheduler,
		a = this.restoreSettings;
		b.setWidth(a.width);
		b.setHeight(a.height);
		b.setTimeSpan(a.startDate, a.endDate);
		b.setTimeColumnWidth(a.columnWidth, true);
		b.getSchedulingView().setRowHeight(a.rowHeight);
		b.lockedGrid.show();
		b.normalGrid.setWidth(a.normalWidth);
		b.normalGrid.getEl().setStyle("left", a.normalLeft);
		b.lockedGrid.setWidth(a.lockedWidth);
		if (a.lockedCollapse) {
			b.lockedGrid.collapse()
		}
		if (a.normalCollapse) {
			b.normalGrid.collapse()
		}
	},
	destroy: function() {
		if (this.win) {
			this.win.destroy()
		}
	}
});
Ext.define("Sch.widget.ResizePicker", {
	extend: "Ext.Panel",
	alias: "widget.dualrangepicker",
	width: 200,
	height: 200,
	border: true,
	collapsible: false,
	bodyStyle: "position:absolute; margin:5px",
	verticalCfg: {
		height: 120,
		value: 24,
		increment: 2,
		minValue: 20,
		maxValue: 80,
		reverse: true,
		disabled: true
	},
	horizontalCfg: {
		width: 120,
		value: 100,
		minValue: 25,
		increment: 5,
		maxValue: 200,
		disable: true
	},
	initComponent: function() {
		var a = this;
		a.addEvents("change", "changecomplete", "select");
		a.horizontalCfg.value = a.dialogConfig.columnWidth;
		a.verticalCfg.value = a.dialogConfig.rowHeight;
		a.verticalCfg.disabled = a.dialogConfig.scrollerDisabled || false;
		a.dockedItems = [a.vertical = new Ext.slider.Single(Ext.apply({
			dock: "left",
			style: "margin-top:10px",
			vertical: true,
			listeners: {
				change: a.onSliderChange,
				changecomplete: a.onSliderChangeComplete,
				scope: a
			}
		},
		a.verticalCfg)), a.horizontal = new Ext.slider.Single(Ext.apply({
			dock: "top",
			style: "margin-left:28px",
			listeners: {
				change: a.onSliderChange,
				changecomplete: a.onSliderChangeComplete,
				scope: a
			}
		},
		a.horizontalCfg))];
		a.callParent(arguments)
	},
	afterRender: function() {
		var b = this;
		b.addCls("sch-ux-range-picker");
		b.valueHandle = this.body.createChild({
			cls: "sch-ux-range-value",
			cn: {
				tag: "span"
			}
		});
		b.valueSpan = this.valueHandle.down("span");
		var a = new Ext.dd.DD(this.valueHandle);
		Ext.apply(a, {
			startDrag: function() {
				b.dragging = true;
				this.constrainTo(b.body)
			},
			onDrag: function() {
				b.onHandleDrag.apply(b, arguments)
			},
			endDrag: function() {
				b.onHandleEndDrag.apply(b, arguments);
				b.dragging = false
			},
			scope: this
		});
		this.setValues(this.getValues());
		this.callParent(arguments);
		this.body.on("click", this.onBodyClick, this)
	},
	onBodyClick: function(c, a) {
		var b = [c.getXY()[0] - 8 - this.body.getX(), c.getXY()[1] - 8 - this.body.getY()];
		this.valueHandle.setLeft(Ext.Number.constrain(b[0], 0, this.getAvailableWidth()));
		this.valueHandle.setTop(Ext.Number.constrain(b[1], 0, this.getAvailableHeight()));
		this.setValues(this.getValuesFromXY([this.valueHandle.getLeft(true), this.valueHandle.getTop(true)]));
		this.onSliderChangeComplete()
	},
	getAvailableWidth: function() {
		return this.body.getWidth() - 18
	},
	getAvailableHeight: function() {
		return this.body.getHeight() - 18
	},
	onHandleDrag: function() {
		this.setValues(this.getValuesFromXY([this.valueHandle.getLeft(true), this.valueHandle.getTop(true)]))
	},
	onHandleEndDrag: function() {
		this.setValues(this.getValuesFromXY([this.valueHandle.getLeft(true), this.valueHandle.getTop(true)]))
	},
	getValuesFromXY: function(d) {
		var c = d[0] / this.getAvailableWidth();
		var a = d[1] / this.getAvailableHeight();
		var e = Math.round((this.horizontalCfg.maxValue - this.horizontalCfg.minValue) * c);
		var b = Math.round((this.verticalCfg.maxValue - this.verticalCfg.minValue) * a) + this.verticalCfg.minValue;
		return [e + this.horizontalCfg.minValue, b]
	},
	getXYFromValues: function(d) {
		var b = this.horizontalCfg.maxValue - this.horizontalCfg.minValue;
		var f = this.verticalCfg.maxValue - this.verticalCfg.minValue;
		var a = Math.round((d[0] - this.horizontalCfg.minValue) * this.getAvailableWidth() / b);
		var c = d[1] - this.verticalCfg.minValue;
		var e = Math.round(c * this.getAvailableHeight() / f);
		return [a, e]
	},
	updatePosition: function() {
		var a = this.getValues();
		var b = this.getXYFromValues(a);
		this.valueHandle.setLeft(Ext.Number.constrain(b[0], 0, this.getAvailableWidth()));
		if (this.verticalCfg.disabled) {
			this.valueHandle.setTop(this.dialogConfig.rowHeight)
		} else {
			this.valueHandle.setTop(Ext.Number.constrain(b[1], 0, this.getAvailableHeight()))
		}
		this.positionValueText();
		this.setValueText(a)
	},
	positionValueText: function() {
		var a = this.valueHandle.getTop(true);
		var b = this.valueHandle.getLeft(true);
		this.valueSpan.setLeft(b > 30 ? -30: 10);
		this.valueSpan.setTop(a > 10 ? -20: 20)
	},
	setValueText: function(a) {
		if (this.verticalCfg.disabled) {
			a[1] = this.dialogConfig.rowHeight
		}
		this.valueSpan.update("[" + a.toString() + "]")
	},
	setValues: function(a) {
		this.horizontal.setValue(a[0]);
		if (this.verticalCfg.reverse) {
			if (!this.verticalCfg.disabled) {
				this.vertical.setValue(this.verticalCfg.maxValue + this.verticalCfg.minValue - a[1])
			}
		} else {
			if (!this.verticalCfg.disabled) {
				this.vertical.setValue(a[1])
			}
		}
		if (!this.dragging) {
			this.updatePosition()
		}
		this.positionValueText();
		this.setValueText(a)
	},
	getValues: function() {
		if (!this.verticalCfg.disabled) {
			var a = this.vertical.getValue();
			if (this.verticalCfg.reverse) {
				a = this.verticalCfg.maxValue - a + this.verticalCfg.minValue
			}
			return [this.horizontal.getValue(), a]
		}
		return [this.horizontal.getValue()]
	},
	onSliderChange: function() {
		this.fireEvent("change", this, this.getValues());
		if (!this.dragging) {
			this.updatePosition()
		}
	},
	onSliderChangeComplete: function() {
		this.fireEvent("changecomplete", this, this.getValues())
	},
	afterLayout: function() {
		this.callParent(arguments);
		this.updatePosition()
	}
});
Ext.define("Sch.widget.ExportDialogForm", {
	extend: "Ext.form.Panel",
	requires: ["Ext.ProgressBar", "Ext.form.field.ComboBox", "Ext.form.field.Date", "Ext.form.FieldContainer", "Ext.form.field.Checkbox", "Sch.widget.ResizePicker"],
	border: false,
	bodyPadding: "10 10 0 10",
	autoHeight: true,
	initComponent: function() {
		var a = this;
		if (Ext.getVersion("extjs").isLessThan("4.2.1")) {
			if (typeof Ext.tip !== "undefined" && Ext.tip.Tip && Ext.tip.Tip.prototype.minWidth != "auto") {
				Ext.tip.Tip.prototype.minWidth = "auto"
			}
		}
		a.createFields();
		Ext.apply(this, {
			fieldDefaults: {
				labelAlign: "left",
				labelWidth: 120,
				anchor: "99%"
			},
			items: [a.rangeField, a.resizerHolder, a.datesHolder, a.showHeaderField, a.exportToSingleField, a.formatField, a.orientationField, a.progressBar || a.createProgressBar()]
		});
		a.callParent(arguments);
		a.onRangeChange(null, a.dialogConfig.defaultConfig.range);
		a.on({
			hideprogressbar: a.hideProgressBar,
			showprogressbar: a.showProgressBar,
			updateprogressbar: a.updateProgressBar,
			scope: a
		})
	},
	isValid: function() {
		var a = this;
		if (a.rangeField.getValue() === "date") {
			return a.dateFromField.isValid() && a.dateToField.isValid()
		}
		return true
	},
	getValues: function(e, c, d, b) {
		var a = this.callParent(arguments);
		var f = this.resizePicker.getValues();
		if (!e) {
			a.cellSize = f
		} else {
			a += "&cellSize[0]=" + f[0] + "&cellSize[1]=" + f[1]
		}
		return a
	},
	createFields: function() {
		var d = this,
		a = d.dialogConfig,
		f = '<table class="sch-fieldcontainer-label-wrap"><td width="1" class="sch-fieldcontainer-label">',
		e = '<td><div class="sch-fieldcontainer-separator"></div></table>';
		d.rangeField = new Ext.form.field.ComboBox({
			value: a.defaultConfig.range,
			triggerAction: "all",
			cls: "sch-export-dialog-range",
			forceSelection: true,
			editable: false,
			fieldLabel: a.rangeFieldLabel,
			name: "range",
			queryMode: "local",
			displayField: "name",
			valueField: "value",
			store: Ext.create("Ext.data.Store", {
				fields: ["name", "value"],
				data: [{
					name: a.completeViewText,
					value: "complete"
				},
				{
					name: a.dateRangeText,
					value: "date"
				},
				{
					name: a.currentViewText,
					value: "current"
				}]
			}),
			listeners: {
				change: d.onRangeChange,
				scope: d
			}
		});
		d.resizePicker = new Sch.widget.ResizePicker({
			dialogConfig: a,
			margin: "10 20"
		});
		d.resizerHolder = new Ext.form.FieldContainer({
			fieldLabel: a.scrollerDisabled ? a.adjustCols: a.adjustColsAndRows,
			labelAlign: "top",
			hidden: true,
			labelSeparator: "",
			beforeLabelTextTpl: f,
			afterLabelTextTpl: e,
			layout: "vbox",
			defaults: {
				flex: 1,
				allowBlank: false
			},
			items: [d.resizePicker]
		});
		d.dateFromField = new Ext.form.field.Date({
			fieldLabel: a.dateRangeFromText,
			baseBodyCls: "sch-exportdialogform-date",
			name: "dateFrom",
			format: a.dateRangeFormat || Ext.Date.defaultFormat,
			allowBlank: false,
			maxValue: a.endDate,
			minValue: a.startDate,
			value: a.startDate
		});
		d.dateToField = new Ext.form.field.Date({
			fieldLabel: a.dateRangeToText,
			name: "dateTo",
			format: a.dateRangeFormat || Ext.Date.defaultFormat,
			baseBodyCls: "sch-exportdialogform-date",
			allowBlank: false,
			maxValue: a.endDate,
			minValue: a.startDate,
			value: a.endDate
		});
		d.datesHolder = new Ext.form.FieldContainer({
			fieldLabel: a.specifyDateRange,
			labelAlign: "top",
			hidden: true,
			labelSeparator: "",
			beforeLabelTextTpl: f,
			afterLabelTextTpl: e,
			layout: "vbox",
			defaults: {
				flex: 1,
				allowBlank: false
			},
			items: [d.dateFromField, d.dateToField]
		});
		d.showHeaderField = new Ext.form.field.Checkbox({
			xtype: "checkboxfield",
			boxLabel: d.dialogConfig.showHeaderLabel,
			name: "showHeader",
			checked: !!a.defaultConfig.showHeaderLabel
		});
		d.exportToSingleField = new Ext.form.field.Checkbox({
			xtype: "checkboxfield",
			boxLabel: d.dialogConfig.exportToSingleLabel,
			name: "singlePageExport",
			checked: !!a.defaultConfig.singlePageExport
		});
		d.formatField = new Ext.form.field.ComboBox({
			value: a.defaultConfig.format,
			triggerAction: "all",
			forceSelection: true,
			editable: false,
			fieldLabel: a.formatFieldLabel,
			name: "format",
			queryMode: "local",
			store: ["A5", "A4", "A3", "Letter", "Legal"]
		});
		var c = a.defaultConfig.orientation === "portrait" ? 'class="sch-none"': "",
		b = a.defaultConfig.orientation === "landscape" ? 'class="sch-none"': "";
		d.orientationField = new Ext.form.field.ComboBox({
			value: a.defaultConfig.orientation,
			triggerAction: "all",
			baseBodyCls: "sch-exportdialogform-orientation",
			forceSelection: true,
			editable: false,
			fieldLabel: d.dialogConfig.orientationFieldLabel,
			afterSubTpl: new Ext.XTemplate('<span id="sch-exportdialog-imagePortrait" ' + b + '></span><span id="sch-exportdialog-imageLandscape" ' + c + "></span>"),
			name: "orientation",
			displayField: "name",
			valueField: "value",
			queryMode: "local",
			store: Ext.create("Ext.data.Store", {
				fields: ["name", "value"],
				data: [{
					name: a.orientationPortraitText,
					value: "portrait"
				},
				{
					name: a.orientationLandscapeText,
					value: "landscape"
				}]
			}),
			listeners: {
				change: function(h, g) {
					switch (g) {
					case "landscape":
						Ext.fly("sch-exportdialog-imagePortrait").toggleCls("sch-none");
						Ext.fly("sch-exportdialog-imageLandscape").toggleCls("sch-none");
						break;
					case "portrait":
						Ext.fly("sch-exportdialog-imagePortrait").toggleCls("sch-none");
						Ext.fly("sch-exportdialog-imageLandscape").toggleCls("sch-none");
						break
					}
				}
			}
		})
	},
	createProgressBar: function() {
		return this.progressBar = new Ext.ProgressBar({
			text: this.config.progressBarText,
			animate: true,
			hidden: true,
			margin: "4px 0 10px 0"
		})
	},
	onRangeChange: function(b, a) {
		switch (a) {
		case "complete":
			this.datesHolder.hide();
			this.resizerHolder.hide();
			break;
		case "date":
			this.datesHolder.show();
			this.resizerHolder.hide();
			break;
		case "current":
			this.datesHolder.hide();
			this.resizerHolder.show();
			this.resizePicker.expand(true);
			break
		}
	},
	showProgressBar: function() {
		if (this.progressBar) {
			this.progressBar.show()
		}
	},
	hideProgressBar: function() {
		if (this.progressBar) {
			this.progressBar.hide()
		}
	},
	updateProgressBar: function(a) {
		if (this.progressBar) {
			this.progressBar.updateProgress(a)
		}
	}
});
Ext.define("Sch.widget.ExportDialog", {
	alternateClassName: "Sch.widget.PdfExportDialog",
	extend: "Ext.window.Window",
	requires: ["Sch.widget.ExportDialogForm"],
	mixins: ["Sch.mixin.Localizable"],
	alias: "widget.exportdialog",
	modal: false,
	width: 350,
	cls: "sch-exportdialog",
	frame: false,
	layout: "fit",
	draggable: true,
	padding: 0,
	plugin: null,
	buttonsPanel: null,
	buttonsPanelScope: null,
	progressBar: null,
	dateRangeFormat: "",
	constructor: function(a) {
		Ext.apply(this, a.exportDialogConfig);
		Ext.Array.forEach(["generalError", "title", "formatFieldLabel", "orientationFieldLabel", "rangeFieldLabel", "showHeaderLabel", "orientationPortraitText", "orientationLandscapeText", "completeViewText", "currentViewText", "dateRangeText", "dateRangeFromText", "pickerText", "dateRangeToText", "exportButtonText", "cancelButtonText", "progressBarText", "exportToSingleLabel"],
		function(b) {
			if (b in a) {
				this[b] = a[b]
			}
		},
		this);
		this.title = this.L("title");
		this.config = Ext.apply({
			progressBarText: this.L("progressBarText"),
			dateRangeToText: this.L("dateRangeToText"),
			pickerText: this.L("pickerText"),
			dateRangeFromText: this.L("dateRangeFromText"),
			dateRangeText: this.L("dateRangeText"),
			currentViewText: this.L("currentViewText"),
			formatFieldLabel: this.L("formatFieldLabel"),
			orientationFieldLabel: this.L("orientationFieldLabel"),
			rangeFieldLabel: this.L("rangeFieldLabel"),
			showHeaderLabel: this.L("showHeaderLabel"),
			exportToSingleLabel: this.L("exportToSingleLabel"),
			orientationPortraitText: this.L("orientationPortraitText"),
			orientationLandscapeText: this.L("orientationLandscapeText"),
			completeViewText: this.L("completeViewText"),
			adjustCols: this.L("adjustCols"),
			adjustColsAndRows: this.L("adjustColsAndRows"),
			specifyDateRange: this.L("specifyDateRange"),
			dateRangeFormat: this.dateRangeFormat,
			defaultConfig: this.defaultConfig
		},
		a.exportDialogConfig);
		this.callParent(arguments)
	},
	initComponent: function() {
		var b = this,
		a = {
			hidedialogwindow: b.destroy,
			showdialogerror: b.showError,
			updateprogressbar: function(c) {
				b.fireEvent("updateprogressbar", c)
			},
			scope: this
		};
		b.form = b.buildForm(b.config);
		Ext.apply(this, {
			items: b.form,
			fbar: b.buildButtons(b.buttonsPanelScope || b)
		});
		b.callParent(arguments);
		b.plugin.on(a)
	},
	afterRender: function() {
		var a = this;
		a.relayEvents(a.form.resizePicker, ["change", "changecomplete", "select"]);
		a.form.relayEvents(a, ["updateprogressbar", "hideprogressbar", "showprogressbar"]);
		a.callParent(arguments)
	},
	buildButtons: function(a) {
		return [{
			xtype: "button",
			scale: "medium",
			text: this.L("exportButtonText"),
			handler: function() {
				if (this.form.isValid()) {
					this.fireEvent("showprogressbar");
					this.plugin.doExport(this.form.getValues())
				}
			},
			scope: a
		},
		{
			xtype: "button",
			scale: "medium",
			text: this.L("cancelButtonText"),
			handler: function() {
				this.destroy()
			},
			scope: a
		}]
	},
	buildForm: function(a) {
		return new Sch.widget.ExportDialogForm({
			progressBar: this.progressBar,
			dialogConfig: a
		})
	},
	showError: function(b, a) {
		var c = b,
		d = a || c.L("generalError");
		c.fireEvent("hideprogressbar");
		Ext.Msg.alert("", d)
	}
});
Ext.define("Gnt.locale.En", {
	extend: "Sch.locale.Locale",
	requires: "Sch.locale.En",
	singleton: true,
	l10n: {
		"Gnt.util.DurationParser": {
			unitsRegex: {
				MILLI: /^ms$|^mil/i,
				SECOND: /^s$|^sec/i,
				MINUTE: /^m$|^min/i,
				HOUR: /^h$|^hr$|^hour/i,
				DAY: /^d$|^day/i,
				WEEK: /^w$|^wk|^week/i,
				MONTH: /^mo|^mnt/i,
				QUARTER: /^q$|^quar|^qrt/i,
				YEAR: /^y$|^yr|^year/i
			}
		},
		"Gnt.field.Duration": {
			invalidText: "Invalid duration value"
		},
		"Gnt.feature.DependencyDragDrop": {
			fromText: "From: <strong>{0}</strong> - {1}<br/>",
			toText: "To: <strong>{0}</strong> - {1}",
			startText: "Start",
			endText: "End"
		},
		"Gnt.Tooltip": {
			startText: "Starts: ",
			endText: "Ends: ",
			durationText: "Duration: "
		},
		"Gnt.plugin.TaskContextMenu": {
			newTaskText: "New task",
			deleteTask: "Delete task(s)",
			editLeftLabel: "Edit left label",
			editRightLabel: "Edit right label",
			add: "Add...",
			deleteDependency: "Delete dependency...",
			addTaskAbove: "Task above",
			addTaskBelow: "Task below",
			addMilestone: "Milestone",
			addSubtask: "Sub-task",
			addSuccessor: "Successor",
			addPredecessor: "Predecessor",
			convertToMilestone: "Convert to milestone",
			convertToRegular: "Convert to regular task"
		},
		"Gnt.plugin.DependencyEditor": {
			fromText: "From",
			toText: "To",
			typeText: "Type",
			lagText: "Lag",
			endToStartText: "Finish-To-Start",
			startToStartText: "Start-To-Start",
			endToEndText: "Finish-To-Finish",
			startToEndText: "Start-To-Finish"
		},
		"Gnt.widget.calendar.Calendar": {
			dayOverrideNameHeaderText: "Name",
			overrideName: "Name",
			startDate: "Start Date",
			endDate: "End Date",
			error: "Error",
			dateText: "Date",
			addText: "Add",
			editText: "Edit",
			removeText: "Remove",
			workingDayText: "Working day",
			weekendsText: "Weekends",
			overriddenDayText: "Overridden day",
			overriddenWeekText: "Overridden week",
			workingTimeText: "Working time",
			nonworkingTimeText: "Non-working time",
			dayOverridesText: "Day overrides",
			weekOverridesText: "Week overrides",
			okText: "OK",
			cancelText: "Cancel",
			parentCalendarText: "Parent calendar",
			noParentText: "No parent",
			selectParentText: "Select parent",
			newDayName: "[Without name]",
			calendarNameText: "Calendar name",
			tplTexts: {
				tplWorkingHours: "Working hours for",
				tplIsNonWorking: "is non-working",
				tplOverride: "override",
				tplInCalendar: "in calendar",
				tplDayInCalendar: "standard day in calendar",
				tplBasedOn: "Based on"
			},
			overrideErrorText: "There is already an override for this day",
			overrideDateError: "There is already a week override on this date: {0}",
			startAfterEndError: "Start date should be less than end date",
			weeksIntersectError: "Week overrides should not intersect"
		},
		"Gnt.widget.calendar.AvailabilityGrid": {
			startText: "Start",
			endText: "End",
			addText: "Add",
			removeText: "Remove",
			error: "Error"
		},
		"Gnt.widget.calendar.DayEditor": {
			workingTimeText: "Working time",
			nonworkingTimeText: "Non-working time"
		},
		"Gnt.widget.calendar.WeekEditor": {
			defaultTimeText: "Default time",
			workingTimeText: "Working time",
			nonworkingTimeText: "Non-working time",
			error: "Error",
			noOverrideError: "Week override contains only 'default' days - can't save it"
		},
		"Gnt.widget.calendar.ResourceCalendarGrid": {
			name: "Name",
			calendar: "Calendar"
		},
		"Gnt.widget.calendar.CalendarWindow": {
			ok: "Ok",
			cancel: "Cancel"
		},
		"Gnt.field.Assignment": {
			cancelText: "Cancel",
			closeText: "Save and Close"
		},
		"Gnt.column.AssignmentUnits": {
			text: "Units"
		},
		"Gnt.column.Duration": {
			text: "Duration"
		},
		"Gnt.column.Effort": {
			text: "Effort"
		},
		"Gnt.column.EndDate": {
			text: "Finish"
		},
		"Gnt.column.PercentDone": {
			text: "% Done"
		},
		"Gnt.column.ResourceAssignment": {
			text: "Assigned Resources"
		},
		"Gnt.column.ResourceName": {
			text: "Resource Name"
		},
		"Gnt.column.SchedulingMode": {
			text: "Mode"
		},
		"Gnt.column.Predecessor": {
			text: "Predecessors"
		},
		"Gnt.column.Successor": {
			text: "Successors"
		},
		"Gnt.column.StartDate": {
			text: "Start"
		},
		"Gnt.column.WBS": {
			text: "WBS"
		},
		"Gnt.widget.taskeditor.TaskForm": {
			taskNameText: "Name",
			durationText: "Duration",
			datesText: "Dates",
			baselineText: "Baseline",
			startText: "Start",
			finishText: "Finish",
			percentDoneText: "Percent Complete",
			baselineStartText: "Start",
			baselineFinishText: "Finish",
			baselinePercentDoneText: "Percent Complete",
			effortText: "Effort",
			invalidEffortText: "Invalid effort value",
			calendarText: "Calendar",
			schedulingModeText: "Scheduling Mode"
		},
		"Gnt.widget.DependencyGrid": {
			idText: "ID",
			taskText: "Task Name",
			blankTaskText: "Please select task",
			invalidDependencyText: "Invalid dependency",
			parentChildDependencyText: "Dependency between child and parent found",
			duplicatingDependencyText: "Duplicate dependency found",
			transitiveDependencyText: "Transitive dependency",
			cyclicDependencyText: "Cyclic dependency",
			typeText: "Type",
			lagText: "Lag",
			clsText: "CSS class",
			endToStartText: "Finish-To-Start",
			startToStartText: "Start-To-Start",
			endToEndText: "Finish-To-Finish",
			startToEndText: "Start-To-Finish"
		},
		"Gnt.widget.AssignmentEditGrid": {
			confirmAddResourceTitle: "Confirm",
			confirmAddResourceText: "Resource &quot;{0}&quot; not found in list. Would you like to add it?",
			noValueText: "Please select resource to assign",
			noResourceText: "No resource &quot;{0}&quot; found in the list"
		},
		"Gnt.widget.taskeditor.TaskEditor": {
			generalText: "General",
			resourcesText: "Resources",
			dependencyText: "Predecessors",
			addDependencyText: "Add new",
			dropDependencyText: "Remove",
			notesText: "Notes",
			advancedText: "Advanced",
			wbsCodeText: "WBS code",
			addAssignmentText: "Add new",
			dropAssignmentText: "Remove"
		},
		"Gnt.plugin.TaskEditor": {
			title: "Task Information",
			alertCaption: "Information",
			alertText: "Please correct marked errors to save changes",
			okText: "Ok",
			cancelText: "Cancel"
		},
		"Gnt.field.EndDate": {
			endBeforeStartText: "End date is before start date"
		},
		"Gnt.column.Note": {
			text: "Note"
		},
		"Gnt.column.AddNew": {
			text: "Add new column..."
		},
		"Gnt.column.EarlyStartDate": {
			text: "Early Start"
		},
		"Gnt.column.EarlyEndDate": {
			text: "Early Finish"
		},
		"Gnt.column.LateStartDate": {
			text: "Late Start"
		},
		"Gnt.column.LateEndDate": {
			text: "Late Finish"
		},
		"Gnt.field.Calendar": {
			calendarNotApplicable: "Task calendar has no overlapping with assigned resources calendars"
		},
		"Gnt.column.Slack": {
			text: "Slack"
		},
		"Gnt.column.Name": {
			text: "Task Name"
		},
		"Gnt.column.BaselineStartDate": {
			text: "Baseline Start Date"
		},
		"Gnt.column.BaselineEndDate": {
			text: "Baseline End Date"
		},
		"Gnt.column.Milestone": {
			text: "Milestone"
		},
		"Gnt.field.Milestone": {
			yes: "Yes",
			no: "No"
		}
	}
});
Ext.define("Gnt.mixin.Localizable", {
	extend: "Sch.mixin.Localizable",
	requires: [typeof Sch != "undefined" && Sch.config && Sch.config.locale || "Gnt.locale.En"]
});
Ext.define("Gnt.model.CalendarDay", {
	requires: ["Ext.data.Types"],
	extend: "Sch.model.Customizable",
	idProperty: "Id",
	customizableFields: [{
		name: "Date",
		type: "date",
		dateFormat: "c",
		convert: function(b, a) {
			if (!b) {
				return
			}
			var c = Ext.data.Types.DATE.convert.call(this, b);
			if (c) {
				Ext.Date.clearTime(c)
			}
			return c
		}
	},
	{
		name: "Weekday",
		type: "int"
	},
	{
		name: "OverrideStartDate",
		type: "date",
		dateFormat: "c"
	},
	{
		name: "OverrideEndDate",
		type: "date",
		dateFormat: "c"
	},
	{
		name: "Type",
		defaultValue: "DAY"
	},
	{
		name: "Id"
	},
	{
		name: "IsWorkingDay",
		type: "boolean",
		defaultValue: false
	},
	{
		name: "Cls",
		defaultValue: "gnt-holiday"
	},
	"Name", {
		name: "Availability",
		convert: function(b, a) {
			if (b) {
				return Ext.typeOf(b) === "string" ? [b] : b
			} else {
				return []
			}
		}
	}],
	availabilityCache: null,
	weekDayField: "Weekday",
	overrideStartDateField: "OverrideStartDate",
	overrideEndDateField: "OverrideEndDate",
	typeField: "Type",
	dateField: "Date",
	isWorkingDayField: "IsWorkingDay",
	clsField: "Cls",
	nameField: "Name",
	availabilityField: "Availability",
	setDate: function(a) {
		if (a) {
			a = Ext.Date.clearTime(a, true)
		}
		this.set(this.dateField, a)
	},
	clearDate: function() {
		this.set(this.dateField, null)
	},
	getAvailability: function(b) {
		var c = this;
		if (b) {
			return this.get(this.availabilityField)
		}
		if (this.availabilityCache) {
			return this.availabilityCache
		}
		var a = [];
		Ext.Array.each(this.get(this.availabilityField),
		function(d) {
			a.push(Ext.typeOf(d) === "string" ? c.parseInterval(d) : d)
		});
		this.verifyAvailability(a);
		return this.availabilityCache = a
	},
	setAvailability: function(a) {
		this.availabilityCache = null;
		this.set(this.availabilityField, this.stringifyIntervals(a));
		this.getAvailability()
	},
	verifyAvailability: function(b) {
		b.sort(function(f, e) {
			return f.startTime - e.startTime
		});
		Ext.Array.each(b,
		function(e) {
			if (e.startTime > e.endTime) {
				throw new Error("Start time " + Ext.Date.format(e.startTime, "H:i") + " is greater than end time " + Ext.Date.format(e.endTime, "H:i"))
			}
		});
		for (var a = 1; a < b.length; a++) {
			var c = b[a - 1];
			var d = b[a];
			if (c.endTime > d.startTime) {
				throw new Error("Availability intervals should not intersect: [" + this.stringifyInterval(c) + "] and [" + this.stringifyInterval(d) + "]")
			}
		}
	},
	prependZero: function(a) {
		return a < 10 ? "0" + a: a
	},
	stringifyInterval: function(b) {
		var c = b.startTime;
		var a = b.endTime;
		return this.prependZero(c.getHours()) + ":" + this.prependZero(c.getMinutes()) + "-" + this.prependZero(a.getHours()) + ":" + this.prependZero(a.getMinutes())
	},
	stringifyIntervals: function(b) {
		var c = this;
		var a = [];
		Ext.Array.each(b,
		function(d) {
			if (Ext.typeOf(d) === "string") {
				a.push(d)
			} else {
				a.push(c.stringifyInterval(d))
			}
		});
		return a
	},
	parseInterval: function(b) {
		var a = /(\d\d):(\d\d)-(\d\d):(\d\d)/.exec(b);
		if (!a) {
			throw "Invalid format for availability string: " + b + ". It should have exact format: hh:mm-hh:mm"
		}
		return {
			startTime: new Date(0, 0, 0, a[1], a[2]),
			endTime: new Date(0, 0, 0, a[3], a[4])
		}
	},
	getTotalHours: function() {
		return this.getTotalMS() / 1000 / 60 / 60
	},
	getTotalMS: function() {
		var a = 0;
		Ext.Array.each(this.getAvailability(),
		function(b) {
			a += b.endTime - b.startTime
		});
		return a
	},
	addAvailabilityInterval: function(d, b) {
		var a;
		if (d instanceof Date) {
			a = {
				startTime: d,
				endTime: b
			}
		} else {
			a = this.parseInterval(d + (b ? "-" + b: ""))
		}
		var c = this.getAvailability().concat(a);
		this.verifyAvailability(c);
		this.setAvailability(c)
	},
	removeAvailbilityInterval: function(a) {
		var b = this.getAvailability();
		b.splice(a, 1);
		this.setAvailability(b)
	},
	getAvailabilityIntervalsFor: function(d) {
		d = typeof d == "number" ? new Date(d) : d;
		var c = d.getFullYear();
		var e = d.getMonth();
		var b = d.getDate();
		var a = [];
		Ext.Array.each(this.getAvailability(),
		function(f) {
			var g = f.endTime.getDate();
			a.push({
				startDate: new Date(c, e, b, f.startTime.getHours(), f.startTime.getMinutes()),
				endDate: new Date(c, e, b + (g == 1 ? 1: 0), f.endTime.getHours(), f.endTime.getMinutes())
			})
		});
		return a
	},
	getAvailabilityStartFor: function(b) {
		var a = this.getAvailabilityIntervalsFor(b);
		if (!a.length) {
			return null
		}
		return a[0].startDate
	},
	getAvailabilityEndFor: function(b) {
		var a = this.getAvailabilityIntervalsFor(b);
		if (!a.length) {
			return null
		}
		return a[a.length - 1].endDate
	}
});
Ext.define("Gnt.model.Assignment", {
	extend: "Sch.model.Customizable",
	idProperty: "Id",
	customizableFields: [{
		name: "Id"
	},
	{
		name: "ResourceId"
	},
	{
		name: "TaskId"
	},
	{
		name: "Units",
		type: "float",
		defaultValue: 100
	}],
	resourceIdField: "ResourceId",
	taskIdField: "TaskId",
	unitsField: "Units",
	isPersistable: function() {
		var a = this.getTask(),
		b = this.getResource();
		return a && !a.phantom && b && !b.phantom
	},
	getUnits: function() {
		return Math.max(0, this.get(this.unitsField))
	},
	setUnits: function(a) {
		if (a < 0) {
			throw "`Units` value for an assignment can't be less than 0"
		}
		this.set(this.unitsField, a)
	},
	getResourceName: function() {
		var a = this.getResource();
		if (a) {
			return a.getName()
		}
		return ""
	},
	getTask: function(a) {
		return (a || this.stores[0].getTaskStore()).getByInternalId(this.getTaskId())
	},
	getResource: function() {
		return this.stores[0].getResourceStore().getByInternalId(this.getResourceId())
	},
	getInternalId: function() {
		return this.getId() || this.internalId
	},
	getEffort: function(b) {
		var a = this.getTask();
		var c = 0;
		a.forEachAvailabilityIntervalWithResources({
			startDate: a.getStartDate(),
			endDate: a.getEndDate(),
			resources: [this.getResource()]
		},
		function(g, f, e) {
			var h;
			for (var d in e) {
				h = e[d].units
			}
			c += (f - g) * h / 100
		});
		return a.getProjectCalendar().convertMSDurationToUnit(c, b || a.getEffortUnit())
	}
});
Ext.define("Gnt.model.Dependency", {
	extend: "Sch.model.Customizable",
	inheritableStatics: {
		Type: {
			StartToStart: 0,
			StartToEnd: 1,
			EndToStart: 2,
			EndToEnd: 3
		}
	},
	idProperty: "Id",
	customizableFields: [{
		name: "Id"
	},
	{
		name: "From"
	},
	{
		name: "To"
	},
	{
		name: "Type",
		type: "int",
		defaultValue: 2
	},
	{
		name: "Lag",
		type: "number",
		defaultValue: 0
	},
	{
		name: "LagUnit",
		type: "string",
		defaultValue: "d",
		convert: function(a) {
			return a || "d"
		}
	},
	{
		name: "Cls"
	}],
	fromField: "From",
	toField: "To",
	typeField: "Type",
	lagField: "Lag",
	lagUnitField: "LagUnit",
	clsField: "Cls",
	fromTask: null,
	toTask: null,
	isHighlighted: false,
	constructor: function(a) {
		this.callParent(arguments);
		if (a) {
			if (a.fromTask) {
				if (a.fromTask instanceof Gnt.model.Task) {
					this.setSourceTask(a.fromTask)
				} else {
					this.setSourceId(a.fromTask)
				}
			}
			if (a.toTask) {
				if (a.toTask instanceof Gnt.model.Task) {
					this.setTargetTask(a.toTask)
				} else {
					this.setTargetId(a.toTask)
				}
			}
			if (Ext.isDefined(a.type)) {
				this.setType(a.type)
			}
			if (Ext.isDefined(a.lag)) {
				this.setLag(a.lag)
			}
			if (Ext.isDefined(a.lagUnit)) {
				this.setLagUnit(a.lagUnit)
			}
		}
	},
	getTaskStore: function() {
		return this.stores[0].taskStore
	},
	getSourceTask: function(a) {
		return (a || this.getTaskStore()).getById(this.getSourceId())
	},
	setSourceTask: function(a) {
		this.setSourceId(a.getId() || a.internalId)
	},
	getTargetTask: function(a) {
		return (a || this.getTaskStore()).getById(this.getTargetId())
	},
	setTargetTask: function(a) {
		this.setTargetId(a.getId() || a.internalId)
	},
	getSourceId: function() {
		return this.get(this.fromField)
	},
	setSourceId: function(a) {
		this.set(this.fromField, a)
	},
	getTargetId: function() {
		return this.get(this.toField)
	},
	setTargetId: function(a) {
		this.set(this.toField, a)
	},
	getLagUnit: function() {
		return this.get(this.lagUnitField) || "d"
	},
	isPersistable: function() {
		var a = this.getSourceTask(),
		b = this.getTargetTask();
		return a && !a.phantom && b && !b.phantom
	},
	isValid: function(b) {
		var d = this.callParent(arguments),
		e = this.getSourceId(),
		a = this.getTargetId(),
		c = this.getType();
		if (d) {
			d = Ext.isNumber(c) && !Ext.isEmpty(e) && !Ext.isEmpty(a) && e != a
		}
		if (d && b !== false && this.stores[0]) {
			d = this.stores[0].isValidDependency(e, a, c, true)
		}
		return d
	}
});
Ext.define("Gnt.model.Resource", {
	extend: "Sch.model.Resource",
	customizableFields: ["CalendarId"],
	calendarIdField: "CalendarId",
	normalized: false,
	calendarWaitingListener: null,
	getTaskStore: function() {
		return this.stores[0].getTaskStore()
	},
	getEventStore: function() {
		return this.getTaskStore()
	},
	getEvents: function() {
		return this.getTasks()
	},
	getTasks: function() {
		var a = [];
		this.forEachAssignment(function(b) {
			var c = b.getTask();
			if (c) {
				a.push(c)
			}
		});
		return a
	},
	getCalendar: function(a) {
		return a ? this.getOwnCalendar() : this.getOwnCalendar() || this.getProjectCalendar()
	},
	getOwnCalendar: function() {
		var a = this.getCalendarId();
		return a ? Gnt.data.Calendar.getCalendar(a) : null
	},
	getProjectCalendar: function() {
		return this.stores[0].getTaskStore().getCalendar()
	},
	setCalendar: function(b) {
		var a = b instanceof Gnt.data.Calendar;
		if (a && !b.calendarId) {
			throw new Error("Can't set calendar w/o `calendarId` property")
		}
		this.setCalendarId(a ? b.calendarId: b)
	},
	setCalendarId: function(c, d) {
		if (c instanceof Gnt.data.Calendar) {
			c = c.calendarId
		}
		var b = this.getCalendarId();
		if (b != c || d) {
			if (this.calendarWaitingListener) {
				this.calendarWaitingListener.destroy();
				this.calendarWaitingListener = null
			}
			var a = {
				calendarchange: this.adjustToCalendar,
				scope: this
			};
			var f = this.calendar || Gnt.data.Calendar.getCalendar(b);
			this.calendar = null;
			f && f.un(a);
			this.set(this.calendarIdField, c);
			var e = Gnt.data.Calendar.getCalendar(c);
			if (e) {
				e.on(a);
				if (!d) {
					this.adjustToCalendar()
				}
			} else {
				this.calendarWaitingListener = Ext.data.StoreManager.on("add",
				function(g, i, h) {
					e = Gnt.data.Calendar.getCalendar(c);
					if (e) {
						this.calendarWaitingListener.destroy();
						this.calendarWaitingListener = null;
						e.on(a);
						this.adjustToCalendar()
					}
				},
				this, {
					destroyable: true
				})
			}
		}
	},
	adjustToCalendar: function() {
		this.forEachTask(function(a) {
			a.adjustToCalendar()
		})
	},
	getInternalId: function() {
		return this.getId() || this.internalId
	},
	assignTo: function(a, c) {
		var b = a instanceof Gnt.model.Task ? a: this.getTaskStore().getById(a);
		return b.assign(this, c)
	},
	unassignFrom: function() {
		return this.unAssignFrom.apply(this, arguments)
	},
	unAssignFrom: function(a) {
		var b = a instanceof Gnt.model.Task ? a: this.getTaskStore().getById(a);
		b.unAssign(this)
	},
	forEachAssignment: function(b, a) {
		a = a || this;
		var c = this.getInternalId();
		this.getTaskStore().getAssignmentStore().each(function(d) {
			if (d.getResourceId() == c) {
				return b.call(a, d)
			}
		})
	},
	forEachTask: function(b, a) {
		a = a || this;
		var c = this.getInternalId();
		this.getTaskStore().getAssignmentStore().each(function(e) {
			if (e.getResourceId() == c) {
				var d = e.getTask();
				if (d) {
					return b.call(a, d)
				}
			}
		})
	},
	collectAvailabilityIntervalPoints: function(h, i, b, m, e) {
		var d = Ext.isFunction(i) ?
		function(k) {
			m[k].push(i(k))
		}: function(k) {
			m[k].push(i)
		};
		var g = Ext.isFunction(b) ?
		function(k) {
			m[k].push(b(k))
		}: function(k) {
			m[k].push(b)
		};
		for (var f = 0, c = h.length; f < c; f++) {
			var a = h[f];
			var j = a.startDate - 0;
			var n = a.endDate - 0;
			if (!m[j]) {
				m[j] = [];
				e.push(j)
			}
			d(j);
			if (!m[n]) {
				m[n] = [];
				e.push(n)
			}
			g(n)
		}
	},
	forEachAvailabilityIntervalWithTasks: function(f, h, b) {
		b = b || this;
		var e = f.startDate;
		var A = f.endDate;
		if (!e || !A) {
			throw "Both `startDate` and `endDate` are required for `forEachAvailabilityIntervalWithTasks`"
		}
		var m = new Date(e);
		var C = f.includeAllIntervals;
		var B = f.includeResCalIntervals;
		var t = this.getCalendar();
		var q = [];
		var r = [];
		var c = [];
		var G = [e - 0, A - 0];
		var o = {};
		o[e - 0] = [{
			type: "00-intervalStart"
		}];
		o[A - 0] = [{
			type: "00-intervalEnd"
		}];
		this.forEachAssignment(function(H) {
			var j = H.getTask();
			if (!j) {
				return
			}
			var i = j.getStartDate();
			var l = j.getEndDate();
			var k = j.getInternalId();
			if (i > A || l < e) {
				return
			}
			r.push(j);
			c.push(j.getCalendar());
			this.collectAvailabilityIntervalPoints([{
				startDate: i,
				endDate: l
			}], {
				type: "04-taskStart",
				assignment: H,
				taskId: k,
				units: H.getUnits()
			},
			{
				type: "05-taskEnd",
				taskId: k
			},
			o, G);
			q.push(H)
		});
		if (!r.length && !C && !B) {
			return
		}
		var g = Sch.util.Date;
		var z,
		u,
		d;
		while (m < A) {
			this.collectAvailabilityIntervalPoints(t.getAvailabilityIntervalsFor(m), {
				type: "00-resourceAvailabilityStart"
			},
			{
				type: "01-resourceAvailabilityEnd"
			},
			o, G);
			for (z = 0, u = c.length; z < u; z++) {
				d = r[z].getInternalId();
				this.collectAvailabilityIntervalPoints(c[z].getAvailabilityIntervalsFor(m), {
					type: "02-taskAvailabilityStart",
					taskId: d
				},
				{
					type: "03-taskAvailabilityEnd",
					taskId: d
				},
				o, G)
			}
			m = g.getStartOfNextDay(m)
		}
		G.sort();
		var E = false;
		var D = {};
		var a = 0;
		var y = 0;
		for (z = 0, u = G.length - 1; z < u; z++) {
			var x = o[G[z]];
			x.sort(function(j, i) {
				return j.type < i.type
			});
			for (var v = 0, w = x.length; v < w; v++) {
				var s = x[v];
				switch (s.type) {
				case "00-resourceAvailabilityStart":
					E = true;
					break;
				case "01-resourceAvailabilityEnd":
					E = false;
					break;
				case "02-taskAvailabilityStart":
					a++;
					break;
				case "03-taskAvailabilityEnd":
					a--;
					break;
				case "04-taskStart":
					D[s.taskId] = s;
					y++;
					break;
				case "05-taskEnd":
					delete D[s.taskId];
					y--;
					break
				}
			}
			if (C || B && E || E && a && y) {
				var p = {
					inResourceCalendar: !!E,
					inTasksCalendar: !!a,
					inTask: y
				};
				var F = G[z];
				var n = G[z + 1];
				if (F > A || n < e) {
					continue
				}
				if (F < e) {
					F = e - 0
				}
				if (n > A) {
					n = A - 0
				}
				if (h.call(b, F, n, D, p) === false) {
					return false
				}
			}
		}
	},
	getAllocationInfo: function(a) {
		var b = [];
		this.forEachAvailabilityIntervalWithTasks(a,
		function(j, h, g, k) {
			var f = 0,
			d = [],
			c = {};
			if (k.inResourceCalendar && k.inTasksCalendar && k.inTask) {
				for (var e in g) {
					f += g[e].units;
					d.push(g[e].assignment);
					c[e] = g[e].assignment
				}
			}
			b.push(Ext.apply({
				startDate: new Date(j),
				endDate: new Date(h),
				totalAllocation: f,
				assignments: d,
				assignmentsHash: c
			},
			k))
		});
		return b
	}
});
Ext.define("Gnt.model.task.More", {
	indent: function() {
		var b = this.previousSibling;
		if (b) {
			b.appendChild(this);
			var a = b.getDependencyStore(),
			c = b.getAllDependencies(a);
			if (c.length) {
				a.remove(c)
			}
			b.set("leaf", false);
			b.expand()
		}
	},
	outdent: function() {
		var a = this.parentNode;
		if (a && !a.isRoot()) {
			if (this.convertEmptyParentToLeaf) {
				a.set("leaf", a.childNodes.length === 1)
			}
			if (a.nextSibling) {
				a.parentNode.insertBefore(this, a.nextSibling)
			} else {
				a.parentNode.appendChild(this)
			}
			if (this.getTaskStore().recalculateParents && a.childNodes.length) {
				a.childNodes[0].recalculateParents()
			}
		}
	},
	getAllDependencies: function(a) {
		a = a || this.getDependencyStore();
		return a.getDependenciesForTask(this)
	},
	hasIncomingDependencies: function(a) {
		var c = this.getId() || this.internalId;
		a = a || this.getDependencyStore();
		var b = a.findBy(function(d) {
			return d.getTargetId() == c
		});
		return b >= 0
	},
	hasOutgoingDependencies: function(a) {
		var c = this.getId() || this.internalId;
		a = a || this.getDependencyStore();
		var b = a.findBy(function(d) {
			return d.getSourceId() == c
		});
		return b >= 0
	},
	getIncomingDependencies: function(a) {
		a = a || this.getDependencyStore();
		return a.getIncomingDependenciesForTask(this)
	},
	getOutgoingDependencies: function(a) {
		a = a || this.getDependencyStore();
		return a.getOutgoingDependenciesForTask(this)
	},
	constrain: function(c) {
		if (this.isManuallyScheduled()) {
			return false
		}
		var e = false;
		c = c || this.getTaskStore();
		var b = this.getConstrainContext(c);
		if (b) {
			var a = b.startDate;
			var d = b.endDate;
			if (a && a - this.getStartDate() !== 0) {
				this.setStartDate(a, true, c.skipWeekendsDuringDragDrop);
				e = true
			} else {
				if (d && d - this.getEndDate() !== 0) {
					this.setEndDate(d, true, c.skipWeekendsDuringDragDrop);
					e = true
				}
			}
		}
		return e
	},
	getConstrainContext: function(c) {
		var b = this.getIncomingDependencies();
		if (!b.length) {
			return null
		}
		var g = Gnt.model.Dependency.Type,
		d = new Date(0),
		e = new Date(0),
		f = this.getProjectCalendar(),
		a;
		Ext.each(b,
		function(j) {
			var i = j.getSourceTask();
			if (i) {
				var m = j.getLag() || 0,
				k = j.getLagUnit(),
				l = i.getStartDate(),
				h = i.getEndDate();
				switch (j.getType()) {
				case g.StartToEnd:
					l = f.skipWorkingTime(l, m, k);
					if (e < l) {
						e = l;
						a = i
					}
					break;
				case g.StartToStart:
					l = f.skipWorkingTime(l, m, k);
					if (d < l) {
						d = l;
						a = i
					}
					break;
				case g.EndToStart:
					h = f.skipWorkingTime(h, m, k);
					if (d < h) {
						d = h;
						a = i
					}
					break;
				case g.EndToEnd:
					h = f.skipWorkingTime(h, m, k);
					if (e < h) {
						e = h;
						a = i
					}
					break;
				default:
					throw "Invalid dependency type: " + j.getType()
				}
			}
		});
		return {
			startDate: d > 0 ? d: null,
			endDate: e > 0 ? e: null,
			constrainingTask: a
		}
	},
	getCriticalPaths: function() {
		var b = [this],
		a = this.getConstrainContext();
		while (a) {
			b.push(a.constrainingTask);
			a = a.constrainingTask.getConstrainContext()
		}
		return b
	},
	cascadeChanges: function(a, b, c) {
		a = a || this.getTaskStore();
		var d;
		if (this.isLeaf()) {
			d = this.constrain(a);
			if (d) {
				this.recalculateParents();
				b.nbrAffected++
			}
		}
		if (d) {
			Ext.each(this.getOutgoingDependencies(),
			function(e) {
				var f = e.getTargetTask();
				if (f && !f.isManuallyScheduled()) {
					f.cascadeChanges(a, b, e)
				}
			})
		}
	},
	addSubtask: function(a) {
		this.set("leaf", false);
		this.appendChild(a);
		this.expand();
		return a
	},
	addSuccessor: function(b) {
		var d = this.getTaskStore(),
		c = this.getDependencyStore();
		b = b || new this.self();
		b.calendar = b.calendar || this.getCalendar();
		b.taskStore = d;
		b.setStartDate(this.getEndDate(), true, d.skipWeekendsDuringDragDrop);
		b.setDuration(1, Sch.util.Date.DAY);
		this.addTaskBelow(b);
		var a = new c.model({
			fromTask: this,
			toTask: b,
			type: c.model.Type.EndToStart
		});
		c.add(a);
		return b
	},
	addMilestone: function(c) {
		var b = this.getTaskStore();
		c = c || new this.self();
		var a = this.getEndDate();
		if (a) {
			c.calendar = c.calendar || this.getCalendar();
			c.setStartEndDate(a, a, b.skipWeekendsDuringDragDrop)
		}
		return this.addTaskBelow(c)
	},
	addPredecessor: function(c) {
		var b = this.getDependencyStore();
		c = c || new this.self();
		c.calendar = c.calendar || this.getCalendar();
		c.beginEdit();
		c.set(this.startDateField, c.calculateStartDate(this.getStartDate(), 1, Sch.util.Date.DAY));
		c.set(this.endDateField, this.getStartDate());
		c.set(this.durationField, 1);
		c.set(this.durationUnitField, Sch.util.Date.DAY);
		c.endEdit();
		this.addTaskAbove(c);
		var a = new b.model({
			fromTask: c,
			toTask: this,
			type: b.model.Type.EndToStart
		});
		b.add(a);
		return c
	},
	getSuccessors: function() {
		var g = this.getId() || this.internalId;
		var d = d || this.getDependencyStore();
		var f = [];
		for (var e = 0, a = d.getCount(); e < a; e++) {
			var c = d.getAt(e);
			if (c.getSourceId() == g) {
				var b = c.getTargetTask();
				if (b) {
					f.push(b)
				}
			}
		}
		return f
	},
	getPredecessors: function() {
		var g = this.getId() || this.internalId;
		var d = d || this.getDependencyStore();
		var f = [];
		for (var e = 0, a = d.getCount(); e < a; e++) {
			var c = d.getAt(e);
			if (c.getTargetId() == g) {
				var b = c.getSourceTask();
				if (b) {
					f.push(b)
				}
			}
		}
		return f
	},
	addTaskAbove: function(a) {
		a = a || new this.self();
		return this.parentNode.insertBefore(a, this)
	},
	addTaskBelow: function(a) {
		a = a || new this.self();
		if (this.nextSibling) {
			return this.parentNode.insertBefore(a, this.nextSibling)
		} else {
			return this.parentNode.appendChild(a)
		}
	},
	isAbove: function(a) {
		var b = this,
		d = Math.min(b.data.depth, a.data.depth);
		var c = this;
		while (c.data.depth > d) {
			c = c.parentNode;
			if (c == a) {
				return false
			}
		}
		while (a.data.depth > d) {
			a = a.parentNode;
			if (a == b) {
				return true
			}
		}
		while (a.parentNode !== c.parentNode) {
			a = a.parentNode;
			c = c.parentNode
		}
		return a.data.index > c.data.index
	},
	cascadeChildren: function(b, a) {
		var c = this;
		if (c.isLeaf()) {
			return
		}
		this.cascadeBy(function(d) {
			if (d !== c) {
				return b.call(a || d, d)
			}
		})
	},
	getViolatedConstraints: function() {
		if (!this.get("leaf") || this.isManuallyScheduled()) {
			return false
		}
		var a = this.getEarlyStartDate();
		if (this.getStartDate() < a) {
			return [{
				task: this,
				startDate: a
			}]
		}
		return null
	},
	resolveViolatedConstraints: function(e) {
		e = e || this.getViolatedConstraints();
		if (!e) {
			return
		}
		if (!Ext.isArray(e)) {
			e = [e]
		}
		var b = this.getTaskStore();
		for (var c, d = 0, a = e.length; d < a; d++) {
			c = e[d];
			if (c.startDate) {
				c.task.setStartDate(c.startDate, true, b.skipWeekendsDuringDragDrop)
			} else {
				if (c.endDate) {
					c.task.setEndDate(c.endDate, true, b.skipWeekendsDuringDragDrop)
				}
			}
		}
	},
	getSlack: function(b) {
		b = b || Sch.util.Date.DAY;
		var c = this.getEarlyStartDate(),
		a = this.getLateStartDate();
		if (!c || !a) {
			return null
		}
		return this.getCalendar().calculateDuration(this.getEarlyStartDate(), this.getLateStartDate(), b)
	},
	getEarlyStartDate: function() {
		var k = this.getTaskStore();
		if (!k) {
			return this.getEndDate()
		}
		var h = this.internalId;
		if (k.earlyStartDates[h]) {
			return k.earlyStartDates[h]
		}
		var b,
		n = 0,
		f,
		e;
		if (this.childNodes.length) {
			for (f = 0, e = this.childNodes.length; f < e; f++) {
				b = this.childNodes[f].getEarlyStartDate();
				if (b < n || !n) {
					n = b
				}
			}
			k.earlyStartDates[h] = n;
			return n
		}
		if (this.isManuallyScheduled()) {
			n = k.earlyStartDates[h] = this.getStartDate();
			return n
		}
		var m = this.getIncomingDependencies(),
		j;
		if (!m.length) {
			n = k.earlyStartDates[h] = this.getStartDate();
			return n
		}
		var g = Gnt.model.Dependency.Type,
		a = this.getCalendar(),
		d = this.getProjectCalendar(),
		c;
		for (f = 0, e = m.length; f < e; f++) {
			j = m[f].getSourceTask();
			if (j) {
				switch (m[f].getType()) {
				case g.StartToStart:
					b = j.getEarlyStartDate();
					break;
				case g.StartToEnd:
					b = j.getEarlyStartDate();
					b = a.calculateStartDate(b, this.getDuration(), this.getDurationUnit());
					break;
				case g.EndToStart:
					b = j.getEarlyEndDate();
					break;
				case g.EndToEnd:
					b = j.getEarlyEndDate();
					b = a.calculateStartDate(b, this.getDuration(), this.getDurationUnit());
					break
				}
				c = m[f].getLag();
				if (c) {
					b = d.skipWorkingTime(b, c, m[f].getLagUnit())
				}
				b = d.skipNonWorkingTime(b, true)
			}
			if (b > n) {
				n = b
			}
		}
		k.earlyStartDates[h] = n;
		return k.earlyStartDates[h]
	},
	getEarlyEndDate: function() {
		var d = this.getTaskStore();
		if (!d) {
			return this.getEndDate()
		}
		var c = this.internalId;
		if (d.earlyEndDates[c]) {
			return d.earlyEndDates[c]
		}
		var a = 0;
		if (this.childNodes.length) {
			var f,
			e,
			b;
			for (e = 0, b = this.childNodes.length; e < b; e++) {
				f = this.childNodes[e].getEarlyEndDate();
				if (f > a) {
					a = f
				}
			}
			d.earlyEndDates[c] = a;
			return a
		}
		if (this.isManuallyScheduled()) {
			a = d.earlyEndDates[c] = this.getEndDate();
			return a
		}
		var g = this.getEarlyStartDate();
		if (!g) {
			return null
		}
		a = d.earlyEndDates[c] = this.getCalendar().calculateEndDate(g, this.getDuration(), this.getDurationUnit());
		return a
	},
	getLateEndDate: function() {
		var k = this.getTaskStore();
		if (!k) {
			return this.getEndDate()
		}
		var j = this.internalId;
		if (k.lateEndDates[j]) {
			return k.lateEndDates[j]
		}
		var b,
		n = 0,
		g,
		e;
		if (this.childNodes.length) {
			for (g = 0, e = this.childNodes.length; g < e; g++) {
				b = this.childNodes[g].getLateEndDate();
				if (b > n) {
					n = b
				}
			}
			k.lateEndDates[j] = n;
			return n
		}
		if (this.isManuallyScheduled()) {
			n = k.lateEndDates[j] = this.getEndDate();
			return n
		}
		var m = this.getOutgoingDependencies();
		if (!m.length) {
			n = k.lateEndDates[j] = k.getProjectEndDate();
			return n
		}
		var h = Gnt.model.Dependency.Type,
		a = this.getCalendar(),
		d = this.getProjectCalendar(),
		f,
		c;
		for (g = 0, e = m.length; g < e; g++) {
			f = m[g].getTargetTask();
			if (f) {
				switch (m[g].getType()) {
				case h.StartToStart:
					b = f.getLateStartDate();
					b = a.calculateEndDate(b, this.getDuration(), this.getDurationUnit());
					break;
				case h.StartToEnd:
					b = f.getLateEndDate();
					b = a.calculateEndDate(b, this.getDuration(), this.getDurationUnit());
					break;
				case h.EndToStart:
					b = f.getLateStartDate();
					break;
				case h.EndToEnd:
					b = f.getLateEndDate();
					break
				}
				c = m[g].getLag();
				if (c) {
					b = d.skipWorkingTime(b, -c, m[g].getLagUnit())
				}
				b = d.skipNonWorkingTime(b, false);
				if (b < n || !n) {
					n = b
				}
			}
		}
		k.lateEndDates[j] = n || k.getProjectEndDate();
		return k.lateEndDates[j]
	},
	getLateStartDate: function() {
		var d = this.getTaskStore();
		if (!d) {
			return this.getStartDate()
		}
		var c = this.internalId;
		if (d.lateStartDates[c]) {
			return d.lateStartDates[c]
		}
		var a;
		if (this.childNodes.length) {
			var f,
			e,
			b;
			for (e = 0, b = this.childNodes.length; e < b; e++) {
				f = this.childNodes[e].getLateStartDate();
				if (f < a || !a) {
					a = f
				}
			}
			d.lateStartDates[c] = a;
			return a
		}
		if (this.isManuallyScheduled()) {
			a = d.lateStartDates[c] = this.getStartDate();
			return a
		}
		var g = this.getLateEndDate();
		if (!g) {
			return null
		}
		a = d.lateStartDates[c] = this.getCalendar().calculateStartDate(g, this.getDuration(), this.getDurationUnit());
		return a
	},
	resetEarlyDates: function() {
		var b = this.getTaskStore();
		if (!b) {
			return
		}
		var a = this.internalId;
		b.earlyStartDates[a] = null;
		b.earlyEndDates[a] = null
	},
	resetLateDates: function() {
		var b = this.getTaskStore();
		if (!b) {
			return
		}
		var a = this.internalId;
		b.lateStartDates[a] = null;
		b.lateEndDates[a] = null
	},
	getTopParent: function() {
		var b = this.getTaskStore().getRootNode(),
		c = this,
		a;
		while (c) {
			if (c === b) {
				return a
			}
			a = c;
			c = c.parentNode
		}
	}
});
Ext.define("Gnt.model.Task", {
	extend: "Sch.model.Range",
	requires: ["Sch.util.Date", "Ext.data.NodeInterface"],
	mixins: ["Gnt.model.task.More"],
	idProperty: "Id",
	customizableFields: [{
		name : 'fakeId'
	}, {
		name: "Id"
	},
	{
		name: "Duration",
		type: "number",
		useNull: true
	},
	{
		name: "Effort",
		type: "number",
		useNull: true
	},
	{
		name: "EffortUnit",
		type: "string",
		defaultValue: "h"
	},
	{
		name: "CalendarId",
		type: "string"
	},
	{
		name: "Note",
		type: "string"
	},
	{
		name: "DurationUnit",
		type: "string",
		defaultValue: "d",
		convert: function(a) {
			return a || "d"
		}
	},
	{
		name: "PercentDone",
		type: "number",
		defaultValue: 0
	},
	{
		name: "ManuallyScheduled",
		type: "boolean",
		defaultValue: false
	},
	{
		name: "SchedulingMode",
		type: "string",
		defaultValue: "Normal"
	},
	{
		name: "BaselineStartDate",
		type: "date",
		dateFormat: "c"
	},
	{
		name: "BaselineEndDate",
		type: "date",
		dateFormat: "c"
	},
	{
		name: "BaselinePercentDone",
		type: "int",
		defaultValue: 0
	},
	{
		name: "Draggable",
		type: "boolean",
		persist: false,
		defaultValue: true
	},
	{
		name: "Resizable",
		persist: false
	},
	{
		name: "PhantomId",
		type: "string"
	},
	{
		name: "PhantomParentId",
		type: "string"
	},
	{
		name: "index",
		type: "int",
		persist: true
	}],
	draggableField: "Draggable",
	resizableField: "Resizable",
	nameField: "Name",
	durationField: "Duration",
	durationUnitField: "DurationUnit",
	effortField: "Effort",
	effortUnitField: "EffortUnit",
	percentDoneField: "PercentDone",
	manuallyScheduledField: "ManuallyScheduled",
	schedulingModeField: "SchedulingMode",
	calendarIdField: "CalendarId",
	baselineStartDateField: "BaselineStartDate",
	baselineEndDateField: "BaselineEndDate",
	baselinePercentDoneField: "BaselinePercentDone",
	noteField: "Note",
	calendar: null,
	dependencyStore: null,
	taskStore: null,
	phantomIdField: "PhantomId",
	phantomParentIdField: "PhantomParentId",
	normalized: false,
	recognizedSchedulingModes: ["Normal", "Manual", "FixedDuration", "EffortDriven", "DynamicAssignment"],
	convertEmptyParentToLeaf: true,
	autoCalculateEffortForParentTask: true,
	autoCalculatePercentDoneForParentTask: true,
	isHighlighted: false,
	calendarWaitingListener: null,
	childTasksDuration: null,
	completedChildTasksDuration: null,
	constructor: function() {
		this.callParent(arguments);
		if (this.phantom) {
			this.data[this.phantomIdField] = this.internalId;
			this._phantomId = this.internalId
		}
	},
	normalize: function() {
		var c = this.getDuration(),
		g = this.getDurationUnit(),
		b = this.getStartDate(),
		f = this.getEndDate(),
		e = this.getSchedulingMode(),
		d = this.data;
		if (f && this.inclusiveEndDate) {
			var i = this.fields.getByKey(this.endDateField).dateFormat;
			var a = (i && !Ext.Date.formatContainsHourInfo(i)) || (f.getHours() === 0 && f.getMinutes() === 0 && f.getSeconds() === 0 && f.getMilliseconds() === 0);
			if (a) {
				if (Ext.isNumber(c)) {
					f = d[this.endDateField] = this.calculateEndDate(b, c, g)
				} else {
					f = d[this.endDateField] = Ext.Date.add(f, Ext.Date.DAY, 1)
				}
			}
		}
		if (c == null && b && f) {
			c = d[this.durationField] = this.calculateDuration(b, f, g)
		}
		if ((e == "Normal" || this.isManuallyScheduled()) && f == null && b && Ext.isNumber(c)) {
			f = d[this.endDateField] = this.calculateEndDate(b, c, g)
		}
		var k = this.get(this.effortField),
		h = this.getEffortUnit();
		if (e == "FixedDuration") {
			if (f == null && b && Ext.isNumber(c)) {
				f = d[this.endDateField] = this.calculateEndDate(b, c, g)
			}
			if (k == null && b && f) {
				d[this.effortField] = this.calculateEffort(b, f, h)
			}
		} else {
			if (e == "EffortDriven") {
				if (k == null && b && f) {
					d[this.effortField] = this.calculateEffort(b, f, h)
				}
				if (f == null && b && k) {
					d[this.endDateField] = this.calculateEffortDrivenEndDate(b, k, h);
					if (c == null) {
						d[this.durationField] = this.calculateDuration(b, d[this.endDateField], g)
					}
				}
			} else {
				if (f == null && b && Ext.isNumber(c)) {
					f = d[this.endDateField] = this.calculateEndDate(b, c, g)
				}
			}
		}
		var j = this.getCalendarId();
		if (j) {
			this.setCalendarId(j, true)
		}
		this.normalized = true
	},
	normalizeParent: function() {
		var l = this.childNodes;
		var a = 0;
		var d = 0;
		var h = 0;
		var j = this.autoCalculatePercentDoneForParentTask;
		var f = this.autoCalculateEffortForParentTask;
		for (var e = 0; e < l.length; e++) {
			var c = l[e];
			var b = c.isLeaf();
			if (!b) {
				c.normalizeParent()
			}
			if (f) {
				a += c.getEffort("MILLI")
			}
			if (j) {
				var k = b ? c.getDuration("MILLI") || 0: c.childTasksDuration;
				d += k;
				h += b ? k * (c.getPercentDone() || 0) : c.completedChildTasksDuration
			}
		}
		if (j) {
			this.childTasksDuration = d;
			this.completedChildTasksDuration = h;
			var g = d ? h / d: 0;
			if (this.getPercentDone() != g) {
				this.data[this.percentDoneField] = g
			}
		}
		if (f) {
			if (this.getEffort("MILLI") != a) {
				this.data[this.effortField] = this.getProjectCalendar().convertMSDurationToUnit(a, this.getEffortUnit())
			}
		}
	},
	getInternalId: function() {
		return this.getId() || this.internalId
	},
	getCalendar: function(a) {
		return a ? this.getOwnCalendar() : this.getOwnCalendar() || this.getProjectCalendar()
	},
	getOwnCalendar: function() {
		var a = this.get(this.calendarIdField);
		return a ? Gnt.data.Calendar.getCalendar(a) : this.calendar
	},
	getProjectCalendar: function() {
		var a = this.getTaskStore(true);
		var b = a && a.getCalendar() || this.parentNode && this.parentNode.getProjectCalendar() || this.isRoot() && this.calendar;
		if (!b) {
			Ext.Error.raise("Can't find a project calendar in `getProjectCalendar`")
		}
		return b
	},
	setCalendar: function(b) {
		var a = b instanceof Gnt.data.Calendar;
		if (a && !b.calendarId) {
			throw new Error("Can't set calendar w/o `calendarId` property")
		}
		this.setCalendarId(a ? b.calendarId: b)
	},
	setCalendarId: function(c, d) {
		if (c instanceof Gnt.data.Calendar) {
			c = c.calendarId
		}
		var b = this.getCalendarId();
		if (b != c || d) {
			if (this.calendarWaitingListener) {
				this.calendarWaitingListener.destroy();
				this.calendarWaitingListener = null
			}
			var a = {
				calendarchange: this.adjustToCalendar,
				scope: this
			};
			var f = this.calendar || Gnt.data.Calendar.getCalendar(b);
			this.calendar = null;
			f && f.un(a);
			this.set(this.calendarIdField, c);
			var e = Gnt.data.Calendar.getCalendar(c);
			if (e) {
				e.on(a);
				if (!d) {
					this.adjustToCalendar()
				}
			} else {
				this.calendarWaitingListener = Ext.data.StoreManager.on("add",
				function(g, i, h) {
					e = Gnt.data.Calendar.getCalendar(c);
					if (e) {
						this.calendarWaitingListener.destroy();
						this.calendarWaitingListener = null;
						e.on(a);
						this.adjustToCalendar()
					}
				},
				this, {
					destroyable: true
				})
			}
		}
	},
	getDependencyStore: function() {
		var a = this.dependencyStore || this.getTaskStore().dependencyStore;
		if (!a) {
			Ext.Error.raise("Can't find a dependencyStore in `getDependencyStore`")
		}
		return a
	},
	getResourceStore: function() {
		return this.getTaskStore().getResourceStore()
	},
	getAssignmentStore: function() {
		return this.getTaskStore().getAssignmentStore()
	},
	getTaskStore: function(b) {
		if (this.taskStore) {
			return this.taskStore
		}
		var a = (this.stores[0] && this.stores[0].treeStore) || this.parentNode && this.parentNode.getTaskStore(b);
		if (!a && !b) {
			Ext.Error.raise("Can't find a taskStore in `getTaskStore`")
		}
		this.taskStore = a;
		return a
	},
	setTaskStore: function(a) {
		this.taskStore = a
	},
	isManuallyScheduled: function() {
		return this.get(this.schedulingModeField) === "Manual" || this.get(this.manuallyScheduledField)
	},
	setManuallyScheduled: function(a) {
		if (a) {
			this.set(this.schedulingModeField, "Manual")
		} else {
			if (this.get(this.schedulingModeField) == "Manual") {
				this.set(this.schedulingModeField, "Normal")
			}
		}
		return this.set(this.manuallyScheduledField, a)
	},
	setSchedulingMode: function(a) {
		if (!Ext.Array.contains(this.recognizedSchedulingModes, a)) {
			throw "Unrecognized scheduling mode: " + a
		}
		this.beginEdit();
		this.set(this.schedulingModeField, a);
		if (a === "FixedDuration") {
			this.updateEffortBasedOnDuration()
		}
		if (a === "EffortDriven") {
			this.updateDurationBasedOnEffort()
		}
		this.endEdit()
	},
	skipNonWorkingTime: function(b, c) {
		var a = false;
		this.forEachAvailabilityIntervalWithResources(c ? {
			startDate: b
		}: {
			endDate: b,
			isForward: false
		},
		function(f, e, d) {
			b = c ? f: e;
			a = true;
			return false
		});
		return a ? new Date(b) : this.getCalendar().skipNonWorkingTime(b, c)
	},
	setStartDate: function(a, g, f) {
		var e,
		d;
		this.beginEdit();
		if (!a) {
			this.set(this.durationField, null);
			this.set(this.startDateField, null)
		} else {
			var c = this.getCalendar();
			if (f && !this.isManuallyScheduled()) {
				a = this.skipNonWorkingTime(a, !this.isMilestone())
			}
			var b = this.getSchedulingMode();
			this.set(this.startDateField, a);
			if (g !== false) {
				if (b == "EffortDriven") {
					this.set(this.endDateField, this.calculateEffortDrivenEndDate(a, this.getEffort()))
				} else {
					e = this.getDuration();
					if (Ext.isNumber(e)) {
						this.set(this.endDateField, this.calculateEndDate(a, e, this.getDurationUnit()))
					}
				}
			} else {
				d = this.getEndDate();
				if (d) {
					this.set(this.durationField, this.calculateDuration(a, d, this.getDurationUnit()))
				}
			}
		}
		e = this.getDuration();
		d = this.getEndDate();
		if (a && d && (e === undefined || e === null)) {
			this.set(this.durationField, this.calculateDuration(a, d, this.getDurationUnit()))
		}
		this.onPotentialEffortChange();
		this.endEdit()
	},
	setEndDate: function(d, h, g) {
		var f,
		a;
		this.beginEdit();
		if (!d) {
			this.set(this.durationField, null);
			this.set(this.endDateField, null)
		} else {
			var e = this.getCalendar();
			a = this.getStartDate();
			if (d < a && h === false) {
				d = a
			}
			if (g && !this.isManuallyScheduled()) {
				d = this.skipNonWorkingTime(d, false)
			}
			if (h !== false) {
				f = this.getDuration();
				if (Ext.isNumber(f)) {
					this.set(this.startDateField, this.calculateStartDate(d, f, this.getDurationUnit()));
					this.set(this.endDateField, d)
				} else {
					this.set(this.endDateField, d)
				}
			} else {
				var b = this.isMilestone();
				if (d < a) {
					this.set(this.startDateField, d)
				}
				this.set(this.endDateField, d);
				if (a) {
					this.set(this.durationField, this.calculateDuration(a, d, this.getDurationUnit()));
					if (b && !this.isMilestone()) {
						var c = this.skipNonWorkingTime(a, true);
						if (c - a !== 0) {
							this.set(this.startDateField, c)
						}
					}
				}
			}
		}
		f = this.getDuration();
		a = this.getStartDate();
		if (d && a && (f === undefined || f === null)) {
			this.set(this.durationField, this.calculateDuration(a, d, this.getDurationUnit()))
		}
		this.onPotentialEffortChange();
		this.endEdit()
	},
	setStartEndDate: function(a, b, c) {
		this.beginEdit();
		if (c && !this.isManuallyScheduled()) {
			a = a && this.skipNonWorkingTime(a, true);
			b = b && this.skipNonWorkingTime(b, false);
			if (b < a) {
				a = b
			}
		}
		this.set(this.startDateField, a);
		this.set(this.endDateField, b);
		this.set(this.durationField, this.calculateDuration(a, b, this.getDurationUnit()));
		this.onPotentialEffortChange();
		this.endEdit()
	},
	getDuration: function(a) {
		if (!a) {
			return this.get(this.durationField)
		}
		var b = this.getProjectCalendar(),
		c = b.convertDurationToMs(this.get(this.durationField), this.get(this.durationUnitField));
		return b.convertMSDurationToUnit(c, a)
	},
	getEffort: function(a) {
		var b = this.get(this.effortField) || 0;
		if (!a) {
			return b
		}
		var c = this.getProjectCalendar(),
		d = c.convertDurationToMs(b, this.getEffortUnit());
		return c.convertMSDurationToUnit(d, a)
	},
	setEffort: function(b, a) {
		a = a || this.get(this.effortUnitField);
		this.beginEdit();
		this.set(this.effortField, b);
		this.set(this.effortUnitField, a);
		if (this.getSchedulingMode() === "EffortDriven") {
			this.updateDurationBasedOnEffort()
		}
		if (this.getSchedulingMode() === "DynamicAssignment") {
			this.updateAssignments()
		}
		this.endEdit()
	},
	getCalendarDuration: function(a) {
		return this.getProjectCalendar().convertMSDurationToUnit(this.getEndDate() - this.getStartDate(), a || this.get(this.durationUnitField))
	},
	setDuration: function(h, g) {
		g = g || this.get(this.durationUnitField);
		var c = this.isMilestone();
		this.beginEdit();
		if (Ext.isNumber(h) && !this.getStartDate()) {
			var b = new Date();
			Ext.Date.clearTime(b);
			this.setStartDate(b)
		}
		var f = null;
		if (Ext.isNumber(h)) {
			f = this.calculateEndDate(this.getStartDate(), h, g)
		}
		this.set(this.endDateField, f);
		this.set(this.durationField, h);
		this.set(this.durationUnitField, g);
		if (this.isMilestone() != c) {
			if (c) {
				var a = this.getStartDate();
				if (a) {
					var e = this.skipNonWorkingTime(a, true);
					if (e - a !== 0) {
						this.set(this.startDateField, e)
					}
				}
			} else {
				if (f) {
					var d = this.skipNonWorkingTime(f, false);
					if (d - f !== 0) {
						this.set(this.startDateField, d);
						this.set(this.endDateField, d)
					}
				}
			}
		}
		this.onPotentialEffortChange();
		this.endEdit()
	},
	calculateStartDate: function(e, d, c) {
		c = c || this.getDurationUnit();
		if (!d) {
			return e
		}
		if (this.isManuallyScheduled()) {
			return Sch.util.Date.add(e, c, -d)
		} else {
			if (this.getTaskStore(true) && this.hasResources()) {
				var b = this.getProjectCalendar().convertDurationToMs(d, c || this.getDurationUnit());
				var a;
				this.forEachAvailabilityIntervalWithResources({
					endDate: e,
					isForward: false
				},
				function(i, h, g) {
					var f = h - i;
					if (f >= b) {
						a = new Date(h - b);
						return false
					} else {
						b -= f
					}
				});
				return a
			} else {
				return this.getCalendar().calculateStartDate(e, d, c)
			}
		}
	},
	endEdit: function(a, c) {
		var b = this.dirty;
		this.dirty = false;
		this.callParent(arguments);
		this.dirty = b
	},
	calculateEndDate: function(a, f, d) {
		d = d || this.getDurationUnit();
		if (!f) {
			return a
		}
		if (this.isManuallyScheduled()) {
			return Sch.util.Date.add(a, d, f)
		} else {
			var c = this.getSchedulingMode();
			if (this.getTaskStore(true) && this.hasResources() && c != "FixedDuration" && c != "DynamicAssignment" && c != "EffortDriven") {
				var b = this.getProjectCalendar().convertDurationToMs(f, d || this.getDurationUnit());
				var e;
				this.forEachAvailabilityIntervalWithResources({
					startDate: a
				},
				function(j, i, h) {
					var g = i - j;
					if (g >= b) {
						e = new Date(j + b);
						return false
					} else {
						b -= g
					}
				});
				return e
			} else {
				return this.getCalendar().calculateEndDate(a, f, d)
			}
		}
	},
	calculateDuration: function(a, c, b) {
		b = b || this.getDurationUnit();
		if (!a || !c) {
			return 0
		}
		if (this.isManuallyScheduled()) {
			return this.getProjectCalendar().convertMSDurationToUnit(c - a, b)
		} else {
			if (this.getTaskStore(true) && this.hasResources()) {
				var d = 0;
				this.forEachAvailabilityIntervalWithResources({
					startDate: a,
					endDate: c
				},
				function(g, f, e) {
					d += f - g
				});
				return this.getProjectCalendar().convertMSDurationToUnit(d, b)
			} else {
				return this.getCalendar().calculateDuration(a, c, b)
			}
		}
	},
	isCalendarApplicable: function(j) {
		var b = this.getStartDate();
		if (!b) {
			return true
		}
		var h = this.getTaskStore(true);
		if (!h) {
			return true
		}
		var g = Sch.util.Date.add(b, "d", (h && h.availabilitySearchLimit) || 5 * 365);
		var a = this.getAssignments();
		var c = [];
		Ext.each(a,
		function(k) {
			var i = k.getResource();
			if (i) {
				c.push(i.getCalendar())
			}
		});
		if (!c.length) {
			return true
		}
		var e = Gnt.data.Calendar.getCalendar(j);
		for (var f = 0, d = c.length; f < d; f++) {
			if (e.isAvailabilityIntersected(c[f], b, g)) {
				return true
			}
		}
		return false
	},
	forEachAvailabilityIntervalWithResources: function(f, h, a) {
		a = a || this;
		var C = this;
		var d = f.startDate;
		var z = f.endDate;
		var q = f.isForward !== false;
		if (q ? !d: !z) {
			throw new Error("At least `startDate` or `endDate` is required, depending from the `isForward` option")
		}
		var l = new Date(q ? d: z);
		var b = f.includeEmptyIntervals;
		var c = this.getOwnCalendar();
		var G = Boolean(c);
		var E = this.getProjectCalendar();
		var A,
		v,
		s;
		if (f.resources) {
			A = f.resources;
			s = [];
			v = [];
			Ext.each(A,
			function(i) {
				v.push(i.getCalendar());
				s.push(C.getAssignmentFor(i))
			})
		} else {
			s = this.getAssignments();
			A = [];
			v = [];
			Ext.each(s,
			function(k) {
				var i = k.getResource();
				if (i) {
					A.push(i);
					v.push(i.getCalendar())
				}
			})
		}
		if (!A.length) {
			return
		}
		var g = Sch.util.Date;
		var y,
		u,
		B,
		D,
		o;
		var j = this.getTaskStore(true);
		if (q) {
			if (!z) {
				z = g.add(d, "d", f.availabilitySearchLimit || j.availabilitySearchLimit || 5 * 365)
			}
		} else {
			if (!d) {
				d = g.add(z, "d", -(f.availabilitySearchLimit || j.availabilitySearchLimit || 5 * 365))
			}
		}
		while (q ? l < z: l > d) {
			var r = {};
			var F = [];
			if (G) {
				var m = c.getAvailabilityIntervalsFor(l - (q ? 0: 1));
				for (u = 0; u < m.length; u++) {
					B = m[u];
					D = B.startDate - 0;
					o = B.endDate - 0;
					if (!r[D]) {
						r[D] = [];
						F.push(D)
					}
					r[D].push({
						type: "00-taskAvailailabilityStart",
						typeBackward: "01-taskAvailailabilityStart"
					});
					F.push(o);
					r[o] = r[o] || [];
					r[o].push({
						type: "01-taskAvailailabilityEnd",
						typeBackward: "00-taskAvailailabilityEnd"
					})
				}
			}
			for (y = 0; y < v.length; y++) {
				var e = v[y].getAvailabilityIntervalsFor(l - (q ? 0: 1));
				for (u = 0; u < e.length; u++) {
					B = e[u];
					D = B.startDate - 0;
					o = B.endDate - 0;
					if (!r[D]) {
						r[D] = [];
						F.push(D)
					}
					r[D].push({
						type: "02-resourceAvailailabilityStart",
						typeBackward: "03-resourceAvailailabilityStart",
						assignment: s[y],
						resourceId: A[y].getInternalId(),
						units: s[y].getUnits()
					});
					if (!r[o]) {
						r[o] = [];
						F.push(o)
					}
					r[o].push({
						type: "03-resourceAvailailabilityEnd",
						typeBackward: "02-resourceAvailailabilityEnd",
						assignment: s[y],
						resourceId: A[y].getInternalId(),
						units: s[y].getUnits()
					})
				}
			}
			F.sort();
			var x = false;
			var p = {};
			var n = 0;
			var w,
			t;
			if (q) {
				for (y = 0; y < F.length; y++) {
					w = r[F[y]];
					w.sort(function(k, i) {
						return k.type < i.type
					});
					for (u = 0; u < w.length; u++) {
						t = w[u];
						if (t.type == "00-taskAvailailabilityStart") {
							x = true
						}
						if (t.type == "01-taskAvailailabilityEnd") {
							x = false
						}
						if (t.type == "02-resourceAvailailabilityStart") {
							p[t.resourceId] = t;
							n++
						}
						if (t.type == "03-resourceAvailailabilityEnd") {
							delete p[t.resourceId];
							n--
						}
					}
					if ((x || !G) && (n || b)) {
						D = F[y];
						o = F[y + 1];
						if (D >= z || o <= d) {
							continue
						}
						if (D < d) {
							D = d - 0
						}
						if (o > z) {
							o = z - 0
						}
						if (h.call(a, D, o, p) === false) {
							return false
						}
					}
				}
			} else {
				for (y = F.length - 1; y >= 0; y--) {
					w = r[F[y]];
					w.sort(function(k, i) {
						return k.typeBackward < i.typeBackward
					});
					for (u = 0; u < w.length; u++) {
						t = w[u];
						if (t.typeBackward == "00-taskAvailailabilityEnd") {
							x = true
						}
						if (t.typeBackward == "01-taskAvailailabilityStart") {
							x = false
						}
						if (t.typeBackward == "02-resourceAvailailabilityEnd") {
							p[t.resourceId] = t;
							n++
						}
						if (t.typeBackward == "03-resourceAvailailabilityStart") {
							delete p[t.resourceId];
							n--
						}
					}
					if ((x || !G) && (n || b)) {
						D = F[y - 1];
						o = F[y];
						if (D > z || o <= d) {
							continue
						}
						if (D < d) {
							D = d - 0
						}
						if (o > z) {
							o = z - 0
						}
						if (h.call(a, D, o, p) === false) {
							return false
						}
					}
				}
			}
			l = q ? g.getStartOfNextDay(l) : g.getEndOfPreviousDay(l)
		}
	},
	calculateEffortDrivenEndDate: function(a, c, b) {
		var e = this.getProjectCalendar().convertDurationToMs(c, b || this.getEffortUnit());
		var d = new Date(a);
		this.forEachAvailabilityIntervalWithResources({
			startDate: a
		},
		function(l, k, j) {
			var m = 0;
			for (var h in j) {
				m += j[h].units
			}
			var g = k - l;
			var f = m * g / 100;
			if (f >= e) {
				d = new Date(l + e / f * g);
				return false
			} else {
				e -= f
			}
		});
		return d
	},
	recalculateParents: function() {
		var g = new Date(9999, 0, 0),
		w = new Date(0),
		e = this.parentNode;
		var s = this.autoCalculatePercentDoneForParentTask;
		var f = this.autoCalculateEffortForParentTask;
		if (e && e.childNodes.length > 0 && (f || s)) {
			var d = 0;
			var m = 0;
			var p = 0;
			for (var q = 0, u = e.childNodes.length; q < u; q++) {
				var a = e.childNodes[q];
				var v = a.isLeaf();
				if (f) {
					d += a.getEffort("MILLI")
				}
				if (s) {
					var b = v ? a.getDuration("MILLI") || 0: a.childTasksDuration;
					m += b;
					p += v ? b * (a.getPercentDone() || 0) : a.completedChildTasksDuration
				}
			}
			if (f && e.getEffort("MILLI") != d) {
				e.setEffort(this.getProjectCalendar().convertMSDurationToUnit(d, e.getEffortUnit()))
			}
			if (s) {
				e.childTasksDuration = m;
				e.completedChildTasksDuration = p;
				var n = m ? p / m: 0;
				if (e.getPercentDone() != n) {
					e.setPercentDone(n)
				}
			}
		}
		var c,
		h;
		if (e && !e.isRoot() && e.childNodes.length > 0) {
			if (!e.isManuallyScheduled()) {
				for (var t = 0, o = e.childNodes.length; t < o; t++) {
					var j = e.childNodes[t];
					g = Sch.util.Date.min(g, j.getStartDate() || g);
					w = Sch.util.Date.max(w, j.getEndDate() || w)
				}
				c = g - new Date(9999, 0, 0) !== 0 && e.getStartDate() - g !== 0;
				h = w - new Date(0) !== 0 && e.getEndDate() - w !== 0;
				if (c && h) {
					e.setStartEndDate(g, w, false)
				} else {
					if (c) {
						e.setStartDate(g, h, false)
					} else {
						if (h) {
							e.setEndDate(w, false, false)
						}
					}
				}
			}
			if ((this.getTaskStore().cascading && (c || h)) || (!c && !h)) {
				e.recalculateParents()
			}
		}
	},
	isMilestone: function(a) {
		return a ? this.isBaselineMilestone() : this.getDuration() === 0
	},
	convertToMilestone: function() {
		if (!this.isMilestone()) {
			this.setStartDate(this.getEndDate(), false);
			this.setDuration(0)
		}
	},
	convertToRegular: function() {
		if (this.isMilestone()) {
			var b = this.get(this.durationUnitField);
			this.setDuration(1, b);
			var a = this.calculateStartDate(this.getStartDate(), 1, b);
			this.setStartDate(a)
		}
	},
	isBaselineMilestone: function() {
		var b = this.getBaselineStartDate(),
		a = this.getBaselineEndDate();
		if (b && a) {
			return a - b === 0
		}
		return false
	},
	afterEdit: function(b) {
		if (this.stores.length > 0 || !this.normalized) {
			this.callParent(arguments)
		} else {
			var a = this.taskStore || this.getTaskStore(true);
			if (a && !a.isFillingRoot) {
				a.afterEdit(this, b)
			}
			this.callParent(arguments)
		}
	},
	afterCommit: function() {
		this.callParent(arguments);
		if (this.stores.length > 0 || !this.normalized) {
			return
		}
		var a = this.taskStore || this.getTaskStore(true);
		if (a && !a.isFillingRoot) {
			a.afterCommit(this)
		}
	},
	afterReject: function() {
		if (this.stores.length > 0) {
			this.callParent(arguments)
		} else {
			var a = this.getTaskStore(true);
			if (a && !a.isFillingRoot) {
				a.afterReject(this)
			}
			this.callParent(arguments)
		}
	},
	getDurationUnit: function() {
		return this.get(this.durationUnitField) || "d"
	},
	getEffortUnit: function() {
		return this.get(this.effortUnitField) || "h"
	},
	getBaselinePercentDone: function() {
		return this.get(this.baselinePercentDoneField) || 0
	},
	isPersistable: function() {
		var a = this.parentNode;
		return ! a.phantom
	},
	getResources: function() {
		var b = this.getAssignmentStore(),
		c = this.getInternalId();
		var a = [];
		if (b) {
			b.each(function(d) {
				if (d.getTaskId() == c) {
					a.push(d.getResource())
				}
			})
		}
		return a
	},
	getAssignments: function() {
		var b = this.getAssignmentStore(),
		c = this.getInternalId();
		var a = [];
		if (b) {
			b.each(function(d) {
				if (d.getTaskId() == c) {
					a.push(d)
				}
			})
		}
		return a
	},
	hasAssignments: function() {
		var b = this.getAssignmentStore(),
		c = this.getInternalId();
		var a = false;
		if (b) {
			b.each(function(d) {
				if (d.getTaskId() == c) {
					a = true;
					return false
				}
			})
		}
		return a
	},
	hasResources: function() {
		var b = this.getAssignmentStore(),
		c = this.getInternalId();
		var a = false;
		if (b) {
			b.each(function(d) {
				if (d.getTaskId() == c && d.getResource()) {
					a = true;
					return false
				}
			})
		}
		return a
	},
	getAssignmentFor: function(b) {
		var c = this.getAssignmentStore(),
		e = this.getInternalId(),
		d = b instanceof Gnt.model.Resource ? b.getInternalId() : b;
		var a;
		if (c) {
			c.each(function(f) {
				if (f.getTaskId() == e && f.getResourceId() == d) {
					a = f;
					return false
				}
			})
		}
		return a || null
	},
	isAssignedTo: function(a) {
		return !! this.getAssignmentFor(a)
	},
	unassign: function() {
		return this.unAssign.apply(this, arguments)
	},
	unAssign: function(c) {
		var d = this.getAssignmentStore();
		var b = this.getInternalId();
		var e = c instanceof Gnt.model.Resource ? c.getInternalId() : c;
		var a = d.findBy(function(f) {
			return f.getResourceId() == e && f.getTaskId() == b
		});
		if (a >= 0) {
			d.removeAt(a)
		}
	},
	assign: function(e, a) {
		var b = this.getTaskStore(),
		h = this.getInternalId(),
		f = b.getAssignmentStore(),
		d = b.getResourceStore();
		var g = e instanceof Gnt.model.Resource ? e.getInternalId() : e;
		f.each(function(i) {
			if (i.getTaskId() == h && i.getResourceId() == g) {
				throw "Resource can't be assigned twice to the same task"
			}
		});
		if (e instanceof Gnt.model.Resource && d.indexOf(e) == -1) {
			d.add(e)
		}
		var c = new Gnt.model.Assignment({
			TaskId: h,
			ResourceId: g,
			Units: a
		});
		f.add(c);
		return c
	},
	calculateEffort: function(a, c, b) {
		if (!a || !c) {
			return 0
		}
		var d = 0;
		this.forEachAvailabilityIntervalWithResources({
			startDate: a,
			endDate: c
		},
		function(h, g, f) {
			var j = 0;
			for (var e in f) {
				j += f[e].units
			}
			d += (g - h) * j / 100
		});
		return this.getProjectCalendar().convertMSDurationToUnit(d, b || this.getEffortUnit())
	},
	updateAssignments: function() {
		var b = {};
		var a = this.getStartDate();
		var d = this.getEndDate();
		if (!a || !d) {
			return
		}
		var c = 0;
		this.forEachAvailabilityIntervalWithResources({
			startDate: a,
			endDate: d
		},
		function(h, g, f) {
			for (var i in f) {
				c += g - h
			}
		});
		if (!c) {
			return
		}
		var e = this.getEffort(Sch.util.Date.MILLI);
		Ext.Array.each(this.getAssignments(),
		function(f) {
			f.setUnits(e / c * 100)
		})
	},
	updateEffortBasedOnDuration: function() {
		this.setEffort(this.calculateEffort(this.getStartDate(), this.getEndDate()))
	},
	updateDurationBasedOnEffort: function() {
		this.setEndDate(this.calculateEffortDrivenEndDate(this.getStartDate(), this.getEffort(), this.getEffortUnit()), false)
	},
	onPotentialEffortChange: function() {
		switch (this.getSchedulingMode()) {
		case "FixedDuration":
			this.updateEffortBasedOnDuration();
			break;
		case "DynamicAssignment":
			this.updateAssignments();
			break
		}
	},
	onAssignmentMutation: function() {
		switch (this.getSchedulingMode()) {
		case "FixedDuration":
			this.updateEffortBasedOnDuration();
			break;
		case "EffortDriven":
			this.updateDurationBasedOnEffort();
			break
		}
	},
	onAssignmentStructureMutation: function() {
		switch (this.getSchedulingMode()) {
		case "FixedDuration":
			this.updateEffortBasedOnDuration();
			break;
		case "EffortDriven":
			var a = this.calculateEffortDrivenEndDate(this.getStartDate(), this.getEffort(), this.getEffortUnit());
			this.setStartEndDate(this.getStartDate(), a, this.getTaskStore().skipWeekendsDuringDragDrop);
			break;
		case "DynamicAssignment":
			this.updateAssignments();
			break
		}
	},
	adjustToCalendar: function() {
		if (this.get("leaf") && !this.isManuallyScheduled()) {
			this.setStartDate(this.getStartDate(), true, this.getTaskStore().skipWeekendsDuringDragDrop);
			if (this.getTaskStore(true).cascadeChanges) {
				var d = this.getViolatedConstraints();
				if (d) {
					for (var c = 0, a = d.length, b; c < a; c++) {
						b = d[c];
						this.resolveViolatedConstraints(!c ? b: null)
					}
				}
			}
		}
	},
	isEditable: function(a) {
		if (!this.isLeaf()) {
			if (a === this.effortField && this.autoCalculateEffortForParentTask) {
				return false
			}
			if (a === this.percentDoneField && this.autoCalculatePercentDoneForParentTask) {
				return false
			}
		}
		if ((a === this.durationField || a === this.endDateField) && this.getSchedulingMode() === "EffortDriven") {
			return false
		}
		if (a === this.effortField && this.getSchedulingMode() === "FixedDuration") {
			return false
		}
		return true
	},
	isDraggable: function() {
		return this.getDraggable()
	},
	isResizable: function() {
		return this.getResizable()
	},
	getWBSCode: function() {
		var b = [],
		a = this;
		while (!a.data.root) {
			b.push(a.data.index + 1);
			a = a.parentNode
		}
		return b.reverse().join(".")
	},
	getDisplayStartDate: function(g, d, e, b, c) {
		var f = this.getEndDate(),
		a = this.getStartDate();
		if (arguments.length < 3) {
			e = this.getStartDate();
			if (arguments.length < 2) {
				d = true
			}
		}
		if (e && d && this.isMilestone(c) && e - Ext.Date.clearTime(e, true) === 0 && !Ext.Date.formatContainsHourInfo(g)) {
			e = Sch.util.Date.add(e, Sch.util.Date.MILLI, -1)
		}
		return b ? e: (e ? Ext.util.Format.date(e, g) : "")
	},
	getDisplayEndDate: function(e, c, d, a, b) {
		if (arguments.length < 3) {
			d = this.getEndDate();
			if (arguments.length < 2) {
				c = true
			}
		}
		if (d && (!this.isMilestone(b) || c) && d - Ext.Date.clearTime(d, true) === 0 && !Ext.Date.formatContainsHourInfo(e)) {
			d = Sch.util.Date.add(d, Sch.util.Date.MILLI, -1)
		}
		return a ? d: (d ? Ext.util.Format.date(d, e) : "")
	},
	getId: function() {
		var a = this.data[this.idProperty];
		return a && a !== "root" ? a: null
	}
},
function() {
	Ext.data.NodeInterface.decorate(this);
	if (Ext.getVersion("extjs").isGreaterThan("4.2.0.663")) {
		var a = {
			idchanged: true,
			append: true,
			remove: true,
			move: true,
			insert: true,
			beforeappend: true,
			beforeremove: true,
			beforemove: true,
			beforeinsert: true,
			expand: true,
			collapse: true,
			beforeexpand: true,
			beforecollapse: true,
			sort: true,
			rootchange: true
		};
		this.override({
			fireEventArgs: function(d, e) {
				var g = Ext.data.Model.prototype.fireEventArgs,
				b,
				f,
				c;
				if (a[d]) {
					for (f = this; b !== false && f; f = (c = f).parentNode) {
						if (f.hasListeners[d]) {
							b = g.call(f, d, e)
						}
					}
					f = c.rootOf;
					if (b !== false && f) {
						if (f.hasListeners[d]) {
							b = f.fireEventArgs.call(f, d, e)
						}
						f = f.treeStore;
						if (b !== false && f) {
							if (f.hasListeners[d]) {
								b = f.fireEventArgs.call(f, d, e)
							}
						}
					}
					return b
				} else {
					return g.apply(this, arguments)
				}
			}
		})
	}
	this.override({
		remove: function() {
			var c = this.parentNode;
			var b = this.getTaskStore();
			var d = this.callParent(arguments);
			if (b.recalculateParents) {
				if (c.convertEmptyParentToLeaf && c.childNodes.length === 0) {
					c.set("leaf", true)
				} else {
					if (!c.isRoot() && c.childNodes.length > 0) {
						c.childNodes[0].recalculateParents()
					}
				}
			}
			return d
		},
		insertBefore: function(b) {
			if (this.phantom) {
				this.data[this.phantomIdField] = b.data[this.phantomParentIdField] = this.internalId
			}
			return this.callParent(arguments)
		},
		appendChild: function(d) {
			if (this.phantom) {
				var b = d instanceof Array ? d: [d];
				for (var c = 0; c < b.length; c++) {
					this.data[this.phantomIdField] = b[c].data[this.phantomParentIdField] = this.internalId
				}
			}
			return this.callParent(arguments)
		},
		removeChild: function(c) {
			var b = this.getTaskStore();
			var d = this.callParent(arguments);
			if (b.recalculateParents) {
				if (this.convertEmptyParentToLeaf && this.childNodes.length === 0) {
					this.set("leaf", true)
				} else {
					if (!this.isRoot() && this.childNodes.length > 0) {
						this.childNodes[0].recalculateParents()
					}
				}
			}
			return d
		},
		createNode: function(c) {
			c = this.callParent(arguments);
			if (!c.normalized) {
				var b = c.updateInfo;
				c.updateInfo = function() {
					b.apply(this, arguments);
					delete c.updateInfo;
					c.normalize()
				}
			}
			return c
		}
	})
});
Ext.define("Gnt.util.DurationParser", {
	requires: ["Sch.util.Date"],
	mixins: ["Gnt.mixin.Localizable"],
	parseNumberFn: null,
	durationRegex: null,
	allowDecimals: true,
	constructor: function(a) {
		Ext.apply(this, a);
		if (this.unitsRegex) {
			Ext.apply(this.l10n.unitsRegex, this.unitsRegex)
		}
		if (!this.durationRegex) {
			this.durationRegex = this.allowDecimals ? /^\s*([\-+]?\d+(?:[.,]\d+)?)\s*(\w+)?/i: /^\s*([\-+]?\d+)(?![.,])\s*(\w+)?/i
		}
	},
	parse: function(c) {
		var a = this.durationRegex.exec(c);
		if (c == null || !a) {
			return null
		}
		var e = this.parseNumberFn(a[1]);
		var b = a[2];
		var d;
		if (b) {
			Ext.iterate(this.L("unitsRegex"),
			function(f, g) {
				if (g.test(b)) {
					d = Sch.util.Date.getUnitByName(f);
					return false
				}
			});
			if (!d) {
				return null
			}
		}
		return {
			value: e,
			unit: d
		}
	}
});
Ext.define("Gnt.util.DependencyParser", {
	requires: ["Gnt.util.DurationParser"],
	separator: /\s*;\s*/,
	parseNumberFn: null,
	dependencyRegex: /(-?\d+)(SS|SF|FS|FF)?([\+\-].*)?/i,
	types: ["SS", "SF", "FS", "FF"],
	constructor: function(a) {
		this.durationParser = new Gnt.util.DurationParser(a);
		Ext.apply(this, a)
	},
	parse: function(j) {
		if (!j) {
			return []
		}
		var d = j.split(this.separator);
		var k = [];
		var c = this.dependencyRegex;
		for (var f = 0; f < d.length; f++) {
			var a = d[f];
			if (!a && f == d.length - 1) {
				continue
			}
			var g = c.exec(a);
			var e = {};
			if (!g) {
				return null
			}
			e.taskId = parseInt(g[1], 10);
			e.type = Ext.Array.indexOf(this.types, (g[2] || "FS").toUpperCase());
			var h = g[3];
			if (h) {
				var b = this.durationParser.parse(h);
				if (!b) {
					return null
				}
				e.lag = b.value;
				e.lagUnit = b.unit || "d"
			}
			k.push(e)
		}
		return k
	}
});
Ext.define("Gnt.util.Data", {
	requires: ["Ext.data.Model"],
	singleton: true,
	cloneModelSet: function(b, d, c) {
		var e = [],
		a;
		var f = function(g) {
			a = g.copy();
			Ext.data.Model.id(a);
			a.phantom = false;
			a.originalRecord = g;
			if (d) {
				if (d.call(c || b, a, g) === false) {
					return
				}
			}
			e.push(a)
		};
		if (b.each) {
			b.each(f)
		} else {
			Ext.Array.each(b, f)
		}
		return e
	},
	applyCloneChanges: function(f, k, h, o) {
		var a = [];
		if (k.autoSync) {
			k.suspendAutoSync()
		}
		var e = f.getRemovedRecords();
		for (var d = 0, b = e.length; d < b; d++) {
			if (e[d].originalRecord) {
				a.push(e[d].originalRecord)
			}
		}
		if (a.length) {
			k.remove(a);
			f.removed.length = 0
		}
		var m = f.getModifiedRecords(),
		p,
		c,
		n,
		g;
		for (d = 0, b = m.length; d < b; d++) {
			p = m[d].originalRecord;
			c = m[d].getData();
			delete c[m[d].idProperty];
			if (p) {
				p.beginEdit();
				for (var j in c) {
					p.set(j, c[j])
				}
				if (h) {
					h.call(o || m[d], c, m[d])
				}
				p.endEdit()
			} else {
				if (h) {
					h.call(o || m[d], c, m[d])
				}
				g = k.add(c);
				m[d].originalRecord = g && g[0]
			}
			m[d].commit(true)
		}
		if (k.autoSync) {
			k.resumeAutoSync();
			k.sync()
		}
	}
});
Ext.define("Gnt.patches.Tree", {
	override: "Ext.data.Tree",
	onNodeRemove: function(b, c, a) {
		if (!a) {
			this.unregisterNode(c, true)
		}
	}
});
Ext.define("Gnt.data.Calendar", {
	extend: "Ext.data.Store",
	requires: ["Ext.Date", "Gnt.model.CalendarDay", "Sch.model.Range", "Sch.util.Date"],
	model: "Gnt.model.CalendarDay",
	daysPerMonth: 30,
	daysPerWeek: 7,
	hoursPerDay: 24,
	unitsInMs: null,
	defaultNonWorkingTimeCssCls: "gnt-holiday",
	weekendsAreWorkdays: false,
	weekendFirstDay: 6,
	weekendSecondDay: 0,
	holidaysCache: null,
	availabilityIntervalsCache: null,
	daysIndex: null,
	weekAvailability: null,
	defaultWeekAvailability: null,
	nonStandardWeeksByStartDate: null,
	nonStandardWeeksStartDates: null,
	calendarId: null,
	parent: null,
	defaultAvailability: ["00:00-24:00"],
	name: null,
	suspendCacheUpdate: 0,
	statics: {
		getCalendar: function(a) {
			if (a instanceof Gnt.data.Calendar) {
				return a
			}
			return Ext.data.StoreManager.lookup("GNT_CALENDAR:" + a)
		},
		getAllCalendars: function() {
			var a = [];
			Ext.data.StoreManager.each(function(b) {
				if (b instanceof Gnt.data.Calendar) {
					a.push(b)
				}
			});
			return a
		}
	},
	constructor: function(a) {
		a = a || {};
		var b = a.parent;
		delete a.parent;
		var c = a.calendarId;
		delete a.calendarId;
		this.callParent(arguments);
		this.setParent(b);
		this.setCalendarId(c);
		this.unitsInMs = {
			MILLI: 1,
			SECOND: 1000,
			MINUTE: 60 * 1000,
			HOUR: 60 * 60 * 1000,
			DAY: this.hoursPerDay * 60 * 60 * 1000,
			WEEK: this.daysPerWeek * this.hoursPerDay * 60 * 60 * 1000,
			MONTH: this.daysPerMonth * this.hoursPerDay * 60 * 60 * 1000,
			QUARTER: 3 * this.daysPerMonth * 24 * 60 * 60 * 1000,
			YEAR: 4 * 3 * this.daysPerMonth * 24 * 60 * 60 * 1000
		};
		this.defaultWeekAvailability = this.getDefaultWeekAvailability();
		this.on({
			update: this.clearCache,
			datachanged: this.clearCache,
			clear: this.clearCache,
			load: this.clearCache,
			scope: this
		});
		this.clearCache()
	},
	getCalendarId: function() {
		return this.calendarId
	},
	setCalendarId: function(b) {
		if (this.calendarId != null) {
			Ext.data.StoreManager.unregister(this)
		}
		this.calendarId = b;
		if (b != null) {
			this.storeId = "GNT_CALENDAR:" + b;
			Ext.data.StoreManager.register(this)
		} else {
			this.storeId = null
		}
		var a = this.proxy;
		if (a && a.extraParams) {
			a.extraParams.calendarId = b
		}
	},
	getDefaultWeekAvailability: function() {
		var e = this.defaultAvailability;
		var d = this.weekendFirstDay;
		var a = this.weekendSecondDay;
		var c = [];
		for (var b = 0; b < 7; b++) {
			c.push(this.weekendsAreWorkdays || b != d && b != a ? new Gnt.model.CalendarDay({
				Type: "WEEKDAY",
				Weekday: b,
				Availability: Ext.Array.clone(e),
				IsWorkingDay: true
			}) : new Gnt.model.CalendarDay({
				Type: "WEEKDAY",
				Weekday: b,
				Availability: []
			}))
		}
		return c
	},
	clearCache: function() {
		if (this.suspendCacheUpdate > 0) {
			return
		}
		this.holidaysCache = {};
		this.availabilityIntervalsCache = {};
		var c = this.daysIndex = {};
		var a = this.weekAvailability = [];
		var d = this.nonStandardWeeksStartDates = [];
		var b = this.nonStandardWeeksByStartDate = {};
		this.each(function(k) {
			var e = k.getId();
			var n = /^(\d)-(\d\d\d\d\/\d\d\/\d\d)-(\d\d\d\d\/\d\d\/\d\d)$/.exec(e);
			var j = /^WEEKDAY:(\d+)$/.exec(e);
			var m = k.getType();
			var l = k.getWeekday();
			if (m == "WEEKDAYOVERRIDE" || n) {
				var f,
				i;
				if (m == "WEEKDAYOVERRIDE") {
					f = k.getOverrideStartDate();
					i = k.getOverrideEndDate()
				}
				if (n) {
					f = Ext.Date.parse(n[2], "Y-m-d");
					i = Ext.Date.parse(n[3], "Y-m-d");
					l = n[1]
				}
				if (f && i && l != null) {
					var h = f - 0;
					if (!b[h]) {
						b[h] = {
							startDate: new Date(f),
							endDate: new Date(i),
							name: k.getName(),
							weekAvailability: [],
							mainDay: null
						};
						d.push(h)
					}
					if (l >= 0) {
						b[h].weekAvailability[l] = k
					} else {
						b[h].mainDay = k
					}
				}
			} else {
				if (m == "WEEKDAY" || j) {
					if (j) {
						l = j[1]
					}
					if (l != null) {
						if (l < 0 || l > 6) {
							throw new Error("Incorrect week day index")
						}
						a[l] = k
					}
				} else {
					var g = k.getDate();
					if (g) {
						c[g - 0] = k
					}
				}
			}
		});
		d.sort();
		this.fireEvent("calendarchange", this)
	},
	intersectsWithCurrentWeeks: function(b, c) {
		var a = false;
		this.forEachNonStandardWeek(function(f) {
			var d = f.startDate;
			var e = f.endDate;
			if (d <= b && b < e || d < c && c <= e) {
				a = true;
				return false
			}
		});
		return a
	},
	addNonStandardWeek: function(b, f, a, c) {
		b = Ext.Date.clearTime(new Date(b));
		f = Ext.Date.clearTime(new Date(f));
		if (this.intersectsWithCurrentWeeks(b, f)) {
			throw new Error("Can not add intersecting week")
		}
		var e = this.model;
		var g = [];
		Ext.Array.each(a,
		function(h, i) {
			if (h instanceof Gnt.model.CalendarDay) {
				h.setType("WEEKDAYOVERRIDE");
				h.setOverrideStartDate(b);
				h.setOverrideEndDate(f);
				h.setWeekday(i);
				h.setName(c || "Week override");
				g.push(h)
			} else {
				if (Ext.isArray(h)) {
					var j = new e();
					j.setType("WEEKDAYOVERRIDE");
					j.setOverrideStartDate(b);
					j.setOverrideEndDate(f);
					j.setWeekday(i);
					j.setName(c || "Week override");
					j.setAvailability(h);
					g.push(j)
				}
			}
		});
		var d = new e();
		d.setType("WEEKDAYOVERRIDE");
		d.setOverrideStartDate(b);
		d.setOverrideEndDate(f);
		d.setWeekday( - 1);
		d.setName(c || "Week override");
		g.push(d);
		this.add(g)
	},
	getNonStandardWeekByStartDate: function(a) {
		return this.nonStandardWeeksByStartDate[Ext.Date.clearTime(new Date(a)) - 0] || null
	},
	getNonStandardWeekByDate: function(d) {
		d = Ext.Date.clearTime(new Date(d)) - 0;
		var e = this.nonStandardWeeksStartDates;
		var a = this.nonStandardWeeksByStartDate;
		for (var c = 0; c < e.length; c++) {
			var b = a[e[c]];
			if (b.startDate > d) {
				break
			}
			if (b.startDate <= d && d <= b.endDate) {
				return b
			}
		}
		return null
	},
	removeNonStandardWeek: function(a) {
		a = Ext.Date.clearTime(new Date(a)) - 0;
		var b = this.getNonStandardWeekByStartDate(a);
		if (!b) {
			return
		}
		this.remove(Ext.Array.clean(b.weekAvailability).concat(b.mainDay))
	},
	forEachNonStandardWeek: function(e, c) {
		var d = this;
		var f = this.nonStandardWeeksStartDates;
		var a = this.nonStandardWeeksByStartDate;
		for (var b = 0; b < f.length; b++) {
			if (e.call(c || d, a[f[b]]) === false) {
				return false
			}
		}
	},
	setWeekendsAreWorkDays: function(a) {
		if (a !== this.weekendsAreWorkdays) {
			this.weekendsAreWorkdays = a;
			this.defaultWeekAvailability = this.getDefaultWeekAvailability();
			this.clearCache()
		}
	},
	areWeekendsWorkDays: function() {
		return this.weekendsAreWorkdays
	},
	getCalendarDay: function(a) {
		a = typeof a == "number" ? new Date(a) : a;
		return this.getOverrideDay(a) || this.getWeekDay(a.getDay(), a) || this.getDefaultCalendarDay(a.getDay())
	},
	getOverrideDay: function(a) {
		return this.getOwnCalendarDay(a) || this.parent && this.parent.getOverrideDay(a) || null
	},
	getOwnCalendarDay: function(a) {
		a = typeof a == "number" ? new Date(a) : a;
		return this.daysIndex[Ext.Date.clearTime(a, true) - 0]
	},
	getWeekDay: function(c, b) {
		if (b) {
			var a = this.getNonStandardWeekByDate(b);
			if (a && a.weekAvailability[c]) {
				return a.weekAvailability[c]
			}
		}
		return this.weekAvailability[c] || this.parent && this.parent.getWeekDay(c, b) || null
	},
	getDefaultCalendarDay: function(a) {
		if (!this.hasOwnProperty("defaultAvailability") && !this.hasOwnProperty("weekendsAreWorkdays") && this.parent) {
			return this.parent.getDefaultCalendarDay(a)
		}
		return this.defaultWeekAvailability[a]
	},
	isHoliday: function(c) {
		var b = c - 0;
		var d = this.holidaysCache;
		if (d[b] != null) {
			return d[b]
		}
		c = typeof c == "number" ? new Date(c) : c;
		var a = this.getCalendarDay(c);
		if (!a) {
			throw "Can't find day for " + c
		}
		return d[b] = !a.getIsWorkingDay()
	},
	isWeekend: function(b) {
		var a = b.getDay();
		return a === this.weekendFirstDay || a === this.weekendSecondDay
	},
	isWorkingDay: function(a) {
		return ! this.isHoliday(a)
	},
	convertMSDurationToUnit: function(a, b) {
		return a / this.unitsInMs[Sch.util.Date.getNameOfUnit(b)]
	},
	convertDurationToMs: function(b, a) {
		return b * this.unitsInMs[Sch.util.Date.getNameOfUnit(a)]
	},
	getHolidaysRanges: function(d, g, a) {
		if (d > g) {
			Ext.Error.raise("startDate can't be bigger than endDate")
		}
		d = Ext.Date.clearTime(d, true);
		g = Ext.Date.clearTime(g, true);
		var c = [],
		h,
		e;
		for (e = d; e < g; e = Sch.util.Date.getNext(e, Sch.util.Date.DAY, 1)) {
			if (this.isHoliday(e) || (this.weekendsAreWorkdays && a && this.isWeekend(e))) {
				var i = this.getCalendarDay(e);
				var j = i && i.getCls() || this.defaultNonWorkingTimeCssCls;
				var f = Sch.util.Date.getNext(e, Sch.util.Date.DAY, 1);
				if (!h) {
					h = {
						StartDate: e,
						EndDate: f,
						Cls: j
					}
				} else {
					if (h.Cls == j) {
						h.EndDate = f
					} else {
						c.push(h);
						h = {
							StartDate: e,
							EndDate: f,
							Cls: j
						}
					}
				}
			} else {
				if (h) {
					c.push(h);
					h = null
				}
			}
		}
		if (h) {
			c.push(h)
		}
		var b = [];
		Ext.each(c,
		function(k) {
			b.push(Ext.create("Sch.model.Range", {
				StartDate: k.StartDate,
				EndDate: k.EndDate,
				Cls: k.Cls
			}))
		});
		return b
	},
	forEachAvailabilityInterval: function(d, f, a) {
		a = a || this;
		var r = this;
		var b = d.startDate;
		var o = d.endDate;
		var k = d.isForward !== false;
		if (k ? !b: !o) {
			throw new Error("At least `startDate` or `endDate` is required, depending from the `isForward` option")
		}
		var h = new Date(k ? b: o);
		var l = k ? !o: !b;
		var e = Sch.util.Date;
		var g = false;
		while (l || (k ? h < o: h > b)) {
			var c = this.getAvailabilityIntervalsFor(h - (k ? 0: 1), k ? g: false);
			for (var m = k ? 0: c.length - 1; k ? m < c.length: m >= 0; k ? m++:m--) {
				var q = c[m];
				var s = q.startDate;
				var j = q.endDate;
				if (s >= o || j <= b) {
					continue
				}
				var n = s < b ? b: s;
				var p = j > o ? o: j;
				if (f.call(a, n, p) === false) {
					return false
				}
			}
			h = k ? e.getStartOfNextDay(h, false, g) : e.getEndOfPreviousDay(h, g);
			g = true
		}
	},
	calculateDuration: function(a, d, b) {
		var c = 0;
		this.forEachAvailabilityInterval({
			startDate: a,
			endDate: d
		},
		function(g, f) {
			var e = g.getTimezoneOffset() - f.getTimezoneOffset();
			c += f - g + e * 60 * 1000
		});
		return this.convertMSDurationToUnit(c, b)
	},
	calculateEndDate: function(a, f, b) {
		if (!f) {
			return new Date(a)
		}
		var e = Sch.util.Date,
		d;
		f = this.convertDurationToMs(f, b);
		var c = f === 0 && Ext.Date.clearTime(a, true) - a === 0 ? e.add(a, Sch.util.Date.DAY, -1) : a;
		this.forEachAvailabilityInterval({
			startDate: c
		},
		function(i, h) {
			var j = h - i;
			var g = i.getTimezoneOffset() - h.getTimezoneOffset();
			if (j >= f) {
				d = new Date(i - 0 + f);
				return false
			} else {
				f -= j + g * 60 * 1000
			}
		});
		return d
	},
	calculateStartDate: function(d, c, b) {
		if (!c) {
			return new Date(d)
		}
		var a;
		c = this.convertDurationToMs(c, b);
		this.forEachAvailabilityInterval({
			endDate: d,
			isForward: false
		},
		function(f, e) {
			var g = e - f;
			if (g >= c) {
				a = new Date(e - c);
				return false
			} else {
				c -= g
			}
		});
		return a
	},
	skipNonWorkingTime: function(a, b) {
		this.forEachAvailabilityInterval(b ? {
			startDate: a
		}: {
			endDate: a,
			isForward: false
		},
		function(d, c) {
			a = b ? d: c;
			return false
		});
		return new Date(a)
	},
	skipWorkingTime: function(a, c, b) {
		return c >= 0 ? this.calculateEndDate(a, c, b) : this.calculateStartDate(a, -c, b)
	},
	getAvailabilityIntervalsFor: function(a, b) {
		a = b ? a - 0: Ext.Date.clearTime(new Date(a)) - 0;
		if (this.availabilityIntervalsCache[a]) {
			return this.availabilityIntervalsCache[a]
		}
		return this.availabilityIntervalsCache[a] = this.getCalendarDay(a).getAvailabilityIntervalsFor(a)
	},
	getByInternalId: function(a) {
		return this.data.map[a]
	},
	getParentableCalendars: function() {
		var c = this,
		a = [],
		d = Gnt.data.Calendar.getAllCalendars();
		var b = function(e) {
			if (!e.parent) {
				return false
			}
			if (e.parent == c) {
				return true
			}
			return b(e.parent)
		};
		Ext.Array.each(d,
		function(e) {
			if (e === c) {
				return
			}
			if (!b(e)) {
				a.push({
					Id: e.calendarId,
					Name: e.name || e.calendarId
				})
			}
		});
		return a
	},
	setParent: function(e) {
		var d = Gnt.data.Calendar.getCalendar(e);
		if (e && !d) {
			throw new Error("Invalid parent specified for the calendar")
		}
		if (this.parent != d) {
			var b = this.proxy;
			var c = {
				calendarchange: this.clearCache,
				scope: this
			};
			var a = this.parent;
			if (a) {
				a.un(c)
			}
			this.parent = d;
			if (d) {
				d.on(c)
			}
			if (b && b.extraParams) {
				b.extraParams.parentId = d ? d.calendarId: null
			}
			this.clearCache();
			this.fireEvent("parentchange", this, d, a)
		}
	},
	isAvailabilityIntersected: function(p, b, m) {
		var n,
		a,
		e,
		h;
		for (var g = 0; g < 7; g++) {
			n = this.getWeekDay(g) || this.getDefaultCalendarDay(g);
			e = p.getWeekDay(g) || p.getDefaultCalendarDay(g);
			if (!n || !e) {
				continue
			}
			a = n.getAvailability();
			h = e.getAvailability();
			for (var f = 0, c = a.length; f < c; f++) {
				for (var d = 0, o = h.length; d < o; d++) {
					if (h[d].startTime < a[f].endTime && h[d].endTime > a[f].startTime) {
						return true
					}
				}
			}
		}
		var q = false;
		this.forEachNonStandardWeek(function(i) {
			if (i.startDate >= m) {
				return false
			}
			if (b < i.endDate) {
				q = true;
				return false
			}
		});
		return q
	}
});
Ext.define("Gnt.data.calendar.BusinessTime", {
	extend: "Gnt.data.Calendar",
	daysPerMonth: 20,
	daysPerWeek: 5,
	hoursPerDay: 8,
	defaultAvailability: ["08:00-12:00", "13:00-17:00"]
});
Ext.define("Gnt.data.DependencyStore", {
	extend: "Ext.data.Store",
	model: "Gnt.model.Dependency",
	taskStore: null,
	methodsCache: null,
	strictDependencyValidation: false,
	constructor: function() {
		this.callParent(arguments);
		this.init()
	},
	init: function() {
		this.methodsCache = {};
		this.on({
			add: this.resetMethodsCache,
			update: this.resetMethodsCache,
			remove: this.resetMethodsCache,
			beforesync: this.onBeforeSyncOperation,
			scope: this
		})
	},
	onBeforeSyncOperation: function(a) {
		if (a.create) {
			for (var c, b = a.create.length - 1; b >= 0; b--) {
				c = a.create[b];
				if (!c.isPersistable()) {
					Ext.Array.remove(a.create, c)
				}
			}
			if (a.create.length === 0) {
				delete a.create
			}
		}
		return Boolean((a.create && a.create.length > 0) || (a.update && a.update.length > 0) || (a.destroy && a.destroy.length > 0))
	},
	getDependenciesForTask: function(b) {
		var g = b.getId() || b.internalId;
		var e = [],
		f = this;
		for (var d = 0, a = f.getCount(); d < a; d++) {
			var c = f.getAt(d);
			if (c.getSourceId() == g || c.getTargetId() == g) {
				e.push(c)
			}
		}
		return e
	},
	getIncomingDependenciesForTask: function(b) {
		var g = b.getId() || b.internalId;
		var e = [],
		f = this;
		for (var d = 0, a = f.getCount(); d < a; d++) {
			var c = f.getAt(d);
			if (c.getTargetId() == g) {
				e.push(c)
			}
		}
		return e
	},
	getOutgoingDependenciesForTask: function(b) {
		var g = b.getId() || b.internalId;
		var e = [],
		f = this;
		for (var d = 0, a = f.getCount(); d < a; d++) {
			var c = f.getAt(d);
			if (c.getSourceId() == g) {
				e.push(c)
			}
		}
		return e
	},
	hasTransitiveDependency: function(d, b, a) {
		var c = this;
		return this.findBy(function(f) {
			var e = f.getTargetId();
			if (f.getSourceId() == d) {
				return (e == b && f !== a) ? true: c.hasTransitiveDependency(e, b, a)
			}
		}) >= 0
	},
	resetMethodsCache: function() {
		this.methodsCache = {}
	},
	isMethodCached: function(b, a) {
		return this.methodsCache[b] && this.methodsCache[b].hasOwnProperty[a]
	},
	getMethodCache: function(b, a) {
		if (this.isMethodCached(b, a)) {
			return this.methodsCache[b][a]
		}
	},
	setMethodCache: function(c, a, b) {
		this.methodsCache[c] = this.methodsCache[c] || {};
		this.methodsCache[c][a] = b
	},
	groupsHasTransitiveDependency: function(i, b, d, c) {
		var f = i + "-" + b.getInternalId() + "-" + (d && (d.getId() || d.internalId) || "");
		if (this.isMethodCached("groupsHasTransitiveDependency", f)) {
			return this.methodsCache.groupsHasTransitiveDependency[f]
		}
		var h = this.getTaskStore().getRootNode(),
		j = false,
		g = this,
		a = this.getSourceTask(i);
		if (!c) {
			c = {};
			b.cascadeBy(function(k) {
				c[k.getInternalId()] = true
			})
		}
		var e = function(k) {
			if (k !== h) {
				k = k.getInternalId();
				j = g.findBy(function(m) {
					var l = m.getTargetId();
					if (m.getSourceId() == k) {
						return (c[l] && m !== d) ? true: g.groupsHasTransitiveDependency(l, b, d, c)
					}
				}) >= 0;
				if (j) {
					return false
				}
			}
		};
		a.getTopParent().cascadeBy(e);
		if (j) {
			return true
		}
		this.setMethodCache("groupsHasTransitiveDependency", f, j);
		return j
	},
	isValidDependency: function(c, a, h, i) {
		var d,
		g,
		e;
		if (c instanceof Gnt.model.Dependency) {
			d = c.getSourceId();
			g = this.getSourceTask(d);
			a = c.getTargetId();
			e = this.getTargetTask(a)
		} else {
			d = c;
			g = this.getSourceTask(d);
			e = this.getTargetTask(a)
		}
		if (!i && c instanceof Gnt.model.Dependency && !c.isValid()) {
			return false
		} else {
			if (!d || !a || d == a) {
				return false
			}
		}
		if (g && e && (g.contains(e) || e.contains(g))) {
			return false
		}
		var b = i || (c instanceof Gnt.model.Dependency),
		f = b ? c: null;
		if ((!b && this.areTasksLinked(d, a)) || this.hasTransitiveDependency(a, d, f)) {
			return false
		}
		if (this.strictDependencyValidation) {
			if (this.groupsHasTransitiveDependency(e.getInternalId(), g.getTopParent(), f)) {
				return false
			}
		}
		return true
	},
	areTasksLinked: function(c, d) {
		var b = c instanceof Gnt.model.Task ? (c.getId() || c.internalId) : c;
		var a = d instanceof Gnt.model.Task ? (d.getId() || d.internalId) : d;
		return !! this.getByTaskIds(b, a)
	},
	getByTaskIds: function(c, b) {
		var a = this.findBy(function(f) {
			var d = f.getTargetId(),
			e = f.getSourceId();
			if ((e === c && d === b) || (e === b && d === c)) {
				return true
			}
		});
		return this.getAt(a)
	},
	getSourceTask: function(a) {
		var b = a instanceof Gnt.model.Dependency ? a.getSourceId() : a;
		return this.getTaskStore().getById(b)
	},
	getTargetTask: function(a) {
		var b = a instanceof Gnt.model.Dependency ? a.getTargetId() : a;
		return this.getTaskStore().getById(b)
	},
	getTaskStore: function() {
		return this.taskStore
	}
});
Ext.define("Gnt.data.TaskStore", {
	extend: "Ext.data.TreeStore",
	requires: ["Gnt.model.Task", "Gnt.data.Calendar", "Gnt.data.DependencyStore", "Gnt.patches.Tree"],
	mixins: ["Sch.data.mixin.FilterableTreeStore", "Sch.data.mixin.EventStore"],
	model: "Gnt.model.Task",
	calendar: null,
	dependencyStore: null,
	resourceStore: null,
	assignmentStore: null,
	weekendsAreWorkdays: false,
	cascadeChanges: false,
	batchSync: true,
	recalculateParents: true,
	skipWeekendsDuringDragDrop: true,
	cascadeDelay: 0,
	availabilitySearchLimit: 1825,
	cascading: false,
	isFillingRoot: false,
	earlyStartDates: null,
	earlyEndDates: null,
	lateStartDates: null,
	lateEndDates: null,
	lastTotalTimeSpan: null,
	constructor: function(c) {
		this.addEvents("filter", "clearfilter", "beforecascade", "cascade");
		c = c || {};
		if (!c.calendar) {
			var a = {};
			if (c.hasOwnProperty("weekendsAreWorkdays")) {
				a.weekendsAreWorkdays = c.weekendsAreWorkdays
			} else {
				if (this.self.prototype.hasOwnProperty("weekendsAreWorkdays") && this.self != Gnt.data.TaskStore) {
					a.weekendsAreWorkdays = this.weekendsAreWorkdays
				}
			}
			c.calendar = new Gnt.data.Calendar(a)
		}
		var b = c.dependencyStore || this.dependencyStore || Ext.create("Gnt.data.DependencyStore");
		delete c.dependencyStore;
		this.setDependencyStore(b);
		var d = c.resourceStore || this.resourceStore || Ext.create("Gnt.data.ResourceStore");
		delete c.resourceStore;
		this.setResourceStore(d);
		var f = c.assignmentStore || this.assignmentStore || Ext.create("Gnt.data.AssignmentStore", {
			resourceStore: d
		});
		delete c.assignmentStore;
		this.setAssignmentStore(f);
		var e = c.calendar;
		if (e) {
			delete c.calendar;
			this.setCalendar(e, true)
		}
		this.resetEarlyDates();
		this.resetLateDates();
		this.mixins.observable.constructor.call(this);
		this.on({
			beforefill: this.onRootBeforeFill,
			fillcomplete: this.onRootFillEnd,
			remove: this.onTaskDeleted,
			write: this.onTaskStoreWrite,
			sort: this.onSorted,
			scope: this
		});
		this.callParent([c]);
		if (this.autoSync) {
			if (this.batchSync) {
				this.sync = Ext.Function.createBuffered(this.sync, 500)
			} else {
				this.on("beforesync", this.onTaskStoreBeforeSync, this)
			}
		}
		this.initTreeFiltering();
		this.treeStore = this
	},
	load: function() {
		this.un("remove", this.onTaskDeleted, this);
		this.callParent(arguments);
		this.on("remove", this.onTaskDeleted, this)
	},
	loadData: function(E, y) {
		var C = this,
		t = C.getRootNode(),
		c = y ? y.addRecords: false,
		v = y ? y.syncStore: false;
		C.suspendAutoSync();
		C.suspendEvents();
		if (!c && t) {
			t.removeAll()
		}
		if (!C.getRootNode()) {
			t = C.setRootNode()
		}
		if (E.length) {
			var f = E.length,
			e = C.model,
			o = [],
			w = (typeof E[0].get === "function"),
			b,
			r,
			p,
			z,
			B,
			D,
			x,
			n,
			h,
			q;
			var A = C.sortNewNodesByIndex(E);
			for (var u = 0; u < f; u++) {
				r = C.getById(E[u].getId ? E[u].getId() : E[u].Id);
				q = false;
				b = 0;
				if (r) {
					z = w ? E[u].get("parentId") : E[u].parentId;
					B = r.parentNode.getId();
					D = w ? E[u].get("index") : E[u].index;
					x = r.get("index");
					if (((typeof z !== "undefined" || z === null) ? (z !== B) : false) || (typeof D !== "undefined" ? (D !== x) : false)) {
						n = z === null ? t: C.getById(z);
						h = B === null ? t: C.getById(B);
						if (n && (n.get("parentId") === r.getId()) && C.selfChildInRecordsData(r.getId(), z, A)) {
							q = true
						}
					} else {
						b = 1
					}
				} else {
					r = w ? new e(E[u].data) : new e(E[u]);
					B = r.get("parentId");
					if (B) {
						n = C.getById(B)
					} else {
						if (B === null) {
							n = t
						}
					}
				}
				if (!q) {
					if (w) {
						r.set(E[u].data)
					} else {
						r.set(E[u])
					}
				} else {
					continue
				}
				if (n && !b) {
					C.moveChildren(r, n, h, A);
					C.fixNodeDates(r)
				} else {
					if (typeof n === "undefined" && !b) {
						p = {
							node: r,
							index: r.get("index") || 0,
							parentId: r.get("parentId")
						};
						o.push(p)
					} else {
						C.fixNodeDates(r)
					}
				}
				if (n && !v) {
					n.commit();
					r.commit();
					if (h) {
						h.commit()
					}
				}
			}
			var g = 0,
			m = 0,
			j = o.length,
			d,
			k;
			while (o.length) {
				if (g > o.length - 1) {
					g = 0;
					m = 1
				}
				d = o[g];
				k = d.parentId === null ? t: C.getById(d.parentId);
				if (k) {
					var a = C.nodeIsChild(d.node, n);
					if (a) {
						k.insertChild(d.index, d.node);
						C.fixNodeDates(d.node);
						o.splice(g, 1);
						if (!v) {
							k.commit();
							d.node.commit()
						}
						g -= 1
					}
				}
				g += 1;
				if (m && g === j - 1 && o.length === j) {
					throw "Invalid data, possible infinite loop."
				}
			}
			if (C.nodesToExpand) {
				u = 0;
				for (var s = C.nodesToExpand.length; u < s; u += 1) {
					r = C.nodesToExpand[u];
					if (r.childNodes && r.childNodes.length) {
						r.expand()
					}
				}
				delete C.nodesToExpand
			}
		}
		C.resumeAutoSync();
		C.resumeEvents();
		this.fireEvent("datachanged");
		this.fireEvent("refresh");
		if (v) {
			C.sync()
		}
		if (this.buffered) {}
	},
	selfChildInRecordsData: function(d, c, b) {
		var a = false;
		a = typeof b[c] === "undefined" ? true: b[c] === d;
		return a
	},
	sortNewNodesByIndex: function(c) {
		var b = {},
		a = function(d, e) {
			if (typeof d.get === "function") {
				return d.get(e)
			}
			return d[e]
		};
		Ext.Array.each(c,
		function(d) {
			b[a(d, "Id")] = a(d, "parentId")
		});
		Ext.Array.sort(c,
		function(e, i) {
			var h = a(e, "index"),
			g = a(i, "index"),
			f = a(e, "parentId"),
			d = a(i, "parentId");
			if (typeof h !== "undefined" && typeof g !== "undefined") {
				if (f === d) {
					return (h < g) ? -1: (h > g) ? 1: 0
				} else {
					if (f === null) {
						return 1
					} else {
						if (d === null) {
							return - 1
						} else {
							return (f < d) ? -1: 1
						}
					}
				}
			}
			return 0
		});
		return b
	},
	fixNodeDates: function(b) {
		var c = b.calculateDuration(b.getStartDate(), b.getEndDate(), b.getDurationUnit()),
		a;
		b.set({
			Duration: c
		});
		if (this.recalculateParents) {
			if (b.childNodes.length) {
				a = b.getChildAt(0);
				a.recalculateParents()
			} else {
				b.recalculateParents()
			}
		}
	},
	nodeIsChild: function(c, b) {
		var d = b.getId(),
		a = true;
		if (c.childNodes.length) {
			c.cascadeBy(function(e) {
				if (e.getId() === d) {
					a = false;
					return false
				}
			})
		}
		return a
	},
	moveChildren: function(e, d, c, f) {
		if (e.get("expanded")) {
			if (!this.nodesToExpand) {
				this.nodesToExpand = []
			}
			this.nodesToExpand.push(e);
			e.set("expanded", false)
		}
		var b,
		h = this.nodeIsChild(e, d),
		g = f ? !this.selfChildInRecordsData(e.getId(), d.getId(), f) : true,
		a = c || this.getById(e.get("parentId"));
		if (!h && g) {
			d.set("parentId", null);
			this.moveChildren(d, this.getRootNode(), e)
		}
		if (h || g) {
			if (e.childNodes.length) {
				b = e.copy(null, true);
				e.removeAll()
			}
			if (a && a.getId() !== d.getId()) {
				a.removeChild(e)
			}
			typeof e.get("index") !== "undefined" ? d.insertChild(e.get("index"), e) : d.appendChild(e);
			if (b) {
				b.cascadeBy(function(j) {
					if (j !== b) {
						var i = j.copy(null);
						i.get("index") ? e.insertChild(i.get("index"), i) : e.appendChild(i)
					}
				})
			}
			this.fixNodeDates(e)
		}
	},
	setRootNode: function() {
		var b = this;
		this.tree.setRootNode = Ext.Function.createInterceptor(this.tree.setRootNode,
		function(c) {
			Ext.apply(c, {
				calendar: b.calendar,
				taskStore: b,
				dependencyStore: b.dependencyStore,
				phantom: false,
				dirty: false
			})
		});
		var a = this.callParent(arguments);
		delete this.tree.setRootNode;
		return a
	},
	onRootBeforeFill: function() {
		this.isFillingRoot = true;
		this.un({
			append: this.onNodeUpdated,
			insert: this.onNodeUpdated,
			update: this.onTaskUpdated,
			scope: this
		})
	},
	onRootFillEnd: function(b, a) {
		a.normalizeParent();
		this.on({
			append: this.onNodeUpdated,
			insert: this.onNodeUpdated,
			update: this.onTaskUpdated,
			scope: this
		});
		this.isFillingRoot = false
	},
	getDependencyStore: function() {
		return this.dependencyStore
	},
	setDependencyStore: function(a) {
		var b = {
			add: this.onDependencyAddOrUpdate,
			update: this.onDependencyAddOrUpdate,
			remove: this.onDependencyDelete,
			scope: this
		};
		if (this.dependencyStore) {
			this.dependencyStore.un(b)
		}
		if (a) {
			this.dependencyStore = Ext.StoreMgr.lookup(a);
			if (a) {
				a.taskStore = this;
				a.on(b)
			}
		} else {
			this.dependencyStore = null
		}
	},
	setResourceStore: function(a) {
		if (a) {
			this.resourceStore = Ext.StoreMgr.lookup(a);
			a.taskStore = this;
			a.normalizeResources()
		} else {
			this.resourceStore = null
		}
	},
	getResourceStore: function() {
		return this.resourceStore || null
	},
	setAssignmentStore: function(b) {
		var a = {
			add: this.onAssignmentStructureMutation,
			update: this.onAssignmentMutation,
			remove: this.onAssignmentStructureMutation,
			scope: this
		};
		if (this.assignmentStore) {
			this.assignmentStore.un(a)
		}
		if (b) {
			this.assignmentStore = Ext.StoreMgr.lookup(b);
			b.taskStore = this;
			b.on(a)
		} else {
			this.assignmentStore = null
		}
	},
	getAssignmentStore: function() {
		return this.assignmentStore || null
	},
	renormalizeTasks: function(c, b) {
		this.resetEarlyDates();
		this.resetLateDates();
		if (b instanceof Gnt.model.Task) {
			b.adjustToCalendar()
		} else {
			var a = this.getRootNode();
			if (a) {
				a.cascadeBy(function(d) {
					d.adjustToCalendar()
				})
			}
		}
	},
	getCalendar: function() {
		return this.calendar || null
	},
	setCalendar: function(d, b) {
		var c = {
			calendarchange: this.renormalizeTasks,
			scope: this
		};
		if (this.calendar) {
			this.calendar.un(c)
		}
		this.calendar = d;
		d.on(c);
		var a = this.tree && this.getRootNode();
		if (a) {
			a.calendar = d
		}
		if (!b) {
			this.renormalizeTasks()
		}
	},
	getCriticalPaths: function() {
		var b = this.getRootNode(),
		a = [],
		d = new Date(0);
		b.cascadeBy(function(e) {
			d = Sch.util.Date.max(e.getEndDate(), d)
		});
		b.cascadeBy(function(e) {
			if (d - e.getEndDate() === 0 && !e.isRoot() && !(!e.isLeaf() && e.childNodes.length)) {
				a.push(e)
			}
		});
		var c = [];
		Ext.each(a,
		function(e) {
			c.push(e.getCriticalPaths())
		});
		return c
	},
	onNodeUpdated: function(b, c) {
		if (!c.isRoot()) {
			if (this.lastTotalTimeSpan) {
				var a = this.getTotalTimeSpan();
				if (c.getEndDate() > a.end || c.getStartDate() < a.start) {
					this.lastTotalTimeSpan = null
				}
			}
			if (c.getEndDate() - this.getProjectEndDate() === 0) {
				this.resetLateDates()
			}
			if (!this.cascading && this.recalculateParents) {
				c.recalculateParents()
			}
		}
	},
	getViolatedConstraints: function(a) {
		var c = this,
		b = 0,
		d = [];
		this.dependencyStore.each(function(f) {
			var h = f.getSourceTask();
			var g = f.getTargetTask();
			if (h && g) {
				var e = g.getViolatedConstraints();
				if (e) {
					b++;
					d.push(e)
				}
				if (a && (b >= a)) {
					return false
				}
			}
		});
		return d
	},
	onTaskUpdated: function(c, b, a) {
		var f = b.previous;
		if (this.lastTotalTimeSpan) {
			var d = this.getTotalTimeSpan();
			if (f && (f[b.endDateField] - d.end === 0 || f[b.startDateField] - d.start === 0) || (b.getEndDate() > d.end || b.getStartDate() < d.start)) {
				this.lastTotalTimeSpan = null
			}
		}
		if (!this.cascading && a !== Ext.data.Model.COMMIT && f) {
			if (b.startDateField in f || b.endDateField in f || "parentId" in f || b.effortField in f || b.percentDoneField in f || f[b.schedulingModeField] == "Manual") {
				var e = b;
				if (this.cascadeChanges) {
					if (f[e.schedulingModeField] == "Manual") {
						var g = e.getIncomingDependencies();
						if (g.length) {
							e = g[0].getSourceTask()
						}
					}
					Ext.Function.defer(this.cascadeChangesForTask, this.cascadeDelay, this, [e])
				} else {
					this.resetEarlyDates();
					this.resetLateDates()
				}
				if (this.recalculateParents) {
					e.recalculateParents()
				}
			} else {
				if (f[b.schedulingModeField] && b.isManuallyScheduled()) {
					this.resetEarlyDates();
					this.resetLateDates()
				}
			}
		}
	},
	cascadeChangesForTask: function(a) {
		var c = this,
		b = {
			nbrAffected: 0
		};
		Ext.each(a.getOutgoingDependencies(),
		function(d) {
			var e = d.getTargetTask();
			if (e) {
				if (!c.cascading) {
					c.fireEvent("beforecascade", c)
				}
				c.cascading = true;
				e.cascadeChanges(c, b, d)
			}
		});
		if (c.cascading) {
			c.cascading = false;
			c.fireEvent("cascade", c, b);
			this.resetEarlyDates();
			this.resetLateDates()
		}
	},
	onTaskDeleted: function(f, e, b) {
		var c = this.dependencyStore;
		var h;
		if (c && !e.isReplace && !b) {
			h = e.getAllDependencies(c);
			c.remove(h)
		}
		var d = this.getTotalTimeSpan();
		var a = e.getStartDate();
		var g = e.getEndDate();
		if (g - d.end === 0 || a - d.start === 0) {
			this.lastTotalTimeSpan = null
		}
		this.resetEarlyDates();
		this.resetLateDates()
	},
	onAssignmentMutation: function(c, a) {
		var b = this;
		Ext.each(a,
		function(e) {
			var d = e.getTask(b);
			if (d) {
				d.onAssignmentMutation(e)
			}
		})
	},
	onAssignmentStructureMutation: function(c, a) {
		var b = this;
		Ext.each(a,
		function(e) {
			var d = e.getTask(b);
			if (d) {
				d.onAssignmentStructureMutation(e)
			}
		})
	},
	onDependencyAddOrUpdate: function(b, d) {
		this.resetEarlyDates();
		this.resetLateDates();
		if (this.cascadeChanges) {
			var c = this,
			a;
			Ext.each(d,
			function(e) {
				a = e.getTargetTask();
				if (a) {
					a.constrain(c)
				}
			})
		}
	},
	onDependencyDelete: function(a, b) {
		this.resetEarlyDates();
		this.resetLateDates()
	},
	getNewRecords: function() {
		return Ext.Array.filter(this.tree.flatten(), this.filterNew, this)
	},
	getUpdatedRecords: function() {
		return Ext.Array.filter(this.tree.flatten(), this.filterUpdated, this)
	},
	filterNew: function(a) {
		return a.phantom && a.isValid() && a != this.tree.root
	},
	filterUpdated: function(a) {
		return a.dirty && !a.phantom && a.isValid() && a != this.tree.root
	},
	onTaskStoreBeforeSync: function(b, c) {
		var a = b.create;
		if (a) {
			for (var e, d = a.length - 1; d >= 0; d--) {
				e = a[d];
				if (!e.isPersistable()) {
					Ext.Array.remove(a, e)
				}
			}
			if (a.length === 0) {
				delete b.create
			}
		}
		return Boolean((b.create && b.create.length > 0) || (b.update && b.update.length > 0) || (b.destroy && b.destroy.length > 0))
	},
	onTaskStoreWrite: function(c, b) {
		var d = this.dependencyStore;
		if (!d || b.action !== "create") {
			return
		}
		var a = b.getRecords(),
		e;
		Ext.each(a,
		function(f) {
			e = f.getId();
			if (!f.phantom && e !== f._phantomId) {
				Ext.each(d.getNewRecords(),
				function(g) {
					var i = g.getSourceId();
					var h = g.getTargetId();
					if (i === f._phantomId) {
						g.setSourceId(e)
					} else {
						if (h === f._phantomId) {
							g.setTargetId(e)
						}
					}
				});
				Ext.each(f.childNodes,
				function(g) {
					if (g.phantom) {
						g.set("parentId", e)
					}
				});
				delete f._phantomId
			}
		})
	},
	forEachTaskUnOrdered: function(c, b) {
		var e = this.tree.nodeHash;
		var a = this.getRootNode();
		for (var d in e) {
			if (e[d] !== a) {
				c.call(b || this, e[d])
			}
		}
	},
	getTasksTimeSpan: function(d) {
		var a = new Date(9999, 0, 1),
		b = new Date(0);
		var c = function(f) {
			var e = f.getStartDate();
			var g = f.getEndDate();
			if (e && e < a) {
				a = e
			}
			if (e && g && g > b) {
				b = g
			}
		};
		if (d) {
			if (!Ext.isArray(d)) {
				d = [d]
			}
			Ext.Array.each(d, c)
		} else {
			this.forEachTaskUnOrdered(c)
		}
		a = a < new Date(9999, 0, 1) ? a: null;
		b = b > new Date(0) ? b: null;
		return {
			start: a,
			end: b || (a && Ext.Date.add(a, Ext.Date.DAY, 1)) || null
		}
	},
	getTotalTimeSpan: function() {
		if (this.lastTotalTimeSpan) {
			return this.lastTotalTimeSpan
		}
		this.lastTotalTimeSpan = this.getTasksTimeSpan();
		return this.lastTotalTimeSpan
	},
	getProjectStartDate: function() {
		return this.getTotalTimeSpan().start
	},
	getProjectEndDate: function() {
		return this.getTotalTimeSpan().end
	},
	getCount: function(b) {
		var a = b === false ? 0: -1;
		this.getRootNode().cascadeBy(function() {
			a++
		});
		return a
	},
	toArray: function() {
		var a = [];
		this.getRootNode().cascadeBy(function(b) {
			a.push(b)
		});
		return a
	},
	remove: function(a) {
		Ext.each(a,
		function(b) {
			b.remove()
		})
	},
	indent: function(a) {
		a = Ext.isArray(a) ? a.slice() : [a];
		a.sort(function(d, c) {
			return d.data.index - c.data.index
		});
		Ext.each(a,
		function(b) {
			b.indent()
		})
	},
	outdent: function(a) {
		a = Ext.isArray(a) ? a.slice() : [a];
		a.sort(function(d, c) {
			return c.data.index - d.data.index
		});
		Ext.each(a,
		function(b) {
			b.outdent()
		})
	},
	getTasksForResource: function(a) {
		return a.getTasks()
	},
	getEventsForResource: function(a) {
		return this.getTasksForResource(a)
	},
	indexOf: function(a) {
		return a && this.tree.getNodeById(a.internalId) ? 0: -1
	},
	getByInternalId: function(a) {
		return this.tree.getNodeById(a)
	},
	queryBy: function(b, a) {
		var d = [];
		var c = this;
		this.getRootNode().cascadeBy(function(e) {
			if (b.call(a || c, e)) {
				d.push(e)
			}
		});
		return d
	},
	onSorted: function() {
		if (this.lastTreeFilter) {
			this.filterTreeBy(this.lastTreeFilter)
		}
	},
	append: function(a) {
		this.getRootNode().appendChild(a)
	},
	resetEarlyDates: function() {
		this.earlyStartDates = {};
		this.earlyEndDates = {};
		this.fireEvent("resetearlydates")
	},
	resetLateDates: function() {
		this.lateStartDates = {};
		this.lateEndDates = {};
		this.fireEvent("resetlatedates")
	}
});
Ext.define("Gnt.data.ResourceStore", {
	requires: ["Gnt.model.Resource"],
	extend: "Sch.data.ResourceStore",
	model: "Gnt.model.Resource",
	taskStore: null,
	constructor: function() {
		this.mixins.observable.constructor.call(this);
		this.on({
			load: this.normalizeResources,
			scope: this
		});
		this.callParent(arguments)
	},
	normalizeResources: function() {
		this.each(function(b) {
			if (!b.normalized) {
				var a = b.getCalendarId();
				if (a) {
					b.setCalendarId(a, true)
				}
				b.normalized = true
			}
		})
	},
	getTaskStore: function() {
		return this.taskStore || null
	},
	getAssignmentStore: function() {
		return this.assignmentStore || null
	},
	getByInternalId: function(a) {
		return this.data.getByKey(a) || this.getById(a)
	}
});
Ext.define("Gnt.data.AssignmentStore", {
	extend: "Ext.data.Store",
	requires: ["Gnt.model.Assignment"],
	model: "Gnt.model.Assignment",
	taskStore: null,
	getTaskStore: function() {
		return this.taskStore
	},
	getResourceStore: function() {
		return this.getTaskStore().resourceStore
	},
	getByInternalId: function(a) {
		return this.data.getByKey(a) || this.getById(a)
	}
});
Ext.define("Gnt.patches.ColumnResize", {
	override: "Gnt.panel.Gantt",
	afterRender: function() {
		this.callParent(arguments);
		var a = this.lockedGrid.headerCt.findPlugin("gridheaderresizer");
		if (a) {
			a.getConstrainRegion = function() {
				var d = this,
				b = d.dragHd.el,
				c;
				if (d.headerCt.forceFit) {
					c = d.dragHd.nextNode("gridcolumn:not([hidden]):not([isGroupHeader])");
					if (!d.headerInSameGrid(c)) {
						c = null
					}
				}
				return d.adjustConstrainRegion(Ext.util.Region.getRegion(b), 0, d.headerCt.forceFit ? (c ? c.getWidth() - d.minColWidth: 0) : d.maxColWidth - b.getWidth(), 0, d.minColWidth)
			}
		}
	}
});
Ext.define("Gnt.patches.IETreeStore", {
	extend: "Sch.util.Patch",
	requires: ["Gnt.data.TaskStore"],
	target: "Gnt.data.TaskStore",
	ieOnly: true,
	overrides: {
		onNodeAdded: function(c, e) {
			var d = this,
			b = d.getProxy(),
			a = b.getReader(),
			f = e.raw || e[e.persistenceProperty],
			g;
			Ext.Array.remove(d.removed, e);
			e.join(d);
			if (!e.isLeaf()) {
				g = a.getRoot(f);
				if (g) {
					d.fillNode(e, a.extractData(g));
					if (f[a.root]) {
						delete f[a.root]
					}
				}
			}
			if (d.autoSync && !d.autoSyncSuspended && (e.phantom || e.dirty)) {
				d.sync()
			}
		}
	}
});
Ext.define("Gnt.template.Template", {
	extend: "Ext.XTemplate",
	isLegacyIE: Ext.isIE8m || Ext.isIEQuirks,
	getInnerTpl: Ext.emptyFn,
	innerTpl: null,
	dependencyTerminalMarkup: '<div class="sch-gantt-terminal sch-gantt-terminal-start"></div><div class="sch-gantt-terminal sch-gantt-terminal-end"></div>',
	constructor: function(a) {
		Ext.apply(this, a);
		var c = a.rtl ? "right": "left";
		var b = this.getInnerTpl(a) || "";
		this.callParent(['<div class="sch-event-wrap {ctcls} ' + Ext.baseCSSPrefix + 'unselectable" style="' + c + ':{offset}px">' + (a.leftLabel ? '<div class="sch-gantt-labelct sch-gantt-labelct-left"><label class="sch-gantt-label sch-gantt-label-left">{leftLabel}</label></div>': "") + (a.rightLabel ? '<div class="sch-gantt-labelct sch-gantt-labelct-right" style="left:{width}px"><label class="sch-gantt-label sch-gantt-label-right">{rightLabel}</label></div>': "") + (a.topLabel ? '<div class="sch-gantt-labelct sch-gantt-labelct-top"><label class="sch-gantt-label sch-gantt-label-top">{topLabel}</label></div>': "") + b + (a.bottomLabel ? '<div class="sch-gantt-labelct sch-gantt-labelct-bottom"><label class="sch-gantt-label sch-gantt-label-bottom">{bottomLabel}</label></div>': "") + "</div>", {
			compiled: true,
			disableFormats: true
		}])
	}
});
Ext.define("Gnt.template.Task", {
	extend: "Gnt.template.Template",
	innerTpl: '<div class="sch-gantt-progress-bar" style="width:{percentDone}%;{progressBarStyle}" unselectable="on">&#160;</div>',
	getInnerTpl: function(a) {
		var b = a.rtl ? "right": "left";
		return '<div id="' + a.prefix + '{id}" class="sch-gantt-item sch-gantt-task-bar {cls}" unselectable="on" style="width:{width}px;{style}">' + ((a.resizeHandles === "both" || a.resizeHandles === "left") ? '<div class="sch-resizable-handle sch-gantt-task-handle sch-resizable-handle-start sch-resizable-handle-west"></div>': "") + this.innerTpl + ((a.resizeHandles === "both" || a.resizeHandles === "right") ? '<div class="sch-resizable-handle sch-gantt-task-handle sch-resizable-handle-end sch-resizable-handle-east"></div>': "") + (a.enableProgressBarResize ? '<div style="' + b + ':{percentDone}%" class="sch-gantt-progressbar-handle"></div>': "") + (a.enableDependencyDragDrop ? this.dependencyTerminalMarkup: "") + "</div>"
	}
});
Ext.define("Gnt.template.Milestone", {
	extend: "Gnt.template.Template",
	innerTpl: (Ext.isIE8m || Ext.isIEQuirks ? ('<div style="border-width:{[Math.floor(values.side*0.7)]}px" class="sch-gantt-milestone-diamond-top {cls}" unselectable="on" style="{style}"></div><div style="border-width:{[Math.floor(values.side*0.7)]}px" class="sch-gantt-milestone-diamond-bottom {cls}" unselectable="on" style="{style}"></div>') : ('<img style="{[values.print ? "height:" + values.side + "px;border-left-width:" + values.side + "px" : ""]};{style}" src="' + Ext.BLANK_IMAGE_URL + '" class="sch-gantt-milestone-diamond {cls}" unselectable="on"/>')),
	getInnerTpl: function(a) {
		return "<div " + (this.isLegacyIE ? 'style="width:{[Math.floor(values.side*0.7)]}px"': "") + ' id="' + a.prefix + '{id}" class="sch-gantt-item sch-gantt-milestone-diamond-ct">' + this.innerTpl + (a.enableDependencyDragDrop ? this.dependencyTerminalMarkup: "") + "</div>"
	}
});
Ext.define("Gnt.template.ParentTask", {
	extend: "Gnt.template.Template",
	innerTpl: '<div class="sch-gantt-progress-bar" style="width:{percentDone}%;{progressBarStyle}">&#160;</div><div class="sch-gantt-parenttask-arrow sch-gantt-parenttask-leftarrow"></div><div class="sch-gantt-parenttask-arrow sch-gantt-parenttask-rightarrow"></div>',
	getInnerTpl: function(a) {
		return '<div id="' + a.prefix + '{id}" class="sch-gantt-item sch-gantt-parenttask-bar {cls}" style="width:{width}px; {style}">' + this.innerTpl + (a.enableDependencyDragDrop ? this.dependencyTerminalMarkup: "") + "</div>"
	}
});
Ext.define("Gnt.Tooltip", {
	extend: "Ext.ToolTip",
	alias: "widget.gantt_task_tooltip",
	requires: ["Ext.Template"],
	mixins: ["Gnt.mixin.Localizable"],
	mode: "startend",
	cls: "sch-tip",
	height: 40,
	autoHide: false,
	anchor: "b-tl",
	maskOnDisable: false,
	initComponent: function() {
		this.rtl = this.gantt.rtl;
		if (this.mode === "startend" && !this.startEndTemplate) {
			this.startEndTemplate = new Ext.Template('<div class="sch-timetipwrap {cls}"><div>' + this.L("startText") + "{startText}</div><div>" + this.L("endText") + "{endText}</div></div>").compile()
		}
		if (this.mode === "duration" && !this.durationTemplate) {
			this.durationTemplate = new Ext.Template('<div class="sch-timetipwrap {cls}">', "<div>" + this.L("startText") + " {startText}</div>", "<div>" + this.L("durationText") + " {duration} {unit}</div>", "</div>").compile()
		}
		this.callParent(arguments)
	},
	update: function(e, b, d, a) {
		var c;
		if (this.mode === "duration") {
			c = this.getDurationContent(e, b, d, a)
		} else {
			c = this.getStartEndContent(e, b, d, a)
		}
		this.callParent([c])
	},
	getStartEndContent: function(b, f, a, h) {
		var e = this.gantt,
		i = e.getFormattedDate(b),
		d = i,
		g;
		if (f - b > 0) {
			d = e.getFormattedEndDate(f, b)
		}
		var c = {
			cls: a ? "sch-tip-ok": "sch-tip-notok",
			startText: i,
			endText: d
		};
		if (this.showClock) {
			Ext.apply(c, {
				startHourDegrees: roundedStart.getHours() * 30,
				startMinuteDegrees: roundedStart.getMinutes() * 6
			});
			if (f) {
				Ext.apply(c, {
					endHourDegrees: g.getHours() * 30,
					endMinuteDegrees: g.getMinutes() * 6
				})
			}
		}
		return this.startEndTemplate.apply(c)
	},
	getDurationContent: function(f, b, d, a) {
		var c = a.getDurationUnit() || Sch.util.Date.DAY;
		var e = a.calculateDuration(f, b, c);
		return this.durationTemplate.apply({
			cls: d ? "sch-tip-ok": "sch-tip-notok",
			startText: this.gantt.getFormattedDate(f),
			duration: parseFloat(Ext.Number.toFixed(e, 1)),
			unit: Sch.util.Date.getReadableNameOfUnit(c, e > 1)
		})
	},
	show: function(a) {
		if (a) {
			this.setTarget(a)
		}
		this.callParent([])
	}
});
Ext.define("Gnt.feature.TaskDragDrop", {
	extend: "Ext.dd.DragZone",
	requires: ["Gnt.Tooltip", "Ext.dd.StatusProxy", "Ext.dd.ScrollManager"],
	onDragEnter: Ext.emptyFn,
	onDragOut: Ext.emptyFn,
	constructor: function(b, a) {
		a = a || {};
		Ext.apply(this, a);
		if (Ext.isIE && (Ext.isIE8 || Ext.isIE7 || Ext.ieVersion < 9) && window.top !== window) {
			Ext.dd.DragDropManager.notifyOccluded = true
		}
		this.proxy = this.proxy || Ext.create("Ext.dd.StatusProxy", {
			shadow: false,
			dropAllowed: "sch-gantt-dragproxy",
			dropNotAllowed: "sch-gantt-dragproxy",
			ensureAttachedToBody: Ext.emptyFn
		});
		var d = this,
		c = d.gantt;
		if (d.useTooltip) {
			d.tip = Ext.create("Gnt.Tooltip", {
				cls: "gnt-dragdrop-tip",
				gantt: c
			})
		}
		d.callParent([b, Ext.apply(a, {
			ddGroup: d.gantt.id + "-task-dd"
		})]);
		d.scroll = false;
		d.isTarget = true;
		d.ignoreSelf = false;
		d.addInvalidHandleClass("sch-resizable-handle");
		d.addInvalidHandleClass(Ext.baseCSSPrefix + "resizable-handle");
		d.addInvalidHandleClass("sch-gantt-terminal");
		d.addInvalidHandleClass("sch-gantt-progressbar-handle");
		Ext.dd.ScrollManager.register(d.gantt.el);
		d.gantt.ownerCt.el.appendChild(this.proxy.el);
		d.gantt.on({
			destroy: d.cleanUp,
			scope: d
		})
	},
	useTooltip: true,
	validatorFn: function(a, b, d, c) {
		return true
	},
	validatorFnScope: null,
	cleanUp: function() {
		if (this.tip) {
			this.tip.destroy()
		}
		this.destroy()
	},
	containerScroll: false,
	dropAllowed: "sch-gantt-dragproxy",
	dropNotAllowed: "sch-gantt-dragproxy",
	destroy: function() {
		this.callParent(arguments);
		Ext.dd.ScrollManager.unregister(this.gantt.el)
	},
	autoOffset: function(a, e) {
		var d = this.dragData.repairXY,
		c = a - d[0],
		b = e - d[1];
		this.setDelta(c, b)
	},
	setXConstraint: function(c, b, a) {
		this.leftConstraint = c;
		this.rightConstraint = b;
		this.minX = c;
		this.maxX = b;
		if (a) {
			this.setXTicks(this.initPageX, a)
		}
		this.constrainX = true
	},
	setYConstraint: function(a, c, b) {
		this.topConstraint = a;
		this.bottomConstraint = c;
		this.minY = a;
		this.maxY = c;
		if (b) {
			this.setYTicks(this.initPageY, b)
		}
		this.constrainY = true
	},
	constrainTo: function(a, b) {
		this.resetConstraints();
		this.initPageX = a.left;
		this.initPageY = b.top;
		this.setXConstraint(a.left, a.right - (b.right - b.left), this.xTickSize);
		this.setYConstraint(b.top - 1, b.top - 1, this.yTickSize)
	},
	onDragOver: function(i, a) {
		var g = this.dragData,
		b = g.record,
		c = this.gantt,
		d = this.proxy.el,
		j = d.getX() + (c.rtl ? d.getWidth() : 0) + c.getXOffset(b),
		h = c.getDateFromXY([j, 0], "round");
		if (!g.hidden) {
			Ext.fly(g.sourceNode).hide();
			g.hidden = true
		}
		if (!h || h - g.start === 0) {
			return
		}
		g.start = h;
		this.valid = this.validatorFn.call(this.validatorFnScope || c, b, h, g.duration, i) !== false;
		if (this.tip) {
			var f = b.calculateEndDate(h, b.getDuration(), b.getDurationUnit());
			this.updateTip(b, h, f)
		}
	},
	onStartDrag: function() {
		var a = this.dragData.record;
		if (this.tip) {
			this.tip.enable();
			this.tip.show(Ext.get(this.dragData.sourceNode));
			this.updateTip(a, a.getStartDate(), a.getEndDate())
		}
		this.gantt.fireEvent("taskdragstart", this.gantt, a)
	},
	updateTip: function(b, c, a) {
		if (b.isMilestone() && c - Ext.Date.clearTime(c, true) === 0) {
			c = Sch.util.Date.add(c, Sch.util.Date.MILLI, -1);
			a = Sch.util.Date.add(a, Sch.util.Date.MILLI, -1)
		}
		this.tip.update(c, a, true)
	},
	getDragData: function(i) {
		var f = this.gantt,
		d = i.getTarget(f.eventSelector);
		if (d && !i.getTarget(".sch-gantt-baseline-item")) {
			var h = Ext.get(d),
			b = f.resolveTaskRecord(h),
			c = b.isMilestone();
			if (f.fireEvent("beforetaskdrag", f, b, i) === false) {
				return null
			}
			var a = d.cloneNode(true),
			k = f.getSnapPixelAmount(),
			j = h.getXY();
			a.id = Ext.id();
			var l = Ext.fly(d).getHeight();
			Ext.fly(a).setHeight(l - (Ext.isIE7 && !c ? 2: 0));
			if (Ext.isIE8m && c) {
				Ext.fly(a).setSize(l + 5, l + 5)
			}
			if (k >= 1) {
				Ext.fly(a).setStyle("left", "-" + f.getXOffset(b) + "px")
			}
			this.constrainTo(Ext.fly(f.findItemByChild(d)).getRegion(), h.getRegion());
			if (k >= 1) {
				this.setXConstraint(this.leftConstraint, this.rightConstraint, k)
			}
			return {
				sourceNode: d,
				repairXY: j,
				ddel: a,
				record: b,
				duration: Sch.util.Date.getDurationInMinutes(b.getStartDate(), b.getEndDate())
			}
		}
		return null
	},
	afterRepair: function() {
		Ext.fly(this.dragData.sourceNode).show();
		if (this.tip) {
			this.tip.hide()
		}
		this.dragging = false
	},
	getRepairXY: function() {
		this.gantt.fireEvent("aftertaskdrop", this.gantt);
		return this.dragData.repairXY
	},
	onDragDrop: function(g, i) {
		var f = this.cachedTarget || Ext.dd.DragDropMgr.getDDById(i),
		d = this.dragData,
		b = this.gantt,
		a = d.record,
		h = d.start;
		var c = false;
		if (this.tip) {
			this.tip.disable()
		}
		if (this.valid && h && a.getStartDate() - h !== 0) {
			b.taskStore.on("update",
			function() {
				c = true
			},
			null, {
				single: true
			});
			a.setStartDate(h, true, b.taskStore.skipWeekendsDuringDragDrop);
			if (c) {
				b.fireEvent("taskdrop", b, a);
				if (Ext.isIE9) {
					this.proxy.el.setStyle("visibility", "hidden");
					Ext.Function.defer(this.onValidDrop, 10, this, [f, g, i])
				} else {
					this.onValidDrop(f, g, i)
				}
			}
		}
		if (!c) {
			this.onInvalidDrop(f, g, i)
		}
		b.fireEvent("aftertaskdrop", b, a)
	},
	onInvalidDrop: function(b, a, c) {
		if (Ext.isIE && !a) {
			a = b;
			b = b.getTarget() || document.body
		}
		return this.callParent([b, a, c])
	}
});
Ext.define("Gnt.feature.DependencyDragZone", {
	extend: "Ext.dd.DragZone",
	mixins: {
		observable: "Ext.util.Observable"
	},
	rtl: null,
	useLineProxy: null,
	terminalSelector: null,
	ganttView: null,
	fromText: null,
	toText: null,
	startText: null,
	endText: null,
	constructor: function(b, a) {
		this.mixins.observable.constructor.call(this, a);
		this.callParent(arguments)
	},
	initLineProxy: function(b, a) {
		var d = this.lineProxyEl = this.lineProxyEl || this.el.createChild({
			cls: "sch-gantt-connector-proxy"
		});
		var e = (Ext.isIE9m || Ext.isIEQuirks) ? 0: 4;
		var c = this.rtl ? (a ? "r": "l") : (a ? "l": "r");
		d.alignTo(b, c, [a ? -e: e, 0]);
		Ext.apply(this, {
			containerTop: this.el.getTop(),
			containerLeft: this.el.getLeft(),
			startXY: d.getXY(),
			startScrollLeft: this.el.dom.scrollLeft,
			startScrollTop: this.el.dom.scrollTop
		})
	},
	onDrag: function(b, a) {
		if (this.useLineProxy) {
			this.updateLineProxy(b.getXY())
		}
	},
	updateLineProxy: function(m) {
		var a = this.lineProxyEl,
		j = m[0] - this.startXY[0] + this.el.dom.scrollLeft - this.startScrollLeft,
		i = m[1] - this.startXY[1] + this.el.dom.scrollTop - this.startScrollTop,
		b = Math.max(1, Math.sqrt(Math.pow(j, 2) + Math.pow(i, 2)) - 2),
		h = Math.atan2(i, j) - (Math.PI / 2),
		e;
		if ((Ext.isIE9m || Ext.isIEQuirks)) {
			var k = Math.cos(h),
			g = Math.sin(h),
			l = 'progid:DXImageTransform.Microsoft.Matrix(sizingMethod="auto expand", M11 = ' + k + ", M12 = " + ( - g) + ", M21 = " + g + ", M22 = " + k + ")",
			d,
			f;
			if (this.el.dom.scrollTop !== this.startScrollTop) {
				d = this.startScrollTop - this.containerTop
			} else {
				d = this.el.dom.scrollTop - this.containerTop
			}
			if (this.el.dom.scrollLeft !== this.startScrollLeft) {
				f = this.startScrollLeft - this.containerLeft
			} else {
				f = this.el.dom.scrollLeft - this.containerLeft
			}
			e = {
				height: b + "px",
				top: Math.min(0, i) + this.startXY[1] + d + (i < 0 ? 2: 0) + "px",
				left: Math.min(0, j) + this.startXY[0] + f + (j < 0 ? 2: 0) + "px",
				filter: l,
				"-ms-filter": l
			}
		} else {
			var c = "rotate(" + h + "rad)";
			e = {
				height: b + "px",
				"-o-transform": c,
				"-webkit-transform": c,
				"-ms-transform": c,
				"-moz-transform": c,
				transform: c
			}
		}
		a.setStyle(e)
	},
	onStartDrag: function() {
		this.el.addCls("sch-gantt-dep-dd-dragging");
		this.fireEvent("dndstart", this);
		if (this.useLineProxy) {
			var a = this.dragData;
			this.initLineProxy(a.sourceNode, a.isStart);
			this.lineProxyEl.show()
		}
	},
	getDragData: function(d) {
		var c = d.getTarget(this.terminalSelector);
		if (c) {
			var b = this.ganttView.resolveTaskRecord(c);
			if (this.fireEvent("beforednd", this, b) === false) {
				return null
			}
			var a = !!c.className.match("sch-gantt-terminal-start"),
			f = Ext.core.DomHelper.createDom({
				cls: "sch-dd-dependency",
				children: [{
					tag: "span",
					cls: "sch-dd-dependency-from",
					html: Ext.String.format(this.fromText, Ext.String.htmlEncode(b.getName()), a ? this.startText: this.endText)
				},
				{
					tag: "span",
					cls: "sch-dd-dependency-to",
					html: ""
				}]
			});
			return {
				fromId: b.getId() || b.internalId,
				isStart: a,
				repairXY: Ext.fly(c).getXY(),
				ddel: f,
				sourceNode: Ext.fly(c).up(this.ganttView.eventSelector)
			}
		}
		return false
	},
	afterRepair: function() {
		this.el.removeCls("sch-gantt-dep-dd-dragging");
		this.dragging = false;
		this.fireEvent("afterdnd", this)
	},
	onMouseUp: function() {
		this.el.removeCls("sch-gantt-dep-dd-dragging");
		if (this.lineProxyEl) {
			var b = (Ext.isIE9m || Ext.isIEQuirks) ? 0: 400;
			var a = this.lineProxyEl;
			a.animate({
				to: {
					height: 0
				},
				duration: b,
				callback: function() {
					Ext.destroy(a)
				}
			});
			this.lineProxyEl = null
		}
	},
	getRepairXY: function() {
		return this.dragData.repairXY
	},
	destroy: function() {
		Ext.destroy(this.lineProxyEl);
		this.callParent(arguments)
	}
});
Ext.define("Gnt.feature.DependencyDropZone", {
	extend: "Ext.dd.DropZone",
	mixins: {
		observable: "Ext.util.Observable"
	},
	terminalSelector: null,
	dependencyStore: null,
	toText: null,
	startText: null,
	endText: null,
	constructor: function(b, a) {
		this.mixins.observable.constructor.call(this, a);
		this.callParent(arguments)
	},
	getTargetFromEvent: function(a) {
		return a.getTarget(this.terminalSelector)
	},
	onNodeEnter: function(d, a, c, b) {
		Ext.fly(d).addCls("sch-gantt-terminal-drophover")
	},
	onNodeOut: function(d, a, c, b) {
		Ext.fly(d).removeCls("sch-gantt-terminal-drophover");
		a.proxy.el.down(".sch-dd-dependency-to").update(Ext.String.format(this.toText, "", ""))
	},
	onNodeOver: function(f, j, g, c) {
		var a = this.ganttView.resolveTaskRecord(f),
		i = a.getId() || a.internalId,
		b = f.className.match("sch-gantt-terminal-start"),
		d = Ext.String.format(this.toText, Ext.String.htmlEncode(a.getName()), b ? this.startText: this.endText);
		j.proxy.el.down(".sch-dd-dependency-to").update(d);
		var h = this.resolveType(c.isStart, f);
		if (this.dependencyStore.isValidDependency(c.fromId, i, h)) {
			return this.dropAllowed
		} else {
			return this.dropNotAllowed
		}
	},
	onNodeDrop: function(i, a, h, f) {
		var d = this.resolveType(f.isStart, i),
		g,
		c = this.ganttView.resolveTaskRecord(i),
		b = c.getId() || c.internalId;
		this.el.removeCls("sch-gantt-dep-dd-dragging");
		g = this.dependencyStore.isValidDependency(f.fromId, b, d);
		if (g) {
			this.fireEvent("drop", this, f.fromId, b, d)
		}
		this.fireEvent("afterdnd", this);
		return g
	},
	resolveType: function(a, d) {
		var c = Gnt.model.Dependency.Type,
		b;
		if (a) {
			if (d.className.match("sch-gantt-terminal-start")) {
				b = c.StartToStart
			} else {
				b = c.StartToEnd
			}
		} else {
			if (d.className.match("sch-gantt-terminal-start")) {
				b = c.EndToStart
			} else {
				b = c.EndToEnd
			}
		}
		return b
	}
});
Ext.define("Gnt.feature.DependencyDragDrop", {
	extend: "Ext.util.Observable",
	mixins: {
		localizable: "Gnt.mixin.Localizable"
	},
	requires: ["Gnt.feature.DependencyDragZone", "Gnt.feature.DependencyDropZone"],
	useLineProxy: true,
	dragZoneConfig: null,
	dropZoneConfig: null,
	terminalSelector: ".sch-gantt-terminal",
	el: null,
	rtl: null,
	ddGroup: null,
	ganttView: null,
	constructor: function(b) {
		this.addEvents("beforednd", "dndstart", "drop", "afterdnd");
		var a = b.ganttView;
		Ext.apply(this, b);
		this.ddGroup = a.id + "-sch-dependency-dd";
		this.el.on("mousemove", this.doSetup, this, {
			single: true
		});
		this.callParent(arguments)
	},
	doSetup: function() {
		var a = this;
		this.dragZone = new Gnt.feature.DependencyDragZone(this.el, Ext.apply({
			rtl: this.rtl,
			terminalSelector: this.terminalSelector,
			useLineProxy: this.useLineProxy,
			ddGroup: this.ddGroup,
			ganttView: this.ganttView,
			startText: this.L("startText"),
			endText: this.L("endText"),
			fromText: this.L("fromText")
		},
		this.dragZoneConfig));
		this.relayEvents(this.dragZone, ["beforednd", "dndstart", "afterdnd"]);
		this.dropZone = Ext.create("Gnt.feature.DependencyDropZone", this.el, Ext.apply({
			rtl: this.rtl,
			terminalSelector: this.terminalSelector,
			ddGroup: this.ddGroup,
			ganttView: this.ganttView,
			dependencyStore: this.dependencyStore,
			startText: this.L("startText"),
			endText: this.L("endText"),
			toText: this.L("toText")
		},
		this.dropZoneConfig));
		this.relayEvents(this.dropZone, ["drop", "afterdnd"])
	},
	destroy: function() {
		if (this.dragZone) {
			this.dragZone.destroy()
		}
		if (this.dropZone) {
			this.dropZone.destroy()
		}
	}
});
Ext.define("Gnt.feature.DragCreator", {
	requires: ["Ext.Template", "Sch.util.DragTracker", "Gnt.Tooltip"],
	constructor: function(a) {
		Ext.apply(this, a || {});
		this.init()
	},
	disabled: false,
	showDragTip: true,
	dragTolerance: 2,
	validatorFn: Ext.emptyFn,
	validatorFnScope: null,
	setDisabled: function(a) {
		this.disabled = a;
		if (this.dragTip) {
			this.dragTip.setDisabled(a)
		}
	},
	getProxy: function() {
		if (!this.proxy) {
			this.proxy = this.template.append(this.ganttView.ownerCt.el, {},
			true)
		}
		return this.proxy
	},
	onBeforeDragStart: function(f) {
		var c = this.ganttView,
		b = f.getTarget("." + c.timeCellCls, 2);
		if (b) {
			var a = c.resolveTaskRecord(b);
			var d = c.getDateFromDomEvent(f);
			if (!this.disabled && b && !a.getStartDate() && !a.getEndDate() && c.fireEvent("beforedragcreate", c, a, d, f) !== false) {
				f.stopEvent();
				this.taskRecord = a;
				this.originalStart = d;
				this.rowRegion = c.getScheduleRegion(this.taskRecord, this.originalStart);
				this.dateConstraints = c.getDateConstraints(this.resourceRecord, this.originalStart);
				return true
			}
		}
		return false
	},
	onDragStart: function() {
		var c = this,
		a = c.ganttView,
		b = c.getProxy();
		c.start = c.originalStart;
		c.end = c.start;
		c.rowBoundaries = {
			top: c.rowRegion.top,
			bottom: c.rowRegion.bottom
		};
		b.setRegion({
			top: c.rowBoundaries.top,
			right: c.tracker.startXY[0],
			bottom: c.rowBoundaries.bottom,
			left: c.tracker.startXY[0]
		});
		b.show();
		c.ganttView.fireEvent("dragcreatestart", c.ganttView);
		if (c.showDragTip) {
			c.dragTip.update(c.start, c.end, true, this.taskRecord);
			c.dragTip.enable();
			c.dragTip.show(b)
		}
	},
	onDrag: function(g) {
		var d = this,
		c = d.ganttView,
		b = d.tracker.getRegion().constrainTo(d.rowRegion),
		f = c.getStartEndDatesFromRegion(b, "round");
		if (!f) {
			return
		}
		d.start = f.start || d.start;
		d.end = f.end || d.end;
		var a = d.dateConstraints;
		if (a) {
			d.end = Sch.util.Date.constrain(d.end, a.start, a.end);
			d.start = Sch.util.Date.constrain(d.start, a.start, a.end)
		}
		d.valid = this.validatorFn.call(d.validatorFnScope || d, this.taskRecord, d.start, d.end, g) !== false;
		if (d.showDragTip) {
			d.dragTip.update(d.start, d.end, d.valid, this.taskRecord)
		}
		Ext.apply(b, d.rowBoundaries);
		this.getProxy().setRegion(b)
	},
	onDragEnd: function(a) {
		var b = this.ganttView;
		if (this.showDragTip) {
			this.dragTip.disable()
		}
		if (!this.start || !this.end || (this.end < this.start)) {
			this.valid = false
		}
		if (this.valid) {
			this.taskRecord.setStartEndDate(this.start, this.end, this.taskRecord.getTaskStore().skipWeekendsDuringDragDrop);
			b.fireEvent("dragcreateend", b, this.taskRecord, a)
		}
		this.proxy.hide();
		b.fireEvent("afterdragcreate", b)
	},
	init: function() {
		var c = this.ganttView,
		a = c.el,
		b = Ext.Function.bind;
		this.lastTime = new Date();
		this.template = this.template || Ext.create("Ext.Template", '<div class="sch-gantt-dragcreator-proxy"></div>', {
			compiled: true,
			disableFormats: true
		});
		c.on({
			destroy: this.onGanttDestroy,
			scope: this
		});
		this.tracker = new Sch.util.DragTracker({
			el: a,
			tolerance: this.dragTolerance,
			onBeforeStart: b(this.onBeforeDragStart, this),
			onStart: b(this.onDragStart, this),
			onDrag: b(this.onDrag, this),
			onEnd: b(this.onDragEnd, this)
		});
		if (this.showDragTip) {
			this.dragTip = Ext.create("Gnt.Tooltip", {
				mode: "duration",
				cls: "sch-gantt-dragcreate-tip",
				gantt: c
			})
		}
	},
	onGanttDestroy: function() {
		if (this.dragTip) {
			this.dragTip.destroy()
		}
		if (this.tracker) {
			this.tracker.destroy()
		}
		if (this.proxy) {
			Ext.destroy(this.proxy);
			this.proxy = null
		}
	}
});
Ext.define("Gnt.feature.LabelEditor", {
	extend: "Ext.Editor",
	labelPosition: "",
	constructor: function(b, a) {
		this.ganttView = b;
		this.ganttView.on("afterrender", this.onGanttRender, this);
		Ext.apply(this, a);
		if (this.labelPosition === "left") {
			this.alignment = "r-r"
		} else {
			if (this.labelPosition === "right") {
				this.alignment = "l-l"
			}
		}
		this.delegate = ".sch-gantt-label-" + this.labelPosition;
		this.callParent([a])
	},
	edit: function(a) {
		var b = this.ganttView.getElementFromEventRecord(a).up(this.ganttView.eventWrapSelector);
		this.record = a;
		this.startEdit(b.down(this.delegate), this.dataIndex ? a.get(this.dataIndex) : "")
	},
	delegate: "",
	dataIndex: "",
	shadow: false,
	completeOnEnter: true,
	cancelOnEsc: true,
	ignoreNoChange: true,
	onGanttRender: function(a) {
		if (!this.field.width) {
			this.autoSize = "width"
		}
		this.on({
			beforestartedit: function(c, b, d) {
				return a.fireEvent("labeledit_beforestartedit", a, this.record, d, c)
			},
			beforecomplete: function(c, d, b) {
				return a.fireEvent("labeledit_beforecomplete", a, d, b, this.record, c)
			},
			complete: function(c, d, b) {
				this.record.set(this.dataIndex, d);
				a.fireEvent("labeledit_complete", a, d, b, this.record, c)
			},
			scope: this
		});
		a.el.on("dblclick",
		function(c, b) {
			this.edit(a.resolveTaskRecord(b))
		},
		this, {
			delegate: this.delegate
		})
	}
});
Ext.define("Gnt.feature.ProgressBarResize", {
	requires: ["Ext.ToolTip", "Ext.resizer.Resizer"],
	constructor: function(a) {
		Ext.apply(this, a || {});
		var b = this.ganttView;
		b.on({
			destroy: this.cleanUp,
			scope: this
		});
		b.el.on("mousedown", this.onMouseDown, this, {
			delegate: ".sch-gantt-progressbar-handle"
		});
		this.callParent(arguments)
	},
	useTooltip: true,
	increment: 10,
	tip: null,
	resizable: null,
	ganttView: null,
	onMouseDown: function(d, b) {
		var c = this.ganttView,
		f = c.resolveTaskRecord(b);
		if (c.fireEvent("beforeprogressbarresize", c, f) !== false) {
			var a = Ext.fly(b).prev(".sch-gantt-progress-bar");
			d.stopEvent();
			this.resizable = this.createResizable(a, f, d);
			c.fireEvent("progressbarresizestart", c, f);
			Ext.getBody().on("mouseup", this.onBodyMouseUp, this, {
				single: true,
				delay: 1
			})
		}
	},
	createResizable: function(b, g, d) {
		var i = d.getTarget(),
		h = this.ganttView.rtl,
		f = b.up(this.ganttView.eventSelector),
		j = f.getWidth() - 2,
		c = j * this.increment / 100;
		var a = Ext.create("Ext.resizer.Resizer", {
			target: b,
			taskRecord: g,
			handles: h ? "w": "e",
			minWidth: 0,
			maxWidth: j,
			minHeight: 1,
			widthIncrement: c,
			listeners: {
				resizedrag: this.partialResize,
				resize: this.afterResize,
				scope: this
			}
		});
		a.resizeTracker.onMouseDown(d, a[h ? "west": "east"].dom);
		f.select("." + Ext.baseCSSPrefix + "resizable-handle, .sch-gantt-terminal, .sch-gantt-progressbar-handle").hide();
		if (this.useTooltip) {
			this.tip = Ext.create("Ext.ToolTip", {
				autoHide: false,
				anchor: "b",
				html: "%"
			});
			this.tip.setTarget(b);
			this.tip.update(g.getPercentDone() + "%");
			this.tip.show()
		}
		return a
	},
	partialResize: function(c, b) {
		var a = Math.round(b * 100 / (c.maxWidth * this.increment)) * this.increment;
		if (this.tip) {
			this.tip.body.update(a + "%")
		}
	},
	afterResize: function(f, b, c, g) {
		var i = f.taskRecord;
		if (this.tip) {
			this.tip.destroy();
			this.tip = null
		}
		var a = f.taskRecord.getPercentDone();
		if (Ext.isNumber(b)) {
			var d = Math.round(b * 100 / (f.maxWidth * this.increment)) * this.increment;
			f.taskRecord.setPercentDone(d)
		}
		if (a === f.taskRecord.getPercentDone()) {
			this.ganttView.refreshNode(this.ganttView.indexOf(f.taskRecord))
		}
		f.destroy();
		this.resizable = null;
		this.ganttView.fireEvent("afterprogressbarresize", this.ganttView, i)
	},
	onBodyMouseUp: function() {
		if (this.resizable) {
			this.afterResize(this.resizable)
		}
	},
	cleanUp: function() {
		if (this.tip) {
			this.tip.destroy()
		}
	}
});
Ext.define("Gnt.feature.TaskResize", {
	constructor: function(a) {
		Ext.apply(this, a);
		var b = this.gantt;
		b.on({
			destroy: this.cleanUp,
			scope: this
		});
		b.mon(b.el, "mousedown", this.onMouseDown, this, {
			delegate: ".sch-resizable-handle"
		});
		this.callParent(arguments)
	},
	showDuration: true,
	useTooltip: true,
	validatorFn: Ext.emptyFn,
	validatorFnScope: null,
	origEl: null,
	taskRec: null,
	isStart: null,
	gantt: null,
	onMouseDown: function(f, b) {
		var c = this.gantt,
		a = f.getTarget(c.eventSelector),
		g = c.resolveTaskRecord(a);
		var d = g.isResizable();
		if (f.button !== 0 || d === false || typeof d === "string" && !a.className.match(d)) {
			return
		}
		if (c.fireEvent("beforetaskresize", c, g, f) === false) {
			return
		}
		f.stopEvent();
		this.origEl = a;
		this.taskRec = g;
		this.isStart = !!b.className.match("sch-resizable-handle-start");
		c.el.on({
			mousemove: this.onMouseMove,
			mouseup: this.onMouseUp,
			scope: this,
			single: true
		});
		c.fireEvent("taskresizestart", c, g)
	},
	onMouseMove: function(k, o) {
		var f = Ext.get(this.origEl),
		j = this.gantt,
		m = j.rtl,
		a = this.isStart,
		l = this.taskRec,
		i = (m && !a) || (!m && a),
		d = j.getSnapPixelAmount(),
		c = f.getWidth(),
		n = f.up(j.getItemSelector()).getRegion();
		this.resizable = Ext.create("Ext.resizer.Resizer", {
			otherEdgeX: i ? f.getRight() : f.getLeft(),
			target: f,
			taskRecord: l,
			isStart: a,
			isWest: i,
			handles: i ? "w": "e",
			constrainTo: n,
			minHeight: 1,
			minWidth: d,
			widthIncrement: d,
			listeners: {
				resizedrag: this.partialResize,
				resize: this.afterResize,
				scope: this
			}
		});
		this.resizable.resizeTracker.onMouseDown(k, this.resizable[i ? "west": "east"].dom);
		if (this.useTooltip) {
			if (!this.tip) {
				this.tip = Ext.create("Gnt.Tooltip", {
					mode: this.showDuration ? "duration": "startend",
					gantt: this.gantt
				})
			}
			var b = l.getStartDate(),
			h = l.getEndDate();
			this.tip.show(f);
			this.tip.update(b, h, true, l);
			Ext.getBody().on("mouseup",
			function() {
				this.tip.hide()
			},
			this, {
				single: true
			})
		}
	},
	onMouseUp: function(c, a) {
		var b = this.gantt;
		b.el.un({
			mousemove: this.onMouseMove,
			scope: this,
			single: true
		})
	},
	partialResize: function(j, g, f, i) {
		var k = this.gantt,
		h = j.isWest,
		b;
		if (h) {
			b = k.getDateFromCoordinate(j.otherEdgeX - Math.min(g, this.resizable.maxWidth), "round")
		} else {
			b = k.getDateFromCoordinate(j.otherEdgeX + Math.min(g, this.resizable.maxWidth), "round")
		}
		if (!b || j.date - b === 0) {
			return
		}
		var c = j.isStart ? b: j.taskRecord.getStartDate(),
		d = j.isStart ? j.taskRecord.getEndDate() : b,
		a = this.validatorFn.call(this.validatorFnScope || this, j.taskRecord, c, d) !== false;
		j.date = b;
		k.fireEvent("partialtaskresize", k, j.taskRecord, c, d, j.el, i);
		if (this.useTooltip) {
			this.tip.update(c, d, a, j.taskRecord)
		}
	},
	afterResize: function(n, m, j, k) {
		if (this.useTooltip) {
			this.tip.hide()
		}
		var l = n.taskRecord,
		f = l.getStartDate(),
		o = l.getEndDate(),
		b = n.isStart ? n.date: f,
		d = n.isStart ? o: n.date,
		c = this.gantt;
		n.destroy();
		if (b && d && (b - f || d - o) && this.validatorFn.call(this.validatorFnScope || this, l, b, d, k) !== false) {
			var i,
			g = function() {
				i = true
			};
			c.on("itemupdate", g, null, {
				single: true
			});
			var a = c.taskStore.skipWeekendsDuringDragDrop;
			if (b - f !== 0) {
				l.setStartDate(b <= d ? b: d, false, a)
			} else {
				l.setEndDate(b <= d ? d: b, false, a)
			}
			c.un("itemupdate", g, null, {
				single: true
			});
			if (!i) {
				c.refreshNode(c.store.indexOf(l))
			}
		} else {
			c.refreshKeepingScroll()
		}
		c.fireEvent("aftertaskresize", c, l)
	},
	cleanUp: function() {
		if (this.tip) {
			this.tip.destroy()
		}
	}
});
Ext.define("Gnt.feature.WorkingTime", {
	extend: "Sch.plugin.Zones",
	requires: ["Ext.data.Store", "Sch.model.Range"],
	expandToFitView: true,
	calendar: null,
	init: function(a) {
		if (!this.calendar) {
			Ext.Error.raise("Required attribute 'calendar' missed during initialization of 'Gnt.feature.WorkingTime'")
		}
		this.bindCalendar(this.calendar);
		Ext.apply(this, {
			store: new Ext.data.Store({
				model: "Sch.model.Range"
			})
		});
		this.callParent(arguments);
		a.on("viewchange", this.onViewChange, this);
		this.onViewChange()
	},
	bindCalendar: function(b) {
		var a = {
			datachanged: this.refresh,
			update: this.refresh,
			scope: this,
			delay: 1
		};
		if (this.calendar) {
			this.calendar.un(a)
		}
		b.on(a);
		this.calendar = b
	},
	onViewChange: function() {
		var a = Sch.util.Date;
		if (a.compareUnits(this.timeAxis.unit, a.WEEK) > 0) {
			this.setDisabled(true)
		} else {
			this.setDisabled(false);
			this.refresh()
		}
	},
	refresh: function() {
		var a = this.schedulerView;
		this.store.removeAll(true);
		this.store.add(this.calendar.getHolidaysRanges(a.timeAxis.getStart(), a.timeAxis.getEnd(), true))
	}
});
Ext.define("Gnt.plugin.DependencyEditor", {
	extend: "Ext.form.Panel",
	alias: "plugin.gantt_dependencyeditor",
	mixins: ["Ext.AbstractPlugin", "Gnt.mixin.Localizable"],
	lockableScope: "top",
	requires: ["Ext.form.field.Display", "Ext.form.field.ComboBox", "Ext.form.field.Number", "Gnt.model.Dependency"],
	hideOnBlur: true,
	showLag: false,
	border: false,
	height: 150,
	width: 260,
	frame: true,
	labelWidth: 60,
	triggerEvent: "dependencydblclick",
	constrain: false,
	initComponent: function() {
		Ext.apply(this, {
			items: this.buildFields(),
			defaults: {
				width: 240
			},
			floating: true,
			hideMode: "offsets"
		});
		this.callParent(arguments);
		this.addCls("sch-gantt-dependencyeditor")
	},
	init: function(a) {
		a.on(this.triggerEvent, this.onDependencyDblClick, this);
		a.on("destroy", this.destroy, this);
		a.on("afterrender", this.onGanttRender, this, {
			delay: 50
		});
		this.gantt = a;
		this.taskStore = a.getTaskStore()
	},
	onGanttRender: function() {
		this.render(Ext.getBody());
		this.collapse(Ext.Component.DIRECTION_TOP, true);
		this.hide();
		if (this.hideOnBlur) {
			this.on({
				show: function() {
					this.mon(Ext.getBody(), {
						click: this.onMouseClick,
						scope: this
					})
				},
				hide: function() {
					this.mun(Ext.getBody(), {
						click: this.onMouseClick,
						scope: this
					})
				},
				delay: 50
			})
		}
	},
	show: function(a, b) {
		this.dependencyRecord = a;
		this.getForm().loadRecord(a);
		this.fromLabel.setValue(Ext.String.htmlEncode(this.dependencyRecord.getSourceTask().getName()));
		this.toLabel.setValue(Ext.String.htmlEncode(this.dependencyRecord.getTargetTask().getName()));
		this.callParent([]);
		this.el.setXY(b);
		this.expand(!this.constrain);
		if (this.constrain) {
			this.doConstrain(Ext.util.Region.getRegion(Ext.getBody()))
		}
	},
	buildFields: function() {
		var c = this,
		d = Gnt.model.Dependency,
		b = d.Type,
		a = [this.fromLabel = Ext.create("Ext.form.DisplayField", {
			fieldLabel: this.L("fromText")
		}), this.toLabel = Ext.create("Ext.form.DisplayField", {
			fieldLabel: this.L("toText")
		}), this.typeField = Ext.create("Ext.form.ComboBox", {
			name: d.prototype.nameField,
			fieldLabel: this.L("typeText"),
			triggerAction: "all",
			queryMode: "local",
			valueField: "value",
			displayField: "text",
			editable: false,
			store: Ext.create("Ext.data.JsonStore", {
				fields: ["text", "value"],
				data: [{
					text: this.L("endToStartText"),
					value: b.EndToStart
				},
				{
					text: this.L("startToStartText"),
					value: b.StartToStart
				},
				{
					text: this.L("endToEndText"),
					value: b.EndToEnd
				},
				{
					text: this.L("startToEndText"),
					value: b.StartToEnd
				}]
			})
		})];
		if (this.showLag) {
			a.push(this.lagField = Ext.create("Ext.form.NumberField", {
				name: d.prototype.lagField,
				fieldLabel: this.L("lagText")
			}))
		}
		return a
	},
	onDependencyDblClick: function(c, a, d, b) {
		if (this.lagField) {
			this.lagField.name = a.lagField
		}
		if (this.typeField) {
			this.typeField.name = a.typeField
		}
		if (a != this.dependencyRecord) {
			this.show(a, d.getXY())
		}
	},
	onMouseClick: function(a) {
		if (this.collapsed || a.within(this.getEl()) || a.getTarget("." + Ext.baseCSSPrefix + "layer") || a.getTarget(".sch-ignore-click")) {
			return
		}
		this.collapse()
	},
	afterCollapse: function() {
		delete this.dependencyRecord;
		this.hide();
		this.callParent(arguments);
		if (this.hideOnBlur) {
			this.mun(Ext.getBody(), "click", this.onMouseClick, this)
		}
	}
});
Ext.define("Gnt.plugin.TaskContextMenu", {
	extend: "Ext.menu.Menu",
	alias: "plugin.gantt_taskcontextmenu",
	mixins: ["Ext.AbstractPlugin", "Gnt.mixin.Localizable"],
	lockableScope: "top",
	requires: ["Gnt.model.Dependency"],
	legacyHolderProp: "texts",
	plain: true,
	triggerEvent: "taskcontextmenu",
	grid: null,
	rec: null,
	lastHighlightedItem: null,
	createMenuItems: function() {
		return [{
			handler: this.deleteTask,
			requiresTask: true,
			itemId: "deleteTask",
			text: this.L("deleteTask")
		},
		{
			handler: this.editLeftLabel,
			requiresTask: true,
			itemId: "editLeftLabel",
			text: this.L("editLeftLabel")
		},
		{
			handler: this.editRightLabel,
			requiresTask: true,
			itemId: "editRightLabel",
			text: this.L("editRightLabel")
		},
		{
			handler: this.toggleMilestone,
			requiresTask: true,
			itemId: "toggleMilestone",
			text: this.L("convertToMilestone")
		},
		{
			text: this.L("add"),
			itemId: "addTaskMenu",
			menu: {
				plain: true,
				defaults: {
					scope: this
				},
				items: [{
					handler: this.addTaskAboveAction,
					requiresTask: true,
					text: this.L("addTaskAbove")
				},
				{
					handler: this.addTaskBelowAction,
					text: this.L("addTaskBelow")
				},
				{
					handler: this.addMilestone,
					requiresTask: true,
					text: this.L("addMilestone")
				},
				{
					handler: this.addSubtask,
					requiresTask: true,
					text: this.L("addSubtask")
				},
				{
					handler: this.addSuccessor,
					requiresTask: true,
					text: this.L("addSuccessor")
				},
				{
					handler: this.addPredecessor,
					requiresTask: true,
					text: this.L("addPredecessor")
				}]
			}
		},
		{
			text: this.L("deleteDependency"),
			requiresTask: true,
			itemId: "deleteDependencyMenu",
			isDependenciesMenu: true,
			menu: {
				plain: true,
				listeners: {
					beforeshow: this.populateDependencyMenu,
					mouseover: this.onDependencyMouseOver,
					mouseleave: this.onDependencyMouseOut,
					scope: this
				}
			}
		}]
	},
	buildMenuItems: function() {
		this.items = this.createMenuItems()
	},
	initComponent: function() {
		this.defaults = this.defaults || {};
		this.defaults.scope = this;
		this.buildMenuItems();
		this.callParent(arguments)
	},
	init: function(b) {
		b.on("destroy", this.cleanUp, this);
		var a = b.getSchedulingView(),
		c = b.lockedGrid.getView();
		if (this.triggerEvent === "itemcontextmenu") {
			c.on("itemcontextmenu", this.onItemContextMenu, this);
			a.on("itemcontextmenu", this.onItemContextMenu, this)
		}
		a.on("taskcontextmenu", this.onTaskContextMenu, this);
		a.on("containercontextmenu", this.onContainerContextMenu, this);
		c.on("containercontextmenu", this.onContainerContextMenu, this);
		this.grid = b
	},
	populateDependencyMenu: function(f) {
		var d = this.grid,
		b = d.getTaskStore(),
		e = this.rec.getAllDependencies(),
		a = d.dependencyStore;
		f.removeAll();
		if (e.length === 0) {
			return false
		}
		var c = this.rec.getId() || this.rec.internalId;
		Ext.each(e,
		function(i) {
			var h = i.getSourceId(),
			g = b.getById(h == c ? i.getTargetId() : h);
			if (g) {
				f.add({
					depId: i.internalId,
					text: Ext.util.Format.ellipsis(Ext.String.htmlEncode(g.getName()), 30),
					scope: this,
					handler: function(k) {
						var j;
						a.each(function(l) {
							if (l.internalId == k.depId) {
								j = l;
								return false
							}
						});
						a.remove(j)
					}
				})
			}
		},
		this)
	},
	onDependencyMouseOver: function(d, a, b) {
		if (a) {
			var c = this.grid.getSchedulingView();
			if (this.lastHighlightedItem) {
				c.unhighlightDependency(this.lastHighlightedItem.depId)
			}
			this.lastHighlightedItem = a;
			c.highlightDependency(a.depId)
		}
	},
	onDependencyMouseOut: function(b, a) {
		if (this.lastHighlightedItem) {
			this.grid.getSchedulingView().unhighlightDependency(this.lastHighlightedItem.depId)
		}
	},
	cleanUp: function() {
		this.destroy()
	},
	onTaskContextMenu: function(b, a, c) {
		this.activateMenu(a, c)
	},
	onItemContextMenu: function(b, a, d, c, f) {
		this.activateMenu(a, f)
	},
	onContainerContextMenu: function(a, b) {
		this.activateMenu(null, b)
	},
	activateMenu: function(b, a) {
		if (this.grid.isReadOnly()) {
			return
		}
		a.stopEvent();
		this.rec = b;
		this.configureMenuItems();
		this.showAt(a.getXY())
	},
	configureMenuItems: function() {
		var b = this.query("[requiresTask]");
		var c = this.rec;
		Ext.each(b,
		function(e) {
			e.setDisabled(!c)
		});
		var a = this.query("[isDependenciesMenu]")[0];
		if (c && a) {
			a.setDisabled(!c.getAllDependencies().length)
		}
		var d = this.down("#toggleMilestone");
		if (c && d) {
			d.setText(c.isMilestone() ? this.L("convertToRegular") : this.L("convertToMilestone"))
		}
	},
	copyTask: function(c) {
		var b = this.grid.getTaskStore().model;
		var a = new b({
			leaf: true
		});
		a.setPercentDone(0);
		a.setName(this.L("newTaskText", this.texts));
		a.set(a.startDateField, (c && c.getStartDate()) || null);
		a.set(a.endDateField, (c && c.getEndDate()) || null);
		a.set(a.durationField, (c && c.getDuration()) || null);
		a.set(a.durationUnitField, (c && c.getDurationUnit()) || "d");
		return a
	},
	addTaskAbove: function(a) {
		var b = this.rec;
		if (b) {
			b.addTaskAbove(a)
		} else {
			this.grid.taskStore.getRootNode().appendChild(a)
		}
	},
	addTaskBelow: function(a) {
		var b = this.rec;
		if (b) {
			b.addTaskBelow(a)
		} else {
			this.grid.taskStore.getRootNode().appendChild(a)
		}
	},
	deleteTask: function() {
		var a = this.grid.getSelectionModel().selected;
		this.grid.taskStore.remove(a.getRange())
	},
	editLeftLabel: function() {
		this.grid.getSchedulingView().editLeftLabel(this.rec)
	},
	editRightLabel: function() {
		this.grid.getSchedulingView().editRightLabel(this.rec)
	},
	addTaskAboveAction: function() {
		this.addTaskAbove(this.copyTask(this.rec))
	},
	addTaskBelowAction: function() {
		this.addTaskBelow(this.copyTask(this.rec))
	},
	addSubtask: function() {
		var a = this.rec;
		a.addSubtask(this.copyTask(a))
	},
	addSuccessor: function() {
		var a = this.rec;
		a.addSuccessor(this.copyTask(a))
	},
	addPredecessor: function() {
		var a = this.rec;
		a.addPredecessor(this.copyTask(a))
	},
	addMilestone: function() {
		var b = this.rec,
		a = this.copyTask(b);
		b.addTaskBelow(a);
		a.setStartEndDate(b.getEndDate(), b.getEndDate())
	},
	toggleMilestone: function() {
		if (this.rec.isMilestone()) {
			this.rec.convertToRegular()
		} else {
			this.rec.convertToMilestone()
		}
	}
});
Ext.define("Gnt.plugin.Export", {
	extend: "Sch.plugin.Export",
	alias: "plugin.gantt_export",
	alternateClassName: "Gnt.plugin.PdfExport",
	showExportDialog: function() {
		this.exportDialogConfig.scrollerDisabled = true;
		this.callParent(arguments)
	},
	getExportJsonHtml: function(e, h) {
		var c = this.scheduler.getSchedulingView(),
		d = c.dependencyView,
		a = d.painter.getDependencyTplData(c.dependencyStore.getRange()),
		f = d.lineTpl.apply(a),
		b = h.config,
		g;
		if (!b.singlePageExport) {
			g = {
				dependencies: f,
				rowsAmount: e.rowsAmount,
				columnsAmountNormal: e.columnsAmountNormal,
				columnsAmountLocked: e.columnsAmountLocked,
				timeColumnWidth: e.timeColumnWidth,
				lockedGridWidth: e.lockedGridWidth,
				rowHeight: e.rowHeight
			}
		} else {
			e = {};
			g = {
				dependencies: f,
				singlePageExport: true
			}
		}
		g.lockedColumnPages = e.lockedColumnPages;
		e.panelHTML = g;
		return this.callParent(arguments)
	},
	getRealSize: function() {
		var a = this.callParent(arguments);
		a.width += this.scheduler.down("splitter").getWidth();
		return a
	},
	resizePanelHTML: function(c) {
		var h = this.callParent(arguments),
		e = h.select(".sch-dependencyview-ct").first(),
		g = h.select("." + Ext.baseCSSPrefix + "splitter").first(),
		b = 0,
		f = 0,
		a,
		d;
		b = c.skippedColsBefore * c.timeColumnWidth;
		if (!c.singlePageExport) {
			f = c.k * c.rowsAmount * c.rowHeight;
			a = c.lockedColumnPages ? c.lockedColumnPages.length: 0;
			d = c.i;
			if (a) {
				if (d >= a - 1) {
					var j = d - a + 1;
					b += (j === a - 1) ? c.timeColumnWidth * c.columnsAmountLocked: c.timeColumnWidth * c.columnsAmountLocked + (j - 1) * c.timeColumnWidth * c.columnsAmountNormal
				} else {
					g.hide()
				}
			} else {
				if (d) {
					b += (d - 1) * c.timeColumnWidth * c.columnsAmountNormal + c.timeColumnWidth * c.columnsAmountLocked
				}
			}
		}
		e.dom.innerHTML = c.dependencies;
		e.applyStyles({
			top: -f + "px",
			left: -b + "px"
		});
		g.setHeight("100%");
		return h
	}
});
Ext.define("Gnt.plugin.Printable", {
	extend: "Sch.plugin.Printable",
	alias: "plugin.gantt_printable",
	getGridContent: function(e) {
		var j = e.getSchedulingView();
		j._print = true;
		var a = this.callParent(arguments),
		h = j.dependencyView,
		n = h.painter.getDependencyTplData(j.dependencyStore.getRange()),
		d = '<div class="' + h.containerEl.dom.className + '">' + h.lineTpl.apply(n) + "</div>",
		m = a.normalRows;
		if (Ext.select(".sch-gantt-critical-chain").first()) {
			var b = Ext.DomHelper.createDom({
				tag: "div",
				html: d
			});
			b = Ext.get(b);
			var p = Ext.DomHelper.createDom({
				tag: "div",
				html: m
			});
			p = Ext.get(p);
			var q = j.getCriticalPaths(),
			c = j.dependencyStore,
			o,
			g,
			f,
			k;
			Ext.each(q,
			function(i) {
				for (g = 0, f = i.length; g < f; g++) {
					o = i[g];
					this.highlightTask(o, e, p);
					if (g < (f - 1)) {
						k = c.getAt(c.findBy(function(l) {
							return l.getTargetId() === (o.getId() || o.internalId) && l.getSourceId() === (i[g + 1].getId() || i[g + 1].internalId)
						}));
						this.highlightDependency(k, b, h)
					}
				}
			},
			this);
			m = p.getHTML();
			d = b.getHTML()
		}
		a.normalRows = d + m;
		delete j._print;
		return a
	},
	highlightTask: function(b, a, e) {
		var d = a.getSchedulingView().getElementFromEventRecord(b),
		c = d.id;
		if (d) {
			e.select("#" + c).first().parent("tr").addCls("sch-gantt-task-highlighted")
		}
	},
	highlightDependency: function(c, b, a) {
		var d = c instanceof Ext.data.Model ? c.internalId: c;
		return b.select(".sch-dep-" + d).addCls(a.selectedCls)
	}
});
Ext.define("Gnt.view.DependencyPainter", {
	ganttView: null,
	rowHeight: null,
	topArrowOffset: 8,
	arrowOffset: 8,
	lineWidth: 2,
	xOffset: 6,
	constructor: function(a) {
		a = a || {};
		Ext.apply(this, a)
	},
	setRowHeight: function(a) {
		this.rowHeight = a
	},
	getTaskBox: function(r) {
		var i = Sch.util.Date,
		k = r.getStartDate(),
		q = r.getEndDate(),
		n = this.ganttView,
		m = n.bufferedRenderer,
		f = n.timeAxis.getStart(),
		d = n.timeAxis.getEnd();
		if (!r.isVisible() || !k || !q || !i.intersectSpans(k, q, f, d) || (!m && n.store.indexOf(r) < 0)) {
			return null
		}
		var g,
		c = n.getXFromDate(i.max(k, f)),
		b = n.getXFromDate(i.min(q, d)),
		a = n.getNodeByRecord(r);
		if (a || m) {
			var t = n.getXOffset(r),
			o,
			j,
			v = r.isMilestone(),
			u = true;
			if (c > t) {
				c -= t
			}
			b += t;
			if (!v && Ext.isIE) {
				if ((Ext.isIE6 || Ext.isIE7 || Ext.isIE8) && Ext.isIEQuirks) {
					b += 1;
					c -= 2
				}
			}
			var h = n.el;
			var l = h.getScroll().top;
			if (a) {
				var s = n.getEventNodeByRecord(r);
				g = Ext.fly(s).getOffsetsTo(h);
				o = g[1] + l + (v && Ext.isIE8 ? 3: 0);
				j = o + Ext.fly(s).getHeight();
				if (v) {
					b += 1
				}
			} else {
				var p = n.all.elements;
				var e = n.store.getAt(n.all.startIndex);
				if (r.isAbove(e)) {
					a = p[n.all.startIndex];
					g = Ext.fly(a).getOffsetsTo(h);
					g[1] -= n.rowHeight
				} else {
					a = p[n.all.endIndex];
					g = Ext.fly(a).getOffsetsTo(h);
					g[1] += n.rowHeight
				}
				o = g[1] + l;
				j = o + this.rowHeight;
				u = false
			}
			return {
				top: o,
				end: b,
				bottom: j,
				start: c,
				rendered: u
			}
		}
	},
	getRenderData: function(g) {
		var f = g.getSourceTask(),
		d = g.getTargetTask();
		if (!f || !d) {
			return null
		}
		var a = this.getTaskBox(f);
		var e = this.getTaskBox(d);
		var c = this.ganttView;
		if (c.bufferRender && a && !a.rendered && e && !e.rendered) {
			var h = c.store.getAt(c.all.startIndex);
			var b = c.store.getAt(c.all.endIndex);
			if ((f.isAbove(h) && d.isAbove(h)) || (b.isAbove(f) && b.isAbove(d))) {
				return null
			}
		}
		return {
			fromBox: a,
			toBox: e
		}
	},
	getDependencyTplData: function(o) {
		var j = this,
		m = j.ganttView;
		if (o instanceof Ext.data.Model) {
			o = [o]
		}
		if (o.length === 0 || m.store.getCount() === 0) {
			return
		}
		var a = [],
		n,
		h,
		f,
		k,
		g,
		b;
		for (var e = 0, c = o.length; e < c; e++) {
			b = o[e];
			var d = this.getRenderData(b);
			if (d) {
				k = d.fromBox;
				g = d.toBox;
				if (k && g) {
					n = j.getLineCoordinates(k, g, b);
					if (n) {
						a.push({
							dependency: b,
							id: b.internalId,
							cls: b.getCls(),
							lineCoordinates: n
						})
					}
				}
			}
		}
		return a
	},
	getLineCoordinates: function(q, o, j) {
		var f,
		r,
		p = [0, q.top - 1 + ((q.bottom - q.top) / 2)],
		a = [0, o.top - 1 + ((o.bottom - o.top) / 2)],
		b = a[1] > p[1],
		g = Gnt.model.Dependency.Type,
		d = this.arrowOffset + this.xOffset,
		c = j.getType(),
		m = [],
		s = j.getTargetTask().isMilestone(),
		k,
		h,
		t;
		switch (c) {
		case g.StartToEnd:
			p[0] = q.start;
			a[0] = o.end + d;
			f = "l";
			r = "r";
			break;
		case g.StartToStart:
			p[0] = q.start;
			a[0] = o.start - d;
			f = "l";
			r = "l";
			break;
		case g.EndToStart:
			p[0] = q.end;
			a[0] = o.start - d;
			f = "r";
			r = "l";
			break;
		case g.EndToEnd:
			p[0] = q.end;
			a[0] = o.end + d;
			f = "r";
			r = "r";
			break;
		default:
			throw "Invalid dependency type: " + j.getType()
		}
		m.push(p);
		var n = p[0] + (f === "r" ? this.xOffset: -this.xOffset);
		if (b && c === g.EndToStart && q.end < (o.start + 5)) {
			k = Math.min(o.start + this.xOffset, o.end);
			m.push([k, p[1]]);
			m.push([k, o.top - this.arrowOffset - (s ? 2: 0)])
		} else {
			if (f !== r && ((f === "r" && n > a[0]) || (f === "l" && n < a[0]))) {
				h = o[r === "l" ? "start": "end"];
				t = a[1] + (b ? -1: 1) * (this.rowHeight / 2);
				m.push([n, p[1]]);
				m.push([n, t]);
				m.push([a[0], t]);
				m.push(a);
				m.push([h + (a[0] < h ? -this.arrowOffset: this.arrowOffset) - (s && r === "l" ? 2: 0), a[1]])
			} else {
				h = o[r === "l" ? "start": "end"];
				if (f === "r") {
					k = Math.max(n, a[0])
				} else {
					k = Math.min(n, a[0])
				}
				m.push([k, p[1]]);
				m.push([k, a[1]]);
				m.push([h + (k < h ? -this.arrowOffset: this.arrowOffset) - (s && r === "l" ? 2: 0), a[1]])
			}
		}
		var e = [];
		for (var l = 0; l < m.length - 1; l++) {
			e.push({
				x1: m[l][0],
				y1: m[l][1],
				x2: m[l + 1][0],
				y2: m[l + 1][1]
			})
		}
		return e
	}
});
Ext.define("Gnt.view.Dependency", {
	extend: "Ext.util.Observable",
	requires: ["Gnt.feature.DependencyDragDrop", "Gnt.view.DependencyPainter"],
	lineWidth: 1,
	dragZoneConfig: null,
	dropZoneConfig: null,
	containerEl: null,
	ganttView: null,
	painter: null,
	taskStore: null,
	store: null,
	dnd: null,
	lineTpl: null,
	enableDependencyDragDrop: true,
	renderAllDepsBuffered: false,
	dependencyCls: "sch-dependency",
	selectedCls: "sch-dependency-selected",
	dependencyPainterClass: "Gnt.view.DependencyPainter",
	constructor: function(a) {
		this.callParent(arguments);
		var c = this.ganttView;
		c.on({
			refresh: this.renderAllDependenciesBuffered,
			bufferedrefresh: this.renderAllDependenciesBuffered,
			itemupdate: this.onTaskUpdated,
			scope: this
		});
		this.bindTaskStore(c.getTaskStore());
		this.bindDependencyStore(a.store);
		if (!this.lineTpl) {
			var d = this.rtl;
			var b = d ? "right": "left";
			this.lineTpl = Ext.create("Ext.XTemplate", '<tpl for=".">' + Ext.String.format('<tpl for="lineCoordinates"><div class="{0} {[ parent.dependency.isHighlighted ? "{1}" : "" ]} {[values.x1==values.x2 ? "sch-dependency-line-v" : "sch-dependency-line-h"]} {lineCls} sch-dep-{parent.id} {0}-line {[this.getSuffixedCls(parent.cls, "-line")]}" style="' + b + ":{[Math.min(values.x1, values.x2)]}px;top:{[Math.min(values.y1, values.y2)]}px;width:{[Math.abs(values.x1-values.x2)+" + this.lineWidth + "]}px;height:{[Math.abs(values.y1-values.y2)+" + this.lineWidth + ']}px"></div></tpl><div style="' + b + ':{[values.lineCoordinates[values.lineCoordinates.length - 1].x2]}px;top:{[values.lineCoordinates[values.lineCoordinates.length - 1].y2]}px"    class="{0}-arrow-ct {0} {[ values.dependency.isHighlighted ? "{1}" : "" ]} sch-dep-{id} {[this.getSuffixedCls(values.cls, "-arrow-ct")]}"><img src="' + Ext.BLANK_IMAGE_URL + '" class="{0}-arrow {0}-arrow-{[this.getArrowDirection(values.lineCoordinates)]} {[this.getSuffixedCls(values.cls, "-arrow")]}" /></div>', this.dependencyCls, this.selectedCls) + "</tpl>", {
				compiled: true,
				disableFormats: true,
				getArrowDirection: function(f) {
					var e = f[f.length - 1];
					if (e.y2 < e.y1) {
						return "up"
					}
					if (e.x1 === e.x2) {
						return "down"
					} else {
						if ((!d && e.x1 > e.x2) || (d && e.x1 < e.x2)) {
							return "left"
						} else {
							return "right"
						}
					}
				},
				getSuffixedCls: function(e, f) {
					if (e && e.indexOf(" ") != -1) {
						return e.replace(/^\s*(.*)\s*$/, "$1").split(/\s+/).join(f + " ") + f
					} else {
						return e + f
					}
				}
			})
		}
		this.painter = Ext.create(this.dependencyPainterClass, Ext.apply({
			rowHeight: c.rowHeight,
			ganttView: c
		},
		a));
		this.addEvents("beforednd", "dndstart", "drop", "afterdnd", "beforecascade", "cascade", "dependencyclick", "dependencycontextmenu", "dependencydblclick", "refresh");
		if (this.enableDependencyDragDrop) {
			this.dnd = Ext.create("Gnt.feature.DependencyDragDrop", {
				el: c.getEl(),
				rtl: c.rtl,
				ganttView: c,
				dragZoneConfig: this.dragZoneConfig,
				dropZoneConfig: this.dropZoneConfig,
				dependencyStore: this.store
			});
			this.dnd.on("drop", this.onDependencyDrop, this);
			this.relayEvents(this.dnd, ["beforednd", "dndstart", "afterdnd", "drop"])
		}
		this.containerEl = this.containerEl.createChild({
			cls: "sch-dependencyview-ct " + (this.lineWidth === 1 ? " sch-dependencyview-thin ": "")
		});
		this.ganttView.mon(this.containerEl, {
			dblclick: this.onDependencyClick,
			click: this.onDependencyClick,
			contextmenu: this.onDependencyClick,
			scope: this,
			delegate: "." + this.dependencyCls
		});
		if (c.rendered) {
			this.renderAllDependenciesBuffered()
		}
	},
	bindDependencyStore: function(a) {
		this.depStoreListeners = {
			refresh: this.renderAllDependenciesBuffered,
			clear: this.renderAllDependenciesBuffered,
			load: this.renderAllDependenciesBuffered,
			add: this.onDependencyAdd,
			update: this.onDependencyUpdate,
			remove: this.onDependencyDelete,
			scope: this
		};
		a.on(this.depStoreListeners);
		this.store = a
	},
	unBindDependencyStore: function() {
		if (this.depStoreListeners) {
			this.store.un(this.depStoreListeners)
		}
	},
	bindTaskStore: function(a) {
		var b = this.ganttView;
		this.taskStoreListeners = {
			cascade: this.onTaskStoreCascade,
			beforefill: this.onRootFillStart,
			remove: this.renderAllDependenciesBuffered,
			insert: this.renderAllDependenciesBuffered,
			append: this.renderAllDependenciesBuffered,
			move: this.renderAllDependenciesBuffered,
			sort: this.renderAllDependenciesBuffered,
			scope: this
		};
		Ext.apply(this.taskStoreListeners, {
			expand: this.renderAllDependenciesBuffered,
			collapse: this.renderAllDependenciesBuffered
		});
		a.on(this.taskStoreListeners);
		this.taskStore = a
	},
	onTaskStoreCascade: function(a, b) {
		if (b && b.nbrAffected > 0) {
			this.renderAllDependenciesBuffered()
		}
	},
	unBindTaskStore: function(a) {
		a = a || this.taskStore;
		if (!a) {
			return
		}
		if (this.ganttViewListeners) {
			this.ganttView.un(this.ganttViewListeners)
		}
		a.un(this.taskStoreListeners)
	},
	onRootFillStart: function() {
		var a = this.taskStore;
		this.unBindTaskStore(a);
		this.taskStore.on("fillcomplete",
		function() {
			this.bindTaskStore(a)
		},
		this, {
			single: true
		})
	},
	onDependencyClick: function(b, a) {
		var c = this.getRecordForDependencyEl(a);
		this.fireEvent("dependency" + b.type, this, c, b, a)
	},
	highlightDependency: function(a) {
		if (! (a instanceof Ext.data.Model)) {
			a = this.getDependencyRecordByInternalId(a)
		}
		if (a) {
			a.isHighlighted = true;
			this.getElementsForDependency(a).addCls(this.selectedCls)
		}
	},
	unhighlightDependency: function(a) {
		if (! (a instanceof Ext.data.Model)) {
			a = this.getDependencyRecordByInternalId(a)
		}
		if (a) {
			a.isHighlighted = false;
			this.getElementsForDependency(a).removeCls(this.selectedCls)
		}
	},
	getElementsForDependency: function(a) {
		var b = a instanceof Ext.data.Model ? a.internalId: a;
		return this.containerEl.select(".sch-dep-" + b)
	},
	depRe: new RegExp("sch-dep-([^\\s]+)"),
	getDependencyRecordByInternalId: function(d) {
		var c,
		b,
		a;
		for (b = 0, a = this.store.getCount(); b < a; b++) {
			c = this.store.getAt(b);
			if (c.internalId == d) {
				return c
			}
		}
		return null
	},
	getRecordForDependencyEl: function(c) {
		var a = c.className.match(this.depRe),
		d = null;
		if (a && a[1]) {
			var b = a[1];
			d = this.getDependencyRecordByInternalId(b)
		}
		return d
	},
	renderAllDependenciesBuffered: function() {
		var a = this;
		this.containerEl.update("");
		setTimeout(function() {
			if (!a.ganttView.isDestroyed) {
				a.renderAllDependencies()
			}
		},
		0)
	},
	renderAllDependencies: function() {
		if (!this.containerEl.dom) {
			return
		}
		this.containerEl.update("");
		this.renderDependencies(this.store.data.items);
		this.fireEvent("refresh", this)
	},
	getDependencyElements: function() {
		return this.containerEl.select("." + this.dependencyCls)
	},
	renderDependencies: function(b) {
		if (b) {
			var a = this.painter.getDependencyTplData(b);
			this.lineTpl[Ext.isIE ? "insertFirst": "append"](this.containerEl, a)
		}
	},
	renderTaskDependencies: function(d) {
		var c = [];
		if (d instanceof Ext.data.Model) {
			d = [d]
		}
		for (var a = 0, b = d.length; a < b; a++) {
			c = c.concat(this.store.getDependenciesForTask(d[a]))
		}
		this.renderDependencies(c)
	},
	onDependencyUpdate: function(b, a) {
		this.removeDependencyElements(a, false);
		this.renderDependencies(a)
	},
	onDependencyAdd: function(a, b) {
		this.renderDependencies(b)
	},
	removeDependencyElements: function(a, b) {
		if (b !== false) {
			this.getElementsForDependency(a).fadeOut({
				remove: true
			})
		} else {
			this.getElementsForDependency(a).remove()
		}
	},
	onDependencyDelete: function(b, a) {
		this.removeDependencyElements(a)
	},
	dimEventDependencies: function(a) {
		this.containerEl.select(this.depRe + a).setOpacity(0.2)
	},
	clearSelectedDependencies: function() {
		this.containerEl.select("." + this.selectedCls).removeCls(this.selectedCls);
		this.store.each(function(a) {
			a.isHighlighted = false
		})
	},
	onTaskUpdated: function(a) {
		if (!this.taskStore.cascading && (!a.previous || a.startDateField in a.previous || a.endDateField in a.previous)) {
			this.updateDependencies(a)
		}
	},
	updateDependencies: function(b) {
		if (b instanceof Ext.data.Model) {
			b = [b]
		}
		var a = this;
		Ext.each(b,
		function(c) {
			Ext.each(a.store.getDependenciesForTask(c),
			function(d) {
				a.removeDependencyElements(d, false)
			})
		});
		this.renderTaskDependencies(b)
	},
	onNewDependencyCreated: function() {},
	onDependencyDrop: function(f, d, b, e) {
		var c = this.store;
		var a = new c.model({
			fromTask: d,
			toTask: b,
			type: e
		});
		if (c.isValidDependency(a) && this.onNewDependencyCreated(a) !== false) {
			c.add(a)
		}
	},
	destroy: function() {
		if (this.dnd) {
			this.dnd.destroy()
		}
		this.unBindTaskStore();
		this.unBindDependencyStore()
	},
	setRowHeight: function(a, b) {
		this.rowHeight = a;
		this.painter.setRowHeight(a);
		if (!b) {
			this.renderAllDependencies()
		}
	}
});
Ext.define("Gnt.view.Gantt", {
	extend: "Sch.view.TimelineGridView",
	alias: ["widget.ganttview"],
	requires: ["Gnt.view.Dependency", "Gnt.model.Task", "Gnt.template.Task", "Gnt.template.ParentTask", "Gnt.template.Milestone", "Gnt.feature.TaskDragDrop", "Gnt.feature.ProgressBarResize", "Gnt.feature.TaskResize", "Sch.view.Horizontal"],
	uses: ["Gnt.feature.LabelEditor", "Gnt.feature.DragCreator"],
	mixins: ["Sch.mixin.FilterableTreeView"],
	_cmpCls: "sch-ganttview",
	barMargin: 4,
	scheduledEventName: "task",
	trackOver: false,
	toggleOnDblClick: false,
	milestoneOffset: 11,
	parentTaskOffset: 6,
	eventSelector: ".sch-gantt-item",
	eventWrapSelector: ".sch-event-wrap",
	progressBarResizer: null,
	taskResizer: null,
	taskDragDrop: null,
	dragCreator: null,
	dependencyView: null,
	resizeConfig: null,
	createConfig: null,
	dragDropConfig: null,
	progressBarResizeConfig: null,
	dependencyViewConfig: null,
	externalGetRowClass: null,
	constructor: function(a) {
		a = a || {};
		if (a) {
			this.externalGetRowClass = a.getRowClass;
			delete a.getRowClass
		}
		this.addEvents("taskclick", "taskdblclick", "taskcontextmenu", "beforetaskresize", "taskresizestart", "partialtaskresize", "aftertaskresize", "beforeprogressbarresize", "progressbarresizestart", "afterprogressbarresize", "beforetaskdrag", "taskdragstart", "taskdrop", "aftertaskdrop", "labeledit_beforestartedit", "labeledit_beforecomplete", "labeledit_complete", "beforedependencydrag", "dependencydragstart", "dependencydrop", "afterdependencydragdrop", "beforedragcreate", "dragcreatestart", "dragcreateend", "afterdragcreate", "scheduleclick", "scheduledblclick", "schedulecontextmenu");
		this.callParent(arguments);
		this.initTreeFiltering();
		this.addCls("sch-ganttview")
	},
	onRender: function() {
		this.configureLabels();
		this.setupGanttEvents();
		this.setupTemplates();
		this.callParent(arguments)
	},
	getDependencyStore: function() {
		return this.dependencyStore
	},
	configureFeatures: function() {
		if (this.enableProgressBarResize !== false) {
			this.progressBarResizer = Ext.create("Gnt.feature.ProgressBarResize", Ext.apply({
				ganttView: this
			},
			this.progressBarResizeConfig || {}));
			this.on({
				beforeprogressbarresize: this.onBeforeTaskProgressBarResize,
				progressbarresizestart: this.onTaskProgressBarResizeStart,
				afterprogressbarresize: this.onTaskProgressBarResizeEnd,
				scope: this
			})
		}
		if (this.resizeHandles !== "none") {
			this.taskResizer = Ext.create("Gnt.feature.TaskResize", Ext.apply({
				gantt: this,
				validatorFn: this.resizeValidatorFn || Ext.emptyFn,
				validatorFnScope: this.validatorFnScope || this
			},
			this.resizeConfig || {}));
			this.on({
				beforedragcreate: this.onBeforeDragCreate,
				beforetaskresize: this.onBeforeTaskResize,
				taskresizestart: this.onTaskResizeStart,
				aftertaskresize: this.onTaskResizeEnd,
				scope: this
			})
		}
		if (this.enableTaskDragDrop) {
			this.taskDragDrop = Ext.create("Gnt.feature.TaskDragDrop", this.ownerCt.el, Ext.apply({
				gantt: this,
				validatorFn: this.dndValidatorFn || Ext.emptyFn,
				validatorFnScope: this.validatorFnScope || this
			},
			this.dragDropConfig));
			this.on({
				beforetaskdrag: this.onBeforeTaskDrag,
				taskdragstart: this.onDragDropStart,
				aftertaskdrop: this.onDragDropEnd,
				scope: this
			})
		}
		if (this.enableDragCreation) {
			this.dragCreator = Ext.create("Gnt.feature.DragCreator", Ext.apply({
				ganttView: this,
				validatorFn: this.createValidatorFn || Ext.emptyFn,
				validatorFnScope: this.validatorFnScope || this
			},
			this.createConfig))
		}
	},
	getTemplateForTask: function(b, a) {
		if (b.isMilestone(a)) {
			return this.milestoneTemplate
		}
		if (b.isLeaf()) {
			return this.eventTemplate
		}
		return this.parentEventTemplate
	},
	columnRenderer: function(z, u, l) {
		var m = l.getStartDate(),
		p = this.timeAxis,
		v = Sch.util.Date,
		b = {},
		G = "",
		r = "",
		h = p.getStart(),
		g = p.getEnd(),
		J = l.isMilestone(),
		C = l.isLeaf(),
		q,
		s,
		y;
		if (m) {
			var A = l.getEndDate() || Sch.util.Date.add(m, Sch.util.Date.DAY, 1),
			e = Sch.util.Date.intersectSpans(m, A, h, g);
			if (e) {
				y = A > g;
				s = v.betweenLesser(m, h, g);
				var F = Math.floor(this.getXFromDate(s ? m: h)),
				d = Math.floor(this.getXFromDate(y ? g: A)),
				f = J ? 0: d - F,
				w = this.leftLabelField,
				k = this.rightLabelField,
				x = this.topLabelField,
				j = this.bottomLabelField,
				I = this.getTemplateForTask(l);
				if (!J && !C) {
					if (y) {
						f += this.parentTaskOffset
					} else {
						f += 2 * this.parentTaskOffset
					}
				}
				b = {
					id: l.internalId,
					offset: J ? (d || F) - this.getXOffset(l) : F,
					width: Math.max(1, f),
					ctcls: "",
					cls: "",
					print: this._print,
					record: l,
					percentDone: Math.min(l.getPercentDone() || 0, 100)
				};
				q = this.eventRenderer.call(this.eventRendererScope || this, l, b, l.store) || {};
				if (w) {
					b.leftLabel = w.renderer.call(w.scope || this, l.data[w.dataIndex], l)
				}
				if (k) {
					b.rightLabel = k.renderer.call(k.scope || this, l.data[k.dataIndex], l)
				}
				if (x) {
					b.topLabel = x.renderer.call(x.scope || this, l.data[x.dataIndex], l)
				}
				if (j) {
					b.bottomLabel = j.renderer.call(j.scope || this, l.data[j.dataIndex], l)
				}
				Ext.apply(b, q);
				var i = " sch-event-resizable-" + l.getResizable();
				if (J) {
					b.side = Math.round((this.enableBaseline ? 0.4: 0.5) * this.rowHeight);
					r += " sch-gantt-milestone"
				} else {
					b.width = Math.max(1, f);
					if (y) {
						r += " sch-event-endsoutside "
					}
					if (!s) {
						r += " sch-event-startsoutside "
					}
					if (C) {
						r += " sch-gantt-task"
					} else {
						r += " sch-gantt-parent-task"
					}
				}
				if (l.dirty) {
					i += " sch-dirty "
				}
				if (l.isDraggable() === false) {
					i += " sch-event-fixed "
				}
				b.cls = (b.cls || "") + (l.getCls() || "") + i;
				b.ctcls += " " + r;
				G += I.apply(b)
			}
		}
		if (this.enableBaseline) {
			var t = l.getBaselineStartDate(),
			a = l.getBaselineEndDate();
			if (!q) {
				q = this.eventRenderer.call(this, l, b, l.store) || {}
			}
			if (t && a && Sch.util.Date.intersectSpans(t, a, h, g)) {
				y = a > g;
				s = v.betweenLesser(t, h, g);
				var c = l.isBaselineMilestone(),
				o = Math.floor(this.getXFromDate(s ? t: h)),
				n = Math.floor(this.getXFromDate(y ? g: a)),
				E = c ? 0: n - o,
				B = this.getTemplateForTask(l, true),
				H = {
					progressBarStyle: q.baseProgressBarStyle || "",
					id: l.internalId + "-base",
					percentDone: l.getBaselinePercentDone(),
					offset: c ? (n || o) - this.getXOffset(l, true) : o,
					print: this._print,
					width: Math.max(1, E),
					baseline: true
				};
				r = "";
				if (c) {
					H.side = Math.round(0.4 * this.rowHeight);
					r = "sch-gantt-milestone-baseline sch-gantt-baseline-item"
				} else {
					if (l.isLeaf()) {
						r = "sch-gantt-task-baseline sch-gantt-baseline-item"
					} else {
						r = "sch-gantt-parenttask-baseline sch-gantt-baseline-item"
					}
				}
				if (y) {
					r += " sch-event-endsoutside "
				}
				if (!s) {
					r += " sch-event-startsoutside "
				}
				H.ctcls = r + " " + (q.basecls || "");
				G += B.apply(H)
			}
		}
		return G
	},
	setupTemplates: function() {
		var a = {
			leftLabel: this.leftLabelField,
			rightLabel: this.rightLabelField,
			topLabel: this.topLabelField,
			bottomLabel: this.bottomLabelField,
			prefix: this.eventPrefix,
			resizeHandles: this.resizeHandles,
			enableDependencyDragDrop: this.enableDependencyDragDrop !== false,
			enableProgressBarResize: this.enableProgressBarResize,
			rtl: this.rtl
		};
		var b;
		if (!this.eventTemplate) {
			b = this.taskBodyTemplate ? Ext.apply({
				innerTpl: this.taskBodyTemplate
			},
			a) : a;
			this.eventTemplate = Ext.create("Gnt.template.Task", b)
		}
		if (!this.parentEventTemplate) {
			b = this.parentTaskBodyTemplate ? Ext.apply({
				innerTpl: this.parentTaskBodyTemplate
			},
			a) : a;
			this.parentEventTemplate = Ext.create("Gnt.template.ParentTask", b)
		}
		if (!this.milestoneTemplate) {
			b = this.milestoneBodyTemplate ? Ext.apply({
				innerTpl: this.milestoneBodyTemplate
			},
			a) : a;
			this.milestoneTemplate = Ext.create("Gnt.template.Milestone", b)
		}
	},
	getDependencyView: function() {
		return this.dependencyView
	},
	getTaskStore: function() {
		return this.taskStore
	},
	initDependencies: function() {
		if (this.dependencyStore) {
			var b = this,
			a = Ext.create("Gnt.view.Dependency", Ext.apply({
				containerEl: b.el,
				ganttView: b,
				enableDependencyDragDrop: b.enableDependencyDragDrop,
				store: b.dependencyStore,
				rtl: b.rtl
			},
			this.dependencyViewConfig));
			a.on({
				beforednd: b.onBeforeDependencyDrag,
				dndstart: b.onDependencyDragStart,
				drop: b.onDependencyDrop,
				afterdnd: b.onAfterDependencyDragDrop,
				beforecascade: b.onBeforeCascade,
				cascade: b.onCascade,
				scope: b
			});
			b.dependencyView = a;
			b.relayEvents(a, ["dependencyclick", "dependencycontextmenu", "dependencydblclick"])
		}
	},
	setupGanttEvents: function() {
		var a = this.getSelectionModel();
		if (this.toggleParentTasksOnClick) {
			this.on({
				taskclick: function(c, b) {
					if (!b.isLeaf()) {
						b.isExpanded() ? b.collapse() : b.expand()
					}
				}
			})
		}
	},
	configureLabels: function() {
		var a = {
			renderer: function(b) {
				return b
			},
			dataIndex: undefined
		};
		Ext.Array.forEach(["left", "right", "top", "bottom"],
		function(c) {
			var b = this[c + "LabelField"];
			if (b) {
				if (Ext.isString(b)) {
					b = this[c + "LabelField"] = {
						dataIndex: b
					}
				}
				Ext.applyIf(b, a);
				if (b.editor) {
					b.editor = Ext.create("Gnt.feature.LabelEditor", this, {
						labelPosition: c,
						field: b.editor,
						dataIndex: b.dataIndex
					})
				}
			}
		},
		this);
		this.on("labeledit_beforestartedit", this.onBeforeLabelEdit, this)
	},
	onBeforeTaskDrag: function(b, a) {
		return ! this.readOnly && a.isDraggable() !== false && (this.allowParentTaskMove || a.isLeaf())
	},
	onDragDropStart: function() {
		if (this.tip) {
			this.tip.disable()
		}
	},
	onDragDropEnd: function() {
		if (this.tip) {
			this.tip.enable()
		}
	},
	onTaskProgressBarResizeStart: function() {
		if (this.tip) {
			this.tip.hide();
			this.tip.disable()
		}
	},
	onTaskProgressBarResizeEnd: function() {
		if (this.tip) {
			this.tip.enable()
		}
	},
	onTaskResizeStart: function() {
		if (this.tip) {
			this.tip.hide();
			this.tip.disable()
		}
	},
	onTaskResizeEnd: function() {
		if (this.tip) {
			this.tip.enable()
		}
	},
	onBeforeDragCreate: function() {
		return ! this.readOnly
	},
	onBeforeTaskResize: function(a, b) {
		return ! this.readOnly && b.getSchedulingMode() !== "EffortDriven"
	},
	onBeforeTaskProgressBarResize: function() {
		return ! this.readOnly
	},
	onBeforeLabelEdit: function() {
		return ! this.readOnly
	},
	onBeforeEdit: function() {
		return ! this.readOnly
	},
	afterRender: function() {
		this.initDependencies();
		this.callParent(arguments);
		this.el.on("mousemove", this.configureFeatures, this, {
			single: true
		})
	},
	resolveTaskRecord: function(a) {
		var b = this.findItemByChild(a);
		if (b) {
			return this.getRecord(this.findItemByChild(a))
		}
		return null
	},
	resolveEventRecord: function(a) {
		return this.resolveTaskRecord(a)
	},
	highlightTask: function(b, a) {
		if (! (b instanceof Ext.data.Model)) {
			b = this.taskStore.getById(b)
		}
		if (b) {
			b.isHighlighted = true;
			var d = this.getNode(b);
			if (d) {
				Ext.fly(d).addCls("sch-gantt-task-highlighted")
			}
			var c = b.getInternalId();
			if (a !== false) {
				this.dependencyStore.each(function(e) {
					if (e.getSourceId() == c) {
						this.highlightDependency(e);
						this.highlightTask(e.getTargetId(), a)
					}
				},
				this)
			}
		}
	},
	unhighlightTask: function(a, c) {
		if (! (a instanceof Ext.data.Model)) {
			a = this.taskStore.getById(a)
		}
		if (a) {
			a.isHighlighted = false;
			Ext.fly(this.getNode(a)).removeCls("sch-gantt-task-highlighted");
			var b = a.getId() || a.internalId;
			if (c !== false) {
				this.dependencyStore.each(function(d) {
					if (d.getSourceId() == b) {
						this.unhighlightDependency(d);
						this.unhighlightTask(d.getTargetId(), c)
					}
				},
				this)
			}
		}
	},
	getRowClass: function(b) {
		var a = "";
		if (b.isHighlighted) {
			a = "sch-gantt-task-highlighted"
		}
		if (this.externalGetRowClass) {
			a += " " + (this.externalGetRowClass.apply(this, arguments) || "")
		}
		return a
	},
	clearSelectedTasksAndDependencies: function() {
		this.getSelectionModel().deselectAll();
		this.getDependencyView().clearSelectedDependencies();
		this.el.select("tr.sch-gantt-task-highlighted").removeCls("sch-gantt-task-highlighted");
		this.taskStore.getRootNode().cascadeBy(function(a) {
			a.isHighlighted = false
		})
	},
	getCriticalPaths: function() {
		return this.taskStore.getCriticalPaths()
	},
	highlightCriticalPaths: function() {
		this.clearSelectedTasksAndDependencies();
		var g = this.getCriticalPaths(),
		c = this.getDependencyView(),
		f = this.dependencyStore,
		e,
		d,
		b,
		a;
		Ext.each(g,
		function(h) {
			for (d = 0, b = h.length; d < b; d++) {
				e = h[d];
				this.highlightTask(e, false);
				if (d < (b - 1)) {
					a = f.getAt(f.findBy(function(i) {
						return i.getTargetId() == e.getInternalId() && i.getSourceId() == h[d + 1].getInternalId()
					}));
					c.highlightDependency(a)
				}
			}
		},
		this);
		this.addCls("sch-gantt-critical-chain");
		this.getSelectionModel().setLocked(true)
	},
	unhighlightCriticalPaths: function() {
		this.el.removeCls("sch-gantt-critical-chain");
		this.getSelectionModel().setLocked(false);
		this.clearSelectedTasksAndDependencies()
	},
	getXOffset: function(b, a) {
		var c = 0;
		if (b.isMilestone(a)) {
			c = Math.floor(this.rowHeight * Math.sqrt(2) / 4) - 2
		} else {
			if (!b.isLeaf() && !a) {
				c = this.parentTaskOffset
			}
		}
		return c
	},
	onDestroy: function() {
		if (this.dependencyView) {
			this.dependencyView.destroy()
		}
		this.callParent(arguments)
	},
	highlightDependency: function(a) {
		this.dependencyView.highlightDependency(a)
	},
	unhighlightDependency: function(a) {
		this.dependencyView.unhighlightDependency(a)
	},
	onBeforeDependencyDrag: function(b, a) {
		return this.fireEvent("beforedependencydrag", this, a)
	},
	onDependencyDragStart: function(a) {
		this.fireEvent("dependencydragstart", this);
		if (this.tip) {
			this.tip.disable()
		}
	},
	onDependencyDrop: function(b, c, a, d) {
		this.fireEvent("dependencydrop", this, this.taskStore.getById(c), this.taskStore.getById(a), d)
	},
	onAfterDependencyDragDrop: function() {
		this.fireEvent("afterdependencydragdrop", this);
		if (this.tip) {
			this.tip.enable()
		}
	},
	onBeforeCascade: function(a, b) {
		this.taskStore.un("update", this.onUpdate, this)
	},
	onCascade: function(a, b) {
		this.taskStore.on("update", this.onUpdate, this)
	},
	getLeftEditor: function() {
		return this.leftLabelField.editor
	},
	getRightEditor: function() {
		return this.rightLabelField.editor
	},
	getTopEditor: function() {
		return this.topLabelField.editor
	},
	getBottomEditor: function() {
		return this.bottomLabelField.editor
	},
	editLeftLabel: function(a) {
		var b = this.leftLabelField && this.leftLabelField.editor;
		if (b) {
			b.edit(a)
		}
	},
	editRightLabel: function(a) {
		var b = this.rightLabelField && this.rightLabelField.editor;
		if (b) {
			b.edit(a)
		}
	},
	editTopLabel: function(a) {
		var b = this.topLabelField && this.topLabelField.editor;
		if (b) {
			b.edit(a)
		}
	},
	editBottomLabel: function(a) {
		var b = this.bottomLabelField && this.bottomLabelField.editor;
		if (b) {
			b.edit(a)
		}
	},
	getOuterElementFromEventRecord: function(a) {
		var b = this.callParent([a]);
		return b && b.up(this.eventWrapSelector) || null
	},
	getDependenciesForTask: function(a) {
		console.warn("`ganttPanel.getDependenciesForTask()` is deprecated, use `task.getAllDependencies()` instead");
		return a.getAllDependencies()
	},
	onAdd: function() {
		Ext.suspendLayouts();
		this.callParent(arguments);
		Ext.resumeLayouts()
	},
	onRemove: function() {
		Ext.suspendLayouts();
		this.callParent(arguments);
		Ext.resumeLayouts()
	},
	onUpdate: function(c, a, b, d) {
		Ext.suspendLayouts();
		this.callParent(arguments);
		Ext.resumeLayouts()
	},
	handleScheduleEvent: function(c) {
		var a = c.getTarget("." + this.timeCellCls, 3);
		if (a) {
			var b = this.findRowByChild(a);
			this.fireEvent("schedule" + c.type, this, this.getDateFromDomEvent(c, "floor"), this.indexOf(b), c)
		}
	},
	scrollEventIntoView: function(c, d, a, l, m) {
		m = m || this;
		var h = this;
		var i = this.taskStore;
		var j = function(n) {
			h.up("panel").scrollTask.cancel();
			n.scrollIntoView(h.el, true, a);
			if (d) {
				if (typeof d === "boolean") {
					n.highlight()
				} else {
					n.highlight(null, d)
				}
			}
			l && l.call(m)
		};
		if (!c.isVisible()) {
			c.bubble(function(n) {
				n.expand()
			})
		}
		var k;
		var b = c.getStartDate();
		var g = c.getEndDate();
		if (b && g) {
			var f = this.timeAxis;
			if (!f.dateInAxis(b) || !f.dateInAxis(g)) {
				var e = f.getEnd() - f.getStart();
				f.setTimeSpan(new Date(b.getTime() - e / 2), new Date(g.getTime() + e / 2))
			}
			k = this.getElementFromEventRecord(c)
		} else {
			k = this.getNode(c);
			if (k) {
				k = Ext.fly(k).down(this.getCellSelector())
			}
		}
		if (k) {
			j(k)
		} else {
			if (this.bufferedRenderer) {
				Ext.Function.defer(function() {
					h.bufferedRenderer.scrollTo(i.getIndexInTotalDataset(c), false,
					function() {
						var n = h.getElementFromEventRecord(c);
						if (n) {
							j(n)
						} else {
							l && l.call(m)
						}
					})
				},
				10)
			}
		}
	}
});
Ext.define("Gnt.view.ResourceHistogram", {
	extend: "Sch.view.TimelineGridView",
	alias: "widget.resourcehistogramview",
	requires: ["Ext.XTemplate", "Ext.util.Format", "Sch.util.Date", "Gnt.model.Resource"],
	_cmpCls: "gnt-resourcehistogramview",
	scheduledEventName: "bar",
	eventSelector: ".gnt-resourcehistogram-bar",
	barTpl: null,
	barCls: "gnt-resourcehistogram-bar",
	lineTpl: null,
	lineCls: "gnt-resourcehistogram-line",
	limitLineTpl: null,
	limitLineCls: "gnt-resourcehistogram-limitline",
	limitLineWidth: 1,
	rowHeight: 60,
	labelMode: false,
	labelPercentFormat: "0",
	labelUnitsFormat: "0.0",
	unitHeight: null,
	constructor: function(a) {
		this.callParent(arguments);
		if (this.barCls) {
			this.eventSelector = "." + this.barCls
		}
		this.unitHeight = this.getAvailableHeight() / (this.scaleMax - this.scaleMin + this.scaleStep);
		if (!this.barTpl) {
			this.barTpl = new Ext.XTemplate('<tpl for=".">', '<div id="{id}" class="' + this.barCls + ' {cls}" gnt-bar-index="{index}" style="left:{left}px;top:{top}px;height:{height}px;width:{width}px"></div>', "<tpl if=\"text !== ''\">", '<span class="' + this.barCls + '-text" style="left:{left}px;">{text}</span>', "</tpl>", "</tpl>")
		}
		if (!this.lineTpl) {
			this.lineTpl = new Ext.XTemplate('<tpl for=".">', '<div class="' + this.lineCls + ' {cls}" style="top:{top}px;"></div>', "</tpl>")
		}
		if (!this.limitLineTpl) {
			this.limitLineTpl = new Ext.XTemplate('<tpl for=".">', '<div class="' + this.limitLineCls + ' {cls}" style="left:{left}px;top:{top}px;bottom:{bottom}px;width:{width}px;height:{height}px"></div>', "</tpl>")
		}
		this.addEvents("barclick", "bardblclick", "barcontextmenu")
	},
	onUpdate: function(b, d, a, c) {
		if (Ext.Array.indexOf(Gnt.model.Resource.prototype.calendarIdField, c) > -1) {
			this.histogram.loadAllocationData(d, true);
			this.histogram.unbindResourceCalendarListeners(d);
			var e = d.getOwnCalendar();
			if (e && e !== this.histogram.calendar) {
				this.histogram.bindResourceCalendarListeners(d, e)
			}
		}
		this.callParent(arguments)
	},
	onDataRefresh: function() {
		this.histogram.loadAllocationData(null, true);
		this.histogram.bindCalendarListeners();
		this.callParent(arguments)
	},
	renderLines: function(a) {
		return this.lineTpl.apply(this.prepareLines(a))
	},
	prepareLines: function(g) {
		var h = g.scaleMin,
		d = g.scaleLabelStep,
		a = this.getAvailableHeight(),
		e = [],
		m = {},
		k = this.lineCls,
		j = k + "min";
		if (g.scalePoints) {
			var f;
			for (var c = 0, b = g.scalePoints.length; c < b; c++) {
				f = g.scalePoints[c];
				e.push({
					value: f.value,
					top: f.top || Math.round(a - this.unitHeight * (f.value - g.scaleMin)),
					cls: f.cls + (f.label ? " " + k + "-label": "") + (c === 0 ? " " + k + "-min": (c == b ? " " + k + "-max": ""))
				})
			}
		} else {
			while (h <= g.scaleMax) {
				e.push({
					value: h,
					top: Math.round(a - this.unitHeight * (h - g.scaleMin)),
					cls: j
				});
				h += g.scaleStep;
				j = h % d ? "": k + "-label";
				if (h == g.scaleMax) {
					j += " " + k + "-max"
				}
			}
			if (e.length && e[e.length - 1].value !== g.scaleMax) {
				e.push({
					value: g.scaleMax,
					top: Math.round(a - this.unitHeight * (g.scaleMax - g.scaleMin)),
					cls: (g.scaleMax % d ? "": k + "-label") + " " + k + "-max"
				})
			}
		}
		return e
	},
	renderLimitLines: function(b, a) {
		return this.limitLineTpl.apply(this.prepareLimitLines(b, a))
	},
	prepareLimitLines: function(o, j) {
		var m = [],
		a = this.getAvailableHeight(),
		p = this.limitLineCls,
		e,
		c,
		k,
		n,
		b,
		f,
		d;
		for (var h = 0, g = j.length; h < g; h++) {
			d = this.getXFromDate(j[h].startDate || o.getStart(), true);
			e = {
				left: d,
				width: this.getXFromDate(j[h].endDate || o.getEnd(), true) - d,
				top: "",
				bottom: "",
				height: 0,
				cls: ""
			};
			k = o.calendar.convertMSDurationToUnit(j[h].allocationMS, o.scaleUnit);
			f = true;
			if (k * this.unitHeight > a) {
				k = o.scaleMax + o.scaleStep;
				f = false
			} else {
				if (k < o.scaleMin) {
					k = o.scaleMin;
					f = false
				}
			}
			e.height = 0;
			if (c > k) {
				e.bottom = Math.round((k - o.scaleMin) * this.unitHeight) - this.limitLineWidth;
				b = "bottom";
				e.top = "";
				if (f) {
					e.cls += " " + p + "-bottom"
				}
			} else {
				e.top = Math.round(a - (k - o.scaleMin) * this.unitHeight);
				b = "top";
				e.bottom = "";
				if (f) {
					e.cls += " " + p + "-top"
				}
			}
			if (m[0]) {
				if (m[m.length - 1][b]) {
					e.height = (m[m.length - 1][b] - e[b]) + this.limitLineWidth
				} else {
					e.height = a - (e[b] + m[m.length - 1][b == "top" ? "bottom": "top"])
				}
			}
			e.height = Math.round(Math.abs(e.height));
			c = k;
			m.push(e)
		}
		return m
	},
	renderBars: function(b, a, c) {
		return this.barTpl.apply(this.prepareBars(b, a, c))
	},
	prepareBars: function(j, e, f) {
		var h = [],
		a = this.getAvailableHeight(),
		k = this.barCls,
		b,
		g;
		for (var d = 0, c = e.length; d < c; d++) {
			if (e[d].totalAllocation) {
				g = j.calendar.convertMSDurationToUnit(e[d].allocationMS, j.scaleUnit);
				b = {
					id: f + "-" + d,
					index: d,
					left: this.getXFromDate(e[d].startDate, true),
					width: this.getXFromDate(e[d].endDate, true) - this.getXFromDate(e[d].startDate, true),
					height: a,
					top: 0,
					text: "",
					cls: ""
				};
				if (this.labelMode) {
					switch (this.labelMode) {
					case "percent":
						b.text = Ext.util.Format.number(e[d].totalAllocation, this.labelPercentFormat) + "%";
						break;
					case "units":
						b.text = Ext.util.Format.number(g, this.labelUnitsFormat) + Sch.util.Date.getShortNameOfUnit(j.scaleUnit);
						break;
					default:
						b.text = this.labelMode.apply({
							allocation: g,
							percent: e[d].totalAllocation
						})
					}
				}
				if (g <= j.scaleMax + j.scaleStep) {
					b.height = g >= j.scaleMin ? Math.round((g - j.scaleMin) * this.unitHeight) : 0;
					b.top = a - b.height
				} else {
					b.cls = k + "-partofbar"
				}
				if (e[d].totalAllocation > 100) {
					b.cls = k + "-overwork"
				}
				h.push(b)
			}
		}
		return h
	},
	columnRenderer: function(e, d, c, g, b) {
		var f = c.getInternalId(),
		a = this.normalGrid.getView();
		return (this.showScaleLines ? a.renderLines(this) : "") + a.renderBars(this, this.allocationData[f].bars, f) + (this.showLimitLines ? a.renderLimitLines(this, this.allocationData[f].maxBars) : "")
	},
	getAvailableHeight: function() {
		if (this.availableHeight) {
			return this.availableHeight
		}
		this.availableHeight = this.rowHeight - this.cellTopBorderWidth - this.cellBottomBorderWidth;
		return this.availableHeight
	},
	resolveEventRecord: function(c) {
		var e = this.findItemByChild(c);
		if (e) {
			var g = this.getRecord(e);
			if (g) {
				var a = {
					resource: g
				};
				var f = this.histogram.allocationData[g.getInternalId()];
				var b = c.getAttribute("gnt-bar-index");
				var d = f.bars[b];
				a.startDate = d.startDate;
				a.endDate = d.endDate;
				a.assignments = d.assignments;
				a.allocationMS = d.allocationMS;
				a.totalAllocation = d.totalAllocation;
				return a
			}
		}
		return null
	},
	getDataForTooltipTpl: function(a) {
		return a
	}
});
Ext.define("Gnt.patches.IEGanttView", {
	extend: "Sch.util.Patch",
	requires: ["Gnt.view.Gantt"],
	target: "Gnt.view.Gantt",
	ieOnly: true,
	overrides: {
		onRowFocus: function(b, a, c) {
			this.callParent([b, a, true])
		}
	}
});
Ext.define("Gnt.column.Scale", {
	extend: "Ext.grid.column.Template",
	alias: "widget.scalecolumn",
	tpl: null,
	sortable: false,
	scalePoints: null,
	scaleStep: 2,
	scaleLabelStep: 4,
	scaleMin: 0,
	scaleMax: 24,
	width: 40,
	availableHeight: 48,
	scaleCellCls: "gnt-scalecolumn",
	_isGanttColumn: false,
	initComponent: function() {
		this.tdCls = (this.tdCls || "") + " " + this.scaleCellCls;
		if (!this.tpl) {
			this.tpl = new Ext.XTemplate('<div class="' + this.scaleCellCls + '-wrap" style="height:{scaleHeight}px;">', '<tpl for="scalePoints">', "<tpl if=\"label !== ''\">", '<span class="' + this.scaleCellCls + '-label-line {cls}" style="top:{top}px"><span class="' + this.scaleCellCls + '-label">{label}</span></span>', "<tpl else>", '<span class="' + this.scaleCellCls + '-line {cls}" style="top:{top}px"></span>', "</tpl>", "</tpl>", "</div>")
		}
		this.setAvailableHeight(this.availableHeight, true);
		this.callParent(arguments)
	},
	setAvailableHeight: function(a, b) {
		this.availableHeight = a;
		if (!this.scalePoints) {
			this.scaleStepHeight = this.availableHeight / (this.scaleMax - this.scaleMin + this.scaleStep);
			this.scalePoints = this.buildScalePoints()
		} else {
			if (b) {
				this.scalePoints.sort(function(d, c) {
					return d.value > c.value
				});
				this.scaleMin = this.scalePoints[0].value;
				this.scaleMax = this.scalePoints[this.scalePoints.length - 1].value;
				this.scaleStep = (this.scaleMax - this.scaleMin) / 10
			}
			this.scaleStepHeight = this.availableHeight / (this.scaleMax - this.scaleMin + this.scaleStep);
			this.updateScalePointsTops()
		}
	},
	defaultRenderer: function(c, d, a) {
		var b = {
			record: Ext.apply({},
			a.data, a.getAssociatedData()),
			scaleHeight: this.availableHeight,
			scalePoints: this.scalePoints
		};
		return this.tpl.apply(b)
	},
	buildScalePoints: function() {
		var g = this.scaleMin,
		h = g,
		c = this.scaleStep,
		f = this.scaleLabelStep,
		d = this.scaleStepHeight,
		b = this.availableHeight,
		a = this.scaleCellCls,
		i = a + "-min",
		j = [];
		var e = function(m, l, k) {
			return {
				top: Math.round(b - (m - g) * d),
				value: m,
				label: l != "undefined" ? l: "",
				cls: k || ""
			}
		};
		while (h < this.scaleMax) {
			j.push(e(h, h % f || h === g ? "": h, i));
			i = "";
			h += c
		}
		j.push(e(this.scaleMax, this.scaleMax, a + "-max"));
		return j
	},
	updateScalePointsTops: function() {
		var d = this.scaleStepHeight,
		e = this.availableHeight,
		a;
		for (var c = 0, b = this.scalePoints.length; c < b; c++) {
			a = this.scalePoints[c];
			a.top = Math.round(e - a.value * d)
		}
	}
});
Ext.define("Gnt.panel.Gantt", {
	extend: "Sch.panel.TimelineTreePanel",
	alias: ["widget.ganttpanel"],
	alternateClassName: ["Sch.gantt.GanttPanel"],
	requires: ["Ext.layout.container.Border", "Gnt.model.Dependency", "Gnt.data.ResourceStore", "Gnt.data.AssignmentStore", "Gnt.feature.WorkingTime", "Gnt.data.Calendar", "Gnt.data.TaskStore", "Gnt.data.DependencyStore", "Gnt.view.Gantt", "Gnt.patches.ColumnResize"],
	uses: ["Sch.plugin.CurrentTimeLine"],
	viewType: "ganttview",
	layout: "border",
	rowLines: true,
	syncRowHeight: false,
	useSpacer: false,
	rowHeight: 24,
	leftLabelField: null,
	rightLabelField: null,
	highlightWeekends: true,
	weekendsAreWorkdays: false,
	skipWeekendsDuringDragDrop: true,
	enableTaskDragDrop: true,
	enableDependencyDragDrop: true,
	enableProgressBarResize: false,
	toggleParentTasksOnClick: true,
	addRowOnTab: true,
	recalculateParents: true,
	cascadeChanges: false,
	showTodayLine: false,
	enableBaseline: false,
	baselineVisible: false,
	enableAnimations: false,
	workingTimePlugin: null,
	todayLinePlugin: null,
	allowParentTaskMove: false,
	enableDragCreation: true,
	eventRenderer: Ext.emptyFn,
	eventRendererScope: null,
	eventTemplate: null,
	parentEventTemplate: null,
	milestoneTemplate: null,
	taskBodyTemplate: null,
	parentTaskBodyTemplate: null,
	milestoneBodyTemplate: null,
	autoHeight: null,
	calendar: null,
	taskStore: null,
	dependencyStore: null,
	resourceStore: null,
	assignmentStore: null,
	columnLines: false,
	dndValidatorFn: Ext.emptyFn,
	createValidatorFn: Ext.emptyFn,
	resizeHandles: "both",
	resizeValidatorFn: Ext.emptyFn,
	resizeConfig: null,
	progressBarResizeConfig: null,
	dragDropConfig: null,
	createConfig: null,
	autoFitOnLoad: false,
	refreshLockedTreeOnDependencyUpdate: false,
	_lockedDependencyListeners: null,
	wbsColumn: null,
	earlyStartColumn: null,
	earlyEndColumn: null,
	lateStartColumn: null,
	lateEndColumn: null,
	earlyDatesListeners: null,
	lateDatesListeners: null,
	refreshTimeout: 100,
	getEventSelectionModel: function() {
		return this.getSelectionModel()
	},//TODO
	reorderTaskFakeIds : function() {
		var store = this.taskStore;
		
		var idx = 0;
		function setFakeId(rec) {
			rec.set('fakeId', idx++);
			rec.commit();
			
			Ext.each(rec.childNodes, setFakeId);
		}
		setFakeId(store.getRootNode());

	},
	initStores: function() {
		if (!this.taskStore) {
			Ext.Error.raise("You must specify a taskStore config.")
		}
		
		//bind datachange event!
		var me = this;
		this.taskStore.on('datachanged', function() {
			me.reorderTaskFakeIds();
		});
		
		var a = Ext.StoreMgr.lookup(this.taskStore);
		if (!a) {
			Ext.Error.raise("You have provided an incorrect taskStore identifier")
		}
		if (! (a instanceof Gnt.data.TaskStore)) {
			Ext.Error.raise("A `taskStore` should be an instance of `Gnt.data.TaskStore` (or of a subclass)")
		}
		Ext.apply(this, {
			store: a,
			taskStore: a
		});
		var d = this.calendar = a.calendar;
		if (this.dependencyStore) {
			this.dependencyStore = Ext.StoreMgr.lookup(this.dependencyStore);
			a.setDependencyStore(this.dependencyStore)
		} else {
			this.dependencyStore = a.dependencyStore
		}
		if (! (this.dependencyStore instanceof Gnt.data.DependencyStore)) {
			Ext.Error.raise("The Gantt dependency store should be a Gnt.data.DependencyStore, or a subclass thereof.")
		}
		var b = this.resourceStore ? Ext.StoreMgr.lookup(this.resourceStore) : a.getResourceStore();
		if (! (b instanceof Gnt.data.ResourceStore)) {
			Ext.Error.raise("A `ResourceStore` should be an instance of `Gnt.data.ResourceStore` (or of a subclass)")
		}
		var c = this.assignmentStore ? Ext.StoreMgr.lookup(this.assignmentStore) : a.getAssignmentStore();
		if (! (c instanceof Gnt.data.AssignmentStore)) {
			Ext.Error.raise("An `assignmentStore` should be an instance of `Gnt.data.AssignmentStore` (or of a subclass)")
		}
		this.bindAssignmentStore(c, true);
		this.bindResourceStore(b, true);
		if (this.needToTranslateOption("weekendsAreWorkdays")) {
			d.setWeekendsAreWorkDays(this.weekendsAreWorkdays)
		}
	},
	initComponent: function() {
		var e = this;
		if (Ext.isBoolean(this.showBaseline)) {
			this.enableBaseline = this.baselineVisible = this.showBaseline;
			this.showBaseline = Gnt.panel.Gantt.prototype.showBaseline
		}
		this.autoHeight = false;
		this.initStores();
		if (this.needToTranslateOption("cascadeChanges")) {
			this.setCascadeChanges(this.cascadeChanges)
		}
		if (this.needToTranslateOption("recalculateParents")) {
			this.setRecalculateParents(this.recalculateParents)
		}
		if (this.needToTranslateOption("skipWeekendsDuringDragDrop")) {
			this.setSkipWeekendsDuringDragDrop(this.skipWeekendsDuringDragDrop)
		}
		var d = this.normalViewConfig = this.normalViewConfig || {};
		Ext.apply(this.normalViewConfig, {
			taskStore: this.taskStore,
			dependencyStore: this.dependencyStore,
			enableDependencyDragDrop: this.enableDependencyDragDrop,
			enableTaskDragDrop: this.enableTaskDragDrop,
			enableProgressBarResize: this.enableProgressBarResize,
			enableDragCreation: this.enableDragCreation,
			allowParentTaskMove: this.allowParentTaskMove,
			toggleParentTasksOnClick: this.toggleParentTasksOnClick,
			resizeHandles: this.resizeHandles,
			enableBaseline: this.baselineVisible || this.enableBaseline,
			leftLabelField: this.leftLabelField,
			rightLabelField: this.rightLabelField,
			topLabelField: this.topLabelField,
			bottomLabelField: this.bottomLabelField,
			eventTemplate: this.eventTemplate,
			parentEventTemplate: this.parentEventTemplate,
			milestoneTemplate: this.milestoneTemplate,
			taskBodyTemplate: this.taskBodyTemplate,
			parentTaskBodyTemplate: this.parentTaskBodyTemplate,
			milestoneBodyTemplate: this.milestoneBodyTemplate,
			resizeConfig: this.resizeConfig,
			dragDropConfig: this.dragDropConfig
		});
		if (this.topLabelField || this.bottomLabelField) {
			this.addCls("sch-gantt-topbottom-labels " + (this.topLabelField ? "sch-gantt-top-label": ""));
			this.normalViewConfig.rowHeight = 52
		}
		this.configureFunctionality();
		this.mon(this.taskStore, "beforecascade", this.onBeforeCascade, this);
		this.mon(this.taskStore, "cascade", this.onAfterCascade, this);
		this.callParent(arguments);
		if (this.autoFitOnLoad) {
			if (this.store.getCount()) {
				this.zoomToFit()
			}
			this.mon(this.store, "load",
			function() {
				this.zoomToFit()
			},
			this)
		}
		this.bodyCls = (this.bodyCls || "") + " sch-ganttpanel-container-body";
		var c = this.getSchedulingView();
		c.store.calendar = this.calendar;
		this.relayEvents(c, ["taskclick", "taskdblclick", "taskcontextmenu", "beforetaskresize", "taskresizestart", "partialtaskresize", "aftertaskresize", "beforeprogressbarresize", "progressbarresizestart", "afterprogressbarresize", "beforetaskdrag", "taskdragstart", "taskdrop", "aftertaskdrop", "labeledit_beforestartedit", "labeledit_beforecomplete", "labeledit_complete", "beforedependencydrag", "dependencydragstart", "dependencydrop", "afterdependencydragdrop", "dependencyclick", "dependencycontextmenu", "dependencydblclick", "scheduleclick", "scheduledblclick", "schedulecontextmenu"]);
		if (this.addRowOnTab) {
			var g = this.getSelectionModel();
			g.onEditorTab = Ext.Function.createInterceptor(g.onEditorTab, this.onEditorTabPress, this)
		}
		var b = this.getSchedulingView();
		this.registerRenderer(b.columnRenderer, b);
		var a = " sch-ganttpanel sch-horizontal ";
		if (this.highlightWeekends) {
			a += " sch-ganttpanel-highlightweekends "
		}
		if (!this.rtl) {
			a += " sch-ltr "
		}
		this.addCls(a);
		if (this.baselineVisible) {
			this.showBaseline()
		}
		this.on("add",
		function(i, h) {
			if (h instanceof Ext.Editor) {
				i.lockedGrid.suspendLayouts();
				Ext.suspendLayouts();
				i.lockedGrid.add(h);
				Ext.resumeLayouts();
				i.lockedGrid.resumeLayouts()
			}
		});
		this.on("beforeedit",
		function(h, i) {
			return i.record.isEditable(i.field)
		},
		this);
		var f = this.lockedGrid.headerCt;
		this.wbsColumn = f.down("wbscolumn");
		if (this.wbsColumn) {
			this.bindWBSColumnListeners()
		}
		this.slackColumn = f.down("slackcolumn");
		if (this.slackColumn) {
			this.bindSlackListeners()
		}
		this.earlyStartColumn = f.down("earlystartdatecolumn");
		this.earlyEndColumn = f.down("earlyenddatecolumn");
		if (this.earlyStartColumn || this.earlyEndColumn) {
			this.bindEarlyDatesListeners()
		}
		this.lateStartColumn = f.down("latestartdatecolumn");
		this.lateEndColumn = f.down("lateenddatecolumn");
		if (this.lateStartColumn || this.lateEndColumn) {
			this.bindLateDatesListeners()
		}
	},
	onBeforeCascade: function() {
		var a = this.normalGrid.getView().store;
		a.suspendEvents();
		Ext.suspendLayouts()
	},
	onAfterCascade: function(f, a) {
		var d = this;
		var e = this.normalGrid.getView().store;
		e.resumeEvents();
		Ext.resumeLayouts();
		if (a.nbrAffected > 0) {
			var b = this.normalGrid.getView();
			var c = this.lockedGrid.getView();
			b.refreshKeepingScroll(true);
			Ext.suspendLayouts();
			c.saveScrollState();
			c.refresh();
			c.restoreScrollState();
			Ext.resumeLayouts(true)
		}
	},
	bindWBSColumnListeners: function() {
		var a = this.lockedGrid.view;
		this.mon(this.taskStore, {
			insert: function(d, c, b) {
				this.updateWBSCells(b ? a.store.indexOf(b) : 1)
			},
			remove: function(d, c) {
				var b = c.removeContext;
				var f = b.nextSibling || (b.parentNode && b.parentNode.nextSibling);
				var e = f ? a.store.indexOf(f) : -1;
				if (e >= 0) {
					this.updateWBSCells(e)
				}
			},
			scope: this
		})
	},
	bindSlackListeners: function() {
		var b = this.lockedGrid.getView();
		var a = Ext.Function.createBuffered(this.updateSlackColumns, this.refreshTimeout, this, []);
		this.slackListeners = this.mon(this.taskStore, {
			resetearlydates: a,
			resetlatedates: a,
			scope: this,
			destroyable: true
		})
	},
	bindEarlyDatesListeners: function() {
		var b = this.lockedGrid.getView();
		var a = Ext.Function.createBuffered(this.updateEarlyDateColumns, this.refreshTimeout, this, []);
		this.earlyDatesListeners = this.mon(this.taskStore, {
			resetearlydates: a,
			scope: this,
			destroyable: true
		})
	},
	bindLateDatesListeners: function() {
		var b = this.lockedGrid.getView();
		var a = Ext.Function.createBuffered(this.updateLateDateColumns, this.refreshTimeout, this, []);
		this.lateDatesListeners = this.mon(this.taskStore, {
			resetlatedates: a,
			scope: this,
			destroyable: true
		})
	},
	onEditorTabPress: function(i, h) {
		var j = this.lockedGrid.view,
		f = i.getActiveRecord(),
		c = i.getActiveColumn(),
		g = j.getPosition(f, c),
		a = this.lockedGrid.headerCt,
		d = g.row === this.lockedGrid.view.store.getCount() - 1,
		b = function(e) {
			return a.items.indexOf(e) > g.column && e.isVisible() && e.getEditor()
		};
		if (d && a.items.findIndexBy(b) < 0) {
			f.addTaskBelow({
				leaf: true
			})
		}
	},
	needToTranslateOption: function(a) {
		return this.hasOwnProperty(a) || this.self.prototype.hasOwnProperty(a) && this.self != Gnt.panel.Gantt
	},
	getDependencyView: function() {
		return this.getSchedulingView().getDependencyView()
	},
	disableWeekendHighlighting: function(a) {
		this.workingTimePlugin.setDisabled(a)
	},
	resolveTaskRecord: function(a) {
		return this.getSchedulingView().resolveTaskRecord(a)
	},
	fitTimeColumns: function() {
		this.getSchedulingView().fitColumns()
	},
	getResourceStore: function() {
		return this.getTaskStore().getResourceStore()
	},
	getAssignmentStore: function() {
		return this.getTaskStore().getAssignmentStore()
	},
	getTaskStore: function() {
		return this.taskStore
	},
	getDependencyStore: function() {
		return this.dependencyStore
	},
	onDragDropStart: function() {
		if (this.tip) {
			this.tip.hide();
			this.tip.disable()
		}
	},
	onDragDropEnd: function() {
		if (this.tip) {
			this.tip.enable()
		}
	},
	configureFunctionality: function() {
		var a = this.plugins = [].concat(this.plugins || []);
		if (this.highlightWeekends) {
			this.workingTimePlugin = Ext.create("Gnt.feature.WorkingTime", {
				calendar: this.calendar
			});
			a.push(this.workingTimePlugin)
		}
		if (this.showTodayLine) {
			this.todayLinePlugin = new Sch.plugin.CurrentTimeLine();
			a.push(this.todayLinePlugin)
		}
	},
	getWorkingTimePlugin: function() {
		return this.workingTimePlugin
	},
	registerLockedDependencyListeners: function() {
		var b = this;
		var a = this.getDependencyStore();
		this._lockedDependencyListeners = this._lockedDependencyListeners || {
			load: function() {
				var c = b.getTaskStore();
				c.resetEarlyDates();
				c.resetLateDates();
				b.lockedGrid.getView().refresh()
			},
			add: function(d, c) {
				for (var e = 0; e < c.length; e++) {
					b.updateDependencyTasks(c[e])
				}
			},
			update: function(h, f) {
				var e = b.lockedGrid.view;
				var g = e.store;
				if (f.previous[f.fromField]) {
					var d = b.taskStore.getByInternalId(f.previous[f.fromField]);
					if (d) {
						e.refreshNode(g.indexOf(d))
					}
				}
				if (f.previous[f.toField]) {
					var c = b.taskStore.getByInternalId(f.previous[f.toField]);
					if (c) {
						e.refreshNode(g.indexOf(c))
					}
				}
				b.updateDependencyTasks(f)
			},
			remove: function(d, c) {
				b.updateDependencyTasks(c)
			}
		};
		a.un(this._lockedDependencyListeners);
		a.on(this._lockedDependencyListeners)
	},
	updateDependencyTasks: function(c) {
		var b = c.getSourceTask(this.taskStore);
		var e = c.getTargetTask(this.taskStore);
		var f = this.lockedGrid.getView();
		var a = f.store.indexOf(b);
		var d = f.store.indexOf(e);
		if (b && a >= 0) {
			f.refreshNode(a)
		}
		if (e && d >= 0) {
			f.refreshNode(d)
		}
	},
	showBaseline: function() {
		this.addCls("sch-ganttpanel-showbaseline")
	},
	hideBaseline: function() {
		this.removeCls("sch-ganttpanel-showbaseline")
	},
	toggleBaseline: function() {
		this.toggleCls("sch-ganttpanel-showbaseline")
	},
	zoomToFit: function(b) {
		var a = b ? this.taskStore.getTasksTimeSpan(b) : this.taskStore.getTotalTimeSpan();
		if (this.zoomToSpan(a) === null) {
			if (!b) {
				this.fitTimeColumns()
			}
		}
	},
	getCascadeChanges: function() {
		return this.taskStore.cascadeChanges
	},
	setCascadeChanges: function(a) {
		this.taskStore.cascadeChanges = a
	},
	getRecalculateParents: function() {
		return this.taskStore.recalculateParents
	},
	setRecalculateParents: function(a) {
		this.taskStore.recalculateParents = a
	},
	setSkipWeekendsDuringDragDrop: function(a) {
		this.taskStore.skipWeekendsDuringDragDrop = this.skipWeekendsDuringDragDrop = a
	},
	getSkipWeekendsDuringDragDrop: function() {
		return this.taskStore.skipWeekendsDuringDragDrop
	},
	bindResourceStore: function(d, a) {
		var c = this;
		var b = {
			scope: c,
			update: c.onResourceStoreDataChanged,
			datachanged: c.onResourceStoreDataChanged
		};
		if (!a && c.resourceStore) {
			if (d !== c.resourceStore && c.resourceStore.autoDestroy) {
				c.resourceStore.destroy()
			} else {
				c.mun(c.resourceStore, b)
			}
			if (!d) {
				c.resourceStore = null
			}
		}
		if (d) {
			d = Ext.data.StoreManager.lookup(d);
			c.mon(d, b);
			this.taskStore.setResourceStore(d)
		}
		c.resourceStore = d;
		if (d && !a) {
			c.refreshViews()
		}
	},
	refreshViews: function() {
		this.lockedGrid.getView().refresh();
		this.getSchedulingView().refreshKeepingScroll()
	},
	bindAssignmentStore: function(c, a) {
		var b = this;
		if (!a && b.assignmentStore) {
			if (c !== b.assignmentStore && b.assignmentStore.autoDestroy) {
				b.assignmentStore.destroy()
			} else {
				b.mun(b.assignmentStore, {
					scope: b,
					update: b.onAssignmentStoreDataChanged,
					datachanged: b.onAssignmentStoreDataChanged
				})
			}
			if (!c) {
				b.assignmentStore = null
			}
		}
		if (c) {
			c = Ext.data.StoreManager.lookup(c);
			b.mon(c, {
				scope: b,
				update: b.onAssignmentStoreDataChanged,
				datachanged: b.onAssignmentStoreDataChanged
			});
			this.taskStore.setAssignmentStore(c)
		}
		b.assignmentStore = c;
		if (c && !a) {
			b.refreshViews()
		}
	},
	onResourceStoreDataChanged: function() {
		this.refreshViews()
	},
	onAssignmentStoreDataChanged: function() {
		this.refreshViews()
	},
	expandAll: function() {
		Ext.suspendLayouts();
		this.callParent(arguments);
		Ext.resumeLayouts()
	},
	collapseAll: function() {
		Ext.suspendLayouts();
		this.callParent(arguments);
		Ext.resumeLayouts()
	},
	updateWBSCells: function(f) {
		if (f < 0) {
			return
		}
		var c = this.lockedGrid.view;
		var b = this.wbsColumn;
		for (var d = f; d < c.getNodes().length; d++) {
			var e = c.store.getAt(d);
			var a = c.getCell(e, b);
			if (a) {
				a.dom.firstChild.innerHTML = b.renderer(null, null, e)
			}
		}
	},
	redrawColumns: function(f) {
		var h = this.lockedGrid.view;
		if (f.length) {
			for (var e = 0, a = h.getNodes().length; e < a; e++) {
				var b = h.store.getAt(e);
				for (var d = 0, g = f.length; d < g; d++) {
					var k = h.getCell(b, f[d]);
					var c = [];
					h.renderCell(f[d], b, e, f[d].getIndex(), c);
					k.update(c.join(""))
				}
			}
		}
	},
	updateSlackColumns: function() {
		var a = this.lockedGrid.view;
		if (this.slackColumn) {
			this.redrawColumns([this.slackColumn])
		}
	},
	updateEarlyDateColumns: function() {
		var a = this.lockedGrid.view;
		var b = [];
		if (this.earlyStartColumn) {
			b.push(this.earlyStartColumn)
		}
		if (this.earlyEndColumn) {
			b.push(this.earlyEndColumn)
		}
		if (b.length) {
			this.redrawColumns(b)
		}
	},
	updateLateDateColumns: function() {
		var a = this.lockedGrid.view;
		var b = [];
		if (this.lateStartColumn) {
			b.push(this.lateStartColumn)
		}
		if (this.lateEndColumn) {
			b.push(this.lateEndColumn)
		}
		if (b.length) {
			this.redrawColumns(b)
		}
	},
	afterRender: function() {
		this.callParent(arguments);
		this.getSelectionModel().view = this.lockedGrid.getView()
	}
});
Ext.define("Gnt.panel.ResourceHistogram", {
	extend: "Sch.panel.TimelineGridPanel",
	requires: ["Ext.XTemplate", "Sch.util.Date", "Gnt.feature.WorkingTime", "Gnt.column.Scale", "Gnt.view.ResourceHistogram"],
	alias: "widget.resourcehistogram",
	viewType: "resourcehistogramview",
	layout: "border",
	preserveScrollOnRefresh: true,
	showScaleLines: false,
	showLimitLines: true,
	calendarListeners: null,
	calendarListenersHash: null,
	calendar: null,
	taskStore: null,
	resourceStore: null,
	assignmentStore: null,
	startDate: null,
	endDate: null,
	timelinePanel: null,
	highlightWeekends: true,
	allocationData: null,
	scaleUnit: "HOUR",
	scaleMin: 0,
	scaleMax: 24,
	scaleLabelStep: 4,
	scaleStep: 2,
	rowHeight: 50,
	resourceText: "Resource",
	initComponent: function() {
		this.partnerTimelinePanel = this.partnerTimelinePanel || this.timelinePanel;
		this.lockedViewConfig = this.lockedViewConfig || {};
		this.normalViewConfig = this.normalViewConfig || {};
		this.normalViewConfig.histogram = this;
		this.normalViewConfig.trackOver = false;
		this.lockedGridConfig = this.lockedGridConfig || {};
		Ext.applyIf(this.lockedGridConfig, {
			width: 300
		});
		this.lockedViewConfig.rowHeight = this.normalViewConfig.rowHeight = this.rowHeight;
		this.lockedViewConfig.preserveScrollOnRefresh = this.normalViewConfig.preserveScrollOnRefresh = this.preserveScrollOnRefresh;
		if (this.scalePoints) {
			this.scalePoints.sort(function(m, i) {
				return m.value > i.value
			});
			this.scaleMin = this.scalePoints[0].value;
			this.scaleMax = this.scalePoints[this.scalePoints.length - 1].value;
			this.scaleStep = (this.scaleMax - this.scaleMin) / 10
		}
		if (!this.columns) {
			var c,
			f;
			this.columns = [];
			c = this.resourceNameCol = new Ext.grid.column.Column({
				header: this.resourceText,
				flex: 1,
				dataIndex: this.resourceStore.model.prototype.nameField
			});
			this.columns.push(c);
			f = {
				width: 40
			};
			Ext.Array.forEach(["scalePoints", "scaleStep", "scaleLabelStep", "scaleMin", "scaleMax", "scaleLabelStep", "scaleStep"],
			function(i) {
				f[i] = this[i]
			},
			this);
			f = this.scaleCol = new Gnt.column.Scale(f);
			this.mon(f, {
				beforerender: function() {
					f.setAvailableHeight(this.getSchedulingView().getAvailableHeight());
					if (this.scalePoints) {
						this.scalePoints = f.scalePoints
					}
				},
				scope: this,
				single: true
			});
			if (this.scalePoints) {
				this.scaleMin = f.scaleMin;
				this.scaleMax = f.scaleMax;
				this.scaleStep = f.scaleStep
			}
			this.columns.push(f)
		} else {
			var e = !Ext.isArray(this.columns) ? [this.columns] : this.columns,
			d;
			for (var g = 0; g < e.length; g++) {
				d = e[g];
				if (d instanceof Gnt.column.Scale || d.xtype == "scalecolumn") {
					Ext.Array.forEach(["scalePoints", "scaleStep", "scaleLabelStep", "scaleMin", "scaleMax", "scaleLabelStep", "scaleStep"],
					function(i) {
						if (! (i in d)) {
							d[i] = this[i]
						}
					},
					this);
					if (! (d instanceof Gnt.column.Scale)) {
						d = e[g] = Ext.ComponentManager.create(d, "scalecolumn")
					}
					this.mon(d, {
						beforerender: function() {
							d.setAvailableHeight(this.getSchedulingView().getAvailableHeight())
						},
						scope: this,
						single: true
					})
				}
			}
		}
		Ext.Array.forEach(["barCls", "barTpl", "lineTpl", "lineCls", "limitLineTpl", "limitLineCls", "limitLineWidth", "labelMode", "labelPercentFormat", "labelUnitsFormat", "scaleMin", "scaleMax", "scaleStep", "loadMask"],
		function(i) {
			if (i in this) {
				this.normalViewConfig[i] = this[i]
			}
		},
		this);
		this.store = this.resourceStore;
		this.taskStore = this.taskStore || this.store.getTaskStore();
		if (this.taskStore) {
			this.mon(this.taskStore, {
				update: this.onTaskUpdate,
				scope: this
			})
		}
		this.calendar = this.calendar || this.taskStore && this.taskStore.getCalendar();
		if (!this.calendar) {
			throw 'Cannot get project calendar instance: please specify either "calendar" or "taskStore" option'
		}
		this.mon(this.calendar, {
			calendarchange: this.onProjectCalendarChange,
			scope: this
		});
		this.bindCalendarListeners();
		this.assignmentStore = this.assignmentStore || this.store.getAssignmentStore() || this.taskStore && this.taskStore.getAssignmentStore();
		if (this.assignmentStore) {
			this.mon(this.assignmentStore, {
				refresh: this.onAssignmentsRefresh,
				remove: this.onAssignmentsChange,
				update: this.onAssignmentsChange,
				add: this.onAssignmentsChange,
				scope: this
			})
		}
		this.plugins = [].concat(this.plugins || []);
		if (this.highlightWeekends) {
			this.workingTimePlugin = new Gnt.feature.WorkingTime({
				calendar: this.calendar
			});
			this.plugins.push(this.workingTimePlugin)
		}
		this.callParent(arguments);
		var k = "gnt-resourcehistogram sch-horizontal ";
		if (this.highlightWeekends) {
			k += " gnt-resourcehistogram-highlightweekends "
		}
		this.addCls(k);
		var h = this.getSchedulingView();
		this.registerRenderer(h.columnRenderer, this);
		this.relayEvents(h, ["barclick", "bardblclick", "barcontextmenu"]);
		if (!this.syncRowHeight) {
			this.enableRowHeightInjection(this.lockedGrid.getView(), this.normalGrid.getView())
		}
		this.loadAllocationData(null, true);
		var b = this.lockedGrid.headerCt.layout;
		var j = b.getContainerSize;
		var a = Ext.getScrollbarSize;
		var l = Ext.getScrollbarSize();
		b.getContainerSize = function(i) {
			Ext.getScrollbarSize = function() {
				return {
					width: 0,
					height: l.height
				}
			};
			var m = j.apply(this, arguments);
			Ext.getScrollbarSize = a;
			return m
		}
	},
	destroy: function() {
		this.unbindCalendarListeners();
		if (this.assignmentStore) {
			this.mun(this.assignmentStore, {
				refresh: this.onAssignmentsRefresh,
				remove: this.onAssignmentsChange,
				update: this.onAssignmentsChange,
				add: this.onAssignmentsChange,
				scope: this
			})
		}
		if (this.taskStore) {
			this.mun(this.taskStore, {
				update: this.onTaskUpdate,
				scope: this
			})
		}
		this.mun(this.calendar, {
			calendarchange: this.onProjectCalendarChange,
			scope: this
		})
	},
	onProjectCalendarChange: function() {
		this.loadAllocationData()
	},
	unbindResourceCalendarListeners: function(b) {
		var a = this.calendarListenersHash && this.calendarListenersHash[b.getInternalId()];
		if (a) {
			Ext.Array.remove(this.calendarListeners, a);
			Ext.destroy(a)
		}
	},
	bindResourceCalendarListeners: function(d, e) {
		var c = this;
		e = e || d.getOwnCalendar();
		var b = function() {
			c.loadAllocationData(d)
		};
		var a = c.mon(e, {
			load: b,
			calendarchange: b,
			scope: c,
			destroyable: true
		});
		c.calendarListenersHash[d.getInternalId()] = a;
		c.calendarListeners.push(a)
	},
	bindCalendarListeners: function() {
		this.unbindCalendarListeners();
		var a = this;
		this.store.each(function(b) {
			var c = b.getOwnCalendar();
			if (c && c !== a.calendar) {
				a.bindResourceCalendarListeners(b, c)
			}
		})
	},
	unbindCalendarListeners: function() {
		if (this.calendarListeners && this.calendarListeners.length) {
			Ext.destroy.apply(Ext, this.calendarListeners)
		}
		this.calendarListeners = [];
		this.calendarListenersHash = {}
	},
	onResourcesLoad: function() {
		this.loadAllocationData();
		this.bindCalendarListeners()
	},
	onTaskUpdate: function(c, b) {
		var a;
		if (this.assignmentStore) {
			a = this.assignmentStore.queryBy(function(d) {
				return d.getTaskId() == b.getInternalId()
			});
			a = a.getRange()
		} else {
			a = b.getAssignments()
		}
		this.onAssignmentsChange(this.assignmentStore, a)
	},
	onAssignmentsRefresh: function(a) {
		this.onAssignmentsChange(a, a.getRange())
	},
	onAssignmentsChange: function(e, b) {
		var d;
		if (!Ext.isArray(b)) {
			b = [b]
		}
		for (var c = 0, a = b.length; c < a; c++) {
			d = this.resourceStore.getByInternalId(b[c].getResourceId());
			if (d) {
				this.loadAllocationData(d)
			}
		}
	},
	enableRowHeightInjection: function(c, e) {
		var b = c.renderRow;
		var a = c.renderCell;
		var d = new Ext.XTemplate("{%", "this.processCellValues(values);", "this.nextTpl.applyOut(values, out, parent);", "%}", {
			priority: 1,
			processCellValues: function(g) {
				if (e.orientation == "horizontal") {
					var f = e.getRowHeight() - e.cellTopBorderWidth - e.cellBottomBorderWidth;
					g.style = (g.style || "") + ";height:" + f + "px;"
				}
			}
		});
		c.addCellTpl(d);
		e.addCellTpl(d)
	},
	loadAllocationData: function(d, b) {
		if (this.resourceStore) {
			if (!d) {
				this.allocationData = {};
				var c = this;
				var e = this.getStartDate();
				var a = this.getEndDate();
				this.store.each(function(f) {
					c.allocationData[f.getInternalId()] = c.processAllocationData(f.getAllocationInfo({
						startDate: e,
						endDate: a,
						includeResCalIntervals: true
					}))
				});
				if (!b && this.rendered) {
					this.getView().refresh()
				}
			} else {
				this.allocationData = this.allocationData || {};
				this.allocationData[d.getInternalId()] = this.processAllocationData(d.getAllocationInfo({
					startDate: this.getStartDate(),
					endDate: this.getEndDate(),
					includeResCalIntervals: true
				}));
				if (!b && this.rendered) {
					this.getView().refreshNode(this.store.indexOf(d))
				}
			}
		}
	},
	processAllocationData: function(x) {
		var v,
		w,
		g,
		t,
		n,
		c,
		b,
		k,
		d,
		y,
		q = [],
		f = [],
		a = false;
		var o = function() {
			if (!w.assignments || !v.inResourceCalendar || !v.totalAllocation || !v.inTasksCalendar) {
				return false
			}
			for (var z = 0, j = w.assignments.length; z < j; z++) {
				if (v.assignmentsHash[w.assignments[z].getTaskId()]) {
					return false
				}
			}
			return true
		};
		var m = function(i) {
			w = {
				startDate: i,
				totalAllocation: v.totalAllocation,
				allocationMS: b * v.totalAllocation / 100,
				assignments: v.assignments
			};
			a = true
		};
		var h = function(i) {
			if (!a) {
				return false
			}
			if (i) {
				w.endDate = i
			}
			q.push(w);
			a = false
		};
		var p;
		for (var u = 0, r = x.length; u < r; u++) {
			v = x[u];
			p = Ext.Date.clearTime(v.startDate, true);
			if (p - t !== 0) {
				t = p;
				k = b;
				y = d;
				b = 0;
				d = 0;
				var s = u;
				while (x[s] && Ext.Date.clearTime(x[s].startDate, true) - p === 0) {
					if (x[s].inResourceCalendar) {
						d += x[s].endDate - x[s].startDate;
						if (x[s].totalAllocation && x[s].inTasksCalendar) {
							b += x[s].endDate - x[s].startDate
						}
					}
					s++
				}
			} else {
				p = false
			}
			if (this.showLimitLines) {
				if (p && d != y) {
					if (g) {
						g.endDate = v.startDate;
						f.push(g)
					}
					g = {
						startDate: v.startDate,
						allocationMS: d
					}
				}
				g.endDate = v.endDate
			}
			if (!a) {
				if (v.inTask) {
					m(new Date(v.startDate))
				}
			} else {
				if (!v.inTask) {
					h()
				} else {
					var e = false;
					if (p && w.endDate <= Sch.util.Date.add(p, Sch.util.Date.DAY, -1)) {
						n = Ext.Date.clearTime(w.endDate, true);
						if (n < w.endDate) {
							n = Sch.util.Date.add(n, Sch.util.Date.DAY, 1)
						}
						c = Ext.Date.clearTime(v.startDate, true);
						e = true
					} else {
						if (p && b !== k) {
							n = c = v.startDate;
							e = true
						} else {
							if (v.totalAllocation && o()) {
								n = w.endDate;
								c = new Date(v.startDate);
								e = true
							} else {
								if (v.totalAllocation && v.totalAllocation != w.totalAllocation) {
									n = c = v.totalAllocation > w.totalAllocation ? new Date(v.startDate) : w.endDate;
									e = true
								}
							}
						}
					}
					if (e) {
						h(n);
						m(c)
					}
				}
			}
			if (a) {
				w.endDate = v.endDate
			}
		}
		h();
		if (this.showLimitLines) {
			if (g) {
				f.push(g)
			}
			if (f.length) {
				f[0].startDate = null;
				f[f.length - 1].endDate = null
			}
		}
		return {
			bars: q,
			maxBars: f
		}
	}
});
Ext.define("Gnt.field.mixin.TaskField", {
	taskField: "",
	task: null,
	taskStore: null,
	config: {
		suppressTaskUpdate: false
	},
	highlightTaskUpdates: true,
	highlightColor: "#009900",
	lastHighlight: 0,
	instantUpdate: true,
	setTask: function(a) {
		if (!a) {
			return
		}
		this.setReadOnly(!a.isEditable(a[this.taskField]));
		this.destroyTaskListener();
		this.task = a;
		a.on("taskupdated", this.onTaskUpdateProcess, this);
		if (!a.getCalendar(true) && !a.getTaskStore(true)) {
			a.taskStore = a.getTaskStore(true) || this.taskStore;
			if (!a.taskStore) {
				throw "Configuration issue: Gnt.data.taskStore instance should be provided."
			}
			if (!a.getCalendar(true) && !a.taskStore.getCalendar()) {
				throw "Configuration issue: Gnt.data.Calendar instance should be provided."
			}
		}
		this.setSuppressTaskUpdate(true);
		if (this.onSetTask) {
			this.onSetTask(a)
		}
		this.setSuppressTaskUpdate(false)
	},
	onTaskUpdateProcess: function(a, d) {
		if (d !== this) {
			var c = this.getValue();
			this.setReadOnly(!a.isEditable(a[this.taskField]));
			this.setSuppressTaskUpdate(true);
			if (this.onTaskUpdate) {
				this.onTaskUpdate(a, d)
			} else {
				if (this.onSetTask) {
					this.onSetTask()
				}
			}
			this.setSuppressTaskUpdate(false);
			if (this.highlightTaskUpdates) {
				var e = this.getValue(),
				b = Ext.isDate(c);
				if (b && (c - e !== 0) || (!b && String(c) !== String(e))) {
					this.highlightField()
				}
			}
		}
	},
	highlightField: function(a, b) {
		if (this.rendered && (new Date() - this.lastHighlight > 1000)) {
			this.lastHighlight = new Date();
			this.inputEl.highlight(a || this.highlightColor, b || {
				attr: "color"
			})
		}
	},
	destroyTaskListener: function() {
		if (this.task) {
			this.task.un("taskupdated", this.onTaskUpdateProcess, this)
		}
	}
});
Ext.define("Gnt.field.EndDate", {
	extend: "Ext.form.field.Date",
	requires: ["Sch.util.Date"],
	mixins: ["Gnt.field.mixin.TaskField", "Gnt.mixin.Localizable"],
	alias: "widget.enddatefield",
	adjustMilestones: true,
	keepDuration: false,
	taskField: "endDateField",
	validateStartDate: true,
	constructor: function(a) {
		a = a || {};
		Ext.apply(this, a);
		if (a.task && !a.value) {
			a.value = a.task.getEndDate()
		}
		this.setSuppressTaskUpdate(true);
		this.callParent([a]);
		this.setSuppressTaskUpdate(false);
		if (this.task) {
			this.setTask(this.task)
		}
	},
	destroy: function() {
		this.destroyTaskListener();
		this.callParent()
	},
	onSetTask: function() {
		this.setValue(this.task.getEndDate())
	},
	rawToValue: function(a) {
		if (!a) {
			return null
		}
		return this.visibleToValue(this.parseDate(a))
	},
	valueToRaw: function(a) {
		if (!a) {
			return a
		}
		return Ext.Date.format(this.valueToVisible(a), this.format)
	},
	valueToVisible: function(b, a) {
		a = a || this.task;
		return a.getDisplayEndDate(this.format, this.adjustMilestones, b, true)
	},
	visibleToValue: function(a) {
		if (a && this.task) {
			if (!Ext.Date.formatContainsHourInfo(this.format) && a - Ext.Date.clearTime(a, true) === 0) {
				a = this.task.getCalendar().getCalendarDay(a).getAvailabilityEndFor(a) || Sch.util.Date.add(a, Sch.util.Date.DAY, 1)
			}
		} else {
			a = null
		}
		return a
	},
	getErrors: function(a) {
		var b = this.callParent([a]);
		if (b && b.length) {
			return b
		}
		if (this.validateStartDate) {
			a = this.rawToValue(a);
			if (this.task && a) {
				if (a < this.task.getStartDate()) {
					return [this.L("endBeforeStartText")]
				}
			}
		}
	},
	onExpand: function() {
		var a = this.valueToVisible(this.getValue());
		if (!this.isValid()) {
			a = this.getRawValue();
			if (a) {
				a = Ext.Date.parse(a, this.format)
			}
		}
		this.picker.setValue(Ext.isDate(a) ? a: new Date())
	},
	onSelect: function(c, a) {
		var d = this;
		var b = d.getValue();
		var f = this.visibleToValue(a);
		var e = Ext.Date.format(a, this.format);
		if (b != f) {
			if (this.getErrors(e)) {
				d.setRawValue(e);
				d.collapse();
				d.validate()
			} else {
				d.setValue(f, true);
				d.fireEvent("select", d, f);
				d.collapse()
			}
		}
	},
	applyChanges: function(a) {
		a = a || this.task;
		var b = a.getTaskStore(true) || this.taskStore;
		if (this.value) {
			a.setEndDate(this.value, this.keepDuration, b.skipWeekendsDuringDragDrop)
		} else {
			a.setEndDate(null)
		}
	},
	setVisibleValue: function(a) {
		this.setValue(this.rawToValue(Ext.Date.format(a, this.format)))
	},
	getVisibleValue: function() {
		if (!this.getValue()) {
			return null
		}
		return Ext.Date.parse(this.valueToRaw(this.getValue()), this.format)
	},
	setValue: function(a) {
		this.callParent([a]);
		if (this.instantUpdate && !this.getSuppressTaskUpdate() && this.task) {
			this.applyChanges();
			var b = this.task.getEndDate();
			if (b - this.getValue() !== 0) {
				this.callParent([b])
			}
			this.task.fireEvent("taskupdated", this.task, this)
		}
	},
	getValue: function() {
		return this.value
	},
	assertValue: function() {
		var c = this,
		d = c.rawValue,
		f = c.getRawValue(),
		a = c.getValue(),
		e = c.rawToValue(f),
		b = c.focusTask;
		if (b) {
			b.cancel()
		}
		if ((d != f) && (e - a !== 0)) {
			if (!c.validateOnBlur || c.isValid()) {
				c.setValue(e)
			}
		}
	},
	beforeBlur: function() {
		this.assertValue()
	}
});
Ext.define("Gnt.field.StartDate", {
	extend: "Ext.form.field.Date",
	requires: ["Sch.util.Date"],
	mixins: ["Gnt.field.mixin.TaskField"],
	alias: "widget.startdatefield",
	adjustMilestones: true,
	keepDuration: true,
	taskField: "startDateField",
	constructor: function(a) {
		a = a || {};
		if (a.task && !a.value) {
			a.value = a.task.getStartDate()
		}
		this.setSuppressTaskUpdate(true);
		this.callParent([a]);
		this.setSuppressTaskUpdate(false);
		if (this.task) {
			this.setTask(this.task)
		}
	},
	destroy: function() {
		this.destroyTaskListener();
		this.callParent()
	},
	onSetTask: function() {
		this.setValue(this.task.getStartDate())
	},
	rawToValue: function(a) {
		if (!a) {
			return null
		}
		return this.visibleToValue(this.parseDate(a))
	},
	valueToRaw: function(a) {
		if (!a) {
			return a
		}
		return Ext.Date.format(this.valueToVisible(a), this.format)
	},
	valueToVisible: function(b, a) {
		a = a || this.task;
		return a.getDisplayStartDate(this.format, this.adjustMilestones, b, true)
	},
	visibleToValue: function(c) {
		var b = this.task;
		if (b && c) {
			var d = b.getEndDate();
			var a = !this.lastValue || this.lastValue - Ext.Date.clearTime(this.lastValue, true) === 0;
			if (this.adjustMilestones && b.isMilestone() && c - Ext.Date.clearTime(c, true) === 0 && a) {
				c = b.getCalendar().getCalendarDay(c).getAvailabilityEndFor(c) || c
			}
		}
		return c
	},
	onExpand: function() {
		var a = this.valueToVisible(this.getValue());
		this.picker.setValue(Ext.isDate(a) ? a: new Date())
	},
	onSelect: function(c, a) {
		var d = this,
		e = Ext.Date.format(a, this.format),
		b = d.getValue(),
		f = this.visibleToValue(a),
		g = this.getErrors(e);
		if (b != f) {
			if (g && g.length) {
				d.setRawValue(e);
				d.collapse();
				d.validate()
			} else {
				d.setValue(f);
				d.fireEvent("select", d, f);
				d.collapse()
			}
		}
	},
	applyChanges: function(a) {
		a = a || this.task;
		var b = a.getTaskStore(true) || this.taskStore;
		a.setStartDate(this.value, this.keepDuration, b.skipWeekendsDuringDragDrop)
	},
	setVisibleValue: function(a) {
		this.setValue(this.rawToValue(Ext.Date.format(a, this.format)))
	},
	getVisibleValue: function() {
		if (!this.getValue()) {
			return null
		}
		return Ext.Date.parse(this.valueToRaw(this.getValue()), this.format)
	},
	setValue: function(b) {
		this.callParent([b]);
		if (this.instantUpdate && !this.getSuppressTaskUpdate() && this.task && this.task.taskStore && b) {
			this.applyChanges();
			var a = this.task.getStartDate();
			if (a - this.getValue() !== 0) {
				this.callParent([a])
			}
			this.task.fireEvent("taskupdated", this.task, this)
		}
	},
	getValue: function() {
		return this.value
	},
	assertValue: function() {
		var c = this,
		d = c.rawValue,
		f = c.getRawValue(),
		a = c.getValue(),
		e = c.rawToValue(f),
		b = c.focusTask;
		if (b) {
			b.cancel()
		}
		if ((d != f) && (e - a !== 0)) {
			if (!c.validateOnBlur || c.isValid()) {
				c.setValue(e)
			}
		}
	},
	beforeBlur: function() {
		this.assertValue()
	}
});
Ext.define("Gnt.field.Duration", {
	extend: "Ext.form.field.Number",
	requires: ["Gnt.util.DurationParser"],
	mixins: ["Gnt.field.mixin.TaskField", "Gnt.mixin.Localizable"],
	alias: "widget.durationfield",
	alternateClassName: ["Gnt.column.duration.Field", "Gnt.widget.DurationField"],
	disableKeyFilter: true,
	minValue: 0,
	instantUpdate: true,
	durationUnit: "h",
	useAbbreviation: false,
	getDurationUnitMethod: "getDurationUnit",
	setDurationMethod: "setDuration",
	getDurationMethod: "getDuration",
	taskField: "durationField",
	durationParser: null,
	durationParserConfig: null,
	constructor: function(a) {
		var b = this;
		Ext.apply(this, a);
		this.durationParser = new Gnt.util.DurationParser(Ext.apply({
			parseNumberFn: function() {
				return b.parseValue.apply(b, arguments)
			},
			allowDecimals: this.decimalPrecision > 0
		},
		this.durationParserConfig));
		this.setSuppressTaskUpdate(true);
		this.callParent(arguments);
		this.setSuppressTaskUpdate(false);
		this.invalidText = this.L("invalidText");
		if (this.task) {
			this.setTask(this.task)
		}
	},
	destroy: function() {
		this.destroyTaskListener();
		this.callParent()
	},
	onSetTask: function() {
		this.durationUnit = this.task[this.getDurationUnitMethod]();
		var a = this.getDurationMethod ? this.task[this.getDurationMethod]() : this.task.get(this.task[this.taskField]);
		this.setValue(a);
		this.setSpinUpEnabled(a == null || a > this.minValue, true);
		this.setSpinDownEnabled(a < this.maxValue, true)
	},
	rawToValue: function(b) {
		var a = this.parseDuration(b);
		if (!a) {
			return null
		}
		this.durationUnit = a.unit;
		return a.value != null ? a.value: null
	},
	valueToVisible: function(a, b) {
		if (Ext.isNumber(a)) {
			return parseFloat(Ext.Number.toFixed(a, this.decimalPrecision)) + " " + Sch.util.Date[this.useAbbreviation ? "getShortNameOfUnit": "getReadableNameOfUnit"](b || this.durationUnit, a !== 1)
		}
		return ""
	},
	valueToRaw: function(a) {
		return this.valueToVisible(a, this.durationUnit, this.decimalPrecision, this.useAbbreviation)
	},
	parseDuration: function(b) {
		if (b == null) {
			return null
		}
		var a = this;
		var c = this.durationParser.parse(b);
		if (!c) {
			return null
		}
		c.unit = c.unit || this.durationUnit;
		return c
	},
	getDurationValue: function() {
		var a = this;
		return this.parseDuration(this.getRawValue())
	},
	getErrors: function(b) {
		var a;
		if (b) {
			a = this.parseDuration(b);
			if (!a) {
				return [this.L("invalidText")]
			}
			b = a.value
		}
		return this.callParent([b])
	},
	checkChange: function() {
		if (!this.suspendCheckChange) {
			var d = this,
			c = d.getDurationValue(),
			a = d.lastValue;
			var b = c && !a || !c && a || c && a && (c.value != a.value || c.unit != a.unit);
			if (b && !d.isDestroyed) {
				d.lastValue = c;
				d.fireEvent("change", d, c, a);
				d.onChange(c, a)
			}
		}
	},
	getValue: function() {
		return this.value
	},
	applyChanges: function(a) {
		a = a || this.task;
		a[this.setDurationMethod](this.getValue(), this.durationUnit)
	},
	setValue: function(a) {
		var b = a;
		if (Ext.isObject(a)) {
			this.durationUnit = a.unit;
			b = a.value
		}
		this.callParent([b]);
		if (this.instantUpdate && !this.getSuppressTaskUpdate() && this.task) {
			this.applyChanges();
			this.task.fireEvent("taskupdated", this.task, this)
		}
	},
	assertValue: function() {
		var d = this,
		a = d.getValue(),
		e = d.durationUnit,
		c = d.getDurationValue();
		if (this.isValid()) {
			var b = c && !a || !c && a || c && (c.value != a || c.unit != e);
			if (b) {
				d.setValue(c)
			}
		}
	},
	beforeBlur: function() {
		this.assertValue()
	},
	onSpinUp: function() {
		var a = this;
		if (!a.readOnly) {
			var b = a.getValue() || 0;
			a.setSpinValue(Ext.Number.constrain(b + a.step, a.minValue, a.maxValue))
		}
	},
	onSpinDown: function() {
		var a = this;
		if (!a.readOnly) {
			var b = a.getValue() || 0;
			a.setSpinValue(Ext.Number.constrain(b - a.step, a.minValue, a.maxValue))
		}
	}
});
Ext.define("Gnt.field.Effort", {
	extend: "Gnt.field.Duration",
	requires: ["Gnt.util.DurationParser"],
	alias: "widget.effortfield",
	alternateClassName: ["Gnt.column.effort.Field", "Gnt.widget.EffortField"],
	invalidText: "Invalid effort value",
	taskField: "effortField",
	getDurationUnitMethod: "getEffortUnit",
	setDurationMethod: "setEffort",
	getDurationMethod: "getEffort"
});
Ext.define("Gnt.field.SchedulingMode", {
	extend: "Ext.form.field.ComboBox",
	mixins: ["Gnt.field.mixin.TaskField"],
	alias: "widget.schedulingmodefield",
	alternateClassName: ["Gnt.column.schedulingmode.Field"],
	taskField: "schedulingModeField",
	store: [["Normal", "Normal"], ["Manual", "Manual"], ["FixedDuration", "Fixed duration"], ["EffortDriven", "Effort driven"], ["DynamicAssignment", "Dynamic assignment"]],
	pickerAlign: "tl-bl?",
	matchFieldWidth: true,
	editable: false,
	forceSelection: true,
	triggerAction: "all",
	constructor: function(a) {
		var b = this;
		Ext.apply(this, a);
		this.setSuppressTaskUpdate(true);
		this.callParent(arguments);
		this.setSuppressTaskUpdate(false);
		if (this.task) {
			this.setTask(this.task)
		}
	},
	destroy: function() {
		this.destroyTaskListener();
		this.callParent()
	},
	onSetTask: function() {
		this.setValue(this.task.getSchedulingMode())
	},
	valueToVisible: function(e, b) {
		var c = this,
		d = [];
		var a = this.findRecordByValue(e);
		if (a) {
			d.push(a.data)
		} else {
			if (Ext.isDefined(c.valueNotFoundText)) {
				d.push(c.valueNotFoundText)
			}
		}
		return c.displayTpl.apply(d)
	},
	applyChanges: function(a) {
		a = a || this.task;
		a.setSchedulingMode(this.getValue())
	},
	getValue: function() {
		return this.value
	},
	setValue: function(a) {
		this.callParent([a]);
		if (this.instantUpdate && !this.getSuppressTaskUpdate() && this.task && this.value) {
			this.applyChanges();
			this.task.fireEvent("taskupdated", this.task, this)
		}
	}
});
Ext.define("Gnt.field.Calendar", {
	extend: "Ext.form.field.ComboBox",
	requires: ["Gnt.data.Calendar"],
	mixins: ["Gnt.field.mixin.TaskField", "Gnt.mixin.Localizable"],
	alias: "widget.calendarfield",
	alternateClassName: ["Gnt.column.calendar.Field"],
	taskField: "calendarIdField",
	pickerAlign: "tl-bl?",
	matchFieldWidth: true,
	editable: true,
	triggerAction: "all",
	valueField: "Id",
	displayField: "Name",
	queryMode: "local",
	forceSelection: true,
	allowBlank: true,
	constructor: function(a) {
		var b = this;
		Ext.apply(this, a);
		this.store = this.store || Ext.create("Ext.data.Store", {
			fields: ["Id", "Name"]
		});
		this.setSuppressTaskUpdate(true);
		this.callParent(arguments);
		this.setSuppressTaskUpdate(false);
		if (this.rendered) {
			this.store.loadData(this.getCalendarData())
		} else {
			this.on({
				render: function() {
					this.store.loadData(this.getCalendarData())
				},
				show: this.setReadOnlyIfEmpty,
				scope: this
			})
		}
		if (this.task) {
			this.setTask(this.task)
		}
	},
	destroy: function() {
		this.destroyTaskListener();
		this.callParent()
	},
	setReadOnlyIfEmpty: function() {
		var a = Gnt.data.Calendar.getAllCalendars();
		if (!a || !a.length) {
			this.setReadOnly(true)
		}
	},
	getCalendarData: function() {
		var a = [];
		Ext.Array.each(Gnt.data.Calendar.getAllCalendars(),
		function(b) {
			a.push({
				Id: b.calendarId,
				Name: b.name || b.calendarId
			})
		});
		return a
	},
	onSetTask: function() {
		this.setReadOnlyIfEmpty();
		this.setValue(this.task.getCalendarId())
	},
	onTaskUpdate: function(a, b) {
		this.setReadOnlyIfEmpty();
		this.setValue(this.task.getCalendarId())
	},
	valueToVisible: function(e, b) {
		var c = this,
		d = [];
		var a = this.findRecordByValue(e);
		if (a) {
			d.push(a.data)
		} else {
			if (Ext.isDefined(c.valueNotFoundText)) {
				d.push(c.valueNotFoundText)
			}
		}
		return c.displayTpl.apply(d)
	},
	getValue: function() {
		return this.value
	},
	applyChanges: function(a) {
		a = a || this.task;
		a.setCalendarId(this.value)
	},
	getErrors: function(b) {
		if (b) {
			var a = this.findRecordByDisplay(b);
			if (a) {
				if (this.task && !this.task.isCalendarApplicable(a.data.Id)) {
					return [this.L("calendarNotApplicable")]
				}
			}
		}
		return this.callParent(arguments)
	},
	setValue: function(a) {
		this.callParent([a]);
		if (undefined === a || null === a || "" === a) {
			this.value = ""
		}
		if (!this.getSuppressTaskUpdate() && this.task) {
			if (this.task.getCalendarId() != this.value) {
				this.applyChanges();
				this.task.fireEvent("taskupdated", this.task, this)
			}
		}
	},
	assertValue: function() {
		var a = this.getRawValue();
		if (!a && this.value) {
			this.setValue("")
		} else {
			this.callParent(arguments)
		}
	}
});
Ext.define("Gnt.field.Percent", {
	extend: "Ext.form.field.Number",
	alias: "widget.percentfield",
	alternateClassName: ["Gnt.widget.PercentField"],
	disableKeyFilter: true,
	minValue: 0,
	maxValue: 100,
	invalidText: "Invalid percent value",
	valueToRaw: function(a) {
		if (Ext.isNumber(a)) {
			return parseFloat(Ext.Number.toFixed(a, this.decimalPrecision)) + "%"
		}
		return ""
	},
	getErrors: function(b) {
		var a = this.parseValue(b);
		if (a === null) {
			if (b !== null && b !== "") {
				return [this.invalidText]
			} else {
				a = ""
			}
		}
		return this.callParent([a])
	}
});
Ext.define("Gnt.field.Dependency", {
	extend: "Ext.form.field.Text",
	alternateClassName: "Gnt.widget.DependencyField",
	alias: "widget.dependencyfield",
	requires: ["Gnt.util.DependencyParser"],
	type: "predecessors",
	separator: ";",
	task: null,
	dependencyParser: null,
	invalidFormatText: "Invalid dependency format",
	invalidDependencyText: "Invalid dependency found, please make sure you have no cyclic paths between your tasks",
	constructor: function(a) {
		var b = this;
		Ext.apply(this, a);
		this.dependencyParser = new Gnt.util.DependencyParser({
			parseNumberFn: function() {
				return Gnt.widget.DurationField.prototype.parseValue.apply(b, arguments)
			}
		});
		this.callParent(arguments);
		this.addCls("gnt-field-dependency")
	},
	setTask: function(a) {
		this.task = a;
		this.setRawValue(this.getDisplayValue(a))
	},
	getDependencies: function() {
		return this.dependencyParser.parse(this.getRawValue())
	},
	getErrors: function(j) {
		if (!j) {
			return
		}
		var g = this.dependencyParser.parse(j);
		if (!g) {
			return [this.invalidFormatText]
		}
		var f = this.getDependencies();
		var h = this.type === "predecessors";
		var c = this.task;
		var b = c.getTaskStore().dependencyStore;
		for (var e = 0; e < f.length; e++) {
			var d = h ? f[e].taskId: this.task.getInternalId();
			var a = !h ? f[e].taskId: this.task.getInternalId();
			if (!c.getTaskStore().getById(f[e].taskId) || (!b.areTasksLinked(d, a) && !b.isValidDependency(d, a))) {
				return [this.invalidDependencyText]
			}
		}
		return this.callParent([g.value])
	},
	getDisplayValue: function(a) {
		var h = this.type === "predecessors",
		l = h ? a.getIncomingDependencies() : a.getOutgoingDependencies(),
		j = Gnt.util.DependencyParser.prototype.types,
		e = Gnt.model.Dependency.Type.EndToStart,
		k = [];
		for (var d = 0; d < l.length; d++) {
			var g = l[d];
			if (g.isValid(false)) {
				var f = g.getType(),
				b = g.getLag(),
				c = g.getLagUnit();
				k.push(Ext.String.format("{0}{1}{2}{3}{4}", h ? g.getSourceId() : g.getTargetId(), b || f !== e ? j[f] : "", b > 0 ? "+": "", b || "", b && c !== "d" ? c: ""))
			}
		}
		return k.join(this.separator)
	},
	applyChanges: function(d) {
		d = d || this.task;
		var l = d.getTaskStore().dependencyStore,
		g = this.getDependencies(),
		a = Ext.Array.pluck(g, "taskId"),
		j = this.type === "predecessors",
		k = j ? d.getIncomingDependencies() : d.getOutgoingDependencies(),
		c = [];
		for (var f = 0; f < k.length; f++) {
			if (!Ext.Array.contains(a, k[f][j ? "getSourceId": "getTargetId"]())) {
				c.push(k[f])
			}
		}
		if (c.length > 0) {
			l.remove(c)
		}
		var m = [];
		for (f = 0; f < g.length; f++) {
			var e = g[f];
			var b = e.taskId;
			var h = l.getByTaskIds(b, d.getInternalId());
			if (h) {
				h.beginEdit();
				h.setType(e.type);
				h.setLag(e.lag);
				h.setLagUnit(e.lagUnit);
				h.endEdit()
			} else {
				m.push(new l.model({
					fromTask: j ? b: d.getInternalId(),
					toTask: j ? d.getInternalId() : b,
					type: e.type,
					lag: e.lag,
					lagUnit: e.lagUnit
				}))
			}
		}
		if (m.length > 0) {
			l.add(m)
		}
		if (m.length || c.length) {
			d.triggerUIUpdate()
		}
	}
});
Ext.define("Gnt.field.Milestone", {
	extend: "Ext.form.field.ComboBox",
	requires: "Ext.data.JsonStore",
	mixins: ["Gnt.field.mixin.TaskField", "Gnt.mixin.Localizable"],
	alias: "widget.milestonefield",
	instantUpdate: false,
	allowBlank: false,
	forceSelection: true,
	displayField: "text",
	valueField: "value",
	queryMode: "local",
	constructor: function(a) {
		Ext.apply(this, a);
		this.store = new Ext.data.JsonStore({
			fields: ["value", "text"],
			data: [{
				value: 0,
				text: this.L("no")
			},
			{
				value: 1,
				text: this.L("yes")
			}]
		});
		this.setSuppressTaskUpdate(true);
		this.callParent(arguments);
		this.setSuppressTaskUpdate(false);
		if (this.task) {
			this.setTask(this.task)
		}
	},
	destroy: function() {
		this.destroyTaskListener();
		this.callParent()
	},
	onSetTask: function() {
		this.setValue(this.task.isMilestone() ? 1: 0)
	},
	valueToVisible: function(a) {
		return a ? this.L("yes") : this.L("no")
	},
	setValue: function(a) {
		this.callParent([a]);
		if (this.instantUpdate && !this.getSuppressTaskUpdate() && this.task) {
			if (this.task.isMilestone() != Boolean(this.value)) {
				this.applyChanges();
				this.task.fireEvent("taskupdated", this.task, this)
			}
		}
	},
	getValue: function() {
		return this.value
	},
	applyChanges: function(a) {
		a = a || this.task;
		if (this.getValue()) {
			a.convertToMilestone()
		} else {
			a.convertToRegular()
		}
	}
});
Ext.define("Gnt.column.ResourceName", {
	extend: "Ext.grid.column.Column",
	alias: "widget.resourcenamecolumn",
	mixins: ["Gnt.mixin.Localizable"],
	dataIndex: "ResourceName",
	flex: 1,
	align: "left",
	_isGanttColumn: false,
	constructor: function(a) {
		a = a || {};
		this.text = a.text || this.L("text");
		Ext.apply(this, a);
		this.callParent(arguments)
	}
});
Ext.define("Gnt.column.AssignmentUnits", {
	extend: "Ext.grid.column.Number",
	mixins: ["Gnt.mixin.Localizable"],
	alias: "widget.assignmentunitscolumn",
	dataIndex: "Units",
	format: "0 %",
	align: "left",
	constructor: function(a) {
		a = a || {};
		this.text = a.text || this.L("text");
		this.callParent(arguments)
	}
});
Ext.define("Gnt.widget.AssignmentGrid", {
	extend: "Ext.grid.Panel",
	alias: "widget.assignmentgrid",
	requires: ["Gnt.model.Resource", "Gnt.model.Assignment", "Gnt.column.ResourceName", "Gnt.column.AssignmentUnits", "Ext.grid.plugin.CellEditing"],
	assignmentStore: null,
	resourceStore: null,
	readOnly: false,
	cls: "gnt-assignmentgrid",
	defaultAssignedUnits: 100,
	taskId: null,
	sorter: {
		sorterFn: function(b, a) {
			var d = b.getUnits(),
			c = a.getUnits();
			if ((!d && !c) || (d && c)) {
				return b.get("ResourceName") < a.get("ResourceName") ? -1: 1
			}
			return d ? -1: 1
		}
	},
	constructor: function(a) {
		this.store = Ext.create("Ext.data.JsonStore", {
			model: Ext.define("Gnt.model.AssignmentEditing", {
				extend: "Gnt.model.Assignment",
				fields: ["ResourceName"]
			})
		});
		this.columns = this.buildColumns();
		if (!this.readOnly) {
			this.plugins = this.buildPlugins()
		}
		Ext.apply(this, {
			selModel: {
				selType: "checkboxmodel",
				mode: "MULTI",
				checkOnly: true,
				selectByPosition: function(b) {
					var c = this.store.getAt(b.row);
					this.select(c, true)
				}
			}
		});
		this.callParent(arguments)
	},
	initComponent: function() {
		this.loadResources();
		this.mon(this.resourceStore, {
			datachanged: this.loadResources,
			scope: this
		});
		this.getSelectionModel().on("select", this.onSelect, this, {
			delay: 50
		});
		this.callParent(arguments)
	},
	onSelect: function(b, a) {
		if ((!this.cellEditing || !this.cellEditing.getActiveEditor()) && !a.getUnits()) {
			a.setUnits(this.defaultAssignedUnits)
		}
	},
	loadResources: function() {
		var d = [],
		b = this.resourceStore,
		e;
		for (var c = 0, a = b.getCount(); c < a; c++) {
			e = b.getAt(c).getId();
			d.push({
				ResourceId: e,
				ResourceName: b.getById(e).getName(),
				Units: ""
			})
		}
		this.store.loadData(d)
	},
	buildPlugins: function() {
		var a = this.cellEditing = Ext.create("Ext.grid.plugin.CellEditing", {
			clicksToEdit: 1
		});
		a.on("edit", this.onEditingDone, this);
		return [a]
	},
	hide: function() {
		this.cellEditing.cancelEdit();
		this.callParent(arguments)
	},
	onEditingDone: function(a, b) {
		if (b.value) {
			this.getSelectionModel().select(b.record, true)
		} else {
			this.getSelectionModel().deselect(b.record);
			b.record.reject()
		}
	},
	buildColumns: function() {
		return [{
			xtype: "resourcenamecolumn"
		},
		{
			xtype: "assignmentunitscolumn",
			assignmentStore: this.assignmentStore,
			editor: {
				xtype: "numberfield",
				minValue: 0,
				step: 10
			}
		}]
	},
	loadTaskAssignments: function(d) {
		var b = this.store,
		f = this.getSelectionModel();
		this.taskId = d;
		f.deselectAll(true);
		for (var c = 0, a = b.getCount(); c < a; c++) {
			b.getAt(c).data.Units = "";
			b.getAt(c).data.Id = null
		}
		b.suspendEvents();
		var e = this.assignmentStore.queryBy(function(g) {
			return g.getTaskId() === d
		});
		e.each(function(h) {
			var g = b.findRecord("ResourceId", h.getResourceId(), 0, false, true, true);
			if (g) {
				g.setUnits(h.getUnits());
				g.set(g.idProperty, h.getId());
				f.select(g, true, true)
			}
		});
		b.resumeEvents();
		b.sort(this.sorter);
		this.getView().refresh()
	},
	saveTaskAssignments: function() {
		var a = this.assignmentStore,
		e = this.taskId;
		var d = {};
		var c = [];
		this.getSelectionModel().selected.each(function(g) {
			var f = g.getUnits();
			if (f > 0) {
				var i = g.getId();
				if (i) {
					d[i] = true;
					a.getById(i).setUnits(f)
				} else {
					var h = Ext.create(a.model);
					h.setTaskId(e);
					h.setResourceId(g.getResourceId());
					h.setUnits(f);
					d[h.internalId] = true;
					c.push(h)
				}
			}
		});
		var b = [];
		a.each(function(f) {
			if (f.getTaskId() === e && !d[f.getId() || f.internalId]) {
				b.push(f)
			}
		});
		a.suspendAutoSync();
		a.remove(b);
		a.add(c);
		a.resumeAutoSync();
		if (a.autoSync) {
			a.sync()
		}
	}
});
Ext.define("Gnt.field.Assignment", {
	extend: "Ext.form.field.Picker",
	alias: ["widget.assignmentfield", "widget.assignmenteditor"],
	alternateClassName: "Gnt.widget.AssignmentField",
	requires: ["Gnt.widget.AssignmentGrid"],
	mixins: ["Gnt.mixin.Localizable"],
	matchFieldWidth: false,
	editable: false,
	task: null,
	assignmentStore: null,
	resourceStore: null,
	gridConfig: null,
	formatString: "{0} [{1}%]",
	expandPickerOnFocus: false,
	afterRender: function() {
		this.callParent(arguments);
		this.on("expand", this.onPickerExpand, this);
		if (this.expandPickerOnFocus) {
			this.on("focus",
			function() {
				this.expand()
			},
			this)
		}
	},
	createPicker: function() {
		var a = new Gnt.widget.AssignmentGrid(Ext.apply({
			ownerCt: this.ownerCt,
			renderTo: document.body,
			frame: true,
			floating: true,
			hidden: true,
			height: 200,
			width: 300,
			resourceStore: this.task.getResourceStore(),
			assignmentStore: this.task.getAssignmentStore(),
			fbar: this.buildButtons()
		},
		this.gridConfig || {}));
		return a
	},
	buildButtons: function() {
		return ["->", {
			text: this.L("closeText"),
			handler: function() {
				Ext.Function.defer(this.onGridClose, Ext.isIE && !Ext.isIE9 ? 60: 30, this)
			},
			scope: this
		},
		{
			text: this.L("cancelText"),
			handler: function() {
				this.collapse();
				this.fireEvent("blur", this)
			},
			scope: this
		}]
	},
	setTask: function(a) {
		this.task = a;
		this.setRawValue(this.getDisplayValue(a))
	},
	onPickerExpand: function() {
		var a = this.resourceStore,
		b = this.picker;
		b.loadTaskAssignments(this.task.getInternalId())
	},
	onGridClose: function() {
		var b = this.picker.getSelectionModel(),
		a = b.selected;
		this.collapse();
		this.fireEvent("blur", this);
		this.fireEvent("select", this, a);
		Ext.Function.defer(this.picker.saveTaskAssignments, 1, this.picker)
	},
	collapseIf: function(b) {
		var a = this;
		if (this.picker && !b.getTarget("." + Ext.baseCSSPrefix + "editor") && !b.getTarget("." + Ext.baseCSSPrefix + "menu-item")) {
			a.callParent(arguments)
		}
	},
	mimicBlur: function(b) {
		var a = this;
		if (!b.getTarget("." + Ext.baseCSSPrefix + "editor") && !b.getTarget("." + Ext.baseCSSPrefix + "menu-item")) {
			a.callParent(arguments)
		}
	},
	getDisplayValue: function(c) {
		c = c || this.task;
		var g = [],
		f = this.assignmentStore,
		h,
		e = c.getInternalId(),
		b = c.getAssignments();
		for (var d = 0, a = b.length; d < a; d++) {
			h = b[d];
			if (h.data.Units > 0) {
				g.push(Ext.String.format(this.formatString, h.getResourceName(), h.getUnits()))
			}
		}
		return g.join(", ")
	}
},
function() {
	Gnt.widget.AssignmentCellEditor = function() {
		var a = console;
		if (a && a.log) {
			a.log("Gnt.widget.AssignmentCellEditor is deprecated and should no longer be used. Instead simply use Gnt.field.Assignment.")
		}
	}
});
Ext.define("Gnt.column.ResourceAssignment", {
	extend: "Ext.grid.column.Column",
	alias: "widget.resourceassignmentcolumn",
	requires: ["Gnt.field.Assignment"],
	mixins: ["Gnt.mixin.Localizable"],
	tdCls: "sch-assignment-cell",
	showUnits: true,
	field: null,
	constructor: function(a) {
		a = a || {};
		this.text = a.text || this.L("text");
		var b = a.field || a.editor;
		delete a.field;
		delete a.editor;
		a.editor = b || {};
		if (! (a.editor instanceof Ext.form.Field)) {
			a.editor = Ext.ComponentManager.create(Ext.applyIf(a.editor, {
				expandPickerOnFocus: true,
				formatString: "{0}" + (this.showUnits ? " [{1}%]": "")
			}), "assignmentfield")
		}
		a.field = a.editor;
		this.callParent([a]);
		this.scope = this
	},
	renderer: function(b, c, a) {
		return this.field.getDisplayValue(a)
	}
});
Ext.define("Gnt.column.Name", {
	extend: "Ext.tree.Column",
	alias: "widget.namecolumn",
	mixins: ["Gnt.mixin.Localizable"],
	constructor: function(a) {
		a = a || {};
		this.text = a.text || this.L("text");
		var b = a.field || a.editor;
		delete a.field;
		delete a.editor;
		Ext.apply(this, a);
		a.editor = b || {
			xtype: "textfield",
			allowBlank: false
		};
		this.scope = this;
		this.callParent([a])
	},
	afterRender: function() {
		var b = this,
		a = this.up("treepanel");
		if (!this.dataIndex) {
			this.dataIndex = a.store.model.prototype.nameField
		}
		this.callParent(arguments)
	},
	renderer: function(b, c, a) {
		if (!a.isEditable(this.dataIndex)) {
			c.tdCls = (c.tdCls || "") + " sch-column-readonly"
		}
		return b
	}
});
Ext.define("Gnt.column.Note", {
	extend: "Ext.grid.column.Column",
	mixins: ["Gnt.mixin.Localizable"],
	alias: "widget.notecolumn",
	field: {
		xtype: "textfield"
	},
	constructor: function(a) {
		a = a || {};
		this.text = a.text || this.L("text");
		this.callParent(arguments);
		this.scope = this
	},
	afterRender: function() {
		var a = this.up("treepanel");
		if (!this.dataIndex) {
			this.dataIndex = a.store.model.prototype.noteField
		}
		this.callParent(arguments)
	},
	renderer: function(b, c, a) {
		if (!a.isEditable(this.dataIndex)) {
			c.tdCls = (c.tdCls || "") + " sch-column-readonly"
		}
		return b
	}
});
Ext.define("Gnt.column.EndDate", {
	extend: "Ext.grid.column.Date",
	alias: "widget.enddatecolumn",
	requires: ["Ext.grid.CellEditor", "Gnt.field.EndDate"],
	mixins: ["Gnt.mixin.Localizable"],
	width: 100,
	align: "left",
	editorFormat: null,
	adjustMilestones: true,
	validateStartDate: true,
	instantUpdate: false,
	keepDuration: false,
	field: null,
	constructor: function(b) {
		b = b || {};
		this.text = b.text || this.L("text");
		var c = b.field || b.editor;
		delete b.field;
		var a = {
			format: b.editorFormat || b.format || this.format || Ext.Date.defaultFormat,
			instantUpdate: this.instantUpdate,
			adjustMilestones: this.adjustMilestones,
			keepDuration: this.keepDuration,
			validateStartDate: this.validateStartDate
		};
		Ext.Array.forEach(["instantUpdate", "adjustMilestones", "keepDuration", "validateStartDate"],
		function(d) {
			if (d in b) {
				a[d] = b[d]
			}
		},
		this);
		b.editor = c || a;
		if (! (b.editor instanceof Gnt.field.EndDate)) {
			Ext.applyIf(b.editor, a);
			b.editor = Ext.ComponentManager.create(b.editor, "enddatefield")
		}
		b.field = b.editor;
		this.hasCustomRenderer = true;
		this.callParent([b]);
		this.scope = this;
		this.renderer = b.renderer || this.rendererFunc;
		this.editorFormat = this.editorFormat || this.format
	},
	rendererFunc: function(b, c, a) {
		if (!b) {
			return
		}
		if (!a.isEditable(this.dataIndex)) {
			c.tdCls = (c.tdCls || "") + " sch-column-readonly"
		}
		b = this.field.valueToVisible(b, a);
		return Ext.util.Format.date(b, this.format)
	},
	afterRender: function() {
		var a = this.ownerCt.up("treepanel");
		if (!this.dataIndex) {
			this.dataIndex = a.store.model.prototype.endDateField
		}
		this.callParent(arguments)
	}
});
Ext.define("Gnt.column.PercentDone", {
	extend: "Ext.grid.column.Number",
	alias: "widget.percentdonecolumn",
	mixins: ["Gnt.mixin.Localizable"],
	width: 50,
	format: "0",
	align: "center",
	field: {
		xtype: "numberfield",
		minValue: 0,
		maxValue: 100
	},
	constructor: function(a) {
		a = a || {};
		this.text = a.text || this.L("text");
		this.callParent(arguments);
		this.scope = this
	},
	afterRender: function() {
		var a = this.up("treepanel");
		if (!this.dataIndex) {
			this.dataIndex = a.store.model.prototype.percentDoneField
		}
		this.callParent(arguments)
	},
	renderer: function(b, c, a) {
		if (!a.isEditable(this.dataIndex)) {
			c.tdCls = (c.tdCls || "") + " sch-column-readonly"
		}
		return this.defaultRenderer(b, c, a)
	}
});
Ext.define("Gnt.column.StartDate", {
	extend: "Ext.grid.column.Date",
	alias: "widget.startdatecolumn",
	requires: ["Gnt.field.StartDate"],
	mixins: ["Gnt.mixin.Localizable"],
	width: 100,
	align: "left",
	editorFormat: null,
	adjustMilestones: true,
	instantUpdate: false,
	keepDuration: true,
	field: null,
	constructor: function(b) {
		b = b || {};
		this.text = b.text || this.L("text");
		var c = b.field || b.editor;
		delete b.field;
		var a = {
			format: b.editorFormat || b.format || this.format || Ext.Date.defaultFormat,
			instantUpdate: this.instantUpdate,
			adjustMilestones: this.adjustMilestones,
			keepDuration: this.keepDuration
		};
		Ext.Array.forEach(["instantUpdate", "adjustMilestones", "keepDuration"],
		function(d) {
			if (d in b) {
				a[d] = b[d]
			}
		},
		this);
		b.editor = c || a;
		if (! (b.editor instanceof Gnt.field.StartDate)) {
			Ext.applyIf(b.editor, a);
			b.editor = Ext.ComponentManager.create(b.editor, "startdatefield")
		}
		b.field = b.editor;
		this.hasCustomRenderer = true;
		this.callParent([b]);
		this.renderer = b.renderer || this.rendererFunc;
		this.editorFormat = this.editorFormat || this.format
	},
	afterRender: function() {
		var a = this.up("treepanel");
		var b = a.store;
		if (!this.dataIndex) {
			this.dataIndex = b.model.prototype.startDateField
		}
		this.callParent(arguments)
	},
	rendererFunc: function(b, c, a) {
		if (!b) {
			return
		}
		if (!a.isEditable(this.dataIndex)) {
			c.tdCls = (c.tdCls || "") + " sch-column-readonly"
		}
		b = this.field.valueToVisible(b, a);
		return Ext.util.Format.date(b, this.format)
	}
});
Ext.define("Gnt.column.WBS", {
	extend: "Ext.grid.column.Column",
	alias: "widget.wbscolumn",
	mixins: ["Gnt.mixin.Localizable"],
	width: 40,
	align: "left",
	sortable: false,
	dataIndex: "index",
	constructor: function(a) {
		a = a || {};
		this.text = a.text || this.L("text");
		this.callParent(arguments)
	},
	renderer: function(b, c, a) {
		return a.getWBSCode()
	}
});
Ext.define("Gnt.column.SchedulingMode", {
	extend: "Ext.grid.column.Column",
	requires: ["Gnt.field.SchedulingMode"],
	mixins: ["Gnt.mixin.Localizable"],
	alias: "widget.schedulingmodecolumn",
	width: 100,
	align: "left",
	data: null,
	instantUpdate: false,
	field: null,
	constructor: function(a) {
		a = a || {};
		this.text = a.text || this.L("text");
		var b = a.field || a.editor || new Gnt.field.SchedulingMode({
			store: a.data || Gnt.field.SchedulingMode.prototype.store,
			instantUpdate: this.instantUpdate
		});
		delete a.field;
		delete a.editor;
		if (! (b instanceof Gnt.field.SchedulingMode)) {
			Ext.applyIf(b, {
				instantUpdate: this.instantUpdate
			});
			b = Ext.ComponentManager.create(b, "schedulingmodefield")
		}
		a.field = a.editor = b;
		this.scope = this;
		this.callParent([a])
	},
	renderer: function(b, c, a) {
		return this.field.valueToVisible(b, a)
	},
	afterRender: function() {
		this.callParent(arguments);
		var a = this.up("treepanel");
		a.on("beforeedit",
		function(b, c) {
			if (this.field.setTask) {
				this.field.setTask(c.record)
			}
		},
		this);
		if (!this.dataIndex) {
			this.dataIndex = a.store.model.prototype.schedulingModeField
		}
	}
});
Ext.define("Gnt.column.AddNew", {
	extend: "Ext.grid.column.Column",
	alias: "widget.addnewcolumn",
	requires: ["Ext.form.field.ComboBox", "Ext.Editor"],
	mixins: ["Gnt.mixin.Localizable"],
	width: 100,
	resizable: false,
	sortable: false,
	draggable: false,
	colEditor: null,
	columnList: null,
	initComponent: function() {
		if (!this.text) {
			this.text = this.L("text")
		}
		this.addCls("gnt-addnewcolumn");
		this.on({
			headerclick: this.myOnHeaderClick,
			headertriggerclick: this.myOnHeaderClick,
			scope: this
		});
		this.callParent(arguments)
	},
	getGantt: function() {
		if (!this.gantt) {
			this.gantt = this.up("ganttpanel")
		}
		return this.gantt
	},
	getContainingPanel: function() {
		if (!this.panel) {
			this.panel = this.up("tablepanel")
		}
		return this.panel
	},
	myOnHeaderClick: function() {
		if (!this.combo) {
			var a = this.getContainingPanel();
			var e,
			d = this;
			if (this.columnList) {
				e = this.columnList
			} else {
				e = Ext.Array.map(Ext.ClassManager.getNamesByExpression("Gnt.column.*"),
				function(g) {
					var f = Ext.ClassManager.get(g);
					if (f.prototype._isGanttColumn === false || d instanceof f) {
						return null
					}
					return {
						clsName: g,
						text: f.prototype.localize ? f.prototype.localize("text") : f.prototype.text
					}
				});
				e = Ext.Array.clean(e).sort(function(g, f) {
					return g.text > f.text ? 1: -1
				})
			}
			var c = this.colEditor = new Ext.Editor({
				shadow: false,
				updateEl: false,
				itemId: "addNewEditor",
				renderTo: this.el,
				offsets: [20, 0],
				field: new Ext.form.field.ComboBox({
					displayField: "text",
					valueField: "clsName",
					hideTrigger: true,
					queryMode: "local",
					listConfig: {
						itemId: "addNewEditorComboList",
						minWidth: 150
					},
					store: new Ext.data.Store({
						fields: ["text", "clsName"],
						data: e
					}),
					listeners: {
						render: function() {
							this.on("blur",
							function() {
								c.cancelEdit()
							})
						},
						select: this.onSelect,
						scope: this
					}
				})
			})
		}
		var b = this.el.down("." + Ext.baseCSSPrefix + "column-header-text");
		this.colEditor.startEdit(b, "");
		this.colEditor.field.setWidth(this.getWidth() - 20);
		this.colEditor.field.expand();
		return false
	},
	onSelect: function(e, c) {
		var f = c[0];
		var a = this.ownerCt;
		var d = f.get("clsName");
		var b = this.getContainingPanel().getView();
		this.colEditor.cancelEdit();
		Ext.require(d,
		function() {
			var h = Ext.create(d);
			a.insert(a.items.indexOf(this), h);
			var g = this.getGantt();
			if (h instanceof Gnt.column.WBS) {
				if (!g.wbsColumn) {
					g.bindWBSColumnListeners();
					g.wbsColumn = h
				}
			} else {
				if (h instanceof Gnt.column.EarlyStartDate) {
					g.earlyStartColumn = h
				} else {
					if (h instanceof Gnt.column.EarlyEndDate) {
						g.earlyEndColumn = h
					} else {
						if (h instanceof Gnt.column.LateStartDate) {
							g.lateStartColumn = h
						} else {
							if (h instanceof Gnt.column.LateEndDate) {
								g.lateEndColumn = h
							} else {
								if (h instanceof Gnt.column.Slack) {
									g.slackColumn = h
								}
							}
						}
					}
				}
			}
			if (!g.slackListeners && g.slackColumn) {
				g.bindSlackListeners()
			}
			if (!g.earlyDatesListeners && (g.earlyStartColumn || g.earlyEndColumn)) {
				g.bindEarlyDatesListeners()
			}
			if (!g.lateDatesListeners && (g.lateStartColumn || g.lateEndColumn)) {
				g.bindLateDatesListeners()
			}
			b.refresh()
		},
		this)
	}
});
Ext.define("Gnt.column.EarlyStartDate", {
	extend: "Ext.grid.column.Date",
	mixins: ["Gnt.mixin.Localizable"],
	alias: "widget.earlystartdatecolumn",
	width: 100,
	align: "left",
	adjustMilestones: true,
	constructor: function(a) {
		a = a || {};
		this.text = a.text || this.L("text");
		this.callParent(arguments);
		this.renderer = a.renderer || this.rendererFunc;
		this.scope = a.scope || this;
		this.hasCustomRenderer = true
	},
	afterRender: function() {
		var a = this.up("ganttpanel");
		a.registerLockedDependencyListeners();
		this.callParent(arguments)
	},
	rendererFunc: function(b, c, a) {
		c.tdCls = (c.tdCls || "") + " sch-column-readonly";
		return a.getDisplayStartDate(this.format, this.adjustMilestones, a.getEarlyStartDate())
	}
});
Ext.define("Gnt.column.EarlyEndDate", {
	extend: "Ext.grid.column.Date",
	mixins: ["Gnt.mixin.Localizable"],
	alias: "widget.earlyenddatecolumn",
	width: 100,
	align: "left",
	adjustMilestones: true,
	constructor: function(a) {
		a = a || {};
		this.text = a.text || this.L("text");
		this.callParent(arguments);
		this.renderer = a.renderer || this.rendererFunc;
		this.scope = a.scope || this;
		this.hasCustomRenderer = true
	},
	afterRender: function() {
		var a = this.up("ganttpanel");
		a.registerLockedDependencyListeners();
		this.callParent(arguments)
	},
	rendererFunc: function(b, c, a) {
		c.tdCls = (c.tdCls || "") + " sch-column-readonly";
		return a.getDisplayEndDate(this.format, this.adjustMilestones, a.getEarlyEndDate())
	}
});
Ext.define("Gnt.column.LateStartDate", {
	extend: "Ext.grid.column.Date",
	mixins: ["Gnt.mixin.Localizable"],
	alias: "widget.latestartdatecolumn",
	width: 100,
	align: "left",
	adjustMilestones: true,
	constructor: function(a) {
		a = a || {};
		this.text = a.text || this.L("text");
		this.callParent(arguments);
		this.renderer = a.renderer || this.rendererFunc;
		this.scope = a.scope || this;
		this.hasCustomRenderer = true
	},
	afterRender: function() {
		var a = this.up("ganttpanel");
		a.registerLockedDependencyListeners();
		this.callParent(arguments)
	},
	rendererFunc: function(b, c, a) {
		c.tdCls = (c.tdCls || "") + " sch-column-readonly";
		return a.getDisplayStartDate(this.format, this.adjustMilestones, a.getLateStartDate())
	}
});
Ext.define("Gnt.column.LateEndDate", {
	extend: "Ext.grid.column.Date",
	mixins: ["Gnt.mixin.Localizable"],
	alias: "widget.lateenddatecolumn",
	width: 100,
	align: "left",
	adjustMilestones: true,
	constructor: function(a) {
		a = a || {};
		this.text = a.text || this.L("text");
		this.callParent(arguments);
		this.renderer = a.renderer || this.rendererFunc;
		this.scope = a.scope || this;
		this.hasCustomRenderer = true
	},
	afterRender: function() {
		var a = this.up("ganttpanel");
		a.registerLockedDependencyListeners();
		this.callParent(arguments)
	},
	rendererFunc: function(b, c, a) {
		c.tdCls = (c.tdCls || "") + " sch-column-readonly";
		return a.getDisplayEndDate(this.format, this.adjustMilestones, a.getLateEndDate())
	}
});
Ext.define("Gnt.column.Slack", {
	extend: "Ext.grid.column.Column",
	requires: ["Ext.Number", "Sch.util.Date"],
	mixins: ["Gnt.mixin.Localizable"],
	alias: "widget.slackcolumn",
	decimalPrecision: 2,
	useAbbreviation: false,
	slackUnit: "d",
	width: 100,
	align: "left",
	constructor: function(a) {
		a = a || {};
		this.text = a.text || this.L("text");
		this.callParent(arguments);
		this.renderer = a.renderer || this.rendererFunc;
		this.scope = a.scope || this;
		this.hasCustomRenderer = true
	},
	afterRender: function() {
		var a = this.up("ganttpanel");
		a.registerLockedDependencyListeners();
		this.callParent(arguments)
	},
	rendererFunc: function(b, c, a) {
		c.tdCls = (c.tdCls || "") + " sch-column-readonly";
		b = a.getSlack();
		if (Ext.isNumber(b)) {
			return parseFloat(Ext.Number.toFixed(b, this.decimalPrecision)) + " " + Sch.util.Date[this.useAbbreviation ? "getShortNameOfUnit": "getReadableNameOfUnit"](this.slackUnit, b !== 1)
		}
		return ""
	}
});
Ext.define("Gnt.column.BaselineStartDate", {
	extend: "Ext.grid.column.Date",
	mixins: ["Gnt.mixin.Localizable"],
	alias: "widget.baselinestartdatecolumn",
	width: 100,
	adjustMilestones: true,
	constructor: function(a) {
		a = a || {};
		this.text = a.text || this.L("text");
		this.callParent(arguments);
		this.renderer = a.renderer || this.rendererFunc;
		this.scope = a.scope || this;
		this.hasCustomRenderer = true
	},
	rendererFunc: function(b, c, a) {
		c.tdCls = (c.tdCls || "") + " sch-column-readonly";
		return a.getDisplayStartDate(this.format, this.adjustMilestones, a.getBaselineStartDate(), false, true)
	}
});
Ext.define("Gnt.column.BaselineEndDate", {
	extend: "Ext.grid.column.Date",
	mixins: ["Gnt.mixin.Localizable"],
	alias: "widget.baselineenddatecolumn",
	width: 100,
	adjustMilestones: true,
	constructor: function(a) {
		a = a || {};
		this.text = a.text || this.L("text");
		this.callParent(arguments);
		this.renderer = a.renderer || this.rendererFunc;
		this.scope = a.scope || this;
		this.hasCustomRenderer = true
	},
	rendererFunc: function(b, c, a) {
		c.tdCls = (c.tdCls || "") + " sch-column-readonly";
		return a.getDisplayEndDate(this.format, this.adjustMilestones, a.getBaselineEndDate(), false, true)
	}
});
Ext.define("Gnt.column.Milestone", {
	extend: "Ext.grid.column.Column",
	alias: "widget.milestonecolumn",
	mixins: ["Gnt.mixin.Localizable"],
	width: 50,
	align: "center",
	constructor: function(a) {
		a = a || {};
		a.editor = a.editor || new Gnt.field.Milestone();
		this.text = a.text || this.L("text");
		this.field = a.editor;
		this.callParent(arguments);
		this.scope = this
	},
	renderer: function(b, c, a) {
		return this.field.valueToVisible(a.isMilestone())
	}
});
Ext.define("Gnt.widget.AssignmentEditGrid", {
	extend: "Ext.grid.Panel",
	alias: "widget.assignmenteditgrid",
	requires: ["Ext.window.MessageBox", "Ext.grid.plugin.CellEditing", "Gnt.util.Data", "Gnt.model.Resource", "Gnt.model.Assignment", "Gnt.column.ResourceName", "Gnt.column.AssignmentUnits"],
	mixins: ["Gnt.mixin.Localizable"],
	assignmentStore: null,
	resourceStore: null,
	readOnly: false,
	cls: "gnt-assignmentgrid",
	defaultAssignedUnits: 100,
	confirmAddResource: true,
	addResources: true,
	taskId: null,
	refreshTimeout: 100,
	constructor: function(a) {
		Ext.apply(this, a);
		this.confirmAddResource = this.confirmAddResourceText !== false;
		this.store = Ext.create("Gnt.data.AssignmentStore", {
			taskStore: a.taskStore || a.assignmentStore.getTaskStore()
		});
		this.resourceDupStore = Ext.create("Gnt.data.ResourceStore", {
			taskStore: a.taskStore || a.assignmentStore.getTaskStore()
		});
		this.resourceComboStore = Ext.create("Ext.data.JsonStore", {
			model: Gnt.model.Resource
		});
		if (a.addResources !== undefined) {
			this.addResources = a.addResources
		}
		this.columns = this.buildColumns();
		if (!this.readOnly) {
			this.plugins = this.buildPlugins()
		}
		this.callParent(arguments)
	},
	initComponent: function() {
		this.loadResources();
		var a = Ext.Function.createBuffered(this.loadResources, this.refreshTimeout, this, []);
		this.mon(this.resourceStore, {
			add: a,
			remove: a,
			load: a,
			clear: a
		});
		this.loadTaskAssignments();
		var b = Ext.Function.createBuffered(this.loadTaskAssignments, this.refreshTimeout, this, []);
		this.mon(this.assignmentStore, {
			add: b,
			remove: b,
			load: b,
			clear: b
		});
		this.callParent(arguments)
	},
	loadResources: function(b) {
		if (!this.resourceStore) {
			return false
		}
		var a = Gnt.util.Data.cloneModelSet(this.resourceStore,
		function(c, d) {
			if (!c.getId()) {
				c.setId(d.getInternalId())
			}
		});
		this.resourceDupStore.loadData(a);
		this.resourceComboStore.loadData(a);
		if (!b) {
			this.loadTaskAssignments()
		}
		return true
	},
	loadTaskAssignments: function(b) {
		b = b || this.taskId;
		if (!b) {
			return false
		}
		if (!this.assignmentStore) {
			return false
		}
		this.taskId = b;
		var e = this.assignmentStore.queryBy(function(f) {
			return f.getTaskId() === b
		});
		var a = this.store,
		c = this.resourceDupStore,
		d = Gnt.util.Data.cloneModelSet(e,
		function(g, f) {
			var i = f.getResourceId();
			var h = c.queryBy(function(k) {
				var j = k.originalRecord;
				return (j.getId() || j.internalId) == i
			});
			if (h.getCount()) {
				h = h.first();
				g.setResourceId(h.getId() || h.internalId)
			}
		});
		a.suspendEvents();
		a.loadData(d);
		a.resumeEvents();
		this.getView().refresh();
		return true
	},
	insertAssignment: function(b, g) {
		if (!this.store) {
			return
		}
		var d = this.store.model.prototype,
		c = {};
		if (b) {
			c = b
		} else {
			c[d.unitsField] = this.defaultAssignedUnits
		}
		c[d.taskIdField] = this.taskId;
		var e = this.store.insert(0, c);
		var f = this,
		a = e[0].isValid;
		e[0].isValid = function() {
			return a.apply(this, arguments) && f.isValidAssignment(this)
		};
		if (!g) {
			this.cellEditing.startEditByPosition({
				row: 0,
				column: 0
			})
		}
		return e
	},
	isValid: function() {
		var a = true;
		this.store.each(function(b) {
			if (!b.isValid()) {
				a = false;
				return false
			}
		});
		return a
	},
	getAssignmentErrors: function(a) {
		var b = a.getResourceId();
		if (!b) {
			return [this.L("noValueText")]
		}
		if (!this.resourceDupStore.getByInternalId(b)) {
			return [Ext.String.format(this.L("noResourceText"), b)]
		}
	},
	isValidAssignment: function(a) {
		return ! this.getAssignmentErrors(a)
	},
	buildPlugins: function() {
		var a = this.cellEditing = Ext.create("Ext.grid.plugin.CellEditing", {
			clicksToEdit: 1
		});
		var b = a.startEdit;
		a.startEdit = function() {
			this.completeEdit();
			return b.apply(this, arguments)
		};
		a.on({
			beforeedit: this.onEditingStart,
			scope: this
		});
		return [a]
	},
	hide: function() {
		this.cellEditing.cancelEdit();
		return this.callParent(arguments)
	},
	onEditingStart: function(a, c) {
		var b = this.store.model.prototype;
		if (c.field == b.resourceIdField) {
			this.assignment = c.record;
			this.resourceId = c.record.getResourceId();
			this.resourceComboStore.loadData(this.resourceDupStore.getRange());
			this.resourceComboStore.filter(this.resourcesFilter)
		}
	},
	resourceRender: function(b, c, d) {
		var e = this.getAssignmentErrors(d);
		if (e && e.length) {
			c.tdCls = Ext.baseCSSPrefix + "form-invalid";
			c.tdAttr = 'data-errorqtip="' + e.join("<br>") + '"'
		} else {
			c.tdCls = "";
			c.tdAttr = 'data-errorqtip=""'
		}
		var a = this.resourceDupStore.getByInternalId(b);
		return Ext.String.htmlEncode((a && a.getName()) || b)
	},
	filterResources: function(c) {
		var d = c.getInternalId(),
		b = Gnt.model.Assignment.prototype.resourceIdField,
		a = true;
		if (d !== this.resourceId) {
			this.store.each(function(e) {
				if (d == e.get(b)) {
					a = false;
					return false
				}
			})
		}
		return a
	},
	onResourceComboAssert: function(f) {
		var e = f.getRawValue();
		if (e) {
			var a = this.resourceDupStore.findExact(f.displayField, e);
			var b = a !== -1 ? this.resourceDupStore.getAt(a) : false;
			if (!b) {
				var h = this.assignment;
				var d = this;
				var c = function(j) {
					var k = Gnt.model.Resource.prototype,
					i = {};
					i[k.nameField] = f.rawValue;
					i = Ext.ModelManager.create(i, Gnt.model.Resource);
					i.setId(i.internalId);
					var l = d.resourceDupStore.add(i);
					if (l && l.length) {
						if (!j) {
							f.getStore().add(i);
							f.setValue(l[0].getId())
						} else {
							h.setResourceId(l[0].getId())
						}
					}
				};
				if (this.confirmAddResource) {
					var g = Ext.String.htmlEncode(Ext.String.format(this.L("confirmAddResourceText"), e));
					Ext.Msg.confirm(this.L("confirmAddResourceTitle"), g,
					function(i) {
						if (i == "yes") {
							c(true)
						}
					})
				} else {
					c()
				}
			} else {
				f.select(b, true)
			}
		}
	},
	buildColumns: function() {
		var a = this;
		this.resourceCombo = Ext.create("Ext.form.field.ComboBox", {
			queryMode: "local",
			store: this.resourceComboStore,
			alowBlank: false,
			editing: this.addResources,
			validateOnChange: false,
			autoSelect: false,
			forceSelection: !this.addResources,
			valueField: Gnt.model.Resource.prototype.idProperty,
			displayField: Gnt.model.Resource.prototype.nameField,
			queryCaching: false,
			listConfig: {
				getInnerTpl: function() {
					return "{" + this.displayField + ":htmlEncode}"
				}
			}
		});
		if (this.addResources) {
			this.resourcesFilter = Ext.create("Ext.util.Filter", {
				filterFn: this.filterResources,
				scope: this
			});
			Ext.Function.interceptBefore(this.resourceCombo, "assertValue",
			function() {
				a.onResourceComboAssert(this)
			})
		}
		return [{
			xtype: "resourcenamecolumn",
			editor: this.resourceCombo,
			dataIndex: Gnt.model.Assignment.prototype.resourceIdField,
			renderer: this.resourceRender,
			scope: this
		},
		{
			xtype: "assignmentunitscolumn",
			assignmentStore: this.assignmentStore,
			editor: {
				xtype: "percentfield",
				step: 10
			}
		}]
	},
	saveResources: function() {
		Gnt.util.Data.applyCloneChanges(this.resourceDupStore, this.resourceStore)
	},
	saveTaskAssignments: function() {
		this.resourceStore.suspendEvents(true);
		this.assignmentStore.suspendEvents(true);
		this.saveResources();
		var b = this.store.model,
		c = this.resourceDupStore,
		a = true;
		Gnt.util.Data.applyCloneChanges(this.store, this.assignmentStore,
		function(f) {
			var e = c.getByInternalId(this.getResourceId());
			if (!e.originalRecord) {
				a = false;
				return
			}
			var d = e.originalRecord;
			f[b.prototype.resourceIdField] = d.getId() || d.internalId
		});
		this.resourceStore.resumeEvents();
		this.assignmentStore.resumeEvents();
		return a
	}
});
Ext.define("Gnt.widget.DependencyGrid", {
	extend: "Ext.grid.Panel",
	alias: "widget.dependencygrid",
	requires: ["Ext.data.JsonStore", "Ext.grid.plugin.CellEditing", "Ext.form.field.ComboBox", "Gnt.model.Dependency", "Gnt.util.Data", "Gnt.field.Duration"],
	mixins: ["Gnt.mixin.Localizable"],
	readOnly: false,
	showCls: false,
	cls: "gnt-dependencygrid",
	task: null,
	dependencyStore: null,
	direction: "predecessors",
	oppositeStore: null,
	taskStoreListeners: null,
	refreshTimeout: 100,
	allowParentTaskDependencies: false,
	constructor: function(a) {
		a = a || {};
		if (Ext.getVersion("extjs").isLessThan("4.2.1")) {
			if (typeof Ext.tip !== "undefined" && Ext.tip.Tip && Ext.tip.Tip.prototype.minWidth != "auto") {
				Ext.tip.Tip.prototype.minWidth = "auto"
			}
		}
		Ext.Array.each(["idText", "taskText", "blankTaskText", "invalidDependencyText", "parentChildDependencyText", "duplicatingDependencyText", "transitiveDependencyText", "cyclicDependencyText", "typeText", "lagText", "clsText", "endToStartText", "startToStartText", "endToEndText", "startToEndText"],
		function(b) {
			if (b in a) {
				this[b] = a[b]
			}
		},
		this);
		this.store = Ext.create("Ext.data.JsonStore", {
			model: "Gnt.model.Dependency"
		});
		if (!this.readOnly) {
			this.plugins = this.buildPlugins()
		}
		this.direction = a.direction || this.direction;
		if (a.oppositeStore) {
			this.setOppositeStore(a.oppositeStore)
		}
		if (a.task) {
			this.loadDependencies(a.task)
		}
		this.columns = this.buildColumns();
		this.callParent(arguments)
	},
	destroy: function() {
		this.cellEditing.destroy();
		if (this.deferredStoreBind) {
			this.tasksCombo.un("render", this.bindTaskStore, this)
		}
		this.tasksCombo.destroy();
		this.lagEditor.destroy();
		this.callParent(arguments)
	},
	setTask: function(a) {
		if (!a) {
			return
		}
		this.task = a;
		var b = a.dependencyStore || a.getTaskStore().dependencyStore;
		if (b && b !== this.dependencyStore) {
			this.dependencyStore = b;
			this.mon(this.dependencyStore, {
				datachanged: function() {
					this.loadDependencies()
				},
				scope: this
			})
		}
	},
	buildPlugins: function() {
		var a = this.cellEditing = Ext.create("Ext.grid.plugin.CellEditing", {
			clicksToEdit: 1
		});
		a.on({
			beforeedit: this.onEditingStart,
			edit: this.onEditingDone,
			scope: this
		});
		return [a]
	},
	hide: function() {
		this.cellEditing.cancelEdit();
		this.callParent(arguments)
	},
	onEditingStart: function(a, c) {
		var b = this.store.model.prototype;
		switch (c.field) {
		case b.lagField:
			this.lagEditor.durationUnit = c.record.getLagUnit();
			break
		}
	},
	onEditingDone: function(a, c) {
		var b = this.store.model.prototype;
		if (c.field == b.lagField) {
			c.record.setLagUnit(this.lagEditor.durationUnit)
		}
		this.getView().refresh()
	},
	dependencyTypeRender: function(b) {
		var a = this.store.model.Type;
		switch (b) {
		case a.EndToStart:
			return this.L("endToStartText");
		case a.StartToStart:
			return this.L("startToStartText");
		case a.EndToEnd:
			return this.L("endToEndText");
		case a.StartToEnd:
			return this.L("startToEndText")
		}
		return b
	},
	taskValidate: function(b, a) {
		if (!b) {
			return [this.L("blankTaskText")]
		}
		if (!a.isValid()) {
			var c = this.getDependencyErrors(a);
			if (c && c.length) {
				return c
			}
			return [this.L("invalidDependencyText")]
		}
	},
	taskRender: function(d, e, b) {
		var f = this.taskValidate(d, b),
		a;
		if (f && f.length) {
			e.tdCls = Ext.baseCSSPrefix + "form-invalid";
			e.tdAttr = 'data-errorqtip="' + f.join("<br>") + '"'
		} else {
			e.tdCls = "";
			e.tdAttr = 'data-errorqtip=""'
		}
		var c = this.dependencyStore && this.dependencyStore.getTaskStore();
		if (c) {
			a = c.getById(d) || c.getByInternalId(d);
			return (a && Ext.String.htmlEncode(a.getName())) || ""
		}
		return ""
	},
	filterTasks: function(a) {
		var c = this,
		b = a.getInternalId(),
		d;
		if (this.direction === "predecessors") {
			d = "getSourceId"
		} else {
			d = "getTargetId"
		}
		return b != this.task.getInternalId() && !this.task.contains(a) && !a.contains(this.task) && (this.allowParentTaskDependencies || a.isLeaf())
	},
	bindTaskStore: function() {
		var c = this.dependencyStore && this.dependencyStore.getTaskStore();
		if (c) {
			if (!this.taskStoreListeners) {
				var d = Ext.Function.createBuffered(this.bindTaskStore, this.refreshTimeout, this, []);
				this.taskStoreListeners = this.mon(c, {
					append: d,
					insert: d,
					update: d,
					remove: d,
					refresh: d,
					clear: d,
					scope: this,
					destroyable: true
				})
			}
			var b = Ext.create("Ext.data.JsonStore", {
				model: c.model
			});
			var a = c.tree.getRootNode();
			b.loadData(Gnt.util.Data.cloneModelSet(c.tree.flatten(),
			function(f, e) {
				if (e === a) {
					return false
				}
				if (!e.getId()) {
					f.setId(e.getPhantomId())
				}
			}));
			this.tasksFilter = Ext.create("Ext.util.Filter", {
				filterFn: this.filterTasks,
				scope: this
			});
			b.filter(this.tasksFilter);
			this.tasksCombo.bindStore(b)
		}
	},
	buildTasksCombo: function() {
		var a = this;
		return Ext.create("Ext.form.field.ComboBox", {
			queryMode: "local",
			alowBlank: false,
			editing: false,
			forceSelection: true,
			valueField: this.task ? this.task.idProperty: "Id",
			displayField: this.task ? this.task.nameField: "Name",
			queryCaching: false,
			listConfig: {
				getInnerTpl: function() {
					return "{" + this.displayField + ":htmlEncode}"
				}
			},
			validator: function(b) {
				if (!b) {
					return a.L("blankTaskText")
				}
				return true
			}
		})
	},
	buildColumns: function() {
		var c = this,
		b = this.store.model.prototype,
		e = this.store.model.Type,
		d = [],
		a = this.dependencyStore && this.dependencyStore.getTaskStore();
		this.tasksCombo = this.buildTasksCombo();
		if (!a) {
			this.deferredStoreBind = true;
			this.tasksCombo.on("render", this.bindTaskStore, this)
		} else {
			this.bindTaskStore()
		}
		if (this.direction === "predecessors") {
			d.push({
				text: this.L("idText"),
				dataIndex: b.fromField,
				width: 50
			},
			{
				text: this.L("taskText"),
				dataIndex: b.fromField,
				flex: 1,
				editor: this.tasksCombo,
				renderer: function(g, h, f) {
					return c.taskRender(g, h, f)
				}
			})
		} else {
			d.push({
				text: this.L("idText"),
				dataIndex: b.toField,
				width: 50
			},
			{
				text: this.L("taskText"),
				dataIndex: b.toField,
				flex: 1,
				editor: this.tasksCombo,
				renderer: function(g, h, f) {
					return c.taskRender(g, h, f)
				}
			})
		}
		this.lagEditor = Ext.create("Gnt.field.Duration", {
			minValue: Number.NEGATIVE_INFINITY
		});
		d.push({
			text: this.L("typeText"),
			dataIndex: b.typeField,
			width: 120,
			renderer: function(f) {
				return c.dependencyTypeRender(f)
			},
			editor: {
				xtype: "combo",
				triggerAction: "all",
				queryMode: "local",
				editable: false,
				store: [[e.EndToStart, this.L("endToStartText")], [e.StartToStart, this.L("startToStartText")], [e.EndToEnd, this.L("endToEndText")], [e.StartToEnd, this.L("startToEndText")]]
			}
		},
		{
			text: this.L("lagText"),
			dataIndex: b.lagField,
			width: 100,
			editor: this.lagEditor,
			renderer: function(h, i, f) {
				var g = this.store.model.prototype;
				return c.lagEditor.valueToVisible(h, f.get(g.lagUnitField), 2)
			}
		},
		{
			text: this.L("clsText"),
			dataIndex: b.clsField,
			hidden: !this.showCls,
			width: 100
		});
		return d
	},
	insertDependency: function(b, h) {
		if (!this.store) {
			return
		}
		var e = this.task.getInternalId(),
		d = this.store.model.prototype,
		c = {},
		g = this;
		if (b) {
			c = b
		} else {
			c[d.typeField] = this.store.model.Type.EndToStart;
			c[d.lagField] = 0;
			c[d.lagUnitField] = "d"
		}
		if (this.direction === "predecessors") {
			c[d.toField] = e
		} else {
			c[d.fromField] = e
		}
		var f = this.store.insert(0, c);
		if (f.length) {
			var a = f[0].isValid;
			f[0].isValid = function() {
				return a.call(this, false) && g.isValidDependency(this)
			}
		}
		if (!h) {
			this.cellEditing.startEditByPosition({
				row: 0,
				column: 1
			})
		}
		return f
	},
	onOppositeStoreChange: function() {
		this.getView().refresh()
	},
	setOppositeStore: function(a) {
		if (this.oppositeStore) {
			this.oppositeStore.un("update", this.onOppositeStoreChange, this);
			this.oppositeStore.un("datachanged", this.onOppositeStoreChange, this)
		}
		this.oppositeStore = a;
		this.oppositeStore.on("update", this.onOppositeStoreChange, this);
		this.oppositeStore.on("datachanged", this.onOppositeStoreChange, this)
	},
	loadDependencies: function(b) {
		var c = this;
		b = b || this.task;
		if (!b) {
			return
		}
		if (this.task !== b) {
			this.setTask(b)
		}
		var d;
		if (this.direction === "predecessors") {
			d = b.getIncomingDependencies(this.dependencyStore);
			if (!this.oppositeStore) {
				this.oppositeData = b.getOutgoingDependencies(this.dependencyStore)
			}
		} else {
			d = b.getOutgoingDependencies(this.dependencyStore);
			if (!this.oppositeStore) {
				this.oppositeData = b.getIncomingDependencies(this.dependencyStore)
			}
		}
		var a = Gnt.util.Data.cloneModelSet(d,
		function(f) {
			var e = f.isValid;
			f.isValid = function() {
				return e.call(this, false) && c.isValidDependency(this)
			}
		});
		this.store.loadData(a)
	},
	getDependencyErrors: function(c) {
		var i = this,
		k = this.dependencyStore,
		e = this.task.getInternalId(),
		a = e,
		j = [],
		d,
		b;
		if (this.direction === "predecessors") {
			e = c.getSourceId();
			d = "getTargetId";
			b = e
		} else {
			a = c.getTargetId();
			d = "getSourceId";
			b = a
		}
		var h = k.getSourceTask(e);
		var f = k.getTargetTask(a);
		if (h && f && (h.contains(f) || f.contains(h))) {
			j.push(this.L("parentChildDependencyText"))
		}
		var g;
		if (this.oppositeStore) {
			g = this.oppositeStore.findBy(function(m) {
				var l = i.direction === "predecessors" ? [m[d](), b] : [b, m[d]()];
				return m[d]() == b || k.hasTransitiveDependency.apply(k, l)
			}) >= 0
		} else {
			Ext.each(this.oppositeData,
			function(m) {
				var l = i.direction === "predecessors" ? [m[d](), b] : [b, m[d]()];
				if (m[d]() == b || k.hasTransitiveDependency.apply(k, l)) {
					g = true;
					return false
				}
			})
		}
		if (g) {
			j.push(this.L("cyclicDependencyText"))
		}
		this.store.each(function(o) {
			var n = o.getSourceId(),
			m = o.getTargetId();
			if ((e == n) && (a == m) && (o !== c)) {
				j.push(i.L("duplicatingDependencyText"));
				return false
			}
			var l = i.direction === "predecessors" ? [e, n] : [m, a];
			if (k.hasTransitiveDependency.apply(k, l)) {
				j.push(i.L("transitiveDependencyText"));
				return false
			}
		});
		return j
	},
	isValidDependency: function(a) {
		var b = this.getDependencyErrors(a);
		return ! b || !b.length
	},
	isValid: function() {
		var a = true;
		this.store.each(function(b) {
			if (!b.isValid()) {
				a = false;
				return false
			}
		});
		return a
	},
	saveDependencies: function() {
		if (!this.isValid()) {
			return
		}
		Gnt.util.Data.applyCloneChanges(this.store, this.dependencyStore)
	}
});
Ext.define("Gnt.widget.taskeditor.TaskForm", {
	extend: "Ext.form.Panel",
	alias: "widget.taskform",
	requires: ["Gnt.model.Task", "Ext.form.FieldContainer", "Ext.form.field.Text", "Ext.form.field.Date", "Gnt.field.Percent", "Gnt.field.StartDate", "Gnt.field.EndDate", "Gnt.field.Duration", "Gnt.field.SchedulingMode", "Gnt.field.Effort"],
	mixins: ["Gnt.mixin.Localizable"],
	alternateClassName: ["Gnt.widget.TaskForm"],
	task: null,
	taskBuffer: null,
	taskStore: null,
	highlightTaskUpdates: true,
	showBaseline: true,
	editBaseline: false,
	showCalendar: false,
	showSchedulingMode: false,
	taskNameConfig: null,
	durationConfig: null,
	startConfig: null,
	finishConfig: null,
	percentDoneConfig: null,
	baselineStartConfig: null,
	baselineFinishConfig: null,
	baselinePercentDoneConfig: null,
	effortConfig: null,
	calendarConfig: null,
	schedulingModeConfig: null,
	constructor: function(b) {
		b = b || {};
		this.showBaseline = b.showBaseline;
		this.editBaseline = b.editBaseline;
		var a = Gnt.model.Task.prototype;
		this.fieldNames = {
			baselineEndDateField: a.baselineEndDateField,
			baselinePercentDoneField: a.baselinePercentDoneField,
			baselineStartDateField: a.baselineStartDateField,
			calendarIdField: a.calendarIdField,
			clsField: a.clsField,
			draggableField: a.draggableField,
			durationField: a.durationField,
			durationUnitField: a.durationUnitField,
			effortField: a.effortField,
			effortUnitField: a.effortUnitField,
			endDateField: a.endDateField,
			manuallyScheduledField: a.manuallyScheduledField,
			nameField: a.nameField,
			percentDoneField: a.percentDoneField,
			resizableField: a.resizableField,
			schedulingModeField: a.schedulingModeField,
			startDateField: a.startDateField,
			noteField: a.noteField
		};
		Ext.apply(this, b, {
			border: false,
			layout: "anchor",
			defaultType: "textfield"
		});
		if (this.task) {
			this.fieldNames = this.getFieldNames(this.task);
			this.taskBuffer = this.taskBuffer || this.task.copy()
		}
		if (!this.items) {
			this.buildFields()
		}
		this.callParent(arguments)
	},
	getFieldNames: function(b) {
		if (!b) {
			return
		}
		var a = {};
		for (var c in this.fieldNames) {
			a[c] = b[c]
		}
		return a
	},
	renameFields: function(b) {
		var a = this.getFieldNames(b);
		if (!a) {
			return
		}
		var d = this.getForm(),
		f = false,
		e;
		for (var c in this.fieldNames) {
			e = d.findField(this.fieldNames[c]);
			if (e && a[c] && a[c] != e.name) {
				f = true;
				e.name = a[c]
			}
		}
		if (f) {
			this.fieldNames = a
		}
	},
	buildFields: function() {
		var d = this,
		e = this.fieldNames,
		c = this.task,
		b = this.taskStore,
		i = '<table class="gnt-fieldcontainer-label-wrap"><td width="1" class="gnt-fieldcontainer-label">',
		h = '<td><div class="gnt-fieldcontainer-separator"></div></table>';
		var g = function(f) {
			return c ? c.get(e[f]) : ""
		};
		var a = function(j, f) {
			return Ext.apply(j, {
				taskStore: d.taskStore,
				task: d.task,
				highlightTaskUpdates: d.highlightTaskUpdates
			},
			f)
		};
		this.items = this.items || [];
		this.items.push.call(this.items, {
			xtype: "fieldcontainer",
			layout: "hbox",
			defaults: {
				allowBlank: false
			},
			items: [a({
				xtype: "textfield",
				fieldLabel: this.L("taskNameText"),
				name: e.nameField,
				labelWidth: 110,
				flex: 1,
				value: g(e.nameField)
			},
			this.taskNameConfig), a({
				xtype: "durationfield",
				fieldLabel: this.L("durationText"),
				name: e.durationField,
				margins: "0 0 0 6",
				labelWidth: 90,
				width: 170,
				value: g(e.durationField)
			},
			this.durationConfig)]
		},
		a({
			xtype: "percentfield",
			fieldLabel: this.L("percentDoneText"),
			name: e.percentDoneField,
			labelWidth: 110,
			width: 200,
			allowBlank: false,
			value: g(e.percentDoneField)
		},
		this.percentDoneConfig), {
			xtype: "fieldcontainer",
			fieldLabel: this.L("datesText"),
			labelAlign: "top",
			labelSeparator: "",
			beforeLabelTextTpl: i,
			afterLabelTextTpl: h,
			layout: "hbox",
			defaults: {
				labelWidth: 110,
				flex: 1,
				allowBlank: false
			},
			items: [a({
				xtype: "startdatefield",
				fieldLabel: this.L("startText"),
				name: e.startDateField,
				value: g(e.startDateField)
			},
			this.startConfig), a({
				xtype: "enddatefield",
				fieldLabel: this.L("finishText"),
				name: e.endDateField,
				margins: "0 0 0 6",
				value: g(e.endDateField)
			},
			this.finishConfig)]
		},
		a({
			xtype: "effortfield",
			fieldLabel: this.L("effortText"),
			name: e.effortField,
			invalidText: this.L("invalidEffortText"),
			labelWidth: 110,
			width: 200,
			margins: "0 0 0 6",
			allowBlank: true,
			value: g(e.effortField)
		},
		this.effortConfig));
		if (this.showBaseline) {
			this.items.push.call(this.items, {
				xtype: "fieldcontainer",
				fieldLabel: this.L("baselineText"),
				labelAlign: "top",
				labelSeparator: "",
				beforeLabelTextTpl: i,
				afterLabelTextTpl: h,
				layout: "hbox",
				defaultType: "datefield",
				defaults: {
					labelWidth: 110,
					flex: 1,
					cls: "gnt-baselinefield"
				},
				items: [a({
					fieldLabel: this.L("baselineStartText"),
					name: e.baselineStartDateField,
					value: g(e.baselineStartDateField),
					readOnly: !this.editBaseline
				},
				this.baselineStartConfig), a({
					fieldLabel: this.L("baselineFinishText"),
					name: e.baselineEndDateField,
					margins: "0 0 0 6",
					value: g(e.baselineEndDateField),
					readOnly: !this.editBaseline
				},
				this.baselineFinishConfig)]
			},
			a({
				xtype: "percentfield",
				fieldLabel: this.L("baselinePercentDoneText"),
				name: e.baselinePercentDoneField,
				labelWidth: 110,
				width: 200,
				cls: "gnt-baselinefield",
				value: g(e.baselinePercentDoneField),
				readOnly: !this.editBaseline
			},
			this.baselinePercentDoneConfig))
		}
		if (this.showCalendar) {
			this.items.push(a({
				xtype: "calendarfield",
				fieldLabel: this.L("calendarText"),
				name: e.calendarIdField,
				value: g(e.calendarIdField)
			},
			this.calendarConfig))
		}
		if (this.showSchedulingMode) {
			this.items.push(a({
				xtype: "schedulingmodefield",
				fieldLabel: this.L("schedulingModeText"),
				name: e.schedulingModeField,
				value: g(e.schedulingModeField),
				allowBlank: false
			},
			this.schedulingModeConfig))
		}
	},
	setSuppressTaskUpdate: function(b) {
		var a = this.getForm().getFields();
		a.each(function(c) {
			c.setSuppressTaskUpdate && c.setSuppressTaskUpdate(b)
		})
	},
	loadRecord: function(b, a) {
		if (b && b !== this.task) {
			this.renameFields(b)
		}
		this.task = b;
		this.taskBuffer = a;
		if (!this.taskBuffer) {
			this.taskBuffer = b.copy();
			this.taskBuffer.taskStore = b.taskStore
		}
		var d = this,
		c = d.getForm();
		c._record = b;
		Ext.suspendLayouts();
		Ext.iterate(b.getData(),
		function(e, g) {
			var f = c.findField(e);
			if (f) {
				if (f.setTask) {
					f.setSuppressTaskUpdate(true);
					f.setTask(d.taskBuffer);
					f.setSuppressTaskUpdate(false)
				} else {
					f.setValue(g)
				}
				if (c.trackResetOnLoad) {
					f.resetOriginalValue()
				}
			}
		});
		Ext.resumeLayouts(true);
		this.fireEvent("afterloadrecord", this, b)
	},
	updateRecord: function(b) {
		b = b || this.task;
		var a = Ext.Function.bind(function() {
			this.setSuppressTaskUpdate(true);
			var c = this.getForm().getFields();
			b.beginEdit();
			c.each(function(e) {
				if (e.applyChanges) {
					e.applyChanges(b)
				} else {
					var d = b.fields.getByKey(e.name);
					if (d && d.persist) {
						b.set(e.name, e.getValue())
					}
				}
			});
			b.endEdit();
			this.setSuppressTaskUpdate(false);
			this.fireEvent("afterupdaterecord", this, b)
		},
		this);
		if (b && this.fireEvent("beforeupdaterecord", this, b, a) !== false) {
			a();
			return true
		}
		return false
	}
});
Ext.define("Gnt.widget.taskeditor.TaskEditor", {
	extend: "Ext.panel.Panel",
	alias: "widget.taskeditor",
	requires: ["Ext.tab.Panel", "Ext.form.Panel", "Gnt.widget.taskeditor.TaskForm", "Gnt.widget.AssignmentEditGrid", "Gnt.widget.DependencyGrid", "Gnt.field.Calendar", "Gnt.field.SchedulingMode", "Ext.form.field.HtmlEditor"],
	mixins: ["Gnt.mixin.Localizable"],
	margin: "5 0 0 0",
	alternateClassName: ["Gnt.widget.TaskEditor"],
	task: null,
	taskStore: null,
	assignmentStore: null,
	resourceStore: null,
	taskFormClass: "Gnt.widget.taskeditor.TaskForm",
	advancedFormClass: "Gnt.widget.taskeditor.TaskForm",
	showAssignmentGrid: true,
	showDependencyGrid: true,
	allowParentTaskDependencies: false,
	showNotes: true,
	showStyle: true,
	showAdvancedForm: true,
	showBaseline: true,
	tabsConfig: null,
	taskFormConfig: null,
	dependencyGridClass: "Gnt.widget.DependencyGrid",
	dependencyGridConfig: null,
	assignmentGridConfig: null,
	styleFormConfig: null,
	advancedFormConfig: null,
	notesConfig: null,
	height: 340,
	width: 600,
	layout: "fit",
	tabs: null,
	taskForm: null,
	assignmentGrid: null,
	dependencyGrid: null,
	advancedForm: null,
	stylingText: "Styling",
	clsText: "CSS Class",
	backgroundText: "Background",
	doneBackgroundText: "Progress Background",
	constructor: function(b) {
		var d = this,
		c = Gnt.model.Task.prototype;
		b = b || {};
		Ext.apply(this, b);
		this.taskFormConfig = this.taskFormConfig || {};
		Ext.applyIf(this.taskFormConfig, {
			showBaseline: this.showBaseline
		});
		var a = [];
		this.taskForm = Ext.create(this.taskFormClass || "Gnt.widget.taskeditor.TaskForm", Ext.applyIf(this.taskFormConfig, {
			task: this.task,
			taskStore: this.taskStore
		}));
		a.push(this.taskForm);
		if (this.showDependencyGrid) {
			this.dependencyGrid = Ext.create(this.dependencyGridClass, Ext.apply({
				allowParentTaskDependencies: this.allowParentTaskDependencies,
				task: this.task,
				margin: 5,
				tbar: {
					layout: "auto",
					items: [{
						xtype: "button",
						iconCls: "gnt-action-add",
						text: this.L("addDependencyText"),
						handler: function() {
							d.dependencyGrid.insertDependency()
						}
					},
					{
						xtype: "button",
						iconCls: "gnt-action-remove",
						text: this.L("dropDependencyText"),
						itemId: "drop-dependency-btn",
						disabled: true,
						handler: function() {
							var f = d.dependencyGrid.getSelectionModel().getSelection();
							if (f && f.length) {
								d.dependencyGrid.store.remove(f)
							}
						}
					}]
				},
				listeners: {
					selectionchange: function(h, g) {
						var f = d.dependencyGrid;
						if (!f.dropDepBtn) {
							f.dropDepBtn = f.down("[itemId=drop-dependency-btn]")
						}
						f.dropDepBtn && f.dropDepBtn.setDisabled(!g.length)
					}
				}
			},
			this.dependencyGridConfig));
			a.push(this.dependencyGrid)
		}
		if (this.showAssignmentGrid && this.assignmentStore && this.resourceStore) {
			this.assignmentGrid = Ext.create("Gnt.widget.AssignmentEditGrid", Ext.apply({
				assignmentStore: this.assignmentStore,
				resourceStore: this.resourceStore,
				tbar: {
					layout: "auto",
					items: [{
						xtype: "button",
						iconCls: "gnt-action-add",
						text: this.L("addAssignmentText"),
						handler: function() {
							d.assignmentGrid.insertAssignment()
						}
					},
					{
						xtype: "button",
						iconCls: "gnt-action-remove",
						text: this.L("dropAssignmentText"),
						itemId: "drop-assignment-btn",
						disabled: true,
						handler: function() {
							var f = d.assignmentGrid.getSelectionModel().getSelection();
							if (f && f.length) {
								d.assignmentGrid.store.remove(f)
							}
						}
					}]
				},
				listeners: {
					afterrender: {
						fn: function(f) {
							f.loadTaskAssignments(d.task.get(d.task.idProperty))
						},
						single: true
					},
					selectionchange: function(h, g) {
						var f = d.assignmentGrid;
						if (!f.dropBtn) {
							f.dropBtn = f.down("[itemId=drop-assignment-btn]")
						}
						f.dropBtn && f.dropBtn.setDisabled(!g.length)
					}
				}
			},
			this.assignmentGridConfig));
			a.push(this.assignmentGrid)
		}
		if (this.showAdvancedForm) {
			var e = Ext.ClassManager.get(this.advancedFormClass || "Gnt.widget.taskeditor.TaskForm").prototype;
			this.advancedFormConfig = this.advancedFormConfig || {};
			this.advancedForm = Ext.create(this.advancedFormClass || "Gnt.widget.taskeditor.TaskForm", Ext.applyIf(this.advancedFormConfig, {
				items: [{
					xtype: "calendarfield",
					fieldLabel: e.L("calendarText"),
					name: this.task ? this.task.calendarIdField: c.calendarIdField,
					value: this.task && this.task.getCalendarId(true),
					taskStore: this.taskStore,
					task: this.task
				},
				{
					xtype: "schedulingmodefield",
					fieldLabel: e.L("schedulingModeText"),
					name: this.task ? this.task.schedulingModeField: c.schedulingModeField,
					value: this.task && this.task.getSchedulingMode(),
					allowBlank: false,
					taskStore: this.taskStore,
					task: this.task
				},
				{
					xtype: "displayfield",
					fieldLabel: this.L("wbsCodeText"),
					name: "wbsCode",
					value: this.task && this.task.getWBSCode()
				}],
				task: this.task,
				taskStore: this.taskStore
			}));
			a.push(this.advancedForm)
		}
		if (this.showNotes) {
			this.notesEditor = Ext.create("Ext.form.field.HtmlEditor", Ext.apply({
				listeners: {
					afterrender: function(f) {
						d.notesEditor.setValue(d.task.get(d.task.noteField))
					}
				}
			},
			this.notesConfig));
			this.notesPanel = Ext.create("Ext.panel.Panel", {
				border: false,
				layout: "fit",
				items: this.notesEditor
			});
			a.push(this.notesPanel)
		}
		this.tabsConfig = this.tabsConfig || {};
		if (a.length > 1 || this.tabsConfig.items) {
			this.taskForm.title = this.taskForm.title || this.L("generalText");
			if (this.dependencyGrid) {
				this.dependencyGrid.title = this.dependencyGrid.title || this.L("dependencyText")
			}
			if (this.assignmentGrid) {
				this.assignmentGrid.title = this.assignmentGrid.title || this.L("resourcesText")
			}
			if (this.advancedForm) {
				this.advancedForm.title = this.advancedForm.title || this.L("advancedText")
			}
			if (this.notesPanel) {
				this.notesPanel.title = this.notesPanel.title || this.L("notesText")
			}
			if (this.styleForm) {
				this.styleForm.title = this.styleForm.title || this.stylingText
			}
			if (this.tabsConfig.items) {
				a.push.apply(a, Ext.isArray(this.tabsConfig.items) ? this.tabsConfig.items: [this.tabsConfig.items]);
				delete this.tabsConfig.items
			}
			this.tabs = new Ext.tab.Panel(Ext.apply({
				border: false,
				items: a,
				plain: true,
				defaults: {
					margin: 5,
					border: false
				}
			},
			this.tabsConfig))
		}
		this.items = this.tabs || this.taskForm;
		this.callParent(arguments)
	},
	loadTask: function(c) {
		if (!c) {
			return
		}
		this.task = c;
		var d = this.taskForm;
		d.setSuppressTaskUpdate(true);
		d.getForm().reset();
		if (this.assignmentGrid) {
			var b = c.copy();
			b.taskStore = Ext.apply({},
			c.taskStore);
			d.loadRecord(c, b)
		} else {
			d.loadRecord(c)
		}
		if (this.advancedForm) {
			this.advancedForm.setSuppressTaskUpdate(true);
			var e = this.advancedForm.getForm();
			e.reset();
			this.advancedForm.loadRecord(c, d.taskBuffer);
			var g = e.findField("wbsCode");
			if (g) {
				g.setValue(c.getWBSCode())
			}
			this.advancedForm.setSuppressTaskUpdate(false)
		}
		d.setSuppressTaskUpdate(false);
		if (this.styleForm) {
			this.styleForm.loadRecord(c)
		}
		if (this.notesEditor) {
			this.notesEditor.setValue(c.get(c.noteField))
		}
		var f = this.assignmentGrid;
		if (f) {
			d.taskBuffer.taskStore.setAssignmentStore(f.store);
			d.taskBuffer.taskStore.setResourceStore(f.resourceDupStore);
			f.store.taskStore = d.taskBuffer.taskStore;
			f.resourceDupStore.taskStore = d.taskBuffer.taskStore;
			f.loadResources();
			f.loadTaskAssignments(c.getId() || c.getPhantomId())
		}
		var a = this.dependencyGrid;
		if (a) {
			if (this.allowParentTaskDependencies || c.isLeaf()) {
				a.tab.show();
				a.loadDependencies(c)
			} else {
				a.tab.hide()
			}
		}
		this.fireEvent("loadtask", this, c)
	},
	getActiveTab: function() {
		return this.tabs && this.tabs.getActiveTab()
	},
	setActiveTab: function(a) {
		return this.tabs && this.tabs.setActiveTab(a)
	},
	getTabByComponent: function(b) {
		if (!this.tabs) {
			return
		}
		var a;
		this.tabs.items.each(function(c) {
			if (b === c || b.isDescendantOf(c)) {
				a = c;
				return false
			}
		},
		this);
		return a
	},
	validate: function() {
		var b = this.getActiveTab(),
		a = true,
		c;
		if (b) {
			if (!this.taskForm.isValid()) {
				if (this.taskForm === b || this.taskForm.isDescendantOf(b)) {
					return false
				}
				a = false;
				c = this.getTabByComponent(this.taskForm)
			}
			if (this.dependencyGrid && !this.dependencyGrid.isValid()) {
				if (this.dependencyGrid === b || this.dependencyGrid.isDescendantOf(b)) {
					return false
				}
				a = false;
				c = c || this.getTabByComponent(this.dependencyGrid)
			}
			if (this.assignmentGrid && !this.assignmentGrid.isValid()) {
				if (this.assignmentGrid === b || this.assignmentGrid.isDescendantOf(b)) {
					return false
				}
				a = false;
				c = c || this.getTabByComponent(this.assignmentGrid)
			}
			if (this.advancedForm && !this.advancedForm.isValid()) {
				if (this.advancedForm === b || this.advancedForm.isDescendantOf(b)) {
					return false
				}
				a = false;
				c = c || this.getTabByComponent(this.advancedForm)
			}
		}
		if (c) {
			this.setActiveTab(c)
		}
		return (this.fireEvent("validate", this, c) !== false) && a
	},
	updateTask: function() {
		var a = Ext.Function.bind(function() {
			this.taskForm.updateRecord();
			if (this.advancedForm) {
				this.advancedForm.updateRecord()
			}
			if (this.notesEditor) {
				this.task.set(this.task.noteField, this.notesEditor.getValue())
			}
			if (this.styleForm) {
				this.styleForm.getForm().updateRecord()
			}
			if (this.assignmentGrid) {
				this.assignmentGrid.saveTaskAssignments()
			}
			if (this.dependencyGrid) {
				this.dependencyGrid.saveDependencies()
			}
			this.fireEvent("afterupdatetask", this)
		},
		this);
		if (this.fireEvent("beforeupdatetask", this, a) !== false) {
			a();
			return true
		}
		return false
	}
});
Ext.define("Gnt.plugin.TaskEditor", {
	extend: "Ext.window.Window",
	requires: ["Ext.window.MessageBox", "Gnt.widget.taskeditor.TaskEditor"],
	alias: "plugin.gantt_taskeditor",
	mixins: ["Ext.AbstractPlugin", "Gnt.mixin.Localizable"],
	lockableScope: "top",
	panelConfig: null,
	height: 340,
	width: 600,
	layout: "fit",
	triggerEvent: "taskdblclick",
	closeAction: "hide",
	modal: true,
	gantt: null,
	assignmentStore: null,
	resourceStore: null,
	taskStore: null,
	constructor: function(a) {
		a = a || {};
		Ext.apply(this, a);
		this.title = this.L("title");
		if (!a.buttons) {
			this.buttons = [{
				text: this.L("cancelText"),
				btnType : 'warning',
				handler: this.close,
				scope: this
			}, {
				text: this.L("okText"),
				btnType : 'success',
				handler: function() {
					this.completeEditing() || Ext.Msg.alert(this.L("alertCaption"), this.L("alertText"))
				},
				scope: this
			}]
		}
		this.callParent(arguments);
		this.addCls("gnt-taskeditor-window")
	},
	init: function(d) {
		this.assignmentStore = this.assignmentStore || d.getAssignmentStore();
		this.resourceStore = this.resourceStore || d.getResourceStore();
		this.taskStore = this.taskStore || d.getTaskStore();
		var b = {
			width: null,
			height: null,
			border: false
		},
		e = ["l10n", "task", "taskStore", "assignmentStore", "resourceStore", "generalText", "resourcesText", "dependencyText", "addDependencyText", "dropDependencyText", "notesText", "advancedText", "wbsCodeText", "addAssignmentText", "dropAssignmentText", "showAssignmentGrid", "showDependencyGrid", "allowParentTaskDependencies", "showNotes", "showStyle", "showAdvancedForm", "taskFormClass", "advancedFormClass", "tabsConfig", "taskFormConfig", "dependencyGridConfig", "assignmentGridConfig", "advancedFormConfig", "styleFormConfig"];
		for (var c = 0, a = e.length; c < a; c++) {
			if (this[e[c]] !== undefined) {
				b[e[c]] = this[e[c]]
			}
		}
		b.showBaseline = d.enableBaseline;
		Ext.apply(b, this.panelConfig);
		this.taskEditor = Ext.create("Gnt.widget.taskeditor.TaskEditor", b);
		this.add(this.taskEditor);
		this.relayEvents(this.taskEditor, ["validate", "beforeupdatetask", "afterupdatetask", "loadtask"]);
		d.on(this.triggerEvent, this.onTriggerEvent, this);
		d.on("destroy", this.destroy, this);
		this.gantt = d;
		d.taskEditor = this
	},
	destroy: function() {
		this.taskEditor.destroy();
		this.callParent(arguments)
	},
	onTriggerEvent: function(b, a) {
		this.showTask(a)
	},
	showTask: function(a) {
		if (this.taskEditor && a) {
			this.taskEditor.loadTask(a);
			this.show()
		}
	},
	validate: function() {
		if (this.taskEditor) {
			return this.taskEditor.validate()
		}
	},
	completeEditing: function() {
		if (this.taskEditor) {
			if (!this.taskEditor.validate()) {
				return false
			}
			if (this.taskEditor.updateTask()) {
				this.hide();
				return true
			}
			return false
		}
	},
	updateTask: function() {
		if (this.taskEditor) {
			return this.taskEditor.updateTask()
		}
	}
});
Ext.define("Gnt.column.Dependency", {
	extend: "Ext.grid.column.Column",
	requires: ["Gnt.field.Dependency"],
	separator: ";",
	type: "predecessors",
	field: null,
	constructor: function(a) {
		a = a || {};
		var b = a.field || a.editor;
		delete a.field;
		delete a.editor;
		Ext.apply(this, a);
		a.editor = b || Ext.create("Gnt.field.Dependency", {
			type: this.type,
			separator: this.separator
		});
		if (! (a.editor instanceof Gnt.widget.DependencyField)) {
			a.editor = Ext.ComponentManager.create(a.editor, "dependencyfield")
		}
		a.field = a.editor;
		this.scope = this;
		this.callParent([a])
	},
	afterRender: function() {
		var a = this.up("ganttpanel");
		a.registerLockedDependencyListeners();
		this.callParent(arguments)
	},//TODO
	renderer: function(value, meta, rec, rowIdx, colIdx, store) {
		if (!rec.isEditable(this.dataIndex)) {
			meta.tdCls = (meta.tdCls || "") + " sch-column-readonly"
		}
		
		var str = this.field.getDisplayValue(rec);
		
		if (Ext.isEmpty(str)) return '';
		
		var arr = [];
		Ext.each(str.split(this.separator), function(id) {
			var r = store.getById(parseInt(id));
			if (r != null) arr.push(r.get('fakeId'));
		});
		return arr.join(this.separator);
	}
});
Ext.define("Gnt.column.Successor", {
	extend: "Gnt.column.Dependency",
	mixins: ["Gnt.mixin.Localizable"],
	alias: "widget.successorcolumn",
	type: "successors",
	constructor: function(a) {
		a = a || {};
		this.text = a.text || this.L("text");
		this.callParent(arguments)
	}
});
Ext.define("Gnt.column.Predecessor", {
	extend: "Gnt.column.Dependency",
	mixins: ["Gnt.mixin.Localizable"],
	alias: "widget.predecessorcolumn",
	type: "predecessors",
	constructor: function(a) {
		a = a || {};
		this.text = a.text || this.L("text");
		this.callParent(arguments);
	}
});
Ext.define("Gnt.column.Duration", {
	extend: "Ext.grid.column.Column",
	alias: "widget.durationcolumn",
	requires: ["Gnt.field.Duration"],
	mixins: ["Gnt.mixin.Localizable"],
	width: 80,
	align: "left",
	decimalPrecision: 2,
	useAbbreviation: false,
	instantUpdate: true,
	field: null,
	constructor: function(a) {
		a = a || {};
		this.text = a.text || this.L("text");
		var b = a.field || a.editor;
		delete a.field;
		delete a.editor;
		Ext.apply(this, a);
		a.editor = b || Ext.create("Gnt.field.Duration", {
			useAbbreviation: this.useAbbreviation,
			decimalPrecision: this.decimalPrecision,
			instantUpdate: this.instantUpdate
		});
		if (! (a.editor instanceof Gnt.field.Duration)) {
			Ext.applyIf(a.editor, {
				instantUpdate: this.instantUpdate
			});
			a.editor = Ext.ComponentManager.create(a.editor, "durationfield")
		}
		this.field = a.editor;
		this.scope = this;
		this.hasCustomRenderer = true;
		this.callParent([a])
	},
	afterRender: function() {
		var a = this.up("treepanel");
		if (!this.dataIndex) {
			this.dataIndex = a.store.model.prototype[this.field.taskField]
		}
		this.callParent(arguments)
	},
	renderer: function(b, d, a) {
		if (!Ext.isNumber(b)) {
			return ""
		}
		if (!a.isEditable(this.dataIndex)) {
			d.tdCls = (d.tdCls || "") + " sch-column-readonly"
		}
		var c = a.getDurationUnit();
		return this.field.valueToVisible(b, c)
	}
});
Ext.define("Gnt.column.Effort", {
	extend: "Gnt.column.Duration",
	alias: "widget.effortcolumn",
	requires: ["Gnt.field.Effort"],
	width: 80,
	align: "left",
	decimalPrecision: 2,
	field: null,
	constructor: function(a) {
		a = a || {};
		this.text = a.text || this.L("text");
		var b = a.field || a.editor;
		delete a.field;
		delete a.editor;
		Ext.apply(this, a);
		a.editor = b || Ext.create("Gnt.field.Effort", {
			useAbbreviation: this.useAbbreviation,
			decimalPrecision: this.decimalPrecision,
			getDurationMethod: null,
			instantUpdate: this.instantUpdate
		});
		if (! (a.editor instanceof Gnt.field.Effort)) {
			Ext.applyIf(a.editor, {
				useAbbreviation: this.useAbbreviation,
				decimalPrecision: this.decimalPrecision,
				getDurationMethod: null,
				instantUpdate: this.instantUpdate
			});
			a.editor = Ext.ComponentManager.create(a.editor, "effortfield")
		}
		this.field = a.editor;
		this.scope = this;
		this.hasCustomRenderer = true;
		this.callParent([a])
	},
	afterRender: function() {
		var a = this.up("treepanel");
		if (!this.dataIndex) {
			this.dataIndex = a.store.model.prototype[this.field.taskField]
		}
		this.callParent(arguments)
	},
	renderer: function(c, d, a) {
		if (!Ext.isNumber(c)) {
			return ""
		}
		if (!a.isEditable(this.dataIndex)) {
			d.tdCls = (d.tdCls || "") + " sch-column-readonly"
		}
		var b = a.getEffortUnit();
		return this.field.valueToVisible(c, b)
	}
});
Ext.define("Gnt.widget.Calendar", {
	extend: "Ext.picker.Date",
	alias: "widget.ganttcalendar",
	requires: ["Gnt.data.Calendar", "Sch.util.Date"],
	mixins: ["Gnt.mixin.Localizable"],
	calendar: null,
	startDate: null,
	endDate: null,
	initComponent: function() {
		if (!this.calendar) {
			Ext.Error.raise('Required attribute "calendar" missing during initialization of `Gnt.widget.Calendar`')
		}
		if (!this.startDate) {
			Ext.Error.raise('Required attribute "startDate" missing during initialization of `Gnt.widget.Calendar`')
		}
		if (!this.endDate) {
			this.endDate = Sch.util.Date.add(this.startDate, Sch.util.Date.MONTH, 1)
		}
		this.setCalendar(this.calendar);
		this.minDate = this.value = this.startDate;
		this.callParent(arguments);
		this.injectDates()
	},
	injectDates: function() {
		var a = this;
		var b = a.disabledDates = [];
		Ext.each(a.calendar.getHolidaysRanges(a.startDate, a.endDate),
		function(c) {
			c.forEachDate(function(d) {
				b.push(Ext.Date.format(d, a.format))
			})
		});
		a.setDisabledDates(b)
	},
	setCalendar: function(b) {
		var a = {
			update: this.injectDates,
			remove: this.injectDates,
			add: this.injectDates,
			load: this.injectDates,
			clear: this.injectDates,
			scope: this
		};
		if (this.calendar) {
			this.calendar.un(a)
		}
		this.calendar = b;
		b.on(a)
	}
});
Ext.define("Gnt.widget.calendar.ResourceCalendarGrid", {
	extend: "Ext.grid.Panel",
	requires: ["Gnt.data.Calendar", "Sch.util.Date"],
	mixins: ["Gnt.mixin.Localizable"],
	alias: "widget.resourcecalendargrid",
	resourceStore: null,
	calendarStore: null,
	initComponent: function() {
		var a = this;
		this.calendarStore = this.calendarStore || Ext.create("Ext.data.Store", {
			fields: ["Id", "Name"]
		});
		Ext.apply(a, {
			store: a.resourceStore,
			columns: [{
				header: this.L("name"),
				dataIndex: "Name",
				flex: 1
			},
			{
				header: this.L("calendar"),
				dataIndex: "CalendarId",
				flex: 1,
				renderer: function(f, h, b, e, d, c) {
					if (!f) {
						var g = b.getCalendar();
						f = g ? g.calendarId: ""
					}
					var i = a.calendarStore.getById(f);
					return i ? i.get("Name") : f
				},
				editor: {
					xtype: "combobox",
					store: a.calendarStore,
					queryMode: "local",
					displayField: "Name",
					valueField: "Id",
					editable: false,
					allowBlank: false
				}
			}],
			border: true,
			height: 180,
			plugins: Ext.create("Ext.grid.plugin.CellEditing", {
				clicksToEdit: 2
			})
		});
		this.calendarStore.loadData(this.getCalendarData());
		this.callParent(arguments)
	},
	getCalendarData: function() {
		var a = [];
		Ext.Array.each(Gnt.data.Calendar.getAllCalendars(),
		function(b) {
			a.push({
				Id: b.calendarId,
				Name: b.name || b.calendarId
			})
		});
		return a
	}
});
Ext.define("Gnt.widget.calendar.AvailabilityGrid", {
	extend: "Ext.grid.Panel",
	requires: ["Ext.Button", "Ext.data.Store", "Ext.grid.plugin.CellEditing", "Ext.MessageBox", "Gnt.data.Calendar", "Sch.util.Date"],
	mixins: ["Gnt.mixin.Localizable"],
	alias: "widget.calendaravailabilitygrid",
	calendarDay: null,
	height: 160,
	addButton: null,
	removeButton: null,
	maxIntervalsNum: 5,
	initComponent: function() {
		Ext.applyIf(this, {
			store: new Ext.data.Store({
				fields: ["startTime", "endTime"],
				data: this.calendarDay.getAvailability()
			}),
			plugins: [new Ext.grid.plugin.CellEditing({
				clicksToEdit: 2
			})],
			tbar: this.buildToolbar(),
			columns: [{
				xtype: "datecolumn",
				header: this.L("startText"),
				format: "g:i a",
				dataIndex: "startTime",
				flex: 1,
				editor: {
					xtype: "timefield",
					allowBlank: false,
					initDate: "31/12/1899"
				}
			},
			{
				xtype: "datecolumn",
				header: this.L("endText"),
				format: "g:i a",
				dataIndex: "endTime",
				flex: 1,
				editor: {
					xtype: "timefield",
					allowBlank: false,
					initDate: "31/12/1899"
				}
			}],
			listeners: {
				selectionchange: this.onAvailabilityGridSelectionChange,
				scope: this
			}
		});
		this.callParent(arguments)
	},
	buildToolbar: function() {
		this.addButton = new Ext.Button({
			text: this.L("addText"),
			iconCls: "gnt-action-add",
			handler: this.addAvailability,
			scope: this
		});
		this.removeButton = new Ext.Button({
			text: this.L("removeText"),
			iconCls: "gnt-action-remove",
			handler: this.removeAvailability,
			scope: this,
			disabled: true
		});
		return [this.addButton, this.removeButton]
	},
	onAvailabilityGridSelectionChange: function(a) {
		this.removeButton.setDisabled(!a || a.getSelection().length === 0)
	},
	setAvailability: function(a) {
		this.store.loadData(a);
		this.addButton.setDisabled(this.store.getCount() >= this.maxIntervalsNum)
	},
	addAvailability: function() {
		var a = this.getStore(),
		b = a.count();
		if (b >= this.maxIntervalsNum) {
			return
		}
		a.add({
			startTime: new Date(0, 0, 0, 12, 0),
			endTime: new Date(0, 0, 0, 13, 0)
		});
		if (b + 1 >= this.maxIntervalsNum && this.addButton) {
			this.addButton.disable()
		}
	},
	removeAvailability: function() {
		var a = this.getStore(),
		c = a.getCount(),
		b = this.getSelectionModel().getSelection();
		if (b.length === 0) {
			return
		}
		a.remove(b[0]);
		if (c < this.maxIntervalsNum && this.addButton) {
			this.addButton.enable()
		}
	},
	isValid: function(b) {
		try {
			this.calendarDay.verifyAvailability(this.getIntervals())
		} catch(a) {
			if (!b) {
				Ext.MessageBox.show({
					title: this.L("error"),
					msg: a,
					modal: true,
					icon: Ext.MessageBox.ERROR,
					buttons: Ext.MessageBox.OK
				})
			}
			return false
		}
		return true
	},
	extractTimeFromDate: function(a) {
		return new Date(0, 0, 0, a.getHours(), a.getMinutes(), a.getSeconds())
	},
	getIntervals: function() {
		var a = [];
		var b = this;
		this.getStore().each(function(c) {
			a.push({
				startTime: b.extractTimeFromDate(c.get("startTime")),
				endTime: b.extractTimeFromDate(c.get("endTime"))
			})
		});
		return a
	}
});
Ext.define("Gnt.widget.calendar.DayEditor", {
	extend: "Gnt.widget.calendar.AvailabilityGrid",
	requires: ["Ext.grid.plugin.CellEditing", "Gnt.data.Calendar", "Sch.util.Date"],
	mixins: ["Gnt.mixin.Localizable"],
	alias: "widget.calendardayeditor",
	height: 160,
	initComponent: function() {
		var a = this.calendarDay.getIsWorkingDay();
		Ext.applyIf(this, {
			dockedItems: [{
				xtype: "radiogroup",
				dock: "top",
				name: "dayType",
				padding: "0 5px",
				margin: 0,
				items: [{
					boxLabel: this.L("workingTimeText"),
					name: "IsWorkingDay",
					inputValue: true,
					checked: a
				},
				{
					boxLabel: this.L("nonworkingTimeText"),
					name: "IsWorkingDay",
					inputValue: false,
					checked: !a
				}],
				listeners: {
					change: this.onDayTypeChanged,
					scope: this
				}
			}]
		});
		this.on("viewready", this.applyState, this);
		this.callParent(arguments)
	},
	getDayTypeRadioGroup: function() {
		return this.down('radiogroup[name="dayType"]')
	},
	applyState: function() {
		if (!this.isWorkingDay()) {
			this.getView().disable();
			this.addButton.disable()
		}
	},
	onDayTypeChanged: function(a) {
		var b = a.getValue();
		if (Ext.isArray(b.IsWorkingDay)) {
			return
		}
		this.getView().setDisabled(!b.IsWorkingDay);
		this.addButton.setDisabled(!b.IsWorkingDay || this.getStore().getCount() >= this.maxIntervalsNum)
	},
	isWorkingDay: function() {
		return this.getDayTypeRadioGroup().getValue().IsWorkingDay
	},
	isValid: function() {
		if (this.isWorkingDay()) {
			return this.callParent()
		}
		return true
	},
	getIntervals: function() {
		if (!this.isWorkingDay()) {
			return []
		}
		return this.callParent()
	}
});
Ext.define("Gnt.widget.calendar.WeekEditor", {
	extend: "Ext.form.Panel",
	requires: ["Ext.grid.Panel", "Gnt.data.Calendar", "Sch.util.Date", "Gnt.widget.calendar.AvailabilityGrid"],
	mixins: ["Gnt.mixin.Localizable"],
	alias: "widget.calendarweekeditor",
	weekName: null,
	startDate: null,
	endDate: null,
	weekAvailability: null,
	calendarWeekAvailability: null,
	defaultWeekAvailability: null,
	backupWeekAvailability: null,
	layout: "anchor",
	defaults: {
		border: false,
		anchor: "100%"
	},
	currentDayIndex: null,
	_weekDaysGrid: null,
	_availabilityGrid: null,
	initComponent: function() {
		this.backupWeekAvailability = [];
		this.items = [{
			xtype: "radiogroup",
			padding: "0 5px",
			name: "dayType",
			items: [{
				boxLabel: this.L("defaultTimeText"),
				name: "IsWorkingDay",
				inputValue: 0
			},
			{
				boxLabel: this.L("workingTimeText"),
				name: "IsWorkingDay",
				inputValue: 1
			},
			{
				boxLabel: this.L("nonworkingTimeText"),
				name: "IsWorkingDay",
				inputValue: 2
			}],
			listeners: {
				change: this.onDayTypeChanged,
				scope: this
			}
		},
		{
			layout: "column",
			padding: "0 0 5px 0",
			defaults: {
				border: false
			},
			items: [{
				margin: "0 10px 0 5px",
				columnWidth: 0.5,
				items: this.getWeekDaysGrid()
			},
			{
				columnWidth: 0.5,
				margin: "0 5px 0 0",
				items: this.getAvailabilityGrid()
			}]
		}];
		this.callParent(arguments)
	},
	getWeekDaysGrid: function() {
		if (this._weekDaysGrid != null) {
			return this._weekDaysGrid
		}
		var a = Ext.Date.dayNames;
		return this._weekDaysGrid = new Ext.grid.Panel({
			hideHeaders: true,
			height: 160,
			columns: [{
				header: "",
				dataIndex: "name",
				flex: 1
			}],
			store: new Ext.data.Store({
				fields: ["id", "name"],
				idProperty: "id",
				data: [{
					id: 1,
					name: a[1]
				},
				{
					id: 2,
					name: a[2]
				},
				{
					id: 3,
					name: a[3]
				},
				{
					id: 4,
					name: a[4]
				},
				{
					id: 5,
					name: a[5]
				},
				{
					id: 6,
					name: a[6]
				},
				{
					id: 0,
					name: a[0]
				}]
			}),
			listeners: {
				viewready: this.onWeekDaysListViewReady,
				selectionchange: this.onWeekDaysListSelectionChange,
				beforeselect: this.onWeekDaysListBeforeSelect,
				scope: this
			}
		})
	},
	getAvailabilityGrid: function() {
		if (!this._availabilityGrid) {
			this._availabilityGrid = new Gnt.widget.calendar.AvailabilityGrid({
				calendarDay: new Gnt.model.CalendarDay()
			})
		}
		return this._availabilityGrid
	},
	getDayTypeRadioGroup: function() {
		if (!this.dayTypeRadioGroup) {
			this.dayTypeRadioGroup = this.down('radiogroup[name="dayType"]')
		}
		return this.dayTypeRadioGroup
	},
	getWeekAvailability: function() {
		return this.weekAvailability
	},
	onWeekDaysListViewReady: function() {
		var b = this.getWeekDaysGrid(),
		a = b.getStore().getAt(0);
		this.currentDayIndex = a.getId();
		this.readFromData();
		b.getSelectionModel().select(a, false, true)
	},
	onWeekDaysListBeforeSelect: function() {
		if (!this.saveToData()) {
			return false
		}
	},
	applyChanges: function(e) {
		if (!this.saveToData()) {
			return false
		}
		var b = this.weekAvailability;
		var d = false;
		for (var c = 0; c < 7; c++) {
			var a = b[c];
			if (a) {
				d = true
			}
			if (!a) {
				e[c] = null
			}
			if (a && !e[c]) {
				e[c] = a
			}
			if (a && e[c]) {
				e[c].setIsWorkingDay(a.getIsWorkingDay());
				e[c].setAvailability(a.getAvailability())
			}
		}
		if (!d) {
			Ext.MessageBox.show({
				title: this.L("error"),
				msg: this.L("noOverrideError"),
				modal: true,
				icon: Ext.MessageBox.ERROR,
				buttons: Ext.MessageBox.OK
			});
			return false
		}
		return true
	},
	onWeekDaysListSelectionChange: function(a, b) {
		this.currentDayIndex = b[0].getId();
		this.readFromData()
	},
	getCurrentTypeOfWeekDay: function(a) {
		return this.weekAvailability[a] ? (this.weekAvailability[a].getIsWorkingDay() ? 1: 2) : 0
	},
	getCurrentWeekDay: function(a) {
		return this.weekAvailability[a] || this.calendarWeekAvailability[a] || this.defaultWeekAvailability[a]
	},
	saveToData: function() {
		var c = this.currentDayIndex;
		var d = this.getDayTypeRadioGroup().getValue().IsWorkingDay;
		var a = this.weekAvailability;
		if (d === 0) {
			a[c] = null;
			return true
		}
		var b = this.getAvailabilityGrid();
		if (d == 1) {
			if (!b.isValid()) {
				return false
			}
			if (!a[c]) {
				a[c] = this.copyDefaultWeekDay(c)
			}
			a[c].setIsWorkingDay(true);
			a[c].setAvailability(b.getIntervals());
			this.backupWeekAvailability[c] = null;
			return true
		}
		if (!a[c]) {
			a[c] = this.copyDefaultWeekDay(c)
		}
		a[c].setIsWorkingDay(false);
		a[c].setAvailability([]);
		return true
	},
	copyDefaultWeekDay: function(a) {
		var b = (this.calendarWeekAvailability[a] || this.defaultWeekAvailability[a]).copy();
		b.setType("WEEKDAYOVERRIDE");
		b.setOverrideStartDate(this.startDate);
		b.setOverrideEndDate(this.endDate);
		b.setName(this.weekName);
		return b
	},
	readFromData: function(b) {
		var a = this.getCurrentWeekDay(this.currentDayIndex);
		var d = this.getCurrentTypeOfWeekDay(this.currentDayIndex);
		var c = this.getAvailabilityGrid();
		c.setAvailability(b || a.getAvailability());
		var e = this.getDayTypeRadioGroup();
		e.suspendEvents();
		e.setValue({
			IsWorkingDay: [d]
		});
		e.resumeEvents();
		c.setDisabled(d != 1)
	},
	onDayTypeChanged: function(d, b, a) {
		var g = d.getValue();
		if (g.IsWorkingDay == null || Ext.isArray(g.IsWorkingDay)) {
			return
		}
		var e = this.weekAvailability;
		var f = this.backupWeekAvailability;
		var h = this.currentDayIndex;
		var c = this.getAvailabilityGrid();
		var i;
		if (a.IsWorkingDay == 1) {
			f[h] = c.getIntervals()
		}
		switch (g.IsWorkingDay) {
		case 0:
			e[h] = null;
			break;
		case 1:
			if (!e[h]) {
				e[h] = this.copyDefaultWeekDay(h)
			}
			i = f[h];
			e[h].setIsWorkingDay(true);
			break;
		case 2:
			if (!e[h]) {
				e[h] = this.copyDefaultWeekDay(h)
			}
			e[h].setAvailability([]);
			e[h].setIsWorkingDay(false);
			break;
		default:
			throw "Unrecognized day type"
		}
		this.readFromData(i)
	}
});
Ext.define("Gnt.widget.calendar.DatePicker", {
	extend: "Ext.picker.Date",
	alias: "widget.gntdatepicker",
	workingDayCls: "gnt-datepicker-workingday",
	nonWorkingDayCls: "gnt-datepicker-nonworkingday",
	overriddenDayCls: "gnt-datepicker-overriddenday",
	overriddenWeekDayCls: "gnt-datepicker-overriddenweekday",
	weekOverridesStore: null,
	dayOverridesCalendar: null,
	update: function() {
		this.callParent(arguments);
		this.refreshCssClasses()
	},
	refreshCssClasses: function() {
		var d = this,
		b = d.cells.elements;
		this.removeCustomCls();
		for (var c = 0; c < d.numDays; c++) {
			var a = b[c].firstChild.dateValue;
			b[c].className += " " + this.getDateCls(new Date(a))
		}
	},
	getDateCls: function(e) {
		var b = "";
		if (e.getMonth() !== this.getActive().getMonth()) {
			return
		}
		var c = this.dayOverridesCalendar;
		if (c.getOwnCalendarDay(e)) {
			b += " " + this.overriddenDayCls;
			if (!c.isWorkingDay(e)) {
				b += " " + this.nonWorkingDayCls
			}
		} else {
			var f = null;
			this.weekOverridesStore.each(function(g) {
				if (Ext.Date.between(e, g.get("startDate"), g.get("endDate"))) {
					f = g;
					return false
				}
			});
			if (f) {
				b += " " + this.overriddenWeekDayCls;
				var d = e.getDay(),
				a = f.get("weekAvailability");
				if (a && a[d] && !a[d].getIsWorkingDay()) {
					b += " " + this.nonWorkingDayCls
				}
			} else {
				if (!c.isWorkingDay(e)) {
					b += " " + this.nonWorkingDayCls
				}
			}
		}
		return b || this.workingDayCls
	},
	removeCustomCls: function() {
		this.cells.removeCls([this.overriddenDayCls, this.nonWorkingDayCls, this.workingDayCls, this.overriddenWeekDayCls])
	}
});
Ext.define("Gnt.widget.calendar.Calendar", {
	extend: "Ext.form.Panel",
	requires: ["Ext.XTemplate", "Ext.data.Store", "Ext.grid.Panel", "Ext.grid.plugin.CellEditing", "Gnt.data.Calendar", "Gnt.widget.calendar.DayEditor", "Gnt.widget.calendar.WeekEditor", "Gnt.widget.calendar.DatePicker"],
	mixins: ["Gnt.mixin.Localizable"],
	alias: "widget.calendar",
	defaults: {
		padding: 10,
		border: false
	},
	workingDayCls: "gnt-datepicker-workingday",
	nonWorkingDayCls: "gnt-datepicker-nonworkingday",
	overriddenDayCls: "gnt-datepicker-overriddenday",
	overriddenWeekDayCls: "gnt-datepicker-overriddenweekday",
	calendar: null,
	dayGridConfig: null,
	weekGridConfig: null,
	datePickerConfig: null,
	dayGrid: null,
	weekGrid: null,
	datePicker: null,
	legendTpl: '<ul class="gnt-calendar-legend"><li class="gnt-calendar-legend-item"><div class="gnt-calendar-legend-itemstyle {workingDayCls}"></div><span class="gnt-calendar-legend-itemname">{workingDayText}</span><div style="clear: both"></div></li><li><div class="gnt-calendar-legend-itemstyle {nonWorkingDayCls}"></div><span class="gnt-calendar-legend-itemname">{weekendsText}</span><div style="clear: both"></div></li><li class="gnt-calendar-legend-override"><div class="gnt-calendar-legend-itemstyle {overriddenDayCls}">31</div><span class="gnt-calendar-legend-itemname">{overriddenDayText}</span><div style="clear: both"></div></li><li class="gnt-calendar-legend-override"><div class="gnt-calendar-legend-itemstyle {overriddenWeekDayCls}">31</div><span class="gnt-calendar-legend-itemname">{overriddenWeekText}</span><div style="clear: both"></div></li></ul>',
	dateInfoTpl: null,
	dayOverridesCalendar: null,
	weekOverridesStore: null,
	copiesIndexByOriginalId: null,
	getDayGrid: function() {
		if (!this.dayGrid) {
			var a = this.calendar.model.prototype;
			this.dayGrid = new Ext.grid.Panel(Ext.apply({
				title: this.L("dayOverridesText"),
				tbar: [{
					text: this.L("addText"),
					action: "add",
					iconCls: "gnt-action-add",
					handler: this.addDay,
					scope: this
				},
				{
					text: this.L("editText"),
					action: "edit",
					iconCls: "gnt-action-edit",
					handler: this.editDay,
					scope: this
				},
				{
					text: this.L("removeText"),
					action: "remove",
					iconCls: "gnt-action-remove",
					handler: this.removeDay,
					scope: this
				}],
				store: new Gnt.data.Calendar(),
				plugins: [new Ext.grid.plugin.CellEditing({
					clicksToEdit: 2
				})],
				columns: [{
					header: this.L("dayOverrideNameHeaderText"),
					dataIndex: a.nameField,
					flex: 1,
					editor: {
						allowBlank: false
					}
				},
				{
					header: this.L("dateText"),
					dataIndex: a.dateField,
					width: 100,
					xtype: "datecolumn",
					editor: {
						xtype: "datefield"
					}
				}]
			},
			this.dayGridConfig || {}));
			this.dayOverridesCalendar = this.dayGrid.store
		}
		return this.dayGrid
	},
	getWeekGrid: function() {
		if (!this.weekGrid) {
			this.weekGrid = new Ext.grid.Panel(Ext.apply({
				title: this.L("weekOverridesText"),
				border: true,
				plugins: [new Ext.grid.plugin.CellEditing({
					clicksToEdit: 2
				})],
				store: new Ext.data.Store({
					fields: ["name", "startDate", "endDate", "weekAvailability", "mainDay"]
				}),
				tbar: [{
					text: this.L("addText"),
					action: "add",
					iconCls: "gnt-action-add",
					handler: this.addWeek,
					scope: this
				},
				{
					text: this.L("editText"),
					action: "edit",
					iconCls: "gnt-action-edit",
					handler: this.editWeek,
					scope: this
				},
				{
					text: this.L("removeText"),
					action: "remove",
					iconCls: "gnt-action-remove",
					handler: this.removeWeek,
					scope: this
				}],
				columns: [{
					header: this.L("overrideName"),
					dataIndex: "name",
					flex: 1,
					editor: {
						allowBlank: false
					}
				},
				{
					xtype: "datecolumn",
					header: this.L("startDate"),
					dataIndex: "startDate",
					width: 100,
					editor: {
						xtype: "datefield"
					}
				},
				{
					xtype: "datecolumn",
					header: this.L("endDate"),
					dataIndex: "endDate",
					width: 100,
					editor: {
						xtype: "datefield"
					}
				}]
			},
			this.weekGridConfig || {}));
			this.weekOverridesStore = this.weekGrid.store
		}
		return this.weekGrid
	},
	getDatePicker: function() {
		if (!this.datePicker) {
			this.datePicker = new Gnt.widget.calendar.DatePicker(Ext.apply({
				dayOverridesCalendar: this.getDayGrid().store,
				weekOverridesStore: this.getWeekGrid().store
			},
			this.datePickerConfig))
		}
		return this.datePicker
	},
	initComponent: function() {
		this.copiesIndexByOriginalId = {};
		var d = this;
		d.setupTemplates();
		if (! (this.legendTpl instanceof Ext.Template)) {
			this.legendTpl = new Ext.XTemplate(this.legendTpl)
		}
		if (! (this.dateInfoTpl instanceof Ext.Template)) {
			this.dateInfoTpl = new Ext.XTemplate(this.dateInfoTpl)
		}
		var e = this.calendar;
		if (!e) {
			Ext.Error.raise('Required attribute "calendar" is missed during initialization of `Gnt.widget.Calendar`')
		}
		var b = this.getWeekGrid(),
		a = this.getDayGrid(),
		c = this.getDatePicker();
		a.on({
			selectionchange: this.onDayGridSelectionChange,
			validateedit: this.onDayGridValidateEdit,
			edit: this.onDayGridEdit,
			scope: this
		});
		a.store.on({
			update: this.refreshView,
			remove: this.refreshView,
			add: this.refreshView,
			scope: this
		});
		b.on({
			selectionchange: this.onWeekGridSelectionChange,
			validateedit: this.onWeekGridValidateEdit,
			edit: this.onWeekGridEdit,
			scope: this
		});
		b.store.on({
			update: this.refreshView,
			remove: this.refreshView,
			add: this.refreshView,
			scope: this
		});
		c.on({
			select: this.onDateSelect,
			scope: this
		});
		this.fillDaysStore();
		this.fillWeeksStore();
		this.mon(e, {
			load: this.onCalendarChange,
			add: this.onCalendarChange,
			remove: this.onCalendarChange,
			update: this.onCalendarChange,
			scope: this
		});
		this.dateInfoPanel = new Ext.Panel({
			cls: "gnt-calendar-dateinfo",
			columnWidth: 0.33,
			border: false,
			height: 200
		});
		this.items = [{
			xtype: "container",
			layout: "hbox",
			pack: "start",
			align: "stretch",
			items: [{
				html: Ext.String.format('{0}: "{1}"', this.L("calendarNameText"), e.name),
				border: false,
				flex: 1
			},
			{
				xtype: "combobox",
				name: "cmb_parentCalendar",
				fieldLabel: this.L("parentCalendarText"),
				store: new Ext.data.Store({
					fields: ["Id", "Name"],
					data: [{
						Id: -1,
						Name: this.L("noParentText")
					}].concat(e.getParentableCalendars())
				}),
				queryMode: "local",
				displayField: "Name",
				valueField: "Id",
				editable: false,
				emptyText: this.L("selectParentText"),
				value: e.parent ? e.parent.calendarId: -1,
				flex: 1
			}]
		},
		{
			layout: "column",
			defaults: {
				border: false
			},
			items: [{
				margin: "0 15px 0 0",
				columnWidth: 0.3,
				html: this.legendTpl.apply({
					workingDayText: this.L("workingDayText"),
					weekendsText: this.L("weekendsText"),
					overriddenDayText: this.L("overriddenDayText"),
					overriddenWeekText: this.L("overriddenWeekText"),
					workingDayCls: this.workingDayCls,
					nonWorkingDayCls: this.nonWorkingDayCls,
					overriddenDayCls: this.overriddenDayCls,
					overriddenWeekDayCls: this.overriddenWeekDayCls
				})
			},
			{
				columnWidth: 0.37,
				margin: "0 5px 0 0",
				items: [c]
			},
			this.dateInfoPanel]
		},
		{
			xtype: "tabpanel",
			height: 220,
			items: [a, b]
		}];
		this.callParent(arguments)
	},
	onCalendarChange: function() {
		this.fillDaysStore();
		this.fillWeeksStore();
		this.refreshView()
	},
	setupTemplates: function() {
		var a = this.L("tplTexts");
		this.dateInfoTpl = this.dateInfoTpl || Ext.String.format('<tpl if="isWorkingDay == true"><div>{0} {date}:</div></tpl><tpl if="isWorkingDay == false"><div>{date} {1}</div></tpl><ul class="gnt-calendar-availabilities"><tpl for="availability"><li>{.}</li></tpl></ul><span>{5}: <tpl if="override == true">{2} "{name}" {3} "{calendarName}"</tpl><tpl if="override == false">{4} "{calendarName}"</tpl></span>', a.tplWorkingHours, a.tplIsNonWorking, a.tplOverride, a.tplInCalendar, a.tplDayInCalendar, a.tplBasedOn)
	},
	afterRender: function() {
		this.callParent(arguments);
		this.onDateSelect(this.getDatePicker(), new Date())
	},
	fillDaysStore: function() {
		var a = Gnt.util.Data.cloneModelSet(this.calendar,
		function(b) {
			return (b.getType() == "DAY" && b.getDate())
		});
		this.dayOverridesCalendar.loadData(a)
	},
	copyCalendarDay: function(a) {
		var b = a.copy();
		b.__COPYOF__ = a.internalId;
		this.copiesIndexByOriginalId[a.internalId] = b.internalId;
		return b
	},
	fillWeeksStore: function() {
		var a = this;
		var b = [];
		this.calendar.forEachNonStandardWeek(function(c) {
			var d = Ext.apply({},
			c);
			d.weekAvailability = Ext.Array.map(d.weekAvailability,
			function(e) {
				return e && a.copyCalendarDay(e) || null
			});
			d.mainDay = a.copyCalendarDay(d.mainDay);
			b.push(d)
		});
		this.weekOverridesStore.loadData(b)
	},
	addDay: function() {
		var a = this.getDatePicker().getValue();
		if (this.dayOverridesCalendar.getOwnCalendarDay(a)) {
			this.alert({
				msg: this.L("overrideErrorText")
			});
			return
		}
		var b = Ext.create("Gnt.model.CalendarDay", {
			Name: this.L("newDayName"),
			Type: "DAY",
			Date: a,
			IsWorkingDay: false
		});
		this.dayOverridesCalendar.insert(0, b);
		this.getDayGrid().getSelectionModel().select([b], false, false)
	},
	editDay: function() {
		var e = this,
		c = this.getDayGrid().getSelectionModel().getSelection();
		if (c.length === 0) {
			return
		}
		var a = c[0];
		var b = new Gnt.widget.calendar.DayEditor({
			addText: this.L("addText"),
			removeText: this.L("removeText"),
			workingTimeText: this.L("workingTimeText"),
			nonworkingTimeText: this.L("nonworkingTimeText"),
			calendarDay: a
		});
		var d = Ext.create("Ext.window.Window", {
			title: this.L("dayOverridesText"),
			modal: true,
			width: 280,
			height: 260,
			layout: "fit",
			items: b,
			buttons: [{
				text: this.L("cancelText"),
				btnType : 'warning',
				handler: function() {
					d.close()
				}
			}, {
				text: this.L("okText"),
				btnType : 'success',
				handler: function() {
					if (b.isValid()) {
						var f = b.calendarDay;
						f.setIsWorkingDay(b.isWorkingDay());
						f.setAvailability(b.getIntervals());
						e.applyCalendarDay(f, a);
						e.refreshView();
						d.close()
					}
				}
			}]
		});
		d.show()
	},
	removeDay: function() {
		var a = this.getDayGrid(),
		b = a.getSelectionModel().getSelection();
		if (!b.length) {
			return
		}
		a.getStore().remove(b[0]);
		this.refreshView()
	},
	refreshView: function() {
		var f = this.getDatePicker().getValue(),
		b = this.getCalendarDay(f),
		e = this.getWeekGrid(),
		a = this.getDayGrid(),
		d = this.dayOverridesCalendar.getOwnCalendarDay(f),
		h;
		var c;
		if (d) {
			a.getSelectionModel().select([d], false, true);
			c = d.getName()
		} else {
			h = this.getWeekOverrideByDate(f);
			if (h) {
				e.getSelectionModel().select([h], false, true);
				c = h.get("name")
			}
		}
		var g = {
			name: c || b.getName(),
			date: Ext.Date.format(f, "M j, Y"),
			calendarName: this.calendar.name || this.calendar.calendarId,
			availability: b.getAvailability(true),
			override: Boolean(d || h),
			isWorkingDay: b.getIsWorkingDay()
		};
		this.dateInfoPanel.update(this.dateInfoTpl.apply(g));
		this.datePicker.refreshCssClasses()
	},
	onDayGridSelectionChange: function(b) {
		if (b.getSelection().length === 0) {
			return
		}
		var a = b.getSelection()[0];
		this.getDatePicker().setValue(a.getDate());
		this.refreshView()
	},
	onDayGridEdit: function(b, a) {
		if (a.field === "Date") {
			a.grid.getStore().clearCache();
			this.getDatePicker().setValue(a.value)
		}
		this.refreshView()
	},
	onDayGridValidateEdit: function(b, a) {
		var c = this.getDayGrid().store;
		if (a.field === c.model.prototype.dateField && c.getOwnCalendarDay(a.value) && a.value !== a.originalValue) {
			this.alert({
				msg: this.L("overrideErrorText")
			});
			return false
		}
	},
	onDateSelect: function(b, a) {
		this.refreshView()
	},
	getCalendarDay: function(b) {
		var a = this.dayOverridesCalendar.getOwnCalendarDay(b);
		if (a) {
			return a
		}
		a = this.getWeekOverrideDay(b);
		if (a) {
			return a
		}
		return this.calendar.weekAvailability[b.getDay()] || this.calendar.defaultWeekAvailability[b.getDay()]
	},
	getWeekOverrideDay: function(d) {
		var e = new Date(d),
		b = this.getWeekOverrideByDate(d),
		c = e.getDay();
		if (b == null) {
			return null
		}
		var a = b.get("weekAvailability");
		if (!a) {
			return null
		}
		return a[c]
	},
	getWeekOverrideByDate: function(a) {
		var b = null;
		this.weekOverridesStore.each(function(c) {
			if (Ext.Date.between(a, c.get("startDate"), c.get("endDate"))) {
				b = c;
				return false
			}
		});
		return b
	},
	intersectsWithCurrentWeeks: function(b, d, c) {
		var a = false;
		this.weekOverridesStore.each(function(f) {
			if (f == c) {
				return
			}
			var e = f.get("startDate");
			var g = f.get("endDate");
			if (e <= b && b < g || e < d && d <= g) {
				a = true;
				return false
			}
		});
		return a
	},
	addWeek: function() {
		var c = this.weekOverridesStore;
		var a = this.getDatePicker().getValue();
		var f;
		for (var e = 7; e > 0; e--) {
			f = Sch.util.Date.add(a, Sch.util.Date.DAY, e);
			if (!this.intersectsWithCurrentWeeks(a, f)) {
				break
			}
		}
		if (!e) {
			this.alert({
				msg: Ext.String.format(this.L("overrideDateError"), Ext.Date.format(a, "Y-m-d"))
			});
			return
		}
		var d = new this.calendar.model();
		d.setType("WEEKDAYOVERRIDE");
		d.setName(this.L("newDayName"));
		d.setOverrideStartDate(a);
		d.setOverrideEndDate(f);
		d.setWeekday( - 1);
		var b = c.insert(0, {
			name: this.L("newDayName"),
			startDate: a,
			endDate: f,
			weekAvailability: [],
			mainDay: d
		})[0];
		this.getWeekGrid().getSelectionModel().select([b], false, false)
	},
	editWeek: function() {
		var c = this.getWeekGrid().getSelectionModel().getSelection(),
		e = this;
		if (c.length === 0) {
			return
		}
		var b = c[0];
		var a = new Gnt.widget.calendar.WeekEditor({
			startDate: b.get("startDate"),
			endDate: b.get("endDate"),
			weekName: b.get("name"),
			weekAvailability: b.get("weekAvailability"),
			calendarWeekAvailability: this.calendar.weekAvailability,
			defaultWeekAvailability: this.calendar.defaultWeekAvailability
		});
		var d = Ext.create("Ext.window.Window", {
			title: this.L("weekOverridesText"),
			modal: true,
			width: 370,
			defaults: {
				border: false
			},
			layout: "fit",
			items: a,
			buttons: [{
				text: this.L("cancelText"),
				btnType : 'warning',
				handler: function() {
					d.close()
				}
			}, {
				action: "ok",
				text: this.L("okText"),
				btnType : 'success',
				handler: function() {
					if (a.applyChanges(b.get("weekAvailability"))) {
						e.refreshView();
						d.close()
					}
				}
			}]
		});
		d.show()
	},
	removeWeek: function() {
		var a = this.getWeekGrid().getSelectionModel().getSelection(),
		b = this;
		if (a.length === 0) {
			return
		}
		this.weekOverridesStore.remove(a[0]);
		this.refreshView()
	},
	onWeekGridSelectionChange: function(a) {
		var b = a.getSelection();
		if (b.length === 0) {
			return
		}
		this.getDatePicker().setValue(b[0].get("startDate"))
	},
	onWeekGridEdit: function(d, b) {
		var c = b.record,
		a = c.get("startDate"),
		e = c.get("endDate");
		if (b.field == "startDate" || b.field == "endDate") {
			Ext.Array.each(c.get("weekAvailability").concat(c.get("mainDay")),
			function(f) {
				if (f) {
					f.setOverrideStartDate(a);
					f.setOverrideEndDate(e)
				}
			});
			this.getDatePicker().setValue(a)
		}
		if (b.field == "name") {
			Ext.Array.each(c.get("weekAvailability").concat(c.get("mainDay")),
			function(f) {
				if (f) {
					f.setName(c.get("name"))
				}
			})
		}
		this.refreshView()
	},
	alert: function(a) {
		a = a || {};
		Ext.MessageBox.show(Ext.applyIf(a, {
			title: this.L("error"),
			icon: Ext.MessageBox.WARNING,
			buttons: Ext.MessageBox.OK
		}))
	},
	onWeekGridValidateEdit: function(d, b) {
		var c = b.record,
		a = b.field == "startDate" ? b.value: c.get("startDate"),
		e = b.field == "endDate" ? b.value: c.get("endDate");
		if (a > e) {
			this.alert({
				msg: this.L("startAfterEndError")
			});
			return false
		}
		if (this.intersectsWithCurrentWeeks(a, e, c)) {
			this.alert({
				msg: this.L("weeksIntersectError")
			});
			return false
		}
	},
	applyCalendarDay: function(d, c) {
		c.beginEdit();
		c.setId(d.getId());
		c.setName(d.getName());
		c.setIsWorkingDay(d.getIsWorkingDay());
		c.setDate(d.getDate());
		c.setOverrideStartDate(d.getOverrideStartDate());
		c.setOverrideEndDate(d.getOverrideEndDate());
		var b = d.getAvailability(true);
		var a = c.getAvailability(true);
		if (b + "" != a + "") {
			c.setAvailability(d.getAvailability())
		}
		c.endEdit()
	},
	applySingleDay: function(b, a) {
		if (b.__COPYOF__) {
			this.applyCalendarDay(b, this.calendar.getByInternalId(b.__COPYOF__))
		} else {
			b.unjoin(b.stores[0]);
			a.push(b)
		}
	},
	applyChanges: function() {
		var e = this;
		var f = this.calendar;
		var d = this.down('combobox[name="cmb_parentCalendar"]').getValue();
		f.suspendEvents(true);
		f.suspendCacheUpdate++;
		f.setParent(d ? Gnt.data.Calendar.getCalendar(d) : null);
		f.proxy.extraParams.calendarId = f.calendarId;
		Gnt.util.Data.applyCloneChanges(this.dayOverridesCalendar, f);
		var b = [];
		var a = [];
		var c = {};
		this.weekOverridesStore.each(function(g) {
			Ext.Array.each(g.get("weekAvailability").concat(g.get("mainDay")),
			function(h) {
				if (h) {
					if (h.__COPYOF__) {
						c[h.__COPYOF__] = true
					}
					e.applySingleDay(h, b)
				}
			})
		});
		f.forEachNonStandardWeek(function(g) {
			Ext.Array.each(g.weekAvailability.concat(g.mainDay),
			function(h) {
				if (h && !c[h.internalId]) {
					a.push(h)
				}
			})
		});
		f.add(b);
		f.remove(a);
		f.suspendCacheUpdate--;
		f.resumeEvents();
		f.clearCache()
	}
});
Ext.define("Gnt.widget.calendar.CalendarWindow", {
	extend: "Ext.window.Window",
	requires: ["Gnt.widget.calendar.Calendar"],
	mixins: ["Gnt.mixin.Localizable"],
	alias: "widget.calendarwindow",
	calendarConfig: null,
	calendar: null,
	calendarWidget: null,
	initComponent: function() {
		Ext.apply(this, {
			width: 600,
			layout: "fit",
			items: this.calendarWidget = new Gnt.widget.calendar.Calendar(Ext.apply({
				calendar: this.calendar
			},
			this.calendarConfig)),
			buttons: [{
				text: this.L("ok"),
				handler: function() {
					this.applyChanges();
					this.close()
				},
				scope: this
			},
			{
				text: this.L("cancel"),
				handler: this.close,
				scope: this
			}]
		});
		this.callParent(arguments)
	},
	applyChanges: function() {
		this.calendarWidget.applyChanges()
	}
});
Ext.data.Connection.override({
	parseStatus: function(b) {
		var a = this.callOverridden(arguments);
		if (b === 0) {
			a.success = true
		}
		return a
	}
});