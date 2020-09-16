const puppeteer = require("puppeteer");
require("dotenv").config();

const login_url = "https://www.bootcampspot.com/login";
const checkin_url = "https://www.bootcampspot.com/sessions";

(async () => {
  // Initialize browser
  const browser = await puppeteer.launch({ headless: false });
  // Start a new page
  const page = await browser.newPage();
  console.log("Browser Started!");

  await page.goto(login_url);
  console.log("Navigating to: " + login_url);

  // We want to wait for the boxes to actually apear
  await page.waitFor("input[name=emailAddress]");

  // Now that we know the input boxes are there, we need to set their data
  await page.type("#emailAddress", process.env.BCS_LOGIN);
  await page.type("#password", process.env.BCS_PASSWORD);

  // We then want to hit the submit button
  await page.keyboard.press("Enter");

  await page.waitForNavigation();
  console.log("New Page URL:", page.url());

  // Herre we wait until we know the home screen is loded because the element can be found ".card-title-month"
  await page.waitFor(".card-title-month");

  // Now that we know we are in, we navigate to sessions url
  await page.goto(checkin_url);

  console.log("Navigating to checkin url... waiting for page loaded");

  await page.waitFor(".card-title-time");

  await page.evaluate(() => {
    let elements = document.querySelectorAll(".card-footer-list");
    
    
    console.log(`Found ${elements.length} elements matching search`);
    for (i = 0; i < elements.length; i++) {
      elements[i].setAttribute("style", "background: bisque;");
      let firstChild = elements[i].lastChild;
      console.log("Found element: ", firstChild);
      console.log("InnerHTML", firstChild.innerHTML);
      if (elements[i].hasChildNodes()) {
        let children = firstChild.childNodes;
        console.log(`Children present in this element are ${children.length}`);
        for (let j = 0; j < children.length; j++) {
          children[j].setAttribute("style", "background: deepskyblue;");
          console.log("Child: ", children[j].innerHTML);
          console.log(
            "To String:",
            children[j].innerHTML.includes("Check In To Class")
          );
          if (children[j].innerHTML.includes("Check In To Class")) {
            console.log("FOUND IT");
            children[j].setAttribute("style", "background: red;");
            children[j].setAttribute("id", "Clicky");
            
          }
        }
      }
      // const children = await elements[i].evaluateHandle((e) =>{
      //     console.log(e.children);
      // });
      // console.log("Children:", children);
      // $(elements[i]).click();
    }
    return 0;
  });


  const button = await page.$("#Clicky");
  if (button) {
    console.log("Found check in!, Clicking that SHIZZ!");
    await button.click();
  } else {
    console.log("Could not find Button!, We are on page ", page.url());
  }

  // WE DONE!!
  await browser.close();
})();
