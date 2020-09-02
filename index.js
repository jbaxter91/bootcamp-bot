const puppeteer = require("puppeteer");
require('dotenv').config();

const LOGIN = "";
const PASSWORD = "";

const login_url = "https://www.bootcampspot.com/login";
const checkin_url = "https://www.bootcampspot.com/sessions";

(async () => {
    // Initialize browser
    const browser = await puppeteer.launch();
    // Start a new page
    const page = await browser.newPage();
    console.log("Browser Started!");
  
    await page.goto(login_url);
    console.log("Navigating to: " + login_url);

    // We want to wait for the boxes to actually apear
    await page.waitFor('input[name=emailAddress]');

    // Now that we know the input boxes are there, we need to set their data
    await page.type('#emailAddress', LOGIN);
    await page.type('#password', PASSWORD);

    // We then want to hit the submit button
    await page.keyboard.press('Enter');

    await page.waitForNavigation();
    console.log('New Page URL:', page.url());
    
    // Herre we wait until we know the home screen is loded because the element can be found ".card-title-month"
    await page.waitFor('.card-title-month');

    // Now that we know we are in, we navigate to sessions url
    await page.goto(checkin_url);

    // We then want to start a loop looking for the text "Check in to class"
    // if its not there then we wait
    // If it is there we select it and click it
    // TADA! we done!

    setTimeout( async ()=> 
    {
        // Displays the current html of page
        moreContent = await page.evaluate(() => document.body.innerText);
        console.log(moreContent);
        console.log('New Page URL:', page.url());
        await browser.close();

    }, 3000);

    
  })();