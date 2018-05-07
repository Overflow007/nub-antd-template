export function isUndef(v) {
	return v === undefined || v === null
}

export function isDef(v) {
	return v !== undefined && v !== null
}

export function isTrue(v) {
	return v === true
}

export function isFalse(v) {
	return v === false
}
/**
 * Check if value is primitive
 */
export function isPrimitive(value) {
	return typeof value === 'string' || typeof value === 'number'
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
export function isObject(obj) {
	return obj !== null && typeof obj === 'object'
}

const _toString = Object.prototype.toString;

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
export function isPlainObject(obj) {
	return _toString.call(obj) === '[object Object]'
}

export function isRegExp(v) {
	return _toString.call(v) === '[object RegExp]'
}

export function isNative(v) {
	return typeof v === 'function' && /native code/.test(v.toString())
}

export const inBrowser = typeof window !== 'undefined'
export const UA = inBrowser && window.navigator.userAgent.toLowerCase()
export const isIE = UA && /msie|trident/.test(UA)
export const isIE9 = UA && UA.indexOf('msie 9.0') > 0
export const isEdge = UA && UA.indexOf('edge/') > 0
export const isAndroid = UA && UA.indexOf('android') > 0
export const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA)
export const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge