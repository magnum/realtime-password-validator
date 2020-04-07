(function (global, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], function ($) {
      return factory($, global, global.document);
    });
  } else if (typeof exports === "object" && exports) {
    module.exports = factory(require('jquery'), global, global.document);
  } else {
    factory(jQuery, global, global.document);
  }
})(typeof window !== 'undefined' ? window : this, function ($, window, document, undefined) {
  'use strict';

  const pluginName = 'realtimePasswordValidator';
  const defaultSettings = {
    debug: false
  };;

  const $window = $(window);
  const $document = $(document);

  const p = {}; p[pluginName] = class {
    constructor(element, settings) {
      this.element = element;
      this.settings = $.extend({}, defaultSettings, settings);
      this._defaultSettings = defaultSettings;
      this.init();
    }

    init() {
      this.settings.input1.on("input", { self: this }, this.validateEvent);
      this.settings.input2.on("input", { self: this }, this.validateEvent);
    }

    validateEvent(event) {
      const self = event.data.self;
      const messages = [];
      let valid_count = 0;
      $(self.element).empty();
      $(self.settings.validators).each(function (index, validator) {
        let valid = false;
        if (validator.regexp)
          valid = new RegExp(validator.regexp).test(self.settings.input1.val());
        if (validator.compare)
          valid = self.settings.input1.val() == $(self.settings.input2).val();
        const message = $("<div>" + validator.message + "</div>");
        message.addClass(valid ? "valid" : "invalid");
        if (self.settings.input1.val().length > 0)
          $(self.element).append(message);
        if (valid) valid_count++;
        if (this.debug) console.log(
          index,
          self.settings.input1.val(),
          validator.message,
          valid
        );
      });
      if (valid_count == self.settings.validators.length) {
        if (self.settings.ok) self.settings.ok(self);
      } else {
        if (self.settings.ko) self.settings.ko(self);
      }
      if (this.debug) console.log("valid", valid_count, "of", self.settings.validators.length);
    }
  }

  // -- Prevent multiple instantiations
  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new p[pluginName](this, options));
      }
    });
  };
});
