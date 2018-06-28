'use strict';

const Pattern = require('hexo-util').Pattern;
const moment = require('moment-timezone');
const minimatch = require('minimatch');
const _ = require('lodash');

function isTmpFile(path) {
  const last = path[path.length - 1];
  return last === '%' || last === '~';
}

function isHiddenFile(path) {
  return /(^|\/)[_\.]/.test(path); // eslint-disable-line no-useless-escape
}

exports.ignoreTmpAndHiddenFile = new Pattern(path => {
  if (isTmpFile(path) || isHiddenFile(path)) return false;
  return true;
});

exports.isTmpFile = isTmpFile;
exports.isHiddenFile = isHiddenFile;

exports.parseDate = (date, timezone) => {
  if (!date || moment.isMoment(date)) return date;

  if (!(date instanceof Date)) {
    if (timezone) {
      date = moment.tz(date, timezone).toDate();
    } else {
      date = new Date(date);
    }
  }

  if (isNaN(date.getTime())) return;

  return date;
};

exports.isMatch = (path, patterns) => {
  if (!patterns) return false;
  if (!Array.isArray(patterns)) patterns = [patterns];

  patterns = _.compact(patterns);
  if (!patterns.length) return false;

  for (let i = 0, len = patterns.length; i < len; i++) {
    if (minimatch(path, patterns[i])) return true;
  }

  return false;
};
