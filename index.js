const puppeteer = require("puppeteer");
require('dotenv').config();


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
    await page.type('#emailAddress', process.env.BCS_LOGIN);
    await page.type('#password', process.env.BCS_PASSWORD);

    // We then want to hit the submit button
    await page.keyboard.press('Enter');

    await page.waitForNavigation();
    console.log('New Page URL:', page.url());
    
    // Herre we wait until we know the home screen is loded because the element can be found ".card-title-month"
    await page.waitFor('.card-title-month'); 

    // Now that we know we are in, we navigate to sessions url
    await page.goto(checkin_url);

    console.log("Navigating to checkin url... waiting for page loaded");

    await page.waitFor('.card-title-time');

    console.log("Page loaded!  Now to find 'Check In To Class'");

    const [button] = await page.$x("//a[contains(., ' Check In To Class')]");
    if (button) {
        console.log("Found check in!, Clicking that SHIZZ!");
        await button.click();
    }
    else
    {
        console.log("Could not find Button!");
    }

    // WE DONE!!
    await browser.close();

    
  })();