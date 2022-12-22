 
let compile = document.getElementById("compile");
let langid = document.getElementById("langid");
let code = document.getElementById("code");

function readData() {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", `https://codequotient.com/api/executeCode/`);
  xhr.setRequestHeader("Content-Type", "application/json");
  //   xhr.onload = () => {
  //     console.log(xhr.response);
  //   };
  //   console.log(code);
  const data = { code: code.value, langId: langid.value };
  //   console.log(data);

  xhr.send(JSON.stringify(data));
  xhr.onload = () => {
    // console.log(JSON.parse(xhr.response));
    response = JSON.parse(xhr.response);
    if(!response.codeId){
      alert("code cannot be null")
    }
    else {
    readResponse(response.codeId);
    }
  };
}
 function readResponse(codeId)
{
 setTimeout(()=> 
{let  xhrg = new XMLHttpRequest();
    xhrg.open(
      "GET",
      `https://codequotient.com/api/codeResult/${codeId}`
    );
      xhrg.setRequestHeader("Content-Type", "application/json");

      // console.log(codeId);
    
   xhrg.onload = () => {
      // console.log(JSON.parse(xhrg.response))
          // console.log("pahucah")

          let responsedData =JSON.parse(JSON.parse(xhrg.response).data);
          console.log(responsedData)
          if(responsedData.errors==""){
            createOutput(responsedData.output);

          }
          else {
            createOutput(responsedData.errors)
          }
    };    
xhrg.send();},6000);
}
function createOutput(value){
let output=document.getElementById("output");
output.innerHTML="";
output.innerHTML=`${value}`

}
compile.addEventListener("click", readData);
