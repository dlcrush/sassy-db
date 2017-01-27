var _ = require('lodash');
var css = require('css');
var path = require('path');
var sass = require('node-sass');
var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:9000",
  accessKeyId: 123232323,
  secretAccessKey: 123123213123,
});

var dynamodb = new AWS.DynamoDB();

/*
var params = {
    TableName : "Movies",
    KeySchema: [
        { AttributeName: "year", KeyType: "HASH"},  //Partition key
        { AttributeName: "title", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "year", AttributeType: "N" },
        { AttributeName: "title", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});*/

var docClient = new AWS.DynamoDB.DocumentClient();

/*
var allMovies = [{year: 2016, title: "Why Him?", info: "good movie"}, {year: 2015, title: "Something", info: 'not very good'}];
allMovies.forEach(function(movie) {
    var params = {
        TableName: "Movies",
        Item: {
            "year":  movie.year,
            "title": movie.title,
            "info":  movie.info
        }
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add movie", movie.title, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", movie.title);
       }
    });
});
*/

var params = {
    TableName : "Movies",
    KeyConditionExpression: "#yr = :yyyy",
    ExpressionAttributeNames:{
        "#yr": "year"
    },
    ExpressionAttributeValues: {
        ":yyyy":2016
    }
};

docClient.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log(" -", item.year + ": " + item.title);
        });
    }
});

var MODULE_TOKEN = '$SASSY-DB$: ';

var runSass = function (options, describe, it) {
  var sassPath = path.join(__dirname, '..', 'sass');
  if (options.includePaths) {
    options.includePaths.push(sassPath);
  } else {
    options.includePaths = [sassPath];
  }
  var css = sass.renderSync(options).css.toString();
  var modules = parse(css);

  console.log('css', css);
  console.log('modules', modules);

  /*
  _.each(modules, function (module) {
    describeModule(module, describe, it);
  });*/
};

var parseModule = module.exports.parseModule = function (rule, ctx) {
  console.log('rule', rule);
  return rule;

  if (rule.type === 'comment') {
    var text = rule.comment.trim();
    if (startsWith(text, MODULE_TOKEN)) {
      console.log('hello');
      console.log('text', text);
    }
  }
  /*
  if (rule.type === 'charset') { return parseModule; }
  if (rule.type === 'comment') {
    var text = rule.comment.trim();
    if (!text) { return parseModule; }
    if (startsWith(text, MODULE_TOKEN)) {
      finishCurrentModule(ctx);
      ctx.currentModule = { module: text.substring(MODULE_TOKEN.length), tests: [] };
      return parseTest;
    }
    if (startsWith(text, SUMMARY_TOKEN)) {
      return ignoreUntilEndSummary;
    }
    // ignore un-recognized comments, keep looking for module header.
    return parseModule;
  }
  throw parseError('Unexpected rule type "' + rule.type + '"', 'module header', rule.position);
  */

  return '';
}

var parse = module.exports.parse = function (rawCss) {
  var ast = css.parse(rawCss);
  console.log('ast', ast);
  var ctx = { modules: [] };
  var handler = parseModule;

  /*_.each(ast.stylesheet.rules, function (rule) {
    handler = handler(rule, ctx);
  });*/

  //finishCurrentModule(ctx);

  return ctx.modules;
};

var sassFile = path.join(__dirname, '..', 'sass/test.scss');
runSass({file: sassFile});
