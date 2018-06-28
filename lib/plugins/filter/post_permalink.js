'use strict';

const _ = require('lodash');
const util = require('hexo-util');
const pathFn = require('path');
const moment = require('moment-timezone');
const Permalink = util.Permalink;
let permalink;

function postPermalinkFilter(data) {
  const config = this.config;
  let m = moment(data.date);
  if (config.timezone) {
    m = m.tz(config.timezone);
  }
  const meta = {
    id: data.id || data._id,
    title: data.slug,
    name: typeof data.slug === 'string' ? pathFn.basename(data.slug) : '',
    post_title: util.slugize(data.title, {transform: 1}),
    year: m.format('YYYY'),
    month: m.format('MM'),
    day: m.format('DD'),
    i_month: m.format('M'),
    i_day: m.format('D')
  };

  if (!permalink || permalink.rule !== config.permalink) {
    permalink = new Permalink(config.permalink);
  }

  const categories = data.categories;

  if (categories.length) {
    meta.category = categories.last().slug;
  } else {
    meta.category = config.default_category;
  }

  const keys = Object.keys(data);
  let key = '';

  for (let i = 0, len = keys.length; i < len; i++) {
    key = keys[i];
    if (meta.hasOwnProperty(key)) continue;

    // Use Object.getOwnPropertyDescriptor to copy getters to avoid "Maximum call
    // stack size exceeded" error
    Object.defineProperty(meta, key, Object.getOwnPropertyDescriptor(data, key));
  }

  return permalink.stringify(_.defaults(meta, config.permalink_defaults));
}

module.exports = postPermalinkFilter;
