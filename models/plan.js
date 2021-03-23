const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const domPurifier = require('dompurify');
const { JSDOM } = require('jsdom');
const htmlPurify = domPurifier(new JSDOM().window);

const stripHtml = require('string-strip-html');

//initialize slug
mongoose.plugin(slug);
const planSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  plan_description: {
    type: String,
  },
  timeCreated: {
    type: Date,
    default: () => Date.now(),
  },
  snippet: {
    type: String,
  },
  img: {
    type: String,
    default: 'placeholder.jpg',
  },
  slug: { type: String, slug: 'title', unique: true, slug_padding_size: 2 },
});

planSchema.pre('validate', function (next) {
  //check if there is a description
  if (this.plan_description) {
    this.plan_description = htmlPurify.sanitize(this.plan_description);
    this.snippet = stripHtml.stripHtml(this.plan_description.substring(0, 200)).result;
  }

  next();
});

module.exports = mongoose.model('Plan', planSchema);