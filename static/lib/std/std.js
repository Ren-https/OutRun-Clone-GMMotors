var std = {};

std.URLSearchParams = new URLSearchParams(window.location.search);

std.find = function (container, pred, def) {
  for (var idx in container) {
    var e = container[idx];
    if (pred(e)) {
      return e;
    }
  }
  return def;
};

std.is_null = function (o) {
  return o == undefined || o == null;
};

std.is_array = function (a) {
  return a.constructor === Array;
};

std.is_function = function (o) {
  return typeof o === "function";
};

std.is_object = function (o) {
  return typeof o === "object" && !std.is_null(o) && !std.is_function(o);
};

std.some_null = function () {
  for (var i in arguments) {
    if (std.is_null(arguments[i])) {
      return true;
    }
  }
  return false;
};

std.ensure = function (map, key, def) {
  var result = map[key];
  if (std.is_null(result)) {
    map[key] = def;
    result = map[key];
  }
  return result;
}


std.reduce = function (container, foo, init) {
  var result = init;
  if (!std.is_null(container) && std.is_function(foo)) {
    if (std.is_array(container)) {
      for (const i in container) {
        var el = container[i];
        result = foo(result, el);
      }
    }
    else if (std.is_object(container)) {
      for (const entry of Object.entries(container)) {
        result = foo(result, entry);
      }
    } else {
      result = foo(init, container);
    }
  }
  return result;
};

std.it = function (c) {
  return {
    container: c,
    idx: 0,
    get: function () {
      return this.container[this.idx]
    },
    next: function () {
      this.idx++;
      return this.get();
    },
    end: function () {
      return std.is_null(this.container) || this.idx >= this.container.length;
    },
  }
}



std.get_parameter = function (parameterName) {
  return std.URLSearchParams.get(parameterName);
};

std.each = function (container, foo) {

  if (!std.is_null(container) && std.is_function(foo)) {
    if (std.is_array(container)) {
      container.forEach(foo);
    }
    else if (std.is_object(container)) {
      for (const [key, value] of Object.entries(object)) {
        foo(value, key)
      }
    } else {
      foo(container);
    }
  }
};

std.each_if = function (container, foo, pred) {

}



//g.accumulatorAnswer.forEach((e) => { var score = std.ensure(m, e.score,{count:0} ); ++score.count; })
//std.reduce(m,(a,b) => {return a[1].count < b[1].count ? b : (a[0] < a[1] ?  b  :  a ); } ,['',{count:0 }] );
/* std.reduce(g.mapScore,(a,b) => {
  return a[1].count < b[1].count ? b :
      (a[1].count > b[1].count ? a :(a[0] == b[0] ?  b  :  a )); } ,['',{count:0 }]
        ); */