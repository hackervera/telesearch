var cl = require('./node-clucene').CLucene;

var doc = new cl.Document();
var docId = '1';
//doc.addField('name', 'Eric Jennings', cl.STORE_YES|cl.INDEX_TOKENIZED);
//doc.addField('timestamp', 'Eric Jennings', cl.STORE_YES|cl.INDEX_UNTOKENIZED);


function addDoc(docId, doc){
  var lucene = new cl.Lucene();
  lucene.addDocument(docId, doc, './index', function(err, indexTime) {
          if (err) {
                  console.log('Error indexing document: ' + err);
          }
  
          console.log('Indexed document in ' + indexTime + ' ms');
  
  
  });
}

function addEvent(eventName, eventType, eventDescrip){
  setTimeout(function(){
    var event = new cl.Document();
    event.addField('name', eventName, cl.STORE_YES|cl.INDEX_TOKENIZED);
    event.addField('_type',eventType, cl.STORE_YES|cl.INDEX_UNTOKENIZED);
    event.addField('description', eventDescrip, cl.STORE_YES|cl.INDEX_TOKENIZED);
    addDoc(eventName, event);
  },500);
}


addEvent('friday party', 'party', 'partyin, partyin, partyin, yeah');

addEvent('pool party','party', 'bring your own floaty');


addEvent('tylers birthday', 'party', 'come celebrate tylers birthday. be sure to bring cake beotches');


addEvent("heather appreciation day",'party', 'come celebrate the awesomeness that is heather');


addEvent("cypherpunk meetup",'meetup',"come hang out with other cypherpunks @ 322 NW 6th Avenue, Suite 200, Portland, OR");


addEvent("sepoconi",'usergroup',"come hang out with the cool kids at sidedoor on wednesday nights ping #pdxwebdev for more info");


addEvent("backspace nerdout",'nerdout',"come hang out with the cool kids at backspace");


