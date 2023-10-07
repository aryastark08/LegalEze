// const fs = require("fs");
// const { response } = require("./server.js");

// // Function to fetch and store simplified text data
// async function fetchAndStoreSimplifiedText() {
//   const textToProcess = response;
//   console.log(textToProcess);

//   try {
//     const simplifiedText = await processTextWithPaLM(textToProcess);

//     const dataToStore = {
//       response,
//       timestamp: new Date(),
//     };
//     console.log(dataToStore);

//     const jsonData = JSON.stringify(dataToStore, null, 2);

//     fs.writeFileSync("result.js", `module.exports = ${jsonData};`, "utf-8");

//     console.log("Simplified text data stored in result.js");
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

// fetchAndStoreSimplifiedText();
