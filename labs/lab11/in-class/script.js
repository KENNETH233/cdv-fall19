import currentBox from "./leonScroller.js";
// imports just one function from a different file
// more info, import: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
// more info, export: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export


// we don't hardcode w and h this time
// but keep them responsive
// (see adjustVizHeight and resized function
// that are defined at the bottom)
let w, h;
let heightRatio = 1;
let padding = 90;

let viz = d3.select("#visualization")
    .append("svg")
  .style("background-color", "lavender")
;
// function to adjust viz height dynamically
// in order to keep the heightRatio at any given
// width of the browser window
// (function definition at the bottom)
adjustVizHeight();


// your script starts here, e.g. load data here.
d3.tsv("translatedbooks.tsv").then(function(books){
  // console.log(books);
  books = formatData(books);
  books = books.filter(b=>b.country=="Germany");
  books.map(b=>{
    b.fullname = b["auth-first"] + " " + b["auth-last"]
  })
  console.log(books[28]);
  let booksByAuthor = d3.nest().key(b=>b.fullname).entries(books);
  console.log(booksByAuthor.sort((b,bb)=>b.values.length-bb.values.length));
})



// scrolling event listener
// you might move this block into the part of your code
// in which your data is loaded/available
let previousSection;
d3.select("#textboxes").on("scroll", function(){

  // the currentBox function is imported on the
  // very fist line of this script
  currentBox(function(box){
    console.log(box.id);

    if(box.id=="two" && box.id!=previousSection){
      console.log("changing viz");
      // trigger a new transition
      previousSection = box.id;
    }


  })


})







// function to adjust viz height dynamically
// in order to keep the heightRatio at any given
// width of the browser window
function adjustVizHeight(){
  viz.style("height", function(){

    w = parseInt(viz.style("width"), 10);
    h = w*heightRatio;
    return h;

  })
}
function resized(){
  adjustVizHeight()
}
window.addEventListener("resize", resized);


var parseTime = d3.timeParse("%b,%Y");
function formatData(indata){
  return indata.map((d)=>{
      // add proper date objects to our data
      d.parsedDate = parseTime(d["pubdate mo"] + "," + d["pubdate yr"]);
      return d
  }).filter(d=>{
    // making sure both date and isbn number are given
    // i am using the isbn number to uniquely identify the data points
    return d.parsedDate!=null&&!isNaN(d.isbn)
  })
  .reduce((acc,d)=>{
    // I noticed the data lists some isbn numbers twice
    // here i clean duplicates out
    // this is not ideal, the cruelty of data cleaning
    if(acc.findIndex(a=>a.isbn==d.isbn)==-1){
      acc.push(d);
    }
    return acc
  }, [])
}
