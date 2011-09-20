var cl = require('./node-clucene').CLucene;
var lucene = new cl.Lucene();
var doc = new cl.Document();



function find(query){
  lucene.search('./index', query, function(err, results, searchTime){
    console.log(results);
  });
}


find('_type:nerdout');

